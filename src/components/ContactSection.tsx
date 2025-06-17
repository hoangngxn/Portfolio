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
    <section className="h-screen flex items-center justify-center py-8 md:py-12 px-2 md:px-6 snap-section">
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 glow-text">Get In Touch</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let&apos;s work together to bring your ideas to life. I&apos;m always excited to discuss new opportunities and projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
          {/* Contact Info */}
          <div className="space-y-3 md:space-y-4">
            <div className="glass-card glass-hover rounded-xl p-3 md:p-4 flex items-center space-x-3 md:space-x-4 fade-in-up">
              <div className="glass-card rounded-lg p-2">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xs md:text-base text-foreground">Email</h3>
                <p className="text-xs md:text-sm text-muted-foreground">hoangngn1337@gmail.com</p>
              </div>
            </div>

            <div className="glass-card glass-hover rounded-xl p-3 md:p-4 flex items-center space-x-3 md:space-x-4 fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="glass-card rounded-lg p-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xs md:text-base text-foreground">Phone</h3>
                <p className="text-xs md:text-sm text-muted-foreground">+84 357 135 934</p>
              </div>
            </div>

            <div className="glass-card glass-hover rounded-xl p-3 md:p-4 flex items-center space-x-3 md:space-x-4 fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="glass-card rounded-lg p-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xs md:text-base text-foreground">Location</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Da Nang, Vietnam</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-4 md:p-6 fade-in-up" style={{ animationDelay: '450ms' }}>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Name</label>
                <input 
                  id="name"
                  type="text" 
                  className="w-full glass-card rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Email</label>
                <input 
                  id="email"
                  type="email" 
                  className="w-full glass-card rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full glass-card rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full glass-card glass-hover rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-base text-foreground hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
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