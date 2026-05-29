'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/submissions')
      .then(({ data }) => setSubmissions(data.submissions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Submissions</h1>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                {['User', 'Problem', 'Language', 'Status', 'Runtime', 'Submitted'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800/50">
                  <td className="px-4 py-3 text-gray-500">{s.user?.email}</td>
                  <td className="px-4 py-3 font-medium">{s.problem?.title}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{s.language}</td>
                  <td className={`px-4 py-3 font-medium ${STATUS_COLORS[s.status]}`}>
                    {STATUS_LABELS[s.status]}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.runtime ? `${s.runtime}ms` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(s.createdAt).toLocaleString()}
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
