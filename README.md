# DevCatalyst Website

Official website for the DevCatalyst student community, built with Next.js, TypeScript, and Tailwind CSS.

## Overview

The site highlights DevCatalyst's mission, events, testimonials, and collaboration opportunities for students and industry partners.

## Features

- Landing page with animated sections and responsive layout
- Event gallery pages and media-driven storytelling
- Testimonials overview and detailed testimonial route (`/testimonials/[slug]`)
- Partner collaboration page (`/partner-with-devcatalyst`)
- Contact section with client-side validation

## Tech stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui primitives
- Motion and Three.js ecosystem components for UI/visual interactions

## Project structure

```text
app/                  # Routes and page entry points
components/           # Shared UI and section components
lib/                  # Utility functions
public/               # Static assets (event gallery, logos, testimonials)
appscript/            # Optional Google Apps Script integration files
```

## Getting started

### Prerequisites

- Node.js 20.9+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment configuration

Copy the example file and adjust values if you plan to wire the contact form backend:

```bash
cp .env.example .env.local
```

Current environment key:

- `NEXT_PUBLIC_CONTACT_SCRIPT_URL`: reserved for future contact form integration (the current form validates input but does not submit data).

## Validation and quality checks

Run before opening a pull request:

```bash
npm run lint
npm run build
```

## Deployment

Deploy on Vercel as a standard Next.js app:

1. Import this repository in Vercel.
2. Set environment variables only if backend integrations are enabled.
3. Trigger deployment from `main`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening issues or pull requests.

## Documentation and community files

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Changelog](CHANGELOG.md)

## Copyright and licensing

Copyright (c) 2026 DevCatalyst.

DevCatalyst has not selected a project license yet. Licensing terms will be documented once confirmed by the team.

For licensing questions, email [contact@devcatalyst.in](mailto:contact@devcatalyst.in?cc=devcatalyst.2025%40gmail.com) and CC **devcatalyst.2025@gmail.com**.
