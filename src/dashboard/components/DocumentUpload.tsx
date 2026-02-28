import React, { useState, useRef } from 'react';
import { Upload, X, FileText, FilePlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAnalysis } from './AnalysisContext';

interface DocumentUploadProps {
  onNavigate?: (view: string) => void;
  onUploadComplete?: (files: File[]) => void;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const ACCEPTED_FILE_TYPES = [
  '.pdf',
  '.docx',
  '.doc',
  '.txt',
  '.csv',
  '.xlsx',
  '.xls',
  '.md',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentUpload({ onNavigate, onUploadComplete }: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUploadedFiles } = useAnalysis();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return '📊';
    if (['txt', 'md'].includes(ext || '')) return '📃';
    return '📎';
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`;
    }

    // Check file type
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(ext)) {
      return `File type ${ext} is not supported`;
    }

    return null;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const error = validateFile(file);

      newFiles.push({
        file,
        id: `${Date.now()}-${i}`,
        status: error ? 'error' : 'pending',
        progress: 0,
        error,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'uploading', progress }
            : f
        )
      );
    }

    // Mark as success
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: 'success', progress: 100 } : f
      )
    );
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');

    if (pendingFiles.length === 0) return;

    // Upload all files (simulated)
    await Promise.all(
      pendingFiles.map((file) => simulateUpload(file.id))
    );

    // Store successfully uploaded files in context
    const uploadedFiles = files
      .filter((f) => f.status === 'success')
      .map((f) => f.file);
    
    setUploadedFiles(uploadedFiles);

    // Notify parent component
    if (onUploadComplete) {
      onUploadComplete(uploadedFiles);
    }
  };

  const handleStartAnalysis = () => {
    // Store uploaded files in context
    const uploadedFiles = files
      .filter((f) => f.status === 'success')
      .map((f) => f.file);
    
    setUploadedFiles(uploadedFiles);
    
    // Navigate to reasoning module for AI analysis
    onNavigate?.('reasoning');
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-600 mt-1">
            Upload multiple compliance documents for AI-powered analysis
          </p>
        </div>
        {files.length > 0 && (
          <Button onClick={handleClearAll} variant="outline" className="text-red-600">
            Clear All
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-blue-100 rounded-full mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drag and drop files here
          </h3>
          <p className="text-gray-600 mb-4">or</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="mb-4"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOCX, TXT, CSV, XLSX, MD
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
          </p>
        </div>
      </Card>

      {/* Stats Cards */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{successCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{errorCount}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Uploaded Files ({files.length})
            </h2>
            {pendingCount > 0 && (
              <Button onClick={handleUploadAll}>
                Upload {pendingCount} File{pendingCount > 1 ? 's' : ''}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {files.map((uploadedFile) => (
              <Card
                key={uploadedFile.id}
                className={`p-4 ${
                  uploadedFile.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : uploadedFile.status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getFileIcon(uploadedFile.file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {uploadedFile.file.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                          {uploadedFile.status === 'success' && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                          {uploadedFile.status === 'error' && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                          {uploadedFile.status === 'uploading' && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Uploading...
                            </Badge>
                          )}
                        </div>
                        {uploadedFile.error && (
                          <p className="text-sm text-red-600 mt-1">
                            {uploadedFile.error}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFile(uploadedFile.id)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    {uploadedFile.status === 'uploading' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">
                            {uploadedFile.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Cards */}
      {successCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 border-blue-200 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analyze Documents with AI
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Use AI to analyze {successCount} uploaded document{successCount > 1 ? 's' : ''} and identify compliance requirements
            </p>
            <Button
              onClick={handleStartAnalysis}
              className="w-full"
            >
              Start AI Analysis
            </Button>
          </Card>
          <Card className="p-6 border-purple-200 bg-purple-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              View Dashboard
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Go back to dashboard to view compliance status and metrics
            </p>
            <Button
              onClick={() => onNavigate?.('home')}
              variant="outline"
              className="w-full"
            >
              View Dashboard
            </Button>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents uploaded yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload compliance documents to get started with AI-powered analysis
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Document
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
