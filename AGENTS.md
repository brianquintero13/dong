<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

This is a Next.js application for visualizing and simulating finite automata, pushdown automata, and Turing machines. It uses ReactFlow for graph visualization and supports both accessible and retro themes.

## Project Structure

- `src/app/layout.tsx`: Root layout with `SiteHeader` and `ThemeProvider`.
- `src/app/page.tsx`: Finite Automata visualizer.
- `src/app/pda/page.tsx`: Pushdown Automata visualizer.
- `src/app/tm/page.tsx`: Turing Machine visualizer.
- `src/app/NavigationTabs.tsx`: Tab navigation component.
- `src/app/SiteHeader.tsx`: Header with title and theme toggle.
- `src/app/ThemeContext.tsx`: Context for theme state (`isRetroTheme` boolean).
- `src/app/globals.css`: Global styles (minimal, mostly reset).

## Adding New Automata

To add a new automaton type:

1. Create a new directory under `src/app/`, e.g., `src/app/newauto/page.tsx`.
2. Define the machine object with `states`, `startState`, `acceptStates`, `transitions`, etc. (see `exampleMachine1` in `page.tsx` for FA, `pdaMachine` in `pda/page.tsx` for PDA).
3. Add a new tab in `NavigationTabs.tsx` array, e.g., `{ name: 'New Automaton', path: '/newauto' }`.
4. Implement the visualizer using ReactFlow, with nodes for states and edges for transitions.
5. Use `useState` for simulation state (input, history, playback).
6. Include controls for input, step/play/pause/reset, and speed.
7. Add theme-aware styling with inline styles.

## Styling Conventions

- Use inline `style` objects instead of CSS classes or Tailwind.
- Define theme-dependent variables at the top of components, e.g., `const bgApp = isRetroTheme ? '#020617' : '#f1f5f9';`.
- Apply consistent shadows, borders, and colors based on theme.
- Use `boxShadow` for depth, `borderRadius` for modern look.
- Retro theme uses darker backgrounds, glowing effects, and hardware-inspired elements (floppies, CDs).

## Theme System

- `isRetroTheme` defaults to `false` (accessible view).
- Toggle in `SiteHeader` switches between themes.
- Accessible: light backgrounds, high contrast.
- Retro: dark backgrounds, cyan/blue accents, animations.
- All components must support both themes by checking `isRetroTheme`.

## Simulation Patterns

- Use `history` array to track state changes over time.
- Implement step-by-step execution with `setTimeout` or intervals for playback.
- Visualize current position on input tape with color coding.
- Show execution trace in a scrollable log panel.
- Handle acceptance/rejection with animations and messages.

## Dependencies

- `@xyflow/react`: For graph visualization.
- `zustand`: Listed but not yet used; prefer `useState` for now.
- `next`: v16.2.4 with app router.
- `react`: v19.2.4.
- `tailwindcss`: v4, but not used; inline styles preferred.
