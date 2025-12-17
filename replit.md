# Overview

This is a full-stack web application for DOMREALCE, a Portuguese visual communication and digital printing company. The application serves as a company portfolio and business website showcasing services like digital printing, vinyl cutting, vehicle wrapping, and custom signage. Built with a modern tech stack including React, Express, TypeScript, and PostgreSQL, it follows a monorepo structure with separate client and server directories.

## Recent Changes (December 2025)

### Performance Optimization - Hero Sections (December 2025)
- **Homepage Static Hero**: Replaced dynamic slider with single static image (`StaticHero.tsx`)
  - Uses `/public-objects/homepage/bem-vindo-domrealce.webp` for fast loading
  - Removed JavaScript animations and multiple image preloading
  - Significantly improved PageSpeed scores
  
- **Two-Column Service Heroes** (`ServiceHeroTwoColumn.tsx`): New lightweight hero layout for all 8 service pages
  - Layout: Text content on left (60%), image on right (40%)
  - Static images from Object Storage - no dynamic loading or API calls
  - All buttons use solid yellow (#FFD700) - NO gradients anywhere
  - Service pages updated:
    1. Design Gráfico (`/servico-design-grafico`) - image: `design-grafico.webp`
    2. Impressão Digital (`/servico-impressao-digital`) - image: `impressao-digital.webp`
    3. Papel de Parede (`/servico-papel-parede`) - image: `papel-parede.webp`
    4. Telas Artísticas (`/servico-telas-artisticas`) - image: `telas-artisticas.webp`
    5. Autocolantes (`/servico-autocolantes`) - image: `autocolantes.webp`
    6. Decoração de Viaturas (`/servico-decoracao-viaturas`) - image: `decoracao-viaturas.webp`
    7. Espaços Comerciais (`/servico-espacos-comerciais`) - image: `espacos-comerciais.webp`
    8. Películas de Proteção Solar (`/servico-peliculas-protecao-solar`) - image: `peliculas-solar-protecao.webp`

### Image Storage Structure
- All hero images stored in Object Storage at `/public-objects/servicos/`
- Recommended dimensions: 600x500px or 700x600px in WebP format
- Homepage hero at `/public-objects/homepage/`

### Design Guidelines (IMPORTANT - DO NOT CHANGE)
- **Buttons**: All buttons site-wide use solid yellow `#FFD700` or `bg-brand-yellow` - NO gradients
- **Shop URLs**: 
  - Papel de Parede: `/loja/papel-de-parede/`
  - Quadros em Canvas: `/loja/quadros-em-canvas/`
- **Shop filtering**: Uses case-insensitive path filtering (`toLowerCase()`)
- **Theme**: Dark theme with black backgrounds, yellow accent color

## Previous Changes (November 2025)
- **Hero Editor System for Service Pages** (Production-Ready): Complete dynamic hero editing system
  - Database schema: service_heroes table with all customizable fields (badge, title, subtitle, description, images, backgroundColor, textColor, overlayOpacity, height, CTA buttons)
  - API endpoints: GET /api/service-heroes/:serviceId (public), PUT /api/admin/service-heroes/:serviceId (protected by protegerAdmin)
  - HeroEditor component in admin with tabbed interface (Conteúdo/Imagem/Cores/Layout) for comprehensive editing
  - ServiceHero component loads dynamic content from backend via React Query with automatic fallback to defaults
  - All 7 service pages integrated: design-grafico, impressao-digital, papel-parede, telas-artisticas, autocolantes, decoracao-viaturas, espacos-comerciais
  - Admin interface includes Gallery/Hero sub-tabs for each service in the "Serviços" section
  - Image uploads via Replit Object Storage to "public/servicos/" folder
  - Round-trip tested: edit in admin → save → immediate reflection on service pages
  - Type-safe across entire stack with Drizzle schema, Zod validation, and TypeScript types
- **Service Gallery Management System**: Complete backend and admin interface for managing service page galleries
  - Database schema: serviceGalleries table with serviceId and JSON images array
  - API endpoints: GET /api/service-galleries/:id (public), GET/PUT /api/admin/service-galleries (protected)
  - Admin interface: New "Serviços" tab with ServiceGalleryEditor component for each of 7 services
  - All service pages load images dynamically from backend with fallback to defaults
  - Integrated with ImageUploader for cloud storage uploads via Replit Object Storage
  - Service IDs: design-grafico, impressao-digital, papel-parede, telas-artisticas, autocolantes, decoracao-viaturas, espacos-comerciais
- **Security Hardening**: Removed insecure adminAuth middleware and migrated all admin endpoints to use protegerAdmin
  - Fixed critical security vulnerability where admin endpoints were effectively unauthenticated
  - All /api/admin/* routes now properly protected in production
  - Affected endpoints: service galleries, orders management (GET/PUT/DELETE)
- **Admin Security System**: Implemented secure admin authentication with dual-mode access:
  - Development: Localhost access allowed for testing
  - Production: Requires Replit authentication via /api/login
  - API protection via protegerAdmin middleware
- **Service Detail Pages**: Created 7 comprehensive service detail pages with professional layouts:
  - Design Gráfico (/servico-design-grafico)
  - Impressão Digital (/servico-impressao-digital)
  - Papel de Parede (/servico-papel-parede) 
  - Telas Artísticas (/servico-telas-artisticas)
  - Autocolantes (/servico-autocolantes)
  - Decoração de Viaturas (/servico-decoracao-viaturas)
  - Espaços Comerciais (/servico-espacos-comerciais)
- **Enhanced Service Pages**: Each detail page includes hero sections, feature grids, process workflows, specifications, and call-to-action sections
- **Navigation Integration**: All "Ver Mais" buttons in services page now link to corresponding detail pages
- **Routing Updates**: Added complete routing system for all service pages in App.tsx
- **Consistent Design**: Maintained brand color scheme and professional styling across all service pages
- **Contact Integration**: All service pages include direct links to contact form with WhatsApp integration
- **Portfolio UX Improvements**: Made portfolio images fully clickable without "Ver Detalhes" buttons, removed problematic cursor CSS
- **Spacing Optimization**: Reduced spacing between titles/descriptions and content cards across all pages (py-16 → py-4/py-2) for improved visual hierarchy

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **Styling**: Tailwind CSS with custom design tokens for DOMREALCE brand colors (yellow, turquoise, blue, coral)
- **Build Tool**: Vite with custom configuration for development and production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage) for development
- **API Structure**: RESTful API with `/api` prefix for all endpoints
- **Development Server**: Custom Vite integration for seamless full-stack development

## Database Design
- **Database**: PostgreSQL (configured via Drizzle)
- **Schema**: User management with UUID primary keys, username/password authentication
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Connection**: Neon Database serverless connection for production

## Styling and Design System
- **CSS Framework**: Tailwind CSS with custom configuration
- **Component System**: shadcn/ui components built on Radix UI primitives
- **Theme**: Dark theme with custom brand color palette
- **Typography**: Inter for body text, Poppins for headings
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Development Experience
- **Monorepo Structure**: Shared TypeScript types between client and server
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Hot Reload**: Vite HMR for client-side development
- **Error Handling**: Runtime error overlay for development debugging
- **Code Quality**: TypeScript strict mode for type safety

## Security and Authentication
- **Admin Access Control**: Dual-mode authentication system
  - **Development Mode** (localhost): Direct access to /admin for testing purposes
  - **Production Mode** (Replit domain): Requires Replit OAuth authentication via /api/login
  - Protected by `adminAccess` middleware in server/adminMiddleware.ts
- **API Protection**: `/api/admin/*` endpoints secured by `protegerAdmin` middleware
  - Validates user authentication before allowing admin operations
  - Returns 403 Forbidden for unauthorized requests
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Replit OAuth**: Integration via openid-client for secure authentication
- **CORS**: Configured for development and production environments

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **State Management**: TanStack React Query for server state

## UI and Styling
- **Component Library**: Radix UI primitives (40+ components for dialogs, forms, navigation, etc.)
- **CSS Framework**: Tailwind CSS with PostCSS and Autoprefixer
- **Utility Libraries**: clsx, tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography

## Backend and Database
- **Database**: Neon Database (PostgreSQL serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type validation and schema generation
- **Session Store**: connect-pg-simple for PostgreSQL session storage

## Development Tools
- **Replit Integration**: Cartographer for code navigation, runtime error modal
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image/content sliders

## Production Services
- **Database Hosting**: Neon Database (serverless PostgreSQL)
- **Payment Processing**: IfthenPay integration for MB WAY, Multibanco, and Payshop
- **Environment Variables**: DATABASE_URL for database connection
- **Asset Hosting**: Static assets served from Express in production

## Critical Configuration
### IfthenPay Payment Keys (REQUIRED FOR CHECKOUT)
The following environment variables are ESSENTIAL for the payment system:
- IFTHENPAY_MBWAY_KEY (MB WAY payments)
- IFTHENPAY_MB_KEY (Multibanco references)  
- IFTHENPAY_PAYSHOP_KEY (Payshop references)
- IFTHENPAY_ANTI_PHISHING_KEY (Security validation)

**IMPORTANT**: These keys are configured in Replit Secrets and MUST be maintained. 
If these disappear, customers cannot complete purchases. The checkout will fail with 
"Erro ao criar pagamento" message.

### Tax Configuration
- IVA (VAT) is set to 23% as required by Portuguese law
- Applied to subtotal + shipping costs
- Displayed clearly in both cart and checkout for legal compliance