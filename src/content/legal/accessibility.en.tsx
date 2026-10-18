import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function AccessibilityEn({ locale }: { locale: Locale }) {
  return (
    <LegalPage
      locale={locale}
      title="Accessibility Statement"
      updated="2026-10-06"
      intro={<p>This website is designed to be usable by everyone, including people who use a keyboard, a screen reader, magnification or high-contrast settings. The target is WCAG 2.2 level AA.</p>}
    >
      <LegalSection title="What has been done">
        <LegalList>
          <li><strong>Keyboard:</strong> every link, button, form and dialog works without a mouse. A &quot;Skip to main content&quot; link appears when you press Tab, and the focus outline is always clearly visible.</li>
          <li><strong>Screen readers:</strong> proper landmarks and heading order, one level-1 heading per page, descriptive button and link names, labelled form fields with linked error messages, and announcements for form results.</li>
          <li><strong>Images:</strong> every meaningful image has alternative text; decorative graphics are hidden from assistive technology.</li>
          <li><strong>Colour &amp; contrast:</strong> text meets at least a 4.5:1 contrast ratio in both the light and the dark theme, and information is never conveyed by colour alone.</li>
          <li><strong>Themes &amp; motion:</strong> choose light or dark with the header button (your system setting is the default). Animations are switched off if your device asks for reduced motion.</li>
          <li><strong>Dialogs:</strong> pop-ups and the image viewer trap focus, close with Escape and return focus to where you were.</li>
          <li><strong>Zoom:</strong> the layout is responsive and works at 200% zoom and on small screens without horizontal scrolling.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Known limitations">
        <LegalList>
          <li>Screenshots of past projects can contain text that is not part of this site; their alternative text describes them briefly.</li>
          <li>Live demos and repositories linked from project pages are external and may not meet the same standard.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Feedback">
        <p>Found a barrier? Please tell me via the <LocaleLink className={legalLink} href="/contact">contact form</LocaleLink> — describe the page and what went wrong, and I will fix it as soon as possible.</p>
      </LegalSection>
    </LegalPage>
  );
}
