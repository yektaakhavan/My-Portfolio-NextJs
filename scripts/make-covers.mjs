/**
 * Generates the blog cover images (illustrations drawn in code — no stock photos, no external requests).
 *   node scripts/make-covers.mjs
 * Output: public/images/blog/<slug>-1600.webp and -640.webp
 * Replace any cover later from Admin → Articles (drag & drop a photo or your own design).
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const W = 1600, H = 900;
const out = path.join(process.cwd(), "public/images/blog");

const frame = (id, c1, c2, glow, body) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="gl-${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${glow}" stop-opacity="0.55"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
    <pattern id="grid-${id}" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#fff" stroke-opacity="0.045" stroke-width="2"/></pattern>
    <filter id="sh-${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  <circle cx="1250" cy="170" r="520" fill="url(#gl-${id})"/>
  <circle cx="260" cy="760" r="420" fill="url(#gl-${id})" opacity="0.7"/>
  ${body}
</svg>`;

const lines = (x, y, ws, color, op = 0.9, h = 16, gap = 34, right = false, total = 0) =>
  ws.map((w, i) => `<rect x="${right ? x + total - w : x}" y="${y + i * gap}" width="${w}" height="${h}" rx="${h / 2}" fill="${color}" opacity="${op}"/>`).join("");

const covers = {
  /* three pages: static / ISR / dynamic */
  "nextjs-rendering-strategies": frame("a", "#312e81", "#0b1022", "#818cf8", (() => {
    const card = (x, stroke, dash, content) => `
      <g filter="url(#sh-a)"><rect x="${x}" y="230" width="380" height="440" rx="28" fill="#fff" fill-opacity="0.07" stroke="${stroke}" stroke-width="5" ${dash ? 'stroke-dasharray="22 16"' : ""}/></g>
      <rect x="${x + 36}" y="266" width="${dash === 2 ? 200 : 150}" height="26" rx="13" fill="${stroke}"/>${content}`;
    return `
    ${card(150, "#a5b4fc", false, lines(186, 330, [300, 250, 280, 190, 260, 220], "#c7d2fe", 0.75))}
    ${card(610, "#fbbf24", true, lines(646, 330, [300, 250, 280, 190], "#fde68a", 0.8) + `
      <g transform="translate(790 560)" fill="none" stroke="#fbbf24" stroke-width="12" stroke-linecap="round"><path d="M-60 0a60 60 0 1 1 22 46"/><path d="M-84 -26L-60 0 -30 -14" /></g>`)}
    ${card(1070, "#34d399", false, lines(1106, 330, [300, 220, 260], "#a7f3d0", 0.8) + `
      <path d="M1290 470 1226 566h58l-28 96 100-128h-62l30-64z" fill="#34d399"/>`)}
    <g fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="6" stroke-linecap="round"><path d="M548 450h44M572 432l20 18-20 18"/><path d="M1008 450h44M1032 432l20 18-20 18"/></g>`;
  })()),

  /* accessible form: focus ring, error, keyboard */
  "accessible-forms-checklist": frame("b", "#0f766e", "#04201f", "#2dd4bf", `
    <g filter="url(#sh-b)"><rect x="380" y="120" width="840" height="660" rx="36" fill="#fff" fill-opacity="0.08" stroke="#5eead4" stroke-opacity="0.5" stroke-width="3"/></g>
    ${lines(450, 180, [190], "#99f6e4", 0.95, 18)}
    <rect x="440" y="226" width="720" height="92" rx="20" fill="#042f2e" stroke="#5eead4" stroke-width="8"/>
    <rect x="426" y="212" width="748" height="120" rx="30" fill="none" stroke="#5eead4" stroke-opacity="0.45" stroke-width="5"/>
    ${lines(480, 262, [300], "#ccfbf1", 0.9, 20)}
    <rect x="780" y="252" width="6" height="40" rx="3" fill="#5eead4"/>
    ${lines(450, 380, [150], "#99f6e4", 0.95, 18)}
    <rect x="440" y="426" width="720" height="92" rx="20" fill="#2a0a14" stroke="#fb7185" stroke-width="7"/>
    ${lines(480, 462, [250], "#fecdd3", 0.85, 20)}
    <g transform="translate(450 552)"><circle cx="22" cy="22" r="22" fill="#fb7185"/><rect x="19" y="10" width="6" height="16" rx="3" fill="#2a0a14"/><circle cx="22" cy="33" r="3.6" fill="#2a0a14"/></g>
    ${lines(512, 565, [340], "#fecdd3", 0.9, 16)}
    <rect x="440" y="640" width="280" height="84" rx="42" fill="#5eead4"/>
    <path d="M520 684l26 26 56-60" fill="none" stroke="#042f2e" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1290 300)"><rect width="190" height="190" rx="30" fill="#fff" fill-opacity="0.1" stroke="#fff" stroke-opacity="0.6" stroke-width="5"/><path d="M52 95h72M100 70l30 25-30 25M44 58v74" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`),

  /* dark mode: split circle */
  "dark-mode-css-variables": frame("c", "#1e1b4b", "#020617", "#f59e0b", (() => {
    const rays = Array.from({ length: 12 }, (_, i) => { const a = (Math.PI / 2) + (i / 11) * Math.PI; return `<line x1="${800 + Math.cos(a) * 300}" y1="${450 + Math.sin(a) * 300}" x2="${800 + Math.cos(a) * 360}" y2="${450 + Math.sin(a) * 360}" stroke="#fcd34d" stroke-width="12" stroke-linecap="round"/>`; }).join("");
    const stars = [[1020, 300, 9], [1120, 400, 6], [1000, 520, 7], [1110, 600, 10], [940, 380, 5], [1180, 500, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e0e7ff"/>`).join("");
    return `
    <clipPath id="left"><rect x="0" y="0" width="800" height="900"/></clipPath>
    <clipPath id="right"><rect x="800" y="0" width="800" height="900"/></clipPath>
    <g filter="url(#sh-c)"><circle cx="800" cy="450" r="250" fill="#fde68a" clip-path="url(#left)"/><circle cx="800" cy="450" r="250" fill="#0b1226" clip-path="url(#right)" stroke="#6366f1" stroke-width="5"/></g>
    <g clip-path="url(#left)">${rays}</g>${stars}
    <path d="M980 360a120 120 0 1 0 60 150 100 100 0 0 1-60-150z" fill="#c7d2fe" opacity="0.9"/>
    <line x1="800" y1="170" x2="800" y2="730" stroke="#fff" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="10 12"/>`;
  })()),

  /* drag & drop list */
  "accessible-drag-and-drop": frame("d", "#9d174d", "#2a0a1f", "#f472b6", (() => {
    const row = (y, op, stroke) => `<rect x="420" y="${y}" width="760" height="104" rx="26" fill="#fff" fill-opacity="${op}" stroke="${stroke}" stroke-width="4"/>
      ${[0, 1, 2].flatMap((r) => [0, 1].map((c) => `<circle cx="${470 + c * 18}" cy="${y + 34 + r * 18}" r="5" fill="#f9a8d4"/>`)).join("")}
      ${lines(540, y + 34, [300, 190], "#fbcfe8", 0.85, 16, 28)}<rect x="1090" y="${y + 30}" width="60" height="44" rx="22" fill="#f9a8d4" opacity="0.55"/>`;
    return `
    ${row(150, 0.06, "#f9a8d4")}
    <rect x="420" y="274" width="760" height="104" rx="26" fill="none" stroke="#f9a8d4" stroke-width="4" stroke-dasharray="16 14" opacity="0.7"/>
    <g filter="url(#sh-d)" transform="translate(44 -22)">${row(274, 0.22, "#fff")}</g>
    ${row(402, 0.06, "#f9a8d4")}${row(530, 0.06, "#f9a8d4")}
    <g transform="translate(1290 640)"><rect width="260" height="110" rx="26" fill="#fff" fill-opacity="0.12" stroke="#fff" stroke-opacity="0.65" stroke-width="5"/><rect x="40" y="38" width="180" height="34" rx="12" fill="#fff" fill-opacity="0.85"/></g>
    <g fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(1340 360)"><path d="M70 0v110M30 40l40-40 40 40M30 70l40 40 40-40"/></g>`;
  })()),

  /* bilingual / RTL */
  "bilingual-rtl-lessons": frame("e", "#5b21b6", "#14103a", "#a78bfa", (() => {
    const card = (x, right, accent, ws) => `<g filter="url(#sh-e)"><rect x="${x}" y="190" width="560" height="520" rx="34" fill="#fff" fill-opacity="0.08" stroke="${accent}" stroke-opacity="0.8" stroke-width="4"/></g>
      <circle cx="${right ? x + 500 : x + 60}" cy="250" r="26" fill="${accent}"/>
      ${lines(right ? x + 40 : x + 40, 320, ws, "#ddd6fe", 0.85, 18, 46, right, 480)}
      <rect x="${right ? x + 40 : x + 330}" y="620" width="190" height="46" rx="23" fill="${accent}"/>`;
    return `${card(160, false, "#c4b5fd", [440, 360, 400, 300, 420, 240])}${card(880, true, "#67e8f9", [440, 360, 400, 300, 420, 240])}
    <g fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"><path d="M742 420h116M776 386l-34 34 34 34M824 386l34 34-34 34"/></g>
    <circle cx="800" cy="420" r="62" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="6 10"/>`;
  })()),

  /* performance */
  "portfolio-performance-fixes": frame("f", "#065f46", "#03211a", "#34d399", (() => {
    const arc = (r, a0, a1) => { const p = (a) => [800 + r * Math.cos(a), 470 + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`; };
    const needleA = Math.PI * 1.88;
    const nx = 800 + 210 * Math.cos(needleA), ny = 470 + 210 * Math.sin(needleA);
    return `
    <g filter="url(#sh-f)"><path d="${arc(300, Math.PI * 0.8, Math.PI * 2.2)}" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="54" stroke-linecap="round"/></g>
    <path d="${arc(300, Math.PI * 0.8, Math.PI * 1.92)}" fill="none" stroke="#34d399" stroke-width="54" stroke-linecap="round"/>
    <path d="${arc(300, Math.PI * 0.8, Math.PI * 1.1)}" fill="none" stroke="#fbbf24" stroke-width="54" stroke-linecap="round" opacity="0.0"/>
    <line x1="800" y1="470" x2="${nx}" y2="${ny}" stroke="#ecfdf5" stroke-width="16" stroke-linecap="round"/><circle cx="800" cy="470" r="34" fill="#ecfdf5"/><circle cx="800" cy="470" r="14" fill="#065f46"/>
    <g transform="translate(250 470)">
      <rect x="0" y="0" width="130" height="320" rx="22" fill="#fb7185" opacity="0.55"/>
      <rect x="210" y="284" width="130" height="36" rx="16" fill="#34d399"/>
      <path d="M150 120C190 120 205 190 240 262" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 18" opacity="0.9"/>
      <path d="M214 240l28 28 22-34" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>
    <path d="M1250 380 1176 500h66l-30 110 120-146h-70l34-84z" fill="#fde68a"/>`;
  })()),
};

await mkdir(out, { recursive: true });
for (const [slug, svg] of Object.entries(covers)) {
  const img = sharp(Buffer.from(svg));
  await img.clone().resize(1600, 900).webp({ quality: 84 }).toFile(path.join(out, `${slug}-1600.webp`));
  await img.clone().resize(640, 360).webp({ quality: 80 }).toFile(path.join(out, `${slug}-640.webp`));
  console.log("cover:", slug);
}
// preview sheet (not shipped) for a quick visual check
const sheet = await Promise.all(Object.keys(covers).map((s) => sharp(path.join(out, `${s}-640.webp`)).png().toBuffer()));
await sharp({ create: { width: 1920, height: 720, channels: 3, background: "#111" } })
  .composite(sheet.map((b, i) => ({ input: b, left: (i % 3) * 640, top: Math.floor(i / 3) * 360 })))
  .png().toFile("/tmp/covers-sheet.png");
