import axios from 'axios';
import type {
  UploadResponse,
  JobResponse,
  MultilingualQnAResult,
  HealthResponse,
  DifficultyLevel,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

export const api = {
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  uploadDocument: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  startGeneration: async (
    jobId: string,
    numQuestions: number = 10,
    difficulty: DifficultyLevel = 'Mixed'
  ): Promise<JobResponse> => {
    const response = await apiClient.post<JobResponse>('/generate', {
      job_id: jobId,
      num_questions: numQuestions,
      difficulty: difficulty,
    });
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<JobResponse> => {
    const response = await apiClient.get<JobResponse>(`/status/${jobId}`);
    return response.data;
  },

  getResults: async (jobId: string): Promise<MultilingualQnAResult> => {
    const response = await apiClient.get<MultilingualQnAResult>(`/results/${jobId}`);
    return response.data;
  },

  getDownloadUrl: (jobId: string): string => {
    return `${API_BASE}/download/${jobId}`;
  },
};
