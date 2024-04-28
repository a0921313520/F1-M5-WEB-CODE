import React from "react";
import { Carousel, Tabs, Modal, Button } from "antd";
import {translate} from "$ACTIONS/Translate";
const { TabPane } = Tabs;
class HowUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rapidIndex: 0,
            generalIndex: 0,
        };
        this.RapidSlider = React.createRef();
    }

    componentDidMount() {
        document.addEventListener(
            "keydown",
            function (event) {
                event.stopPropagation();
                console.log(event);
            },
            true
        );
    }

    rapidPrevClick = () => {
        this.RapidSlider.current.slick.slickPrev();
    };

    rapidNextClick = () => {
        console.log("checkpoint", this.RapidSlider);
        this.RapidSlider.current.slick.slickNext();
    };

    rapidOnChange = (n) => {
        console.log(n);
        this.setState({ rapidIndex: n });
    }

    render() {
        const defaultTabNum = this.props.tabNum;

        const CryptoLessons = [
            {
                index: 0,
                id: "upload-ls-1",
                text: translate("选择要上传的文件。 确保您的文件小于 7​​MB，且格式为 .JPG、JPEG 或 .PNG。 请参阅上传说明以了解您的文件是否受支持"),
                content: () => <div />,
            },
            {
                index: 1,
                id: "upload-ls-2",
                text: translate("上传文件后，单击“提交”。 您最多可以发送文件 3 次。"),
                content: () => <div />,
            },
            {
                index: 2,
                id: "upload-ls-3",
                text: translate("一旦您提交文件，我们的系统将对其进行验证，并在完成后通知您。"),
                content: () => <div />,
            },
            {
                index: 3,
                id: "upload-ls-4",
                text: translate("一旦您的文件获得批准，我们的系统将自动验证您的帐户。 如果您的文件被拒绝，您可以重试。"),
                content: () => <div />,
            },
        ];

        const { visibleModal, setModal } = this.props;

        return (
            <Modal
                title={translate("发帖说明")}
                footer={null}
                maskClosable={true}
                onCancel={() => {
                    setModal({ visibleModal: false });
                    this.RapidSlider.current.slick.slickGoTo(0);
                    this.rapidOnChange(0);
                }}
                visible={visibleModal}
                width={960}
                className="UsdtTeachModalStyle"
            >
                <React.Fragment>
                    <div id="upload_wrapper" style={{ textAlign: "center" }}>
                        <Carousel
                            key={0}
                            ref={this.RapidSlider}
                            className="custom-Carousel"
                            afterChange={(current) => {
                                this.rapidOnChange(current);
                            }}
                        >
                            {CryptoLessons.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div
                                        key={item.id}
                                        className={`upload-lesson-wrap ${item.id}`}
                                    >
                                        <div className="crypto-lesson-body">
                                            {item.content()}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </Carousel>
                        {this.state.rapidIndex > 0 && (
                            <button
                                className="slide-arrow slide-prev"
                                onClick={this.rapidPrevClick}
                            />
                        )}
                        {this.state.rapidIndex < CryptoLessons.length - 1 && (
                            <button
                                className="slide-arrow slide-next"
                                onClick={this.rapidNextClick}
                            />
                        )}
                        <div className="setText">
                            <h5>
                                {translate("步骤")}
                                {CryptoLessons[this.state.rapidIndex].index + 1}
                            </h5>
                            <p>{CryptoLessons[this.state.rapidIndex].text}</p>
                        </div>
                        <Button
                            size="large"
                            type="primary"
                            block
                            style={{ width: "334px" }}
                            onClick={() => {
                                setModal({ visibleModal: false });
                                this.RapidSlider.current.slick.slickGoTo(0);
                                this.rapidOnChange(0);
                            }}
                        >
                            {translate("关闭")}
                        </Button>
                    </div>
                </React.Fragment>
            </Modal>
        );
    }
}
export default HowUpload;
