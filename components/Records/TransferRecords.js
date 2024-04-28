import React from "react";
import { Row, Col, Pagination, Button, Empty } from "antd";
import { formatAmount } from "$ACTIONS/util";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { formatYearMonthDate } from "$ACTIONS/util";
import {translate} from "$ACTIONS/Translate";

class TransferRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            currentPage: 1,
        };

        this.formatRecords = this.formatRecords.bind(this); // 格式化充值记录
        this.changePage = this.changePage.bind(this); // 改变页数
        this.onePageSize = 10;
    }
    componentDidMount() {
        this.props.transferData.length && this.formatRecords();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.transferData.length !== this.props.transferData.length) {
            this.formatRecords();
        }
    }
    formatRecords() {
        this.props.transferData.forEach((val) => {
            val.createTime = formatYearMonthDate(val.transactionDate);
            switch (val.status) {
                case -1:
                    val.statusName = translate("待处理");
                    val.statusType = "r-pending";
                    break;
                case 0:
                    val.statusName = translate("处理中");
                    val.statusType = "r-process";
                    break;
                case 1:
                    val.statusName = translate("成功");
                    val.statusType = "r-success";
                    break;
                case -2:
                    val.statusName = translate("失败");
                    val.statusType = "r-error";
                    break;
                default:
                    val.statusName = "";
                    val.statusType = "";
                    break;
            }
        });
        this.setState({
            currentList: this.props.transferData.slice(0, this.onePageSize), // 当前展示数据
        });
    }
    changePage(index) {
        const currPage = typeof index === "number" ? index - 1 : 0;
        let startIndex = currPage * this.onePageSize; // 当前起始下标
        this.setState({
            currentPage: index,
            currentList: this.props.transferData.slice(
                startIndex,
                startIndex + this.onePageSize
            ), // 当前展示数据
        });
    }
    render() {
        return (
            <div className="records-list-wrap">
                {this.state.currentList.length ? (
                    <Row>
                        <Col span={4}>{translate("时间")}</Col>
                        <Col span={5}>{translate("交易方式")}</Col>
                        <Col span={3}>{translate("金额")}</Col>
                        <Col span={5}>{translate("状态")}</Col>
                        <Col span={7}>{translate("备注")}</Col>
                    </Row>
                ) : null}
                {this.state.currentList.length ? (
                    this.state.currentList.map((val, index) => {
                        if (val.toAccount === "REWARD_POINT") return; // 同樂幣不顯示在紀錄上
                        return (
                            <Row key={index}>
                                <Col span={4} className="gray-color">
                                    {val.createTime}
                                </Col>
                                <Col span={5} className="left">
                                    <div>
                                        {val.fromAccountLocalizedName} {translate("至")}{" "}
                                        {val.toAccountLocalizedName}
                                    </div>
                                    <div>
                                        {val.transactionId}
                                        <CopyToClipboard
                                            text={val.transactionId}
                                            onCopy={() => {
                                                this.props.recordAlert(translate("复制成功"));
                                            }}
                                        >
                                            <img
                                                style={{ paddingLeft: "10px",cursor:"pointer" }}
                                                src={`${process.env.BASE_PATH}/img/wallet/Copy_icon.svg`}
                                            />
                                        </CopyToClipboard>
                                    </div>
                                </Col>
                                <Col span={3}>¥ {formatAmount(val.amount)}</Col>
                                <Col
                                    span={5}
                                    className={`left pointer ${val.statusType}`}
                                >
                                    <div className="close">
                                        <div className="small-circle">
                                            {val.statusName}
                                        </div>
                                        <div className="small-sign">
                                            {formatYearMonthDate(val.transactionDate)}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={7} className="record-distance">
                                    <div
                                        className="reason-msg"
                                        style={{
                                            textAlign:
                                                val.remark &&
                                                val.remark.length > 16
                                                    ? "left"
                                                    : "center",
                                        }}
                                        title={val.remark}
                                    >
                                        {val.remark}
                                    </div>
                                </Col>
                            </Row>
                        );
                    })
                ) : (
                    <Col className="center" span={24}>
                        <Empty
                            image={"/vn/img/icon/img-no-record.svg"}
                            className="big-empty-box"
                            description={translate("没有数据")}
                        />
                    </Col>
                )}
                <div className="line-distance"></div>
                <Pagination
                    className="gray-pagination"
                    current={this.state.currentPage}
                    defaultPageSize={this.onePageSize}
                    hideOnSinglePage={true}
                    total={this.props.transferData.length}
                    onChange={this.changePage}
                />
            </div>
        );
    }
}

export default TransferRecords;
