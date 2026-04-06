# Heijo Studio Web — Claude Code Guide

## Project Overview

Portfolio/showcase website for Heijo Studio, a multi-disciplinary architecture and design firm. Built with Astro SSR, Tailwind CSS 4, and Keystatic as a Git-based headless CMS.

## Tech Stack

| Layer           | Tool                                                      |
| --------------- | --------------------------------------------------------- |
| Framework       | Astro 5 (SSR via Vercel adapter)                          |
| Styling         | Tailwind CSS 4 (Vite plugin — no separate config file)    |
| CMS             | Keystatic (local in dev, GitHub-backed in production)     |
| Content format  | Markdoc (`.md` extension)                                 |
| Interactivity   | React 19 (`.tsx` for interactive components)              |
| Type checking   | TypeScript 5 strict mode                                  |
| Linting         | Biome 2                                                   |
| Formatting      | Prettier (for `.astro` files; Biome handles `.ts`/`.tsx`) |
| Testing         | Vitest + Testing Library + happy-dom                      |
| Package manager | pnpm                                                      |
| Deployment      | Vercel                                                    |

## Commands

```bash
pnpm dev          # Start dev server on localhost:4321
pnpm build        # Production build to ./dist/
pnpm preview      # Preview the production build
pnpm check        # Biome check with auto-write
pnpm lint         # Biome lint with auto-fix
pnpm format       # Prettier format
pnpm typecheck    # Astro type checking
pnpm test         # Vitest test runner
```

## Path Aliases

All aliases resolve from `src/`:

```
@assets/*      → src/assets/*
@components/*  → src/components/*
@layouts/*     → src/layouts/*
@pages/*       → src/pages/*
@styles/*      → src/styles/*
@types/*       → src/types/*
@utils/*       → src/utils/*
@test/*        → src/test/*
```

Always use these aliases for imports — never use relative paths that traverse multiple directories.

## Keystatic CMS

Keystatic manages four content collections. All entries share the same schema.

### Collections

| Name                      | Path                                            | Image directory                                     |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| `architecture`            | `src/content/works/architecture/**`             | `src/assets/images/works/architecture/`             |
| `constructionEngineering` | `src/content/works/construction-engineering/**` | `src/assets/images/works/construction-engineering/` |
| `interior`                | `src/content/works/interior/**`                 | `src/assets/images/works/interior/`                 |
| `products`                | `src/content/works/products/**`                 | `src/assets/images/works/products/`                 |

### Entry Schema

```
title        — slug field (SEO-friendly)
tags         — string[]
thumbnail    — image (stored in @assets/images/works/[category]/)
gallery      — { image, alt }[]
size         — text
design       — text
construction — date string (YYYY-MM-DD)
location     — text
content      — Markdoc (.md extension)
```

### Storage modes

- **Development**: Local storage (files on disk)
- **Production**: GitHub mode (`Heijo-Studio/heijo-studio-web`, `content/` branch prefix)

## Project Structure

```
src/
├── assets/images/works/{category}/   # Keystatic-managed images
├── components/
│   ├── About/                        # About page section components
│   ├── Icons/                        # SVG icon components (.astro)
│   ├── ProjectDetails/               # Project detail page components
│   ├── Works/                        # Works listing components
│   ├── Footer.astro
│   ├── Hamburger.astro               # Mobile menu trigger
│   ├── Navbar.astro
│   ├── NavItem.astro
│   └── Logo.astro
├── content/works/{category}/         # Keystatic CMS content entries
├── layouts/
│   ├── MainLayout.astro              # Root layout (Navbar + Footer)
│   └── WorksLayout.astro             # Works pages layout with category nav
├── pages/
│   ├── index.astro                   # Home
│   ├── about.astro
│   └── works/
│       ├── index.astro               # All works
│       └── [category]/
│           ├── index.astro           # Category listing (dynamic)
│           └── [...slug].astro       # Project detail (dynamic)
├── styles/global.css                 # Tailwind + Google Fonts + CSS variables
├── types/project.ts                  # Shared TypeScript types
├── utils/collection.ts               # getAllCategories, getWorksByCategory, getWorkBySlug
└── constants.ts                      # NAV_ITEMS, SOCIAL_LINKS, CONTACT_EMAIL
```

## Coding Standards

### TypeScript

- Use `type` over `interface`
- Strict null checks are on — no implicit `any`
- Match Astro prop types to Keystatic field types (e.g. `construction` is a `string` date)

### Components

- **Astro** (`.astro`) for layouts and static UI
- **React** (`.tsx`) only for interactive components (galleries, filter bars)
- Use `<Image />` from `astro:assets` for all images — never raw `<img>` tags

### Styling

- Tailwind CSS 4 (imported via `@import 'tailwindcss'` in `global.css`)
- Minimalist/architectural aesthetic — clean, grid-aligned layouts
- Custom CSS variables: `--font-montserrat`, `--font-inter`, `--font-roboto`, `--color-light-gray: #7b7b83`, `--menu-width: 50vw`
- Typography plugin available via `@plugin '@tailwindcss/typography'`

### Logic and Control Flow

- Avoid nested ternaries — prefer a named function with clear `if` statements and early returns
- Keep conditional logic out of JSX/template expressions; compute values in the frontmatter or script block instead

### Biome (`.ts` / `.tsx`)

- Single quotes, trailing commas (all), semicolons always
- Indentation: tabs, width 2, line width 100
- Biome does **not** format `.astro` files — Prettier handles those

### Content Generation

When generating a new project entry, produce a directory with:

```
src/content/works/{category}/{slug}/
├── index.md        # Markdoc content
└── (frontmatter fields match schema above)
```

## Pre-commit Hooks (Husky + lint-staged)

On commit, lint-staged automatically runs:

- `astro check` on `.astro` files
- `biome lint` + `prettier --write` on `.ts`, `.tsx`, `.js`, `.astro` files

Do not bypass hooks with `--no-verify`.
