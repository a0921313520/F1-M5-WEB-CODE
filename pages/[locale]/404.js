import NotFound from '../../components/pages/404';
import { getStaticPaths, } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <NotFound />;

const getStaticProps = makeStaticProps(["common" ,"footer"]);
export { getStaticPaths, getStaticProps };