import React from 'react'

const FeaturesSection = ({ navigateTo }) => {
  const features = [
    {
      icon: '🧠',
      title: 'Deep Semantic Matching',
      description: 'Our AI understands context and meaning, not just keywords. We analyze the semantic relationship between your experience and job requirements.'
    },
    {
      icon: '📊',
      title: 'Comprehensive Fit Score',
      description: 'Get an instant, data-backed score showing how well your resume aligns with the job description.'
    },
    {
      icon: '🔍',
      title: 'Keyword Gap Analysis',
      description: 'Identify missing keywords and phrases that could be holding you back from passing ATS systems.'
    },
    {
      icon: '💬',
      title: 'Actionable Feedback',
      description: 'Don\'t just get a score—get specific, granular suggestions on how to improve your resume.'
    }
  ]

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Advanced AI Features</h1>
        <p>Powered by cutting-edge artificial intelligence technology designed specifically for resume analysis.</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.icon} {feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('benefits')}>
          ← View Benefits
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('pricing')}>
          See Pricing →
        </button>
      </div>
    </div>
  )
}

export default FeaturesSection