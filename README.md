# Teach me Black, Jack 🃏

A Progressive Web App that helps you master blackjack basic strategy through interactive practice with Jack, your friendly dealer guide.

![Teach me Black, Jack](./preview.png)

## Features

- 🎰 **Interactive Practice** - Learn by doing with real-time feedback
- 🤖 **Jack, Your Guide** - Friendly dealer persona with personality
- 📊 **Smart Scoring** - 3 points for optimal, 1 point for second-best, 0 for wrong
- 🎯 **Immediate Feedback** - Learn from every hand
- 📱 **PWA Ready** - Install and play offline
- 🎨 **Casino Theme** - Authentic felt table experience

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

1. **View Your Hand** - You get 2 cards, dealer shows 1 up card
2. **Choose Action** - Hit, Stand, Double Down, or Split
3. **Get Feedback** - Jack tells you the optimal play
4. **Learn & Improve** - Play 20 hands per session

## Scoring System

- **3 points** - Perfect! You chose the optimal action
- **1 point** - Not bad! You chose the second-best action  
- **0 points** - Review! Wrong action, but you'll learn

## Basic Strategy

Uses standard blackjack basic strategy:
- 6-8 decks
- Dealer stands on soft 17
- Double after split allowed

## Project Structure

```
src/
├── components/     # React UI components
│   ├── Jack.tsx              # Jack's avatar and dialogue
│   ├── Card.tsx              # Card display
│   ├── Hand.tsx              # Hand display
│   ├── ActionButtons.tsx     # Player actions
│   ├── ScoreDisplay.tsx      # Score tracking
│   ├── FeedbackModal.tsx     # Feedback dialog
│   └── GameSummary.tsx       # End-of-session results
├── game/           # Core game logic (framework-agnostic)
│   ├── types.ts              # TypeScript interfaces
│   ├── deck.ts               # Card dealing logic
│   ├── strategy.ts           # Basic strategy table
│   └── scoring.ts            # Scoring & Jack's messages
├── hooks/          # React hooks
│   └── useGame.ts            # Game state management
├── storage/        # Storage abstraction
│   └── LocalStorageAdapter.ts  # LocalStorage implementation
└── styles/         # CSS styling
    └── App.css               # Casino theme
```

## Tech Stack

- **Framework** - React 18 + TypeScript
- **Build Tool** - Vite
- **PWA** - vite-plugin-pwa
- **Deployment** - Vercel

## Development

### Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build locally
npm run lint       # Run ESLint
npm run type-check # TypeScript checking
```

### Architecture Principles

- **Pure game logic** - `src/game/` is framework-agnostic TypeScript
- **Storage abstraction** - Easy to swap localStorage for backend
- **Sprite-ready** - Jack component supports future sprite sheets
- **Modular components** - Easy to extend and modify

## Future Enhancements

### Phase 2
- [ ] Animated card dealing
- [ ] Sound effects (optional toggle)
- [ ] Accessibility improvements
- [ ] Multiple rule variations

### Phase 3
- [ ] Practice mode (specific scenarios)
- [ ] Session history tracking
- [ ] Performance analytics

### Phase 4 - Backend
- [ ] Supabase integration
- [ ] User accounts
- [ ] Leaderboards
- [ ] Social sharing

### Phase 5 - Polish
- [ ] Jack sprite animations
- [ ] Multiplayer challenges
- [ ] Adaptive difficulty

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd ~/repos/teach-me-black-jack
   vercel
   ```

3. **Follow prompts** to link project and deploy

### Railway (Alternative)

1. Create new project on Railway
2. Connect GitHub repo
3. Set build command: `npm run build`
4. Set output directory: `dist`

## Contributing

See [AGENTS.md](./AGENTS.md) for development guidelines and architecture notes.

## License

MIT

---

Built with ❤️ by Ben with assistance from pibot 🦊🦦🤖
