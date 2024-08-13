// import { useTranslation } from "next-i18next";
import Link from "../components/Link";

const Homepage = () => {
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
