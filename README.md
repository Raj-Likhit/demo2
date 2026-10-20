# DevCatalyst Chrome Star

A Next.js + TypeScript starter featuring a Three.js chrome-star visual, a GSAP intro sequence, and a responsive editorial-style homepage.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Customize

- `components/ChromeStar.tsx` — procedural star geometry, chrome material, environment lighting, and rotation.
- `app/page.tsx` — homepage content and GSAP intro timeline.
- `app/globals.css` — colors, layout, typography, responsive styles, and animation support.
- `app/layout.tsx` — metadata and page shell.

## Intro behavior

The intro plays once per browser session. Refreshing or navigating back in the same session skips it. The intro is skipped when the browser requests reduced motion.

To test it again, open DevTools and run:

```js
sessionStorage.removeItem("devcatalyst-intro-played");
location.reload();
```

## Push to GitHub

Create an empty repository on GitHub, then run:

```bash
git init
git add .
git commit -m "Build DevCatalyst chrome star homepage"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository URL.

## Deploy to Vercel

Import the GitHub repository into Vercel. It detects Next.js automatically; no environment variables are required for this starter.

## Notes

- The star is procedurally created from a custom curved shape and beveled extrusion. It is a useful editable starting point; a fully domed custom mesh or Blender-made GLB can provide a more organic, inflated sculpture.
- Chrome needs a reflective environment to look metallic. The project uses the studio environment preset from Drei.
- Google Fonts is used for DM Sans; the system font stack is the fallback.
