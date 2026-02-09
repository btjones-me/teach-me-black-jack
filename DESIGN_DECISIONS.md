# Design Decisions Log

A running log of architectural and design decisions for "Teach me Black, Jack".

---

## 2026-02-09 - Initial Build

### Project Naming
- **Decision**: "Teach me Black, Jack" (Jack as the persona)
- **Rationale**: Adds personality and makes learning engaging. "Jack" is a friendly dealer character who guides the player through basic strategy.

### Tech Stack
- **Decision**: Vite + React + TypeScript
- **Rationale**:
  - Vite: Fast dev experience, modern build tool, excellent HMR
  - React: Component-based architecture, large ecosystem
  - TypeScript: Type safety for complex game logic (strategy tables, scoring)
  - **Alternative considered**: Next.js (overkill for static PWA, SSR not needed)

### Deployment
- **Decision**: Vercel for initial deployment
- **Rationale**:
  - Zero-config for Vite projects
  - Free tier with instant previews
  - Better CDN than Railway for global performance
  - Simpler than Railway for static sites
  - **Alternative**: Railway (good for backend-heavy apps, but overkill here)

### Jack's Character Implementation
- **Decision**: SVG for MVP, sprite-ready architecture
- **Rationale**:
  - SVG: Lightweight, scales perfectly, no external dependencies
  - Sprite-ready: Component structure allows easy swap to image sprites later
  - Future: Can add animated sprites without refactoring dialogue logic
  - **Alternative considered**: Immediate sprite implementation (too much setup for MVP)

### Game Logic Architecture
- **Decision**: Pure TypeScript in `src/game/` (framework-agnostic)
- **Rationale**:
  - Testable without React dependencies
  - Reusable in other frameworks (React Native, Node.js, etc.)
  - Clear separation of concerns (logic vs UI)
  - Easier to unit test

### Storage Strategy
- **Decision**: localStorage with adapter pattern
- **Rationale**:
  - MVP: No backend needed, keeps it simple
  - Adapter pattern: Easy to swap for Supabase/backend later without refactoring
  - Interface: `StorageAdapter` defines contract, implementations can vary
  - **Future**: `SupabaseAdapter` can implement same interface

### Basic Strategy Scope
- **Decision**: Single rule set for MVP (6-deck, dealer stands soft 17)
- **Rationale**:
  - Standard rules cover 90% of casinos
  - MVP simplicity over completeness
  - Modular architecture allows adding rule variations later
  - **Future**: `src/game/rules/` directory for variants (Spanish 21, single deck, etc.)

### Feedback Timing
- **Decision**: Immediate feedback after each hand
- **Rationale**:
  - Better learning experience (instant correction)
  - Users can see optimal play while hand is fresh in memory
  - **Alternative**: End-of-session feedback (less effective for learning)

### Scoring System
- **Decision**: 3 points optimal, 1 point second-best, 0 points wrong
- **Rationale**:
  - Rewards perfect play highly
  - Acknowledges "good enough" plays (learning curve)
  - Clear feedback on mistake severity
  - Simple math: Max 60 points per session (20 hands × 3)

### Card Visuals
- **Decision**: CSS-based cards for MVP
- **Rationale**:
  - Lightweight (no image downloads)
  - Fully customizable (casino theme)
  - Accessible (semantic HTML)
  - **Future**: Can upgrade to fancy SVG card library if desired

### Styling Approach
- **Decision**: Custom CSS over Tailwind
- **Rationale**:
  - Full control over casino aesthetic (green felt, gold accents)
  - Custom theme requires less Tailwind configuration
  - Smaller bundle size without Tailwind overhead
  - **Future**: Could migrate to Tailwind if design system grows complex

### PWA Configuration
- **Decision**: vite-plugin-pwa with auto-update strategy
- **Rationale**:
  - Offline play important for mobile users
  - Auto-update ensures users get latest strategy fixes
  - Service worker caches Google Fonts for offline use

### Session Length
- **Decision**: 20 hands per session (configurable)
- **Rationale**:
  - Balanced: Long enough to practice, short enough to complete
  - ~5-10 minutes per session (good for mobile)
  - Configurable for future flexibility

### Availability of Actions
- **Decision**: Show only available actions (e.g., split only on pairs)
- **Rationale**:
  - Reduces decision paralysis
  - Focuses learning on relevant choices
  - UI stays clean and uncluttered

### Jack's Personality
- **Decision**: Encouraging, knowledgeable, never condescending
- **Rationale**:
  - Learning should be positive experience
  - Mistakes are part of learning (don't shame users)
  - Jack is a guide, not a critic

### TypeScript Strictness
- **Decision**: Strict mode enabled
- **Rationale**:
  - Catch bugs early (strategy lookup is critical)
  - Better autocomplete and refactoring
  - Forces explicit typing (good for complex game state)

### Component Structure
- **Decision**: Small, focused components
- **Rationale**:
  - Reusability (Card, Hand, ActionButtons)
  - Easier testing
  - Clear responsibilities
  - Simple to extend (add new UI features)

### State Management
- **Decision**: Custom `useGame` hook (no Redux/Zustand)
- **Rationale**:
  - State is simple and local to game
  - No need for global state management
  - Keeps dependencies minimal
  - **Future**: Could add Zustand if complexity grows

---

## Future Decisions to Make

### Phase 2 - Polish
- [ ] Animation library choice (Framer Motion? CSS animations?)
- [ ] Sound effects implementation (Howler.js? Web Audio API?)
- [ ] Accessibility tools (which ARIA patterns for game UI?)

### Phase 3 - Features
- [ ] Rule variation storage (how to persist custom rule sets?)
- [ ] Practice mode design (specific scenarios? flashcards?)
- [ ] Analytics approach (what metrics to track?)

### Phase 4 - Backend
- [ ] Supabase schema design (users, sessions, leaderboards)
- [ ] Authentication approach (email/password? magic link? OAuth?)
- [ ] Social features (how to share scores? challenges?)

### Phase 5 - Advanced
- [ ] Jack sprite animation approach (sprite sheets? Lottie? CSS?)
- [ ] Mobile app strategy (React Native? Capacitor? PWA only?)
- [ ] Multiplayer architecture (real-time? turn-based?)

---

## Rejected Ideas

### Database for MVP
- **Rejected**: Adding Supabase/backend from start
- **Reason**: Overkill for MVP, localStorage sufficient for single-user practice
- **Revisit**: Phase 4 when adding leaderboards

### Multiple Rule Sets in MVP
- **Rejected**: Supporting all blackjack variants from day 1
- **Reason**: Complexity explosion, most users need standard rules
- **Revisit**: Phase 3 with UI for rule selection

### Animated Card Dealing in MVP
- **Rejected**: Fancy animations from start
- **Reason**: Time-consuming, not critical for learning
- **Revisit**: Phase 2 for polish

### Jack Voice Acting
- **Rejected**: Text-to-speech or recorded audio
- **Reason**: Increases bundle size, accessibility concerns, not multilingual-friendly
- **Revisit**: Maybe never (text is universal)

### Real Blackjack Simulation
- **Rejected**: Full game simulation with money, betting, etc.
- **Reason**: Focus is strategy memorization, not gambling simulation
- **Revisit**: Never (different product)

---

## Lessons Learned

### What Went Well
- SVG Jack worked great for MVP (instant personality)
- Pure TypeScript game logic is easy to test
- Strategy table lookup is clean and maintainable
- Modular architecture allows future expansion

### What Could Be Improved
- (Will update after first user feedback)

### What to Do Differently Next Time
- (Will update after deployment)

---

Last updated: 2026-02-09
