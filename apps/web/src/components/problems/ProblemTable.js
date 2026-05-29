'use client';
import Link from 'next/link';

const DIFFICULTY_CLASSES = {
  EASY: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  MEDIUM: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  HARD: 'text-red-500 bg-red-50 dark:bg-red-900/20'
};

export default function ProblemTable({ problems }) {
  if (!problems?.length) {
    return <div className="text-center py-20 text-gray-500">No problems found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 w-10">#</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Difficulty</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Acceptance</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tags</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 w-16">Status</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p, i) => (
            <tr
              key={p.id}
              className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400">{i + 1}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/problems/${p.slug}`}
                  className="font-medium hover:text-brand transition-colors"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_CLASSES[p.difficulty]}`}>
                  {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {p.acceptanceRate}%
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                  {p.tags.length > 2 && (
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                      +{p.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                {p.solved ? (
                  <span className="text-green-500 font-bold" title="Solved">✓</span>
                ) : (
                  <span className="text-gray-300 dark:text-gray-700">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
