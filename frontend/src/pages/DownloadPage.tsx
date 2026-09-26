import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Layers,
  ArrowLeft,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';

export const DownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId, results, documentInfo, resetSession } = useApp();
  const [activePreviewSheet, setActivePreviewSheet] = useState<'English' | 'Hindi' | 'Marathi'>('English');

  if (!results || !jobId) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No File to Download</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Please upload a document and generate the Q&A pairs first.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="mt-6 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const enPairs = results.english || [];
  const hiPairs = results.hindi || [];
  const mrPairs = results.marathi || [];

  const handleDownload = () => {
    const url = api.getDownloadUrl(jobId);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Multilingual_QnA.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewDocument = () => {
    resetSession();
    navigate('/upload');
  };

  const currentSheetData =
    activePreviewSheet === 'English'
      ? enPairs
      : activePreviewSheet === 'Hindi'
      ? hiPairs
      : mrPairs;

  const questionHeader = activePreviewSheet === 'English' ? 'Questions' : 'प्रश्न';
  const answerHeader = activePreviewSheet === 'English' ? 'Answers' : 'उत्तर';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Download Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your multilingual Q&A is ready
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Exported to Excel workbook containing three dedicated language sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Results</span>
          </button>
          <button
            onClick={handleNewDocument}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Process Another File</span>
          </button>
        </div>
      </div>

      {/* Main Download Card */}
      <div className="card-surface p-8 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/30">
              <span className="text-3xl font-black font-mono">X</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Multilingual_QnA.xlsx
                </h3>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Processed from <span className="font-semibold text-slate-700 dark:text-slate-300">{documentInfo?.filename || 'Document'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  3 Worksheets (English, Hindi, Marathi)
                </span>
                <span>•</span>
                <span className="font-medium">2 Columns (Questions, Answers)</span>
                <span>•</span>
                <span className="font-medium">{enPairs.length} Q&A Pairs Each</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-stretch sm:items-end gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              <span>Download Excel</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              Direct openpyxl binary download (.xlsx)
            </span>
          </div>
        </div>
      </div>

      {/* Live 3-Sheet Excel Preview Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Workbook Sheet Preview</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive preview of worksheets as structured in Multilingual_QnA.xlsx
            </p>
          </div>

          {/* Worksheet Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['English', 'Hindi', 'Marathi'] as const).map((sheet) => (
              <button
                key={sheet}
                onClick={() => setActivePreviewSheet(sheet)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activePreviewSheet === sheet
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {sheet === 'English' ? '🇬🇧 English' : sheet === 'Hindi' ? '🇮🇳 Hindi' : '🇮🇳 Marathi'}
              </button>
            ))}
          </div>
        </div>

        {/* Excel Styled Table Preview */}
        <div className="card-surface overflow-hidden border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-800 text-white border-b border-slate-700">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider w-14 text-center border-r border-slate-700">
                    Row
                  </th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider w-5/12 border-r border-slate-700">
                    {questionHeader} (Col A)
                  </th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider w-7/12">
                    {answerHeader} (Col B)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {currentSheetData.map((pair, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 1 ? 'bg-slate-50/70 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-900'}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 border-r border-slate-100 dark:border-slate-800/60 align-top">
                      {idx + 2}
                    </td>
                    <td className="py-3 px-6 font-medium text-slate-900 dark:text-slate-100 leading-relaxed border-r border-slate-100 dark:border-slate-800/60 align-top">
                      {pair.question}
                    </td>
                    <td className="py-3 px-6 text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                      {pair.answer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-2.5 bg-slate-100/60 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Worksheet: {activePreviewSheet} | Freeze Header: Row 1 | Auto-filter: Enabled</span>
            <span>Total Rows: {currentSheetData.length + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
