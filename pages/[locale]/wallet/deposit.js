// import Wallet from "../components/pages/Wallet";
import Deposit from "../../../components/pages/Wallet/deposit";
import { getStaticPaths } from "$UTILS/lang/getStatic";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Deposit target={`Deposit`} />;

const getStaticProps = makeStaticProps(["common", "footer", "header"]);
export { getStaticPaths, getStaticProps };
