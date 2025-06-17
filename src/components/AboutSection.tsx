import React from 'react'
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

  return (
    <section className="h-screen flex items-center justify-center py-24 px-6 snap-section">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Recent graduate in Computer Science with a strong foundation in software development and problem-solving. Proficient in multiple programming languages and frameworks with a passion for building practical, scalable solutions.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <PortfolioCard
              key={skill.title}
              icon={skill.icon}
              title={skill.title}
              description={skill.description}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Experience Stats */}
        <div className="mt-16 glass-card rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
            <div className="fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl font-bold text-primary mb-2">1,5+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 