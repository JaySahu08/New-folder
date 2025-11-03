import React from 'react'

const AboutSection = ({ navigateTo }) => {
  return (
    <div className="content-section">
      <div className="section-header">
        <h1>About NeuroHire</h1>
        <p>Learn about our mission to revolutionize job searching with AI technology.</p>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
        <div className="benefit-card" style={{textAlign: 'left', marginBottom: '2rem'}}>
          <h3>Our Mission</h3>
          <p>Empowering job seekers with intelligent, unbiased feedback that levels the playing field. We believe everyone deserves a fair shot at their dream job.</p>
        </div>
        
        <div className="benefit-card" style={{textAlign: 'left'}}>
          <h3>Our Technology</h3>
          <p>NeuroHire combines expertise in artificial intelligence, human resources, and technology to create a platform that truly understands both resumes and job requirements at a semantic level.</p>
        </div>
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('pricing')}>
          ← View Pricing
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('contact')}>
          Contact Us →
        </button>
      </div>
    </div>
  )
}

export default AboutSection