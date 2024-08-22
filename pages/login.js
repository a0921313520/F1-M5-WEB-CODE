import Login from "../components/pages/Login";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Login />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticProps };
