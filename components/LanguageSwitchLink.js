import languageDetector from '../utils/lang/languageDetector'
import { useRouter } from 'next/router'
import Link from 'next/link'
import i18nextConfig from '../next-i18next.config'
import { useTranslation } from "next-i18next";

const LanguageSwitchLink = ({ locale, ...rest }) => {
    const router = useRouter()
    const defaultLocale = i18nextConfig.i18n.defaultLocale
    const { t } = useTranslation();
    
    let href = router.asPath
    let pName = router.pathname

    Object.keys(router.query).forEach((k) => {
        if (k === 'locale') {
            pName = pName.replace(`[${k}]`, locale)
            return
        }
        pName = pName.replace(`[${k}]`, router.query[k])
    })

    // 移除當前語言前綴（如果存在）
    href = href.replace(`/${router.query.locale}`, '')

    // 為非默認語言添加前綴
    if (locale !== defaultLocale) {
        href = `/${locale}${href}`
    }

    // 確保路徑開始於 "/"
    href = href.startsWith('/') ? href : `/${href}`

    const handleClick = (e) => {
        e.preventDefault()
        languageDetector.cache(locale)
        router.push(href, href, { locale })
    }

    return (
        <Link href={href} locale={locale}>
            <button className="text-3xl" onClick={handleClick}>
                {t("footer:changeLanguage")}：{locale}
            </button>
        </Link>
    );
};

export default LanguageSwitchLink