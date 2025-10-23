'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Loader, Download } from 'lucide-react';

type ImportFormat = 'csv' | 'json' | 'text';

export default function ImportInstrumentsPage() {
  const router = useRouter();
  const [format, setFormat] = useState<ImportFormat>('csv');
  const [inputData, setInputData] = useState('');
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Parse CSV data
  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  };

  // Parse JSON data
  const parseJSON = (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  // Parse plain text (one tray per line)
  const parseText = (text: string) => {
    const lines = text.trim().split('\n');
    return lines.map((line, index) => ({
      name: line.trim(),
      id: `tray-${index + 1}`
    }));
  };

  // Handle preview
  const handlePreview = () => {
    try {
      let parsed: any[] = [];

      if (format === 'csv') {
        parsed = parseCSV(inputData);
      } else if (format === 'json') {
        parsed = parseJSON(inputData);
      } else {
        parsed = parseText(inputData);
      }

      setPreview(parsed);
      setResult(null);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to parse data'
      });
    }
  };

  // Handle import
  const handleImport = async () => {
    if (preview.length === 0) {
      setResult({ success: false, message: 'No data to import. Click Preview first.' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/import-instruments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruments: preview })
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setInputData('');
        setPreview([]);
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      });
    } finally {
      setLoading(false);
    }
  };

  // Download template
  const downloadTemplate = (type: ImportFormat) => {
    let content = '';
    let filename = '';

    if (type === 'csv') {
      content = `Tray Name,Specialty,Location,Quantity,Status,Notes
Orthopaedic Basic Set 1,Orthopaedic,Sterile Services,2,available,Basic instruments
General Surgery Set 5,General Surgery,Main Theatre 3,1,in_use,Major case set`;
      filename = 'instrument-trays-template.csv';
    } else if (type === 'json') {
      content = JSON.stringify([
        {
          name: "Orthopaedic Basic Set 1",
          specialty: "Orthopaedic",
          location: "Sterile Services",
          quantity: 2,
          status: "available",
          notes: "Basic instruments",
          instruments: [
            { name: "Scalpel Handle", quantity: 2 },
            { name: "Forceps", quantity: 4 }
          ]
        }
      ], null, 2);
      filename = 'instrument-trays-template.json';
    } else {
      content = `Orthopaedic Basic Set 1
General Surgery Set 5
Neurology Micro Set 3`;
      filename = 'instrument-trays-template.txt';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Upload className="text-blue-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Import Instrument Trays</h1>
        </div>
        <p className="text-white/60">
          Import instrument tray data from Synergy Trak or other sources
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Format Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">1. Select Data Format</h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border-2 transition-all ${
                format === 'csv'
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <FileText className="text-blue-400 mx-auto mb-2" size={24} />
              <div className="text-white font-semibold">CSV</div>
              <div className="text-white/60 text-sm">Comma-separated</div>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`p-4 rounded-xl border-2 transition-all ${
                format === 'json'
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <FileText className="text-green-400 mx-auto mb-2" size={24} />
              <div className="text-white font-semibold">JSON</div>
              <div className="text-white/60 text-sm">Structured data</div>
            </button>

            <button
              onClick={() => setFormat('text')}
              className={`p-4 rounded-xl border-2 transition-all ${
                format === 'text'
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <FileText className="text-purple-400 mx-auto mb-2" size={24} />
              <div className="text-white font-semibold">Text</div>
              <div className="text-white/60 text-sm">One per line</div>
            </button>
          </div>

          <button
            onClick={() => downloadTemplate(format)}
            className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            <Download size={16} />
            <span>Download {format.toUpperCase()} Template</span>
          </button>
        </div>

        {/* Data Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">2. Paste Your Data</h2>

          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={`Paste your ${format.toUpperCase()} data here...\n\nExample:\n${
              format === 'csv'
                ? 'Tray Name,Specialty,Location,Quantity\nOrtho Set 1,Orthopaedic,Store A,2'
                : format === 'json'
                ? '[\n  {\n    "name": "Ortho Set 1",\n    "specialty": "Orthopaedic"\n  }\n]'
                : 'Ortho Set 1\nGeneral Surgery Set 5'
            }`}
            className="w-full h-64 bg-black/30 border border-white/20 rounded-xl p-4 text-white font-mono text-sm
                     focus:outline-none focus:border-blue-400 transition-colors resize-none"
          />

          <button
            onClick={handlePreview}
            disabled={!inputData.trim()}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold
                     hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview Data
          </button>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Preview ({preview.length} items)
            </h2>

            <div className="max-h-96 overflow-auto bg-black/30 rounded-xl p-4">
              <table className="w-full text-white text-sm">
                <thead className="border-b border-white/20">
                  <tr>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Specialty</th>
                    <th className="text-left py-2 px-4">Location</th>
                    <th className="text-left py-2 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-2 px-4">{item.name || item['Tray Name'] || 'N/A'}</td>
                      <td className="py-2 px-4 text-white/70">{item.specialty || item.Specialty || 'N/A'}</td>
                      <td className="py-2 px-4 text-white/70">{item.location || item.Location || 'N/A'}</td>
                      <td className="py-2 px-4 text-white/70">{item.quantity || item.Quantity || '1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <div className="text-white/60 text-center mt-4">
                  + {preview.length - 10} more items...
                </div>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className="mt-4 w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold
                       hover:from-green-500 hover:to-green-400 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Import to Firebase</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`p-4 rounded-lg border ${
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
              <div>
                <p className={`font-semibold mb-1 ${result.success ? 'text-green-200' : 'text-red-200'}`}>
                  {result.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm ${result.success ? 'text-green-200/80' : 'text-red-200/80'}`}>
                  {result.message}
                </p>
                {result.count && (
                  <p className="text-sm text-green-200/60 mt-1">
                    Imported {result.count} instrument trays
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How to Export from Synergy Trak:</h3>
          <ol className="space-y-2 text-white/70 text-sm">
            <li className="flex gap-2">
              <span className="font-semibold text-blue-400">1.</span>
              <span>Log into Synergy Trak at work</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-400">2.</span>
              <span>Navigate to Instrument Tray listings</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-400">3.</span>
              <span>Look for Export, Download, or Print options</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-400">4.</span>
              <span>If no export: Copy table data and paste into Excel/CSV</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-400">5.</span>
              <span>Save as CSV or copy the data here</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
