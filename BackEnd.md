## Auth
- `src/pages/loginpage.jsx:23-32` — no request, stub. Needs `POST /auth/login`, `GET /auth/me`
- `src/pages/signuppage.jsx:25-32` — only password match check. Needs `POST /auth/signup`
- `src/components/adminsidebar.jsx:47`, `src/components/usersidebar.jsx:44` — logout is `<Link>`. Needs `POST /auth/logout`

## Messages
- `src/pages/messagespage.jsx:4-8` — `DUMMY_DM` fakes DB. Needs `GET /conversations`
- `src/pages/messagespage.jsx:45-47` — body empty. Needs `GET /conversations/:id/messages`
- `src/pages/messagespage.jsx:48-62` — send does `preventDefault`. Needs `POST /conversations/:id/messages` + WS realtime
- `src/pages/homepage.jsx:64-67` — unread static. Needs `POST /conversations/:id/read`

## Feed
- `src/pages/homepage.jsx:4-9` — `DUMMY_POSTS` fakes DB. Needs `GET /feed`, `POST /posts`

## Search
- `src/pages/homepage.jsx:57-62`, `src/pages/messagespage.jsx:16-18` — inputs with no handler. Needs `GET /search`

## Profile
- `src/pages/profilepage.jsx:6-7` — stub. Needs `GET /users/:id`, `PUT /users/me`

## Team
- `src/pages/teampage.jsx:5` — stub. Needs `GET /teams`, `POST /teams/:id/members`

## Dashboard
- `src/pages/dashboard.jsx:6` — stub. Needs `GET /dashboard/summary` + admin guard

## Settings
- `src/pages/settingspage.jsx:12,27` — local `useState` only. Needs `GET/PUT /users/me/settings`

## Routing
- `src/App.jsx:17-35` — no auth guard. Needs `RequireAuth` + `RequireRole` via `GET /auth/me`
- `src/components/HomeShell.jsx:4-12` — always admin. Role must come from BE.

FE-only, keep: `src/components/switch.jsx:3-10`, layouts, `src/components/Icon.jsx:10-20`.
