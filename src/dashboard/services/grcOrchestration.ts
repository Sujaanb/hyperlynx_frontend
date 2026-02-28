import { hyperlynxApi } from './hyperlynxApi';

interface PopulationResult {
  started: boolean;
  reason?: string;
  enabledFrameworks: number;
  documentsAnalyzed: number;
  controlLibraryItems: number;
  applicabilityCompleted: boolean;
}

function normalize(value: string) {
  return (value || '').trim().toLowerCase();
}

const APPLICABILITY_TO_FRAMEWORK_ALIASES: Record<string, string[]> = {
  gdpr: ['gdpr', 'general data protection regulation'],
  nis2: ['nis2', 'network and information systems directive 2'],
  dora: ['dora', 'digital operational resilience act'],
  uk_cyber_bill: ['uk cyber security and resilience bill', 'cyber security and resilience bill'],
  uk_gdpr: ['uk gdpr', 'data protection act 2018'],
  pci_dss: ['pci dss', 'payment card industry data security standard'],
  iso27001: ['iso/iec 27001', 'iso 27001', 'iso27001'],
  nist_csf: ['nist cybersecurity framework', 'nist csf', 'nist-csf-2.0'],
  fca_rules: ['fca cybersecurity rules', 'fca', 'sysc'],
  pra_rules: ['pra cybersecurity fundamental rules', 'pra'],
  cra: ['cyber resilience act', 'cra'],
  cyber_essentials: ['cyber essentials'],
  eidas: ['eidas 2', 'eidas'],
  sox: ['sox', 'sarbanes-oxley'],
  basel3: ['basel iii', 'basel iv', 'basel3'],
  nis1_uk_original: ['nis regulations 2018', 'uk nis', 'nis1'],
};

function resolveFrameworkId(
  frameworkCatalog: Array<{ id: string; name: string; ref_id?: string }>,
  recs: Array<{ framework_id: string; framework_name: string }>,
  applicabilityKey: string
) {
  const aliases = APPLICABILITY_TO_FRAMEWORK_ALIASES[applicabilityKey] || [applicabilityKey];
  const normalizedAliases = aliases.map((alias) => normalize(alias));

  const fromCatalog = frameworkCatalog.find((framework) => {
    const id = normalize(framework.id);
    const refId = normalize(framework.ref_id || '');
    const name = normalize(framework.name);
    return normalizedAliases.some((alias) => id.includes(alias) || refId.includes(alias) || name.includes(alias));
  });
  if (fromCatalog) {
    return { framework_id: fromCatalog.id, framework_name: fromCatalog.name };
  }

  const fromRecommendations = recs.find((framework) => {
    const id = normalize(framework.framework_id);
    const name = normalize(framework.framework_name);
    return normalizedAliases.some((alias) => id.includes(alias) || name.includes(alias));
  });
  if (fromRecommendations) {
    return fromRecommendations;
  }

  return null;
}

