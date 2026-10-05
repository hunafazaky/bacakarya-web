# BacaKarya

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BacaKarya is a Nuxt + Vuetify reading and writing platform where users can publish literary works, build a personal bookshelf, explore new content, and manage their profile in a clean, book-focused interface.

---

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [✨ Core Features](#-core-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🧪 Available Scripts](#-available-scripts)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## About the Project

BacaKarya is a community-style reading platform built for writers and readers who want a focused place to publish works, organize reading lists, and discover recommendations. The app centers around user-authored stories and writing collections, with a warm editorial aesthetic and a mobile-friendly navigation flow.

The frontend connects to the BacaKarya API and supports user accounts, work publishing, category browsing, profile management, and reading interactions such as marking works as read or saving them to a bookshelf.

---

## ✨ Core Features

*   **User Authentication:** Register and log in with username-based accounts, with session restoration handled on load.
*   **Work Publishing:** Create and publish new works with a title, category list, cover image, optional attachment, and rich-text content editor.
*   **Reading Experience:** View individual works with reader-focused layout, metadata, and engagement actions.
*   **Bookshelf Management:** Save works to a personal bookshelf and remove them when needed.
*   **Explore and Discovery:** Browse recent works and category-based lists, with recommendations shown on the home screen.
*   **Profile Pages:** View user profiles, personal stats, and authored works in one place.
*   **Theme Toggle:** Switch between light and dark modes via a custom theme toggle.
*   **Responsive UI:** Built with Vuetify for desktop and mobile-friendly layouts, including a bottom navigation pattern for smaller screens.

---

## 🛠️ Tech Stack

*   **Framework:** Nuxt 4
*   **UI Library:** Vuetify
*   **Language:** TypeScript
*   **State Management:** Pinia
*   **Rich Text Editing:** Tiptap
*   **Styling:** SCSS + Vuetify theme configuration
*   **Package Manager:** Bun
*   **API Integration:** Nuxt runtime config + typed OpenAPI-generated interfaces

---

## 📁 Project Structure

```text
.
├── app/
│   ├── components/         # Reusable Vue components (cards, dialogs, editor, theme toggle)
│   ├── composables/       # Shared logic for API, work lists, theme, and utility behaviors
│   ├── layouts/           # App shell and auth layout
│   ├── middleware/        # Auth guard middleware
│   ├── pages/             # Route-based pages: home, explore, bookshelf, write, profile, read/edit work
│   ├── plugins/           # API bootstrap and session restoration
│   ├── stores/            # Pinia stores for auth, notifications, works, and backend status
│   ├── utils/             # Form helpers, category metadata, object URL handling, and work utilities
│   ├── app.vue            # App entry component
│   └── error.vue          # Error page
├── api-reference/         # OpenAPI spec for the backend API contract
├── public/                # Static public assets
├── shared/                # Shared TypeScript types generated from the API schema
├── .env.example           # Example runtime environment configuration
├── nuxt.config.ts         # Nuxt and Vuetify configuration
├── package.json           # Scripts and dependencies
├── LICENSE                # MIT license
├── README.md              # Project documentation
└── bun.lock               # Bun lockfile
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

*   Node.js 20+
*   Bun
*   A running BacaKarya API backend on `http://localhost:8080/api` (as expected by the frontend runtime config)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bacakarya-web.git
cd bacakarya-web
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

Copy the example environment file and adjust the API base if needed.

```bash
cp .env.example .env
```

Example contents:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8080/api
```

4. Start the application:

```bash
bun dev
```

The app should run locally in development mode, typically at:

```text
http://localhost:3000
```

If you want a production build instead:

```bash
bun build
```

---

## 🧪 Available Scripts

```bash
bun dev
bun build
bun generate
bun preview
bun lint
bun lint:fix
bun typecheck
bun postinstall
```

Common project commands:

*   `bun dev` — run the Nuxt development server
*   `bun build` — build the production bundle
*   `bun generate` — prerender static pages
*   `bun preview` — preview the built site locally
*   `bun lint` — run ESLint checks
*   `bun typecheck` — run TypeScript validation

---

## 🤝 Contributing

Contributions are welcome. If you want to improve the app, please follow the usual workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## 📄 License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---
