# Climate Crisis Bingo Challenge

## Overview

A progressive educational bingo game designed for adult learners to master climate change knowledge. The application now features **two distinct game modes**:

**Group Mode (모둠 모드)**: Original progression system where players advance through five levels (3×3, 4×4, 5×5, 6×6, 7×7), earning badges and titles. Each session generates a unique board using seed-based randomization. Completing 3 lines at each level advances to the next grid size. The final achievement—"지구 지킴이 등단" (Earth Guardian Certification)—is awarded upon completing all levels.

**Solo Mode (혼자하기)**: Player vs Computer battle where both sides compete to complete 3 lines first. Players select grid size (3×3 to 7×7) and use a turn-based "Draw Word" system. A random word is drawn each turn, and if it exists on either board, it's automatically marked. First to complete 3 lines wins (player victory, computer victory, or draw for simultaneous completion).

The game uses seed-based randomization to ensure unique boards per session while maintaining consistency on refresh. Each level displays educational climate-related Korean keywords with detailed descriptions, combining gamification with environmental education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing. The application has a simple route structure with a main game page and a 404 not-found page.

**UI Component Library**: Shadcn UI (New York style variant) with Radix UI primitives for accessible, customizable components. Components follow a design system with:
- Tailwind CSS for styling with custom color variables and HSL-based theming
- Custom spacing primitives (2, 4, 6, 8 units)
- Typography using Noto Sans KR (primary) for Korean character support and Nunito for playful accents
- Responsive grid layout maintaining 1:1 aspect ratio for bingo tiles

**State Management**: React hooks (useState, useEffect) for local component state. No global state management library is used, keeping the architecture simple for this single-page game.

**Data Fetching**: TanStack Query (React Query) v5 configured for API communication, though the current implementation primarily uses local state with hardcoded climate keywords data.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript. The server is minimal, primarily serving the Vite-built frontend.

**Development Mode**: Vite dev server with HMR (Hot Module Replacement) middleware integrated into Express for rapid development. Special Replit plugins are conditionally loaded for development banner and cartographer features.

**Production Mode**: Express serves static files from the built `dist/public` directory.

**API Structure**: RESTful API endpoints prefixed with `/api` (currently minimal - the routes file is a skeleton ready for implementation). Request/response logging middleware tracks API performance.

**Session Management**: Infrastructure in place for connect-pg-simple session storage, though authentication is not yet implemented.

### Data Storage Solutions

**Database**: PostgreSQL configured via Drizzle ORM. The schema currently defines a minimal user table with:
- UUID primary keys (auto-generated)
- Username (unique, not null)
- Password (not null)

**ORM**: Drizzle ORM with Zod integration for type-safe database operations and schema validation. Migration files are managed in a separate `migrations` directory.

**Connection**: Uses `@neondatabase/serverless` driver for PostgreSQL connectivity, configured through `DATABASE_URL` environment variable.

**Storage Interface**: An abstract `IStorage` interface with a concrete `MemStorage` in-memory implementation for development/testing. This allows swapping between in-memory and database-backed storage without changing business logic.

**Design Decision**: The dual storage approach (interface + in-memory implementation) allows development without database dependency while maintaining a clean migration path to persistent storage. Currently, the game data (climate keywords) is hardcoded in the frontend component rather than database-backed, suitable for this educational game's static content.

### Design System

**Typography Scale**: Hierarchical text sizing for different UI elements (page titles at 2.5-3rem, victory messages at 2rem, keywords at 1-1.125rem)

**Color System**: HSL-based color variables with support for light/dark themes, though currently optimized for light mode with a cyan/blue primary palette suitable for climate/environmental themes.

**Component Patterns**: 
- Dialog/modal components for displaying keyword descriptions
- Button variants (default, outline, ghost, destructive) with hover/active elevation effects
- Toast notifications for user feedback
- Responsive grid system with mobile-first breakpoints

### External Dependencies

**UI Components**: Extensive use of Radix UI primitives (@radix-ui/react-*) for accessible, unstyled component foundations including dialogs, tooltips, buttons, and form controls.

**Styling**: 
- Tailwind CSS for utility-first styling
- PostCSS with Autoprefixer for CSS processing
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional className composition

**Forms**: React Hook Form with Zod resolvers for form validation (infrastructure in place but not actively used in current bingo game).

**Utilities**:
- date-fns for date manipulation
- lucide-react for icon components
- embla-carousel-react for carousel functionality (available but not used in current game)
- cmdk for command palette patterns (available but not used)

**Fonts**: Google Fonts (Noto Sans KR and Nunito) loaded via CDN for Korean and playful English typography.

**Development Tools**: 
- Replit-specific Vite plugins for development banner and runtime error overlays
- esbuild for server-side bundling in production builds
- tsx for TypeScript execution in development

**Database**: 
- Drizzle Kit for schema migrations
- @neondatabase/serverless for PostgreSQL connectivity
- connect-pg-simple for PostgreSQL session storage (configured but not actively used)