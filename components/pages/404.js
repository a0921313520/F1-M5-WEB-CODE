import { useTranslation } from "next-i18next";
import Link from "../../components/Link";
import { useRouter } from "next/router";
import { getLocale } from '$UTILS/lang/getStatic'
import { useEffect } from 'react';
import Layout from "@/Layout";

const NotFound = () => {
    const router = useRouter();
    const { t } = useTranslation();
    
    useEffect(() => {
        if (router.asPath.startsWith('/hi') && router.asPath !== '/hi/404') {
            router.replace('/hi/404');
        }
    }, [router.asPath]);
    
    return (
        <Layout status={0}>
            <main>
                <div>
                    <Link href="/">
                        <button type="button">
                            is 404 bro <br />
                            {t("footer:WTF")}
                        </button>
                    </Link>
                </div>
            </main>
        </Layout>
    );
};

export default NotFound;
