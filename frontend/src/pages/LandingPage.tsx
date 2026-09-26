import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Cpu,
  Globe2,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-600/10 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Document Intelligence SaaS</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Turn Documents into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Multilingual Q&A
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered document-to-question-answer generation in English, Hindi, and Marathi. Upload any PDF, DOCX, or TXT file and generate context-grounded Q&A workbooks in seconds.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/25 transition-all text-sm group"
            >
              <span>Start Generating</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#workflow"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-sm"
            >
              How It Works
            </a>
          </div>

          {/* Visual Workflow Diagram */}
          <div id="workflow" className="mt-16 sm:mt-24 pt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
              Automated Document Intelligence Pipeline
            </p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
              {/* Step 1 */}
              <div className="card-surface p-4 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">01. Input</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Document</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">PDF / DOCX / TXT</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="card-surface p-4 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">02. Engine</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">AI Processing</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">OpenRouter LLM</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="card-surface p-4 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold">EN</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">03. Source</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">English Q&A</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Context Grounded</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="card-surface p-4 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold">HI</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">04. Indic</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Hindi Q&A</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">देवनागरी Script</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="card-surface p-4 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold">MR</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">05. Indic</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Marathi Q&A</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">देवनागरी Script</p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="card-surface p-4 flex flex-col justify-between border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/20">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block">06. Export</span>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Excel Workbook</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">3 Sheets (Questions/Answers)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for Robust Document Intelligence
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered with strict quality validation, contextual chunking, and clean tabular export.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Any Document Format
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Full native support for PDF, DOCX, and TXT files. Handles arbitrary topics, books, research papers, and technical guides dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Context-Aware Q&A
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Questions and answers are generated strictly from the uploaded document text. Zero hallucination tolerance with chunk-aware document coverage.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Three Natural Languages
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates clean English, natural Hindi, and fluent Marathi with proper Devanagari script while preserving formulas and technical terminology.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Clean Excel Output
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Outputs <code className="text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">Multilingual_QnA.xlsx</code> with exactly 3 worksheets (English, Hindi, Marathi) and exactly 2 columns (Questions, Answers).
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Validation & Deduplication
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated length verification, normalized string deduplication, and quality scoring ensure no redundant or trivial Q&A pairs.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-surface p-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Privacy-Focused Processing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Files are processed temporarily in session memory and temporary cache without permanent database persistence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Multilingual QnA Generator</span> — Built for Document Intelligence
          </div>
          <div className="flex items-center gap-4">
            <span>Supported: PDF | DOCX | TXT</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">English | Hindi | Marathi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
