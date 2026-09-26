import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  DocumentMetadata,
  JobResponse,
  MultilingualQnAResult,
  GenerationSettings,
} from '../types';

interface AppContextType {
  jobId: string | null;
  documentInfo: DocumentMetadata | null;
  previewText: string;
  jobResponse: JobResponse | null;
  results: MultilingualQnAResult | null;
  settings: GenerationSettings;
  isProcessing: boolean;
  errorMessage: string | null;
  setUploadedDocument: (jobId: string, info: DocumentMetadata, preview: string) => void;
  updateSettings: (newSettings: Partial<GenerationSettings>) => void;
  setJobResponse: (job: JobResponse | null) => void;
  setResults: (res: MultilingualQnAResult | null) => void;
  setProcessing: (val: boolean) => void;
  setError: (msg: string | null) => void;
  resetSession: () => void;
}

const defaultSettings: GenerationSettings = {
  num_questions: 10,
  difficulty: 'Mixed',
  languages: ['English', 'Hindi', 'Marathi'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobId, setJobId] = useState<string | null>(() => sessionStorage.getItem('multilingual_qna_job_id'));
  const [documentInfo, setDocumentInfo] = useState<DocumentMetadata | null>(() => {
    const saved = sessionStorage.getItem('multilingual_qna_doc_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [previewText, setPreviewText] = useState<string>(() => sessionStorage.getItem('multilingual_qna_preview') || '');
  const [jobResponse, setJobResponse] = useState<JobResponse | null>(null);
  const [results, setResults] = useState<MultilingualQnAResult | null>(() => {
    const saved = sessionStorage.getItem('multilingual_qna_results');
    return saved ? JSON.parse(saved) : null;
  });
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) sessionStorage.setItem('multilingual_qna_job_id', jobId);
    else sessionStorage.removeItem('multilingual_qna_job_id');
  }, [jobId]);

  useEffect(() => {
    if (documentInfo) sessionStorage.setItem('multilingual_qna_doc_info', JSON.stringify(documentInfo));
    else sessionStorage.removeItem('multilingual_qna_doc_info');
  }, [documentInfo]);

  useEffect(() => {
    if (previewText) sessionStorage.setItem('multilingual_qna_preview', previewText);
    else sessionStorage.removeItem('multilingual_qna_preview');
  }, [previewText]);

  useEffect(() => {
    if (results) sessionStorage.setItem('multilingual_qna_results', JSON.stringify(results));
    else sessionStorage.removeItem('multilingual_qna_results');
  }, [results]);

  const setUploadedDocument = (newJobId: string, info: DocumentMetadata, preview: string) => {
    setJobId(newJobId);
    setDocumentInfo(info);
    setPreviewText(preview);
    setResults(null);
    setJobResponse(null);
    setError(null);
  };

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSession = () => {
    setJobId(null);
    setDocumentInfo(null);
    setPreviewText('');
    setJobResponse(null);
    setResults(null);
    setProcessing(false);
    setError(null);
    sessionStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        jobId,
        documentInfo,
        previewText,
        jobResponse,
        results,
        settings,
        isProcessing,
        errorMessage,
        setUploadedDocument,
        updateSettings,
        setJobResponse,
        setResults,
        setProcessing,
        setError,
        resetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
