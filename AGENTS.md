# Repository Guidelines - Teach me Black, Jack

## Project Overview
A Progressive Web App that helps users memorize optimal blackjack basic strategy through interactive practice with Jack, your friendly dealer guide.

---

## Project Structure & Module Organization

### Core Directories
- **`src/components/`** - React UI components
  - `Jack.tsx` - Jack's avatar and dialogue system (SVG for now, sprite-ready)
  - `Card.tsx` - Individual card display
  - `Hand.tsx` - Player/dealer hand display
  - `ActionButtons.tsx` - Hit/Stand/Double/Split buttons
  - `ScoreDisplay.tsx` - Current score and hand progress
  - `FeedbackModal.tsx` - Jack's feedback after each hand
  - `GameSummary.tsx` - End-of-session results

- **`src/game/`** - Core game logic (pure TypeScript, framework-agnostic)
  - `strategy.ts` - Basic strategy table and optimal action lookup
  - `deck.ts` - Card dealing, shuffling, deck management
  - `scoring.ts` - Score calculation (3 pts optimal, 1 pt second-best)
  - `types.ts` - TypeScript interfaces and enums
  - `rules/` - (Future) Multiple rule configurations

- **`src/hooks/`** - React hooks for state management
  - `useGame.ts` - Main game state hook
  - `useLocalStorage.ts` - Persistence abstraction (backend-ready)

- **`src/storage/`** - Storage abstraction layer
  - `StorageAdapter.ts` - Interface for storage (localStorage now, backend later)
  - `LocalStorageAdapter.ts` - Current implementation
  - `SupabaseAdapter.ts` - (Future) Backend implementation

- **`src/styles/`** - Styling
  - `global.css` - Base styles
  - `casino-theme.css` - Casino visual theme (green felt, gold accents)
  - `components/` - Component-specific styles

- **`public/`** - Static assets
  - `icons/` - PWA icons (various sizes)
  - `sprites/` - (Future) Jack's sprite sheets
  - `manifest.json` - PWA manifest

---

## Build, Test, and Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start Vite dev server (http://localhost:5173)

# Production
npm run build           # Build for production (outputs to dist/)
npm run preview         # Preview production build locally

# Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking
npm run test            # Run Vitest unit tests
npm run test:ui         # Run tests with Vitest UI

# Deployment
vercel                  # Deploy to Vercel (after linking project)
```

---

## Coding Style & Naming Conventions

### TypeScript
- **Strict mode enabled** - No implicit any, strict null checks
- **Line length**: 100 characters max
- **Imports**: Group and sort (React, third-party, local)

### Naming Conventions
- **Components**: PascalCase (`Card.tsx`, `ActionButtons.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGame`, `useLocalStorage`)
- **Utilities/Functions**: camelCase (`getOptimalAction`, `shuffleDeck`)
- **Types/Interfaces**: PascalCase (`Card`, `GameState`, `StrategyAction`)
- **Enums**: PascalCase for enum, SCREAMING_SNAKE for values
  ```typescript
  enum Action {
    HIT = 'HIT',
    STAND = 'STAND',
    DOUBLE = 'DOUBLE',
    SPLIT = 'SPLIT'
  }
  ```

### CSS
- **BEM naming** for classes (`.card__suit--red`, `.hand__total`)
- **CSS custom properties** for theming (`--color-felt`, `--color-gold`)
- **Mobile-first** responsive design

### File Structure
```typescript
// Component structure
import { useState } from 'react';
import type { Card } from '@/game/types';
import './Card.css';

interface CardProps {
  card: Card;
  hidden?: boolean;
}

export const Card = ({ card, hidden = false }: CardProps) => {
  // Component logic
};
```

---

## Testing Guidelines

### Test Organization
- **Unit tests**: `src/game/**/*.test.ts` - Pure logic (strategy, scoring, deck)
- **Component tests**: `src/components/**/*.test.tsx` - React Testing Library
- **Integration tests**: `src/__tests__/integration/` - Full game flow

### Test Naming
```typescript
describe('getOptimalAction', () => {
  it('should return DOUBLE for hard 11 vs dealer 6', () => {
    // Test implementation
  });
  
  it('should return HIT as second-best when DOUBLE not available', () => {
    // Test implementation
  });
});
```

### Coverage Goals
- **Game logic**: >90% coverage (critical for correctness)
- **Components**: >70% coverage (focus on user interactions)
- **Overall**: >80% coverage

---

## Commit & Pull Request Guidelines

### Conventional Commits
Use conventional commit format:
```
feat: add Jack's feedback dialogue system
fix: correct optimal action for soft 18
chore: update dependencies
docs: improve AGENTS.md structure
style: apply casino theme to action buttons
test: add unit tests for strategy lookup
```

### Commit Scope
- Keep commits atomic and focused on one change
- Run `npm run lint` and `npm run type-check` before committing
- Include tests with feature commits when applicable

### Pull Request Template
```markdown
## Changes
- Brief description of what changed

## Motivation
- Why this change was needed

## Testing
- How to verify the changes work
- Which commands to run

