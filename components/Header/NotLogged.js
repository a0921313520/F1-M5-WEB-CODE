import React from "react";
import { Row, Col, Input, Button } from "antd";
import Notice from "./Notice";
import Login from "../UserSign/Login";
export default class NotLogged extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            Password: "",
        };
    }

    AlreadLogin = () => {
        this.props.AlreadLogin();
    };
    render() {
        const { UserName, Password } = this.state;
        return (
            <div className="common-distance-wrap">
                <div
                    className={`common-distance tlc-sign-header ${
                        this.props.smallHeader === "zoom-out" && "hidden"
                    }`}
                >
                    <Row>
                        <Col span={12} className="tlc-notice-wrapper">
                            <Notice />
                        </Col>
                        <Login
                            home={true}
                            AlreadLogin={() => this.AlreadLogin()}
                        />
                        {/* <Col span={12} className="tlc-sign">
							<div className="login-wrap">
								<div className="forget-password">
									<Button type="link" size="small">
										忘记密码？
									</Button>
								</div>
								<div className="input-wrap">
									<Input
										size="large"
										placeholder="用户名"
										onChange={(e) => this.UserInput(e, 'USER')}
										onPressEnter={() => this.HandleEnterKey()}
									/>
									<Input
										type="Password"
										size="large"
										placeholder="密码"
										onChange={(e) => this.UserInput(e, 'PWD')}
										onPressEnter={() => this.HandleEnterKey()}
									/>
								</div>
							</div>
							<div
								className="login-btn tlc-sprite offset-small-y"
								onClick={() => this.refs.login.Login(UserName, Password, 'Registerfalse')}
							/>
							<div
								className="register-btn tlc-sprite offset-small-y"
								onClick={() => global.goUserSign('2')}
							/>
						</Col> */}
                    </Row>
                </div>
            </div>
        );
    }
}
