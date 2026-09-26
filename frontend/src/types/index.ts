export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Mixed";

export interface QnAPair {
  id?: number;
  question: string;
  answer: string;
}

export interface DocumentMetadata {
  filename: string;
  file_type: string;
  file_size_bytes: number;
  file_size_formatted: string;
  page_count: number;
  word_count: number;
  character_count: number;
  detected_language: string;
  detected_language_code: string;
  chunks_count: number;
}

export interface GenerationSettings {
  num_questions: number;
  difficulty: DifficultyLevel;
  languages: string[];
}

export type StageStatus = "pending" | "in_progress" | "completed" | "failed";

export interface ProcessingStage {
  id: string;
  label: string;
  status: StageStatus;
  detail?: string;
}

export type JobStatus = "idle" | "queued" | "processing" | "completed" | "failed";

export interface MultilingualQnAResult {
  english: QnAPair[];
  hindi: QnAPair[];
  marathi: QnAPair[];
}

export interface JobResponse {
  job_id: string;
  status: JobStatus;
  progress_percentage: number;
  current_stage: string;
  stages: ProcessingStage[];
  document_info?: DocumentMetadata;
  error_message?: string;
  results?: MultilingualQnAResult;
  excel_download_url?: string;
  created_at: number;
  completed_at?: number;
}

export interface UploadResponse {
  job_id: string;
  document_info: DocumentMetadata;
  preview_text: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  openrouter_configured: boolean;
  model: string;
}
