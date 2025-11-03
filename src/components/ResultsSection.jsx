import React from 'react'

const ResultsSection = ({ navigateTo }) => {
  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Analysis Results</h1>
        <p>See how your resume matches the job requirements and get actionable insights.</p>
      </div>

      <div className="results-container">
        <div className="score-card">
          <h3>Your Resume Match Score</h3>
          <div className="score-circle" style={{'--score-percent': '75%'}}>
            <div className="score-value">75%</div>
          </div>
          <p>Good match! Your resume aligns well with the job requirements, with some areas for improvement.</p>
        </div>
        
        <div className="analysis-details">
          <div className="analysis-card">
            <h3>🔍 Keyword Analysis</h3>
            <p><strong>Matched Keywords:</strong> JavaScript, React, Node.js, API, MongoDB</p>
            <p><strong>Missing Keywords:</strong> TypeScript, AWS, Docker, GraphQL</p>
          </div>
          
          <div className="analysis-card">
            <h3>💡 Improvement Suggestions</h3>
            <ul>
              <li>Add TypeScript experience to your skills section</li>
              <li>Include AWS and Docker in your technical skills</li>
              <li>Quantify your achievements with specific metrics</li>
            </ul>
          </div>
          
          <div className="analysis-card">
            <h3>✨ Strengths Identified</h3>
            <ul>
              <li>Strong React and Node.js experience</li>
              <li>Good project portfolio</li>
              <li>Relevant education background</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('analysis')}>
          ← Back to Analysis
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('benefits')}>
          See Benefits →
        </button>
      </div>
    </div>
  )
}

export default ResultsSection