export async function runIntelligencePopulation(): Promise<PopulationResult> {
  const [documents, frameworkLibraries, controls, frameworkCatalog, questionnaire] = await Promise.all([
    hyperlynxApi.getDocuments().catch(() => ({ count: 0, results: [] as Array<{ id: number; filename: string }> })),
    hyperlynxApi.listFrameworkLibraries().catch(() => ({ data: [] as Array<{ filename: string; name: string; size: number }> })),
    hyperlynxApi.getControls().catch(() => ({ count: 0, results: [] as Array<Record<string, unknown>> })),
    hyperlynxApi.getFrameworks().catch(() => ({ count: 0, results: [] as Array<{ id: string; name: string; ref_id: string }> })),
    hyperlynxApi
      .getIntelligenceQuestionnaire()
      .catch(() => ({ results: [] as Array<{ key: string; question: string; weight: number; answer?: string }> })),
  ]);

  const answeredCount = (questionnaire.results || []).filter((row) => !!normalize(row.answer || '')).length;
  const applicabilityCompleted = answeredCount >= 3;

  if (!documents.results.length) {
    return {
      started: false,
      reason: 'Upload policy documents first, then click Analyze to populate all dashboard modules.',
      enabledFrameworks: 0,
      documentsAnalyzed: 0,
      controlLibraryItems: controls.count || controls.results.length,
      applicabilityCompleted,
    };
  }

  hyperlynxApi.markDashboardSeeded(true);

  const recommendation = await hyperlynxApi.getFrameworkRecommendation();
  const aiRecommendedFrameworks =
    (recommendation.recommended_frameworks || []).length > 0
      ? recommendation.recommended_frameworks
      : (frameworkCatalog.results || []).slice(0, 3).map((framework) => ({ framework_id: framework.id, framework_name: framework.name }));

  const applicabilitySelections = hyperlynxApi.getApplicabilityFrameworkSelections();
  const mandatoryFromApplicability = (applicabilitySelections.applicable || [])
    .map((key) => resolveFrameworkId(frameworkCatalog.results || [], aiRecommendedFrameworks, key))
    .filter((item): item is { framework_id: string; framework_name: string } => Boolean(item));
  const optionalFromApplicability = (applicabilitySelections.optional || [])
    .map((key) => resolveFrameworkId(frameworkCatalog.results || [], aiRecommendedFrameworks, key))
    .filter((item): item is { framework_id: string; framework_name: string } => Boolean(item));

  const seenPriority = new Set<string>();
  const recommendedFrameworks = [...mandatoryFromApplicability, ...optionalFromApplicability, ...aiRecommendedFrameworks].filter(
    (framework) => {
      const key = `${normalize(framework.framework_id)}::${normalize(framework.framework_name)}`;
      if (seenPriority.has(key)) return false;
      seenPriority.add(key);
      return true;
    }
  );

  await hyperlynxApi.analyzeCompany().catch(() => ({}));
  const docsIntel = await hyperlynxApi.analyzeDocumentsIntelligence(documents.results.map((d) => d.id));

  const libraryNames = new Set((frameworkLibraries.data || []).map((f) => normalize(f.name)));
  const catalogByName = new Map(
    (frameworkCatalog.results || []).map((f) => [normalize(f.name), f.id] as const)
  );

  let enabledFrameworks = 0;
  for (const rec of recommendedFrameworks) {
    const recName = normalize(rec.framework_name);
    const recId = rec.framework_id;

    const inLibrary = libraryNames.has(recName);
    const catalogId = catalogByName.get(recName) || recId;

    if (!catalogId) continue;
    if (!inLibrary && !frameworkCatalog.results.some((row) => normalize(row.id) === normalize(catalogId))) {
      continue;
    }

    try {
      await hyperlynxApi.enableFramework(catalogId);
      enabledFrameworks += 1;
    } catch {
      // ignore duplicates/conflicts
    }
  }

  await hyperlynxApi.runIntelligenceGapAnalysis();

  const [currentAssets, currentRisks, aiRiskSet] = await Promise.all([
    hyperlynxApi.getAssets().catch(() => ({ count: 0, results: [] as Array<{ id: number; name: string; asset_type: string; criticality: number }> })),
    hyperlynxApi.getRisks().catch(() => ({ count: 0, results: [] as Array<{ id: number; title?: string; name?: string }> })),
    hyperlynxApi.runIntelligenceRiskAssessment().catch(() => ({ count: 0, results: [] as Array<{ name: string; framework?: string; likelihood: number; impact: number }> })),
  ]);

  if ((currentAssets.results || []).length === 0) {
    await Promise.all([
      hyperlynxApi.createAsset({ name: 'Identity Provider', asset_type: 'infrastructure', criticality: 5, owner: 'Security Team' }),
      hyperlynxApi.createAsset({ name: 'Customer Data Platform', asset_type: 'application', criticality: 5, owner: 'Data Team' }),
      hyperlynxApi.createAsset({ name: 'Cloud Workload Stack', asset_type: 'infrastructure', criticality: 4, owner: 'Platform Team' }),
    ]).catch(() => undefined);
  }

  const existingRiskNames = new Set(
    (currentRisks.results || [])
      .map((risk) => normalize(String((risk as Record<string, unknown>).title || (risk as Record<string, unknown>).name || '')))
      .filter(Boolean)
  );

  for (const generatedRisk of aiRiskSet.results || []) {
    const riskName = normalize(generatedRisk.name || '');
    if (!riskName || existingRiskNames.has(riskName)) continue;

    try {
      await hyperlynxApi.createRisk({
        name: generatedRisk.name,
        framework: generatedRisk.framework,
        description: `AI-derived risk from gap analysis for ${generatedRisk.framework || 'selected frameworks'}.`,
        likelihood: generatedRisk.likelihood,
        impact: generatedRisk.impact,
        status: 'open',
      });
      existingRiskNames.add(riskName);
    } catch {
      // ignore duplicate/validation errors
    }
  }

  if ((aiRiskSet.results || []).length === 0 && existingRiskNames.size === 0) {
    const fallbackRisks = [
      { name: 'Credential compromise via phishing', framework: 'ISO-27001', likelihood: 4, impact: 5 },
      { name: 'Incident response readiness gap', framework: 'NIST-CSF-2.0', likelihood: 4, impact: 4 },
      { name: 'Third-party risk monitoring gap', framework: 'NIS2', likelihood: 3, impact: 4 },
    ];

    for (const risk of fallbackRisks) {
      try {
        await hyperlynxApi.createRisk({
          name: risk.name,
          framework: risk.framework,
          description: `Auto-generated fallback risk for ${risk.framework}.`,
          likelihood: risk.likelihood,
          impact: risk.impact,
          status: 'open',
        });
      } catch {
        // ignore duplicates/validation errors
      }
    }
  }

  await hyperlynxApi.generateIntelligenceActionPlan();
  await hyperlynxApi.generateReport('compliance-summary').catch(() => undefined);
  await hyperlynxApi.generateReport('gap-analysis').catch(() => undefined);

  return {
    started: true,
    enabledFrameworks,
    documentsAnalyzed: docsIntel.documents_analyzed || documents.results.length,
    controlLibraryItems: controls.count || controls.results.length,
    applicabilityCompleted,
  };
}
