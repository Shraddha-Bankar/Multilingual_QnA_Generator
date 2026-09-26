import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  ArrowRight,
  Loader2,
  FileCode2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import type { DifficultyLevel } from '../types';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    jobId,
    documentInfo,
    settings,
    setUploadedDocument,
    updateSettings,
    resetSession,
    setError,
    errorMessage,
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      setError('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size === 0) {
      setError('The uploaded file is empty.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await api.uploadDocument(file);
      setUploadedDocument(response.job_id, response.document_info, response.preview_text);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to upload document.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateClick = () => {
    if (!jobId || !documentInfo) {
      setError('Please upload a document first.');
      return;
    }
    navigate('/processing');
  };

  // Sample file load helper for quick evaluation demo
  const loadSampleDoc = async (sampleName: string, sampleContent: string) => {
    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const file = new File([blob], sampleName, { type: 'text/plain' });
    await handleFileChange(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Upload your document
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload one PDF, DOCX, or TXT file to begin multilingual Q&A generation.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload Notice</p>
            <p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Zone or Uploaded File Card */}
      {!documentInfo ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-4 ring-blue-500/10 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {isUploading ? 'Validating and Extracting Text...' : 'Drag & drop your document here'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            or click to browse from your computer
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">PDF</span>
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">DOCX</span>
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">TXT</span>
            <span>• Max size: 25MB</span>
          </div>
        </div>
      ) : (
        /* Uploaded Document Details Card */
        <div className="card-surface p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {documentInfo.filename}
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {documentInfo.file_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {documentInfo.file_size_formatted} • {documentInfo.word_count.toLocaleString()} words • {documentInfo.page_count} page(s)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Text</span>
              </button>
              <button
                onClick={resetSession}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block">Detected Language</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {documentInfo.detected_language} ({documentInfo.detected_language_code})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Extracted Characters</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {documentInfo.character_count.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Context Chunks</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {documentInfo.chunks_count} chunk(s)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Validation</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Text Verified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Sample Input Selector */}
      <div className="card-surface p-5 bg-gradient-to-r from-blue-50/40 to-slate-50 dark:from-slate-900 dark:to-slate-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileCode2 className="w-4 h-4 text-blue-500" />
            Quick Test Samples (Reference Documents)
          </span>
          <span className="text-[11px] text-slate-400">Click to instantly load</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              loadSampleDoc(
                'Indian_Knowledge_Systems.txt',
                `Indian Knowledge Systems (IKS): Foundations, Philosophy, and Contributions

1. Overview and Core Philosophy
Indian Knowledge Systems (IKS) encompass the vast corpus of traditional knowledge, philosophy, scientific methodologies, mathematics, metallurgy, architecture, astronomy, and health sciences developed on the Indian subcontinent over millennia. At the core of IKS is an integrated worldview that perceives knowledge as holistic, connecting humanity, nature, and the universe.

2. Primary Textual Corpus and Vedic Foundations
The foundation of IKS resides in the Vedic literature: Rigveda, Samaveda, Yajurveda, and Atharvaveda, accompanied by the Aranyakas, Brahmanas, and Upanishads. Complementing these are the six Vedangas: Shiksha (phonetics), Kalpa (rituals and social law), Vyakarana (grammar), Nirukta (etymology), Chandas (prosody), and Jyotisha (astronomy). Panini's Ashtadhyayi stands as a monumental work in formal linguistics and generative grammar.

3. Mathematics and Astronomy
Ancient and medieval Indian mathematicians made pioneering contributions to global science. Aryabhata introduced foundational concepts of algebra, spherical trigonometry, and proposed that the Earth rotates on its axis. Brahmagupta established the mathematical principles of zero (Shunya) as a number and rules for negative integers. Bhaskaracharya elaborated on calculus principles, planetary positions, and the cyclic method (Chakravala) for solving indeterminate quadratic equations.

4. Health Sciences: Ayurveda and Yoga
Ayurveda, detailed in classic treatises like Charaka Samhita and Sushruta Samhita, emphasizes preventive health, balancing the three doshas (Vata, Pitta, Kapha), and holistic well-being. Sushruta is celebrated for pioneering surgical techniques, including rhinoplasty and cataract surgeries. Patanjali's Yoga Sutras provide a systematic eight-limbed framework (Ashtanga Yoga) for mental discipline, focus, and spiritual development.

5. Metallurgy, Architecture, and Sustainable Practices
Historical Indian metallurgy achieved extraordinary feats such as the rust-resistant Iron Pillar of Delhi and the casting of high-grade Wootz steel. Vastu Shastra and temple architecture reflected sophisticated geometric planning, acoustic engineering, and environmental harmony.`
              )
            }
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            📄 Indian_Knowledge_Systems (IKS)
          </button>

          <button
            onClick={() =>
              loadSampleDoc(
                'Machine_Learning_Fundamentals.txt',
                `Machine Learning and Modern Artificial Intelligence: Core Principles

1. Introduction to Machine Learning
Machine Learning (ML) is a branch of artificial intelligence focused on building systems that learn from data, identify patterns, and make decisions with minimal human intervention. Rather than following explicitly programmed rules, ML algorithms optimize mathematical objective functions to generalize from past observations.

2. Paradigms of Learning
Machine learning methodologies are categorized into three primary paradigms:
- Supervised Learning: Algorithms learn a mapping function from input features to known target labels using labeled training datasets. Common algorithms include Linear Regression, Support Vector Machines, Random Forests, and Gradient Boosting.
- Unsupervised Learning: Systems discover hidden structures, groupings, or representations within unlabeled data. Prominent techniques include K-Means Clustering, Principal Component Analysis (PCA), and Autoencoders.
- Reinforcement Learning: Agents interact with dynamic environments to maximize cumulative numerical rewards through trial-and-error exploration and exploitation, widely applied in robotics, gaming, and autonomous navigation.

3. Deep Learning and Neural Network Architectures
Deep Learning utilizes deep artificial neural networks inspired by biological neural circuits. Convolutional Neural Networks (CNNs) specialize in grid-like visual data for computer vision. Transformers revolutionize natural language processing through multi-head self-attention mechanisms that capture long-range contextual relationships.`
              )
            }
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            🤖 Machine_Learning_Fundamentals
          </button>
        </div>
      </div>

      {/* Generation Settings Card */}
      <div className="card-surface p-6 space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Generation Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Number of Questions
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 25].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => updateSettings({ num_questions: count })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    settings.num_questions === count
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Balanced coverage across all document sections.
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Question Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Easy', 'Medium', 'Hard', 'Mixed'] as DifficultyLevel[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => updateSettings({ difficulty: diff })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    settings.difficulty === diff
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Mixed combines conceptual, factual, and analytical questions.
            </p>
          </div>
        </div>

        {/* Target Output Languages Display */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Target Output Languages (All Included)
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { code: 'EN', name: 'English', flag: '🇬🇧' },
              { code: 'HI', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
              { code: 'MR', name: 'Marathi (मराठी)', flag: '🇮🇳' },
            ].map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang.flag} {lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerateClick}
          disabled={!documentInfo || isUploading}
          className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all ${
            documentInfo && !isUploading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 cursor-pointer hover:translate-y-[-1px]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Generate Q&A</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
