import React from "react";
import { Modal, Form, Button, message} from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import moment from "moment";
import dynamic from "next/dynamic";
import { translate } from "$ACTIONS/Translate";
import 'moment/locale/vi';
moment.updateLocale('vi',{
    weekdays: ['Chủ nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    weekdaysShort: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    weekdaysMin:  ["CN", "Hai", "Ba", "Tu", "Năm", "Sáu", "Bảy"],
    week: {
        dow: 1,
    }
});
moment.locale('vi');
const DatePicker = dynamic(import("antd/lib/date-picker"), {
    loading: () => (
        <div className="ant-skeleton ant-skeleton-with-avatar ant-skeleton-active">
            <div className="ant-skeleton-content">
                <ul className="ant-skeleton-paragraph">
                    <li></li>
                </ul>
            </div>
        </div>
    ),
});

const { Item } = Form;

class DateRange extends React.Component {
    static defaultProps = {
        dateRangeLimit: 90,
    };
    constructor(props) {
        super(props);

        this.state = {
            startValue: null,
            endValue: null,
        };

        this.maxTime = new Date().getTime();
        this.minTime = new Date(
            new Date().getTime() -
                this.props.dateRangeLimit * 24 * 60 * 60 * 1000
        ).getTime();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let formatDate = this.props.dateRangeLimit + 1;
            if (values.startTime > values.endTime) {
                message.error(translate("开始时间不能大于结束时间！"));
                return;
            }
            if (
                (values.endTime - values.startTime) / 1000 / 60 / 60 / 24 >=
                formatDate
            ) {
                message.error(translate("日期必须在") + formatDate + translate("天内！"));
                return;
            }
            if (!err) {
                this.props.closeRange();
                this.props.setDate({
                    startTime: moment(values.startTime).format("YYYY-MM-DD"),
                    endTime: moment(values.endTime).format("YYYY-MM-DD"),
                });
            }
        });
    };
    disabledDate = (value) => {
        if (this.props.forDailyGiftHistory || this.props.forMyRebate) {
            return (
                value &&
                (value.valueOf() <
                    new Date(
                        new Date().getTime() -
                            this.props.dateRangeLimit * 24 * 60 * 60 * 1000
                    ).getTime() ||
                    value.valueOf() > this.maxTime)
            );
        }
        return (
            value &&
            (value.valueOf() <
                new Date(
                    new Date().getTime() - 90 * 24 * 60 * 60 * 1000
                ).getTime() ||
                value.valueOf() > this.maxTime)
        );
    };
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
    onStartChange = (value) => {
        this.onChange("startValue", value);
    };
    onEndChange = (value) => {
        this.onChange("endValue", value);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { forDailyGiftHistory, forMyRebate } = this.props;
        const defaultValueForStartTime =
            forDailyGiftHistory || forMyRebate
                ? moment(this.maxTime - 24 * 60 * 60 * 1000)
                : moment(this.minTime);
        const defaultValueForEndTime = forDailyGiftHistory
        ? moment(this.minTime + 24 * 60 * 60 * 1000)
        : moment(this.maxTime);
        return (
            <Modal
                className={`betRecords-dateRange ${this.props.classNameModal}`}
                title={this.props.title ? this.props.title : translate("自定义")}
                visible={this.props.visible}
                onCancel={this.props.closeRange}
                width={400}
                footer={null}
            >
                <Form
                    className="verification-form-wrap"
                    {...formItemLayout}
                    onSubmit={this.handleSubmit}
                >
                    {!this.props.forDailyGiftHistory && (
                        <div className="betRecords-dateRange-hint">
                            {this.props.dateRangeLimit == 6 ? (
                                <div>
                                    {translate("搜索覆盖范围固定为 7 天。 允许信息检索长达 90 天。")}
                                </div>
                            ) : (
                                <div>{translate("搜索覆盖范围固定为 7 天。 允许信息检索长达 90 天。")}</div>
                            )}
                        </div>
                    )}

                    <Item label={translate("开始日期")}>
                        {getFieldDecorator("startTime", {
                            rules: [
                                { required: true, message: translate("选择日期")},
                            ],
                        })(
                            <DatePicker
                                size="large"
                                showToday={false}
                                allowClear={false}
                                dropdownClassName={`disabled-date ${this.props.classNameDatePicker}`}
                                style={{ width: "100%" }}
                                defaultPickerValue={defaultValueForStartTime}
                                disabledDate={this.disabledDate}
                                format="DD-MM-YYYY"
                                placeholder={translate("选择日期")}
                                // onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                                locale={moment.locale()}
                            />
                        )}
                    </Item>
                    <Item label={translate("结束日期")}>
                        {getFieldDecorator("endTime", {
                            rules: [
                                { required: true, message: translate("选择日期")},
                            ],
                        })(
                            <DatePicker
                                size="large"
                                showToday={false}
                                allowClear={false}
                                dropdownClassName={`disabled-date ${this.props.classNameDatePicker}`}
                                style={{ width: "100%" }}
                                defaultPickerValue={defaultValueForEndTime}
                                disabledDate={this.disabledDate}
                                format="DD-MM-YYYY"
                                placeholder={translate("选择日期")}
                                // onChange={this.onEndChange}
                                locale={moment.locale()}
                            />
                        )}
                    </Item>
                    <div className="line-distance"></div>
                    <Item {...tailFormItemLayout}>
                        <div className="btn-wrap">
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                {translate("提交")}
                            </Button>
                        </div>
                    </Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({ name: "DateRange" })(DateRange);
