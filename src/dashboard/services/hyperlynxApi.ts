const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE || '').toLowerCase() === 'true';

const API_BASE_URL = (
  import.meta.env.VITE_HYPERLYNX_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'http://localhost:5000')
).replace(/\/$/, '');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
}

type JsonObject = Record<string, unknown>;

interface MockDashboardState {
  populated: boolean;
  users: Array<Record<string, unknown>>;
  organization: { id: number; name: string; industry?: string; country?: string; size?: string };
  questionnaireAnswers: Record<string, string>;
  frameworksCatalog: Array<{ id: string; name: string; ref_id: string; description?: string }>;
  enabledFrameworkIds: string[];
  documents: Array<{ id: number; filename: string; extracted_text_preview?: string }>;
  gaps: Array<{
    id: number;
    control_name: string;
    framework_id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'missing' | 'covered' | 'in_progress' | 'resolved';
    recommendation: string;
    gap_score?: number;
  }>;
  risks: Array<{
    id: number;
    title: string;
    description: string;
    likelihood: number;
    impact: number;
    status: string;
  }>;
  actionPlanTasks: Array<{
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    due_date: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
  reports: Array<Record<string, unknown>>;
  assets: Array<{ id: number; name: string; asset_type: string; criticality: number; owner?: string; description?: string }>;
  controls: Array<Record<string, unknown>>;
  controlMappings: Array<Record<string, unknown>>;
  storedLibraries: Array<{ id: string; urn: string; ref_id?: string; locale?: string; name: string; description?: string; is_loaded?: boolean; object_type?: string }>;
  storedLibraryContents: Record<string, { content: { objects: Record<string, unknown> } }>;
}

const USE_HARDCODED_DASHBOARD =
  DEMO_MODE || String(import.meta.env.VITE_HARDCODED_DASHBOARD || '').toLowerCase() === 'true';
const MOCK_STATE_KEY = 'hyperlynx.dashboard.mock.state.v1';
const DASHBOARD_SEEDED_KEY = 'hyperlynx.dashboard.seeded.v1';
const APPLICABILITY_FRAMEWORKS_KEY = 'hyperlynx.applicability.frameworks.v1';

function isBrowserRuntime() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function isDashboardSeeded() {
  return isBrowserRuntime() && localStorage.getItem(DASHBOARD_SEEDED_KEY) === '1';
}

function setDashboardSeeded(seed = true) {
  if (!isBrowserRuntime()) return;
  if (seed) {
    localStorage.setItem(DASHBOARD_SEEDED_KEY, '1');
  } else {
    localStorage.removeItem(DASHBOARD_SEEDED_KEY);
  }
}

function getApplicabilityFrameworksStore(): { applicable: string[]; optional: string[] } {
  if (!isBrowserRuntime()) {
    return { applicable: [], optional: [] };
  }

  try {
    const raw = localStorage.getItem(APPLICABILITY_FRAMEWORKS_KEY);
    if (!raw) return { applicable: [], optional: [] };
    const parsed = JSON.parse(raw) as { applicable?: string[]; optional?: string[] };
    return {
      applicable: Array.isArray(parsed.applicable) ? parsed.applicable : [],
      optional: Array.isArray(parsed.optional) ? parsed.optional : [],
    };
  } catch {
    return { applicable: [], optional: [] };
  }
}

function setApplicabilityFrameworksStore(payload: { applicable: string[]; optional: string[] }) {
  if (!isBrowserRuntime()) return;
  localStorage.setItem(APPLICABILITY_FRAMEWORKS_KEY, JSON.stringify(payload));
}

function getSeededFallbackState() {
  const fallback = makeInitialMockState();
  populateMockDashboard(fallback);
  return fallback;
}

function mockFutureDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
}

