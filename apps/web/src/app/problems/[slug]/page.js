'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ProblemDescription from '@/components/problems/ProblemDescription';
import SolutionsPanel from '@/components/problems/SolutionsPanel';
import AIHelpPanel from '@/components/problems/AIHelpPanel';
import CodeEditor from '@/components/problems/CodeEditor';
import VerdictPanel from '@/components/problems/VerdictPanel';
import { useSubmission } from '@/hooks/useSubmission';
import { LANGUAGES, STARTER_CODE } from '@/lib/constants';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'ai-help', label: 'AI Help' },
  { id: 'result', label: 'Result' },
];

export default function ProblemPage() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [activeTab, setActiveTab] = useState('description');

  const { submitCode, isSubmitting, verdict } = useSubmission();

  useEffect(() => {
    api.get(`/problems/${slug}`)
      .then(({ data }) => {
        setProblem(data.problem);
        const starter = data.problem?.starterCode?.python;
        if (starter) setCode(starter);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const starter = problem?.starterCode?.[lang];
    setCode(starter || STARTER_CODE[lang]);
  };

  const handleSubmit = async () => {
    if (!problem) return;
    await submitCode(problem.id, code, language);
    setActiveTab('result');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-gray-500">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left panel */}
      <div className="w-[45%] min-w-0 flex flex-col border-r border-gray-200 dark:border-gray-800">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.id === 'result' && verdict ? (
                <span className="flex items-center gap-1.5">
                  Result
                  {verdict.status === 'ACCEPTED' && <span className="text-green-500 text-xs">✓</span>}
                  {['WRONG_ANSWER', 'RUNTIME_ERROR', 'COMPILE_ERROR'].includes(verdict.status) && (
                    <span className="text-red-500 text-xs">✗</span>
                  )}
                </span>
              ) : tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'description' && <ProblemDescription problem={problem} />}
          {activeTab === 'solutions' && (
            <SolutionsPanel solutions={problem.solutions} currentLanguage={language} />
          )}
          {activeTab === 'ai-help' && <AIHelpPanel slug={problem.slug} />}
          {activeTab === 'result' && (
            <div className="h-full overflow-y-auto">
              {verdict ? (
                <VerdictPanel verdict={verdict} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Submit your code to see the verdict
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <select
            value={language}
            onChange={e => handleLanguageChange(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                Judging...
              </>
            ) : 'Submit'}
          </button>
        </div>

        {/* Monaco */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            language={LANGUAGES.find(l => l.value === language)?.monacoLang || 'python'}
            value={code}
            onChange={v => setCode(v || '')}
          />
        </div>
      </div>
    </div>
  );
}
