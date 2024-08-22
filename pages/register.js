import Register from "../components/pages/Register";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Register />;

const getStaticProps = makeStaticProps(["register"]);
export { getStaticProps };
