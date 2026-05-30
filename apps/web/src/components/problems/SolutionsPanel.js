'use client';
import { useState } from 'react';
import { LANGUAGES } from '@/lib/constants';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function SolutionsPanel({ solutions, currentLanguage }) {
  const [lang, setLang] = useState(currentLanguage || 'python');
  const { resolvedTheme } = useTheme();

  const solution = solutions?.[lang];

  return (
    <div className="h-full flex flex-col px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base">Reference Solution</h2>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {solution ? (
        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <MonacoEditor
            height="100%"
            language={LANGUAGES.find(l => l.value === lang)?.monacoLang || 'python'}
            value={solution}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
            options={{
              readOnly: true,
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              padding: { top: 12, bottom: 12 },
              automaticLayout: true
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 gap-3">
          <span className="text-4xl">🔒</span>
          <p className="font-medium">No solution available for {LANGUAGES.find(l => l.value === lang)?.label} yet.</p>
          <p className="text-sm">Try solving it yourself first! Solutions for Python and JavaScript are available.</p>
        </div>
      )}
    </div>
  );
}
