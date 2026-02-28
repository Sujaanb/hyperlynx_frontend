import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, RefreshCcw, Save, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { hyperlynxApi, type FrameworkLibrarySummary } from '../services/hyperlynxApi';

function stringifyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

export function LibrariesPage() {
  const { accessToken } = useAuth();
  const [libraries, setLibraries] = useState<FrameworkLibrarySummary[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string>('');
  const [filenameInput, setFilenameInput] = useState('');
  const [contentText, setContentText] = useState('{}');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedLibrary = useMemo(
    () => libraries.find((item) => item.filename === selectedFilename),
    [libraries, selectedFilename]
  );

  const loadLibraries = async () => {
    setIsLoading(true);
    try {
      const response = await hyperlynxApi.listFrameworkLibraries();
      setLibraries(response.data || []);

      if (!selectedFilename && response.data?.length) {
        const first = response.data[0].filename;
        setSelectedFilename(first);
        await loadDetails(first);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load libraries');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetails = async (filename: string) => {
    try {
      const response = await hyperlynxApi.getFrameworkLibrary(filename);
      setSelectedFilename(filename.endsWith('.yaml') ? filename : `${filename}.yaml`);
      setFilenameInput(filename.endsWith('.yaml') ? filename : `${filename}.yaml`);
      setContentText(stringifyJson(response.data || {}));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load library details');
    }
  };

  useEffect(() => {
    void loadLibraries();
  }, []);

  const handleNew = () => {
    setSelectedFilename('');
    setFilenameInput('new-framework.yaml');
    setContentText('{}');
  };

  const handleSave = async () => {
    if (!accessToken) {
      toast.error('Login is required to create or update libraries');
      return;
    }

    if (!filenameInput.trim()) {
      toast.error('Filename is required');
      return;
    }

    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(contentText || '{}');
    } catch {
      toast.error('Content must be valid JSON');
      return;
    }

    setIsSaving(true);
    try {
      if (selectedFilename) {
        await hyperlynxApi.updateFrameworkLibrary(selectedFilename, parsedContent, accessToken);
        toast.success('Library updated');
      } else {
        await hyperlynxApi.createFrameworkLibrary(filenameInput, parsedContent, accessToken);
        toast.success('Library created');
      }

      await loadLibraries();
      await loadDetails(filenameInput);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken) {
      toast.error('Login is required to delete libraries');
      return;
    }

    if (!selectedFilename) {
      toast.error('Select a library first');
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedFilename}?`);
    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    try {
      await hyperlynxApi.deleteFrameworkLibrary(selectedFilename, accessToken);
      toast.success('Library deleted');
      setSelectedFilename('');
      setFilenameInput('');
      setContentText('{}');
      await loadLibraries();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl mb-2">Libraries</h2>
        <p className="text-gray-600 text-sm lg:text-base">Manage framework libraries from Flask API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Available Libraries</h3>
            <Button variant="outline" size="sm" onClick={() => void loadLibraries()}>
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4">
            <Button className="w-full" variant="outline" onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              New Library
            </Button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-auto">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading libraries...</p>
            ) : libraries.length === 0 ? (
              <p className="text-sm text-gray-500">No libraries found</p>
            ) : (
              libraries.map((item) => (
                <button
                  key={item.filename}
                  onClick={() => void loadDetails(item.filename)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedFilename === item.filename ? 'border-black bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 text-gray-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{item.filename}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-[10px]">{item.name}</Badge>
                        <span className="text-[10px] text-gray-500">{Math.round(item.size / 1024)} KB</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4 lg:p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Library Editor</h3>
            <div className="flex items-center gap-2">
              {selectedFilename && (
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSaving}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filenameInput}
              onChange={(event) => setFilenameInput(event.target.value)}
              placeholder="framework-name.yaml"
              disabled={Boolean(selectedLibrary)}
            />
            {selectedLibrary && <p className="text-xs text-gray-500">Filename is locked for existing libraries.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (JSON)</Label>
            <Textarea
              id="content"
              value={contentText}
              onChange={(event) => setContentText(event.target.value)}
              className="min-h-[360px] font-mono text-xs"
              placeholder="{}"
            />
            <p className="text-xs text-gray-500">The backend stores this object as YAML.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
