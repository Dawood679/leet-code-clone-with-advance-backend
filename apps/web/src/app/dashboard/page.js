'use client';
import { useState, useEffect } from 'react';
import ProblemTable from '@/components/problems/ProblemTable';
import api from '@/lib/api';

export default function DashboardPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/problems')
      .then(({ data }) => setProblems(data.problems))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter(p => {
    const matchesDifficulty = filter === 'ALL' || p.difficulty === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Problems</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{problems.length} problems available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search problems or tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <div className="flex gap-2">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === d
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {d === 'ALL' ? 'All' : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProblemTable problems={filtered} />
      )}
    </div>
  );
}
