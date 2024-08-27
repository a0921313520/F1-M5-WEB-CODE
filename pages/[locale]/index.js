import HomePage from "../../components/pages/HomePage";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <HomePage />;

const getStaticProps = makeStaticProps(["common", "footer", "header"]);
export { getStaticPaths, getStaticProps };
