# Insighta Labs+: Intelligence Portal

A premium, glassmorphism-themed command center for non-technical analysts and system stakeholders. Built with React and Vite, this portal provides a visual interface for exploring the global intelligence network.

---

## 🔗 Live Demo

[View Live on Vercel](https://hng-be-stage3-insighta-react.vercel.app)

---

## 📸 Preview

> A state-of-the-art analytical portal featuring a fluid, responsive layout and high-security session management. Designed for rapid intelligence discovery, the portal bridges the gap between complex backend data and actionable human insights.

---

## ✅ Core Features

- **Glassmorphism UI** — Modern, semi-transparent design system with curated gradients and smooth transitions.
- **Intelligence Dashboard** — Real-time summary of network reach, geographic distribution, and recent activity metrics.
- **Unified Search Command** — A dedicated natural language input area for querying profiles using human phrasing.
- **Secure Identity Management** — Comprehensive Account page displaying system roles and session security metadata.
- **Session Protection** — Full integration with HttpOnly cookie-based authentication and CSRF mitigation.

---

## 🚧 Development Status & Upcoming Features

*Note: This portal is feature-complete for Stage 3 production launch.*

- [ ] **Interactive Map View** — Visualize profile distribution on a 3D globe.
- [ ] **Data Export Wizard** — Advanced UI for building custom CSV/JSON exports with visual filters.
- [ ] **Bulk Actions** — Enable admins to manage multiple profiles directly from the grid view.

---

## ♿ Accessibility Expectations Met

- **Semantic HTML** — Uses robust underlying structures including `<main>`, `<header>`, and `<nav>` for clear document mapping.
- **Keyboard Navigation** — All interactive elements are focusable, with modals trapping focus and cleanly exiting via the `Escape` key.
- **Color Contrast** — Strict adherence to WCAG AA guidelines across all glassmorphism layers and text components.
- **Form ARIA Labels** — All profile search and filter inputs are clearly labeled for screen reader compatibility.

---

## 🗂️ Architecture & Project Structure

```text
├── src
│   ├── api              # Axios client with interceptors for 401 handling
│   ├── components       # Modular UI blocks (Sidebar, ProtectedRoute, Layout)
│   ├── context          # AuthContext for global session broadcasting
│   ├── pages            # High-level views (Dashboard, Search, Profiles)
│   ├── styles           # Modular CSS files following a glassmorphism theme
│   └── App.jsx          # Secure routing and guard logic
├── public               # Static assets and icons
└── package.json         # Build scripts and Vite configuration
```

---

## 🛠️ Built With

- **Framework** — React 18 with Vite
- **Styling** — Vanilla CSS (Custom Glassmorphism Design System)
- **Icons** — Lucide React
- **Authentication** — HTTP-only Cookie-based JWT Flow

---

## 👤 Author

**Marvellous**  
GitHub: [@MARVER1X](https://github.com/MARVER1X)
