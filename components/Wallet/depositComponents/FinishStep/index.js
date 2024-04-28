/*
 * @Author: Alan
 * @Date: 2023-04-18 09:15:24
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-17 15:54:31
 * @Description: 第三步
 * @FilePath: /F1-M1-WEB-Code/components/Wallet/depositComponents/FinishStep/index.js
 */
import React from "react";
import { Button, Steps } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import UploadFile from "@/UploadFile";
const { Step } = Steps;

class FinishStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFileName: "",
        };
    }
    componentDidMount() {}
    copyEvent() {
        global.showColorResultModal("已复制", true);
    }
    render() {
        let {
            Time,
            collectionInfo,
            goRecord,
            goHome,
            payTypeCode,
            uploadFile,
        } = this.props; // 当前支付方式的详情
        const { targetValue, bonusVal } = this.state;
        console.log("-------------->", collectionInfo);
        return (
            <div className="lb-third-step-wrap">
                <div className="stepDone">
                    <img
                        src="/cn/img/icons/icon-success.png"
                        width={"60px"}
                        className="iconstatus"
                    />
                    <div className="successtext">已成功提交</div>
                    <div className="StepsBox depositSuccess">
                        <Steps current={0} direction="vertical" size="small">
                            <Step
                                title="提交成功"
                                description="处理中"
                                icon={
                                    <BsCheckCircleFill
                                        color="#108ee9"
                                        size={17}
                                    />
                                }
                            />
                            <Step
                                title=""
                                description={`预计${Time}分钟到账`}
                                icon={<BsCircle color="#999999" size={12} />}
                            />
                        </Steps>
                    </div>
                    <div className="DepositInfo">
                        <div className="list">
                            <span>存款金额</span>
                            <span className="bold">
                                ¥{" "}
                                {collectionInfo && collectionInfo.uniqueAmount}
                            </span>
                        </div>
                        <div className="list">
                            <span>交易单号</span>
                            <span>
                                {collectionInfo && collectionInfo.transactionId}
                                <CopyToClipboard
                                    text={
                                        collectionInfo &&
                                        collectionInfo.transactionId
                                    }
                                    onCopy={this.copyEvent}
                                >
                                    <img
                                        style={{
                                            marginLeft: "0.4rem",
                                            cursor: "pointer",
                                        }}
                                        src={`/cn/img/icons/Copys.svg`}
                                    />
                                </CopyToClipboard>
                            </span>
                        </div>
                    </div>
                </div>
                {uploadFile && (
                    <div className="UploadFileData">
                        <h4>
                            上传存款凭证 <span className="note">推荐使用</span>
                        </h4>

                        {!!this.state.uploadFileName ? (
                            <Button block>{this.state.uploadFileName}</Button>
                        ) : (
                            <UploadFile
                                paymentType={payTypeCode}
                                transactionId={collectionInfo.transactionId}
                                uploadFileName={this.state.uploadFileName}
                                setFileName={(v) => {
                                    this.setState({ uploadFileName: v });
                                }}
                                children={
                                    <Button block className="link">
                                        <img src="/cn/img/icons/plus-upload.svg"></img>
                                        上传存款凭证以利款项快速到账
                                    </Button>
                                }
                            />
                        )}
                        <span className="item-label" style={{ padding: 0 }}>
                            若您无法上传凭证，请联系
                            <span
                                className="blue"
                                onClick={global.PopUpLiveChat}
                            >
                                在线客服
                            </span>
                            。
                        </span>
                    </div>
                )}

                <center>
                    <p className="note">
                        您可以回到首页继续投注，请等待10分钟以刷新金额，
                        如果有任何问题，请联系我们的在线客服
                    </p>
                </center>
                <div className="btn-wrap">
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            goRecord();
                        }}
                        block
                    >
                        查看交易记录
                    </Button>

                    <Button
                        ghost
                        size="large"
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            goHome();
                        }}
                        block
                        style={{ marginTop: "15px" }}
                    >
                        回到首页
                    </Button>
                </div>
            </div>
        );
    }
}
export default FinishStep;
