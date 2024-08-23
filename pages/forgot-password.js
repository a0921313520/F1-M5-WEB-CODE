import ForgotPassword from "../components/pages/ForgotPassword";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <ForgotPassword />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticProps };
