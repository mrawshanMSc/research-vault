# ResearchVault

ResearchVault is a research link management app for saving, organizing, and revisiting high-value sources in one place. It helps teams and individual researchers capture references quickly, enrich them with notes and tags, and sort through growing collections with filters, favorites, and reading-status workflows.

## Overview

ResearchVault is built to make research collections easier to maintain and easier to act on. Instead of storing links in scattered docs, chats, or browser bookmarks, the app gives you a focused workspace for tracking what matters and surfacing the right source at the right time.

## Core Features

- Save research links with titles, notes, categories, and tags
- Organize sources by reading status and favorites
- Filter and sort the collection by search, category, tag, status, and priority
- Review and update saved links through an editable research library interface
- Persist research data with MongoDB for a durable, production-ready backend

## Tech Stack

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **MongoDB**
- **React Hook Form** with **Zod** validation
- **shadcn/ui** with Radix-based primitives
- **Vitest** for testing
- **ESLint** for code quality
- **Prettier** for formatting

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm
- A MongoDB database

### Environment Variables

Create the environment variables required by the app before running it locally:

```bash
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=your-database-name
```

### Installation

Install dependencies:

```bash
npm install
```

### Run Locally

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Available Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Build the app for production
- `npm run start` - Run the production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run the TypeScript type checker
- `npm run test` - Run the test suite with Vitest
- `npm run format` - Format the codebase with Prettier
- `npm run format:check` - Check formatting without writing changes

## Project Structure

```text
research-vault/
├── src/
│   ├── app/          # App Router routes, layouts, and API handlers
│   ├── components/   # Product UI and reusable interface primitives
│   └── lib/          # Validation, data access, config, and shared utilities
├── public/           # Static assets
├── components.json   # shadcn/ui configuration
├── next.config.ts    # Next.js configuration
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## Authors

- [Thilina Rathnayaka](https://thilina.dev) - Product Lead / Front-end Lead
- [Ammaar Ilham](https://www.ammaarilham.dev/) - Full-stack Developer / Integration Support
- [Muhammadu Rawshan](https://www.linkedin.com/in/muhammadu-rawshan/) - Scrum Master / Front-end Developer
- [Peshala Perera](https://www.linkedin.com/in/peshala-perera-994b411b9/) - Back-end Lead
- [Pasan Heiyantuduwa](https://www.linkedin.com/in/pasanheiyantuduwa/) - QA / Testing Developer
