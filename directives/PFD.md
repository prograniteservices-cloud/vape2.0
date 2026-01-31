# Product Functional Document: vape2.0

## Core Features

### 1. Hierarchical Category Navigation
**Priority**: High
**Status**: In Progress

**Description**:
Left sidebar displays category tree that expands progressively. Categories drill down from general (Vapes) to specific (Watermelon flavor) with smooth animations. Each level reveals only when parent is selected.

**User Stories**:
- As a customer, I want to see categories organized hierarchically so that I can narrow down my search systematically
- As a non-tech-savvy user, I want navigation that shows me options gradually so I don't feel overwhelmed

**Acceptance Criteria**:
- [ ] Clicking a category expands to show subcategories below it
- [ ] Subcategories can be nested multiple levels deep
- [ ] Visual indicator shows which category is currently selected
- [ ] Smooth animation when expanding/collapsing categories
- [ ] "Browse" option available at each level for unsure customers

**Technical Requirements**:
- Recursive category tree component
- State management for expanded/collapsed nodes
- Smooth CSS transitions for expand/collapse

### 2. AI Chat Assistant
**Priority**: High
**Status**: In Progress

**Description**:
AI chat window integrated into left sidebar above category navigation. Provides real-time assistance, answers questions about products, helps with navigation, and gives recommendations.

**User Stories**:
- As a customer, I want to ask questions in natural language so I can get help finding what I need
- As a confused shopper, I want the AI to suggest categories based on my description

**Acceptance Criteria**:
- [ ] Chat window visible at top of left sidebar
- [ ] Text input for customer questions
- [ ] AI responses guide users to appropriate categories
- [ ] Chat history visible in the window
- [ ] AI can suggest browsing categories based on vague descriptions

**Technical Requirements**:
- AI integration (OpenAI API or similar)
- Chat message state management
- Auto-scroll to latest message
- Typing indicators

### 3. Irregular-Shaped Category Cards
**Priority**: High
**Status**: In Progress

**Description**:
Main dashboard displays categories as cards of varying shapes and sizes - different sized rectangles, circles, and organic shapes. No uniform grid. Cards display category names only (not products). Clicking navigates deeper or shows items.

**User Stories**:
- As a customer, I want an engaging visual experience so browsing feels modern and fun
- As a visual learner, I want distinct shapes to help me remember where categories are

**Acceptance Criteria**:
- [ ] Cards appear in various shapes (rectangles of different sizes, circles, etc.)
- [ ] No two cards are identical in shape/size
- [ ] Cards display category name prominently
- [ ] Hover effects indicate interactivity
- [ ] Clicking a card navigates to subcategories or shows items
- [ ] Responsive layout that maintains irregularity across screen sizes

**Technical Requirements**:
- CSS Grid with custom placement
- Framer Motion or similar for animations
- Dynamic card sizing algorithm
- 2026 high-end design aesthetic

### 4. Browse Mode
**Priority**: Medium
**Status**: In Progress

**Description**:
Special "Browse" card available at every category level. When clicked, displays items from current category level without requiring specific subcategory selection. Helps customers who are unsure what they want.

**User Stories**:
- As an unsure customer, I want to see items without picking a specific subcategory
- As a browser, I want to explore without committing to a filter

**Acceptance Criteria**:
- [ ] "Browse" option visible at every category level
- [ ] Clicking Browse shows all items at current level
- [ ] Items displayed in same irregular card style
- [ ] Can still navigate to subcategories from browse view

**Technical Requirements**:
- Category context state
- Item filtering logic
- Dynamic view switching

### 5. Item Display
**Priority**: High
**Status**: In Progress

**Description**:
When customer reaches leaf category (specific flavor, brand, etc.) or clicks Browse, dashboard displays actual vape products. Items shown in irregular-shaped cards with product info.

**User Stories**:
- As a customer, I want to see product details when I've narrowed my search
- As a shopper, I want clear product information without clutter

**Acceptance Criteria**:
- [ ] Products display in irregular-shaped cards
- [ ] Each card shows product image, name, price
- [ ] Clicking product shows detailed view
- [ ] Visual distinction between category cards and product cards

**Technical Requirements**:
- Product data structure
- Product card component
- Detail view modal/page

## Technical Requirements

### Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Optional for Phase 1
- **Payment**: Not required for Phase 1 (catalog only)
- **Deployment**: Vercel

### Data Structure

**Categories Tree**:
```
Vapes
├── Flavor
│   ├── Watermelon
│   ├── Strawberry
│   ├── Grape
│   └── [more flavors...]
├── Hits
│   ├── 5000
│   ├── 10000
│   └── [more hit counts...]
├── Brand
│   ├── Brand A
│   ├── Brand B
│   └── [more brands...]
├── Color
│   ├── Red
│   ├── Blue
│   └── [more colors...]
└── On Sale
    ├── Sale Items
```

**Products**:
- id, name, description, price, image_url, category_path, brand, flavor, hits, color, in_stock

## Performance Targets
- **Page Load**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Category Expansion**: < 100ms
- **Lighthouse Score**: > 90

## Testing Requirements
- [ ] Unit tests (70% coverage)
- [ ] Integration tests
- [ ] E2E tests (critical paths)
- [ ] Accessibility tests
- [ ] Mobile responsive testing
- [ ] User testing with target demographic

## Third-Party Integrations
- **OpenAI API**: AI chat assistant
- **Supabase**: Database and storage
- **Vercel**: Hosting and deployment

## Last Updated
2026-01-30
