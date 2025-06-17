export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  githubUrlFE?: string;
  githubUrlBE?: string;
  liveUrl?: string;
  type: "web-app" | "software" | "fullstack";
  slug: string;
  featuredImage?: string;
  details?: string;
  features?: string[];
  gallery?: string[];
  demoVideo?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Portfolio",
    description: "A modern, interactive portfolio website showcasing my work as a Full-stack Developer. Features a sleek glass-morphism design with smooth animations, interactive elements, and a dynamic project showcase.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "React Query"],
    githubUrl: "https://github.com/hoangngxn/portfolio",
    type: "web-app",
    slug: "portfolio",
    featuredImage: "/projects/portfolio/portfolio.png",
    details: `A sophisticated portfolio website built with modern web technologies.
    The project demonstrates advanced frontend development techniques and interactive design.
    
    Technical highlights:
    - Glass-morphism UI with smooth animations
    - Interactive bouncing tech stack logos
    - Smooth scroll snap navigation
    - Responsive design with mobile optimization
    - Dynamic project showcase with galleries
    - Background music integration
    - Custom animations and transitions`,
    features: [
      "Glass-morphism design system",
      "Interactive bouncing logos",
      "Smooth scroll navigation",
      "Project showcase gallery",
      "Background music player",
      "Responsive layout",
      "Dark theme with glowing accents"
    ],
    gallery: [
      "/projects/portfolio/portfolio.png",
      "/projects/portfolio/portfolio2.png"
    ]
  },
  {
    title: "Reasoning Chains - RAG AI Chatbot",
    description: "An AI-powered chatbot designed to answer user queries using structured reasoning chains and packed with Retrieval Augmented Generation. Mimicking the thinking steps alongside with retrieving provided documents to make better response.",
    technologies: ["React.js", "Flask", "Chainlit", "LangChains", "Docker"],
    githubUrl: "https://github.com/hoangngxn/reasoning_chains_chatbot",
    type: "fullstack",
    slug: "reasoning-chains",
    featuredImage: "/projects/reasoning-chains/RC2.png",
    details: `A sophisticated AI chatbot that combines structured reasoning with RAG capabilities.
    The system demonstrates advanced natural language processing and document retrieval techniques.
    
    Technical highlights:
    - Implemented reasoning chains for step-by-step problem solving
    - Integrated RAG for context-aware responses
    - Built scalable backend with Flask
    - Containerized deployment with Docker
    - Real-time document processing and retrieval`,
    features: [
      "Structured reasoning chains",
      "Document retrieval and processing",
      "Context-aware responses",
      "Real-time query processing",
      "Scalable architecture",
      "Docker containerization",
      "Interactive chat interface"
    ],
    gallery: [
      "/projects/reasoning-chains/RC.png",
      "/projects/reasoning-chains/RC3.png"
    ]
  },
  {
    title: "TutorHub",
    description: "A modern React application for connecting tutors and students. This platform allows tutors to create and manage tutoring posts, while students can browse available tutors, book sessions, and leave reviews.",
    technologies: ["React.js", "Java Spring Boot", "Docker"],
    githubUrlFE: "https://github.com/hoangngxn/tutorhub",
    githubUrlBE: "https://github.com/hoangngxn/tutorhub_be",
    type: "fullstack",
    slug: "tutorhub",
    featuredImage: "/projects/tutorhub/featured.png",
    details: `A comprehensive tutoring platform that connects students with qualified tutors.
    Built with modern web technologies and robust backend architecture.
    
    Technical implementation:
    - Real-time booking system
    - User authentication and profiles
    - Review and rating system
    - Search and filtering capabilities
    - Responsive design`,
    features: [
      "Tutor-student matching",
      "Session booking system",
      "Review and rating system",
      "Search and filtering",
      "User profiles",
      "Real-time notifications",
      "Payment integration"
    ],
    gallery: [
      "/projects/tutorhub/TutorHub.png",
      "/projects/tutorhub/TutorHub2.png"
    ]
  },
  {
    title: "Valthrun",
    description: "A personal project of Counter Strike 2 external game exploit/enhancer, with built-in Kernel level driver for memory reading/writing. Integrated an Aim-assist logic systems involving mouse movement and smoothness.",
    technologies: ["Rust Nightly", "Cargo", "Windows APIs"],
    githubUrl: "https://github.com/hoangngxn/valthrun",
    type: "software",
    slug: "valthrun",
    featuredImage: "/projects/valthrun/showcase_01.png",
    details: `An advanced game enhancement tool developed using Rust and Windows APIs.
    The project demonstrates sophisticated memory manipulation and input processing techniques.
    
    Technical highlights:
    - Kernel-level memory operations
    - Custom aim-assist algorithms
    - Mouse movement optimization
    - Anti-detection mechanisms
    - Performance optimization`,
    features: [
      "Kernel-level memory operations",
      "Custom aim-assist system",
      "Mouse movement optimization",
      "Anti-detection mechanisms",
      "Performance optimization",
      "Real-time data processing",
      "Configurable settings"
    ],
    gallery: [
      "/projects/valthrun/showcase_01.png",
      "/projects/valthrun/showcase_02.png"
    ]
  }
]; 