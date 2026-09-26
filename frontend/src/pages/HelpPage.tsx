import React from 'react';
import {
  HelpCircle,
  Key,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Documentation & Setup</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Help & Configuration Guide
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Step-by-step instructions for running, configuring, and troubleshooting the Multilingual QnA Generator.
        </p>
      </div>

      {/* Setup Steps */}
      <div className="card-surface p-6 space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          <span>Configuring OpenRouter API Key</span>
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Obtain an OpenRouter API Key
              </p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                Visit{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline inline-flex items-center gap-1 font-medium"
                >
                  openrouter.ai/keys <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and generate a free or standard API key.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Add Key to <code className="font-mono text-blue-600 dark:text-blue-400">.env</code> in Project Root
              </p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                Edit the <code className="font-mono">.env</code> file:
              </p>
              <div className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs">
                OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx<br />
                OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Start Backend & Frontend Services
              </p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                Open two terminal windows:
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs">
                  <span className="text-slate-400 block">// Terminal 1: Backend</span>
                  uvicorn app.main:app --reload
                </div>
                <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs">
                  <span className="text-slate-400 block">// Terminal 2: Frontend</span>
                  cd frontend<br />
                  npm run dev
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Security Guarantee:</strong> API keys are kept strictly on the backend server and are never exposed to the frontend client.
          </span>
        </div>
      </div>

      {/* Troubleshooting FAQ */}
      <div className="card-surface p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Troubleshooting & FAQ</span>
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Q: What happens if I don't enter an OpenRouter key?
            </h4>
            <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              The application includes an offline heuristic parser and local multilingual vocabulary mapping. It extracts real sentences from the uploaded text and translates them to Hindi/Marathi so you can test the full end-to-end pipeline and Excel generation without an API key!
            </p>
          </div>

          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Q: How does the system handle scanned image-only PDFs?
            </h4>
            <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              If a PDF contains no digital text layers (e.g. scanned image pages), the system displays a clear validation message: <em>"No extractable text was found in this PDF. Please upload a text-based PDF or DOCX/TXT document."</em>
            </p>
          </div>

          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Q: What should I do if OpenRouter returns rate limit (HTTP 429)?
            </h4>
            <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              The backend automatically executes retries with exponential backoff. If free model limits persist, you can switch to another model ID in <code className="font-mono">.env</code> (e.g. <code className="font-mono">google/gemini-2.0-flash-exp:free</code> or <code className="font-mono">meta-llama/llama-3.3-70b-instruct</code>).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Q: Are the old .doc files supported?
            </h4>
            <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              As per project specifications, legacy binary <code>.doc</code> files are not directly supported. Please save or convert the file to <code>.docx</code> format before uploading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
