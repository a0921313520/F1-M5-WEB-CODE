// import { useTranslation } from "next-i18next";
import Link from "../../components/Link";

const Homepage = () => {
    const { t } = useTranslation(["404", "common", "footer"]);

    return (
        <>
            <main>
                <div>
                    <Link href="/">
                        <button type="button">404</button>
                    </Link>
                </div>
            </main>
        </>
    );
};

export default Homepage;

const getStaticProps = makeStaticProps(["404", "common", "footer"]);
export { getStaticPaths, getStaticProps };
