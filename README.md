# Telegram Wishlist — Frontend

[![Lint](https://github.com/machen3228/telegram_frontend_wish_list/actions/workflows/lint.yml/badge.svg)](https://github.com/machen3228/telegram_frontend_wish_list/actions/workflows/lint.yml)

React 19 + TypeScript frontend for a Telegram Mini App that lets users create wishlists and let friends reserve gifts to avoid duplicate purchases.

**Live:** [t.me/wishlist_pretty_bot](https://t.me/wishlist_pretty_bot)

Companion backend: [`telegram_app_wish_list`](https://github.com/machen3228/telegram_app_wish_list) (Python / Litestar).

## Tech Stack

- **React 19** — functional components and hooks
- **TypeScript** — strict mode, ES2023 target
- **Vite 8** — bundler with HMR
- **ESLint** — typescript-eslint, react-hooks, react-refresh

## Getting Started

```bash
npm install
npm run dev        # dev server with HMR at http://localhost:5173
npm run build      # type-check + production build
npm run lint       # ESLint (0 errors required)
npm run preview    # preview production build locally
```

Backend must be running at `http://localhost:80`. See the backend repo for setup instructions.

## Architecture

### View Routing

`App.tsx` is a thin orchestrator that manages a `currentView` state (`'main' | 'friends' | 'friend-profile' | 'my-reservations'`). There is no React Router — Telegram Mini Apps have no browser URL bar, so deep-linking is not needed.

### API Client

All authenticated requests go through the `authFetch` helper in `api/client.ts`. It reads the JWT from `localStorage`, attaches the `Authorization: Bearer` header, and throws an `ApiError` (subclass of `Error` with a `.status` field) on non-OK responses. On a 401 it automatically clears the stored token. No raw `fetch` calls are made outside this helper.

### Custom Hooks

Each hook owns all stateful logic for its domain. Hooks expose data + mutation callbacks that `App.tsx` wires to components. Sorting is computed in `useMemo` inside each hook; nulls sort last using `?? Infinity` / `?? -Infinity`.

### Styles

Single global stylesheet (`index.css`). Responsive gift grid via CSS Grid: 1 column (< 500 px), 2 columns (≥ 500 px), 3 columns (≥ 750 px). Gift name is clamped to 2 lines and note to 4 lines; on touch devices (`@media (hover: none)`) clamping is disabled so full text is always visible.

## Project Structure

```
src/
├── main.tsx                      # Entry point, StrictMode
├── App.tsx                       # Root component — thin orchestrator + view router
├── index.css                     # All styles (single global stylesheet)
├── api/
│   ├── client.ts                 # authFetch helper + all API calls
│   └── types.ts                  # Shared TypeScript interfaces (User, Gift, Friend, …)
├── hooks/
│   ├── useAuth.ts                # Login + getMe state
│   ├── useGifts.ts               # Gift list state, sorting, CRUD + refresh
│   ├── useFriends.ts             # Friends list + incoming requests, CRUD
│   └── useMyReservations.ts      # Gifts the current user has reserved, sorted
└── components/
    ├── Avatar.tsx                 # User avatar image with fallback initials
    ├── Modal.tsx                  # Generic modal backdrop + close-on-overlay-click
    ├── PageHeader.tsx             # Back-button page header
    ├── SortSelect.tsx             # Sort order dropdown
    ├── UserCard.tsx               # Current user profile card
    ├── GiftCard.tsx               # Individual gift card
    ├── GiftForm.tsx               # Add-gift modal form
    ├── FriendCard.tsx             # Friend list item with remove action
    ├── FriendRequestCard.tsx      # Incoming friend request with accept/reject
    ├── AddFriendForm.tsx          # Add friend by Telegram ID form
    ├── FriendsPage.tsx            # Friends list + incoming requests page
    ├── FriendProfilePage.tsx      # Friend's wishlist, gift reservation
    └── MyReservationsPage.tsx     # Gifts the current user has reserved
```

## Features

- **User profile** — avatar, name, Telegram username, copyable ID
- **Wishlist** — add, delete, and view gifts with name, URL, price, wish rate, and note
- **Sorting** — newest / oldest / most expensive / cheapest / most wanted
- **Friends** — send/accept/reject friend requests, browse friends list
- **Friend profiles** — view a friend's wishlist and reserve gifts for them
- **My reservations** — see all gifts you have promised to give, cancel reservations
- **Responsive layout** — 1–3 gift columns depending on screen width
- **Mobile-first** — full text always visible on touch devices; clamped with hover-expand on desktop

