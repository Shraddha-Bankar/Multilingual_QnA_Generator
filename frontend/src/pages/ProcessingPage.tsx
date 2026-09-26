import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import type { StageStatus } from '../types';

export const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    jobId,
    documentInfo,
    settings,
    jobResponse,
    setJobResponse,
    setResults,
    setError,
    errorMessage,
  } = useApp();

  const [hasStarted, setHasStarted] = useState(false);
  const [pollInterval, setPollInterval] = useState<number | null>(null);

  useEffect(() => {
    if (!jobId || !documentInfo) {
      navigate('/upload');
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      startGenerationProcess();
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [jobId]);

  const startGenerationProcess = async () => {
    if (!jobId) return;

    try {
      const initialJob = await api.startGeneration(
        jobId,
        settings.num_questions,
        settings.difficulty
      );
      setJobResponse(initialJob);

      // Start polling status
      const interval = window.setInterval(async () => {
        try {
          const statusRes = await api.getJobStatus(jobId);
          setJobResponse(statusRes);

          if (statusRes.status === 'completed') {
            window.clearInterval(interval);
            if (statusRes.results) {
              setResults(statusRes.results);
            } else {
              const resData = await api.getResults(jobId);
              setResults(resData);
            }
          } else if (statusRes.status === 'failed') {
            window.clearInterval(interval);
            setError(statusRes.error_message || 'Processing failed.');
          }
        } catch (e: any) {
          console.error('Polling error:', e);
        }
      }, 700);

      setPollInterval(interval);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to start generation.';
      setError(msg);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasStarted(false);
    startGenerationProcess();
  };

  const stages = jobResponse?.stages || [
    { id: 'stage_upload', label: 'Upload validation', status: 'completed' as StageStatus, detail: 'File structure verified' },
    { id: 'stage_extract', label: 'Extracting document text', status: 'in_progress' as StageStatus },
    { id: 'stage_language', label: 'Detecting language', status: 'pending' as StageStatus },
    { id: 'stage_clean', label: 'Cleaning content', status: 'pending' as StageStatus },
    { id: 'stage_chunk', label: 'Splitting content into chunks', status: 'pending' as StageStatus },
    { id: 'stage_generate_en', label: 'Generating English Q&A using OpenRouter', status: 'pending' as StageStatus },
    { id: 'stage_validate_qa', label: 'Validating Q&A', status: 'pending' as StageStatus },
    { id: 'stage_dedup', label: 'Removing duplicates', status: 'pending' as StageStatus },
    { id: 'stage_translate_hi', label: 'Translating to Hindi', status: 'pending' as StageStatus },
    { id: 'stage_translate_mr', label: 'Translating to Marathi', status: 'pending' as StageStatus },
    { id: 'stage_excel', label: 'Creating Excel workbook', status: 'pending' as StageStatus },
  ];

  const progressPercent = jobResponse?.progress_percentage || (jobResponse?.status === 'completed' ? 100 : 15);
  const isCompleted = jobResponse?.status === 'completed';
  const isFailed = jobResponse?.status === 'failed' || !!errorMessage;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <span>Processing Completed</span>
              </>
            ) : isFailed ? (
              <>
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <span>Processing Alert</span>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span>Processing Document...</span>
              </>
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isCompleted
              ? 'All multilingual Q&A pairs and Excel workbook are generated and ready.'
              : 'Please wait while the AI analyzes the document context and translates Q&A.'}
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
          >
            <span>View Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="card-surface p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">
            {jobResponse?.current_stage || 'Executing document intelligence pipeline...'}
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted
                ? 'bg-emerald-500'
                : isFailed
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Stages vs Document Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stages Timeline Column */}
        <div className="lg:col-span-2 card-surface p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Processing Stages</span>
          </h3>

          <div className="space-y-3">
            {stages.map((stage) => {
              const isCurrent = stage.status === 'in_progress';
              const isDone = stage.status === 'completed';
              const isFail = stage.status === 'failed';

              return (
                <div
                  key={stage.id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 shadow-sm'
                      : isDone
                      ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80'
                      : isFail
                      ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                      : 'bg-transparent border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                      ) : isFail ? (
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-blue-900 dark:text-blue-200'
                            : isDone
                            ? 'text-slate-800 dark:text-slate-200'
                            : isFail
                            ? 'text-rose-900 dark:text-rose-200'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      {stage.detail && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {stage.detail}
                        </p>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={stage.status} size="sm" />
                </div>
              );
            })}
          </div>

          {isFailed && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
              <div className="text-xs text-rose-700 dark:text-rose-300">
                <span className="font-semibold block">Generation Stopped:</span>
                <span>{errorMessage || jobResponse?.error_message}</span>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Document Info Sidebar Column */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Document Info</span>
            </h3>

            {documentInfo ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">File Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]" title={documentInfo.filename}>
                    {documentInfo.filename}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">File Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.file_type}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">File Size</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.file_size_formatted}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Pages</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.page_count}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Word Count</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.word_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Detected Language</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.detected_language}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Context Chunks</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {documentInfo.chunks_count}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="card-surface p-5 bg-gradient-to-tr from-slate-900 to-blue-950 text-white border-none shadow-md">
            <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold text-xs">
              <Layers className="w-4 h-4" />
              <span>Target Configuration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generating {settings.num_questions} {settings.difficulty} questions in English, Hindi, and Marathi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
