import React from "react";
import Router from "next/router";
import Layout from "@/Layout";
import { getStaticPropsFromStrapiSEOSetting } from '$DATA/seo';
import MeModule from "@/Me";

export async function getStaticPaths(){
    return {
        paths:[
            {params: {usercenterModule:"account-info"}},
            {params: {usercenterModule:"bank-account"}},
            {params: {usercenterModule:"verifications"}},
            {params: {usercenterModule:"security-code"}},
            {params: {usercenterModule:"upload-files"}},
            {params: {usercenterModule:"shipment-address"}},
        ],
        fallback:false
    }
}
export async function getStaticProps(context) {
    const seoPage = `/me/${context.params.usercenterModule}`
    return await getStaticPropsFromStrapiSEOSetting(seoPage); //參數帶本頁的路徑
}

class UserCenter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentMoney: {},
            hasUnRead: false, // 消息中心是否有未读消息
        };
        this.setMemberInfo = function () {}; // HasHeader传递过来的方法（设置会员信息）
        this.getBalance = function () {}; // HasHeader传递过来的方法（更新余额）
        this.setHeaderIsRead = function () {}; // HasHeader传递过来的方法（更新已读未读消息[小红点]）
    }

    componentDidMount() {
        if (!localStorage.getItem("access_token")) {
            Router.push("/");
        }
    }

    componentDidUpdate(prevProps, prevState){}

    componentWillUnmount(){
        this.setState = () => false;
    }

    setUserCenterHasUnRead =bool=> {
        this.setState({ hasUnRead: bool });
    }

    render() {
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                setCircleHasUnRead={(setHeaderIsRead) => {
                    this.setHeaderIsRead = setHeaderIsRead;
                }}
                setUsercnnterCircle={(hasUnRead) => {
                    this.setState({ hasUnRead: hasUnRead });
                }}
                setUserCenterMemberInfo={(v, setMemberInfo, getBalance) => {
                    this.setMemberInfo = setMemberInfo;
                    this.getBalance = getBalance;
                }}
                setUserCenterMoney={(v) => {
                    this.setState({ currentMoney: v });
                }}
                seoData={this.props.seoData}
            >
                <MeModule
                    setHeaderIsRead={this.setHeaderIsRead}    // 更新HasHeader已读未读消息[小红点]
                    hasUnRead={this.state.hasUnRead}                // Usercenter(消息中心) 是否有已读未读消息[小红点]
                    setUserCenterHasUnRead={this.setUserCenterHasUnRead}    // 更新Usercenter已读未读消息[小红点]
                    setUserCenterMemberInfo={this.setMemberInfo}    // 更新HadHeader组件的memberInfo，此memberInfo公用到个人信息弹出层和钱包弹出层
                    getBalance={this.getBalance}
                    currentMoney={this.state.currentMoney}
                />
            </Layout>
        );
    }
}

export default UserCenter;
