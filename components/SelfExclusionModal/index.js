import React from "react";
import Router from "next/router";
import moment from "moment";
import { Button, Modal } from "antd";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";

//自我限制彈窗
class SelfExclusionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalOpen: false,
        };
    }
    componentDidMount() {
        const isLogin = localStorage.getItem("access_token");

        if (isLogin) {
            if (this.props.ModalType == 2) {
                this.setModalOpen();
            } else {
                this.SelfExclusions();
            }
        }
        this.CallWindow(false);
    }

    CallWindow(status) {
        window.SelfExclusionsisDisabled = status;
        window.CheckSelfExclusions = (status) => this.setModalStatuas(status);
    }

    SelfExclusions() {
        get(ApiPort.GETSelfExclusions).then((res) => {
            if (res && res.result) {
                console.log("selfExclusion res: ", res);

                const isDisabled =
                    res.result.status &&
                    (res.result.disableDeposit ||
                        res.result.disableFundIn ||
                        res.result.disableBetting);

                if (isDisabled) {
                    this.CallWindow(true);

                    this.setState({
                        isDisabled: true,
                        SelfExclusionsData: res.result,
                    });

                    if (
                        this.props.ModalType == 1 &&
                        (this.props.OpenModalUrl == "Deposit" ||
                            this.props.OpenModalUrl == "Transfer")
                    ) {
                        this.setModalOpen();
                    }
                } else {
                    this.CallWindow(false);
                }
            }
        });
    }

    setModalStatuas = () => {
        if (this.state.isDisabled) {
            this.setModalOpen();
        }
    };

    setModalOpen = () => {
        this.setState({ ModalOpen: true });
    };

    render() {
        let setupDate = null;
        let dateDuration = "永久";
        if (this.props.ModalType == 1 && this.state.SelfExclusionsData) {
            setupDate = moment(
                this.state.SelfExclusionsData.selfExcludeSetDate + "+08:00"
            ).format("YYYY/MM/DD");
            if (this.state.SelfExclusionsData.selfExclusionSettingID == 3) {
                dateDuration = "永久";
            } else {
                dateDuration =
                    this.state.SelfExclusionsData.selfExcludeDuration + "天";
            }
        }

        return (
            <Modal
                closable={false}
                className="commonModal SelfExclusionModal"
                title="自我限制"
                visible={this.state.ModalOpen}
                width="350px"
                footer={null}
            >
                <div className="SelfExclusionModalContent">
                    {this.props.ModalType == 1 ? (
                        <div>
                            {`您在 ${setupDate} 已成功设定（${dateDuration}）自我行为控制，如需要任何帮助，请联系`}
                            <span
                                className="SelfExclusionModalCS blue"
                                onClick={() => {
                                    PopUpLiveChat();
                                }}
                            >
                                在线客服
                            </span>
                            。
                        </div>
                    ) : null}
                    {this.props.ModalType == 2 ? (
                        <div>
                            转帐金额已超过您的自我限制金额，如需要任何帮助，请联系
                            <span
                                className="SelfExclusionModalCS blue"
                                onClick={() => {
                                    global.PopUpLiveChat();
                                }}
                            >
                                在线客服
                            </span>
                            。
                        </div>
                    ) : null}
                </div>
                <Button
                    className="SelfExclusionModalButton"
                    onClick={() => {
                        this.setState({ ModalOpen: false }, () => {
                            this.props.afterCloseModal &&
                                this.props.afterCloseModal();
                        });
                    }}
                >
                    知道了
                </Button>
            </Modal>
        );
    }
}

export default SelfExclusionModal;
