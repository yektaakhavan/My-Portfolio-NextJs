import { LegalList, LegalPage, LegalSection, legalLink } from "@/components/legal";
import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n";

export function TermsFa({ locale, owner }: { locale: Locale; owner: string }) {
  return (
    <LegalPage locale={locale} title="شرایط استفاده" updated="2026-10-06" intro={<p>با استفاده از این وب‌سایت با این قوانین ساده موافقت می‌کنید. هدف از آن‌ها امن، دوستانه و قانونی نگه داشتن سایت برای همه است.</p>}>
      <LegalSection title="۱. درباره‌ی محتوا">
        <p>محتوای نمونه‌کار (متن‌ها، طراحی‌ها، نمونه‌کدها، تصاویر) متعلق به {owner} است یا با اجازه استفاده شده است. می‌توانید به آن لینک بدهید و بخش‌های کوتاه را با ذکر منبع نقل کنید؛ برای کپی یا استفاده‌ی دوباره لطفاً ابتدا اجازه بگیرید.</p>
      </LegalSection>

      <LegalSection title="۲. پیام‌هایی که می‌فرستید">
        <LegalList>
          <li><strong>فرم تماس:</strong> خصوصی است. لطفاً رمز عبور، اطلاعات پرداخت یا سایر اطلاعات بسیار حساس نفرستید.</li>
          <li><strong>فرم پیام عمومی:</strong> پیام‌ها با دست بررسی می‌شوند و فقط در صورت تأیید منتشر می‌شوند. مالک سایت می‌تواند هر پیامی را در هر زمان و بدون ذکر دلیل ویرایش، رد یا حذف کند.</li>
        </LegalList>
        <p>وقتی پیام عمومی می‌فرستید تأیید می‌کنید که خودتان آن را نوشته‌اید، درست و بی‌آزار است، و اجازه می‌دهید همراه با نام و تاریخ در این سایت نمایش داده شود.</p>
      </LegalSection>

      <LegalSection title="۳. موارد ممنوع">
        <LegalList>
          <li>اسپم، تبلیغ، لینک‌سازی انبوه یا ارسال خودکار.</li>
          <li>سخنان نفرت‌آمیز، آزار، تهدید یا محتوای غیرقانونی یا ناقض حقوق دیگران.</li>
          <li>اطلاعات شخصی دیگران (شماره‌ی تلفن، آدرس، ایمیل) بدون اجازه‌ی آن‌ها.</li>
          <li>تلاش برای خراب کردن، از کار انداختن یا دسترسی غیرمجاز به وب‌سایت یا بخش مدیریت.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="۴. بدون تضمین">
        <p>سایت «همان‌طور که هست» ارائه می‌شود. تلاش می‌شود درست و در دسترس بماند، اما تضمینی برای عاری بودن از خطا یا همیشه آنلاین بودن وجود ندارد. لینک‌های بیرونی به سایت‌هایی می‌روند که خارج از کنترل مالک سایت‌اند.</p>
      </LegalSection>

      <LegalSection title="۵. داده‌های شما">
        <p>نحوه‌ی برخورد با داده‌های شخصی در <LocaleLink className={legalLink} href="/privacy">سیاست حریم خصوصی</LocaleLink> و <LocaleLink className={legalLink} href="/cookies">سیاست کوکی‌ها</LocaleLink> توضیح داده شده است.</p>
      </LegalSection>

      <LegalSection title="۶. سؤال دارید؟">
        <p>چیزی نامشخص است؟ از <LocaleLink className={legalLink} href="/contact">فرم تماس</LocaleLink> استفاده کنید.</p>
      </LegalSection>
    </LegalPage>
  );
}
