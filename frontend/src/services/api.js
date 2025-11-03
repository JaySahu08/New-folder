const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Analyze resume text
  async analyzeText(resumeText, jobDescription) {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to connect to analysis server');
    }
  }

  // Analyze resume file
  async analyzeFile(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/file`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'File analysis failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to upload and analyze file');
    }
  }

  // Check backend health
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  }

  // Contact form
  async submitContact(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to send message');
    }
  }
}

export const apiService = new ApiService();