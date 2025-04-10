# Group Grove Savings - Project Structure

## Overview
This document provides a detailed breakdown of the project structure and explains the purpose of each directory and file.

## Root Directory Structure
```
├── src/                    # Source code directory
├── public/                 # Static assets
├── supabase/              # Supabase configuration and migrations
├── docs/                   # Documentation files
└── configuration files     # Various config files (tsconfig, vite.config, etc.)
```

## Source Code (`src/`)
### Components (`src/components/`)
- Reusable UI components
- Organized by feature/functionality
- Follows atomic design principles

### Pages (`src/pages/`)
- Main application routes
- Each page represents a major feature
- Includes authentication, dashboard, savings, etc.

### Contexts (`src/contexts/`)
- React context providers
- Manages global state
- Includes auth, theme, and app-wide state

### Hooks (`src/hooks/`)
- Custom React hooks
- Reusable logic
- Includes authentication, data fetching, etc.

### Integrations (`src/integrations/`)
- Third-party service integrations
- API clients
- External service configurations

### Types (`src/types/`)
- TypeScript type definitions
- Interface declarations
- Type utilities

### Lib (`src/lib/`)
- Utility functions
- Helper methods
- Common business logic

## Public Directory (`public/`)
- Static assets
- Images
- Icons
- Other public resources

## Supabase Directory (`supabase/`)
- Database migrations
- Supabase configuration
- SQL scripts
- Database schema

## Configuration Files
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `package.json` - Project dependencies and scripts

## Common Issues and Solutions
1. **TypeScript Errors**
   - Check `src/types/` for missing type definitions
   - Ensure proper type imports
   - Run `tsc --noEmit` to check types

2. **Build Issues**
   - Clear node_modules and reinstall
   - Check Vite configuration
   - Verify environment variables

3. **Database Issues**
   - Check Supabase migrations
   - Verify database schema
   - Test database connections

4. **Authentication Problems**
   - Check auth context
   - Verify token handling
   - Test auth endpoints

## Best Practices
1. **Code Organization**
   - Keep components small and focused
   - Use proper TypeScript types
   - Follow React best practices

2. **State Management**
   - Use context for global state
   - Keep local state in components
   - Avoid prop drilling

3. **Performance**
   - Implement code splitting
   - Use React.memo when needed
   - Optimize re-renders

4. **Security**
   - Validate all inputs
   - Sanitize user data
   - Use proper authentication

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`
5. Run tests: `npm test`

## Development Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
5. Get code review
6. Merge to main

## Troubleshooting Guide
1. **Build Fails**
   - Check for missing dependencies
   - Verify TypeScript types
   - Check for circular dependencies

2. **Runtime Errors**
   - Check browser console
   - Verify API responses
   - Test component rendering

3. **Database Issues**
   - Check migration status
   - Verify connection strings
   - Test queries

4. **Authentication Issues**
   - Check token validity
   - Verify user permissions
   - Test auth flows 