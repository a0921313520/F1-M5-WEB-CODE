import Register from "../../components/pages/Register";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Register />;

const getStaticProps = makeStaticProps(["register"]);
export { getStaticPaths, getStaticProps };
