import Sports from "@/pages/Sports";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Sports />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticPaths, getStaticProps };
