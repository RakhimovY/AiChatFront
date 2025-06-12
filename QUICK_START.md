# Frontend Quick Start Guide

## Project Overview
This is a Next.js frontend application for the AIChat project. It provides a modern, responsive user interface for chat interactions and document management.

## Technology Stack
- Next.js 13+
- TypeScript
- Tailwind CSS
- React
- NextAuth.js

## Project Structure
```
AIChatFront/
├── app/                 # Next.js 13 app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication pages
│   └── chat/           # Chat-related pages
├── components/         # Reusable React components
├── lib/               # Utility functions and shared code
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## Key Features
1. Real-time Chat Interface
2. User Authentication (Google OAuth)
3. Document Generation
4. Responsive Design
5. Dark/Light Mode

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Setup Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Configure environment variables:
   - Create `.env.local` file
   - Add required environment variables (see GOOGLE_AUTH_SETUP.md)
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Important Configuration Files
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## Development Guidelines
1. Follow the component-based architecture
2. Use TypeScript for type safety
3. Implement responsive design using Tailwind CSS
4. Follow Next.js best practices
5. Write clean, maintainable code

## Component Structure
- Layout components in `components/layout/`
- UI components in `components/ui/`
- Feature-specific components in respective feature directories

## State Management
- Use React Context for global state
- Use React Query for server state
- Use local state for component-specific state

## Authentication
- Google OAuth implementation
- Session management
- Protected routes

## API Integration
- RESTful API calls to backend
- Error handling
- Loading states

## Styling
- Tailwind CSS for styling
- Custom components library
- Responsive design patterns

## Common Tasks
- Adding new pages
- Creating new components
- Implementing new features
- Styling components
- API integration

## Troubleshooting
See `OAUTH_ERROR_FIXES.md` and `GOOGLE_AUTH_ERROR_FIX.md` for common issues and solutions.

## Additional Resources
- Next.js Documentation
- React Documentation
- Tailwind CSS Documentation
- TypeScript Documentation 