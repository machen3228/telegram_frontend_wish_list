# Telegram Wishlist — Frontend

React 19 + TypeScript frontend for a Telegram Mini App that lets users create wishlists and let friends reserve gifts to avoid duplicate purchases.

Companion backend: [`telegram_app_wish_list`](../telegram_app_wish_list) (Python / Litestar).

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
npm run lint       # ESLint
npm run preview    # preview production build locally
```

Backend must be running at `http://localhost:80`. See the backend repo for setup instructions.

## Project Structure

```
src/
├── main.tsx                      # Entry point
├── App.tsx                       # Root component — thin orchestrator, view router
├── index.css                     # Global styles
├── api/
│   ├── client.ts                 # Fetch wrapper + all API calls
│   └── types.ts                  # Shared TypeScript interfaces
├── hooks/
│   ├── useAuth.ts                # Login + user state
│   ├── useGifts.ts               # Gift CRUD, sorting state
│   ├── useFriends.ts             # Friend list, requests state
│   └── useMyReservations.ts      # Reservations made by the current user
└── components/
    ├── Avatar.tsx                 # User avatar image with fallback
    ├── UserCard.tsx               # Current user profile card
    ├── GiftCard.tsx               # Individual gift card
    ├── GiftForm.tsx               # Add gift modal form
    ├── SortSelect.tsx             # Sort order dropdown
    ├── Modal.tsx                  # Generic modal wrapper
    ├── PageHeader.tsx             # Back-button page header
    ├── FriendCard.tsx             # Friend list item
    ├── FriendRequestCard.tsx      # Incoming friend request card
    ├── AddFriendForm.tsx          # Add friend by username form
    ├── FriendsPage.tsx            # Friends list + requests page
    ├── FriendProfilePage.tsx      # Friend's wishlist + gift reservation
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
- **Mobile-first** — text clamping with hover-expand on desktop; full text always visible on touch devices

## Authentication

Uses a dev endpoint (`/users/auth-dev`) with a hardcoded mock user for local development. JWT is stored in `localStorage` and sent as a `Bearer` token on all subsequent requests.