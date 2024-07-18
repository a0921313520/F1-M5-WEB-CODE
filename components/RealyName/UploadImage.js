import React from "react";
import { Modal, Input, Icon, Spin, Button } from "antd";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISET } from "$ACTIONS/TLCAPI";
import { showResultModal } from "$ACTIONS/helper";
class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            uploadFileName1: "",
            fileBytes1: "",
            uploadFileName2: "",
            fileBytes2: "",
            uploadFileName3: "",
            fileBytes3: "",
            fileId1: "", //第一个文件上传完后返回的文件id,
            fileId2: "",
            fileId3: "",
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.clearFiles !== this.props.clearFiles &&
            this.props.clearFiles
        ) {
            this.setState({
                uploadFileName1: "",
                fileBytes1: "",
                fileId1: "",
                uploadFileName2: "",
                fileBytes2: "",
                fileId2: "",
                uploadFileName3: "",
                fileBytes3: "",
                fileId3: "",
            });
            this.props.setfileId1("");
            this.props.setfileId2("");
            this.props.setfileId3("");
            this.props.setbtnValue("上传身份证及银行卡");
        }
    }
    addLoding = (text, bool, type) => {
        this.loadingNode = Modal.info({
            title: ``,
            centered: true,
            mask: false,
            width: 200,
            content: (
                <div>
                    <div style={{ height: 45 }}>
                        <embed
                            type="image/jpg"
                            className="loading-animation"
                            src="/vn/img/icons/loading.svg"
                        />
                    </div>
                    <p style={{ marginTop: 0, marginBottom: 0 }}>{text}</p>
                </div>
            ),
            className: "showInfoModal hidden-btn opacity depositLoading",
            zIndex: 1501,
        });
    };
    fileResultModal = (text, type) => {
        const modals = Modal.info({
            title: ``,
            centered: true,
            mask: false,
            content: (
                <div>
                    {type !== "none" && (
                        <img
                            style={{ width: 40, height: 40 }}
                            src={`/vn/img/user/otpVerify/${
                                type == "success"
                                    ? "icon-success"
                                    : type == "fail"
                                      ? "icon-error"
                                      : ""
                            }.png`}
                        />
                    )}
                    <p
                        style={{
                            marginTop: 0,
                            marginBottom: 0,
                            padding: "6px 14px",
                        }}
                    >
                        {text}
                    </p>
                </div>
            ),
            className: "showInfoModal hidden-btn opacity depositLoading",
            zIndex: 1501,
        });
        setTimeout(() => {
            modals.destroy();
        }, 3000);
    };
    uploadFile = (e, key) => {
        let self = this;
        let uploadFileName = e.target.files[0].name;
        let files = e.target.files[0];
        const max = 4 * 1024 * 1024;
        const imageFormat = ["png", "jpg", "heic"];
        const currentSuffix =
            uploadFileName.split(".")[uploadFileName.split(".").length - 1];
        if (files.size > max || !imageFormat.includes(currentSuffix)) {
            this.fileResultModal(
                "仅接受 jpg，png 或 heic 的格式档案，档案大小最多 4MB",
                "none",
            );
            return;
        } else {
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
                    let fileBytes = this.result.split(",")[1];
                    self.setState(
                        {
                            [`uploadFileName${key}`]: uploadFileName,
                            [`fileBytes${key}`]: fileBytes,
                        },
                        () => {
                            self.UploadReceipt(key);
                        },
                    );
                };
            })(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    UploadReceipt = (key) => {
        this.addLoding("文档上传中 , 请稍后…");
        const data = {
            fileName: this.state[`uploadFileName${key}`],
            byteAttachment: this.state[`fileBytes${key}`],
            fileType: key,
        };
        post(ApiPort.BanksVerificationUploadFile, data)
            .then((res) => {
                this.loadingNode.destroy();
                if (res.isSuccess) {
                    showResultModal("上传成功", true, 1501);
                    this.setState({
                        [`fileId${key}`]: res.fileId,
                    });
                } else {
                    this.fileResultModal(
                        "上传失败，请稍后再试 或联系在线客服协助",
                        "fail",
                    );
                }
            })
            .catch((error) => {
                this.loadingNode.destroy();
                this.fileResultModal(
                    "上传失败，请稍后再试 或联系在线客服协助",
                    "fail",
                );
            });
    };
    clearValue = (key) => {
        this.setState({
            [`uploadFileName${key}`]: "",
            [`fileBytes${key}`]: "",
            [`fileId${key}`]: "",
        });
        this.props[`setfileId${key}`]("");
        this.props.setbtnValue("上传身份证及银行卡");
    };
    closablemodal = () => {
        const { fileId1, fileId2, fileId3 } = this.state;
        this.props.setfileId1(fileId1);
        this.props.setfileId2(fileId2);
        this.props.setfileId3(fileId3);
        this.props.setbtnValue("已上传");
        this.props.closeUploadImage();
    };
    render() {
        const {
            isLoading,
            uploadFileName1,
            uploadFileName2,
            uploadFileName3,
            fileId1,
            fileId2,
            fileId3,
        } = this.state;
        const { openUploadImage, closeUploadImage } = this.props;

        return (
            <React.Fragment>
                <Modal
                    title="上传身份证及银行卡"
                    className="tlc-modal-confirm uploadImages-modal"
                    visible={openUploadImage}
                    onCancel={closeUploadImage}
                    centered={true}
                    width={315}
                    footer={null}
                    maskClosable={false}
                    closable={true}
                    zIndex={1499}
                >
                    <Spin spinning={isLoading}>
                        <div>
                            <p className="tipText">
                                请上传您的身份证正反面及银行卡正面 3
                                个文档，支持格式：JPG 、PNG 或
                                HEIC，上传文件最多 4MB 大小。
                            </p>
                            <ul>
                                <li>
                                    <span>1.上传身份证正面</span>
                                    {!!uploadFileName1 && fileId1 ? (
                                        <div className="conbtn">
                                            <span>{uploadFileName1}</span>
                                            <div>
                                                <img
                                                    src="/vn/img/icons/icon-closed.png"
                                                    onClick={() =>
                                                        this.clearValue(1)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            block
                                            className="link"
                                            style={{ position: "relative" }}
                                        >
                                            <input
                                                className="tlc-input-disabled"
                                                id="deposit_update_file"
                                                type="file"
                                                accept="image/jpg, image/png"
                                                style={{
                                                    position: "absolute",
                                                    inset: "0",
                                                    opacity: "0",
                                                    width: "100%",
                                                    cursor: "pointer",
                                                    zIndex: "1",
                                                }}
                                                onChange={(e) =>
                                                    this.uploadFile(e, 1)
                                                }
                                            />
                                            <span>
                                                {uploadFileName1 && fileId1
                                                    ? uploadFileName1
                                                    : "点击上传"}
                                            </span>
                                        </Button>
                                    )}
                                </li>
                                <li>
                                    <span>2.上传身份证反面</span>
                                    {!!uploadFileName2 && fileId2 ? (
                                        <div className="conbtn">
                                            <span>{uploadFileName2}</span>
                                            <div>
                                                <img
                                                    src="/vn/img/icons/icon-closed.png"
                                                    onClick={() =>
                                                        this.clearValue(2)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            block
                                            className="link"
                                            style={{ position: "relative" }}
                                        >
                                            <input
                                                className="tlc-input-disabled"
                                                id="deposit_update_file"
                                                type="file"
                                                accept="image/jpg, image/png"
                                                style={{
                                                    position: "absolute",
                                                    inset: "0",
                                                    opacity: "0",
                                                    width: "100%",
                                                    cursor: "pointer",
                                                    zIndex: "1",
                                                }}
                                                onChange={(e) =>
                                                    this.uploadFile(e, 2)
                                                }
                                            />
                                            <span>
                                                {uploadFileName2 && fileId2
                                                    ? uploadFileName2
                                                    : "点击上传"}
                                            </span>
                                        </Button>
                                    )}
                                </li>
                                <li>
                                    <span>3.上传银行卡正面</span>
                                    {!!uploadFileName3 && fileId3 ? (
                                        <div className="conbtn">
                                            <span>{uploadFileName3}</span>
                                            <div>
                                                <img
                                                    src="/vn/img/icons/icon-closed.png"
                                                    onClick={() =>
                                                        this.clearValue(3)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            block
                                            className="link"
                                            style={{ position: "relative" }}
                                        >
                                            <input
                                                className="tlc-input-disabled"
                                                id="deposit_update_file"
                                                type="file"
                                                accept="image/jpg, image/png"
                                                style={{
                                                    position: "absolute",
                                                    inset: "0",
                                                    opacity: "0",
                                                    width: "100%",
                                                    cursor: "pointer",
                                                    zIndex: "1",
                                                }}
                                                onChange={(e) =>
                                                    this.uploadFile(e, 3)
                                                }
                                            />
                                            <span>
                                                {uploadFileName3 && fileId3
                                                    ? uploadFileName3
                                                    : "点击上传"}
                                            </span>
                                        </Button>
                                    )}
                                </li>
                                <li>
                                    <div className="btn-wrap">
                                        <Button
                                            block
                                            onClick={closeUploadImage}
                                        >
                                            关闭
                                        </Button>
                                        <Button
                                            disabled={
                                                (!uploadFileName1 &&
                                                    !fileId1) ||
                                                (!uploadFileName2 &&
                                                    !fileId2) ||
                                                (!uploadFileName3 && !fileId3)
                                            }
                                            className={`${
                                                uploadFileName1 &&
                                                fileId1 &&
                                                uploadFileName2 &&
                                                fileId2 &&
                                                uploadFileName3 &&
                                                fileId3
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={this.closablemodal}
                                        >
                                            提交
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Spin>
                </Modal>
            </React.Fragment>
        );
    }
}
export default UploadImage;
