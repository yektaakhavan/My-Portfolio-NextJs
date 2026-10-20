When I rebuilt my portfolio, the first real decision wasn't a color or a font. It was *when* each page gets rendered. Next.js gives you three answers, and the one you pick decides how fast the site feels and how much work your server does.

## The three options

- **Static (SSG):** the page is built once, at build time, and served as a file. Fastest, but it only changes when you rebuild.
- **Dynamic (SSR):** the page is built on every request. Always fresh, but every visitor waits for your server and your database.
- **Incremental (ISR):** static pages that quietly rebuild after a time limit, or when you tell them to. Most of the speed of static, most of the freshness of dynamic.

## The one question I ask

*Does this page look different for different visitors?*

If yes (a dashboard, a cart, anything behind a login), render it dynamically. If no, make it static, and add revalidation if the content can change. A portfolio is almost entirely "no": every visitor sees the same projects, skills and articles, so nearly every page of mine is ISR with `revalidate = 3600`.

## Fresh on demand

An hour is far too long to wait after I fix a typo in the admin panel. So every save in the admin calls `revalidatePath`, and the affected pages rebuild on the next visit.

```ts
import { revalidatePath } from "next/cache";

// after saving in the admin panel
revalidatePath("/(site)/[locale]", "layout");
```

## The gotcha that cost me an afternoon

My first version used `revalidatePath("/[locale]", "layout")` and nothing happened: no error, no warning, the old page just kept being served. The path has to be the *real* route pattern of the layout, **including route-group folders** like `(site)`.

A second trap: setting `dynamicParams = false` on that segment made revalidated pages return a 404, because Next could no longer regenerate them.

## What I'd do again

1. Start static, and go dynamic only when a page truly differs per visitor.
2. Add on-demand revalidation from day one.
3. Always **test** revalidation: change something, save, reload. A call that silently does nothing looks exactly like a call that works.
