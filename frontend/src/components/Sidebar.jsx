import React from 'react'

const Sidebar = ({ sections, activeSection, onNavigate, isMobile, isMobileMenuOpen }) => {
  const sidebarClass = isMobile ? `sidebar mobile ${isMobileMenuOpen ? 'open' : ''}` : 'sidebar'

  return (
    <div className={sidebarClass}>
      <div className="logo">
        <span>🧠</span> NeuroHire
      </div>
      
      <ul className="nav-items">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onNavigate(section.id)}
            >
              <div className="nav-icon">{section.icon}</div>
              <div className="nav-text">{section.name}</div>
              {section.badge && <div className="nav-badge">{section.badge}</div>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar