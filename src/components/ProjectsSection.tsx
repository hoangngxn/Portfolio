"use client";

import React, { useState } from "react";
import { Github, ExternalLink, Code2, Database, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  githubUrlFE?: string;
  githubUrlBE?: string;
  liveUrl?: string;
  image?: string;
  type: "web-app" | "software" | "fullstack";
  slug: string;
}

const ProjectsSection: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (projectTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === projectTitle ? null : projectTitle);
  };

  const getProjectIcon = (type: Project["type"]) => {
    switch (type) {
      case "web-app":
        return Globe;
      case "software":
        return Database;
      case "fullstack":
        return Code2;
    }
  };

  return (
    <section id="projects" className="h-screen flex items-center justify-center py-24 px-6 snap-section">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Here are some of my recent projects that showcase my expertise in
            full-stack development, API design, and web application
            architecture.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const ProjectIcon = getProjectIcon(project.type);
            const hasMultipleRepos = project.githubUrlFE && project.githubUrlBE;
            
            return (
              <Link
                key={project.title}
                href={`/projects/${project.slug}`}
                className="glass-card glass-hover rounded-xl p-6 fade-in-up transition-transform hover:scale-[1.02] block"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="glass-card rounded-lg p-2">
                    <ProjectIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {hasMultipleRepos ? (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(project.title, e)}
                          className="glass-card glass-hover rounded-lg p-2 hover:scale-110 transition-transform flex items-center space-x-1"
                        >
                          <Github className="w-5 h-5 text-foreground" />
                          <ChevronDown className={`w-4 h-4 text-foreground transition-transform ${activeDropdown === project.title ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {activeDropdown === project.title && (
                          <div className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg z-10 overflow-hidden border border-primary/20">
                            <a
                              href={project.githubUrlFE}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Front-end Repository
                            </a>
                            <a
                              href={project.githubUrlBE}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition-colors border-t border-primary/20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Back-end Repository
                            </a>
                          </div>
                        )}
                      </div>
                    ) : project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card glass-hover rounded-lg p-2 hover:scale-110 transition-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-5 h-5 text-foreground" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card glass-hover rounded-lg p-2 hover:scale-110 transition-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-5 h-5 text-foreground" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 glass-card rounded-full text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/hoangngxn"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card glass-hover rounded-lg px-6 py-3 text-foreground font-semibold inline-flex items-center space-x-2"
          >
            <Github className="w-5 h-5" />
            <span>View More Projects</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
