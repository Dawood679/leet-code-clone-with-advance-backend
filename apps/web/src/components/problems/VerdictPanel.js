'use client';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';

function StatusIcon({ status }) {
  if (status === 'ACCEPTED') return <span className="text-2xl">✅</span>;
  if (status === 'PROCESSING' || status === 'PENDING') {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
    );
  }
  if (status === 'WRONG_ANSWER' || status === 'RUNTIME_ERROR' || status === 'COMPILE_ERROR') {
    return <span className="text-2xl">❌</span>;
  }
  if (status === 'TIME_LIMIT_EXCEEDED') return <span className="text-2xl">⏱️</span>;
  return null;
}

export default function VerdictPanel({ verdict }) {
  if (!verdict) return null;

  const { status, results, error } = verdict;
  const label = STATUS_LABELS[status] || status;
  const colorClass = STATUS_COLORS[status] || 'text-gray-400';
  const passed = results?.filter(r => r.status === 'ACCEPTED').length ?? 0;
  const total = results?.length ?? 0;

  const firstFail = results?.find(r => r.status !== 'ACCEPTED');
  const compileError = results?.find(r => r.compileOutput)?.compileOutput;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-3 mb-3">
        <StatusIcon status={status} />
        <div>
          <span className={`text-lg font-bold ${colorClass}`}>{label}</span>
          {total > 0 && status !== 'COMPILE_ERROR' && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
              {passed}/{total} test cases passed
            </span>
          )}
        </div>
        {verdict.runtime && (
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 space-x-3">
            <span>Runtime: {verdict.runtime}ms</span>
            {verdict.memory && <span>Memory: {Math.round(verdict.memory / 1024)}MB</span>}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
          {error}
        </div>
      )}

      {compileError && (
        <div className="text-sm bg-gray-100 dark:bg-gray-900 rounded-lg p-3 font-mono text-orange-500 overflow-x-auto">
          <div className="font-sans text-xs font-semibold text-gray-500 mb-1">Compile Error</div>
          <pre className="whitespace-pre-wrap">{compileError}</pre>
        </div>
      )}

      {firstFail && !compileError && (
        <div className="mt-2 text-sm space-y-2">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">
            First failing test case
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Input</div>
              <pre className="whitespace-pre-wrap">{firstFail.input || '(empty)'}</pre>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Expected Output</div>
              <pre className="whitespace-pre-wrap">{firstFail.expectedOutput}</pre>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Your Output</div>
              <pre className="whitespace-pre-wrap">{firstFail.actualOutput || '(none)'}</pre>
            </div>
            {firstFail.stderr && (
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                <div className="text-gray-400 mb-1">Stderr</div>
                <pre className="whitespace-pre-wrap text-red-500">{firstFail.stderr}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
