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
    title: "Melodies",
    description: "A full-featured music streaming application that allows users to browse, play, and manage a wide selection of songs in a sleek, responsive interface. It supports real-time audio playback, user authentication, and playlist creation.",
    technologies: ["React Native", "Gradle"],
    githubUrl: "https://github.com/hoangngxn/melodies",
    type: "web-app",
    slug: "melodies",
    featuredImage: "/projects/melodies/melodies.png",
    details: `A modern music streaming platform built with React Native, offering a seamless mobile experience.
    The app combines elegant design with powerful functionality.
    
    Key features:
    - Real-time audio streaming
    - User authentication and profiles
    - Playlist management
    - Offline mode support
    - Responsive design`,
    features: [
      "Real-time audio playback",
      "User authentication",
      "Playlist creation and management",
      "Offline mode",
      "Responsive design",
      "Music library browsing",
      "Search functionality"
    ],
    gallery: [
      "/projects/melodies/melodies2.png",
      "/projects/melodies/melodies3.png"
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