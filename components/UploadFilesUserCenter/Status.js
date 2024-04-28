import React, { Component } from "react";
import Flexbox from "@/Flexbox/";
import { Button } from "antd";
import { translate } from "$ACTIONS/Translate";

export default class UploadStatus extends Component {
    render() {
        /**
         *@param {StatusId}
         *@type {0}  @description 默认0  @description 没有附件
         *@type {1}  @description 默认1	@description 处理中
         *@type {2}  @description 默认2	@description 批准
         *@type {3}  @description 默认3	@description 拒绝
         */
        const { StatusId, CloseStatus, RemainingUploadTries, DocData } =
            this.props;
        return (
            <div>
                <div className="Title">
                    <div className="name">
                        <img src={`${process.env.BASE_PATH}/img/icons/${DocData.icon}`} />{" "}
                        {DocData.name}
                    </div>
                </div>
                <Flexbox className="StatusBox">
                    {StatusId == 1 && (
                        <Flexbox
                            flexFlow="column"
                            alignItems="center"
                            width="100%"
                        >
                            <img src={`${process.env.BASE_PATH}/img/icons/review.svg`} />
                            <h2>{translate("审核中")}</h2>
                            <p className="note">{translate("您的文件正在审核中")}</p>
                        </Flexbox>
                    )}

                    {StatusId == 2 && (
                        <Flexbox
                            flexFlow="column"
                            alignItems="center"
                            width="100%"
                        >
                            <img src={`${process.env.BASE_PATH}/img/icons/verified.svg`} />
                            <h2>{translate("认证成功")}</h2>
                            <p className="note">{translate("您的文档已成功验证")}</p>
                        </Flexbox>
                    )}

                    {StatusId == 3 && (
                        <Flexbox
                            flexFlow="column"
                            alignItems="center"
                            width="100%"
                        >
                            <img src={`${process.env.BASE_PATH}/img/icons/rejected.svg`} />
                            <h2>{translate("验证失败")}</h2>
                            {RemainingUploadTries != 0 ? (
                                <React.Fragment>
                                    <p className="note">{translate("您的文档验证失败")}</p>
                                    <small style={{ marginTop: "10px" }}>
                                        {translate("还有")}
                                        (<span className="blue">{RemainingUploadTries}</span>)
                                        {translate("尝试次数")}
                                    </small>
                                    <Button
                                        onClick={() => {
                                            CloseStatus(RemainingUploadTries);
                                        }}
                                        size="large"
                                        type="success"
                                    >
                                        {translate("重试")}
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <p className="note">
                                        {translate("您的身份验证尝试次数已超过 3 次。 请联系在线聊天")}
                                    </p>
                                    <small style={{ marginTop: "10px" }}>
                                        {translate("还有")}
                                        (<span className="blue">0</span>)
                                        {translate("尝试次数")}
                                    </small>
                                    <Button
                                        onClick={() => global.PopUpLiveChat()}
                                        size="large"
                                        type="primary"
                                    >
                                        {translate("在线客服")}
                                    </Button>
                                </React.Fragment>
                            )}
                        </Flexbox>
                    )}
                </Flexbox>
            </div>
        );
    }
}
