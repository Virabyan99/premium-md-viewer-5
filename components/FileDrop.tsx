'use client';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const FileSchema = z.object({
  type: z.string().refine(
    (type) => ['text/markdown', 'text/plain', ''].includes(type),
    'Only .md or .txt files are allowed'
  ),
  name: z.string().refine(
    (name) => /\.(md|txt)$/i.test(name),
    'File must have .md or .txt extension'
  ),
  size: z.number().max(1_000_000, 'File is too large (limit 1 MiB)')
});

type Props = {
  onRead: (file: File, content: string) => void;
};

export default function FileDrop({ onRead }: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Drag event handlers
  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(true);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Validate with Zod
    const validation = FileSchema.safeParse({
      type: file.type,
      name: file.name,
      size: file.size
    });
    if (!validation.success) {
      toast.error('Invalid file', {
        description: validation.error.issues[0].message
      });
      return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = () => onRead(file, reader.result as string);
    reader.onerror = () =>
      toast.error('Error', {
        description: 'Failed to read file'
      });
    reader.readAsText(file);
  }

  // File input handler
  async function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate with Zod
    const validation = FileSchema.safeParse({
      type: file.type,
      name: file.name,
      size: file.size
    });
    if (!validation.success) {
      toast.error('Invalid file', {
        description: validation.error.issues[0].message
      });
      return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = () => onRead(file, reader.result as string);
    reader.onerror = () =>
      toast.error('Error', {
        description: 'Failed to read file'
      });
    reader.readAsText(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          inputRef.current?.click();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Drag and drop or click to upload a Markdown or text file"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center h-64 w-full border-2 border-dashed rounded-lg transition-colors select-none cursor-pointer ${
        drag ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <p className="text-gray-600">
        {drag ? 'Release to drop the file' : 'Drag & drop a .md or .txt file, or click'}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.txt"
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}