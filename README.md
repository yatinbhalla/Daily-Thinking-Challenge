# Daily Thinking Challenge

Daily Thinking Challenge is a focused React + Gemini web app that helps users build sharper product judgment, problem-solving ability, and structured thinking through one challenge every day.

The product is intentionally simple: present one high-signal prompt, require the user to commit an answer, evaluate the intent with AI, and track progress over time. It reflects the kind of decision-making, prioritization, trade-off analysis, and customer-first reasoning expected from product managers, founders, and AI builders.

## Table of Contents

- [Why This Project Exists](#why-this-project-exists)
- [Product Highlights](#product-highlights)
- [Project Layout](#project-layout)
- [Tech Stack](#tech-stack)
- [Auth and Login Flow](#auth-and-login-flow)
- [Roles and RBAC](#roles-and-rbac)
- [Application State - AppContext](#application-state---appcontext)
- [Pages](#pages)
- [Components](#components)
- [Canvas System](#canvas-system)
- [NLP and AI Routing](#nlp-and-ai-routing)
- [Hooks and Utilities](#hooks-and-utilities)
- [Known Limitations](#known-limitations)
- [Getting Started](#getting-started)
- [Collaboration](#collaboration)
- [Author](#author)

## Why This Project Exists

Most people prepare for product and strategy interviews by reading frameworks. This app turns that preparation into a daily habit.

Daily Thinking Challenge helps users:

- Practice structured problem solving through PM, strategy, case, logic, pattern, and lateral-thinking prompts.
- Build interview-ready thinking by answering before seeing the explanation.
- Strengthen consistency through streak tracking and completion history.
- Reflect on past answers to identify how their reasoning improves over time.
- Use AI as an evaluator instead of a replacement for thinking.

## Product Highlights

- **Daily challenge engine:** Selects one challenge per day using a deterministic date-based rotation.
- **AI-assisted evaluation:** Uses Google Gemini to compare the user's answer against the intended answer, allowing semantic matches instead of only exact text.
- **Progress tracking:** Stores total solved count, current streak, last solved date, and answer history in `localStorage`.
- **Challenge library:** Includes 170 prompts across logic, observation, PM judgment, product sense, strategy, case, creative, and FAANG-style PM categories.
- **Minimal interface:** Keeps attention on the challenge, the user's answer, and the explanation.
- **Failure fallback:** Falls back to exact-match evaluation if the Gemini request fails.

## Project Layout

```text
Daily-Thinking-Challenge/
├── src/
│   ├── App.tsx          # Main app logic, views, state, Gemini evaluation, progress tracking
│   ├── main.tsx         # React entry point
│   ├── index.css        # Tailwind import
│   └── questions.json   # Daily challenge bank
├── .env.example         # Required Gemini environment variable sample
├── index.html           # Vite HTML shell
├── metadata.json        # App metadata
├── package.json         # Scripts and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite, React, Tailwind, env injection, and alias setup
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4
- **AI/NLP:** Google Gemini via `@google/genai`
- **Icons:** `lucide-react`
- **Animation dependency:** `motion` is installed, though not currently used in the UI
- **State persistence:** Browser `localStorage`
- **Build tooling:** Vite, TypeScript

## Auth and Login Flow

Authentication is not currently implemented.

The app runs as a client-only personal learning tool. A user can open the app, answer the daily challenge, and store progress locally in the browser without creating an account.

Potential future auth flow:

- Add email, Google, or GitHub login.
- Sync progress across devices.
- Protect user history behind authenticated sessions.
- Move API calls through a backend route so Gemini credentials are not exposed to the client.

## Roles and RBAC

RBAC is not currently implemented because the product has a single-user experience.

A future multi-user version could introduce:

- **Learner:** Completes daily challenges and reviews history.
- **Coach or mentor:** Reviews answers and comments on reasoning quality.
- **Admin:** Manages the question bank, challenge categories, and evaluation prompts.

## Application State - AppContext

There is no dedicated `AppContext` provider yet. Application state is managed directly inside `src/App.tsx` using React hooks.

Current state model:

- `view`: controls the active screen: `home`, `result`, `progress`, or `history`.
- `userAnswer`: stores the current response input.
- `isCorrect`: stores AI evaluation result.
- `isEvaluating`: controls the loading state while Gemini evaluates the answer.
- `progress`: stores total solved count, streak, last solved date, and historical answers.

Persistence model:

- Progress is read from `localStorage` on app initialization.
- Progress is saved back to `localStorage` whenever it changes.
- Streak resets when the last solved date is neither today nor yesterday.

A future `AppContext` would be useful once state needs to be shared across separate route-level pages, reusable components, or authenticated user sessions.

## Pages

The app uses internal view state instead of a routing library.

- **Home:** Shows today's challenge, category, optional image, and answer input.
- **Result:** Shows whether the submitted answer was accepted, the correct answer, and the explanation.
- **Progress:** Shows total solved count and current streak.
- **History:** Shows previous attempts, user answers, correct answers, category, date, and correctness status.

## Components

The current implementation keeps UI rendering functions inside `App.tsx`:

- `renderHome`
- `renderResult`
- `renderProgress`
- `renderHistory`

This is a good first-product structure because it keeps the prototype easy to reason about. As the product grows, these can be extracted into components such as:

- `ChallengeCard`
- `AnswerForm`
- `ResultPanel`
- `ProgressStats`
- `HistoryList`
- `HistoryItem`

## Canvas System

A canvas system is not currently implemented.

The product does not use HTML canvas, whiteboarding, drawing, diagramming, or visual reasoning surfaces yet. If the challenge format expands into product design exercises, user journey mapping, estimation boards, or structured frameworks, a canvas layer could become valuable.

Potential future canvas use cases:

- Sketch a funnel or user journey before answering.
- Map assumptions, risks, and trade-offs for PM case prompts.
- Build a lightweight visual workspace for product strategy exercises.

## NLP and AI Routing

The app uses Gemini as an answer evaluator.

Current AI flow:

1. User submits an answer.
2. `handleSubmit` sends the challenge question, correct answer, explanation, and user's answer to Gemini.
3. Gemini is instructed to judge whether the user's answer matches the intent of the correct answer.
4. Gemini returns structured JSON with an `isCorrect` boolean.
5. If Gemini fails, the app falls back to a lowercase exact-match comparison.

Current model:

```ts
gemini-3.1-flash-lite-preview
```

The routing is intentionally narrow: AI does not generate the daily prompt, modify the question bank, or coach the user yet. It only evaluates answer intent.

## Hooks and Utilities

Built-in React hooks used:

- `useState` for view state, answer input, evaluation status, correctness, and progress.
- `useEffect` for syncing progress to `localStorage`.

Utility logic currently inside `App.tsx`:

- Daily question selection based on the number of days since Unix epoch.
- Streak calculation using today's and yesterday's ISO date.
- Local progress hydration from `localStorage`.
- Gemini response parsing.
- Exact-match fallback when AI evaluation fails.

Note: `useMemo` is imported but not currently used.

## Known Limitations

- No backend API layer; Gemini is called directly from the client.
- `GEMINI_API_KEY` is injected into frontend code through Vite, which is acceptable for an AI Studio-style prototype but not ideal for production.
- No authentication, account system, or cross-device sync.
- No RBAC or admin challenge-management workflow.
- No automated tests yet.
- No custom hook extraction yet; core app logic is concentrated in `App.tsx`.
- No formal `AppContext`; state is local to the root component.
- Daily reset logic uses ISO dates and can behave differently from a user's local timezone expectation.
- Challenge history is browser-local and can be lost if site data is cleared.
- The package name is still the default `react-example`.
- `motion` and `express` are installed but not currently used by the visible frontend implementation.

## Getting Started

```bash
git clone https://github.com/yatinbhalla/Daily-Thinking-Challenge.git
cd Daily-Thinking-Challenge
npm install
cp .env.example .env.local
npm run dev
```

Add your Gemini key to `.env.local`:

```env
GEMINI_API_KEY="your_gemini_api_key"
```

Then open the local Vite URL printed in the terminal.

Useful scripts:

```bash
npm run dev      # Start local development server
npm run build    # Build production assets
npm run preview  # Preview production build
npm run lint     # Run TypeScript checks
```

## Collaboration

This project is open to thoughtful collaboration.

Good first areas to improve:

- Extract reusable React components from `App.tsx`.
- Add a backend evaluation route to protect the Gemini API key.
- Introduce tests for streak logic, daily question selection, and AI fallback behavior.
- Add richer reflection prompts after each answer.
- Add account sync, public profiles, or mentor review workflows.
- Improve the question bank with harder PM, strategy, estimation, and product-design cases.

If you are a product manager, builder, recruiter, or engineer reviewing this project, I would love feedback on the product loop, interview-readiness, and how to make the learning experience more useful.

## Author

Yatin Bhalla &middot; Product Manager & AI Builder

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yatin%20Bhalla-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/yatinbhalla42)
[![Gmail](https://img.shields.io/badge/Gmail-yatinbhalla42%40gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:yatinbhalla42@gmail.com)
[![X](https://img.shields.io/badge/X-@yatinbhalla42-000000?logo=x&logoColor=white)](https://x.com/yatinbhalla42)