## Checklist
- [ ] Tests passing (`npm run test`)
- [ ] Types valid (`npm run type-check`)
- [ ] Linting clean (`npm run lint`)
- [ ] Tested in browser (Chrome, Safari, Firefox)
```

---

## Configuration & Secrets

### Environment Variables
- **None needed for MVP** (pure static app)
- `.env.example` provided for future backend integration
- Settings stored in localStorage (game preferences, session history)

### Future Backend Integration
When adding Supabase/backend:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

All secrets prefixed with `VITE_` for Vite exposure to browser.

---

## Architecture Principles

### Modularity
- **Game logic is pure TypeScript** - Can be used in Node, React, or other frameworks
- **Storage is abstracted** - Swap localStorage for backend without touching game logic
- **Components are composable** - Build complex UIs from simple pieces

### Future-Proofing
- **Rule variations**: Strategy table accepts config object (deck count, soft 17, etc.)
- **Backend-ready**: Storage adapter pattern allows easy Supabase integration
- **Sprite-ready**: Jack component separates logic from rendering (SVG → sprite swap is trivial)

### Performance
- **Lazy loading** for routes (if we add multiple pages)
- **Memoization** for expensive calculations (strategy lookups)
- **Service worker** for offline PWA support

---

## Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-09 | Vite + React + TypeScript | Modern DX, fast HMR, type safety for strategy logic |
| 2026-02-09 | Vercel deployment | Simplest for static Vite apps, instant previews |
| 2026-02-09 | Jack as feedback persona | Adds personality, makes learning engaging |
| 2026-02-09 | SVG for Jack (now), sprite-ready | Lightweight MVP, easy to upgrade later |
| 2026-02-09 | Storage adapter pattern | Keeps localStorage now, backend later without refactor |
| 2026-02-09 | Immediate feedback | Better learning experience than end-of-session only |
| 2026-02-09 | CSS over Tailwind | Full control over casino theme aesthetics |
| 2026-02-09 | Pure TypeScript game logic | Framework-agnostic, testable, reusable |

---

## Jack's Character Guidelines

### Personality
- **Friendly dealer** - Encouraging, never condescending
- **Knows the game** - Confident in strategy knowledge
- **Supportive teacher** - Celebrates wins, gently corrects mistakes

### Dialogue Tone
- **Correct answer**: "That's it! Double down was the perfect play here."
- **Second-best**: "Not bad! Hit works, but doubling down squeezes more value."
- **Wrong answer**: "Tough one! The math says to stand here. Dealer's likely to bust with that 5 showing."

### Visual
- **SVG avatar** (for now): Dealer hat, bow tie, friendly smile
- **Future sprites**: Multiple expressions (happy, thinking, encouraging)
- **Animation hooks**: Nod on correct, thoughtful on wrong, celebrate on perfect session

---

## Development Workflow

### Starting a New Feature
1. Create feature branch: `git checkout -b feat/hand-splitting-ui`
2. Update design decisions log if architectural
3. Write tests first for game logic (TDD)
4. Implement feature
5. Add component tests
6. Update README if user-facing
7. Commit with conventional format
8. Push and create PR

### Before Every Commit
```bash
npm run type-check  # Catch TypeScript errors
npm run lint        # Catch code style issues
npm run test        # Ensure tests pass
```

### Deployment Flow
- **Push to `main`** → Vercel auto-deploys production
- **Push to feature branch** → Vercel creates preview URL
- **Test preview** → Share for feedback
- **Merge** → Automatic production deployment

---

## Common Tasks

### Adding a New Strategy Rule Variant
1. Create `src/game/rules/spanish21.ts` with rule config
2. Extend `StrategyTable` to accept rule parameter
3. Update `useGame` to pass rule config
4. Add UI toggle in settings (future)

### Adding Backend Persistence
1. Implement `SupabaseAdapter` in `src/storage/`
2. Update `useLocalStorage` to accept adapter
3. Add environment variables
4. No changes needed in game logic or components

### Replacing Jack's SVG with Sprites
1. Add sprite sheets to `public/sprites/`
2. Update `Jack.tsx` to use `<img>` instead of `<svg>`
3. Add CSS for sprite animation
4. No changes needed in dialogue logic

### Adding New Card Visuals
1. Replace CSS cards in `Card.tsx` with SVG library
2. Update `Card.css` for new layout
3. No changes needed in game logic

---

## Resources & References

### Blackjack Strategy
- [Wizard of Odds - Basic Strategy](https://wizardofodds.com/games/blackjack/strategy/calculator/)
- Standard chart used: 6-deck, dealer stands on soft 17, double after split allowed

### Tech Stack Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vitest Testing Guide](https://vitest.dev/guide/)

### Design Inspiration
- Casino felt color: #1a5a3a (green)
- Gold accent: #d4af37
- Card design: Traditional French suits

---

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Check tsconfig paths are correct
- Restart Vite dev server

**Tests failing after refactor**
- Update mock data in test files
- Check interface changes propagated

**Build succeeds but preview broken**
- Check console for asset path errors
- Verify `base` in vite.config.ts

**LocalStorage not persisting**
- Check browser privacy settings
- Test in incognito mode

---

## Future Roadmap

### Phase 1 (MVP) - Current
- [x] Project setup
- [ ] Core game logic (strategy, deck, scoring)
- [ ] Jack's SVG avatar and dialogue
- [ ] Basic UI components
- [ ] Casino theme styling
- [ ] PWA configuration
- [ ] Vercel deployment

### Phase 2 - Polish
- [ ] Animations (card dealing, feedback)
- [ ] Sound effects (optional toggle)
- [ ] Responsive design refinement
- [ ] Accessibility audit (ARIA labels, keyboard nav)

### Phase 3 - Features
- [ ] Multiple strategy rule variants
- [ ] Practice mode (specific scenarios)
- [ ] Session history tracking
- [ ] Performance analytics (weak spots)

### Phase 4 - Backend
- [ ] Supabase integration
- [ ] User accounts
- [ ] Leaderboards
- [ ] Social sharing

### Phase 5 - Advanced
- [ ] Jack sprite animations
- [ ] Multiplayer challenges
- [ ] Adaptive difficulty
- [ ] Mobile app (React Native reuse)

---

## Contact & Support

**Project Lead**: Ben  
**Repository**: `teach-me-black-jack`  
**Deployment**: Vercel  
**Assistant**: pibot (🦊🦦🤖)

For questions or suggestions, open an issue or reach out directly.
