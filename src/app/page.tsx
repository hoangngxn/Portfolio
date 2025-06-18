'use client'

import { useEffect, useState } from 'react'
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ShowcaseSection from "@/components/ShowcaseSection"
import ProjectsSection from "@/components/ProjectsSection"
import ContactSection from "@/components/ContactSection"
import FloatingNextSectionArrow from "@/components/FloatingNextSectionArrow"

export default function Home() {
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Helper to detect mobile
    const checkMobile = () => window.matchMedia && window.matchMedia('(max-width: 768px)').matches
    setIsMobile(checkMobile())

    const handleResize = () => {
      setIsMobile(checkMobile())
    }
    window.addEventListener('resize', handleResize)

    // Only set up snap scroll and scaling if not mobile
    if (!checkMobile()) {
      // Calculate and set scale (desktop only)
      const updateScale = () => {
        setScale(1) // No scaling on desktop
      }
      updateScale()
      window.addEventListener('resize', updateScale)

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
      handleHashChange()
      window.addEventListener('hashchange', handleHashChange)

      // Handle wheel scrolling with improved desktop support
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
      // Handle touch events for desktop (optional, but keep for parity)
      const handleTouch = (e: TouchEvent) => {
        const container = document.querySelector('.snap-container')
        if (!container) return
        const touch = e.touches[0]
        const startY = touch.clientY
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const currentY = moveEvent.touches[0].clientY
          const diff = startY - currentY
          if (Math.abs(diff) > 50) {
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
        window.removeEventListener('resize', updateScale)
        if (container) {
          container.removeEventListener('wheel', handleWheel)
          container.removeEventListener('touchstart', handleTouch)
        }
        window.removeEventListener('hashchange', handleHashChange)
        window.removeEventListener('resize', handleResize)
      }
    } else {
      // On mobile, just clean up resize event
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Desktop: snap scroll, scaling; Mobile: normal scroll
  const sectionClass = isMobile ? "min-h-screen overflow-hidden -mb-1" : "min-h-screen";
  return (
    <>
      <main
        className={isMobile ? "min-h-screen overflow-y-scroll" : "h-screen overflow-y-scroll snap-container"}
        style={isMobile ? undefined : {
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: scale < 1 ? 'top center' : undefined,
          height: '100vh',
        }}
      >
        <section id="hero" className={sectionClass}><HeroSection /></section>
        <section id="about" className={sectionClass}><AboutSection /></section>
        <section id="showcase" className={sectionClass}><ShowcaseSection /></section>
        <section id="projects" className={sectionClass}><ProjectsSection /></section>
        <section id="contact" className={sectionClass}><ContactSection /></section>
      </main>
      <FloatingNextSectionArrow />
    </>
  )
}
