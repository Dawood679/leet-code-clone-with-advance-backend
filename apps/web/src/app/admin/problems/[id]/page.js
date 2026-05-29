'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProblemForm from '@/components/admin/ProblemForm';
import api from '@/lib/api';

export default function EditProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.get(`/admin/problems/${id}`)
      .then(({ data }) => setProblem(data.problem))
      .catch(() => setError('Problem not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/admin/problems/${id}`, data);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      setLoading(false);
    }
  };

  if (fetching) return <div className="animate-pulse h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Problem</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{problem?.title}</p>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {problem && <ProblemForm initialData={problem} onSubmit={handleSubmit} isLoading={loading} />}
    </div>
  );
}
