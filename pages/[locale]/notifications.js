import Notifications from "@/pages/Notifications";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Notifications />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticPaths, getStaticProps };
