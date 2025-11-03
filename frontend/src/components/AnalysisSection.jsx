import React, { useState } from 'react'

const AnalysisSection = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('text-tab')
  const [fileName, setFileName] = useState('')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleFileUploadClick = () => {
    document.getElementById('resume-file').click()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Simulate analysis
    setTimeout(() => {
      navigateTo('results')
    }, 2000)
  }

  return (
    <div className="content-section active">
      <div className="section-header">
        <h1>AI Resume Analysis</h1>
        <p>Upload your resume and job description to get instant AI-powered feedback on how well you match the role.</p>
      </div>

      <div className="analysis-container">
        <div className="analysis-tabs">
          <button 
            className={`analysis-tab ${activeTab === 'text-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('text-tab')}
          >
            Text Input
          </button>
          <button 
            className={`analysis-tab ${activeTab === 'file-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('file-tab')}
          >
            File Upload
          </button>
        </div>
        
        <div className="analysis-content">
          {/* Text Input Tab */}
          <div className={`tab-pane ${activeTab === 'text-tab' ? 'active' : ''}`}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="resume-text">Paste Your Resume Text</label>
                <textarea 
                  id="resume-text" 
                  name="resume-text" 
                  placeholder="Copy and paste your resume content here..." 
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="job-description">Paste Job Description</label>
                <textarea 
                  id="job-description" 
                  name="job-description" 
                  placeholder="Copy and paste the job description here..." 
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                🧠 Analyze Resume Match
              </button>
            </form>
          </div>
          
          {/* File Upload Tab */}
          <div className={`tab-pane ${activeTab === 'file-tab' ? 'active' : ''}`}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Upload Your Resume</label>
                <div className="file-upload" onClick={handleFileUploadClick}>
                  <input 
                    type="file" 
                    id="resume-file" 
                    name="resume-file" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                  />
                  <p>📄 Drag & drop your resume file here or click to browse</p>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem'}}>
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>
                {fileName && (
                  <div style={{marginTop: '0.5rem', fontWeight: '500', color: 'var(--success)'}}>
                    Selected: {fileName}
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
                />
              </div>
              <button type="submit" className="submit-btn">
                🧠 Analyze Resume Match
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('results')}>
          ← View Sample Results
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('benefits')}>
          Learn Benefits →
        </button>
      </div>
    </div>
  )
}

export default AnalysisSection