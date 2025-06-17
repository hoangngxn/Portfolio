import React, { useState, useEffect } from 'react'
import { Code, Database, Rocket, Users } from 'lucide-react'
import PortfolioCard from './PortfolioCard'

const AboutSection: React.FC = () => {
  const skills = [
    {
      icon: Code,
      title: "Development",
      description: "Proficient in <strong>React</strong>, <strong>TypeScript</strong>, <strong>Java</strong>, <strong>Python</strong> and modern development technologies. Building scalable applications with clean, maintainable code."
    },
    {
      icon: Database,
      title: "Database Management",
      description: "Proficient in SQL and NoSQL databases. Experience with database design, optimization, and performance tuning."
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Optimizing applications for speed and efficiency. Experienced in modern build tools, deployment strategies, and performance monitoring."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Strong team player with excellent communication skills. Experience working in agile environments and leading development teams."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center py-8 md:py-12 px-2 md:px-6 snap-section">
      <div className="max-w-6xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 glow-text">About Me</h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Recent graduate in Computer Science with a strong foundation in software development and problem-solving. Proficient in multiple programming languages and frameworks with a passion for building practical, scalable solutions.
          </p>
        </div>

        {/* Skills Grid - Collapsible on mobile, expanded on desktop */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-4'} gap-2 md:gap-4 flex-none`}>
          {skills.map((skill, index) => {
            const Icon = skill.icon
            const isOpen = openIndex === index
            return (
              <div
                key={skill.title}
                className={`glass-card rounded-xl p-2 md:p-4 flex flex-col items-center justify-start transition-all duration-300 cursor-pointer min-h-0 ${isMobile && isOpen ? 'z-10' : ''}`}
                style={{ minHeight: '0' }}
                onClick={() => isMobile ? setOpenIndex(isOpen ? null : index) : undefined}
                tabIndex={0}
                aria-expanded={isMobile ? isOpen : true}
              >
                <div className="flex flex-col items-center w-full">
                  <div className="glass-card rounded-lg mb-1 md:mb-2 p-1 md:p-2">
                    <Icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-xs md:text-base font-semibold text-foreground text-center truncate w-full">{skill.title}</h3>
                </div>
                {/* Collapsible content with smooth transition */}
                <div
                  className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isMobile ? (isOpen ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0') : 'max-h-[200px] opacity-100 mt-2'}`}
                  style={{ pointerEvents: isMobile && !isOpen ? 'none' : 'auto' }}
                >
                  <div className="text-xs md:text-sm text-muted-foreground text-center fade-in-up" dangerouslySetInnerHTML={{ __html: skill.description }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Experience Stats */}
        <div className="mt-6 md:mt-8 glass-card rounded-2xl p-3 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:gap-6 text-center max-w-2xl mx-auto w-full min-w-0 overflow-hidden">
            <div className="fade-in-up min-w-0" style={{ animationDelay: '600ms' }}>
              <div className="font-bold text-[clamp(1.1rem,4vw,2.25rem)] md:text-4xl truncate">1.5+</div>
              <div className="text-xs md:text-base text-muted-foreground truncate">Years Experience</div>
            </div>
            <div className="fade-in-up min-w-0" style={{ animationDelay: '700ms' }}>
              <div className="font-bold text-[clamp(1.1rem,4vw,2.25rem)] md:text-4xl truncate">10+</div>
              <div className="text-xs md:text-base text-muted-foreground truncate">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 