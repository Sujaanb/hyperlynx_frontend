import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Shield, Upload, Play, Loader2, FileText, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { toast } from 'sonner@2.0.3';
import { hyperlynxApi } from '../services/hyperlynxApi';
import { useAnalysis, type GRCElement } from './AnalysisContext';
import type { ApplicabilityResults } from './ApplicabilityModule';

interface ReasoningModuleProps {
  applicabilityResults: ApplicabilityResults;
  onNavigate: (view: string) => void;
}

export function ReasoningModule({ applicabilityResults, onNavigate }: ReasoningModuleProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    uploadedFiles, 
    setUploadedFiles, 
    analysisResults, 
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing 
  } = useAnalysis();

  // Gap Analysis State
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from context on mount
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setLocalFiles(uploadedFiles);
    }
  }, [uploadedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setLocalFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const parseGRCElements = (response: string, frameworks: string[]): GRCElement[] => {
    // Parse the AI response to extract GRC elements
    const elements: GRCElement[] = [];
    
    // Simple parsing logic - can be enhanced based on actual response format
    const lines = response.split('\n');
    let currentFramework = frameworks[0] || 'General';
    
    lines.forEach((line, index) => {
      // Detect requirements/controls
      if (line.match(/^[-*]\s*(requirement|control|requirement|gap)/i)) {
        const match = line.match(/^[-*]\s*(\w+):\s*(.+)/i);
        if (match) {
          const type = match[1].toLowerCase();
          const description = match[2];
          
          elements.push({
            id: `grc-${index}`,
            type: (type.includes('gap') ? 'gap' : type.includes('control') ? 'control' : 'requirement') as any,
            framework: currentFramework,
            title: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
            description: description,
            status: type.includes('gap') ? 'non-compliant' : 'not-assessed',
            priority: 'medium',
          });
        }
      }
      
      // Detect framework mentions
      frameworks.forEach(fw => {
        if (line.toLowerCase().includes(fw.toLowerCase())) {
          currentFramework = fw;
        }
      });
    });
    
    return elements;
  };

  const handleGapAssessment = async () => {
    if (localFiles.length === 0) {
      toast.error('Please upload at least one document first');
      return;
    }

    setIsAnalyzing(true);

    const questionToAsk = customQuestion.trim() || 
      'Perform a detailed gap assessment and identify all compliance requirements, controls, and gaps from these documents.';

    try {
      const result = await hyperlynxApi.generateAnalysis(questionToAsk, localFiles);

      if (result.success && result.response) {
        // Parse GRC elements from the response
        const grcElements = parseGRCElements(result.response, result.frameworks || []);
        
        // Store results in context
        const analysisData = {
          summary: result.response,
          frameworks: result.frameworks || [],
          documents_analyzed: result.documents_analyzed || localFiles.length,
          grcElements,
          timestamp: new Date().toISOString(),
          uploadedFiles: localFiles,
        };
        
        setAnalysisResults(analysisData);
        setUploadedFiles(localFiles);
        
        toast.success('Gap assessment completed successfully');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Gap assessment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to perform gap assessment');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView="reasoning"
          onNavigate={onNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl mb-2">Compliance Reasoning & Gap Analysis</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Upload your policy documents to identify compliance gaps with AI.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">AI-Powered Gap Assessment</h2>
                  <p className="text-gray-600">Upload your existing policy or audit documents to identify compliance gaps automatically.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Analysis Question (Optional)
                  </label>
                  <Input
                    placeholder="E.g., Focus on DORA Article 6 requirements..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to perform a standard comprehensive gap assessment.
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50 hover:bg-white transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.txt,.docx,.xlsx,.csv,.md"
                    multiple
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      {localFiles.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                            <CheckCircle className="w-5 h-5" />
                            {localFiles.length} document{localFiles.length > 1 ? 's' : ''} selected
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {localFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-gray-700">{file.name}</span>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
                            Add More Files
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Select Documents
                          </Button>
                          <p className="text-sm text-gray-400 mt-2">Support for PDF, TXT, DOCX, XLSX, CSV, MD</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('documents')}
                  >
                    Upload More Documents
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleGapAssessment}
                    disabled={localFiles.length === 0 || isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Analysis Result */}
              {analysisResults && (
                <Card className="p-6 bg-white border-blue-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold">Gap Analysis Report</h3>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('home')}
                    >
                      View Dashboard
                    </Button>
                  </div>
                  
                  {/* Frameworks Detected */}
                  {analysisResults.frameworks.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-900 mb-2">Frameworks Detected:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.frameworks.map((fw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GRC Elements Summary */}
                  {analysisResults.grcElements.length > 0 && (
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Requirements</p>
                        <p className="text-2xl font-bold text-green-600">
                          {analysisResults.grcElements.filter(e => e.type === 'requirement').length}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Controls</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysisResults.grcElements.filter(e => e.type === 'control').length}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Gaps</p>
                        <p className="text-2xl font-bold text-red-600">
                          {analysisResults.grcElements.filter(e => e.type === 'gap').length}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                        ),
                        code: ({ node, inline, ...props }: any) => (
                          inline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
                          ) : (
                            <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto" {...props} />
                          )
                        ),
                      }}
                    >
                      {analysisResults.summary}
                    </ReactMarkdown>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
