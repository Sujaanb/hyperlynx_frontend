import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GRCElement {
  id: string;
  type: 'control' | 'risk' | 'requirement' | 'gap';
  framework: string;
  title: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  priority: 'high' | 'medium' | 'low';
  category?: string;
}

export interface AnalysisResults {
  summary: string;
  frameworks: string[];
  documents_analyzed: number;
  grcElements: GRCElement[];
  timestamp: string;
  uploadedFiles: File[];
}

interface AnalysisContextType {
  analysisResults: AnalysisResults | null;
  setAnalysisResults: (results: AnalysisResults | null) => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <AnalysisContext.Provider
      value={{
        analysisResults,
        setAnalysisResults,
        uploadedFiles,
        setUploadedFiles,
        isAnalyzing,
        setIsAnalyzing,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
