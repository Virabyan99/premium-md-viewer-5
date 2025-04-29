'use client';
import { create } from 'zustand';
import { db, MarkdownFile } from '@/lib/db';
import { toast } from 'sonner';

type State = {
  files: MarkdownFile[];
  activeFileId: string | null;
  loadFiles: () => Promise<void>;
  addFile: (file: MarkdownFile) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  setActiveFile: (id: string | null) => void;
};

export const useFileStore = create<State>((set, get) => ({
  files: [],
  activeFileId: null,

  loadFiles: async () => {
    try {
      const all = await db.files.toArray();
      set({ files: all, activeFileId: all[0]?.id ?? null });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to load files from database',
      });
    }
  },

  addFile: async (file) => {
    try {
      await db.files.put(file);
      set((s) => ({
        files: [...s.files, file],
        activeFileId: file.id,
      }));
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to save file',
      });
    }
  },

  deleteFile: async (id) => {
    try {
      await db.files.delete(id);
      set((s) => ({
        files: s.files.filter((f) => f.id !== id),
        activeFileId: s.activeFileId === id ? null : s.activeFileId,
      }));
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete file',
      });
    }
  },

  setActiveFile: (id) => set({ activeFileId: id }),
}));

// Individual selectors for state and actions
export const useFiles = () => useFileStore((s) => s.files);
export const useActiveFileId = () => useFileStore((s) => s.activeFileId);
export const useLoadFiles = () => useFileStore((s) => s.loadFiles);
export const useAddFile = () => useFileStore((s) => s.addFile);
export const useDeleteFile = () => useFileStore((s) => s.deleteFile);
export const useSetActiveFile = () => useFileStore((s) => s.setActiveFile);