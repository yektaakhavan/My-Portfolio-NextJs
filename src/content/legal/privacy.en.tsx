import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function PrivacyEn({ locale, owner, mail }: { locale: Locale; owner: string; mail?: string }) {
  return (
    <LegalPage
      locale={locale}
      title="Privacy Policy"
      updated="2026-10-06"
      intro={<p>This page explains what personal data this website collects, why, how long it is kept, and what rights you have. The short version: no tracking, no ads, no analytics — only the data you choose to send through the forms.</p>}
    >
      <LegalSection title="1. Who is responsible">
        <p>
          The person responsible for this website and for the data described below is <strong>{owner}</strong>
          {mail ? <> — contact: <a className={legalLink} href={`mailto:${mail}`}>{mail}</a></> : null}.
        </p>
      </LegalSection>

      <LegalSection title="2. What data we process">
        <h3 className="font-semibold text-fg">Private contact form</h3>
        <LegalList>
          <li><strong>Data:</strong> name, email address, phone number (optional), your message, and a one-way hash of your IP address.</li>
          <li><strong>Purpose:</strong> to read and answer your request. The message is visible only to the site owner and is never published.</li>
          <li><strong>Legal basis:</strong> your consent (you tick a box before sending) and, where it leads to a contract, steps taken at your request.</li>
          <li><strong>Retention:</strong> until your request is handled, normally no longer than 12 months afterwards, unless a longer period is legally required.</li>
        </LegalList>
        <h3 className="pt-2 font-semibold text-fg">Public message form</h3>
        <LegalList>
          <li><strong>Data:</strong> your name and message (published only after the owner approves them), an optional email address (never published), and a one-way hash of your IP address.</li>
          <li><strong>Purpose:</strong> to show visitor messages on the <LocaleLink className={legalLink} href="/messages">Messages page</LocaleLink> after a manual review, and to prevent spam.</li>
          <li><strong>Legal basis:</strong> your consent, given by ticking the box beside the form. You can withdraw it at any time.</li>
          <li><strong>Retention:</strong> pending and rejected messages are deleted by the owner regularly. Approved messages stay online until you ask for their removal.</li>
        </LegalList>
        <h3 className="pt-2 font-semibold text-fg">Spam protection (both forms)</h3>
        <p>We never store your raw IP address. A salted, one-way hash of it is kept next to the message so that we can limit how many messages one connection can send per hour/day. It cannot be turned back into your IP address by the public. Legal basis: legitimate interest in keeping the site free of abuse.</p>
        <h3 className="pt-2 font-semibold text-fg">Server logs</h3>
        <p>Like every website, the server (or the hosting provider that runs it) may temporarily record technical data such as IP address, date/time, requested page and browser type to deliver the site and keep it secure.</p>
        <h3 className="pt-2 font-semibold text-fg">Owner sign-in</h3>
        <p>The owner area uses a session cookie after login. Visitors never receive it. See the <LocaleLink className={legalLink} href="/cookies">Cookie Policy</LocaleLink>.</p>
      </LegalSection>

      <LegalSection title="3. What we do NOT do">
        <LegalList>
          <li>No analytics, advertising or tracking cookies, and no social-media tracking pixels.</li>
          <li>No third-party fonts or CDNs: fonts are hosted on this website, so your browser does not contact Google or similar services just to display it.</li>
          <li>We never sell or rent your data.</li>
        </LegalList>
        <p>Note: if a project links to an image or a demo hosted elsewhere, your browser contacts that site only when you open or load it, and its own privacy policy applies.</p>
      </LegalSection>

      <LegalSection title="4. Who receives your data">
        <p>Only the site owner and the hosting / database provider that technically operates the website (as a processor bound by contract). Data is disclosed to authorities only if the law requires it.</p>
      </LegalSection>

      <LegalSection title="5. Your rights">
        <p>Depending on where you live (for example under the EU GDPR) you have the right to:</p>
        <LegalList>
          <li>access the data we hold about you and receive a copy,</li>
          <li>have wrong data corrected, and have your data erased or restricted,</li>
          <li>object to processing based on legitimate interest, and withdraw consent at any time (this does not affect earlier processing),</li>
          <li>data portability, and to lodge a complaint with your local data-protection authority.</li>
        </LegalList>
        <p>To use these rights — for example to remove an approved public message — {mail ? <>email <a className={legalLink} href={`mailto:${mail}`}>{mail}</a></> : <>use the <LocaleLink className={legalLink} href="/contact">contact form</LocaleLink></>}. Please mention the name and date used on the message.</p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>Messages are stored in a database that is not publicly accessible. The owner area is protected by a password, rate-limited sign-in and HTTP-only cookies. Public forms use spam protection and every public message is reviewed by hand before publication. No system is perfectly secure, but we keep the data we hold to the minimum.</p>
      </LegalSection>

      <LegalSection title="7. Children">
        <p>This website is not aimed at children under 16 and we do not knowingly collect their data. If you believe a child sent us personal data, contact us and we will delete it.</p>
      </LegalSection>

      <LegalSection title="8. Changes">
        <p>If the site changes in a way that affects your data (for example if analytics are added), this policy will be updated and — where required — your consent will be asked first. The date at the top shows the latest version.</p>
      </LegalSection>
    </LegalPage>
  );
}
