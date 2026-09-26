import React from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Product Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          About Multilingual QnA Generator
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          This application converts arbitrary text documents into context-aware, grounded Question-Answer pairs and exports them seamlessly across English, Hindi, and Marathi in a structured Excel workbook.
        </p>
      </div>

      {/* Core Technology Stack Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <span>Implemented Technology Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-surface p-5 space-y-2">
            <div className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span>Frontend Architecture</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-2">
              <li>• React 18 with TypeScript & Vite</li>
              <li>• Tailwind CSS for modern enterprise styling</li>
              <li>• React Router DOM for seamless navigation</li>
              <li>• Lucide React icons</li>
              <li>• Responsive tables with search and clipboard copy</li>
            </ul>
          </div>

          <div className="card-surface p-5 space-y-2">
            <div className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span>Backend & AI Engine</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-2">
              <li>• Python FastAPI with Pydantic schemas</li>
              <li>• OpenRouter API integration (OpenAI-compatible)</li>
              <li>• Configurable LLM models with retry logic</li>
              <li>• Asynchronous stage pipeline tracking</li>
              <li>• Real-time job status polling</li>
            </ul>
          </div>

          <div className="card-surface p-5 space-y-2">
            <div className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span>Document Processing</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-2">
              <li>• <strong className="text-slate-800 dark:text-slate-200">PDF:</strong> pypdf for page-by-page text extraction</li>
              <li>• <strong className="text-slate-800 dark:text-slate-200">DOCX:</strong> python-docx extracting paragraphs & tables</li>
              <li>• <strong className="text-slate-800 dark:text-slate-200">TXT:</strong> Multi-encoding UTF-8 / latin-1 reader</li>
              <li>• Sentence-boundary aware text chunker</li>
              <li>• Language detection via langdetect</li>
            </ul>
          </div>

          <div className="card-surface p-5 space-y-2">
            <div className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span>Multilingual & Excel Export</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-2">
              <li>• English Q&A context generation</li>
              <li>• Hindi (हिंदी) & Marathi (मराठी) translation</li>
              <li>• openpyxl Excel workbook generator</li>
              <li>• Exactly 3 sheets: English, Hindi, Marathi</li>
              <li>• Exactly 2 columns: Questions and Answers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="card-surface p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Key Engineering Principles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block">Strict Context Grounding</strong>
              <span className="text-slate-500 dark:text-slate-400">Questions are synthesized solely from the uploaded text with zero hallucinated facts.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block">Devanagari Preservation</strong>
              <span className="text-slate-500 dark:text-slate-400">Technical terminology, numbers, and formulas are preserved during Hindi and Marathi translations.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block">Clean Excel Formatting</strong>
              <span className="text-slate-500 dark:text-slate-400">Frozen headers, text wrapping, auto-filters, and auto column widths for immediate report readability.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block">Secure Session Storage</strong>
              <span className="text-slate-500 dark:text-slate-400">Files and Q&A pairs are cached in temporary storage and cleaned up automatically.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
