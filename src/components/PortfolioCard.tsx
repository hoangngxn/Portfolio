import React from 'react'
import { LucideIcon } from 'lucide-react'

interface PortfolioCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) => {
  return (
    <div 
      className="glass-card glass-hover rounded-2xl p-6 fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-4">
        <div className="glass-card rounded-xl p-3 mr-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  )
}

export default PortfolioCard 