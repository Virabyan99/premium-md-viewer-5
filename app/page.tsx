"use client";
import FileDrop from '@/components/FileDrop';
import FileSidebar from '@/components/FileSidebar';
import { useLoadFiles, useAddFile } from '@/lib/fileStore';
import { useEffect } from 'react';

export default function Home() {
  const loadFiles = useLoadFiles();
  const addFile = useAddFile();

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleRead = async (file: File, content: string) => {
    const newFile = {
      id: crypto.randomUUID(),
      name: file.name,
      content,
      createdAt: Date.now(),
    };
    await addFile(newFile);
    console.log('Dropped file:', file);
    console.log('Content preview:', content.slice(0, 120));
  };

  return (
    <div className="flex min-h-screen">
      <FileSidebar />
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <FileDrop onRead={handleRead} />
      </main>
    </div>
  );
}