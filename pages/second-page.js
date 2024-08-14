import TestPage from '../components/pages/TestPage';
import { makeStaticProps } from "$UTILS/lang/makeStatic";

const LocalizedHome = () => <TestPage />;

export default LocalizedHome;

const getStaticProps = makeStaticProps(["common", "footer"]);
export { getStaticProps };