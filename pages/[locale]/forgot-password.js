import ForgotPassword from "../../components/pages/ForgotPassword";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <ForgotPassword />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticPaths, getStaticProps };
