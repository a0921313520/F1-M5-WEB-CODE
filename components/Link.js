import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import i18nextConfig from "../next-i18next.config";

const LinkComponent = ({ children, skipLocaleHandling, ...rest }) => {
    const router = useRouter()
    const locale = rest.locale || router.query.locale || ''

    let href = rest.href || router.asPath
    if (href.indexOf('http') === 0) skipLocaleHandling = true
    if (locale && !skipLocaleHandling) {
        if (locale !== i18nextConfig.i18n.defaultLocale) {
            href = href ? `/${locale}${href}` : router.pathname.replace('[locale]', locale)
        } else {
            href = href.replace(`/${locale}`, '')
        }
    }

    return (
        <>
            <Link href={href}>
                <a {...rest}>{children}</a>
            </Link>
        </>
    )
}

export default LinkComponent;
