import Login from "../../components/pages/Login";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Login />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticPaths, getStaticProps };
