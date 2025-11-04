const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/HL/content/v1';

export interface GenerateContentResponse {
  status: string;
  message: string;
  data: string;
}

export interface GenerateContentRequest {
  question: string;
  local_llm?: boolean;
  file?: File;
}

export class CopilotApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'CopilotApiError';
  }
}

export const copilotApi = {
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    const formData = new FormData();
    formData.append('question', request.question);
    formData.append('local_llm', String(request.local_llm || false));
    
    if (request.file) {
      formData.append('file', request.file);
    }

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new CopilotApiError(
          response.status,
          errorData.detail || `Request failed with status ${response.status}`
        );
      }

      const data: GenerateContentResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof CopilotApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new CopilotApiError(
        0,
        error instanceof Error ? error.message : 'Failed to connect to the server'
      );
    }
  },
};
