import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
          <span>Judge0 CE Powered</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Practice Coding<br />Problems
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Sharpen your algorithmic thinking with real-time code execution. Submit solutions in Python, JavaScript, Java, or C++ and get instant feedback.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-brand text-white font-semibold text-lg hover:bg-brand-dark transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Real-time Execution',
              desc: 'Code is executed in isolated Docker containers via Judge0 CE. Get results in seconds with WebSocket updates.'
            },
            {
              icon: '🧠',
              title: 'AI-Powered Problems',
              desc: 'Admins use Gemini AI to auto-generate comprehensive test cases ensuring thorough coverage.'
            },
            {
              icon: '📊',
              title: 'Multi-language Support',
              desc: 'Write solutions in Python, JavaScript, Java, or C++. Monaco editor with syntax highlighting.'
            }
          ].map(f => (
            <div key={f.title} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand/50 transition-colors">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="grid grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-800 pt-16">
          {[
            { value: '5+', label: 'Problems' },
            { value: '4', label: 'Languages' },
            { value: '∞', label: 'Submissions' }
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-bold text-brand">{s.value}</div>
              <div className="text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
