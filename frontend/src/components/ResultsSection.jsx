import React, { useState, useEffect } from 'react';

const ResultsSection = ({ navigateTo }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Get analysis results from localStorage
      const savedAnalysis = localStorage.getItem('neurohire_analysis');
      if (savedAnalysis) {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        setAnalysis(parsedAnalysis);
      }
    } catch (err) {
      setError('Failed to load analysis results');
      console.error('Error loading analysis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Safe data access functions
  const getSafeArray = (array) => {
    return Array.isArray(array) ? array : [];
  };

  const getSafeString = (str, fallback = 'Not available') => {
    return str || fallback;
  };

  const getSafeNumber = (num, fallback = 0) => {
    return typeof num === 'number' ? num : fallback;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreFeedback = (score) => {
    if (score >= 80) return 'Excellent match! Your resume strongly aligns with the job requirements.';
    if (score >= 60) return 'Good match! Your resume has solid alignment with some areas for improvement.';
    return 'Needs improvement. Your resume requires significant adjustments to better match the job requirements.';
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Analysis Error</h1>
          <p>{error}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="submit-btn" 
            onClick={() => navigateTo('analysis')}
            style={{ display: 'inline-block', width: 'auto', padding: '1rem 2rem' }}
          >
            ← Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Analysis Results</h1>
          <p>No analysis results found. Please analyze a resume first.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="submit-btn" 
            onClick={() => navigateTo('analysis')}
            style={{ display: 'inline-block', width: 'auto', padding: '1rem 2rem' }}
          >
            ← Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  // Safe data extraction
  const fitScore = getSafeNumber(analysis.fitScore, 0);
  const keywordAnalysis = analysis.keywordAnalysis || {};
  const skillsAnalysis = analysis.skillsAnalysis || {};
  const experienceAnalysis = analysis.experienceAnalysis || {};
  
  const matchedKeywords = getSafeArray(keywordAnalysis.matched);
  const missingKeywords = getSafeArray(keywordAnalysis.missing);
  const matchedSkills = getSafeArray(skillsAnalysis.matched);
  const resumeSkills = getSafeArray(skillsAnalysis.resumeSkills);
  const jobSkills = getSafeArray(skillsAnalysis.jobSkills);
  const suggestions = getSafeArray(analysis.suggestions);
  const strengths = getSafeArray(analysis.strengths);
  const improvements = getSafeArray(analysis.improvements);

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>AI Analysis Results</h1>
        <p>Detailed breakdown of how your resume matches the job requirements</p>
      </div>

      <div className="results-container">
        {/* Score Card */}
        <div className="score-card">
          <h3>Your Resume Match Score</h3>
          <div 
            className="score-circle" 
            style={{
              background: `conic-gradient(${getScoreColor(fitScore)} 0% ${fitScore}%, var(--bg-light) ${fitScore}% 100%)`
            }}
          >
            <div className="score-value">{fitScore}%</div>
          </div>
          <p>{getScoreFeedback(fitScore)}</p>
        </div>
        
        {/* Detailed Analysis */}
        <div className="analysis-details">
          {/* Keyword Analysis */}
          <div className="analysis-card">
            <h3>🔍 Keyword Analysis</h3>
            <p><strong>Match Rate:</strong> {getSafeNumber(keywordAnalysis.matchRate, 0)}%</p>
            <p><strong>Matched Keywords:</strong></p>
            <div style={{ marginTop: '0.5rem' }}>
              {matchedKeywords.length > 0 ? (
                matchedKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    style={{
                      background: 'var(--success)',
                      color: 'white',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      margin: '0.2rem',
                      display: 'inline-block'
                    }}
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-light)' }}>No keywords matched</span>
              )}
            </div>
            <p style={{ marginTop: '1rem' }}><strong>Missing Keywords:</strong></p>
            <div style={{ marginTop: '0.5rem' }}>
              {missingKeywords.length > 0 ? (
                missingKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    style={{
                      background: 'var(--danger)',
                      color: 'white',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      margin: '0.2rem',
                      display: 'inline-block'
                    }}
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-light)' }}>No missing keywords</span>
              )}
            </div>
          </div>
          
          {/* Skills Analysis */}
          <div className="analysis-card">
            <h3>🛠 Skills Analysis</h3>
            <p><strong>Match Rate:</strong> {getSafeNumber(skillsAnalysis.matchRate, 0)}%</p>
            <p><strong>Your Skills:</strong> {resumeSkills.join(', ') || 'None detected'}</p>
            <p><strong>Required Skills:</strong> {jobSkills.join(', ') || 'None specified'}</p>
            <p><strong>Skills Match:</strong> {matchedSkills.length} of {jobSkills.length}</p>
          </div>

          {/* Experience Analysis */}
          <div className="analysis-card">
            <h3>📈 Experience Analysis</h3>
            <p><strong>Your Experience:</strong> {getSafeNumber(experienceAnalysis.resumeExperience, 0)} years</p>
            <p><strong>Required Experience:</strong> {getSafeNumber(experienceAnalysis.jobRequiredExperience, 0)} years</p>
            <p><strong>Experience Gap:</strong> {getSafeNumber(experienceAnalysis.experienceGap, 0)} years</p>
          </div>

          {/* Strengths */}
          <div className="analysis-card">
            <h3>✨ Strengths Identified</h3>
            <ul>
              {strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    ✅ {strength}
                  </li>
                ))
              ) : (
                <li style={{ padding: '0.5rem 0', color: 'var(--text-light)' }}>
                  No strengths identified
                </li>
              )}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="analysis-card">
            <h3>💡 Improvement Suggestions</h3>
            <ul>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    💡 {suggestion}
                  </li>
                ))
              ) : (
                <li style={{ padding: '0.5rem 0', color: 'var(--text-light)' }}>
                  No suggestions available
                </li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="analysis-card">
            <h3>🎯 Areas for Improvement</h3>
            <ul>
              {improvements.length > 0 ? (
                improvements.map((improvement, index) => (
                  <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    ⚡ {improvement}
                  </li>
                ))
              ) : (
                <li style={{ padding: '0.5rem 0', color: 'var(--text-light)' }}>
                  No improvement areas identified
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('analysis')}>
          ← Analyze Another Resume
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('benefits')}>
          Learn Benefits →
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;