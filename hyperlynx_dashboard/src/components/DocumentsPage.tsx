import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Download, File } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadedAt: string;
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/documents`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF and Excel files are allowed');
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/documents/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      toast.success('Document uploaded successfully');
      loadDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/documents/${doc.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const data = await response.json();
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete "${doc.fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/documents/${doc.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Documents</h1>
        <p className="text-gray-600">
          Upload and manage your company security policy documents
        </p>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Upload PDF or Excel files (max 50MB)
          </p>
          <Button 
            disabled={uploading} 
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.xls,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </Card>

      {/* Documents List */}
      <div>
        <h2 className="text-xl mb-4">Your Documents</h2>
        {loading ? (
          <Card className="p-8">
            <p className="text-center text-gray-600">Loading documents...</p>
          </Card>
        ) : documents.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-gray-600">No documents uploaded yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {doc.fileType === 'application/pdf' ? (
                        <FileText className="w-6 h-6 text-red-600" />
                      ) : (
                        <File className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate">{doc.fileName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
