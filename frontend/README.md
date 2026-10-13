# HireIQ Frontend

The frontend for **HireIQ** — an AI-powered Mock Interview, Adaptive Assessment, and Engineering Learning Platform. Built as a high-performance Single Page Application (SPA) using **React 19**, **TypeScript** (strict mode), **Vite**, and **Tailwind CSS**.

---

## Features & Modules

### 1. Core & Authentication
- **Landing Page**: Modern hero section, 3-pillar feature showcase, 3-step preparation workflow, and interactive stats.
- **Sign Up & Login**: Registration with real-time password strength meter, OAuth SSO options, credentials authentication, and password recovery.
- **Dashboard**: Unified hub featuring readiness score, streak tracking, quick action launchpads, skill mastery heatmaps, and recent activity history.

### 2. AI Mock Interview
- **Interview Setup**: Target role selection, resume parser (PDF/DOCX), job description ingestion, strong vs. weak skills badge extraction, and hardware permission pre-checks.
- **Live AI Interview Room**: Immersive room with real-time webcam video stream, live microphone waveform visualizer, animated AI Avatar with speech synthesis, live speech-to-text transcriptions, and adaptive questioning flow.
- **Interview Evaluation & Dossier**: Readiness score (0–100%), radar competency matrix, verified strengths and identified knowledge gaps, question-by-question critique, and PDF report export.

### 3. Adaptive Skill Assessments
- **Assessment Setup**: Configuration by type (MCQ / Coding / Scenario), topic domain, difficulty level (Beginner / Intermediate / Advanced), question count, and optional resume tailoring.
- **Timed Test Interface**: Active timer, interactive question navigation palette (answered, flagged, unvisited), auto-saving answers, and submission verification with celebrations.
- **Assessment Results**: Score breakdown, percentile ranking, topic mastery analytics, and full question explanations with correct solutions.

### 4. Learning Platform (Courses & Notes)
- **Courses Catalog**: Searchable curriculum directory filtered by tech stack, difficulty, and duration.
- **Course Details**: Syllabus curriculum breakdown into modules and expandable lessons.
- **Classroom / Lesson Player**: Interactive lesson player, collapsible modules sidebar, completion toggles, and seamless lesson progression.
- **Notes & Topics Directory**: Universal search across concept notes, categorized cheat sheets, and tags.
- **Revision Notes Viewer**: Markdown reader with syntax-highlighted code blocks, one-click copy, quick revision cheatsheets, and direct links to test yourself.

---

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & Design Tokens
- **Icons**: Lucide React
- **Visualizations**: Recharts
- **Interactive Effects**: Canvas Confetti

---

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI & layout components
│   │   ├── common/         # ToastContainer, dialogs, badges
│   │   ├── dashboard/      # SkillMasteryHeatmap, metric cards
│   │   └── layout/         # Navbar, Footer, Sidebar
│   ├── context/            # AppContext (global state, navigation, auth, sessions)
│   ├── data/               # Seed data, sample courses, notes, and question pools
│   ├── pages/              # 15 distinct page views across the platform
│   ├── types/              # Comprehensive TypeScript interfaces & types
│   ├── App.tsx             # Root layout & client router
│   ├── index.css           # Design tokens, custom scrollbars, gradients & typography
│   └── main.tsx            # Application entry point
├── index.html              # HTML shell & SEO meta tags
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

### Production Build

Type-check and create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Linting & Type-Checking

Run TypeScript type-checking:
```bash
npm run lint
```
