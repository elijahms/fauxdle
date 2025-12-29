# Fauxdle 🎯

A modern Wordle clone built with Next.js, Tailwind CSS, and shadcn/ui.

![Fauxdle Screenshot](/Users/elijahsilverman/.gemini/antigravity/brain/760ca9ad-77d2-49c4-95c8-612ca3b2be4c/initial_load_1767040807446.png)

## Play

Guess the 5-letter word in 6 tries:
- 🟩 **Green** — Correct letter, correct position
- 🟧 **Orange** — Correct letter, wrong position
- ⬛ **Gray** — Letter not in word

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **shadcn/ui** components
- **TypeScript**

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Features

- 🌓 Dark/Light mode toggle
- ⌨️ Physical keyboard support
- 📱 Mobile responsive
- 💾 Game state persists on refresh
- 📊 Stats tracking (wins, losses, avg guesses)
- 📤 Share results with emoji grid

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
