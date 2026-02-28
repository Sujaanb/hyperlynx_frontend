import React, { useEffect, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

type FrameworkRow = {
  id: string;
  name: string;
  ref_id?: string;
  enableId?: string;
  source: 'backend' | 'library';
  canEnable: boolean;
};

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

const FRAMEWORK_INFO: Record<string, { description: string; focus: string[] }> = {
  gdpr: {
    description: 'EU data protection regulation for processing personal data of EU residents.',
    focus: ['Data subject rights', 'Lawful processing basis', 'Breach notification within 72 hours'],
  },
  nis2: {
    description: 'EU cybersecurity requirements for essential and important entities.',
    focus: ['Incident reporting', 'Governance accountability', 'Supply chain security'],
  },
  dora: {
    description: 'EU digital operational resilience framework for financial entities and ICT providers.',
    focus: ['ICT risk management', 'Resilience testing', 'Third-party risk controls'],
  },
  iso27001: {
    description: 'International ISMS standard for systematic information security controls.',
    focus: ['ISMS governance', 'Risk treatment plan', 'Internal and external audits'],
  },
  nist_csf: {
    description: 'Cybersecurity risk management framework with Govern-Identify-Protect-Detect-Respond-Recover.',
    focus: ['Risk governance', 'Detection and response capability', 'Continuous improvement'],
  },
};

function normalize(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

export function GrcFrameworkAdvisor() {
  const [frameworks, setFrameworks] = useState<FrameworkRow[]>([]);
  const [recommended, setRecommended] = useState<Array<{ framework_id: string; framework_name: string }>>([]);
  const [applicableKeys, setApplicableKeys] = useState<string[]>([]);
  const [optionalKeys, setOptionalKeys] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<Set<string>>(new Set());
  const [selectedFrameworkId, setSelectedFrameworkId] = useState('');
  const [selectedFrameworkForDetails, setSelectedFrameworkForDetails] = useState<FrameworkRow | null>(null);
  const [libraryFrameworkCount, setLibraryFrameworkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [allFrameworks, recs, status, frameworkLibraryList, libraries] = await Promise.all([
        hyperlynxApi.getFrameworks().catch(() => ({ count: 0, results: [] as Array<{ id: string; name: string; ref_id: string }> })),
        hyperlynxApi.getRecommendedFrameworks().catch(() => ({ count: 0, results: [] as Array<{ framework_id: string; framework_name: string }> })),
        hyperlynxApi.getFrameworkStatus().catch(() => ({ count: 0, results: [] as Array<Record<string, unknown>> })),
        hyperlynxApi.listFrameworkLibraries().catch(() => ({ count: 0, data: [] as Array<{ filename: string; name: string; size: number }> })),
        hyperlynxApi.listStoredLibraries({ limit: 300, objectType: 'framework' }).catch(() => ({ count: 0, results: [] as Array<{ id: string; urn: string; ref_id?: string; name: string }> })),
      ]);

      const backendRows: FrameworkRow[] = (allFrameworks.results || []).map((fw) => ({
        id: String(fw.id),
        name: String(fw.name || fw.ref_id || fw.id),
        ref_id: fw.ref_id,
        enableId: String(fw.id),
        source: 'backend',
        canEnable: true,
      }));

      const backendMatcher = new Map<string, string>();
      for (const row of backendRows) {
        backendMatcher.set(normalize(row.id), row.id);
        backendMatcher.set(normalize(row.name), row.id);
        if (row.ref_id) backendMatcher.set(normalize(row.ref_id), row.id);
      }

      const resolveEnableId = (id: string, name: string, refId?: string) => {
        const direct = backendMatcher.get(normalize(id));
        if (direct) return direct;
        if (refId) {
          const byRef = backendMatcher.get(normalize(refId));
          if (byRef) return byRef;
        }
        const byName = backendMatcher.get(normalize(name));
        if (byName) return byName;

        const byContains = backendRows.find((row) => {
          const haystack = `${normalize(row.id)} ${normalize(row.ref_id || '')} ${normalize(row.name)}`;
          return haystack.includes(normalize(name)) || (refId ? haystack.includes(normalize(refId)) : false);
        });
        return byContains?.id;
      };

      const fileLibraryRows: FrameworkRow[] = (frameworkLibraryList.data || []).map((framework) => {
        const normalizedId = String(framework.name || framework.filename || 'framework')
          .replace(/\.ya?ml$/i, '')
          .replace(/\s+/g, '-')
          .toUpperCase();

        return {
          id: normalizedId,
          name: String(framework.name || framework.filename || normalizedId),
          ref_id: normalizedId,
          enableId: resolveEnableId(normalizedId, String(framework.name || framework.filename || normalizedId), normalizedId),
          source: 'library',
          canEnable: true,
        };
      });

      const derivedLibraryRows: FrameworkRow[] = (libraries.results || []).map((library) => ({
        id: String(library.ref_id || library.id || library.urn || library.name),
        name: String(library.name || library.ref_id || library.urn || 'Framework'),
        ref_id: library.ref_id,
        enableId: resolveEnableId(
          String(library.ref_id || library.id || library.urn || library.name),
          String(library.name || library.ref_id || library.urn || 'Framework'),
          library.ref_id
        ),
        source: 'library',
        canEnable: true,
      }));

      const merged = new Map<string, FrameworkRow>();
      for (const row of [...backendRows, ...fileLibraryRows, ...derivedLibraryRows]) {
        const key = `${normalize(row.name)}::${normalize(row.ref_id || row.id)}`;
        if (!merged.has(key)) {
          merged.set(key, row);
          continue;
        }
        const existing = merged.get(key)!;
        if (existing.source === 'library' && row.source === 'backend') {
          merged.set(key, row);
        }
      }

      const mergedRows = Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
      const enableableRows = mergedRows.map((row) => {
        const resolvedEnableId = row.enableId || resolveEnableId(row.id, row.name, row.ref_id);
        return {
          ...row,
          enableId: resolvedEnableId,
          canEnable: Boolean(resolvedEnableId),
        };
      });
      const applicabilitySelections = hyperlynxApi.getApplicabilityFrameworkSelections();

      const resolveApplicabilityToFramework = (key: string) => {
        const aliases = APPLICABILITY_TO_FRAMEWORK_ALIASES[key] || [key];
        const normalizedAliases = aliases.map((alias) => normalize(alias));
        const matched = enableableRows.find((row) => {
          const id = normalize(row.id);
          const refId = normalize(row.ref_id || '');
          const name = normalize(row.name);
          return normalizedAliases.some((alias) => id.includes(alias) || refId.includes(alias) || name.includes(alias));
        });

        if (!matched) return null;
        return { framework_id: matched.enableId || matched.id, framework_name: matched.name };
      };

      const mandatoryMapped = (applicabilitySelections.applicable || [])
        .map(resolveApplicabilityToFramework)
        .filter((item): item is { framework_id: string; framework_name: string } => Boolean(item));
      const optionalMapped = (applicabilitySelections.optional || [])
        .map(resolveApplicabilityToFramework)
        .filter((item): item is { framework_id: string; framework_name: string } => Boolean(item));

      const mergedRecommended = [...mandatoryMapped, ...optionalMapped, ...(recs.results || [])].filter((item, index, arr) => {
        const key = `${normalize(item.framework_id)}::${normalize(item.framework_name)}`;
        return arr.findIndex((x) => `${normalize(x.framework_id)}::${normalize(x.framework_name)}` === key) === index;
      });

      setFrameworks(enableableRows);
      setLibraryFrameworkCount(fileLibraryRows.length + derivedLibraryRows.length);
      setRecommended(mergedRecommended);
      setApplicableKeys(applicabilitySelections.applicable || []);
      setOptionalKeys(applicabilitySelections.optional || []);
      const on = new Set<string>();
      (status.results || []).forEach((row: Record<string, unknown>) => {
        if ((row.status as string) === 'enabled') on.add(String(row.framework_id));
      });
      setEnabled(on);
      const firstEnableable = enableableRows.find((row) => row.canEnable);
      if (firstEnableable) {
        setSelectedFrameworkId(firstEnableable.enableId || firstEnableable.id);
      }
      setSelectedFrameworkForDetails(enableableRows[0] || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const enable = async (frameworkId: string) => {
    await hyperlynxApi.enableFramework(frameworkId);
    setEnabled((prev) => new Set(prev).add(frameworkId));
  };

  const recommendedIds = new Set(recommended.map((row) => row.framework_id));
  const recommendedNames = new Set(recommended.map((row) => normalize(row.framework_name)));

  const isMappedFromApplicability = (framework: FrameworkRow) => {
    const candidate = `${normalize(framework.id)} ${normalize(framework.ref_id || '')} ${normalize(framework.name)}`;
    const mandatory = applicableKeys.some((key) => (APPLICABILITY_TO_FRAMEWORK_ALIASES[key] || [key]).some((alias) => candidate.includes(normalize(alias))));
    const optional = optionalKeys.some((key) => (APPLICABILITY_TO_FRAMEWORK_ALIASES[key] || [key]).some((alias) => candidate.includes(normalize(alias))));
    return { mandatory, optional };
  };

  const enableSelected = async () => {
    if (!selectedFrameworkId) return;
    await enable(selectedFrameworkId);
  };

  const enableRecommended = async () => {
    const sorted = [...recommended].sort((a, b) => {
      const aMeta = isMappedFromApplicability({ id: a.framework_id, name: a.framework_name, source: 'backend', canEnable: true });
      const bMeta = isMappedFromApplicability({ id: b.framework_id, name: b.framework_name, source: 'backend', canEnable: true });
      const aWeight = aMeta.mandatory ? 2 : aMeta.optional ? 1 : 0;
      const bWeight = bMeta.mandatory ? 2 : bMeta.optional ? 1 : 0;
      return bWeight - aWeight;
    });

    for (const item of sorted) {
      if (!enabled.has(item.framework_id)) {
        try {
          await enable(item.framework_id);
        } catch {
          // ignore duplicates/invalid ids
        }
      }
    }
  };

  if (loading) return <div className="p-6 bg-white border rounded-lg">Loading framework advisor…</div>;

  const selectedFrameworkMeta = selectedFrameworkForDetails
    ? isMappedFromApplicability(selectedFrameworkForDetails)
    : { mandatory: false, optional: false };

  const getFrameworkInfo = (framework: FrameworkRow | null) => {
    if (!framework) return null;
    const candidate = `${normalize(framework.id)} ${normalize(framework.ref_id || '')} ${normalize(framework.name)}`;
    const match = Object.entries(APPLICABILITY_TO_FRAMEWORK_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => candidate.includes(normalize(alias)))
    )?.[0];
    if (!match) return null;
    return FRAMEWORK_INFO[match] || null;
  };

  const selectedFrameworkInfo = getFrameworkInfo(selectedFrameworkForDetails);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Framework Advisor</h1>
        <p className="text-sm text-gray-600 mt-1">Choose from all frameworks and review recommended applicable ones.</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Enable from Full Framework List</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <select
            className="border rounded-md px-3 py-2 min-w-[320px]"
            value={selectedFrameworkId}
            onChange={(e) => setSelectedFrameworkId(e.target.value)}
          >
            {frameworks.filter((fw) => fw.canEnable).map((fw) => (
              <option key={fw.id} value={fw.enableId || fw.id}>{fw.name}</option>
            ))}
          </select>
          <button onClick={enableSelected} className="px-3 py-2 bg-black text-white rounded-md text-sm">Enable Selected</button>
          <button onClick={enableRecommended} className="px-3 py-2 border border-gray-300 rounded-md text-sm">Enable All Recommended</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Total Frameworks (Backend + Library)</p><p className="text-2xl font-bold">{frameworks.length}</p><p className="text-[11px] text-gray-500 mt-1">{libraryFrameworkCount} from library catalog</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Recommended</p><p className="text-2xl font-bold">{recommended.length}</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Enabled</p><p className="text-2xl font-bold">{enabled.size}</p></div>
      </div>

      {selectedFrameworkForDetails && (
        <div className="bg-white border rounded-lg p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedFrameworkForDetails.name}</h3>
              <p className="text-xs text-gray-500 mt-1">ID: {selectedFrameworkForDetails.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedFrameworkForDetails.source === 'library' && <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">Library</span>}
              {selectedFrameworkMeta.mandatory && <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Mandatory</span>}
              {!selectedFrameworkMeta.mandatory && selectedFrameworkMeta.optional && <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">Optional</span>}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-sm font-semibold text-gray-900 mb-1">About this framework</p>
            <p className="text-sm text-gray-700">
              {selectedFrameworkInfo?.description || 'Framework baseline available. This profile can be enabled and mapped to controls, gaps, risks, and action plans.'}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-sm font-semibold text-gray-900 mb-2">Key control focus</p>
            <ul className="space-y-1">
              {(selectedFrameworkInfo?.focus || [
                'Governance and policy controls',
                'Operational security controls',
                'Monitoring and continuous improvement',
              ]).map((focus) => (
                <li key={focus} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-bold text-green-600">•</span>
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map((framework) => {
          const resolvedEnableId = framework.enableId || framework.id;
          const isEnabled = framework.canEnable && enabled.has(resolvedEnableId);
          const isRecommended = recommendedIds.has(resolvedEnableId) || recommendedNames.has(normalize(framework.name));
          const applicability = isMappedFromApplicability(framework);
          return (
            <div
              key={framework.id}
              className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedFrameworkForDetails(framework)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">{framework.name}</p>
                <div className="flex items-center gap-2">
                  {framework.source === 'library' && (
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">Library</span>
                  )}
                  {applicability.mandatory && <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Mandatory</span>}
                  {!applicability.mandatory && applicability.optional && <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">Optional</span>}
                  {isRecommended && <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Recommended</span>}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">ID: {framework.id}</p>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void enable(resolvedEnableId);
                }}
                disabled={isEnabled || !framework.canEnable}
                className="mt-3 px-3 py-2 text-sm rounded-md bg-black text-white disabled:bg-gray-300"
              >
                {!framework.canEnable ? 'Available in Library' : isEnabled ? 'Enabled' : 'Enable Framework'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
