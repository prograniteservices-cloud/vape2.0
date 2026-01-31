# Standard Operating Procedure: vape2.0

## Project Structure

```
vape2.0/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard page
│   │   ├── layout.tsx            # Root layout with sidebar
│   │   ├── globals.css           # Global styles
│   │   └── api/
│   │       └── chat/             # AI chat API route
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx       # Left sidebar with AI + categories
│   │   │   └── Dashboard.tsx     # Main dashboard area
│   │   ├── features/             # Feature-specific components
│   │   │   ├── CategoryTree.tsx  # Hierarchical category navigation
│   │   │   ├── AIChat.tsx        # AI chat window
│   │   │   ├── CategoryCard.tsx  # Irregular category cards
│   │   │   ├── ProductCard.tsx   # Product display cards
│   │   │   └── BrowseButton.tsx  # Browse mode trigger
│   │   └── shared/               # Shared/reusable components
│   ├── lib/
│   │   ├── utils.ts              # Utility functions
│   │   ├── data.ts               # Mock data for categories/products
│   │   └── api.ts                # API utilities
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── hooks/
│       └── useCategory.ts        # Category navigation hook
├── public/
│   └── images/                   # Static assets
├── directives/                   # Project documentation
│   ├── NORTH_STAR.md
│   ├── PDD.md
│   ├── PFD.md
│   └── SOP.md
├── knowledge-base/               # Learned solutions
│   └── LEARNED_SOLUTIONS.md
├── skills/                       # Copied from skillskit
├── agents/                       # Copied from skillskit
├── tests/                        # Test files
├── docs/                         # Additional documentation
├── .env.example                  # Environment template
├── .env.local                    # Local environment
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # Project readme
```

## Standard Stack
- **Design**: AI Studios
- **Development**: Antigravity/OpenCode
- **Version Control**: GitHub + GitHub CLI
- **Hosting**: Vercel + Vercel CLI
- **Database**: Supabase
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS

## Development Workflow

### Phase 1: Foundation
**Responsible**: Project Lead/Orchestrator
**Outputs**:
- [x] All directive documents approved
- [ ] Task list created and saved
- [ ] File structure established
- [ ] Resources loaded (skills, agents)

### Phase 2: Design System & Layout Foundation ✅ COMPLETE
**Date Completed**: 2026-01-30
**Status**: All components built and tested

**Required Resources**:
- `skills/nextjs-best-practices/SKILL.md`
- `skills/tailwind-patterns/SKILL.md`
- `agents/frontend-specialist.md`

**Deliverables**:
1. ✅ Next.js 16 project initialized with TypeScript
2. ✅ Tailwind CSS configured with custom vape color scheme
3. ✅ Glassmorphism design system implemented
4. ✅ Project structure established (src/app, components, lib, types)
5. ✅ Dependencies installed (framer-motion, lucide-react)
6. ✅ Build successful