function makeInitialMockState(): MockDashboardState {
  const frameworksCatalog = [
    { id: 'NIST-CSF-2.0', name: 'NIST Cybersecurity Framework 2.0', ref_id: 'NIST-CSF-2.0', description: 'Cybersecurity governance and resilience framework.' },
    { id: 'ISO-27001', name: 'ISO/IEC 27001', ref_id: 'ISO-27001', description: 'Information security management system controls.' },
    { id: 'GDPR', name: 'General Data Protection Regulation', ref_id: 'GDPR', description: 'EU data protection and privacy requirements.' },
    { id: 'NIS2', name: 'NIS2 Directive', ref_id: 'NIS2', description: 'EU network and information systems security directive.' },
  ];

  const controls = [
    { id: 'AC-01', control_name: 'Access Control Policy', name: 'Access Control Policy', framework_id: 'ISO-27001', category: 'Identity', description: 'Formal access control policy and periodic review.', library_urn: 'ISO-27001' },
    { id: 'IR-02', control_name: 'Incident Response Playbooks', name: 'Incident Response Playbooks', framework_id: 'NIST-CSF-2.0', category: 'Response', description: 'Documented and tested incident playbooks.', library_urn: 'NIST-CSF-2.0' },
    { id: 'DP-03', control_name: 'Data Retention Controls', name: 'Data Retention Controls', framework_id: 'GDPR', category: 'Privacy', description: 'Data retention and deletion lifecycle in place.', library_urn: 'GDPR' },
    { id: 'TP-04', control_name: 'Third-Party Risk Reviews', name: 'Third-Party Risk Reviews', framework_id: 'NIS2', category: 'Supply Chain', description: 'Periodic vendor risk assessments and evidence.', library_urn: 'NIS2' },
  ];

  return {
    populated: false,
    users: [
      { id: 1, username: 'admin', email: 'admin@hyperlynx.local', role: 'admin', is_active: true },
      { id: 2, username: 'analyst', email: 'analyst@hyperlynx.local', role: 'analyst', is_active: true },
    ],
    organization: {
      id: 1,
      name: 'Hyperlynx Demo Org',
      industry: 'technology',
      country: 'IN',
      size: 'medium',
    },
    questionnaireAnswers: {},
    frameworksCatalog,
    enabledFrameworkIds: [],
    documents: [],
    gaps: [],
    risks: [],
    actionPlanTasks: [],
    reports: [],
    assets: [],
    controls,
    controlMappings: [
      { source_control: 'AC-01', target_control: 'IR-02', relation: 'supports' },
      { source_control: 'IR-02', target_control: 'TP-04', relation: 'depends_on' },
      { source_control: 'DP-03', target_control: 'AC-01', relation: 'requires' },
    ],
    storedLibraries: frameworksCatalog.map((framework, index) => ({
      id: `lib-${index + 1}`,
      urn: framework.id,
      ref_id: framework.ref_id,
      name: framework.name,
      description: framework.description,
      is_loaded: true,
      object_type: 'framework',
    })),
    storedLibraryContents: {
      'lib-1': {
        content: {
          objects: {
            reference_controls: controls.filter((control) => String(control.framework_id) === 'NIST-CSF-2.0').map((control) => ({
              id: control.id,
              ref_id: control.id,
              name: control.name,
              description: control.description,
              library_urn: 'NIST-CSF-2.0',
            })),
          },
        },
      },
      'lib-2': {
        content: {
          objects: {
            reference_controls: controls.filter((control) => String(control.framework_id) === 'ISO-27001').map((control) => ({
              id: control.id,
              ref_id: control.id,
              name: control.name,
              description: control.description,
              library_urn: 'ISO-27001',
            })),
          },
        },
      },
      'lib-3': {
        content: {
          objects: {
            reference_controls: controls.filter((control) => String(control.framework_id) === 'GDPR').map((control) => ({
              id: control.id,
              ref_id: control.id,
              name: control.name,
              description: control.description,
              library_urn: 'GDPR',
            })),
          },
        },
      },
      'lib-4': {
        content: {
          objects: {
            reference_controls: controls.filter((control) => String(control.framework_id) === 'NIS2').map((control) => ({
              id: control.id,
              ref_id: control.id,
              name: control.name,
              description: control.description,
              library_urn: 'NIS2',
            })),
          },
        },
      },
    },
  };
}

function loadMockState(): MockDashboardState {
  if (!isBrowserRuntime()) {
    return makeInitialMockState();
  }

  const raw = localStorage.getItem(MOCK_STATE_KEY);
  if (!raw) {
    const initial = makeInitialMockState();
    localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw) as MockDashboardState;
  } catch {
    const reset = makeInitialMockState();
    localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(reset));
    return reset;
  }
}

function saveMockState(state: MockDashboardState) {
  if (!isBrowserRuntime()) return;
  localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(state));
}

function withMockState<T>(updater: (state: MockDashboardState) => T): T {
  const state = loadMockState();
  const result = updater(state);
  saveMockState(state);
  return result;
}

function populateMockDashboard(state: MockDashboardState) {
  if (state.populated) {
    return;
  }

  state.populated = true;
  state.enabledFrameworkIds = ['NIST-CSF-2.0', 'ISO-27001', 'GDPR'];

  if (!state.documents.length) {
    state.documents = [
      { id: 1, filename: 'Information_Security_Policy.pdf', extracted_text_preview: 'Security governance, ownership, and control objectives.' },
      { id: 2, filename: 'Incident_Response_Procedure.docx', extracted_text_preview: 'Escalation matrix, response SLAs, and containment workflow.' },
      { id: 3, filename: 'Privacy_Notice_GDPR.md', extracted_text_preview: 'Data subject rights, retention periods, and lawful basis mapping.' },
    ];
  }

  state.gaps = [
    { id: 1, control_name: 'Incident Response Playbooks', framework_id: 'NIST-CSF-2.0', severity: 'critical', status: 'missing', recommendation: 'Create and test response playbooks for top five incident scenarios.', gap_score: 95 },
    { id: 2, control_name: 'Vendor Due Diligence', framework_id: 'NIS2', severity: 'high', status: 'in_progress', recommendation: 'Complete annual assessments for all critical vendors.', gap_score: 82 },
    { id: 3, control_name: 'Data Retention Policy', framework_id: 'GDPR', severity: 'medium', status: 'covered', recommendation: 'Policy exists; add quarterly review evidence.', gap_score: 42 },
    { id: 4, control_name: 'Access Recertification', framework_id: 'ISO-27001', severity: 'high', status: 'missing', recommendation: 'Implement quarterly access review with approval logs.', gap_score: 78 },
    { id: 5, control_name: 'Backup Restore Drills', framework_id: 'NIST-CSF-2.0', severity: 'medium', status: 'in_progress', recommendation: 'Run and document restore drills every month.', gap_score: 58 },
    { id: 6, control_name: 'Encryption Key Rotation', framework_id: 'ISO-27001', severity: 'low', status: 'resolved', recommendation: 'Automation in place; keep evidence in KMS logs.', gap_score: 15 },
  ];

  state.risks = [
    { id: 1, title: 'Credential Compromise', description: 'Privileged credentials exposed through phishing.', likelihood: 4, impact: 5, status: 'open' },
    { id: 2, title: 'Vendor Breach Propagation', description: 'Third-party security event impacts production data flows.', likelihood: 3, impact: 5, status: 'mitigating' },
    { id: 3, title: 'Unpatched Internet-Facing Service', description: 'Critical CVEs in externally accessible services.', likelihood: 4, impact: 4, status: 'open' },
    { id: 4, title: 'Logging Gaps', description: 'Insufficient telemetry for incident investigations.', likelihood: 3, impact: 3, status: 'mitigating' },
  ];

  state.actionPlanTasks = [
    { id: 1, title: 'Deploy MFA for privileged users', description: 'Roll out enforced MFA for all admin accounts.', status: 'in_progress', due_date: mockFutureDate(10), priority: 'critical' },
    { id: 2, title: 'Complete incident playbook testing', description: 'Tabletop exercises for ransomware and data exfiltration.', status: 'todo', due_date: mockFutureDate(14), priority: 'high' },
    { id: 3, title: 'Finalize vendor security questionnaire', description: 'Standardize due-diligence control questionnaire.', status: 'todo', due_date: mockFutureDate(21), priority: 'medium' },
    { id: 4, title: 'Close access review findings', description: 'Remediate stale and orphaned accounts.', status: 'done', due_date: mockFutureDate(-2), priority: 'high' },
  ];

  state.reports = [
    { id: 1, title: 'Compliance Executive Summary', report_type: 'compliance-summary', status: 'ready', created_at: new Date().toISOString() },
    { id: 2, title: 'Gap Remediation Tracker', report_type: 'gap-analysis', status: 'ready', created_at: new Date().toISOString() },
  ];

  state.assets = [
    { id: 1, name: 'Customer Data Platform', asset_type: 'application', criticality: 5, owner: 'Data Team' },
    { id: 2, name: 'Identity Provider', asset_type: 'infrastructure', criticality: 5, owner: 'Security Team' },
    { id: 3, name: 'Vendor Billing API', asset_type: 'vendor', criticality: 4, owner: 'Finance Ops' },
  ];
}

