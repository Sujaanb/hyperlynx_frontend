const API_BASE_URL = 'http://localhost:8001/HL/content/v1';

export interface GenerateContentRequest {
  question: string;
  local_llm: boolean;
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
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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
