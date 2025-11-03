import React from 'react'

const BenefitsSection = ({ navigateTo }) => {
  const benefits = [
    {
      icon: '🎯',
      title: 'Boost Interview Chances',
      description: 'Optimize your resume to pass ATS systems and catch recruiters\' attention with precise job matching.'
    },
    {
      icon: '💡',
      title: 'Eliminate Guesswork',
      description: 'Get data-driven insights instead of wondering if your resume will make the cut. Know exactly what to improve.'
    },
    {
      icon: '✨',
      title: 'Personalized Feedback',
      description: 'Receive tailored recommendations specific to your experience and the job you\'re targeting.'
    }
  ]

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Why Choose NeuroHire?</h1>
        <p>Discover how our AI-powered platform can transform your job search experience.</p>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('results')}>
          ← See Results
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('features')}>
          View Features →
        </button>
      </div>
    </div>
  )
}

export default BenefitsSection