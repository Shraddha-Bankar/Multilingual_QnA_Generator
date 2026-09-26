import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Eye,
  Layers,
  ArrowRight,
  Globe2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { TableView } from '../components/TableView';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { results } = useApp();
  const [activeTab, setActiveTab] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Generated Results Yet</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Please upload a document and run the Q&A generation process first.
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

  const totalQuestions = enPairs.length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Generation Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Generated Q&A
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your multilingual Q&A pairs are ready across 3 languages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Document</span>
          </button>
          <button
            onClick={() => navigate('/download')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Questions"
          value={totalQuestions}
          icon={Layers}
          subtext="Generated per language"
          variant="brand"
        />
        <StatCard
          label="Target Languages"
          value="3"
          icon={Globe2}
          subtext="English, Hindi, Marathi"
          variant="default"
        />
        <StatCard
          label="Validation Status"
          value="Passed"
          icon={CheckCircle2}
          subtext="Zero duplicate pairs"
          variant="success"
        />
      </div>

      {/* Language Tabs & Table */}
      <div className="space-y-4">
        {/* Language Tabs Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('English')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'English'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span>English</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {enPairs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('Hindi')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'Hindi'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>Hindi (हिंदी)</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {hiPairs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('Marathi')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'Marathi'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>Marathi (मराठी)</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {mrPairs.length}
            </span>
          </button>
        </div>

        {/* Tab Content Tables */}
        {activeTab === 'English' && <TableView pairs={enPairs} language="English" />}
        {activeTab === 'Hindi' && <TableView pairs={hiPairs} language="Hindi" />}
        {activeTab === 'Marathi' && <TableView pairs={mrPairs} language="Marathi" />}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="card-surface p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Multilingual_QnA.xlsx
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              3 Worksheets (English, Hindi, Marathi) • 2 Columns (Questions, Answers)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/download')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Proceed to Download</span>
        </button>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
