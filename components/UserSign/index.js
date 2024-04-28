import React from "react";
import { Modal, Tabs, Icon, message } from "antd";
import Login from "./Login";
import Register from "./Register";
import ForgotPwd from "@/ForgotPwd/";
import {translate} from "$ACTIONS/Translate";

message.config({
    top: 100,
    duration: 2,
    maxCount: 1,
});
const { TabPane } = Tabs;
class UserSign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "1",
            visible: false,
            agreement: false,
        };
        this.ForgotPwd = React.createRef();
    }

    componentDidMount() {
        global.goUserSign = (key) => this.showmodal(key); // 全局化登陆注册弹窗事件
        this.props.onUserSign(this.showmodal); // 传出登陆注册弹窗事件
    }

    showmodal = (key) => {
        this.setState({
            visible: !!key,
            activeKey: key,
        });
    };

    // showagreement() {
    //     this.setState({
    //         agreement: true,
    //     });
    // }

    handleEvent = (e) => {
        this.setState({
            visible: false,
            agreement: false,
        });
    };

    RefLogin = (ref) => {
        this.Login = ref;
    };

    RefRegister = (ref) => {
        this.Register = ref;
    };

    render() {
        const {activeKey} = this.state;
        return (
            <div>
                <Modal
                    title={translate(activeKey === "1" ? "登录":"注册")}
                    closeIcon={
                        <Icon type="close" style={{ fontSize: "18px" }} />
                    }
                    className="modal-pubilc login-and-registration"
                    visible={this.state.visible}
                    onOk={this.handleEvent}
                    onCancel={this.handleEvent}
                    zIndex={2000}
                    width={400}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Tabs
                        tabPosition="top"
                        className="tabs-modal-pubilc"
                        size="small"
                        activeKey={this.state.activeKey}
                        onChange={(activeKey) => {
                            this.setState({ activeKey });
                            activeKey === "1"
                                ? Pushgtagdata("Register","switch to Login","Register_C_Login")
                                : Pushgtagdata("Login","switch to Register","Login_C_Register")
                            
                        }}
                    >
                        <TabPane tab={translate("登录")} key={"1"}>
                            <Login
                                RefLogin={(ref) => this.RefLogin(ref)}
                                AlreadLogin={() => this.props.AlreadLogin()}
                                handleEvent={() => this.handleEvent()}
                                showagreement={() => this.showagreement()}
                                openForgotPwd={() => {
                                    this.handleEvent();
                                    this.ForgotPwd.current.showModal(1);
                                }}
                            />
                        </TabPane>
                        <TabPane tab={translate("注册")} key={"2"}>
                            <Register
                                RefRegister={(ref) => this.RefRegister(ref)}
                                login={() => {
                                    this.Login.Registerdata(
                                        this.Register.state.UserName,
                                        this.Register.state.UserPwd
                                    );
                                    this.Login.Login();
                                }}
                                showmodal={(e) => this.showmodal(e)}
                                showagreement={() => this.showagreement()}
                            />
                        </TabPane>
                    </Tabs>
                </Modal>
                {/* <Modal
                    title="服务协议"
                    closeIcon={
                        <Icon type="close" style={{ fontSize: "18px" }} />
                    }
                    className="modal-pubilc"
                    zIndex={2001}
                    visible={this.state.agreement}
                    onOk={() => {
                        this.setState({
                            agreement: false,
                        });
                    }}
                    onCancel={() => {
                        this.setState({
                            agreement: false,
                        });
                    }}
                    width={600}
                    footer={null}
                    centered={true}
                >
                    <ul className="list-style">
                        <li>
                            任何串关注单、任何平局、滚球赛事、取消的赛事、提早兑现的注单或欧洲盘赔率低于
                            1.7
                            的投注将不符合条件申请优惠，所有活动必须遵守同乐城标准条款。{" "}
                        </li>
                        <li>
                            同乐城任何会员的注册姓名必须与提款银行的账户姓名一致，若违反，同乐城保留拒绝申请红利，并取消其已获红利及盈利的权利。{" "}
                        </li>
                        <li>
                            每位会员、每户、每一住址、每一电子邮箱地址、每一电话号码、相同支付方式、相同在线存款/信用卡/银行账户号码/money-booker及IP地址只可享受一次本优惠。{" "}
                        </li>
                        <li>
                            所有活动的对象仅为娱乐性玩家，有资格参与任何优惠活动的用户，须遵守同乐城制定的规则与决定。如发现会员为职业赌徒或只为寻求红利的玩家，同乐城保留取消红利的权利。{" "}
                        </li>
                        <li>
                            同乐城保留对本优惠的修订、终止和最终解释权，以及在无通知的情况下作出改变所有活动的权利；或者通过邮件方式通知会员、作出改变的权利。
                            如果本次活动由于一些不可预测或情势超出本站控制之外的技术错误，同乐城对此将不承担任何责任。{" "}
                        </li>
                        <li>
                            同乐城有权在第一时间取消一切利用对赌涉嫌欺诈行为会员的所有已获红利及盈利。
                            所有产品首存和再存红利完成后均需在90天内领取，否则将过期失效。
                            已派发奖励在有效期内未使用将自动扣除，所有免费彩金有效期为30天。{" "}
                        </li>
                    </ul>
                </Modal> */}
                <ForgotPwd ref={this.ForgotPwd} />
            </div>
        );
    }
}

export default UserSign;
