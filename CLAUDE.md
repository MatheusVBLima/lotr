# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project named "lotr" that creates a comprehensive Lord of the Rings database website. It uses the App Router architecture with TypeScript, Tailwind CSS v4, React 19, TanStack Query v5, and nuqs for URL state management. The site fetches data from The One API (https://the-one-api.dev) to display information about books, movies, characters, and quotes from the LOTR universe.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build` (uses Turbopack)
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (ESLint with Next.js config)

## Architecture

### File Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/app/layout.tsx` - Root layout with font configuration (Geist Sans/Mono)
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS v4 and CSS custom properties
- `public/` - Static assets (SVG icons)

### Key Technologies
- **Next.js 15** with App Router
- **React 19** 
- **TypeScript 5** with strict mode enabled
- **TanStack Query v5** for data fetching and caching
- **nuqs** for URL state management
- **shadcn/ui** for UI components
- **Tailwind CSS v4** with PostCSS integration
- **ESLint** with Next.js and TypeScript configurations
- **Turbopack** for development and builds

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- Targets ES2017
- Includes Next.js plugin for enhanced TypeScript support

### Styling Architecture
- Uses Tailwind CSS v4 with `@import "tailwindcss"`
- CSS custom properties for theming (light/dark mode support)
- Font variables: `--font-geist-sans` and `--font-geist-mono`
- Color system: `--background` and `--foreground` with dark mode support

### ESLint Configuration
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores build directories and generated files
- Uses flat config format with `@eslint/eslintrc` compatibility layer

## The One API Integration

### API Details
- **Base URL**: https://the-one-api.dev/v2
- **Rate Limit**: 100 requests per 10 minutes
- **Authentication**: Bearer token required for most endpoints (except /book)
- **Token**: Stored in `.env.local` as `THE_ONE_API_TOKEN`

### Available Endpoints
- `/book` - Books data (no auth required, static generation)
- `/movie` - Movies data (auth required, ISR with 1-hour revalidation)
- `/character` - Characters data (auth required, server-side prefetch)
- `/quote` - Quotes data (auth required, background sync)
- `/chapter` - Chapters data (auth required)

### Caching Strategy
- **Static Generation**: Used for books data (no authentication required)
- **ISR (Incremental Static Regeneration)**: Movies revalidated every hour
- **TanStack Query**: Client-side caching with 30-minute stale time
- **Background Refetching**: Automatic updates when data becomes stale

## Development Notes

- The project uses Turbopack for both development and production builds
- Dark mode is handled via CSS `prefers-color-scheme` media query
- Font optimization is handled by Next.js font system with Geist font family
- All development scripts utilize Turbopack for enhanced performance
- API client is located in `src/lib/api.ts` with TypeScript types in `src/lib/types.ts`
- Progress tracking is maintained in `todo.md`