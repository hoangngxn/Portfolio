'use client'

import { useEffect } from 'react'
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
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

    // Handle wheel scrolling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const container = document.querySelector('.snap-container')
      if (!container) return

      const delta = e.deltaY
      const currentScroll = container.scrollTop
      const sectionHeight = window.innerHeight
      const targetScroll = Math.round(currentScroll / sectionHeight) * sectionHeight + (delta > 0 ? sectionHeight : -sectionHeight)

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
    }

    const container = document.querySelector('.snap-container')
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <main className="h-screen overflow-y-scroll snap-container">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