function mockOverviewFromState(state: MockDashboardState) {
  const totalGaps = state.gaps.length;
  const criticalGaps = state.gaps.filter((gap) => gap.severity === 'critical').length;
  const covered = state.gaps.filter((gap) => gap.status === 'covered' || gap.status === 'resolved').length;
  const complianceScore = totalGaps ? Math.round((covered / totalGaps) * 100) : 0;

  return {
    enabled_frameworks: state.enabledFrameworkIds.length,
    total_gaps: totalGaps,
    critical_gaps: criticalGaps,
    compliance_score: complianceScore,
  };
}

function mockRequest<T>(path: string, options: RequestOptions = {}): T | undefined {
  if (!USE_HARDCODED_DASHBOARD) {
    return undefined;
  }

  const method = options.method || 'GET';

  return withMockState((state) => {
    if (path === '/auth/login' && method === 'POST') {
      const body = (options.body || {}) as { username?: string };
      const email = body.username || 'user@hyperlynx.local';
      return {
        message: 'Login successful',
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 1,
          username: email,
          email,
          first_name: 'Demo',
          last_name: 'User',
        },
      } as T;
    }

    if (path === '/api/users/register/' && method === 'POST') {
      const body = (options.body || {}) as { email?: string; first_name?: string; last_name?: string };
      return {
        message: 'User registered',
        user: {
          id: 99,
          username: body.email || 'new.user@hyperlynx.local',
          email: body.email || 'new.user@hyperlynx.local',
          first_name: body.first_name || 'New',
          last_name: body.last_name || 'User',
        },
      } as T;
    }

    if (path === '/api/token/refresh/' && method === 'POST') {
      return { access: 'mock-access-token' } as T;
    }

    if (path === '/api/users/profile/' && method === 'GET') {
      return {
        id: 1,
        username: 'demo.user@hyperlynx.local',
        email: 'demo.user@hyperlynx.local',
        first_name: 'Demo',
        last_name: 'User',
      } as T;
    }

    if (path === '/api/users/profile/' && method === 'PUT') {
      const body = (options.body || {}) as { email?: string; first_name?: string; last_name?: string };
      return {
        message: 'Profile updated successfully',
        user: {
          id: 1,
          username: body.email || 'demo.user@hyperlynx.local',
          email: body.email || 'demo.user@hyperlynx.local',
          first_name: body.first_name || 'Demo',
          last_name: body.last_name || 'User',
        },
      } as T;
    }

    if (path === '/api/health') {
      return { status: 'success', message: 'Hyperlynx API (mock) is running', code: 200 } as T;
    }

    if (path === '/HL/content/v1/health') {
      return { status: 'healthy', provider: 'mock', llm: 'mock-llm' } as T;
    }

    if (path === '/admin/') {
      return {
        message: 'Admin Dashboard',
        stats: { total_frameworks: state.frameworksCatalog.length, total_users: state.users.length, api_status: 'mock' },
      } as T;
    }

    if (path === '/organization' && method === 'GET') {
      return state.organization as T;
    }

    if (path === '/organization' && method === 'POST') {
      const body = (options.body || {}) as { name?: string; industry?: string; country?: string };
      state.organization = {
        ...state.organization,
        name: body.name || state.organization.name,
        industry: body.industry || state.organization.industry,
        country: body.country || state.organization.country,
      };
      return state.organization as T;
    }

    if (path === '/users') {
      return { count: state.users.length, results: state.users } as T;
    }

    if (path === '/intelligence/questionnaire' && method === 'GET') {
      const questions = [
        { key: 'regulated_industry', question: 'Do you operate in a regulated industry?', weight: 3 },
        { key: 'handles_pii', question: 'Do you process personal data?', weight: 3 },
        { key: 'cloud_first', question: 'Are critical systems cloud hosted?', weight: 2 },
        { key: 'third_party_reliance', question: 'Do you depend on critical third parties?', weight: 2 },
        { key: 'global_operations', question: 'Do you operate across multiple jurisdictions?', weight: 2 },
      ];
      return {
        count: questions.length,
        results: questions.map((question) => ({ ...question, answer: state.questionnaireAnswers[question.key] || '' })),
      } as T;
    }

    if (path === '/intelligence/questionnaire/answers' && method === 'POST') {
      const body = (options.body || {}) as { answers?: Record<string, string> };
      state.questionnaireAnswers = { ...state.questionnaireAnswers, ...(body.answers || {}) };
      return { status: 'saved' } as T;
    }

    if (path === '/frameworks' && method === 'GET') {
      return {
        count: state.frameworksCatalog.length,
        results: state.frameworksCatalog,
      } as T;
    }

    if (path === '/frameworks/recommended') {
      const recommended = state.frameworksCatalog.slice(0, 3).map((framework) => ({ framework_id: framework.id, framework_name: framework.name }));
      return { count: recommended.length, results: recommended } as T;
    }

    if (path === '/frameworks/status') {
      return {
        count: state.frameworksCatalog.length,
        results: state.frameworksCatalog.map((framework) => ({
          framework_id: framework.id,
          status: state.enabledFrameworkIds.includes(framework.id) ? 'enabled' : 'disabled',
        })),
      } as T;
    }

    if (path === '/frameworks/enable' && method === 'POST') {
      const body = (options.body || {}) as { framework_id?: string };
      const frameworkId = body.framework_id || state.frameworksCatalog[0]?.id;
      if (frameworkId && !state.enabledFrameworkIds.includes(frameworkId)) {
        state.enabledFrameworkIds.push(frameworkId);
      }
      return { id: state.enabledFrameworkIds.length, framework_id: frameworkId || '', compliance_score: 78 } as T;
    }

    if (path === '/intelligence/framework-recommendation' && method === 'POST') {
      const recommended_frameworks = state.frameworksCatalog.slice(0, 3).map((framework) => ({ framework_id: framework.id, framework_name: framework.name }));
      return { recommended_frameworks, reasoning: ['Applicability responses indicate mixed regulatory + cybersecurity obligations.'] } as T;
    }

    if (path === '/intelligence/analyze-documents' && method === 'POST') {
      populateMockDashboard(state);
      return {
        documents_analyzed: state.documents.length,
        control_signals: { access_control: 7, incident_response: 5, privacy: 4 },
        coverage_observation: 'Policy corpus contains strong baseline controls with remediation opportunities.',
      } as T;
    }

    if (path === '/intelligence/gap-analysis' && method === 'POST') {
      populateMockDashboard(state);
      return {
        run_id: `run-${Date.now()}`,
        total_items: state.gaps.length,
        critical_items: state.gaps.filter((gap) => gap.severity === 'critical').length,
      } as T;
    }

    if (path === '/intelligence/generate-action-plan' && method === 'POST') {
      populateMockDashboard(state);
      return { generated_tasks: state.actionPlanTasks.length, tasks: state.actionPlanTasks } as T;
    }

    if (path === '/compliance/overview') {
      if (!state.populated) {
        return { enabled_frameworks: 0, total_gaps: 0, critical_gaps: 0, compliance_score: 0 } as T;
      }
      return mockOverviewFromState(state) as T;
    }

    if (path === '/gap-analysis') {
      return { count: state.gaps.length, results: state.gaps } as T;
    }

    if (path === '/gap-analysis/run' && method === 'POST') {
      populateMockDashboard(state);
      return { run_id: `gap-${Date.now()}`, count: state.gaps.length } as T;
    }

    if (path === '/risks') {
      return { count: state.risks.length, results: state.risks } as T;
    }

    if (path === '/action-plan/tasks' && method === 'GET') {
      return { count: state.actionPlanTasks.length, results: state.actionPlanTasks } as T;
    }

    if (path.startsWith('/action-plan/tasks/') && method === 'PATCH') {
      const taskId = Number(path.split('/').pop());
      const body = (options.body || {}) as { status?: 'todo' | 'in_progress' | 'done' };
      const task = state.actionPlanTasks.find((item) => item.id === taskId);
      if (task && body.status) {
        task.status = body.status;
      }
      return { id: taskId, status: task?.status || body.status || 'todo' } as T;
    }

    if (path === '/action-plan/generate' && method === 'POST') {
      populateMockDashboard(state);
      return { count: state.actionPlanTasks.length, results: state.actionPlanTasks } as T;
    }

    if (path === '/action-plan' && method === 'GET') {
      const done = state.actionPlanTasks.filter((task) => task.status === 'done').length;
      const total = state.actionPlanTasks.length;
      return {
        total_tasks: total,
        completed_tasks: done,
        completion_percent: total ? Math.round((done / total) * 100) : 0,
      } as T;
    }

    if (path === '/controls') {
      return { count: state.controls.length, results: state.controls } as T;
    }

    if (path === '/controls/mappings') {
      return { count: state.controlMappings.length, results: state.controlMappings } as T;
    }

    if (path.startsWith('/api/stored-libraries/') && path.endsWith('/content/')) {
      const libraryId = path.split('/')[3];
      const content = state.storedLibraryContents[libraryId] || { content: { objects: {} } };
      return { id: libraryId, ...state.storedLibraries.find((library) => library.id === libraryId), ...content } as T;
    }

    if (path.startsWith('/api/stored-libraries/')) {
      return { count: state.storedLibraries.length, results: state.storedLibraries } as T;
    }

    if (path === '/documents') {
      return { count: state.documents.length, results: state.documents } as T;
    }

    if (path === '/reports') {
      return { count: state.reports.length, results: state.reports } as T;
    }

    if (path === '/reports/generate' && method === 'POST') {
      const body = (options.body || {}) as { report_type?: string };
      const report = {
        id: state.reports.length + 1,
        title: `Generated ${body.report_type || 'compliance-summary'} report`,
        report_type: body.report_type || 'compliance-summary',
        status: 'ready',
        created_at: new Date().toISOString(),
      };
      state.reports.unshift(report);
      return report as T;
    }

    if (path === '/assets') {
      if (method === 'GET') {
        return { count: state.assets.length, results: state.assets } as T;
      }

      if (method === 'POST') {
        const body = (options.body || {}) as { name?: string; asset_type?: string; owner?: string; criticality?: number; description?: string };
        const asset = {
          id: state.assets.length + 1,
          name: body.name || `Asset ${state.assets.length + 1}`,
          asset_type: body.asset_type || 'application',
          owner: body.owner,
          description: body.description,
          criticality: body.criticality || 3,
        };
        state.assets.unshift(asset);
        return asset as T;
      }
    }

    return undefined;
  });
}

