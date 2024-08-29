// import Wallet from "../components/pages/Wallet";
import Deposit from "../../components/pages/Wallet/Deposit";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

// export default () => <Wallet target={`Deposit`} />;
export default () => <Deposit target={`Deposit`} />;

const getStaticProps = makeStaticProps(["common", "footer", "header"]);
export { getStaticProps };
