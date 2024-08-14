import HomePage from '../components/pages/HomePage';
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <HomePage />;

const getStaticProps = makeStaticProps(["common", "footer"]);
export { getStaticProps };
