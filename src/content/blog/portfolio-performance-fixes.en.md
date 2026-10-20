A portfolio is the one website you can't afford to have feel slow. I went through mine looking for what really mattered, and these five changes made the biggest difference.

## 1. Render on the server instead of fetching in the browser

My pages first loaded, then JavaScript ran, then it fetched the content from an API, and only then did the screen fill in. Moving the data fetching into server components meant the HTML arrives already complete, with no loading spinner and no waterfall of requests.

## 2. Shrink the images

A screenshot straight from a phone or a screen capture can be several megabytes. Every upload on my site is now converted to WebP and saved in two sizes. A 2.4 MB image became about 110 KB, and the browser picks the smaller version on small screens with `srcset`.

## 3. Lazy-load what's below the fold

Images further down the page get `loading="lazy"` and `decoding="async"`, so they don't compete with what the visitor sees first.

## 4. Host fonts yourself

Fonts from a third-party service add another connection before text can appear, and they send your visitors' IP addresses to someone else. Self-hosted fonts start faster and are simpler to explain in a privacy policy.

## 5. Reserve space so nothing jumps

Give images and cards a fixed size or aspect ratio before they load. Without it the page shifts while loading, which hurts both the experience and the Core Web Vitals score.

## Measure the real thing

A development server is much slower than production. Always measure with a production build, and measure on a throttled connection, not only on your fast laptop.

```bash
npm run build
npm start
```

Performance work is mostly about removing things: fewer requests, fewer bytes, fewer surprises.
