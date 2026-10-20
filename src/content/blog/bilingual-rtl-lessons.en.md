My portfolio started in English. Adding Persian meant more than translating buttons: Persian is written right to left, uses a different script, and expects its own numbers and dates. These are the lessons that mattered.

## Decide how the URLs work first

I chose the default language **without a prefix** (`/about`) and the other one with a prefix (`/fa/about`). Links that already exist keep working, and the default language is changed in a single line of one config file. A small piece of middleware rewrites unprefixed URLs to the default language internally.

## Use logical CSS, not left and right

In a right-to-left page, "left" is the wrong word. Use logical properties instead: `margin-inline-start`, `padding-inline-end`, `text-align: start`. In Tailwind that means `ms-*`, `pe-*`, `start-*` and `text-start` instead of `ml-*`, `pr-*`, `left-*` and `text-left`. The layout then mirrors itself.

Remember the small things too: arrows that mean "forward" or "back" must be mirrored, and toggles may need to flip.

## Two details that surprised me

1. **Letter-spacing breaks Persian.** Persian letters join each other. Adding `letter-spacing` pulls the letters apart and the words look broken. I disable tracking for Persian text entirely.
2. **Your Latin font has no Persian letters.** The browser falls back to a random system font. Pick a font with proper Persian support (I use Vazirmatn) and self-host it.

## Text you don't control

Names and messages typed by visitors can be in either direction. Add `dir="auto"` to those elements and the browser picks the direction from the first strong character.

## Numbers, dates and fallbacks

`Intl.NumberFormat` and `toLocaleDateString` with a Persian locale give Persian digits and the Persian calendar for free. And decide on a fallback: if a project has no Persian description yet, show the English one instead of an empty box. That lets you translate gradually.

## Tell search engines

Add `hreflang` links so search engines know the two versions belong together, and set the `lang` and `dir` attributes on `<html>` so screen readers choose the right voice.
