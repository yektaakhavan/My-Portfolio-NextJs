import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function TermsEn({ locale, owner }: { locale: Locale; owner: string }) {
  return (
    <LegalPage locale={locale} title="Terms of Use" updated="2026-10-06" intro={<p>By using this website you agree to these simple rules. They exist to keep the site safe, friendly and legal for everyone.</p>}>
      <LegalSection title="1. About the content">
        <p>The portfolio content (texts, designs, code samples, screenshots) belongs to {owner} or is used with permission. You may link to it and quote short parts with credit; please ask before copying or reusing it.</p>
      </LegalSection>

      <LegalSection title="2. Messages you send">
        <LegalList>
          <li><strong>Contact form:</strong> private. Please don&apos;t send passwords, payment data or other highly sensitive information.</li>
          <li><strong>Public message form:</strong> messages are reviewed by hand and published only if approved. The owner may edit, reject or remove any message at any time, without giving a reason.</li>
        </LegalList>
        <p>When you submit a public message you confirm that you wrote it, that it is truthful and not harmful, and you allow it to be displayed on this site together with your name and the date.</p>
      </LegalSection>

      <LegalSection title="3. Not allowed">
        <LegalList>
          <li>Spam, advertising, link farming or automated submissions.</li>
          <li>Hate speech, harassment, threats, or content that is illegal or violates someone&apos;s rights.</li>
          <li>Other people&apos;s personal data (phone numbers, addresses, emails) without their permission.</li>
          <li>Trying to break, overload or gain unauthorised access to the website or the owner area.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. No guarantees">
        <p>The site is provided &quot;as is&quot;. Care is taken to keep it correct and available, but there is no guarantee that it is free of errors or always online. External links lead to sites that are outside the owner&apos;s control.</p>
      </LegalSection>

      <LegalSection title="5. Your data">
        <p>How personal data is handled is described in the <LocaleLink className={legalLink} href="/privacy">Privacy Policy</LocaleLink> and the <LocaleLink className={legalLink} href="/cookies">Cookie Policy</LocaleLink>.</p>
      </LegalSection>

      <LegalSection title="6. Questions">
        <p>Anything unclear? Use the <LocaleLink className={legalLink} href="/contact">contact form</LocaleLink>.</p>
      </LegalSection>
    </LegalPage>
  );
}
