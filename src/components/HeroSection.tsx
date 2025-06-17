import React from 'react'
import Image from 'next/image'
import { Github, Linkedin, Mail, Download } from 'lucide-react'
import profileImage from '../assets/images/profile.jpg'
import BouncingLogos from './bouncing-logos/BouncingLogos'

const HeroSection: React.FC = () => {
  return (
    <section className="h-screen flex items-center justify-center px-6 relative overflow-hidden snap-section" style={{
      backgroundImage: 'url(/pixels5.gif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <BouncingLogos />

      <div className="max-w-4xl mx-auto text-center relative z-10 glass-card rounded-2xl p-8 backdrop-blur-sm">
        {/* Profile Image */}
        <div className="glass-card rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center floating-animation">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden relative">
            <Image 
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover object-center rounded-full"
              priority
            />
          </div>
        </div>

        {/* Name and Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 glow-text fade-in-up">
          Hoang Nguyen
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6 fade-in-up" style={{ animationDelay: '200ms' }}>
          Full-stack Developer
        </h2>
        
        {/* Description */}
        <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed fade-in-up" style={{ animationDelay: '400ms' }}>
          Crafting reliable and scalable digital systems with a focus on performance, 
          security, and clean architecture. Driven by curiosity and a passion for solving real-world problems through thoughtful engineering.
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mb-8 fade-in-up" style={{ animationDelay: '600ms' }}>
          <a href="https://github.com/hoangngxn" target="_blank" className="glass-card glass-hover rounded-xl p-3">
            <Github className="w-6 h-6 text-foreground" />
          </a>
          <a href="https://www.linkedin.com/in/hoang-nguyen-2012a3184/" target="_blank" className="glass-card glass-hover rounded-xl p-3">
            <Linkedin className="w-6 h-6 text-foreground" />
          </a>
          <a href="hoangngn1337@gmail.com" target="_blank" className="glass-card glass-hover rounded-xl p-3">
            <Mail className="w-6 h-6 text-foreground" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 