**Handoff Notes for Phase 3**:
- **Layout**: Sidebar (280px fixed width) + Dashboard (flexible)
- **Design System**: Dark theme with purple (#8b5cf6) primary, teal (#14b8a6) accent
- **Glass Cards**: rgba(255,255,255,0.08) background + 20px blur + white/15 border
- **Animations**: Framer Motion variants with staggered children, hover effects
- **Components Ready**:
  - `Sidebar.tsx`: AI chat + category tree navigation
  - `Dashboard.tsx`: Irregular card grid with glassmorphism
  - `globals.css`: Custom CSS variables and glassmorphism styles
  - `data.ts`: Category tree data structure with shapes assigned
  - `types/index.ts`: TypeScript interfaces for Category, Product, ChatMessage

**Key Decisions**:
- Desktop-first design (responsive adaptations pending)
- Category cards use assigned shapes: small-rect, medium-rect, large-rect, circle, pill
- Gradient backgrounds: Dark purple (#0f0f1a) to navy (#16213e)
- No search bar per requirements - navigation only via categories
- Mock AI chat implemented with auto-responses

**Phase 3 Ready To Start**: Category Data & State Management

### Phase 3: Core Development - Layout
**Features**:
- Left sidebar with AI chat window
- Category tree navigation component
- Main dashboard area for cards
- Responsive design

### Phase 4: Core Development - Category System
**Features**:
- Hierarchical category data structure
- Recursive category tree component
- Expand/collapse animations
- Category selection state management

### Phase 5: Core Development - Cards
**Features**:
- Irregular-shaped category card grid
- Various sizes (small, medium, large rectangles, circles)
- 2026 high-end design aesthetic
- Hover effects and interactions

### Phase 6: Core Development - AI Chat
**Features**:
- AI chat window UI
- OpenAI API integration
- Message threading
- Category suggestions from AI

### Phase 7: Core Development - Products
**Features**:
- Product card display
- Item filtering by category
- Browse mode implementation
- Product detail views

### Phase 8: Polish & Optimization
**Required Resources**:
- `skills/frontend-design/SKILL.md` (animations, effects)
- `agents/performance-optimizer.md`
- `skills/lint-and-validate/SKILL.md`

### Phase 9: Deployment
**Required Resources**:
- `skills/vercel-cli/SKILL.md`
- `agents/devops-engineer.md`

## Token-Saving Protocol (Resource-First)

### Mandatory Check Order:
1. **Check knowledge-base** (0 tokens)
   - Search LEARNED_SOLUTIONS.md for exact problem
   - If found → Apply immediately

2. **Load required skills** (minimal tokens)
   - Read relevant SKILL.md files
   - Follow patterns exactly

3. **Consult agents** (minimal tokens)
   - Read relevant AGENT.md files
   - Follow methodologies

4. **Execute** (only if not covered above)

### Three-Strike Rule:
**After 3 failed attempts:**
1. STOP immediately
2. Report to user with:
   - What's wrong
   - 3 possible reasons
   - 3 possible solutions
   - Recommendation
3. WAIT for user decision

## Communication Protocol

### Progress Updates (After Each Task)
- [ ] Save task list to `directives/todo.md`
- [ ] Save any new solutions to `knowledge-base/LEARNED_SOLUTIONS.md`
- [ ] Summarize work completed
- [ ] Note any blockers
- [ ] Preview next steps

### Questions to User
- Ask ONE question at a time
- Present 2-3 specific options
- Recommend best choice
- Explain trade-offs
- Wait for response

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` if necessary)
- All functions typed
- All components have props interfaces

### Components
- One component per file (mostly)
- Props destructured at top
- Default exports for pages
- Named exports for components

### Styling
- Tailwind classes only
- Consistent spacing (4px grid)
- shadcn/ui patterns followed
- Custom colors from PDD
- 2026 high-end design aesthetic

### File Naming
- Components: PascalCase.tsx
- Hooks: camelCase.ts
- Utilities: camelCase.ts
- Types: PascalCase in types/

## Testing Protocol

### Required Tests
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Linting passes: `npm run lint`
- [ ] Manual testing checklist completed

### Performance Testing
- [ ] Page load < 2 seconds
- [ ] Filter updates < 100ms
- [ ] Scroll is smooth
- [ ] Mobile responsive

## Deployment Procedure

### Pre-Deployment
- [ ] All tasks complete
- [ ] No console errors
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables set

### Vercel Deployment
1. Push to GitHub
2. Connect repo to Vercel
3. Configure build settings
4. Add environment variables
5. Deploy and verify

### Post-Deployment
- [ ] Site loads successfully
- [ ] All features working
- [ ] Mobile responsive
- [ ] Performance acceptable

## Knowledge Management

### When to Document
- [ ] Problem takes >15 minutes to solve
- [ ] Solution is not obvious
- [ ] Root cause is environmental
- [ ] Solution prevents future issues
- [ ] Multiple attempts were needed

### Documentation Template
```markdown
### [YYYY-MM-DD] - [Brief Title]
**Context**: [Where this happened]
**Problem**: [Detailed description]
**Root Cause**: [Why it happened]
**Solution**: [Step-by-step fix]
**Code**: [If applicable]
**Prevention**: [How to avoid]
**Tags**: #[tag1] #[tag2]
```

## Emergency Contacts
- **Technical Issues**: Stop and report using Three-Strike Rule
- **Scope Changes**: Request formal approval
- **Blockers**: Escalate immediately

## Last Updated
2026-01-30
