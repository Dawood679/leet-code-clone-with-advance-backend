'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const DIFF_CLASSES = {
  EASY: 'text-green-500', MEDIUM: 'text-yellow-500', HARD: 'text-red-500'
};

export default function AdminPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/admin/problems')
      .then(({ data }) => setProblems(data.problems))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This will also delete all submissions.`)) return;
    try {
      await api.delete(`/admin/problems/${id}`);
      setProblems(p => p.filter(x => x.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Problems</h1>
        <Link
          href="/admin/problems/new"
          className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          + New Problem
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Submissions</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map(p => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className={`px-4 py-3 font-medium ${DIFF_CLASSES[p.difficulty]}`}>
                    {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.totalCount}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/problems/${p.id}`}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
