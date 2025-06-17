"use client";

import React, { useState, useEffect } from "react";
import { Github, ExternalLink, Code2, Database, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";

interface Project {
  title: string;
  description: string[];
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <section id="projects" className="h-screen flex items-center justify-center py-8 md:py-12 px-2 md:px-6 snap-section">
      <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 glow-text">
            Featured Projects
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Here are some of my recent projects that showcase my expertise in
            full-stack development, API design, and web application
            architecture.
          </p>
        </div>

        {/* Projects Grid - Collapsible on mobile, expanded on desktop */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-2 md:gap-4 flex-1`}>
          {projects.map((project, index) => {
            const ProjectIcon = getProjectIcon(project.type);
            const hasMultipleRepos = project.githubUrlFE && project.githubUrlBE;
            const isOpen = openIndex === index;
            return (
              <div key={project.title} className="relative">
                <Link
                  href={`/projects/${project.slug}`}
                  className={`glass-card glass-hover rounded-xl p-3 md:p-6 fade-in-up transition-all duration-300 hover:scale-[1.02] block cursor-pointer min-h-0 ${isMobile && isOpen ? 'z-10' : ''}`}
                  style={{ minHeight: '0' }}
                  tabIndex={0}
                  aria-expanded={isMobile ? isOpen : true}
                  onClick={e => {
                    if (isMobile) {
                      // Only expand/collapse if clicking header, not links
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : index);
                    }
                  }}
                >
                  {/* Card Header: Icon, Title, and always-visible links */}
                  <div className="flex items-center justify-between mb-2 md:mb-3 w-full">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="glass-card rounded-lg p-2">
                        <ProjectIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="text-xs md:text-lg font-semibold text-foreground truncate ml-2 flex-1">{project.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {hasMultipleRepos ? (
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(project.title, e)}
                            className="glass-card glass-hover rounded-lg p-2 hover:scale-110 transition-transform flex items-center space-x-1"
                          >
                            <Github className="w-4 h-4 text-foreground" />
                            <ChevronDown className={`w-3 h-3 text-foreground transition-transform ${activeDropdown === project.title ? 'rotate-180' : ''}`} />
                          </button>
                          {activeDropdown === project.title && (
                            <div className="absolute right-0 mt-2 w-40 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg z-10 overflow-hidden border border-primary/20">
                              <a
                                href={project.githubUrlFE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-3 py-1.5 text-xs text-foreground hover:bg-primary/20 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Front-end Repository
                              </a>
                              <a
                                href={project.githubUrlBE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-3 py-1.5 text-xs text-foreground hover:bg-primary/20 transition-colors border-t border-primary/20"
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
                          <Github className="w-4 h-4 text-foreground" />
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
                          <ExternalLink className="w-4 h-4 text-foreground" />
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Collapsible content with smooth transition */}
                  <div
                    className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isMobile ? (isOpen ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0') : 'max-h-[400px] opacity-100 mt-2'}`}
                    style={{ pointerEvents: isMobile && !isOpen ? 'none' : 'auto' }}
                  >
                    {/* Only show the following when expanded or on desktop */}
                    {(isMobile ? isOpen : true) && (
                      <>
                        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <a
            href="https://github.com/hoangngxn"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card glass-hover rounded-lg px-4 py-2 text-sm text-foreground font-semibold inline-flex items-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>View More Projects</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
