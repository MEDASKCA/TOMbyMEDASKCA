'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function SeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const runSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Database className="text-blue-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Database Seeding</h1>
        </div>
        <p className="text-white/60">
          Seed core data (staff and theatres) - Import instruments from Synergy Trak separately
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-8">
          {/* Seed Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Core Data (No Instruments):</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/80">Staff Members</span>
                <span className="text-2xl font-bold text-blue-400">925</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/80">Theatres</span>
                <span className="text-2xl font-bold text-blue-400">20+</span>
              </div>
            </div>

            {/* Instruments Notice */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="font-semibold text-blue-200 mb-1">Instrument Trays:</p>
                  <p className="text-blue-200/80 mb-2">
                    Real instrument data should be imported from Synergy Trak for production-ready checklists.
                  </p>
                  <a
                    href="/admin/import-instruments"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Go to Import Tool →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={runSeed}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold
                     hover:from-blue-500 hover:to-blue-400 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Database size={20} />
                <span>Run Seed Script</span>
              </>
            )}
          </button>

          {/* Warning */}
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-200">
                <p className="font-semibold mb-1">Warning:</p>
                <p className="text-amber-200/80">
                  This will add mock data to your Firestore database. Make sure you&apos;re running this
                  on a development project, not production.
                </p>
              </div>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold mb-1 ${
                      result.success ? 'text-green-200' : 'text-red-200'
                    }`}
                  >
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p
                    className={`text-sm ${
                      result.success ? 'text-green-200/80' : 'text-red-200/80'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.data && (
                    <div className="mt-3 p-3 bg-white/5 rounded text-xs text-white/70 font-mono">
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-6 p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Next Steps:</h3>
        <ol className="space-y-2 text-white/70 text-sm">
          <li className="flex gap-2">
            <span className="font-semibold text-blue-400">1.</span>
            <span>Run the seed script above to populate your database</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-blue-400">2.</span>
            <span>Navigate to Firebase Console to verify the data</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-blue-400">3.</span>
            <span>Start using the TOM hooks in your components</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-blue-400">4.</span>
            <span>Generate additional mock procedures and assignments as needed</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
