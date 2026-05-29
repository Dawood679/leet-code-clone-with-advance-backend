'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DIFF_BADGE = {
  EASY: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  HARD: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
};

export default function ProblemDescription({ problem }) {
  if (!problem) return null;

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${DIFF_BADGE[problem.difficulty]}`}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {problem.tags?.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
      </div>

      {problem.constraints && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Constraints
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.constraints}</ReactMarkdown>
          </div>
        </div>
      )}

      {problem.examples?.map((ex, i) => (
        <div key={i} className="mb-4">
          <h3 className="font-semibold text-sm mb-2">Example {i + 1}</h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm font-mono space-y-1">
            <div><span className="text-gray-400">Input: </span>{ex.input}</div>
            <div><span className="text-gray-400">Output: </span>{ex.output}</div>
            {ex.explanation && (
              <div className="font-sans text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium">Explanation: </span>{ex.explanation}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
