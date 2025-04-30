"use client";
import { useState, useEffect } from 'react';
import FileDrop from '@/components/FileDrop';
import FileSidebar from '@/components/FileSidebar';
import LexicalViewer from '@/components/LexicalViewer';
import { useLoadFiles, useAddFile, useFiles, useActiveFileId, useSetActiveFile } from '@/lib/fileStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFileStore } from '@/lib/fileStore';
import { toast } from 'sonner';

export default function Home() {
  const loadFiles = useLoadFiles();
  const addFile = useAddFile();
  const files = useFiles();
  const activeFileId = useActiveFileId();
  const setActiveFile = useSetActiveFile();
  const activeFile = files.find(f => f.id === activeFileId);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [viewVersion, setViewVersion] = useState(0); // Added to force re-render

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    if (activeFile) {
      setPreviewContent(activeFile.content);
      setHasChanges(false);
    }
  }, [activeFile]);

  const handleRead = async (file: File, content: string) => {
    const newFile = {
      id: crypto.randomUUID(),
      name: file.name,
      content,
      createdAt: Date.now(),
    };
    await addFile(newFile);
    setActiveFile(newFile.id); // Auto-select new file
    console.log('Dropped file:', file);
    console.log('Content preview:', content.slice(0, 120));
  };

  const handleSave = async () => {
    if (!activeFile || !hasChanges) return;
    try {
      const updatedFile = { ...activeFile, content: previewContent };
      await useFileStore.getState().addFile(updatedFile); // Update the file in the store
      setHasChanges(false);
      setViewVersion(v => v + 1); // Increment to force LexicalViewer re-render
      toast.success('File saved successfully');
    } catch (error) {
      toast.error('Error saving file');
    }
  };

  return (
    <div className="flex min-h-screen">
      <FileSidebar />
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        {activeFile ? (
          <div className="space-y-4">
            <div className="flex justify-end space-x-2">
              {isPreviewMode && hasChanges && (
                <Button onClick={handleSave} aria-label="Save changes">
                  Save
                </Button>
              )}
              <Button
                onClick={() => {
                  setIsPreviewMode(!isPreviewMode);
                  if (!isPreviewMode) {
                    setPreviewContent(activeFile.content); // Reset to original content
                  }
                }}
                aria-label={isPreviewMode ? 'Switch to view mode' : 'Switch to preview mode'}
              >
                {isPreviewMode ? 'View Mode' : 'Preview Mode'}
              </Button>
            </div>
            {isPreviewMode ? (
              <Textarea
                value={previewContent}
                onChange={(e) => {
                  setPreviewContent(e.target.value);
                  setHasChanges(e.target.value !== activeFile.content);
                }}
                className="h-96 w-full"
                aria-label="Markdown preview input"
                placeholder="Edit Markdown here..."
              />
            ) : (
              <LexicalViewer
                markdown={activeFile.content}
                isEditable={false}
                key={`${activeFile.id}-${viewVersion}`} // Unique key to force re-render
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <svg
              className="w-24 h-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9l-7-7H7a2 2 0 00-2 2v16a2 2 0 002 2z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3v6h6" />
            </svg>
            <p className="text-center max-w-xs">
              Drag & drop a Markdown file or click the box to browse.
            </p>
            <FileDrop onRead={handleRead} />
          </div>
        )}
      </main>
    </div>
  );
}