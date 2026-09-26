import React, { useState } from 'react';
import { Search, Copy, Check, FileSpreadsheet } from 'lucide-react';
import type { QnAPair } from '../types';

interface TableViewProps {
  pairs: QnAPair[];
  language: 'English' | 'Hindi' | 'Marathi';
}

export const TableView: React.FC<TableViewProps> = ({ pairs, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const questionHeader = language === 'English' ? 'Questions' : 'प्रश्न';
  const answerHeader = language === 'English' ? 'Answers' : 'उत्तर';

  const filteredPairs = pairs.filter(
    p =>
      p.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopySingle = (id: number, question: string, answer: string) => {
    navigator.clipboard.writeText(`Q: ${question}\nA: ${answer}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = pairs
      .map((p, i) => `${i + 1}. Q: ${p.question}\n   A: ${p.answer}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Copy All */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${language} Q&A pairs...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied All</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy All Pairs</span>
            </>
          )}
        </button>
      </div>

      {/* Table Container */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold text-xs text-slate-300 uppercase tracking-wider w-16 text-center">
                  #
                </th>
                <th className="py-3.5 px-6 font-semibold text-xs text-slate-100 uppercase tracking-wider w-5/12">
                  {questionHeader}
                </th>
                <th className="py-3.5 px-6 font-semibold text-xs text-slate-100 uppercase tracking-wider w-6/12">
                  {answerHeader}
                </th>
                <th className="py-3.5 px-4 font-semibold text-xs text-slate-300 uppercase tracking-wider w-14 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPairs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-medium">No matching Q&A pairs found.</p>
                    <p className="text-xs mt-1">Try adjusting your search query.</p>
                  </td>
                </tr>
              ) : (
                filteredPairs.map((pair, index) => {
                  const itemId = pair.id ?? index + 1;
                  const isCopied = copiedId === itemId;

                  return (
                    <tr
                      key={itemId}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 text-center font-mono text-xs text-slate-400 dark:text-slate-500 align-top">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-slate-900 dark:text-slate-100 font-medium leading-relaxed align-top">
                        {pair.question}
                      </td>
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                        {pair.answer}
                      </td>
                      <td className="py-4 px-4 text-center align-top">
                        <button
                          onClick={() => handleCopySingle(itemId, pair.question, pair.answer)}
                          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Copy this Q&A"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            Showing {filteredPairs.length} of {pairs.length} pairs
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            {language} Worksheet
          </span>
        </div>
      </div>
    </div>
  );
};
