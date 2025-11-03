import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AnalysisSection = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('text-tab');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await apiService.checkHealth();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      setError('Backend server is not running. Please start the backend server.');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setError('');
    }
  };

  const handleFileUploadClick = () => {
    document.getElementById('resume-file').click();
  };

  // Handle text analysis
  const handleTextAnalysis = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const resumeText = document.getElementById('resume-text').value.trim();
    const jobDescription = document.getElementById('job-description').value.trim();

    // Validation
    if (!resumeText || !jobDescription) {
      setError('Please provide both resume text and job description');
      setIsLoading(false);
      return;
    }

    if (resumeText.length < 100) {
      setError('Resume text seems too short. Please provide more content (at least 100 characters).');
      setIsLoading(false);
      return;
    }

    if (jobDescription.length < 50) {
      setError('Job description seems too short. Please provide more details.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await apiService.analyzeText(resumeText, jobDescription);
      
      if (result.success) {
        // Store analysis results for ResultsSection to use
        localStorage.setItem('neurohire_analysis', JSON.stringify(result.analysis));
        navigateTo('results');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file analysis
  const handleFileAnalysis = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const fileInput = document.getElementById('resume-file');
    const jobDescription = document.getElementById('job-description-file').value.trim();

    // Validation
    if (!fileInput.files[0] || !jobDescription) {
      setError('Please select a resume file and provide job description');
      setIsLoading(false);
      return;
    }

    if (jobDescription.length < 50) {
      setError('Job description seems too short. Please provide more details.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);
    formData.append('jobDescription', jobDescription);

    try {
      const result = await apiService.analyzeFile(formData);
      
      if (result.success) {
        localStorage.setItem('neurohire_analysis', JSON.stringify(result.analysis));
        navigateTo('results');
      } else {
        throw new Error(result.error || 'File analysis failed');
      }
    } catch (err) {
      setError(err.message);
      console.error('File analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-section active">
      <div className="section-header">
        <h1>AI Resume Analysis</h1>
        <p>Upload your resume and job description to get instant AI-powered feedback on how well you match the role.</p>
        
        {/* Backend Status Indicator */}
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          backgroundColor: backendStatus === 'connected' ? 'var(--success)' : 
                         backendStatus === 'disconnected' ? 'var(--danger)' : 'var(--warning)',
          color: 'white',
          display: 'inline-block'
        }}>
          {backendStatus === 'connected' ? '✅ AI Server Connected' :
           backendStatus === 'disconnected' ? '❌ AI Server Disconnected' :
           '🔄 Checking AI Server...'}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: 'var(--danger)',
          color: 'white',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <strong>Error:</strong> {error}
          {backendStatus === 'disconnected' && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Make sure the backend server is running on port 5000
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>🧠 AI is analyzing your resume...</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            Extracting keywords, skills, and experience...
          </p>
        </div>
      )}

      {/* Analysis Forms */}
      {!isLoading && (
        <div className="analysis-container">
          <div className="analysis-tabs">
            <button 
              className={`analysis-tab ${activeTab === 'text-tab' ? 'active' : ''}`}
              onClick={() => setActiveTab('text-tab')}
              disabled={backendStatus === 'disconnected'}
            >
              Text Input
            </button>
            <button 
              className={`analysis-tab ${activeTab === 'file-tab' ? 'active' : ''}`}
              onClick={() => setActiveTab('file-tab')}
              disabled={backendStatus === 'disconnected'}
            >
              File Upload
            </button>
          </div>
          
          <div className="analysis-content">
            {/* Text Input Tab */}
            <div className={`tab-pane ${activeTab === 'text-tab' ? 'active' : ''}`}>
              <form onSubmit={handleTextAnalysis}>
                <div className="form-group">
                  <label htmlFor="resume-text">Paste Your Resume Text</label>
                  <textarea 
                    id="resume-text" 
                    name="resume-text" 
                    placeholder="Copy and paste your resume content here...
Example:
John Doe
Software Developer
5+ years experience in JavaScript, React, Node.js
Led team of 3 developers
Improved performance by 40%" 
                    required
                    disabled={isLoading || backendStatus === 'disconnected'}
                    rows="8"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="job-description">Paste Job Description</label>
                  <textarea 
                    id="job-description" 
                    name="job-description" 
                    placeholder="Copy and paste the job description here...
Example:
Senior Full Stack Developer
Requirements:
- 5+ years JavaScript/TypeScript experience
- React, Node.js, AWS
- Leadership experience
- Computer Science degree" 
                    required
                    disabled={isLoading || backendStatus === 'disconnected'}
                    rows="6"
                  />
                </div>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading || backendStatus === 'disconnected'}
                >
                  {isLoading ? '🔍 Analyzing...' : '🧠 Analyze Resume Match'}
                </button>
              </form>
            </div>
            
            {/* File Upload Tab */}
            <div className={`tab-pane ${activeTab === 'file-tab' ? 'active' : ''}`}>
              <form onSubmit={handleFileAnalysis}>
                <div className="form-group">
                  <label>Upload Your Resume</label>
                  <div 
                    className="file-upload" 
                    onClick={!isLoading && backendStatus !== 'disconnected' ? handleFileUploadClick : undefined}
                    style={{
                      opacity: (isLoading || backendStatus === 'disconnected') ? 0.6 : 1,
                      cursor: (isLoading || backendStatus === 'disconnected') ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <input 
                      type="file" 
                      id="resume-file" 
                      name="resume-file" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      disabled={isLoading || backendStatus === 'disconnected'}
                    />
                    <p>📄 Drag & drop your resume file here or click to browse</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                      Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
                    </p>
                  </div>
                  {fileName && (
                    <div style={{ marginTop: '0.5rem', fontWeight: '500', color: 'var(--success)' }}>
                      ✅ Selected: {fileName}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="job-description-file">Paste Job Description</label>
                  <textarea 
                    id="job-description-file" 
                    name="job-description" 
                    placeholder="Copy and paste the job description here..."
                    required
                    disabled={isLoading || backendStatus === 'disconnected'}
                    rows="6"
                  />
                </div>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading || backendStatus === 'disconnected'}
                >
                  {isLoading ? '🔍 Analyzing...' : '🧠 Analyze Resume Match'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('results')}>
          ← View Sample Results
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('benefits')}>
          Learn Benefits →
        </button>
      </div>
    </div>
  );
};

export default AnalysisSection;