interface AuthRuntime {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onAccessToken: (accessToken: string) => void;
  onAuthFailure: () => void;
}

let authRuntime: AuthRuntime | null = null;

export function configureAuthRuntime(runtime: AuthRuntime | null) {
  authRuntime = runtime;
}

function shouldSkipAutoRefresh(path: string) {
  return path.includes('/auth/login') || path.includes('/api/users/register/') || path.includes('/api/token/refresh/');
}

async function tryRefreshAccessToken(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);
  return data?.access || null;
}

async function request<T>(path: string, options: RequestOptions = {}, retried = false): Promise<T> {
  const mocked = mockRequest<T>(path, options);
  if (typeof mocked !== 'undefined') {
    return mocked;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const resolvedToken = options.token ?? authRuntime?.getAccessToken() ?? null;

  if (resolvedToken) {
    headers.Authorization = `Bearer ${resolvedToken}`;
  }

  const method = options.method || 'GET';
  const makeUrl = (targetPath: string) => `${API_BASE_URL}${targetPath}`;

  const doFetch = async (targetPath: string) => {
    const response = await fetch(makeUrl(targetPath), {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  };

  let { response, data } = await doFetch(path);

  if (response.status === 404 && method === 'GET') {
    const alternatePath = path.endsWith('/') ? path.slice(0, -1) : `${path}/`;
    const retryResult = await doFetch(alternatePath);
    if (retryResult.response.ok) {
      response = retryResult.response;
      data = retryResult.data;
    }
  }

  if (response.status === 401 && !retried && !shouldSkipAutoRefresh(path) && authRuntime) {
    const refreshToken = authRuntime.getRefreshToken();

    if (refreshToken) {
      const newAccessToken = await tryRefreshAccessToken(refreshToken);

      if (newAccessToken) {
        authRuntime.onAccessToken(newAccessToken);
        return request<T>(path, { ...options, token: newAccessToken }, true);
      }
    }

    authRuntime.onAuthFailure();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed: ${response.status} (${method} ${path})`;
    throw new Error(message);
  }

  return data as T;
}

export interface HealthResponse {
  status: string;
  message: string;
  code: number;
}

export interface FrameworkLibrarySummary {
  filename: string;
  name: string;
  size: number;
}

export interface FrameworkLibraryListResponse {
  status: string;
  count: number;
  data: FrameworkLibrarySummary[];
  code: number;
}

export interface FrameworkLibraryDetailResponse {
  status: string;
  data: Record<string, unknown>;
  code: number;
}

export interface StoredLibrarySummary {
  id: string;
  urn: string;
  ref_id?: string;
  locale?: string;
  name: string;
  description?: string;
  is_loaded?: boolean;
  object_type?: string;
}

export interface StoredLibraryListResponse {
  count: number;
  results: StoredLibrarySummary[];
}

export interface StoredLibraryContentResponse extends StoredLibrarySummary {
  content?: {
    objects?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AdminDashboardResponse {
  message: string;
  stats: {
    total_frameworks: number;
    total_users: number;
    api_status: string;
  };
}

export interface AIGenerateResponse {
  success: boolean;
  response: string;
  frameworks: string[];
  documents_analyzed: number;
  error?: string;
  upload_errors?: Array<{ filename: string; error: string }>;
}

export interface AIHealthResponse {
  status: string;
  provider: string;
  llm: string;
}

export const hyperlynxApi = {
  isDemoMode() {
    return DEMO_MODE;
  },

  async health() {
    return request<HealthResponse>('/api/health');
  },

  async adminDashboard() {
    return request<AdminDashboardResponse>('/admin/');
  },

  async listFrameworkLibraries() {
    return request<FrameworkLibraryListResponse>('/api/framework-library');
  },

  async getFrameworkLibrary(name: string) {
    const query = encodeURIComponent(name);
    return request<FrameworkLibraryDetailResponse>(`/api/framework-library?name=${query}`);
  },

  async createFrameworkLibrary(filename: string, content: Record<string, unknown>, token: string) {
    return request<{ message: string; filename: string }>('/api/framework-library/', {
      method: 'POST',
      token,
      body: { filename, content },
    });
  },

  async updateFrameworkLibrary(filename: string, content: Record<string, unknown>, token: string) {
    const safeFilename = encodeURIComponent(filename);
    return request<{ message: string; filename: string }>(`/api/framework-library/${safeFilename}`, {
      method: 'PUT',
      token,
      body: { content },
    });
  },

  async deleteFrameworkLibrary(filename: string, token: string) {
    const safeFilename = encodeURIComponent(filename);
    return request<{ message: string; filename: string }>(`/api/framework-library/${safeFilename}`, {
      method: 'DELETE',
      token,
    });
  },

  async register(email: string, password: string, name: string) {
    const [firstName = '', ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    return request<{ message: string; user: UserProfile }>('/api/users/register/', {
      method: 'POST',
      body: {
        username: email,
        email,
        password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
      },
    });
  },

  async login(username: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
  },

  async getProfile(token: string) {
    return request<UserProfile>('/api/users/profile/', { token });
  },

  async updateProfile(token: string, payload: { email?: string; first_name?: string; last_name?: string }) {
    return request<{ message: string; user: UserProfile }>('/api/users/profile/', {
      method: 'PUT',
      token,
      body: payload,
    });
  },

  async refreshAccessToken(refreshToken: string) {
    return request<{ access: string }>('/api/token/refresh/', {
      method: 'POST',
      token: refreshToken,
      body: { refresh: refreshToken },
    });
  },

  // AI Services
  async aiHealth() {
    return request<AIHealthResponse>('/HL/content/v1/health');
  },

  async generateAnalysis(queryText: string, files?: File[], token?: string) {
    if (USE_HARDCODED_DASHBOARD) {
      return withMockState((state) => {
        if (files?.length) {
          files.forEach((file, index) => {
            state.documents.push({
              id: state.documents.length + index + 1,
              filename: file.name,
              extracted_text_preview: `Extracted summary from ${file.name}`,
            });
          });
        }
        populateMockDashboard(state);
        return {
          success: true,
          response: `Mock analysis completed for query: ${queryText}`,
          frameworks: state.enabledFrameworkIds,
          documents_analyzed: state.documents.length,
        } as AIGenerateResponse;
      });
    }

    const formData = new FormData();
    formData.append('query', queryText);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    // Use fetch directly for FormData uploads
    const headers: Record<string, string> = {};
    const resolvedToken = token ?? authRuntime?.getAccessToken() ?? null;

    if (resolvedToken) {
      headers.Authorization = `Bearer ${resolvedToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/HL/content/v1/generate`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.error || data?.message || `Request failed: ${response.status}`;
      throw new Error(message);
    }

    return data as AIGenerateResponse;
  },

  // GRC APIs
  async getComplianceOverview() {
    try {
      const data = await request<{
        enabled_frameworks: number;
        total_gaps: number;
        critical_gaps: number;
        compliance_score: number;
      }>('/compliance/overview');

      if (!isDashboardSeeded()) return data;
      if (data.enabled_frameworks || data.total_gaps || data.critical_gaps || data.compliance_score) return data;

      const fallback = getSeededFallbackState();
      return mockOverviewFromState(fallback);
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load overview');
      return mockOverviewFromState(getSeededFallbackState());
    }
  },

  async getFrameworks() {
    try {
      const data = await request<{
        count: number;
        results: Array<{ id: string; name: string; ref_id: string; description?: string }>;
      }>('/frameworks');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.frameworksCatalog.length, results: fallback.frameworksCatalog };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load frameworks');
      const fallback = getSeededFallbackState();
      return { count: fallback.frameworksCatalog.length, results: fallback.frameworksCatalog };
    }
  },

  async enableFramework(frameworkId: string) {
    return request<{ id: number; framework_id: string; compliance_score?: number }>(
      '/frameworks/enable',
      {
        method: 'POST',
        body: { framework_id: frameworkId },
      }
    );
  },

  async runGapAnalysis() {
    return request<{ run_id: string; count: number }>('/gap-analysis/run', {
      method: 'POST',
      body: {},
    });
  },

  async getGapAnalysis(frameworkId?: string) {
    const path = frameworkId ? `/gap-analysis?framework_id=${frameworkId}` : '/gap-analysis';
    try {
      const data = await request<{
        count: number;
        results: Array<{
          id: number;
          control_name: string;
          framework_id: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status: 'missing' | 'covered' | 'in_progress' | 'resolved';
          recommendation: string;
          gap_score?: number;
        }>;
      }>(path);

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.gaps.length, results: fallback.gaps };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load gaps');
      const fallback = getSeededFallbackState();
      return { count: fallback.gaps.length, results: fallback.gaps };
    }
  },

  async getRisks() {
    try {
      const data = await request<{
        count: number;
        results: Array<{
          id: number;
          title?: string;
          name?: string;
          description: string;
          likelihood: number;
          impact: number;
          status: string;
        }>;
      }>('/risks');

      const normalized = {
        ...data,
        results: (data.results || []).map((risk) => ({
          ...risk,
          title: risk.title || risk.name || 'Untitled Risk',
        })),
      };

      if (!isDashboardSeeded()) return normalized;
      if (normalized.results?.length) return normalized;

      const fallback = getSeededFallbackState();
      return { count: fallback.risks.length, results: fallback.risks };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load risks');
      const fallback = getSeededFallbackState();
      return { count: fallback.risks.length, results: fallback.risks };
    }
  },

  async createRisk(payload: {
    name: string;
    description?: string;
    likelihood?: number;
    impact?: number;
    framework?: string;
    status?: string;
    owner?: string;
    asset_ids?: number[];
  }) {
    return request<Record<string, unknown>>('/risks', {
      method: 'POST',
      body: payload,
    });
  },

  async getAssets() {
    try {
      const data = await request<{
        count: number;
        results: Array<{
          id: number;
          name: string;
          asset_type: string;
          criticality: number;
          owner?: string;
          description?: string;
        }>;
      }>('/assets');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.assets.length, results: fallback.assets };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load assets');
      const fallback = getSeededFallbackState();
      return { count: fallback.assets.length, results: fallback.assets };
    }
  },

  async createAsset(payload: {
    name: string;
    asset_type: string;
    owner?: string;
    criticality?: number;
    description?: string;
  }) {
    return request<Record<string, unknown>>('/assets', {
      method: 'POST',
      body: payload,
    });
  },

  async getActionPlan() {
    try {
      const data = await request<{
        count: number;
        results: Array<{
          id: number;
          title: string;
          description: string;
          status: 'todo' | 'in_progress' | 'done';
          due_date: string;
          priority: 'low' | 'medium' | 'high' | 'critical';
        }>;
      }>('/action-plan/tasks');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.actionPlanTasks.length, results: fallback.actionPlanTasks };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load action plan');
      const fallback = getSeededFallbackState();
      return { count: fallback.actionPlanTasks.length, results: fallback.actionPlanTasks };
    }
  },

  async getActionPlanSummary() {
    try {
      const data = await request<{
        total_tasks: number;
        completed_tasks: number;
        completion_percent: number;
      }>('/action-plan');

      if (!isDashboardSeeded()) return data;
      if (data.total_tasks) return data;

      const fallback = getSeededFallbackState();
      const total = fallback.actionPlanTasks.length;
      const done = fallback.actionPlanTasks.filter((task) => task.status === 'done').length;
      return { total_tasks: total, completed_tasks: done, completion_percent: total ? Math.round((done / total) * 100) : 0 };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load action plan summary');
      const fallback = getSeededFallbackState();
      const total = fallback.actionPlanTasks.length;
      const done = fallback.actionPlanTasks.filter((task) => task.status === 'done').length;
      return { total_tasks: total, completed_tasks: done, completion_percent: total ? Math.round((done / total) * 100) : 0 };
    }
  },

  async generateActionPlan() {
    return request<{ count: number; results: Array<Record<string, unknown>> }>('/action-plan/generate', {
      method: 'POST',
      body: {},
    });
  },

  async createActionPlanTask(title: string, description: string, dueDate: string) {
    return request<{ id: number; title: string; status: string }>(
      '/action-plan/generate',
      {
        method: 'POST',
        body: { title, description, due_date: dueDate },
      }
    );
  },

  async updateActionPlanTask(taskId: number, status: string) {
    return request<{ id: number; status: string }>(`/action-plan/tasks/${taskId}`, {
      method: 'PATCH',
      body: { status },
    });
  },

  async getControls(frameworkId?: string) {
    const path = frameworkId ? `/controls?framework_id=${encodeURIComponent(frameworkId)}` : '/controls';
    try {
      const data = await request<{ count: number; results: Array<Record<string, unknown>> }>(path);

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.controls.length, results: fallback.controls };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load controls');
      const fallback = getSeededFallbackState();
      return { count: fallback.controls.length, results: fallback.controls };
    }
  },

  async getControlMappings() {
    try {
      const data = await request<{ count: number; results: Array<Record<string, unknown>> }>('/controls/mappings');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.controlMappings.length, results: fallback.controlMappings };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load control mappings');
      const fallback = getSeededFallbackState();
      return { count: fallback.controlMappings.length, results: fallback.controlMappings };
    }
  },

  async getRecommendedFrameworks() {
    try {
      const data = await request<{ count: number; results: Array<{ framework_id: string; framework_name: string }> }>(
        '/frameworks/recommended'
      );

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      const recommended = fallback.frameworksCatalog.slice(0, 3).map((framework) => ({ framework_id: framework.id, framework_name: framework.name }));
      return { count: recommended.length, results: recommended };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load recommended frameworks');
      const fallback = getSeededFallbackState();
      const recommended = fallback.frameworksCatalog.slice(0, 3).map((framework) => ({ framework_id: framework.id, framework_name: framework.name }));
      return { count: recommended.length, results: recommended };
    }
  },

  async getFrameworkStatus() {
    try {
      const data = await request<{ count: number; results: Array<Record<string, unknown>> }>('/frameworks/status');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return {
        count: fallback.frameworksCatalog.length,
        results: fallback.frameworksCatalog.map((framework) => ({ framework_id: framework.id, status: 'enabled' })),
      };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load framework status');
      const fallback = getSeededFallbackState();
      return {
        count: fallback.frameworksCatalog.length,
        results: fallback.frameworksCatalog.map((framework) => ({ framework_id: framework.id, status: 'enabled' })),
      };
    }
  },

  async getIntelligenceQuestionnaire() {
    return request<{
      count: number;
      results: Array<{ key: string; question: string; weight: number; answer?: string }>;
    }>('/intelligence/questionnaire');
  },

  async saveIntelligenceQuestionnaire(answers: Record<string, string>) {
    return request<{ status: string }>('/intelligence/questionnaire/answers', {
      method: 'POST',
      body: { answers },
    });
  },

  async getIntelligenceProfile() {
    return request<Record<string, unknown>>('/intelligence/profile');
  },

  async analyzeCompany() {
    return request<Record<string, unknown>>('/intelligence/analyze-company', {
      method: 'POST',
      body: {},
    });
  },

  async getFrameworkRecommendation() {
    return request<{
      recommended_frameworks: Array<{ framework_id: string; framework_name: string }>;
      reasoning?: string[];
    }>('/intelligence/framework-recommendation', {
      method: 'POST',
      body: {},
    });
  },

  async analyzeDocumentsIntelligence(documentIds?: number[]) {
    return request<{
      documents_analyzed: number;
      control_signals: Record<string, number>;
      coverage_observation: string;
    }>('/intelligence/analyze-documents', {
      method: 'POST',
      body: documentIds?.length ? { document_ids: documentIds } : {},
    });
  },

  async runIntelligenceGapAnalysis() {
    return request<{ run_id?: string; total_items: number; critical_items: number }>('/intelligence/gap-analysis', {
      method: 'POST',
      body: {},
    });
  },

  async runIntelligenceRiskAssessment() {
    return request<{
      count: number;
      results: Array<{
        name: string;
        framework?: string;
        likelihood: number;
        impact: number;
        score?: number;
      }>;
    }>('/intelligence/risk-assessment', {
      method: 'POST',
      body: {},
    });
  },

  async generateIntelligenceActionPlan() {
    return request<{ generated_tasks: number; tasks: Array<Record<string, unknown>> }>(
      '/intelligence/generate-action-plan',
      {
        method: 'POST',
        body: {},
      }
    );
  },

  async listUsers() {
    try {
      const data = await request<{ count: number; results: Array<Record<string, unknown>> }>('/users');
      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;
      const fallback = getSeededFallbackState();
      return { count: fallback.users.length, results: fallback.users };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load users');
      const fallback = getSeededFallbackState();
      return { count: fallback.users.length, results: fallback.users };
    }
  },

  async getReports() {
    try {
      const data = await request<{
        count: number;
        results: Array<Record<string, unknown>>;
      }>('/reports');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.reports.length, results: fallback.reports };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load reports');
      const fallback = getSeededFallbackState();
      return { count: fallback.reports.length, results: fallback.reports };
    }
  },

  async generateReport(reportType = 'compliance-summary') {
    return request<Record<string, unknown>>('/reports/generate', {
      method: 'POST',
      body: { report_type: reportType },
    });
  },

  async getOrganization() {
    try {
      return await request<{
        id: number;
        name: string;
        industry?: string;
        country?: string;
        size?: string;
      }>('/organization');
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load organization');
      const fallback = getSeededFallbackState();
      return fallback.organization;
    }
  },

  async createOrganization(name: string, industry?: string, country?: string) {
    return request<{ id: number; name: string; industry?: string; country?: string }>(
      '/organization',
      {
        method: 'POST',
        body: { name, industry, country },
      }
    );
  },

  async uploadDocument(formData: FormData) {
    if (USE_HARDCODED_DASHBOARD) {
      return withMockState((state) => {
        const uploaded = formData.getAll('files');
        uploaded.forEach((item, index) => {
          if (item instanceof File) {
            state.documents.push({
              id: state.documents.length + index + 1,
              filename: item.name,
              extracted_text_preview: `Mock extracted text preview for ${item.name}`,
            });
          }
        });
        return {
          count: uploaded.length,
          results: state.documents,
        };
      });
    }

    const headers: Record<string, string> = {};
    const resolvedToken = authRuntime?.getAccessToken() ?? null;

    if (resolvedToken) {
      headers.Authorization = `Bearer ${resolvedToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.error || data?.message || `Upload failed: ${response.status}`;
      throw new Error(message);
    }

    return data;
  },

  async getDocuments() {
    try {
      const data = await request<{
        count: number;
        results: Array<{ id: number; filename: string; extracted_text_preview?: string }>;
      }>('/documents');

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.documents.length, results: fallback.documents };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load documents');
      const fallback = getSeededFallbackState();
      return { count: fallback.documents.length, results: fallback.documents };
    }
  },

  async listStoredLibraries(params?: { limit?: number; offset?: number; isLoaded?: boolean; objectType?: string }) {
    const query = new URLSearchParams();
    if (typeof params?.limit === 'number') query.set('limit', String(params.limit));
    if (typeof params?.offset === 'number') query.set('offset', String(params.offset));
    if (typeof params?.isLoaded === 'boolean') query.set('is_loaded', String(params.isLoaded));
    if (params?.objectType) query.set('object_type', params.objectType);
    const suffix = query.toString() ? `?${query.toString()}` : '';

    try {
      const data = await request<StoredLibraryListResponse>(`/api/stored-libraries/${suffix}`);

      if (!isDashboardSeeded()) return data;
      if (data.results?.length) return data;

      const fallback = getSeededFallbackState();
      return { count: fallback.storedLibraries.length, results: fallback.storedLibraries };
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load stored libraries');
      const fallback = getSeededFallbackState();
      return { count: fallback.storedLibraries.length, results: fallback.storedLibraries };
    }
  },

  async getStoredLibraryContent(libraryId: string) {
    const safeId = encodeURIComponent(libraryId);

    try {
      return await request<StoredLibraryContentResponse>(`/api/stored-libraries/${safeId}/content/`);
    } catch {
      if (!isDashboardSeeded()) throw new Error('Failed to load stored library content');
      const fallback = getSeededFallbackState();
      const foundLibrary = fallback.storedLibraries.find((library) => library.id === libraryId);
      const content = fallback.storedLibraryContents[libraryId] || { content: { objects: {} } };
      return {
        id: libraryId,
        urn: foundLibrary?.urn || libraryId,
        ref_id: foundLibrary?.ref_id,
        name: foundLibrary?.name || libraryId,
        description: foundLibrary?.description,
        is_loaded: foundLibrary?.is_loaded,
        object_type: foundLibrary?.object_type,
        content: content.content,
      };
    }
  },

  markDashboardSeeded(seed = true) {
    setDashboardSeeded(seed);
  },

  setApplicabilityFrameworkSelections(payload: { applicable: string[]; optional: string[] }) {
    setApplicabilityFrameworksStore({
      applicable: Array.from(new Set(payload.applicable)),
      optional: Array.from(new Set(payload.optional)),
    });
  },

  getApplicabilityFrameworkSelections() {
    return getApplicabilityFrameworksStore();
  },

  isDashboardSeeded() {
    return isDashboardSeeded();
  },

  async populateHardcodedDashboard() {
    if (!USE_HARDCODED_DASHBOARD) {
      return { populated: false };
    }

    return withMockState((state) => {
      populateMockDashboard(state);
      return { populated: true };
    });
  },
};
