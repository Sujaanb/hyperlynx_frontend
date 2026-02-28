import React, { useEffect, useState } from 'react';
import { ArrowLeft, ClipboardCheck, Target } from 'lucide-react';
import { hyperlynxApi } from '../services/hyperlynxApi';

type ControlRow = Record<string, unknown>;

type SelectedControl = {
  title: string;
  framework: string;
  severity: string;
  description: string;
  source: 'gap' | 'library';
};

function normalize(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function extractYamlControls(content: Record<string, unknown> | undefined, libraryName: string) {
  const objects = (content?.objects as Record<string, unknown> | undefined) || {};
  const referenceControls = Array.isArray(objects.reference_controls)
    ? (objects.reference_controls as Array<Record<string, unknown>>)
    : [];

  const fromReferenceControls = referenceControls
    .map((control) => ({
      id: control.id || control.urn || control.ref_id || `${libraryName}:${control.name || 'control'}`,
      ref_id: control.ref_id,
      name: control.name || control.ref_id || control.id,
      description: control.description || control.annotation || '',
      library_urn: control.library_urn || control.library || libraryName,
      category: control.category || 'general',
      csf_function: control.csf_function || '',
      source: 'yaml-library',
    }))
    .filter((control) => !!normalize(control.name));

  const framework = (objects.framework as Record<string, unknown> | undefined) || {};
  const requirementNodes = Array.isArray(framework.requirement_nodes)
    ? (framework.requirement_nodes as Array<Record<string, unknown>>)
    : [];

  const fromRequirements = requirementNodes
    .filter((node) => !!normalize(node.assessable ?? true) && !!normalize(node.name || node.ref_id))
    .map((node) => ({
      id: node.id || node.urn || node.ref_id || `${libraryName}:${node.name || 'requirement'}`,
      ref_id: node.ref_id,
      name: node.name || node.ref_id,
      description: node.description || '',
      library_urn: libraryName,
      category: 'requirement',
      csf_function: '',
      source: 'yaml-library',
    }));

  return [...fromReferenceControls, ...fromRequirements] as ControlRow[];
}

export function GrcControls({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [controls, setControls] = useState<ControlRow[]>([]);
  const [mappings, setMappings] = useState<Array<Record<string, unknown>>>([]);
  const [gapControls, setGapControls] = useState<Array<{ control: string; framework: string; severity: string; recommendation: string }>>([]);
  const [selectedControl, setSelectedControl] = useState<SelectedControl | null>(null);
  const [yamlControlCount, setYamlControlCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [controlsResp, mappingsResp, gapsResp, librariesResp] = await Promise.all([
          hyperlynxApi.getControls(),
          hyperlynxApi.getControlMappings(),
          hyperlynxApi.getGapAnalysis(),
          hyperlynxApi.listStoredLibraries({ limit: 80, objectType: 'framework' }).catch(() => ({ count: 0, results: [] })),
        ]);

        setMappings(mappingsResp.results || []);

        const unresolved = (gapsResp.results || []).filter((row) => row.status !== 'covered' && row.status !== 'resolved');
        const required = unresolved.map((row) => ({
          control: String((row as unknown as Record<string, unknown>).control_name || (row as unknown as Record<string, unknown>).control_id || ''),
          framework: String(row.framework_id || ''),
          severity: String(row.severity || 'medium'),
          recommendation: String((row as unknown as Record<string, unknown>).recommendation || 'Implement control and provide evidence.'),
        }));
        setGapControls(required);

        const gapFrameworkHints = new Set(unresolved.map((row) => normalize(row.framework_id)).filter(Boolean));
        const libraryCandidates = (librariesResp.results || []).filter((library) => {
          if (library.is_loaded) return true;
          const key = `${normalize(library.name)} ${normalize(library.urn)} ${normalize(library.ref_id)}`;
          if (!gapFrameworkHints.size) return false;
          return Array.from(gapFrameworkHints).some((hint) => key.includes(hint));
        });

        const selectedLibraries = (libraryCandidates.length ? libraryCandidates : (librariesResp.results || []).slice(0, 12)).slice(0, 24);

        const yamlContents = await Promise.all(
          selectedLibraries.map(async (library) => {
            try {
              const content = await hyperlynxApi.getStoredLibraryContent(library.id);
              return { library, content };
            } catch {
              return null;
            }
          })
        );

        const yamlControls = yamlContents.flatMap((entry) => {
          if (!entry) return [];
          return extractYamlControls(entry.content.content, entry.library.name);
        });

        setYamlControlCount(yamlControls.length);

        const mergedByKey = new Map<string, ControlRow>();
        for (const control of controlsResp.results || []) {
          const key = `${normalize(control.name || control.control_name)}::${normalize(control.library_urn || control.framework_id || '')}`;
          if (!key.startsWith('::')) mergedByKey.set(key, control);
        }
        for (const control of yamlControls) {
          const key = `${normalize(control.name || control.control_name)}::${normalize(control.library_urn || control.framework_id || '')}`;
          if (!key.startsWith('::')) {
            mergedByKey.set(key, { ...control, ...(mergedByKey.get(key) || {}) });
          }
        }

        setControls(Array.from(mergedByKey.values()));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <div className="p-6 bg-white border rounded-lg">Loading controls…</div>;

  if (selectedControl) {
    const controlSteps = selectedControl.description
      .split(/\n|;|\.|\u2022|•/)
      .map((step) => step.trim())
      .filter(Boolean);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed Control Analysis</h1>
            <p className="text-gray-600 text-sm mt-1">{selectedControl.framework}</p>
          </div>
          <button
            onClick={() => setSelectedControl(null)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Controls
          </button>
        </div>

        <div className="bg-white border rounded-lg p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedControl.title}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{selectedControl.framework}</span>
              <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">{selectedControl.severity}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Source</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{selectedControl.source === 'gap' ? 'Gap Remediation' : 'Control Library'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Framework</p>
              <p className="text-base font-semibold text-gray-900 mt-1 break-words">{selectedControl.framework}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Priority</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{selectedControl.severity}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" /> Control Description
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedControl.description || 'No description available.'}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-green-600" /> Implementation Steps
            </p>
            {controlSteps.length > 0 ? (
              <ul className="space-y-2">
                {controlSteps.map((step, idx) => (
                  <li key={`${selectedControl.title}-${idx}`} className="text-sm text-gray-700 flex gap-2">
                    <span className="font-bold text-green-600">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No step-by-step guidance available.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Controls</h1>
        <p className="text-sm text-gray-600 mt-1">Control catalog and cross-framework mappings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition" onClick={() => onNavigate?.('framework-advisor')}><p className="text-xs text-gray-500">Control Library (YAML + Loaded)</p><p className="text-2xl font-bold">{controls.length}</p><p className="text-[11px] text-gray-500 mt-1">{yamlControlCount} from libraries YAML</p></div>
        <div className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition" onClick={() => onNavigate?.('compliance')}><p className="text-xs text-gray-500">Mappings</p><p className="text-2xl font-bold">{mappings.length}</p></div>
        <div className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition" onClick={() => onNavigate?.('gap-analysis')}><p className="text-xs text-gray-500">Required for Open Gaps</p><p className="text-2xl font-bold">{gapControls.length}</p></div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-900">Controls Required to Close Gaps</div>
        <div className="max-h-[380px] overflow-auto">
          {gapControls.length ? (
            gapControls.map((row, idx) => (
              <div
                key={`${row.control}-${idx}`}
                className="px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 transition"
                onClick={() =>
                  setSelectedControl({
                    title: row.control,
                    framework: row.framework,
                    severity: row.severity,
                    description: row.recommendation,
                    source: 'gap',
                  })
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{row.control}</p>
                  <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">{row.severity}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Framework: {row.framework}</p>
                <p className="text-xs text-gray-700 mt-1">{row.recommendation}</p>
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-sm text-gray-500">Run analysis to populate required controls from gaps.</div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-900">Full Control Library</div>
        <div className="max-h-[480px] overflow-auto">
          {controls.slice(0, 300).map((row, idx) => (
            <div
              key={idx}
              className="px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 transition"
              onClick={() =>
                setSelectedControl({
                  title: String(row.name || row.control_name || `Control ${idx + 1}`),
                  framework: String(row.library_urn || row.framework_id || row.category || 'General'),
                  severity: 'medium',
                  description: String(row.description || 'No description available for this control.'),
                  source: 'library',
                })
              }
            >
              <p className="font-medium text-gray-900">{String(row.name || row.control_name || `Control ${idx + 1}`)}</p>
              <p className="text-xs text-gray-500">{String(row.library_urn || row.framework_id || row.category || 'General')}</p>
              {row.description ? <p className="text-xs text-gray-700 mt-1">{String(row.description)}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
