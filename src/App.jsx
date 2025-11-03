import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MobileHeader from './components/MobileHeader'
import AnalysisSection from './components/AnalysisSection'
import ResultsSection from './components/ResultsSection'
import BenefitsSection from './components/BenefitsSection'
import FeaturesSection from './components/FeaturesSection'
import PricingSection from './components/PricingSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'

function App() {
  const [activeSection, setActiveSection] = useState('analysis')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sections = [
    { id: 'analysis', name: 'AI Analysis', icon: '📊', badge: 'NEW' },
    { id: 'results', name: 'Results', icon: '📈' },
    { id: 'benefits', name: 'Benefits', icon: '⭐' },
    { id: 'features', name: 'Features', icon: '🚀' },
    { id: 'pricing', name: 'Pricing', icon: '💰' },
    { id: 'about', name: 'About', icon: '👥' },
    { id: 'contact', name: 'Contact', icon: '📞' }
  ]

  const navigateTo = (sectionId) => {
    setActiveSection(sectionId)
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'analysis':
        return <AnalysisSection navigateTo={navigateTo} />
      case 'results':
        return <ResultsSection navigateTo={navigateTo} />
      case 'benefits':
        return <BenefitsSection navigateTo={navigateTo} />
      case 'features':
        return <FeaturesSection navigateTo={navigateTo} />
      case 'pricing':
        return <PricingSection navigateTo={navigateTo} />
      case 'about':
        return <AboutSection navigateTo={navigateTo} />
      case 'contact':
        return <ContactSection navigateTo={navigateTo} />
      default:
        return <AnalysisSection navigateTo={navigateTo} />
    }
  }

  return (
    <div className="app-container">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          isMenuOpen={isMobileMenuOpen}
          onMenuToggle={toggleMobileMenu}
        />
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay active"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onNavigate={navigateTo}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  )
}

export default App