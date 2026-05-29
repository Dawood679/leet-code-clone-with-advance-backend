'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodeEditor({ language, value, onChange }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading editor...</div>
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={value}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
      onChange={onChange}
      options={{
        fontSize: 14,
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 4,
        automaticLayout: true,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        padding: { top: 16, bottom: 16 }
      }}
    />
  );
}
