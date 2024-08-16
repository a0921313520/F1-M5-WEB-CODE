import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export function useLanguageSwitch() {
    const router = useRouter()
    const { i18n } = useTranslation()

    useEffect(() => {
        if (router.isReady) {
            const newLocale = router.query.locale || router.locale || 'en'
            if (i18n.language !== newLocale) {
                i18n.changeLanguage && i18n.changeLanguage(newLocale)
            }
        }
    }, [router.isReady, router.locale, router.query.locale, i18n])
}
