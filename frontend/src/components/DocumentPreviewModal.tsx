import React from 'react';
import { X, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ isOpen, onClose }) => {
  const { documentInfo, previewText } = useApp();

  if (!isOpen || !documentInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-md">
                {documentInfo.filename}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Document Metadata & Extracted Text
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">Type & Size</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {documentInfo.file_type} ({documentInfo.file_size_formatted})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Pages</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {documentInfo.page_count}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Words</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {documentInfo.word_count.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Language</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {documentInfo.detected_language}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Extracted Text Content
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-text">
            {previewText || 'No text preview available.'}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
