A form is where a website asks something of a visitor. If a person using a keyboard or a screen reader can't get through it, they simply can't contact you. This is the checklist I now run on every form, including the contact form on this site.

## The checklist

1. **A real label for every field.** A `<label>` connected to its input. A placeholder is not a label: it disappears when you type and is often too faint to read.
2. **Say what's required.** Mark required fields visually *and* in text (`required`, plus "(required)" for screen readers). A red asterisk alone is not enough.
3. **Connect errors to their field.** Put `aria-invalid="true"` on the input and point `aria-describedby` at the error text, so the error is read together with the field.
4. **Announce the result.** Errors and the success message live in a region with `aria-live` (or `role="alert"`), otherwise a screen reader user hears nothing after pressing submit.
5. **Move focus on failure.** After a failed submit, focus the first invalid field. Don't leave keyboard users at the top of the page hunting for the problem.
6. **Buttons with a clear name.** "Send message" beats "Submit". In a list, "Delete project Coffee Listing" beats a column of identical "Delete" buttons.
7. **Use `autocomplete`.** `name`, `email` and `tel` let browsers fill the form for people who find typing hard.
8. **Check contrast and focus.** Text needs a 4.5:1 ratio against its background, and the focus outline must be clearly visible. Never remove it without a replacement.

## A small example

```tsx
<label htmlFor="email">Email address (required)</label>
<input
  id="email"
  type="email"
  autoComplete="email"
  required
  aria-invalid={error ? true : undefined}
  aria-describedby="email-error"
/>
<div id="email-error" aria-live="polite">{error}</div>
```

## How I check it in five minutes

- Put the mouse away and fill the whole form using only **Tab**, **Space** and **Enter**.
- Submit it empty and listen: is the first error announced? Is focus on the right field?
- Run an automated check such as axe-core. It catches missing labels and bad ARIA quickly, but it can't judge whether a label *makes sense*, so keep the manual pass.

Accessibility isn't a feature you add at the end. Each of these items takes minutes when you do it while building, and hours when you retrofit it.
