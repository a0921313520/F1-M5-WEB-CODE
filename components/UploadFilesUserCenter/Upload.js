import React from "react";
import { UploadDocument } from "$DATA/uploader";
import classNames from "classnames";
import { Modal, Button, message } from "antd";
import Flexbox from "@/Flexbox/";
import ImageUploading from "react-images-uploading";
import UploadStatus from "./Status";
import ShowEg from "./ShowEg";
import { translate } from "$ACTIONS/Translate";
import dynamic from "next/dynamic";

const DynamicUploadingModal = dynamic(import("./UploadingModal"), {
    loading: () => "",
    ssr: false,
});

const maxNumber = 1;
class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            imageList: [],
            showIDCardModal: false,
            maxFileSize: false,
            RemoveConfirm: false,
            FrontmaxFileSize: false,
            BackimageList: [],
            FrontimageList: [],
            ShowType: null,
            Loadingvisible:false,
        };
    }
    componentDidMount() {
        //this.props.setLoading(false);
    }

    /**
     * @description: 移除文件确认
     * @return {*}
     */

    RemoveConfirm(type) {
        Modal.confirm({
            className: "confirm-modal-of-public uploadFiles-removeModal",
            title: translate("删除文档"),
            icon: null,
            centered: true,
            okText: translate("确定"),
            cancelText: translate("不是"),
            content: <div>{translate("您确定要删除该文件吗？")}</div>,
            onOk: () => {
                if (type == 1) {
                    this.setState({
                        FrontimageList: [],
                    });
                } else {
                    this.setState({
                        BackimageList: [],
                    });
                }
                message.success("文件已删除");
            },
            onCancel: () => {},
        });
    }

    onChange = (imageList) => {
        console.log(imageList);
        this.setState(imageList);
    };

    /**
     * @description: 上传资料
     * @param {String} docTypeId 上传资料的类型
     * @return {*}
     */
    ToUploadDocument(docTypeId) {
        const { BackimageList, FrontimageList } = this.state;
        const {
            DocData,
            VerificationMemberDocuments,
            Documents,
            DefaultimageType,
        } = this.props;
        let data = DocData.frontback
            ? [
                  {
                      imageType: !DefaultimageType ? "Front" : "Default", //正面
                      fileName: FrontimageList[0]["file"].name,
                      fileBytes: FrontimageList[0]["data_url"].split(",")[1],
                  },
                  {
                      imageType: !DefaultimageType ? "Back" : "Default", //反面
                      fileName: BackimageList[0]["file"].name,
                      fileBytes: BackimageList[0]["data_url"].split(",")[1],
                  },
              ]
            : [
                  {
                      imageType: !DefaultimageType ? "Front" : "Default", //默认
                      fileName: FrontimageList[0]["file"].name,
                      fileBytes: FrontimageList[0]["data_url"].split(",")[1],
                  },
              ];

        let params = {
            docTypeId: docTypeId,
            numberOfTry: Documents.remainingUploadTries,
        };
        this.setState({
            Loadingvisible: true,
        });
        UploadDocument({ params: params, data: data }, (res) => {
            this.setState({
                Loadingvisible: false,
            });
            if (res.isSuccess) {
                message.success(translate("上传成功"))
                this.setState({
                    showIDCardModal: false,
                });
                VerificationMemberDocuments(false);
            }
            console.log(res);
        });
    }
    render() {
        const {
            showIDCardModal,
            FrontimageList,
            FrontmaxFileSize,
            RemoveConfirm,
            BackmaxFileSize,
            BackimageList,
            ShowType,
            ShowDemoID,
            EgVisible,
            Loadingvisible,
        } = this.state;
        const { UploadName, Documents, DocData, imageRestriction } = this.props;
        const { docTypeId } = this.props.DocData;
        const { name: docTypeName } = this.props.DocData;
        let Submit = DocData.frontback
            ? !FrontmaxFileSize &&
              !BackmaxFileSize &&
              FrontimageList.length !== 0 &&
              BackimageList.length !== 0
            : !FrontmaxFileSize && FrontimageList.length !== 0;
        return (
            <div className="Uploadfiles">
                {/* 文件上传审核资料状态 */}
                {Documents && DocData.docStatusId != 0 ? (
                    <UploadStatus
                        DocData={DocData}
                        StatusId={DocData.docStatusId}
                        RemainingUploadTries={Documents.remainingUploadTries}
                        CloseStatus={(RemainingUploadTries) => {
                            this.props.VerificationMemberDocuments({
                                ["TryAgain" + DocData.docTypeId]:
                                    RemainingUploadTries,
                            });

                            this.setState({
                                showIDCardModal: false,
                            });
                        }}
                    />
                ) : (
                    <div className="UploadFilesSet">
                        <div className="Title">
                            <div className="name">
                                <img src={`${process.env.BASE_PATH}/img/icons/${DocData.icon}`} />
                                {DocData.name}
                            </div>
                            <div
                                className="eg"
                                onClick={() => {
                                    this.setState({
                                        EgVisible: true,
                                    });
                                }}
                            >
                                {translate("发帖说明")}
                            </div>
                        </div>
                        <p className="UploadNote">
                            {translate("以正确的 .jng、.png、.jepg 文件格式上传文档。 文件大小为")} {imageRestriction.size} {translate("/文件")}
                        </p>
                        {docTypeId == 3 && (
                            <p className="TextLightYellow">
                                {translate("请手持公民身份证（CCCD）正面和背面拍摄身份证照片。 要求面部照片和CCCD上的信息清晰。")}
                            </p>
                        )}
                        <div className="Content">
                            {/* 正面文件 */}
                            <div className="Frontside">
                                {DocData.frontback
                                    ? DocData.title1
                                    : DocData.name}
                                <Uploading
                                    SetmaxFileSize={(errors) => {
                                        this.setState({
                                            BackmaxFileSize: errors.maxFileSize,
                                            FrontbackMaxFileSize:
                                                errors.maxFileSize,
                                        });
                                    }}
                                    DocData={DocData}
                                    // maxFileSize={
                                    //     this.state.FrontbackMaxFileSize
                                    // }
                                    FrontbackMaxFileSize={
                                        this.state.FrontbackMaxFileSize
                                    }
                                    imageList={FrontimageList}
                                    onChange={(imageList, addUpdateIndex) => {
                                        this.onChange({
                                            FrontimageList: imageList,
                                            FrontbackMaxFileSize: false,
                                        });
                                    }}
                                    OpenRemoveConfirm={() => {
                                        this.setState({
                                            RemoveConfirm: true,
                                        });
                                        this.RemoveConfirm(1);
                                    }}
                                    imageRestriction={imageRestriction}
                                />
                            </div>
                            {/*  反面文件 */}
                            {DocData.frontback && (
                                <div className="Reverseside">
                                    {DocData.title2}
                                    <Uploading
                                        SetmaxFileSize={(errors) => {
                                            this.setState({
                                                BackmaxFileSize:
                                                    errors.maxFileSize,
                                                ReverseMaxFileSize:
                                                    errors.maxFileSize,
                                            });
                                        }}
                                        DocData={DocData}
                                        // maxFileSize={
                                        //     this.state.ReverseMaxFileSize
                                        // }
                                        ReverseMaxFileSize={
                                            this.state.ReverseMaxFileSize
                                        }
                                        imageList={BackimageList}
                                        onChange={(
                                            imageList,
                                            addUpdateIndex
                                        ) => {
                                            this.onChange({
                                                BackimageList: imageList,
                                                ReverseMaxFileSize: false,
                                            });
                                        }}
                                        OpenRemoveConfirm={() => {
                                            this.setState({
                                                RemoveConfirm: true,
                                            });
                                            this.RemoveConfirm(2);
                                        }}
                                        imageRestriction={imageRestriction}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="tryTime">
                            {translate("还有")}
                            (<span className="blue">{Documents.remainingUploadTries}</span>)
                            {translate("尝试次数")}
                        </p>
                        <Button
                            size="large"
                            type="primary"
                            block
                            onClick={() => {
                                let type =
                                    docTypeId == 1
                                        ? "Identification"
                                        : docTypeId == 2
                                        ? "Address"
                                        : docTypeId == 3
                                        ? "IdentificationWithRealTimeFace"
                                        : docTypeId == 4
                                        ? "Deposit"
                                        : docTypeId == 5
                                        ? "BankAccountOwner"
                                        : "";

                                Submit && this.ToUploadDocument(type);
                            }}
                            className={classNames({
                                Submit: true,
                            })}
                            disabled={!Submit}
                        >
                            {translate("上传")}
                        </Button>
                        {/* 查看示例 */}
                        <ShowEg
                            visibleModal={EgVisible}
                            SetEgVisible={() => {
                                this.setState({
                                    EgVisible: false,
                                });
                            }}
                            docTypeId={docTypeId}
                            docTypeName={docTypeName}
                        />
                    </div>
                )}
                
                <DynamicUploadingModal
                    Loadingvisible={Loadingvisible}
                    loadText={translate("上传文件中")}
                />
            </div>
        );
    }
}

/**
 * @description: 上传文件
 */
class Uploading extends React.Component {
    render() {
        const {
            imageList,
            maxFileSize,
            SetmaxFileSize,
            onChange,
            OpenRemoveConfirm,
            imageRestriction,
            DocData,
            FrontbackMaxFileSize,
            ReverseMaxFileSize,
        } = this.props;
        return (
            <React.Fragment>
                {/* <div className="SelectFile">
					<img src="/vn/img/icons/plus.svg" />选择文件
				</div> */}
                <Flexbox className="select">
                    <ImageUploading
                        multiple
                        value={imageList}
                        onChange={onChange}
                        maxNumber={maxNumber}
                        acceptType={["jpg", "jpeg", "png"]}
                        dataURLKey="data_url"
                        maxFileSize={
                            parseFloat(imageRestriction.size) * 1000000
                        }
                        onError={(errors) => {
                            SetmaxFileSize(errors);
                        }}
                    >
                        {({ onImageUpload, dragProps }) => (
                            <React.Fragment>
                                <Flexbox className="select" width="100%">
                                    {imageList.length == 0 ? (
                                        <Flexbox onClick={onImageUpload}>
                                            <div className="SelectFile">
                                                <img
                                                    src={`${process.env.BASE_PATH}/img/icons/plus.svg`}
                                                    {...dragProps}
                                                />
                                                {translate("选择文件")}
                                            </div>
                                        </Flexbox>
                                    ) : (
                                        imageList.map((image, index) => (
                                            <Flexbox
                                                key={index}
                                                className="image-item"
                                                width="100%"
                                                justifyContent="space-between"
                                                padding="10px"
                                            >
                                                <span className="name">
                                                    {image["file"].name}
                                                </span>
                                                <img
                                                    src={`${process.env.BASE_PATH}/img/icons/close.svg`}
                                                    onClick={() => {
                                                        OpenRemoveConfirm();
                                                    }}
                                                />
                                            </Flexbox>
                                        ))
                                    )}
                                </Flexbox>
                            </React.Fragment>
                        )}
                    </ImageUploading>
                </Flexbox>
                {(FrontbackMaxFileSize || ReverseMaxFileSize) &&
                    imageList.length == 0 && (
                        <div
                            className="error TextLightRed"
                            style={{ marginTop: "-10px" }}
                        >
                            <span>
                                {translate("文件大小超出")}{imageRestriction.size}
                            </span>
                        </div>
                    )}
            </React.Fragment>
        );
    }
}

export default Upload;
