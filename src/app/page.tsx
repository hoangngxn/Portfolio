'use client'

import { useEffect } from 'react'
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ShowcaseSection from "@/components/ShowcaseSection"
import ProjectsSection from "@/components/ProjectsSection"
import ContactSection from "@/components/ContactSection"

export default function Home() {
  useEffect(() => {
    // Handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // Handle initial hash
    handleHashChange()

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Handle wheel scrolling with improved mobile support
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const container = document.querySelector('.snap-container')
      if (!container) return

      const delta = e.deltaY
      const currentScroll = container.scrollTop
      const sectionHeight = window.innerHeight
      const targetScroll = Math.round(currentScroll / sectionHeight) * sectionHeight + (delta > 0 ? sectionHeight : -sectionHeight)

      // Add touch support and smooth scrolling
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
    }

    // Handle touch events for mobile
    const handleTouch = (e: TouchEvent) => {
      const container = document.querySelector('.snap-container')
      if (!container) return

      const touch = e.touches[0]
      const startY = touch.clientY
      
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY
        const diff = startY - currentY
        
        if (Math.abs(diff) > 50) { // Threshold for scroll
          const direction = diff > 0 ? 1 : -1
          const currentScroll = container.scrollTop
          const sectionHeight = window.innerHeight
          const targetScroll = Math.round(currentScroll / sectionHeight) * sectionHeight + (direction * sectionHeight)
          
          container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          })
          
          moveEvent.preventDefault()
        }
      }
      
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', () => {
        container.removeEventListener('touchmove', handleTouchMove)
      }, { once: true })
    }

    const container = document.querySelector('.snap-container')
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      container.addEventListener('touchstart', handleTouch, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
        container.removeEventListener('touchstart', handleTouch)
      }
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <main className="h-screen overflow-y-scroll snap-container">
      <HeroSection />
      <AboutSection />
      <ShowcaseSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
