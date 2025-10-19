// API service for communicating with the Higgsfield backend
const API_BASE_URL = 'http://localhost:8000';

export interface LectureTopicRequest {
  topic: string;
  duration_minutes?: number;
  difficulty_level?: string;
  target_audience?: string;
}

export interface SlideInstruction {
  slide_number: number;
  title: string;
  content: string;
  image_prompt: string;
  slide_type: string;
  script: string;
}

export interface LectureResponse {
  status: number;
  topic: string;
  duration_minutes: number;
  slides: SlideInstruction[];
  total_slides: number;
}

export interface GeneratedTextResponse {
  status: number;
  text: string;
}

export interface TextForGenerationPrompt {
  text: string;
}

export interface ItemResult {
  id: string;
  url?: string;
}

export interface GenerateImageResponse {
  status: number;
  result: ItemResult[];
}

export interface VideoGenerationResponse {
  status: number;
  task_id: string;
  message?: string;
}

export interface TextAndAvatarGeneration {
  text: string;
  avatar: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 30000
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Lecture generation endpoints
  async generateLecture(request: LectureTopicRequest): Promise<LectureResponse> {
    return this.request<LectureResponse>('/lecture/generate-lecture', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getLectureByTopic(
    topic: string,
    duration: number = 10,
    difficulty: string = 'beginner'
  ): Promise<LectureResponse> {
    const params = new URLSearchParams({
      duration: duration.toString(),
      difficulty,
    });
    
    return this.request<LectureResponse>(`/lecture/${encodeURIComponent(topic)}?${params}`);
  }

  // Text generation endpoints
  async generateText(prompt: string): Promise<GeneratedTextResponse> {
    return this.request<GeneratedTextResponse>('/lecture/generate-text', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  async generateTextFromPrompt(request: TextForGenerationPrompt): Promise<GeneratedTextResponse> {
    return this.request<GeneratedTextResponse>('/generate-text', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }


  async generateVideo(text: string, avatar: string): Promise<void> {
    const controller = new AbortController();
    const timeout = 20 * 60 * 1000; // 20 minutes

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}/generate-video`, {
        method: "POST",
        body: JSON.stringify({ text, avatar }),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "lecture_video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
        throw err; // Re-throw to maintain error handling in components
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async downloadVideo(taskId: string): Promise<Blob> {
    const url = `${this.baseUrl}/download-video/${taskId}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Video download failed for task ${taskId}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

