'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProblemForm from '@/components/admin/ProblemForm';
import api from '@/lib/api';

export default function NewProblemPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/problems', data);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create problem');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Problem</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new coding problem</p>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <ProblemForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
