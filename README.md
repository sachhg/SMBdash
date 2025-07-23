Financial Intelligence Dashboard for SMBs

Designed to empower small-medium businesses to understand their financials, and get ML recommendations for how to optimize spending and maximize profits.
---

## 🚀 Tech Stack

- **Frontend Framework:** [React 18](https://react.dev/) (with [TypeScript](https://www.typescriptlang.org/))
- **Build Tool:** [Vite](https://vitejs.dev/) (with [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) for fast builds)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) primitives, [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (customized for a financial dashboard design system)
- **State/Data:** [@tanstack/react-query](https://tanstack.com/query/latest) for async state, custom mock API service for demo data
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Notifications:** [sonner](https://sonner.emilkowal.ski/) and custom toast system
- **Testing/Linting:** ESLint, TypeScript strictness (configurable)
- **Deployment:** [Vercel](https://vercel.com/) (SPA rewrites via `vercel.json`)

---

## 🧩 Architecture & Features

### Modular, Scalable Structure
- **Atomic component design:** UI primitives (Button, Card, Badge, etc.) are reusable and themeable.
- **Layout system:** Responsive sidebar, header, and main content area using composition.
- **Page-based routing:** Each major feature is a route (`/`, `/roi`, `/recommendations`, `/benchmarks`).

### Dashboard Features
- **Account Connections:** Simulated integration with Stripe, Shopify, Meta Ads, and QuickBooks.
- **Metrics Overview:** Real-time (mocked) KPIs for transactions and campaigns.
- **Spend Analytics:** Interactive charts and quick insights for financial activity.
- **ROI Analysis:** Campaign performance breakdown with ROI, spend, revenue, and optimization suggestions.
- **AI Recommendations:** Smart, actionable nudges for capital allocation and cost savings, with accept/ignore flows.
- **Industry Benchmarks:** Peer comparison, trend analytics, and visualizations for key spend categories.
- **404 Handling:** Custom not-found page for unmatched routes.

### Developer Experience
- **Type-safe throughout:** All business logic and UI components are strongly typed.
- **Path aliases:** Clean imports via `@/` alias (configured in Vite and TypeScript).
- **Mock API layer:** Easily swappable for real API integration.
- **Custom theming:** Tailwind config and CSS variables for easy brand adaptation.
- **Accessible UI:** Built on Radix primitives for keyboard and screen reader support.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+ recommended
- pnpm, yarn, or npm

### Installation
```sh
git clone <your-repo-url>
cd <project-folder>
npm install
```

### Development
```sh
npm run dev
```
- Runs the app locally at [http://localhost:8080](http://localhost:8080) (or as configured).

### Production Build
```sh
npm run build
npm run preview
```
- Builds to `/dist` and serves a production preview.

### Linting
```sh
npm run lint
```

---

## 🏗️ Deployment

- **Vercel:** Out-of-the-box support for Vite. SPA routing is enabled via `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Output directory:** `dist`
- **Build command:** `vite build`

---

## 📁 Project Structure

```
src/
  components/    # UI primitives, layout, dashboard widgets
  pages/         # Route-based pages (Index, ROI, Recommendations, Benchmarks, NotFound)
  services/      # Mock API service (easy to swap for real backend)
  hooks/         # Custom React hooks
  lib/           # Utility functions
  index.css      # Tailwind and design system
  App.tsx        # Main app shell and routing
  main.tsx       # Entry point
```

---

## 🧑‍💻 Technical Highlights

- **Modern React patterns:** Hooks, context, composition, and suspense-ready data fetching.
- **Component-driven:** All UI is built from composable, themeable primitives.
- **Mocked data:** No real financial data is used; all data is generated for demo purposes.
- **Responsive and accessible:** Works across devices and supports keyboard navigation.
- **Easy to extend:** Add new integrations, analytics, or UI modules with minimal friction.

---

## 📣 For Recruiters & Engineers

- **Demonstrates:** Modern React, TypeScript, scalable architecture, and UI/UX best practices.
- **Ready for:** Real API integration, authentication, multi-tenant support, and further productization.
- **Code quality:** Clean, maintainable, and idiomatic codebase with a focus on developer experience.

---

## 📝 License

This project is for demonstration and evaluation purposes.
