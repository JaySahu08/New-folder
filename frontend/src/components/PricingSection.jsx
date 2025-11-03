import React from 'react'

const PricingSection = ({ navigateTo }) => {
  const plans = [
    {
      name: 'Free Analysis',
      price: '$0',
      features: [
        '1 Resume Analysis',
        'Basic Fit Score',
        'Keyword Matching',
        'PDF Export'
      ],
      featured: false
    },
    {
      name: 'Premium',
      price: '$19',
      period: '/mo',
      features: [
        'Unlimited Analyses',
        'Advanced AI Insights',
        'Priority Support',
        'Career Coach Access'
      ],
      featured: true
    }
  ]

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your job search needs.</p>
      </div>

      <div className="pricing-container">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}
              {plan.period && <span style={{fontSize: '1rem'}}>{plan.period}</span>}
            </div>
            <ul className="price-features">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <button 
              className="submit-btn" 
              onClick={() => navigateTo('analysis')}
            >
              {plan.featured ? 'Try Premium' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('features')}>
          ← View Features
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('about')}>
          About Us →
        </button>
      </div>
    </div>
  )
}

export default PricingSection