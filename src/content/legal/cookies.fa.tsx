import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function CookiesFa({ locale }: { locale: Locale }) {
  return (
    <LegalPage
      locale={locale}
      title="سیاست کوکی‌ها"
      updated="2026-10-06"
      intro={<p>این وب‌سایت از کوکی‌های ردیابی، تبلیغاتی یا تحلیلی استفاده نمی‌کند. تنها چیزهایی که در مرورگر شما ذخیره می‌شود در زیر آمده است — هر دو یا ضروری‌اند یا صرفاً کارکردی، پس به بنر کوکی نیازی نیست.</p>}
    >
      <LegalSection title="چه چیزی در مرورگر شما ذخیره می‌شود">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[34rem] text-start text-sm">
            <caption className="sr-only">کوکی‌ها و ذخیره‌سازی مرورگر که این وب‌سایت استفاده می‌کند</caption>
            <thead className="bg-surface-2 text-fg">
              <tr>
                <th scope="col" className="px-4 py-3 text-start">نام</th>
                <th scope="col" className="px-4 py-3 text-start">نوع</th>
                <th scope="col" className="px-4 py-3 text-start">هدف</th>
                <th scope="col" className="px-4 py-3 text-start">مدت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <th scope="row" dir="ltr" className="px-4 py-3 text-start font-mono text-xs text-fg">ya_session</th>
                <td className="px-4 py-3">کوکی (اول‌شخص، HTTP-only)</td>
                <td className="px-4 py-3">مالک سایت را در بخش مدیریت وارد نگه می‌دارد. فقط پس از ورود موفق مالک ساخته می‌شود — هرگز برای بازدیدکنندگان. کاملاً ضروری.</td>
                <td className="px-4 py-3">حداکثر ۷ روز، یا تا زمان خروج</td>
              </tr>
              <tr>
                <th scope="row" dir="ltr" className="px-4 py-3 text-start font-mono text-xs text-fg">theme</th>
                <td className="px-4 py-3">حافظه‌ی محلی (اول‌شخص)</td>
                <td className="px-4 py-3">به خاطر می‌سپارد حالت روشن یا تیره را انتخاب کرده‌اید. روی دستگاه شما می‌ماند و هرگز به سرور فرستاده نمی‌شود. کارکردی.</td>
                <td className="px-4 py-3">تا زمانی که داده‌های مرورگر را پاک کنید</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="شخص ثالث">
        <p>این وب‌سایت هیچ کوکی شخص ثالثی ایجاد نمی‌کند. فونت‌ها از خود همین سایت ارائه می‌شوند و ردیاب، نقشه یا ویدیوپلیر تعبیه‌شده‌ای وجود ندارد.</p>
      </LegalSection>

      <LegalSection title="چگونه کنترل یا حذفشان کنم؟">
        <LegalList>
          <li>تم: هر زمان از دکمه‌ی خورشید/ماه در سربرگ استفاده کنید، یا داده‌های این سایت را در تنظیمات مرورگر پاک کنید.</li>
          <li>همه‌ی مرورگرها اجازه می‌دهند کوکی‌ها و داده‌های سایت را در تنظیمات حریم خصوصی ببینید، مسدود کنید و حذف کنید. مسدود کردن <code dir="ltr">ya_session</code> روی بازدیدکنندگان اصلاً اثری ندارد.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="اگر این تغییر کند">
        <p>اگر روزی آنالیتیکس یا فناوری غیرضروری دیگری اضافه شود، ابتدا رضایت شما پرسیده و این صفحه به‌روز می‌شود. اطلاعات بیشتر درباره‌ی داده‌های شما: <LocaleLink className={legalLink} href="/privacy">سیاست حریم خصوصی</LocaleLink>.</p>
      </LegalSection>
    </LegalPage>
  );
}
