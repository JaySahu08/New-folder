const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async analyzeText(resumeText, jobDescription) {
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
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return await response.json();
  }

  async analyzeFile(formData) {
    const response = await fetch(`${API_BASE_URL}/analyze/file`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'File analysis failed');
    }

    return await response.json();
  }

  async submitContact(formData) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return await response.json();
  }

  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  }
}

export const apiService = new ApiService();