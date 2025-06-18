# Hoang Nguyen's Portfolio

![Portfolio Preview](/Portfolio.png)

A modern, interactive portfolio website showcasing my work as a Full-stack Developer. Built with Next.js, featuring a sleek glass-morphism design, smooth animations, and a built-in Flappy Bird game as an interactive showcase.

## 🌟 Features

- **Modern Design**: Glass-morphism UI with smooth animations and transitions
- **Interactive Elements**: Bouncing tech stack logos with collision detection
- **Smooth Navigation**: Snap scrolling with smooth transitions between sections
- **Responsive Layout**: Fully responsive design that works on all devices
- **Project Showcase**: Detailed project pages with galleries and descriptions
- **Built-in Flappy Bird Game**: Play a fully interactive Flappy Bird clone directly in the portfolio ([see `/flappy-bird`](src/app/flappy-bird)).
- **Background Music**: Ambient background music with volume controls
- **Dark Theme**: Elegant dark theme with glowing accents

## 🛠️ Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **State Management**: React Query
- **Icons**: Lucide Icons
- **Animations**: CSS animations and transitions
- **Deployment**: Vercel

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   └── flappy-bird/     # Built-in Flappy Bird game showcase
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── sections/      # Page sections
├── data/              # Static data and content
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── styles/            # Global styles
```