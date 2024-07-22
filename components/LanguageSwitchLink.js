import languageDetector from "../lib/languageDetector";
import { useRouter } from "next/router";
import Link from "next/link";

const LanguageSwitchLink = ({ locale, ...rest }) => {
    const router = useRouter();

    let href = rest.href || router.asPath;
    let pName = router.pathname;
    Object.keys(router.query).forEach((k) => {
        if (k === "locale") {
            pName = pName.replace(`[${k}]`, locale);
            return;
        }
        pName = pName.replace(`[${k}]`, router.query[k]);
    });
    if (locale) {
        href = rest.href ? `/${locale}${rest.href}` : pName;
    }

    return (
        <Link href={href} locale={locale}>
            <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => languageDetector.cache(locale)}
            >
                {locale}
            </a>
        </Link>
    );
};

export default LanguageSwitchLink;
