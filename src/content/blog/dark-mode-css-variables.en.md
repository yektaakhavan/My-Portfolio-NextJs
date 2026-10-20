Dark mode looks like a toggle, but most of the work is in how you name your colors. Here is the setup I use, and the two details that make it feel polished: no flash on load, and readable contrast in both themes.

## Name colors by role, not by shade

Instead of `gray-900` or `purple-500`, define colors by what they are *for*: `canvas` for the page background, `surface` for cards, `fg` for text, `muted` for secondary text, `accent` for links and buttons. Each role gets a value per theme:

```css
:root,
:root[data-theme="dark"] {
  --c-canvas: #140d24;
  --c-fg: #f3eefb;
}
:root[data-theme="light"] {
  --c-canvas: #faf7ff;
  --c-fg: #1c1430;
}
```

With Tailwind v4 you expose those variables as utilities once (`bg-canvas`, `text-fg`), and every component works in both themes without a single `dark:` prefix.

## Respect the system, remember the choice

The first visit should follow the operating system (`prefers-color-scheme`). After a visitor clicks the toggle, their choice wins and is saved in `localStorage`.

## The flash problem

If the theme is applied after React loads, dark-mode visitors see a white flash first. The fix is a tiny inline script in `<head>` that runs before the first paint:

```js
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") {
      t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
```

## Don't forget contrast

A palette that looks good in dark mode can fail in light mode. Colors that work as a *fill* are often too pale as *text*. I check every text and background pair in both themes against the WCAG ratios (4.5:1 for text, 3:1 for interface elements) with a small script, before I trust my eyes.

## Quick checklist

- Colors named by role, one value per theme
- Default from the system, choice remembered
- Inline script before the first paint
- The toggle is a real button whose label says what it will do ("Switch to light theme")
- Contrast checked in both themes
