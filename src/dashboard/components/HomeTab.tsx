import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Database, Shield, FileText, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { hyperlynxApi, type FrameworkLibrarySummary } from '../services/hyperlynxApi';
import { useAnalysis } from './AnalysisContext';

interface HomeTabProps {
  onNavigate: (view: string) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  const [frameworks, setFrameworks] = useState<FrameworkLibrarySummary[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { analysisResults } = useAnalysis();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [libraries, admin] = await Promise.all([
          hyperlynxApi.listFrameworkLibraries(),
          hyperlynxApi.adminDashboard().catch(() => null),
        ]);

        setFrameworks(libraries.data || []);
        setUsersCount(admin?.stats?.total_users ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const totalSizeBytes = useMemo(
    () => frameworks.reduce((acc, item) => acc + (item.size || 0), 0),
    [frameworks]
  );

  const totalSizeMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  const recentLibraries = frameworks.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl mb-2">Dashboard</h2>
        <p className="text-gray-600 text-sm lg:text-base">Live data from your Flask backend APIs</p>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* GRC Quick Access */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">GRC Dashboard</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'compliance', label: 'Compliance', icon: '✓' },
            { id: 'gap-analysis', label: 'Gaps', icon: '⚠️' },
            { id: 'risk-assessment', label: 'Risks', icon: '🔥' },
            { id: 'action-plan', label: 'Actions', icon: '✅' },
            { id: 'policy-documents', label: 'Documents', icon: '📄' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-center"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-xs font-medium text-gray-700">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{loading ? '...' : frameworks.length}</div>
              <p className="text-xs lg:text-sm text-gray-600">Framework Libraries</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{totalSizeMb}MB</div>
              <p className="text-xs lg:text-sm text-gray-600">Library Storage</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{usersCount}</div>
              <p className="text-xs lg:text-sm text-gray-600">Registered Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* GRC Elements from Analysis */}
      {analysisResults && (
        <>
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg lg:text-xl">Compliance Analysis Results</h3>
                  <p className="text-sm text-gray-500">
                    Analyzed {analysisResults.documents_analyzed} document{analysisResults.documents_analyzed > 1 ? 's' : ''} • 
                    {' '}{new Date(analysisResults.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button onClick={() => onNavigate('reasoning')} variant="outline" size="sm">
                View Full Report
              </Button>
            </div>

            {/* Framework Tags */}
            {analysisResults.frameworks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {analysisResults.frameworks.map((fw, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                    {fw}
                  </Badge>
                ))}
              </div>
            )}

            {/* GRC Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Requirements</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {analysisResults.grcElements.filter(e => e.type === 'requirement').length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Controls</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {analysisResults.grcElements.filter(e => e.type === 'control').length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('gaps')}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700 font-medium">Gaps</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {analysisResults.grcElements.filter(e => e.type === 'gap').length}
                </p>
                <p className="text-xs text-red-600 mt-2">Click to view details</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-700 font-medium">Total Elements</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {analysisResults.grcElements.length}
                </p>
              </div>
            </div>

            {/* GRC Elements List */}
            {analysisResults.grcElements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Findings</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisResults.grcElements.slice(0, 10).map((element) => (
                    <div
                      key={element.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        element.type === 'gap' ? 'bg-red-500' :
                        element.type === 'control' ? 'bg-blue-500' :
                        element.type === 'requirement' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">{element.title}</p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs flex-shrink-0 ${
                              element.type === 'gap' ? 'bg-red-100 text-red-700' :
                              element.type === 'control' ? 'bg-blue-100 text-blue-700' :
                              element.type === 'requirement' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {element.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{element.framework}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{element.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {analysisResults.grcElements.length > 10 && (
                  <Button 
                    variant="link" 
                    onClick={() => onNavigate('gaps')} 
                    className="w-full mt-2 text-sm"
                  >
                    View detailed gap assessment →
                  </Button>
                )}
              </div>
            )}

            {analysisResults.grcElements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No specific GRC elements extracted yet.</p>
                <p className="text-xs mt-1">Upload more detailed compliance documents for better analysis.</p>
              </div>
            )}
          </Card>
        </>
      )}

      {/* CTA Card if no analysis */}
      {!analysisResults && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Compliance Analysis
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your compliance documents and let AI identify requirements, controls, and gaps across frameworks like DORA, NIS2, ISO 27001, and more.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => onNavigate('documents')}>
                  Upload Documents
                </Button>
                <Button variant="outline" onClick={() => onNavigate('reasoning')}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg lg:text-xl">Recent Libraries</h3>
          <Button variant="link" onClick={() => onNavigate('libraries')} className="text-xs lg:text-sm">Open Libraries</Button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading frameworks...</p>
        ) : recentLibraries.length === 0 ? (
          <p className="text-sm text-gray-500">No framework libraries found in backend.</p>
        ) : (
          <div className="space-y-2">
            {recentLibraries.map((item) => (
              <div key={item.filename} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm">{item.filename}</p>
                  <p className="text-xs text-gray-500">{item.name}</p>
                </div>
                <Badge variant="secondary">{Math.round(item.size / 1024)} KB</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
