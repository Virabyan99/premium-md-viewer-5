'use client';
import Dexie, { Table } from 'dexie';

export interface MarkdownFile {
  id: string; // UUID v4
  name: string;
  content: string;
  createdAt: number; // Epoch ms for sorting
}

export class MarkdownDB extends Dexie {
  files!: Table<MarkdownFile>;

  constructor() {
    super('MarkdownDB');
    this.version(1).stores({
      files: 'id, name, createdAt', // Primary key: id, indexed: name, createdAt
    });
  }
}

export const db = new MarkdownDB();