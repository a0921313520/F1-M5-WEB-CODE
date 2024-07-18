import React from "react";
import { Form, Popover, Modal, message } from "antd";
import classNames from "classnames";
import { connect } from "react-redux";
import { translate } from "$ACTIONS/Translate";
import { getE2BBValue } from "$ACTIONS/helper";
import { TransferSubmit, GetAllBalance } from "$DATA/wallet";
class HeadBlance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAll: false,
            isSuccess: "",
            TotalBal: "",
            MAINBal: "",
            otherWalletTotal: 0,
            balanceList: "",
        };
    }
    componentDidMount() {
        this.getAllBalance();
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    getAllBalance = () => {
        // this.props.setLoading(true);
        GetAllBalance((res) => {
            if (res.isSuccess && res.result) {
                this.setState(
                    {
                        balanceList: res.result,
                        TotalBal: res.result.find((v) => v.name == "TotalBal")
                            .balance,
                        MAINBal: res.result.find((v) => v.name == "MAIN")
                            .balance,
                        otherWalletList: res.result.filter(
                            (v) =>
                                v.state !== "UnderMaintenance" &&
                                v.category !== "TotalBal" &&
                                v.category !== "Main",
                        ),
                    },
                    () => {
                        this.calcOtherWalletTotal();
                    },
                );
            }
            // this.props.setLoading(false);
        });
    };
    calcOtherWalletTotal = () => {
        const { otherWalletList } = this.state;
        if (!otherWalletList.length) {
            this.setState({
                otherWalletTotal: 0,
            });
            return;
        }
        const otherBal = otherWalletList.reduce(function (a, b) {
            return { balance: a.balance + b.balance };
        }).balance;

        this.setState({
            otherWalletTotal: otherBal,
        });
    };
    handleTransfer = (TotalBal) => {
        this.props.setLoading(true);
        let DATA = {
            fromAccount: "ALL",
            toAccount: "MAIN",
            amount: TotalBal,
            bonusId: 0,
            bonusCoupon: "",
            blackBoxValue: getE2BBValue(),
            e2BlackBoxValue: getE2BBValue(),
        };
        TransferSubmit(DATA, (res) => {
            this.props.setLoading(false);
            if (res.isSuccess && res.result) {
                if (res.result.status == 1) {
                    this.getAllBalance();
                    message.success(
                        res.result.messages || translate("转账成功"),
                    );
                } else {
                    message.error(
                        res.result?.messages || translate("转账失败"),
                    );
                }
            } else {
                message.error(res?.result?.messages || translate("转账失败"));
            }
        });
    };
    render() {
        const { balanceList, otherWalletTotal, TotalBal, MAINBal, showAll } =
            this.state;

        return (
            <React.Fragment>
                <div>
                    <div className="MainBlance">
                        <div className="item-blance" flex="1">
                            <label className="item-label">
                                {translate("总余额")}
                            </label>
                            <b>{TotalBal || "0"} đ</b>
                        </div>

                        <div className="item-blance">
                            <label className="item-label">
                                {translate("主账户")}
                                <img
                                    className="Transfericon"
                                    src={`${process.env.BASE_PATH}/img/wallet/transfericon.svg`}
                                    onClick={() => {
                                        this.handleTransfer(TotalBal);
                                        Pushgtagdata(
                                            `Transfer`,
                                            "Submit",
                                            `QuickTransfer_WithdrawPage`,
                                        );
                                    }}
                                />
                            </label>

                            <b>{MAINBal || "0"} đ</b>
                        </div>

                        <div
                            className="item-blance"
                            onClick={() => {
                                this.setState({
                                    showAll: !showAll,
                                });
                            }}
                        >
                            <label className="item-label">
                                {translate("其他钱包")}
                                <img
                                    className="Downicon"
                                    src={`${process.env.BASE_PATH}/img/wallet/dropdown.svg`}
                                />
                            </label>
                            <b>{otherWalletTotal.toFixed(2)} đ</b>
                        </div>
                    </div>
                    {/* <div className="card-balance-wrap" style={{ display: showAll ? 'block' : 'none' }}>
                        {balanceList && balanceList.length ? (
                            balanceList.map((val, index) => {
                                if (val.category === 'Main' || val.category === 'TotalBal') return null;
                                return (
                                    <div className="balance-box" key={'walletTransfer' + index} onClick={() => {}}>
                                        <div>
                                            <span>{val.localizedName}</span>
                                            {val.name === 'SB' ? (
                                                <Popover
                                                    overlayStyle={{ zIndex: 1000 }}
                                                    align={{ offset: [ -4, 0 ] }}
                                                    placement="bottomLeft"
                                                    overlayClassName="popover-dark"
                                                    content={<div>包含 醉心体育, V2虚拟体育, 沙巴体育, BTI 体育, IM 体育和电竞</div>}
                                                    title=""
                                                    trigger="hover"
                                                >
                                                    <span className="header-popover-inner-tip pointer">
                                                        <Icon type="question-circle" />
                                                    </span>
                                                </Popover>
                                            ) : null}
                                        </div>
                                        <div>{val.state === 'UnderMaintenance' ? '维护中' : '￥' + val.balance}</div>
                                        <div className="btn" />
                                    </div>
                                );
                            })
                        ) : null}
                    </div> */}
                </div>
                <Modal
                    title={translate(`其他钱包`)}
                    className="modal-pubilc BalanceList"
                    visible={showAll}
                    closable={true}
                    centered={true}
                    width={400}
                    footer={null}
                    zIndex={1500}
                    onCancel={() => {
                        this.setState({
                            showAll: false,
                        });
                    }}
                >
                    <div className="Content">
                        {balanceList && balanceList.length
                            ? balanceList.map((val, index) => {
                                  if (
                                      val.category === "Main" ||
                                      val.category === "TotalBal"
                                  )
                                      return null;
                                  return (
                                      <div
                                          key={"walletTransfer" + index}
                                          className={classNames({
                                              "balance-box": true,
                                              UnderMaintenance:
                                                  val.state ==
                                                  "UnderMaintenance",
                                          })}
                                      >
                                          <div>
                                              <span className="localizedName">
                                                  {val.localizedName}
                                              </span>
                                              {/* {val.name === "SB" ? (
                                                <Popover
                                                    overlayStyle={{
                                                        zIndex: 1000,
                                                    }}
                                                    align={{ offset: [-4, 0] }}
                                                    placement="bottomLeft"
                                                    overlayClassName="popover-dark"
                                                    content={
                                                        <div>
                                                            包含 V2虚拟体育,
                                                            沙巴体育, BTI 体育, IM
                                                            体育和电竞
                                                        </div>
                                                    }
                                                    title=""
                                                    trigger="hover"
                                                >
                                                    <span className="header-popover-inner-tip pointer">
                                                        <img src={`${process.env.BASE_PATH}/img/icon/note.svg`} />
                                                    </span>
                                                </Popover>
                                            ) : null} */}
                                              {/* {val.name === "P2P" ? (
                                                <Popover
                                                    overlayStyle={{
                                                        zIndex: 1000,
                                                    }}
                                                    align={{ offset: [-4, 0] }}
                                                    placement="bottomLeft"
                                                    overlayClassName="popover-dark"
                                                    content={
                                                        <div>
                                                            包含双赢棋牌，开元棋牌和小游戏​
                                                        </div>
                                                    }
                                                    title=""
                                                    trigger="hover"
                                                >
                                                    <span className="header-popover-inner-tip pointer">
                                                        <img src="/vn/img/icon/note.svg" />
                                                    </span>
                                                </Popover>
                                            ) : null} */}
                                          </div>
                                          <div className="num">
                                              {val.state === "UnderMaintenance"
                                                  ? translate("维护中")
                                                  : "￥" + val.balance}
                                          </div>
                                          <div className="btn" />
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default HeadBlance;
