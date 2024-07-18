import React from "react";
import { Modal, Input, message, Button } from "antd";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { PostUploadAttachment } from "$DATA/wallet";
import { getE2BBValue } from "$ACTIONS/helper";
import { translate } from "$ACTIONS/Translate";

class UploadFile extends React.Component {
    static defaultProps = {
        children: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            fileName: "",
            uploadSizeFlag: false,
        };
        this.acceptFormat = [
            "png",
            "jpg",
            "jpeg",
            "heic",
            "heif",
            "pdf",
            "gif",
        ];
    }
    messageInfo = (html, loading) => {
        function appendDom() {
            let boxWrap = document.createElement("div");
            let infoBox = document.createElement("p");
            boxWrap.setAttribute("id", "t_alert_mask");
            boxWrap.setAttribute("class", "t-alert-mask");
            infoBox.innerHTML = html;
            boxWrap.appendChild(infoBox);
            document.body.appendChild(boxWrap);
            return boxWrap;
        }
        if (typeof loading === "boolean") {
            if (loading === true) {
                appendDom();
            } else {
                let boxWrap = document.getElementById("t_alert_mask");
                boxWrap && boxWrap.remove();
            }
        } else {
            let boxWrap = appendDom();
            // 当组件被卸载掉后，如果还能查询到当前元素则在指定时间后需要移除
            setTimeout(() => {
                boxWrap && boxWrap.remove();
            }, 3000);
        }
    };

    //上传文件
    uploadFile = (e) => {
        let self = this;
        let fileName = e.target.files[0].name;
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                let fileBytes = this.result.split(",")[1];
                self.setState(
                    {
                        file: file,
                        fileName,
                        fileBytes,
                        uploadSizeFlag: !(
                            file.size <= 4194304 &&
                            self.acceptFormat.includes(
                                fileName.split(".")[
                                    fileName.split(".").length - 1
                                ],
                            )
                        ),
                    },
                    () => {},
                );
            };
        })(e.target.files[0]);
        reader.readAsDataURL(e.target.files[0]);
    };

    UploadAttachment = () => {
        this.setState({
            filestatus: 0,
        });
        this.messageInfo(
            `<div><img src=${process.env.BASE_PATH}/img/icons/loading.gif width='35px' style='margin-bottom:5px'/><br/>${translate("上传文件中")}</div>`,
            true,
        );
        const memberInfo = JSON.parse(localStorage.getItem("memberInfo"));
        PostUploadAttachment(
            {
                DepositID: this.props.transactionId,
                PaymentMethod: this.props.paymentType,
                FileName: this.state.fileName,
                byteAttachment: this.state.fileBytes,
                RequestedBy: memberInfo ? memberInfo.memberCode : "",
                blackBoxValue: getE2BBValue(),
                e2BlackBoxValue: getE2BBValue(),
            },
            (res) => {
                if (res.isSuccess == true) {
                    this.setState({
                        filestatus: 1,
                    });
                    this.setState({
                        filesuccess: true,
                        visible: false,
                    });

                    this.messageInfo("", false);
                    this.props.setFileName(this.state.fileName);
                    message.success(translate("上传成功"));
                } else {
                    this.setState({
                        filestatus: 2,
                    });
                    this.messageInfo("", false);
                }
            },
        );
    };
    render() {
        return this.props.children ? (
            <React.Fragment>
                <div
                    style={
                        this.props.inline === true
                            ? { display: "inline-block" }
                            : { display: "block", width: "100%" }
                    }
                    onClick={() => {
                        this.setState({
                            visible: true,
                        });
                    }}
                >
                    {this.props.children}
                </div>
                <Modal
                    closable={false}
                    className="modal-pubilc UploadFileModal"
                    title={translate("上传收据")}
                    visible={this.state.visible}
                    footer={null}
                    maskClosable={false}
                    centered={true}
                    key={this.state.visible}
                    width={400}
                >
                    <div className="btn-content-set">
                        <p>
                            {translate(
                                "最大文件大小：4MB | 文件类型：JPG、JPEG、PNG、GIF、PDF、HEIC、HEIF | 最大文件数：1",
                            )}
                        </p>
                        <div className="line-distance"></div>
                        <label>{translate("存款收据")}</label>
                        <h5>{translate("鼓励")}</h5>
                        <div className="btn-content-file " id="updataset">
                            <span className="imgname">
                                {this.state.fileName}
                            </span>

                            <Button size="large" type="primary">
                                {translate("上传2")}
                                <input
                                    value=""
                                    type="file"
                                    accept={this.acceptFormat}
                                    className="Modal_file_btn"
                                    onChange={(e) => {
                                        this.uploadFile(e);
                                    }}
                                />
                            </Button>
                        </div>
                        {this.state.uploadSizeFlag && (
                            <span className="red-set">
                                {translate(
                                    "文件类型或文件大小无效。 请检查并重新加载",
                                )}
                            </span>
                        )}
                        {this.state.filestatus == 2 && (
                            <span className="red-set">
                                {translate("抱歉，上传收据时出错，请重试。")}
                            </span>
                        )}
                        <div className="btn-content">
                            <Button
                                className="left"
                                onClick={() => {
                                    this.setState({
                                        visible: false,
                                        fileName: "",
                                        filestatus: "3",
                                        uploadSizeFlag: false,
                                    });
                                }}
                                size="large"
                                type="primary"
                                ghost
                                block
                            >
                                {translate("取消")}
                            </Button>
                            {this.state.fileName &&
                                this.state.fileName !== "" &&
                                !this.state.uploadSizeFlag && (
                                    <Button
                                        onClick={() => {
                                            this.UploadAttachment();
                                        }}
                                        size="large"
                                        type="primary"
                                        block
                                    >
                                        {translate("提交")}
                                    </Button>
                                )}
                            {(this.state.fileName == "" ||
                                this.state.uploadSizeFlag) && (
                                <Button
                                    className="filebtn"
                                    size="large"
                                    type="primary"
                                    block
                                    disabled
                                >
                                    {translate("提交")}
                                </Button>
                            )}
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        ) : null;
    }
}

export default UploadFile;
