# VerseDrop

A location-based scripture discovery app inspired by Pokemon Go. Users drop Bible verses at GPS coordinates. Other users physically walk to those locations and pick them up.

## Features

- **Drop Verses** — Search 80+ built-in KJV Bible verses and drop them at your current GPS location
- **Discover & Collect** — Walk near glowing verse orbs on the map and pick them up when within 50 meters
- **Reactions** — React to verses with Amen, Heart, or Pray
- **Library** — View all collected verses with pickup dates and streak tracking
- **Profile** — Track your stats (drops, pickups, streaks) and unlock achievement badges
- **Verse of the Day** — A daily rotating verse displayed on the map
- **Manual Location** — Set your position by address, coordinates, or preset locations for desktop testing
- **Notes** — Leave notes on verses you discover

## Tech Stack

**Frontend** — React + TypeScript + Vite + Leaflet (dark CARTO tiles)

**Backend** — Express + TypeScript with in-memory data store (no database setup required)

## Quick Start

```bash
# Install all dependencies
npm install

# Start both API and web servers
npm start
```

The API runs on `http://localhost:3001` and the web app on `http://localhost:5173`.

## Project Structure

```
versedrop/
  /api                  Express backend
    /src
      /db
        store.ts        In-memory data store
        verses.ts       Bible verse search engine
        schema.sql      PostgreSQL schema (for production)
      server.ts         API routes
  /web                  React frontend
    /src
      /screens
        MapScreen.tsx       Main map with drop orbs
        LibraryScreen.tsx   Collected verses
        ProfileScreen.tsx   User stats & achievements
        DropComposer.tsx    Verse search & drop flow
      /components
        BottomSheet.tsx     Verse detail sheet
        LocationSetter.tsx  Manual location picker
        ReactionRow.tsx     Amen/Heart/Pray buttons
        TabBar.tsx          Bottom navigation
      /store
        appStore.ts         Zustand state management
        authStore.ts        Anonymous auth (device token)
      /lib
        api.ts              API client
      styles.css            Design system
```

## How It Works

1. **Anonymous Auth** — A UUID token is generated on first visit and stored in localStorage. No account needed.
2. **Drop a Verse** — Tap the + button, search for a verse, and drop it at your current location.
3. **Discover** — Walk around the map. Gold orbs are undiscovered verses. Tap one to see the verse.
4. **Pick Up** — When within 50 meters, the "Pick Up" button activates. Tap it to collect the verse.
5. **React & Note** — Leave reactions and notes on verses you discover.

## Design

- Dark theme with gold (#D4A245) accent
- Pulsing gold user location dot with discovery radius
- Floating animated verse orbs with glow effects
- Confetti celebration on verse pickup
- Responsive layout with mobile-first design

## Environment Variables

Copy the example env files if you want to customize:

```bash
cp api/.env.example api/.env
```

The app works out of the box without any API keys — Bible verse search uses a built-in verse database, and the map uses free CARTO dark tiles.

## License

MIT
