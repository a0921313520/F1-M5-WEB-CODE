import CreateNewPassword from "@/pages/CreateNewPassword";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <CreateNewPassword />;

const getStaticProps = makeStaticProps(["register"]);
export { getStaticPaths, getStaticProps };
