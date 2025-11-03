import React from 'react'

const ContactSection = ({ navigateTo }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    event.target.reset()
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or support.</p>
      </div>

      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>

      <div className="nav-controls">
        <button className="nav-btn prev" onClick={() => navigateTo('about')}>
          ← About Us
        </button>
        <button className="nav-btn next" onClick={() => navigateTo('analysis')}>
          Start Analysis →
        </button>
      </div>
    </div>
  )
}

export default ContactSection