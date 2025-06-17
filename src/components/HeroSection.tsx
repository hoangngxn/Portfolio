import React from 'react'
import Image from 'next/image'
import { Github, Linkedin, Mail, Download, Facebook, Youtube } from 'lucide-react'
import profileImage from '../assets/images/profile.jpg'
import BouncingLogos from './bouncing-logos/BouncingLogos'
import ClickCounter from './click-counter/ClickCounter'

const KILL_STREAKS = {
  20: "DOUBLE KILL!",
  40: "TRIPLE KILL!",
  60: "ULTRA KILL!",
  80: "RAMPAGE!",
  100: "KILLING SPREE!",
  120: "DOMINATING!",
  140: "MEGA KILL!",
  160: "UNSTOPPABLE!",
  180: "WICKED SICK!",
  200: "MONSTER KILL!",
  220: "GODLIKE!",
  240: "BEYOND GODLIKE!",
};

const HeroSection: React.FC = () => {
  return (
    <section className="h-screen flex items-center justify-center px-6 relative overflow-hidden snap-section" style={{
      backgroundImage: 'url(/pixels5.gif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <BouncingLogos />
      <ClickCounter />

      <div className="max-w-3xl mx-auto text-center relative z-10 glass-card rounded-2xl p-4 md:p-6 backdrop-blur-sm">
        {/* Profile Image */}
        <div className="glass-card rounded-full w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 flex items-center justify-center floating-animation">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden relative">
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
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 glow-text fade-in-up">
          Hoang Nguyen
        </h1>
        <h2 className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4 fade-in-up" style={{ animationDelay: '200ms' }}>
          Full-stack Developer
        </h2>
        
        {/* Description */}
        <p className="text-sm md:text-base max-w-xl mx-auto mb-4 md:mb-6 leading-relaxed fade-in-up" style={{ animationDelay: '400ms' }}>
          Crafting reliable and scalable digital systems with a focus on performance, 
          security, and clean architecture. Driven by curiosity and a passion for solving real-world problems through thoughtful engineering.
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-3 md:space-x-4 mb-4 fade-in-up" style={{ animationDelay: '600ms' }}>
          <a href="https://github.com/hoangngxn" target="_blank" className="glass-card glass-hover rounded-xl p-2 md:p-2.5">
            <Github className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </a>
          <a href="https://www.linkedin.com/in/hoang-nguyen-2012a3184/" target="_blank" className="glass-card glass-hover rounded-xl p-2 md:p-2.5">
            <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </a>
          <a href="https://www.facebook.com/hoang.ngxn/" target="_blank" className="glass-card glass-hover rounded-xl p-2 md:p-2.5">
            <Facebook className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </a>
          <a href="https://www.youtube.com/channel/UC3dOp0q4eT7L3TvI5R8P4Iw" target="_blank" className="glass-card glass-hover rounded-xl p-2 md:p-2.5">
            <Youtube className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 