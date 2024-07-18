import React from "react";
import dynamic from "next/dynamic";
import { translate } from "$ACTIONS/Translate";

const DynamicUserInfo = dynamic(import("./UserInfo"), {
    loading: () => "",
    ssr: false,
});
const DynamicUpdatePassword = dynamic(import("./UpdatePassword"), {
    loading: () => "",
    ssr: false,
});
const DynamicAccountInfo = dynamic(import("./AccountInfo"), {
    loading: () => "",
    ssr: false,
});
const DynamicOther = dynamic(import("./Other"), {
    loading: () => "",
    ssr: true,
});

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // this.props.setLoading(false);
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("profile");
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    render() {
        const childrenProps = {
            setLoading: this.props.setLoading,
            memberInfo: this.props.memberInfo,
            setMemberInfo: this.props.setMemberInfo,
            setSelfMemberInfo: this.props.setSelfMemberInfo,
            memberInfoRefresh: this.props.memberInfoRefresh,
        };
        return (
            <div className="account-wrap">
                <h2>{translate("个人信息")}</h2>
                <DynamicUserInfo {...childrenProps} />
                <DynamicAccountInfo {...childrenProps} />
                <DynamicUpdatePassword setLoading={this.props.setLoading} />
                <DynamicOther {...childrenProps} />
            </div>
        );
    }
}

export default Account;
