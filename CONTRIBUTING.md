# Contributing to DevCatalyst Website

Thanks for your interest in improving the DevCatalyst website.

## Development workflow

1. Fork the repository and create a feature branch from `main`.
2. Use a focused branch name such as:
   - `feat/<short-description>`
   - `fix/<short-description>`
   - `docs/<short-description>`
3. Install dependencies and run the app locally:

```bash
npm install
npm run dev
```

## Coding guidelines

- Keep changes small and scoped to one concern.
- Follow the existing Next.js + TypeScript + Tailwind structure.
- Reuse existing components before introducing new patterns.
- Update documentation when behavior or contributor workflow changes.

## Commit guidance

- Use clear commit messages in imperative mood.
- Group related changes in a single commit.
- Avoid committing generated artifacts and local environment files.

## Pull request checklist

Before opening a PR, run:

```bash
npm run lint
npm run build
```

When submitting your PR:

- Describe the change and why it is needed.
- Link the related issue (for example `Closes #19`).
- Add screenshots for UI updates.
- Confirm lint and build passed locally.

## Reporting bugs and proposing improvements

Use the repository issue templates for:

- Bug reports
- Feature requests
- Enhancements
- Documentation improvements

For security vulnerabilities, please follow [SECURITY.md](SECURITY.md).
