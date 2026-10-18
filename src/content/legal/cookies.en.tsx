import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function CookiesEn({ locale }: { locale: Locale }) {
  return (
    <LegalPage
      locale={locale}
      title="Cookie Policy"
      updated="2026-10-06"
      intro={<p>This website does not use tracking, advertising or analytics cookies. The only things stored in your browser are listed below — both are strictly necessary or purely functional, so no cookie banner is required.</p>}
    >
      <LegalSection title="What is stored in your browser">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Cookies and browser storage used by this website</caption>
            <thead className="bg-surface-2 text-fg">
              <tr>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Purpose</th>
                <th scope="col" className="px-4 py-3">Lifetime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <th scope="row" className="px-4 py-3 font-mono text-xs text-fg">ya_session</th>
                <td className="px-4 py-3">Cookie (first-party, HTTP-only)</td>
                <td className="px-4 py-3">Keeps the site owner signed in to the admin area. Only set after a successful owner login — never for visitors. Strictly necessary.</td>
                <td className="px-4 py-3">Up to 7 days, or until sign-out</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-mono text-xs text-fg">theme</th>
                <td className="px-4 py-3">Local storage (first-party)</td>
                <td className="px-4 py-3">Remembers whether you chose the light or dark theme. Stays on your device and is never sent to the server. Functional.</td>
                <td className="px-4 py-3">Until you clear your browser data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>No third-party cookies are set by this website. Fonts are served from this site itself, and there are no embedded trackers, maps or video players.</p>
      </LegalSection>

      <LegalSection title="How to control or delete them">
        <LegalList>
          <li>Theme: use the sun/moon button in the header at any time, or clear this site&apos;s data in your browser settings.</li>
          <li>All browsers let you view, block and delete cookies and site data in their privacy settings. Blocking <code>ya_session</code> does not affect visitors at all.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="If this changes">
        <p>If analytics or any other non-essential technology is ever added, you will be asked for consent first and this page will be updated. More about your data: <LocaleLink className={legalLink} href="/privacy">Privacy Policy</LocaleLink>.</p>
      </LegalSection>
    </LegalPage>
  );
}
