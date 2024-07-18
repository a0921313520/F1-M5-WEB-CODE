import React from "react";
import {
    GetDocumentApprovalStatus,
    GetVerificationMemberDocuments,
} from "$DATA/uploader";
import Uploadfiles from "@/UploadFilesUserCenter/Upload";
import HowUpload from "./HowUpload";
import { translate } from "$ACTIONS/Translate";

class UploadFilesUserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            visibleModal: false,
        };
    }
    componentDidMount() {
        this.DocumentApprovalStatus();
        this.VerificationMemberDocuments();
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    /**
     * @description: 是否需要上传资料
     * @param {*}
     * @return {*}
     */

    DocumentApprovalStatus() {
        GetDocumentApprovalStatus((res) => {
            console.log(res);
            if (res.isSuccess && res.result) {
                this.setState({
                    isDifferentRealNamePending:
                        res.result.isDifferentRealNamePending,
                    isPending: res.result.isPending,
                });
            }
        });
    }

    /**
     * @description: 查看上传资料的进度
     * @param {*}
     * @return {*}
     */

    VerificationMemberDocuments() {
        GetVerificationMemberDocuments((res) => {
            if (res.isSuccess && res.result) {
                this.setState({
                    documents: res.result.documents,
                    imageRestriction: res.result.imageRestriction,
                });
                this.props.setLoading(false);
            }
        });
    }

    render() {
        const { documents, visibleModal, imageRestriction } = this.state;
        /**
         *@param {docTypeId}
         *@type {1}  @description 身份证明	如果货币代码 = “CNY”，显示正面和背面 如果货币代码 = “THB”，仅显示正面
         *@type {2}  @description 地址证明	如果货币代码 = “CNY”，仅显示正面 如果货币代码 = “THB”，则显示正面和背面
         *@type {3}  @description 实时人脸识别	默认
         *@type {4}  @description 存款证明	默认
         *@type {5}  @description 银行账户证明	默认
         */
        let Doc1 = documents.find((item) => item.docTypeId == 1);
        let Doc2 = documents.find((item) => item.docTypeId == 2);
        let Doc3 = documents.find((item) => item.docTypeId == 3);
        let Doc4 = documents.find((item) => item.docTypeId == 4);
        let Doc5 = documents.find((item) => item.docTypeId == 5);

        return (
            <div className="account-wrap UploadFilesUserCenter">
                {/*  无需验证文件 */}
                {documents.length == 0 && (
                    <div className="noNeedFiles">
                        <div className="Top">
                            <div>
                                <h2>{translate("帐户验证")}</h2>
                                <p>
                                    {translate(
                                        "上传所需文件以验证您的帐户信息",
                                    )}
                                </p>
                            </div>
                            <span
                                className="howtxt"
                                onClick={() => {
                                    this.setState({
                                        visibleModal: true,
                                    });
                                }}
                            >
                                {translate("用户手册")}
                            </span>
                        </div>
                        <div className="UploadFilesBox">
                            <img
                                src={`${process.env.BASE_PATH}/img/upload/file.svg`}
                                width="80px"
                                height="80px"
                            />
                            <p>{translate("您的帐户目前不需要凭证验证")}</p>
                        </div>
                    </div>
                )}

                {/* 上传文件列表 */}
                {documents.length !== 0 && (
                    <div>
                        <div className="Top">
                            <div>
                                <h2>{translate("帐户验证")}</h2>
                                <p>
                                    {translate(
                                        "上传所需文件以验证您的帐户信息",
                                    )}
                                </p>
                            </div>
                            <span
                                className="howtxt"
                                onClick={() => {
                                    this.setState({
                                        visibleModal: true,
                                    });
                                }}
                            >
                                {translate("用户手册")}
                            </span>
                        </div>
                        {Doc1 && (
                            <Uploadfiles
                                Documents={Doc1}
                                DocData={{
                                    name: translate("公民身份证照片"),
                                    title1: translate("正面照片"),
                                    title2: translate("背面照片"),
                                    docTypeId: 1,
                                    docStatusId: this.state["TryAgain1"]
                                        ? 0
                                        : Doc1.docStatusId,
                                    frontback: true, //正反两面上传
                                    icon: "id.svg",
                                }}
                                imageRestriction={imageRestriction}
                                VerificationMemberDocuments={(
                                    TryAgainUploadTries,
                                ) => {
                                    if (TryAgainUploadTries) {
                                        this.setState(TryAgainUploadTries);
                                    } else {
                                        this.setState({
                                            TryAgain1: false,
                                        });
                                    }
                                    this.VerificationMemberDocuments();
                                }}
                            />
                        )}
                        {Doc2 && (
                            <Uploadfiles
                                Documents={Doc2}
                                DocData={{
                                    name: translate("地址2"),
                                    docTypeId: 2,
                                    docStatusId: this.state["TryAgain2"]
                                        ? 0
                                        : Doc2.docStatusId,
                                    icon: "home.svg",
                                }}
                                imageRestriction={imageRestriction}
                                VerificationMemberDocuments={(
                                    TryAgainUploadTries,
                                ) => {
                                    console.log(TryAgainUploadTries);
                                    if (TryAgainUploadTries) {
                                        this.setState(TryAgainUploadTries);
                                    } else {
                                        this.setState({
                                            TryAgain2: false,
                                        });
                                    }
                                    this.VerificationMemberDocuments();
                                }}
                            />
                        )}
                        {Doc3 && (
                            <Uploadfiles
                                DefaultimageType={true}
                                Documents={Doc3}
                                DocData={{
                                    name: translate("人脸识别照片"),
                                    title1: (
                                        <p>
                                            {translate("CCCD照片")}
                                            <br />
                                            {translate("手持正面")}
                                        </p>
                                    ),
                                    title2: (
                                        <p>
                                            {translate("CCCD照片")}
                                            <br />
                                            {translate("手持反面")}
                                        </p>
                                    ),
                                    docTypeId: 3,
                                    docStatusId: this.state["TryAgain3"]
                                        ? 0
                                        : Doc3.docStatusId,
                                    frontback: true, //正反两面上传
                                    icon: "users.svg",
                                }}
                                imageRestriction={imageRestriction}
                                VerificationMemberDocuments={(
                                    TryAgainUploadTries,
                                ) => {
                                    if (TryAgainUploadTries) {
                                        this.setState(TryAgainUploadTries);
                                    } else {
                                        this.setState({
                                            TryAgain3: false,
                                        });
                                    }
                                    this.VerificationMemberDocuments();
                                }}
                            />
                        )}
                        {Doc4 && (
                            <Uploadfiles
                                DefaultimageType={true}
                                Documents={Doc4}
                                DocData={{
                                    name: translate("存款证明"),
                                    docTypeId: 4,
                                    docStatusId: this.state["TryAgain4"]
                                        ? 0
                                        : Doc4.docStatusId,
                                    icon: "log.svg",
                                }}
                                imageRestriction={imageRestriction}
                                VerificationMemberDocuments={(
                                    TryAgainUploadTries,
                                ) => {
                                    if (TryAgainUploadTries) {
                                        this.setState(TryAgainUploadTries);
                                    } else {
                                        this.setState({
                                            TryAgain4: false,
                                        });
                                    }
                                    this.VerificationMemberDocuments();
                                }}
                            />
                        )}
                        {Doc5 && (
                            <Uploadfiles
                                DefaultimageType={true}
                                Documents={Doc5}
                                DocData={{
                                    name: translate("存款凭证照片"),
                                    docTypeId: 5,
                                    docStatusId: this.state["TryAgain5"]
                                        ? 0
                                        : Doc5.docStatusId,
                                    icon: "bank.svg",
                                }}
                                imageRestriction={imageRestriction}
                                VerificationMemberDocuments={(
                                    TryAgainUploadTries,
                                ) => {
                                    if (TryAgainUploadTries) {
                                        this.setState(TryAgainUploadTries);
                                    } else {
                                        this.setState({
                                            TryAgain5: false,
                                        });
                                    }
                                    this.VerificationMemberDocuments();
                                }}
                            />
                        )}
                    </div>
                )}

                {/* 上传教程 */}
                <HowUpload
                    visibleModal={visibleModal}
                    setModal={(data) => {
                        this.setState(data);
                    }}
                />
            </div>
        );
    }
}

export default UploadFilesUserCenter;
