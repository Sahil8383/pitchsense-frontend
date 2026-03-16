# PitchSense — Frontend

Next.js frontend for **PitchSense AI**: a sales pitch practice and evaluation app. Users create scenarios (buyer persona, deal context, rubric), run a live roleplay chat with an AI buyer, and view post-session evaluations with competency scores and analytics.

---

## Setup

### Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/scenario/new` to start the flow.

### Environment

| Variable              | Description                          | Default                 |
| --------------------- | ------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL (no trailing slash) | `http://localhost:3001` |

Create a `.env.local` if the API runs elsewhere:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

The backend must be running and CORS must allow this origin.

### Scripts

| Command       | Description                |
| ------------- | -------------------------- |
| `pnpm dev`    | Start dev server (Next.js) |
| `pnpm build`  | Production build           |
| `pnpm start`  | Run production server      |
| `pnpm lint`   | Run ESLint                 |
| `pnpm format` | Format with Prettier       |

---

## Architecture overview

- **Framework:** Next.js 16 (App Router), React 19.
- **Data:** TanStack Query for server state; React Context for session (current scenario/session) and toasts.
- **API:** REST + NDJSON streaming for chat; WebSocket for real-time analytics during the roleplay.
- **UI:** Tailwind CSS 4, custom components in `components/ui`, feature components in `components/scenario`, `components/roleplay`, `components/evaluation`.

### Route flow

1. **`/`** → redirects to `/scenario/new`
2. **`/scenario/new`** — 3-step wizard: Persona → Context → Rubric → create scenario + session → navigate to session
3. **`/session/[sessionId]`** — roleplay chat (seller vs AI buyer), analytics sidebar, end-session → evaluation
4. **`/evaluation/[sessionId]`** — score overview, competency breakdown, transcript

### Key directories

| Path                     | Purpose                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `app/`                   | Routes, layout, providers                                                |
| `components/ui/`         | Reusable primitives (Button, Card, Input, Modal, Toast, etc.)            |
| `components/scenario/`   | PersonaForm, ContextForm, RubricBuilder                                  |
| `components/roleplay/`   | ChatMessage, ChatInput, TypingIndicator, AnalyticsPanel, EndSessionModal |
| `components/evaluation/` | ScoreOverview, CompetencyBreakdown, TranscriptViewer                     |
| `contexts/`              | SessionContext, ToastContext                                             |
| `hooks/`                 | useSessionIdParam, useSession, useScenario, useEvaluation                |
| `lib/api/`               | API client (config, scenarios, sessions, evaluations)                    |
| `lib/constants/`         | Session/scenario constants, quick prompts                                |
| `lib/types.ts`           | Shared TypeScript types                                                  |

---

## Design decisions

- **Wizard for scenario creation:** Three steps (Persona → Context → Rubric) keep the form manageable and make validation and “next/back” behavior clear. Step 3 is the only submit; steps 1–2 only advance state.
- **Single active session in context:** The current session (and scenario) live in `SessionContext` so the session and evaluation pages can use them without refetching. Session is set when leaving the wizard and when needed for evaluation.
- **Streaming chat UX:** Seller messages are optimistically appended; buyer replies stream in via NDJSON. A single “streaming” message row shows live text and a typing indicator to avoid layout jumps.
- **Chat vs Analytics tabs on small screens:** On narrow viewports, the session page uses a tab (chat / analytics) instead of side-by-side layout so the chat remains usable and analytics are one tap away.
- **Theme toggle (light/dark/system):** Implemented with `next-themes` and CSS variables so all UI respects user preference with minimal duplication.
- **Toast for async feedback:** Create scenario/session, end session, and send-message errors surface via a small toast component so the flow isn’t blocked by modals.

---

## Technical trade-offs

- **In-memory backend state:** The backend does not persist to a database. Scenarios, sessions, and evaluations are lost on restart. Chosen for simplicity and to keep the demo self-contained; production would use a DB.
- **No auth:** There is no login or multi-tenant isolation. Fine for a single-user or demo deployment.
- **Optimistic + rollback on send error:** If sending a message fails, the optimistic seller message is removed and a toast shows the error. We don’t retry automatically to keep the implementation simple.
- **Evaluation from context when possible:** The evaluation page can show transcript from `SessionContext` if the user came from the same session; otherwise it only shows evaluation data from the API (no transcript refetch). This avoids an extra session fetch when navigating from “End session” to evaluation.

---

## What I’d improve with more time

- **Persistence:** Add a real database (e.g. SQLite/Postgres) and optional auth so scenarios and sessions survive restarts and can be listed/filtered.
- **Scenario list and reuse:** List saved scenarios, duplicate or edit them, and start a new session from an existing scenario without re-entering all fields.
- **Session recovery:** If the user refreshes during a roleplay, restore session state from the API (and possibly reconnect the analytics WebSocket) instead of losing context.
- **Accessibility:** Systematic keyboard navigation, focus management in modals, and ARIA labels for the chat and analytics panels.
- **Tests:** Unit tests for hooks and API helpers; integration tests for the scenario wizard and session page flows.
- **Error boundaries:** Route-level or section-level error boundaries with clear messaging and a way to retry or go back.
