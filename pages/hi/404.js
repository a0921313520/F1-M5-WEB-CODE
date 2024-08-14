import { useTranslation } from "next-i18next";
import { makeStaticProps } from "../../utils/lang/getStatic";

import Link from "../../components/Link";

const Homepage = () => {
    const { t } = useTranslation(["404", "common", "footer"]);

    return (
        <>
            <main>
                <div>
                    <Link href="/">
                        <button type="button">
                            {t("common:back-to-home")}
                        </button>
                    </Link>
                </div>
            </main>
        </>
    );
};

export default Homepage;

const getStaticProps = makeStaticProps(["404", "common", "footer"]);
export { getStaticProps };
