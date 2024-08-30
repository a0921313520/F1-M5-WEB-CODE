import Sports from "@/pages/Sports";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Sports />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticProps };
