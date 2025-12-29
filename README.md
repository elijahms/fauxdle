# Fauxdle 🎯

A modern Wordle clone built with Next.js, Tailwind CSS, and shadcn/ui.

**[▶️ Play Now](https://fauxdle.web.app)**

## How to Play

Guess the 5-letter word in 6 tries:
- 🟩 **Green** — Correct letter, correct position
- 🟧 **Orange** — Correct letter, wrong position
- ⬛ **Gray** — Letter not in word

## Features

- 🌓 Dark/Light mode toggle
- ⌨️ Physical keyboard support
- 📱 Mobile responsive
- 💾 Game state persists on refresh
- 📊 Stats tracking (wins, losses, avg guesses)
- 📤 Share results with emoji grid

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **shadcn/ui** components
- **TypeScript**
- **Firebase Hosting**

## Development

```bash
npm install    # Install dependencies
npm run dev    # Run at http://localhost:3000
npm run build  # Build for production
```

## Project Structure

```
src/
├── app/           # Next.js App Router
├── components/
│   ├── ui/        # shadcn components
│   └── game/      # Board, Cell, Key, Keyboard
├── hooks/         # useGame hook (game logic)
└── lib/           # Word list, utilities
```

## Credits

Created by [Elijah Silverman](https://elijahsilverman.com)

Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html)
