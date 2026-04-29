# Product Design Document: VapeOS v2 (Vape Shop MVP)

## Overview
**Project Type**: Multi-tenant Vape Inventory System (PWA)
**Technology Stack**: Next.js (App Router) + React 19 + Tailwind CSS 4 + Supabase
**Deployment**: Vercel (SSG for Catalog)
**Hardware Constraint**: Optimized for Pentium Gold CPU / 4GB RAM environment

## Core Objectives
1. **Multi-tenant Isolation**: Strict shop data isolation using `organization_id` and Supabase RLS.
2. **Mobile-First PWA**: Progressive Web App with offline capabilities and camera-based barcode scanning.
3. **Automated Inventory**: "Stock < 5" triggers via Supabase Edge Functions for re-order alerts.
4. **SEO Mastery**: Automated sitemap generation and submission via GSC API.

## User Personas
... [Existing personas] ...

## User Journeys
... [Existing journeys] ...

### Journey 4: Inventory Management (Shop Owner)
1. Owner opens PWA on mobile.
2. Uses camera-based barcode scanner to check in new stock.
3. System validates `organization_id` to ensure data security.
4. Receives push notification alert when stock for "Watermelon Ice" drops below 5.

## Design Principles
1. **Simplicity Above All**: Intuitive for users aged 21-60.
2. **Visual Hierarchy**: Irregular card shapes (2026 high-end aesthetic).
3. **Performance First**: Optimized for low-resource hardware; prioritize cloud execution.

## Visual Design System
... [Existing design system] ...

## Technical Requirements
- **Database**: 
  - Phase 1: Firebase (Firestore) with Security Rules for multi-tenant isolation.
  - Phase 2: Cloud SQL (PostgreSQL) using Prisma (Scaling path).
- **Scanner**: Browser-native Barcode Detection API (or polyfill).
- **Voice Agent**: 
  - Implementation of "Voice Mode" using Web Speech API or Google Cloud STT/TTS.
  - Integration with Gemini for conversational voice commerce.
- **Frontend**:
  - Phase 1: Vercel (Next.js App Router, SSG focus).
  - Phase 2: Cloud Run for containerized auto-scaling.
- **Intelligence**: 
  - Phase 2: Vertex AI Agent Builder integration ($1,000 credits).
  - Grounding in real-time inventory data.
  - Predictive ordering logic.

## Last Updated
2026-04-28 (Refined for Phase 2 scaling)

