'use client';
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { HeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { toast } from 'sonner';

interface LexicalViewerProps {
  markdown: string;
}

function MarkdownLoader({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!markdown) return;
    try {
      editor.update(() => {
        $convertFromMarkdownString(markdown);
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to render Markdown',
      });
    }
  }, [markdown, editor]);
  return null;
}

const theme = {
  paragraph: 'text-gray-800 dark:text-gray-200',
  heading: {
    h1: 'text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100',
    h2: 'text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100',
    h3: 'text-xl font-bold mb-2 text-gray-900 dark:text-gray-100',
    h4: 'text-lg font-bold mb-2 text-gray-900 dark:text-gray-100',
    h5: 'text-base font-bold mb-2 text-gray-900 dark:text-gray-100',
    h6: 'text-sm font-bold mb-2 text-gray-900 dark:text-gray-100',
  },
  list: {
    ul: 'list-disc pl-6 mb-4 text-gray-800 dark:text-gray-200',
    ol: 'list-decimal pl-6 mb-4 text-gray-800 dark:text-gray-200',
    nested: { listitem: 'pl-6' },
  },
  code: 'bg-gray-100 dark:bg-gray-800 rounded p-1 font-mono text-sm text-gray-800 dark:text-gray-200',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    code: 'bg-gray-200 dark:bg-gray-700 rounded px-1',
  },
  link: 'text-blue-600 dark:text-blue-400 underline',
  quote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400',
  codeHighlight: {
    atrule: 'text-purple-600 dark:text-purple-400',
    attr: 'text-blue-600 dark:text-blue-400',
    boolean: 'text-orange-600 dark:text-orange-400',
    builtin: 'text-green-600 dark:text-green-400',
    cdata: 'text-gray-600 dark:text-gray-400',
    char: 'text-green-600 dark:text-green-400',
    class: 'text-blue-600 dark:text-blue-400',
    comment: 'text-gray-500 dark:text-gray-500',
    constant: 'text-orange-600 dark:text-orange-400',
    deleted: 'text-red-600 dark:text-red-400',
    doctype: 'text-gray-600 dark:text-gray-400',
    entity: 'text-red-600 dark:text-red-400',
    function: 'text-blue-600 dark:text-blue-400',
    important: 'text-orange-600 dark:text-orange-400',
    inserted: 'text-green-600 dark:text-green-400',
    keyword: 'text-purple-600 dark:text-purple-400',
    namespace: 'text-purple-600 dark:text-purple-400',
    number: 'text-orange-600 dark:text-orange-400',
    operator: 'text-gray-600 dark:text-gray-400',
    prolog: 'text-gray-600 dark:text-gray-400',
    property: 'text-blue-600 dark:text-blue-400',
    punctuation: 'text-gray-600 dark:text-gray-400',
    regex: 'text-orange-600 dark:text-orange-400',
    selector: 'text-green-600 dark:text-green-400',
    string: 'text-green-600 dark:text-green-400',
    symbol: 'text-purple-600 dark:text-purple-400',
    tag: 'text-blue-600 dark:text-blue-400',
    url: 'text-blue-600 dark:text-blue-400',
    variable: 'text-orange-600 dark:text-orange-400',
  },
};

export default function LexicalViewer({ markdown }: LexicalViewerProps) {
  const initialConfig = {
    namespace: 'MarkdownViewer',
    nodes: [CodeNode, CodeHighlightNode, HeadingNode, ListNode, ListItemNode],
    editable: false,
    theme,
    onError: (error: Error) => {
      toast.error('Error', {
        description: 'Lexical initialization failed',
      });
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="prose max-w-none p-4"
            aria-label="Markdown content"
            role="textbox"
            readOnly
          />
        }
        placeholder={<div className="text-gray-400 p-4">No content</div>}
        ErrorBoundary={() => <div>Error rendering content</div>}
      />
      <HistoryPlugin />
      <MarkdownLoader markdown={markdown} />
    </LexicalComposer>
  );
}