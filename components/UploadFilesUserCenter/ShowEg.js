import React from "react";
import { Carousel, Tabs, Modal, Button } from "antd";
import { translate } from "$ACTIONS/Translate";
const { TabPane } = Tabs;

class ShowEg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rapidIndex: 0,
            generalIndex: 0,
        };
    }

    componentDidMount() { }

    titleText = () => {
        const { docTypeId } = this.props;
        switch (docTypeId) {
            case 1:
                return translate("公民身份");
            case 2:
                return translate("地址2(大写)");
            case 3:
                return translate("人脸识别照片(大写)");
            case 4:
                return translate("存款证明(大写)");
            case 5:
                return translate("银行账户(大写)");
            default:
                break
        }
    }
    render() {
        /* 身份证 */
        const Type1 = [
            {
                index: 0,
                content: (
                    <ol>
                        <li>{translate("• 照片必须具有高清晰度。")}</li>
                        <li>{translate("• 图像背景需要清晰并与顶部对齐。")}</li>
                        <li>{translate("• CCCD 内容和布局需要清晰显示。")}</li>
                        <li>{translate("• 完美的照明条件，无反射。")}</li>
                    </ol>
                ),
            },
            {
                index: 1,
                content: (
                    <ol>
                        <li>{translate("• CCCD 的文字和图像模糊且无法读取。")}</li>
                        <li>{translate("• 背景图案不清晰。")}</li>
                        <li>{translate("• 图像上应有足够的光线且无阴影。")}</li>
                    </ol>
                ),
            },
        ];
        /* 地址 */
        const Type2 = [
            {
                index: 0,
                content: (
                    <ol>
                        <li>{translate("• 图像清晰完整。")}</li>
                        <li>{translate("• 必须显示文件的完整信息。")}</li>
                        <li>{translate("• 文件必须有效且未过期。")}</li>
                    </ol>
                ),
            },
            {
                index: 1,
                content: (
                    <ol>
                        <li>{translate("• 图像模糊或不完整。")}</li>
                        <li>{translate("• 某些信息被屏蔽。")}</li>
                        <li>{translate("• 图像出现反转或反射阴影。")}</li>
                    </ol>
                ),
            },
        ];
        /* 人脸识别 */
        const Type3 = [
            {
                index: 0,
                content: (
                    <ol>
                        <li>{translate("• 人脸、ID信息清晰无遮挡。")}</li>
                        <li>{translate("• 拍照时将焦点放在CCCD 上。 注意：拍照时请点击手机屏幕，以对准拍摄时清晰的图像。")}</li>
                        <li>{translate("• 完美的照明。")}</li>
                    </ol>
                ),
            },
            {
                index: 1,
                content: (
                    <ol>
                        <li>{translate("• CCCD 距离摄像机太远，内容信息不清晰。")}</li>
                        <li>{translate("• 脸部模糊且图像倾斜。")}</li>
                        <li>{translate("• CCCD 图像从脸部隐藏。")}</li>
                        <li>{translate("• 发布或捕获时请勿反转CCCD 图像。")}</li>
                        <li>{translate("注意：拍照时请点击手机屏幕，以对准拍摄时清晰的图像。")}</li>
                    </ol>
                ),
            },
        ];

        /* 存款证明 */
        const Type4 = [
            {
                index: 0,
                content: (
                    <ol>
                        <li>{translate("• 图像清晰完整。")}</li>
                        <li>{translate("• 必须显示文件的完整信息。")}</li>
                        <li>{translate("• 文件必须有效且未过期。")}</li>
                    </ol>
                ),
            },
            {
                index: 1,
                content: (
                    <ol>
                        <li>{translate("• 图像模糊或不完整。")}</li>
                        <li>{translate("• 某些信息被屏蔽。")}</li>
                        <li>{translate("• 图像出现反转或反射阴影。")}</li>
                    </ol>
                ),
            },
        ];
        /* 银行账户证明 */

        const Type5 = [
            {
                index: 0,
                content: (
                    <ol>
                        <li>{translate("• 图像清晰完整。")}</li>
                        <li>{translate("• 必须显示文件的完整信息。")}</li>
                        <li>{translate("• 文件必须有效且未过期。")}</li>
                    </ol>
                ),
            },
            {
                index: 1,
                content: (
                    <ol>
                        <li>{translate("• 图像模糊或不完整。")}</li>
                        <li>{translate("• 某些信息被屏蔽。")}</li>
                        <li>{translate("• 图像出现反转或反射阴影。")}</li>
                    </ol>
                ),
            },
        ];

        const { visibleModal, SetEgVisible, docTypeId, docTypeName } =
            this.props;
        const TypeData =
            docTypeId == 1
                ? Type1
                : docTypeId == 2
                    ? Type2
                    : docTypeId == 3
                        ? Type3
                        : docTypeId == 4
                            ? Type4
                            : Type5;
        return (
            <Modal
                title={this.titleText()}
                footer={null}
                maskClosable={true}
                onCancel={() => {
                    SetEgVisible();
                }}
                visible={visibleModal}
                width={960}
                className="UsdtTeachModalStyle"
                centered={true}
            >
                <div className="EgBox">
                    {TypeData.map((item, index) => (
                        <div key={index + "List"}>
                            <img
                                src={`${process.env.BASE_PATH}/img/upload/eg/${index == 0 ? docTypeId : docTypeId + ".1"
                                    }.jpg`}
                            />
                            <div
                                className="setText"
                                style={{ paddingLeft: "10px" }}
                            >
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <center>
                    <Button
                        size="large"
                        type="primary"
                        block
                        style={{ width: "334px" }}
                        onClick={() => {
                            SetEgVisible();
                        }}
                    >
                        {translate("关闭")}
                    </Button>
                </center>
            </Modal>
        );
    }
}
export default ShowEg;
