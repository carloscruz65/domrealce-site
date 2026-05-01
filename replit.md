# Overview

This is a full-stack web application for DOMREALCE, a Portuguese visual communication and digital printing company. The application serves as a company portfolio and business website, showcasing services like digital printing, vinyl cutting, vehicle wrapping, and custom signage. Built with React, Express, TypeScript, and PostgreSQL, it follows a monorepo structure.

Key capabilities include:
- Displaying a company portfolio and detailed service pages.
- A comprehensive e-commerce shop with product listings, cart functionality, and secure checkout.
- Robust admin panel for managing orders, services, portfolio, and website content.
- Dynamic content management for hero sections and image galleries on service pages.
- Integration with local Portuguese payment gateways (IfthenPay) and PayPal.

The project aims to provide a modern, performant, and secure online presence for DOMREALCE, enhancing its market reach and streamlining business operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for lightweight client-side routing.
- **State Management**: TanStack Query (React Query) for server state management.
- **UI Components**: Radix UI primitives with shadcn/ui for consistent, accessible components.
- **Styling**: Tailwind CSS with custom design tokens, dark theme with black backgrounds and yellow accent color.
- **Responsiveness**: Mobile-first approach with breakpoint-based layouts.
- **Performance**: Optimized static hero sections for faster loading and improved PageSpeed scores.

## Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM for type-safe database operations.
- **API Structure**: RESTful API with `/api` prefix.
- **Security**: `protegerAdmin` middleware for securing admin endpoints, dual-mode admin authentication (localhost for dev, Replit OAuth for production).

## Database Design
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM with Drizzle Kit for schema management.
- **Connection**: Neon Database serverless connection for production.
- **Schema**: Includes user management, news articles with client reviews, and dynamic content management for service heroes and galleries.

## System Features
- **Dynamic Content Management**:
    - **Service Heroes**: Editable through admin panel with customizable text, images, colors, and CTA buttons, loading dynamically from the backend.
    - **Service Galleries**: Admin interface to manage image galleries for service pages, with dynamic loading and fallback.
- **E-commerce**:
    - **Product Categories**: Shop URLs are `/loja/papel-de-parede/` and `/loja/quadros-em-canvas/`.
    - **Checkout**: Supports multiple payment methods (IfthenPay, PayPal), validates fields, and records orders with payment details.
    - **Taxation**: IVA (VAT) set to 23% for Portuguese legal compliance, applied to subtotal and shipping.
- **Admin Panel**:
    - **Order Management**: Search, filter by status and date, statistics dashboard, CSV export, and detailed order view with PayPal data.
    - **Slider Management**: Drag-and-drop reordering, active/inactive toggles, image previews.
    - **Portfolio Management**: Search, filter by category, image preview modal.
    - **News/Críticas do Cliente**: Admin form to manage news articles and client testimonials including review text, author, and star rating.
    - **Testemunhos Dinâmicos**: Public submission form on each news/project page (name, company, 1-5 star rating, message). Submissions are stored as 'pendente' and only shown publicly when 'aprovado'. Admin can approve, reject, or delete each submission via the "Testemunhos" tab.
- **Image Handling**: All hero images are stored in Object Storage.

# External Dependencies

## Database Hosting
- **Neon Database**: Serverless PostgreSQL database.

## Payment Gateways
- **IfthenPay**: Integration for MB WAY, Multibanco, and Payshop. Requires `IFTHENPAY_MBWAY_KEY`, `IFTHENPAY_MB_KEY`, `IFTHENPAY_PAYSHOP_KEY`, and `IFTHENPAY_ANTI_PHISHING_KEY` environment variables.
- **PayPal SDK**: Dynamically loaded for PayPal payments.

## Authentication
- **Replit OAuth**: Used for secure admin authentication in production.

## Asset Storage
- **Replit Object Storage**: Used for storing images, particularly hero images and gallery images.

## Core Libraries
- **React Ecosystem**: React, React DOM, Wouter, TanStack React Query.
- **Backend**: Node.js, Express.js.
- **Database ORM**: Drizzle ORM, Drizzle Kit.
- **Validation**: Zod.
- **Session Management**: `connect-pg-simple`.
- **UI/Styling**: Radix UI, shadcn/ui, Tailwind CSS.
- **Date Handling**: `date-fns`.
- **Carousel**: Embla Carousel.