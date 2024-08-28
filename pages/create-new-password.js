import CreateNewPassword from "@/pages/CreateNewPassword";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <CreateNewPassword />;

const getStaticProps = makeStaticProps(["register"]);
export { getStaticProps };
