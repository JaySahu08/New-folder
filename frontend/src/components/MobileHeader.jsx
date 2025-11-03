import React from 'react'

const MobileHeader = ({ isMenuOpen, onMenuToggle }) => {
  return (
    <div className="mobile-header">
      <div className="mobile-logo">
        <span>🧠</span> NeuroHire
      </div>
      <button 
        className="hamburger-menu"
        onClick={onMenuToggle}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </div>
  )
}

export default MobileHeader