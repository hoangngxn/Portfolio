'use client'

import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const ContactSection: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted')
  }

  return (
    <section className="h-screen flex items-center justify-center py-24 px-6 snap-section">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let&apos;s work together to bring your ideas to life. I&apos;m always excited to discuss new opportunities and projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card glass-hover rounded-xl p-6 flex items-center space-x-4 fade-in-up">
              <div className="glass-card rounded-lg p-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">hoangngn1337@gmail.com</p>
              </div>
            </div>

            <div className="glass-card glass-hover rounded-xl p-6 flex items-center space-x-4 fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="glass-card rounded-lg p-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground">+84 357 135 934</p>
              </div>
            </div>

            <div className="glass-card glass-hover rounded-xl p-6 flex items-center space-x-4 fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="glass-card rounded-lg p-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="text-muted-foreground">Da Nang, Vietnam</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8 fade-in-up" style={{ animationDelay: '450ms' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input 
                  id="name"
                  type="text" 
                  className="w-full glass-card rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input 
                  id="email"
                  type="email" 
                  className="w-full glass-card rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full glass-card rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full glass-card glass-hover rounded-lg px-6 py-3 text-foreground font-semibold flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 