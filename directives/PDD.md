# Product Design Document: vape2.0

## Overview
**Project Type**: Web App - Vape Store Dashboard
**Technology Stack**: Next.js + React + Tailwind CSS
**Deployment**: Vercel
**Timeline**: Ongoing development

## User Personas

### Persona 1: Casual Vape Shopper
- **Role**: Retail customer looking for vape products
- **Goals**: Find the right product quickly without feeling overwhelmed
- **Pain Points**: Too many options, confusing navigation, doesn't know product terminology
- **Tech Savvy**: Low - needs extremely simple, intuitive interface

### Persona 2: Experienced Vaper
- **Role**: Regular customer who knows what they want
- **Goals**: Navigate to specific brands/flavors quickly
- **Pain Points**: Wasting time with complicated navigation systems
- **Tech Savvy**: Medium - comfortable with basic navigation

## User Journeys

### Journey 1: Category Navigation
1. Customer lands on dashboard
2. Sees left sidebar with AI chat and category tree
3. Clicks on "Vapes" category in sidebar
4. Sidebar expands to show subcategories (Flavor, Hits, Brand, Color, Sale)
5. Customer clicks "Flavor" 
6. Sidebar expands to show specific flavors (Watermelon, Strawberry, Grape, etc.)
7. Customer clicks specific flavor
8. Dashboard displays relevant items in irregular-shaped cards

### Journey 2: Browse Mode
1. Customer unsure of what they want
2. Clicks "Browse" card on main dashboard
3. System displays popular or featured items
4. Customer can filter by clicking category cards
5. Eventually finds desired product

### Journey 3: AI Assistance
1. Customer has question or needs help
2. Types question in AI chat window in left sidebar
3. AI provides guidance on categories, products, or recommendations
4. Customer follows AI's navigation suggestions

## Design Principles
1. **Simplicity Above All**: Every interaction must be immediately obvious - no learning curve
2. **Visual Hierarchy**: Irregular card shapes create visual interest while maintaining clear organization
3. **Progressive Disclosure**: Information and options appear only when needed through category expansion
4. **Accessibility**: Large touch targets, high contrast, clear typography for users aged 21-60

## Visual Design System

### Colors
- **Primary**: Deep purple (#6B46C1) - vape industry association
- **Secondary**: Cool gray (#6B7280) - neutral navigation
- **Accent**: Bright teal (#14B8A6) - calls to action
- **Background**: Soft white (#FAFAFA) - clean, modern
- **Text**: Deep charcoal (#1F2937) - high readability

### Typography
- **Font Family**: Inter or system fonts - clean, modern, highly legible
- **Heading Sizes**: 48px (hero), 32px (section), 24px (card titles)
- **Body Size**: 18px base for readability

### Spacing
- **Base Unit**: 16px
- **Scale**: 16px, 24px, 32px, 48px, 64px

## Responsive Breakpoints
- **Mobile**: < 768px (hamburger menu, stacked layout)
- **Tablet**: 768px - 1024px (condensed sidebar)
- **Desktop**: > 1024px (full layout with expanded sidebar)

## Accessibility Requirements
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast ratios (4.5:1 minimum)
- [ ] Reduced motion support
- [ ] Touch targets minimum 44x44px

## Last Updated
2026-01-30
