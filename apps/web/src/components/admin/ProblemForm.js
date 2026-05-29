'use client';
import { useState } from 'react';
import api from '@/lib/api';

const emptyExample = () => ({ input: '', output: '', explanation: '' });
const emptyTestCase = () => ({ input: '', expectedOutput: '' });

export default function ProblemForm({ initialData, onSubmit, isLoading }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'EASY');
  const [constraints, setConstraints] = useState(initialData?.constraints || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [examples, setExamples] = useState(initialData?.examples || [emptyExample()]);
  const [testCases, setTestCases] = useState(initialData?.testCases || [emptyTestCase()]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateTests = async () => {
    if (!description.trim()) { setError('Write a description first'); return; }
    setGenerating(true);
    setError('');
    try {
      const { data } = await api.post('/admin/problems/generate-tests', { description, examples });
      setTestCases(data.testCases);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    onSubmit({
      title,
      description,
      difficulty,
      constraints,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      examples,
      testCases
    });
  };

  const updateExample = (i, field, val) => {
    setExamples(ex => ex.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  const updateTestCase = (i, field, val) => {
    setTestCases(tc => tc.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description (Markdown)</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={8}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Constraints (Markdown)</label>
        <textarea
          value={constraints}
          onChange={e => setConstraints(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Array, Hash Table, DP"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
      </div>

      {/* Examples */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Examples (shown to users)</label>
          <button type="button" onClick={() => setExamples(e => [...e, emptyExample()])}
            className="text-xs text-brand hover:underline">+ Add</button>
        </div>
        <div className="space-y-3">
          {examples.map((ex, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Example {i + 1}</span>
                {examples.length > 1 && (
                  <button type="button" onClick={() => setExamples(e => e.filter((_, idx) => idx !== i))}
                    className="text-xs text-red-500 hover:underline">Remove</button>
                )}
              </div>
              <input placeholder="Input" value={ex.input} onChange={e => updateExample(i, 'input', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/50" />
              <input placeholder="Output" value={ex.output} onChange={e => updateExample(i, 'output', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/50" />
              <input placeholder="Explanation (optional)" value={ex.explanation || ''} onChange={e => updateExample(i, 'explanation', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Test Cases (sent to Judge0)</label>
          <div className="flex gap-2">
            <button type="button" onClick={handleGenerateTests} disabled={generating}
              className="text-xs px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50">
              {generating ? 'Generating...' : '✨ Auto-Generate with AI'}
            </button>
            <button type="button" onClick={() => setTestCases(t => [...t, emptyTestCase()])}
              className="text-xs text-brand hover:underline">+ Add</button>
          </div>
        </div>
        <div className="space-y-2">
          {testCases.map((tc, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <textarea placeholder="Input" value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)}
                  rows={2}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none" />
                <textarea placeholder="Expected Output" value={tc.expectedOutput} onChange={e => updateTestCase(i, 'expectedOutput', e.target.value)}
                  rows={2}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none" />
              </div>
              {testCases.length > 1 && (
                <button type="button" onClick={() => setTestCases(t => t.filter((_, idx) => idx !== i))}
                  className="text-red-500 hover:text-red-600 text-lg leading-none pt-2">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Problem'}
      </button>
    </form>
  );
}
