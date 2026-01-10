import React, { useState, useRef } from 'react';
import { CheckCircle, Shield, Upload, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { toast } from 'sonner@2.0.3';
import type { ApplicabilityResults } from './ApplicabilityModule';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/HL/content/v1';

interface ReasoningModuleProps {
  applicabilityResults: ApplicabilityResults;
  onNavigate: (view: string) => void;
}

export function ReasoningModule({ applicabilityResults, onNavigate }: ReasoningModuleProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Gap Analysis State
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleGapAssessment = async () => {
    if (!file) {
      toast.error('Please upload a document first');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    const questionToAsk = customQuestion.trim() || 'Perform a detailed gap assessment based on this document.';

    formData.append('question', questionToAsk);
    formData.append('local_llm', 'false');
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResult(data.data); // Assuming 'data' field contains the markdown response
      toast.success('Gap assessment completed successfully');
    } catch (error) {
      console.error('Gap assessment error:', error);
      toast.error('Failed to perform gap assessment');
    } finally {
      setAnalyzing(false);
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
                  <p className="text-gray-600">Upload your existing policy or audit document to identify compliance gaps automatically.</p>
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
                    accept=".pdf,.txt,.docx,.xlsx"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      {file ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="w-5 h-5" />
                          {file.name}
                        </div>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Select Document
                          </Button>
                          <p className="text-sm text-gray-400 mt-2">Support for PDF, TXT, DOCX, XLSX</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleGapAssessment}
                    disabled={!file || analyzing}
                    className="gap-2"
                  >
                    {analyzing ? (
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
              {analysisResult && (
                <Card className="p-6 bg-white border-blue-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">Gap Analysis Report</h3>
                  </div>
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
                      {analysisResult}
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
