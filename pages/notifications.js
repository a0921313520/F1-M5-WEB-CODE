import Notifications from "@/pages/Notifications";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Notifications />;

const getStaticProps = makeStaticProps(["login"]);
export { getStaticProps };
