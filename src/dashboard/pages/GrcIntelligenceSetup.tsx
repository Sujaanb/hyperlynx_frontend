import React, { useEffect, useMemo, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';
import { runIntelligencePopulation } from '../services/grcOrchestration';

type ApplicabilityStatus = 'applicable' | 'optional' | 'not-applicable';

type Answers = {
  region: string[];
  company_size: string;
  revenue: string;
  industry: string;
  process_personal_data: string;
  eu_customers: string;
  provide_ict: string;
  critical_supplier: string;
  product_manufacturer: string;
  financial_authority: string;
  sensitive_data: string[];
  pci_scope: string;
  other_regulations: string[];
};

type FrameworkRule = {
  key: string;
  name: string;
  category: string;
  description: string;
  applicability: (data: Answers) => ApplicabilityStatus;
};

const requiredFields: Array<keyof Answers> = [
  'company_size',
  'revenue',
  'industry',
  'process_personal_data',
  'eu_customers',
  'provide_ict',
  'critical_supplier',
  'product_manufacturer',
  'financial_authority',
  'pci_scope',
];

const essentialIndustries = ['financial', 'energy', 'healthcare', 'transport', 'water', 'digital', 'data-centre', 'msp', 'telecoms'];

const frameworkRules: FrameworkRule[] = [
  {
    key: 'gdpr',
    name: 'GDPR (General Data Protection Regulation)',
    category: 'Data Protection',
    description: 'Applies to processing personal data of EU residents.',
    applicability: (data) => {
      if (!data.process_personal_data || data.process_personal_data === 'no') return 'not-applicable';
      if (!data.eu_customers || data.eu_customers === 'no') return 'optional';
      return 'applicable';
    },
  },
  {
    key: 'nis2',
    name: 'NIS2 (Network and Information Systems Directive 2)',
    category: 'Critical Infrastructure',
    description: 'EU critical infrastructure and important entities cyber obligations.',
    applicability: (data) => {
      if (essentialIndustries.includes(data.industry)) return 'applicable';
      if (data.provide_ict === 'core' && data.eu_customers !== 'no') return 'applicable';
      if (data.industry === 'msp' || data.industry === 'data-centre') return 'applicable';
      return 'not-applicable';
    },
  },
  {
    key: 'dora',
    name: 'DORA (Digital Operational Resilience Act)',
    category: 'Financial Services',
    description: 'Mandatory for EU-regulated financial entities and critical ICT providers.',
    applicability: (data) => {
      if (data.financial_authority === 'yes-fca' || data.financial_authority === 'yes-eu') return 'applicable';
      if (data.industry === 'financial' && data.eu_customers !== 'no') return 'applicable';
      return 'not-applicable';
    },
  },
  {
    key: 'uk_cyber_bill',
    name: 'UK Cyber Security & Resilience Bill',
    category: 'Critical Infrastructure',
    description: 'Upcoming UK cyber resilience legislation (planning relevance now).',
    applicability: (data) => {
      if (!data.region.includes('uk') && !data.region.includes('uk-eu-both')) return 'not-applicable';
      if (essentialIndustries.includes(data.industry)) return 'applicable';
      if (data.industry === 'msp' || data.industry === 'data-centre') return 'applicable';
      return 'optional';
    },
  },
  {
    key: 'uk_gdpr',
    name: 'UK GDPR & Data Protection Act 2018',
    category: 'Data Protection',
    description: 'UK data protection obligations.',
    applicability: (data) => {
      if (!data.region.includes('uk') && !data.region.includes('uk-eu-both')) return 'not-applicable';
      if (!data.process_personal_data || data.process_personal_data === 'no') return 'not-applicable';
      return 'applicable';
    },
  },
  {
    key: 'pci_dss',
    name: 'PCI DSS',
    category: 'Payment Security',
    description: 'Mandatory standard for handling payment card data.',
    applicability: (data) => (data.pci_scope === 'yes' ? 'applicable' : 'not-applicable'),
  },
  {
    key: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    category: 'ISMS',
    description: 'Security management baseline often required by customers/auditors.',
    applicability: (data) => {
      if (data.company_size === 'large') return 'applicable';
      if (data.process_personal_data === 'extensive') return 'applicable';
      return 'optional';
    },
  },
  {
    key: 'nist_csf',
    name: 'NIST Cybersecurity Framework 2.0',
    category: 'Risk Management',
    description: 'Widely used voluntary cybersecurity framework.',
    applicability: () => 'optional',
  },
  {
    key: 'fca_rules',
    name: 'FCA Cybersecurity Rules (SYSC)',
    category: 'Financial Services',
    description: 'Mandatory for FCA-regulated entities.',
    applicability: (data) => (data.financial_authority === 'yes-fca' ? 'applicable' : 'not-applicable'),
  },
  {
    key: 'pra_rules',
    name: 'PRA Cybersecurity Fundamental Rules',
    category: 'Financial Services',
    description: 'Prudential cyber obligations for PRA-regulated firms.',
    applicability: (data) => {
      if (data.financial_authority === 'yes-fca') return 'applicable';
      if (data.industry === 'financial') return 'optional';
      return 'not-applicable';
    },
  },
  {
    key: 'cra',
    name: 'CRA (Cyber Resilience Act)',
    category: 'Product Cybersecurity',
    description: 'EU security requirements for digital products.',
    applicability: (data) => {
      if (data.product_manufacturer === 'yes-eu') return 'applicable';
      if (data.industry === 'tech' && data.eu_customers !== 'no') return 'applicable';
      return 'not-applicable';
    },
  },
  {
    key: 'cyber_essentials',
    name: 'Cyber Essentials',
    category: 'Baseline Security',
    description: 'UK baseline cyber hygiene scheme.',
    applicability: () => 'optional',
  },
  {
    key: 'eidas',
    name: 'eIDAS 2',
    category: 'Digital Identity',
    description: 'EU trust services / digital identity obligations.',
    applicability: (data) => {
      if (data.provide_ict === 'core' && data.eu_customers !== 'no') return 'optional';
      if (data.industry === 'digital') return 'optional';
      return 'not-applicable';
    },
  },
  {
    key: 'sox',
    name: 'SOX (Sarbanes-Oxley)',
    category: 'Financial Compliance',
    description: 'US public company internal controls regulation.',
    applicability: (data) => (data.other_regulations.includes('sox') ? 'applicable' : 'not-applicable'),
  },
  {
    key: 'basel3',
    name: 'Basel III/IV',
    category: 'Banking Regulation',
    description: 'Banking capital/operational resilience framework.',
    applicability: (data) => {
      if (data.other_regulations.includes('basel')) return 'applicable';
      if (data.industry === 'financial' && data.financial_authority === 'yes-fca') return 'optional';
      return 'not-applicable';
    },
  },
  {
    key: 'nis1_uk_original',
    name: 'NIS Regulations 2018 (UK Legacy)',
    category: 'Critical Infrastructure',
    description: 'Legacy UK NIS regime (useful transition baseline).',
    applicability: (data) => {
      if (!data.region.includes('uk') && !data.region.includes('uk-eu-both')) return 'not-applicable';
      const legacyIndustries = ['energy', 'healthcare', 'transport', 'water', 'digital'];
      if (legacyIndustries.includes(data.industry)) return 'optional';
      return 'not-applicable';
    },
  },
];

const initialAnswers: Answers = {
  region: [],
  company_size: '',
  revenue: '',
  industry: '',
  process_personal_data: '',
  eu_customers: '',
  provide_ict: '',
  critical_supplier: '',
  product_manufacturer: '',
  financial_authority: '',
  sensitive_data: [],
  pci_scope: '',
  other_regulations: [],
};

export function GrcIntelligenceSetup({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [frameworkLibraryCount, setFrameworkLibraryCount] = useState(0);
  const [controlLibraryCount, setControlLibraryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [org, libs, controls, questionnaire] = await Promise.all([
          hyperlynxApi.getOrganization().catch(() => null),
          hyperlynxApi.listFrameworkLibraries().catch(() => ({ count: 0 } as { count: number })),
          hyperlynxApi.getControls().catch(() => ({ count: 0 } as { count: number })),
          hyperlynxApi.getIntelligenceQuestionnaire().catch(() => ({ results: [] as Array<{ key: string; answer?: string }> })),
        ]);

        if (org) {
          setOrgName(org.name || '');
          setIndustry(org.industry || '');
          setCountry(org.country || '');
        }

        setFrameworkLibraryCount(libs.count || 0);
        setControlLibraryCount(controls.count || 0);

        const seeded = { ...initialAnswers };
        for (const row of questionnaire.results || []) {
          const value = row.answer || '';
          if (!value) continue;
          if (row.key === 'region' || row.key === 'sensitive_data' || row.key === 'other_regulations') {
            (seeded as Record<string, string[]>)[row.key] = value.split(',').map((item) => item.trim()).filter(Boolean);
          } else if (row.key in seeded) {
            (seeded as Record<string, string>)[row.key] = value;
          }
        }
        setAnswers(seeded);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const setRadio = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCheck = (key: 'region' | 'sensitive_data' | 'other_regulations', value: string) => {
    setAnswers((prev) => {
      const current = prev[key] as string[];
      const hasValue = current.includes(value);
      const next = hasValue ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const completion = useMemo(() => {
    const requiredDone = requiredFields.filter((key) => String(answers[key]).trim().length > 0).length;
    const regionDone = answers.region.length > 0 ? 1 : 0;
    const totalRequired = requiredFields.length + 1;
    return Math.round(((requiredDone + regionDone) / totalRequired) * 100);
  }, [answers]);

  const evaluatedFrameworks = useMemo(
    () => frameworkRules.map((rule) => ({ ...rule, status: rule.applicability(answers) })),
    [answers]
  );

  const applicableFrameworks = evaluatedFrameworks.filter((item) => item.status === 'applicable');
  const optionalFrameworks = evaluatedFrameworks.filter((item) => item.status === 'optional');

  const saveAndPopulate = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await hyperlynxApi.createOrganization(orgName, industry, country);

      const mappedAnswers: Record<string, string> = {
        region: answers.region.join(', '),
        company_size: answers.company_size,
        revenue: answers.revenue,
        industry: answers.industry || industry || 'other',
        process_personal_data: answers.process_personal_data,
        eu_customers: answers.eu_customers,
        provide_ict: answers.provide_ict,
        critical_supplier: answers.critical_supplier,
        product_manufacturer: answers.product_manufacturer,
        financial_authority: answers.financial_authority,
        sensitive_data: answers.sensitive_data.join(', '),
        pci_scope: answers.pci_scope,
        other_regulations: answers.other_regulations.join(', '),

        regulated_industry: answers.industry || industry || 'other',
        handles_pii: answers.process_personal_data === 'no' ? 'no' : 'yes',
        cloud_first: answers.provide_ict === 'core' ? 'yes' : answers.provide_ict === 'no' ? 'no' : 'partial',
        third_party_reliance: answers.critical_supplier === 'yes' ? 'yes' : answers.critical_supplier === 'unlikely' ? 'no' : 'partial',
        global_operations: answers.region.includes('uk-eu-both') ? 'yes' : 'partial',
      };

      await hyperlynxApi.saveIntelligenceQuestionnaire(mappedAnswers);
      hyperlynxApi.setApplicabilityFrameworkSelections({
        applicable: applicableFrameworks.map((item) => item.key),
        optional: optionalFrameworks.map((item) => item.key),
      });
      const result = await runIntelligencePopulation();

      if (!result.started) {
        setStatus('Applicability saved. Upload documents to trigger intelligence population.');
      } else {
        setStatus(
          `Applicability saved. Mandatory frameworks: ${applicableFrameworks.length}, optional: ${optionalFrameworks.length}. Intelligence populated ${result.enabledFrameworks} framework(s), analyzed ${result.documentsAnalyzed} document(s), and prepared controls/gaps/action plan.`
        );
      }

      onNavigate?.('overview');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save applicability.';
      setStatus(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 bg-white border rounded-lg">Loading applicability…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applicability</h1>
        <p className="text-sm text-gray-600 mt-1">Exact Cyber Frameworks Applicability Questionnaire (UK/EU) with dashboard output.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Framework Library</p><p className="text-2xl font-bold">{frameworkLibraryCount}</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Control Library</p><p className="text-2xl font-bold">{controlLibraryCount}</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Question Completion</p><p className="text-2xl font-bold">{completion}%</p></div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="Company name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Company address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">1. Company Overview</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">What is your company&apos;s primary region of operation? (Select all that apply)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['uk', 'eu', 'uk-eu-both'].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={answers.region.includes(option)} onChange={() => toggleCheck('region', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">How many employees does your organisation have?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-72" value={answers.company_size} onChange={(e) => setRadio('company_size', e.target.value)}>
              <option value="">Select…</option>
              <option value="micro">Micro (1-9)</option>
              <option value="small">Small (10-49)</option>
              <option value="medium">Medium (50-249)</option>
              <option value="large">Large (250+)</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">What is your annual revenue?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-72" value={answers.revenue} onChange={(e) => setRadio('revenue', e.target.value)}>
              <option value="">Select…</option>
              <option value="under-2m">Under £2 million</option>
              <option value="2m-10m">£2-10 million</option>
              <option value="10m-50m">£10-50 million</option>
              <option value="50m-250m">£50-250 million</option>
              <option value="over-250m">Over £250 million</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">2. Industry & Sector Classification</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">What is your primary industry?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.industry} onChange={(e) => setRadio('industry', e.target.value)}>
              <option value="">Select…</option>
              {['financial','energy','healthcare','transport','water','digital','data-centre','msp','telecoms','other-essential','tech','other'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Do you process personal data?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.process_personal_data} onChange={(e) => setRadio('process_personal_data', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="minimal">Minimal</option>
              <option value="moderate">Moderate</option>
              <option value="extensive">Extensive</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Do you have customers/users in the EU?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.eu_customers} onChange={(e) => setRadio('eu_customers', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes-some">Yes - Some</option>
              <option value="yes-significant">Yes - Significant</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">3. Digital Services & Supply Chain Role</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Do you provide ICT services to other organisations?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.provide_ict} onChange={(e) => setRadio('provide_ict', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="minor">Minor</option>
              <option value="core">Core Business</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Are you a critical supplier to essential services?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.critical_supplier} onChange={(e) => setRadio('critical_supplier', e.target.value)}>
              <option value="">Select…</option>
              <option value="unclear">Unclear</option>
              <option value="unlikely">Unlikely</option>
              <option value="possible">Possible</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Do you manufacture/distribute digital products?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.product_manufacturer} onChange={(e) => setRadio('product_manufacturer', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes-eu">Yes - EU market</option>
              <option value="yes-uk">Yes - UK only</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Are you regulated by a UK/EU financial authority?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.financial_authority} onChange={(e) => setRadio('financial_authority', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes-fca">Yes - FCA/PRA</option>
              <option value="yes-eu">Yes - EU authority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">4. Specific Risk & Compliance Considerations</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Sensitive data handled (select all that apply)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['health','biometric','children','criminal','financial','none'].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={answers.sensitive_data.includes(option)} onChange={() => toggleCheck('sensitive_data', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Does your organisation handle payment card data (PCI DSS scope)?</p>
            <select className="border rounded-md px-3 py-2 text-sm w-full md:w-80" value={answers.pci_scope} onChange={(e) => setRadio('pci_scope', e.target.value)}>
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-900 mb-2">Other regulatory frameworks (select all that apply)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['sox','hipaa','basel','solvency2','none'].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={answers.other_regulations.includes(option)} onChange={() => toggleCheck('other_regulations', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Applicable Frameworks Output</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="border rounded-md p-3"><p className="text-xs text-gray-500">Mandatory / Applicable</p><p className="text-2xl font-bold text-green-700">{applicableFrameworks.length}</p></div>
          <div className="border rounded-md p-3"><p className="text-xs text-gray-500">Optional / Recommended</p><p className="text-2xl font-bold text-amber-700">{optionalFrameworks.length}</p></div>
          <div className="border rounded-md p-3"><p className="text-xs text-gray-500">Total Selected</p><p className="text-2xl font-bold">{applicableFrameworks.length + optionalFrameworks.length}</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700 mb-2">Mandatory / Applicable</p>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {applicableFrameworks.map((item) => (
                <div key={item.key} className="border rounded-md p-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.category}</p>
                </div>
              ))}
              {!applicableFrameworks.length && <p className="text-sm text-gray-500">No mandatory frameworks currently triggered.</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber-700 mb-2">Optional / Recommended</p>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {optionalFrameworks.map((item) => (
                <div key={item.key} className="border rounded-md p-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.category}</p>
                </div>
              ))}
              {!optionalFrameworks.length && <p className="text-sm text-gray-500">No optional frameworks currently triggered.</p>}
            </div>
          </div>
        </div>
      </div>

      {status && <div className="bg-gray-50 border rounded-lg px-4 py-3 text-sm text-gray-700">{status}</div>}

      <button
        onClick={saveAndPopulate}
        disabled={saving || !orgName.trim() || answers.region.length === 0 || requiredFields.some((key) => String(answers[key]).trim().length === 0)}
        className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Applicability & Populate Dashboard'}
      </button>
    </div>
  );
}
