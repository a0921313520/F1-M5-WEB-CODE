import NotFound from '../components/pages/404';
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <NotFound />;

const getStaticProps = makeStaticProps(["common" ,"footer"]);
export { getStaticProps };
