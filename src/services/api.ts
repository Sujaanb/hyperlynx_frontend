const API_BASE_URL = `${import.meta.env.VITE_API_URL}/HL/content/v1`;

export interface GenerateContentRequest {
  question: string;
  local_llm: boolean;
  file?: File;
}

export interface GenerateContentResponse {
  status: string;
  message: string;
  data: string;
}

export const generateContent = async (
  request: GenerateContentRequest
): Promise<GenerateContentResponse> => {
  try {
    const formData = new FormData();
    formData.append('question', request.question);
    formData.append('local_llm', request.local_llm.toString());
    
    if (request.file) {
      formData.append('file', request.file);
    }

    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};
