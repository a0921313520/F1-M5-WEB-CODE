import React from "react";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";

export default class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeStatusString: "　",
            startDate: "2022/01/31 00:00:00",
            endDate: "2022/02/06 23:59:59",
        };

        this.dayRef = React.createRef();
        this.hourRef = React.createRef();
        this.minuteRef = React.createRef();
        this.secondRef = React.createRef();
        // 模拟测试
        // this.startTimeConfig = "2021/12/01 00:00:00";
        // this.endTimeConfig = "2021/12/01 23:59:59";
        this.readyStringConfig = "活 动 即 将 开 始";
        this.startStringConfig = "活 动 正 式 开 始";
        this.endStringConfig = "活 动 已 结 束";
        this.endTimeInterval = null;
    }
    componentDidMount() {
        get(ApiPort.RainLuckySpin)
            .then((res) => {
                const startDateTime = this.formatDate(res.startDate),
                    endDateTime = this.formatDate(res.endDate);
                this.startTimeConfig = res.startDate
                    ? startDateTime
                    : "2022/01/31 00:00:00";
                this.endTimeConfig = res.endDate
                    ? endDateTime
                    : "2022/02/06 23:59:59";
                this.setState(
                    {
                        startDate: startDateTime,
                        endDate: endDateTime,
                    },
                    () => {
                        this.counterEndTimeRun();
                    }
                );
            })
            .catch((error) => console.log(error));
    }
    componentWillUnmount() {
        clearInterval(this.endTimeInterval);
    }
    formatDate = (dateString) => {
        return dateString.replace("-", "/").replace("-", "/").replace("T", " ");
    };
    counterEndTimeRun = () => {
        // 计算活动时间状态(未开始/已开始/已结束)
        // 是否开始(大于0代表未开始)
        this.remainderTime =
            new Date(this.startTimeConfig).getTime() - new Date().getTime();
        // 是否结束(大于0代表未结束)
        this.remainderTimeEnd =
            new Date(this.endTimeConfig).getTime() - new Date().getTime();

        if (this.remainderTime > 0) {
            this.countEndTime(this.remainderTime);
            this.setState({ activeStatusString: this.readyStringConfig });
            this.props.setActiveStatus("ready");
        } else {
            if (this.remainderTimeEnd > 0) {
                this.countEndTime(this.remainderTimeEnd);
                this.setState({ activeStatusString: this.startStringConfig });
                this.props.setActiveStatus("start");
            } else {
                this.countEndTime(null);
                this.setState({ activeStatusString: this.endStringConfig });
                this.props.setActiveStatus("end");
            }
        }
    };
    // 计算剩余时间
    countEndTime = (time) => {
        if (time > 0) {
            let endTime = time / 1000;
            this.endTimeInterval = setInterval(() => {
                if (!this.secondRef.current) {
                    return;
                }
                const currentTimeCount = this.formatSeconds(--endTime);
                this.secondRef.current.innerText = currentTimeCount[3];
                this.minuteRef.current.innerText = currentTimeCount[2];
                this.hourRef.current.innerText = currentTimeCount[1];
                this.dayRef.current.innerText = currentTimeCount[0];

                if (endTime < 1) {
                    this.remainderTimeEnd =
                        new Date(this.endTimeConfig).getTime() -
                        new Date().getTime();
                    if (this.remainderTimeEnd > 0) {
                        endTime = this.remainderTimeEnd / 1000;
                        this.setState({
                            activeStatusString: this.startStringConfig,
                        });
                        this.props.setActiveStatus("start");
                    } else {
                        this.setState({
                            activeStatusString: this.endStringConfig,
                        });
                        this.props.setActiveStatus("end");
                        clearInterval(this.endTimeInterval);
                    }
                }
            }, 1000);
        } else {
            clearInterval(this.endTimeInterval);
        }
    };
    // 前置加零
    checkZero = (str) => {
        str = str.toString();
        return str.length === 1 ? "0" + str : str;
    };
    // 根据秒格式化时间
    formatSeconds = (value) => {
        var seconds = parseInt(value), // 秒
            minute = 0, // 分
            hour = 0, // 小时
            day = 0; // 天

        if (seconds >= 60) {
            minute = parseInt(seconds / 60);
            seconds = parseInt(seconds % 60);
            if (minute >= 60) {
                hour = parseInt(minute / 60);
                minute = parseInt(minute % 60);
                if (hour >= 24) {
                    day = parseInt(hour / 24);
                    hour = parseInt(hour % 24);
                }
            }
        }

        return [
            this.checkZero(parseInt(day)),
            this.checkZero(parseInt(hour)),
            this.checkZero(parseInt(minute)),
            this.checkZero(parseInt(seconds)),
        ];
    };
    render() {
        return (
            <div className="ramain-time-wrapper">
                <div className="ramain-time-title">
                    {this.state.activeStatusString}
                </div>
                <div className="remainder-time-wrap">
                    <div className="remainder-item">
                        <div className="date-count-wrap" ref={this.dayRef}>
                            00
                        </div>
                        <div className="remainder-sign">天</div>
                    </div>
                    <div className="remainder-item">
                        <div className="date-count-wrap" ref={this.hourRef}>
                            00
                        </div>
                        <div className="remainder-sign">时</div>
                    </div>
                    <div className="remainder-item">
                        <div className="date-count-wrap" ref={this.minuteRef}>
                            00
                        </div>
                        <div className="remainder-sign">分</div>
                    </div>
                    <div className="remainder-item">
                        <div className="date-count-wrap" ref={this.secondRef}>
                            00
                        </div>
                        <div className="remainder-sign">秒</div>
                    </div>
                </div>
                <div className="activity">
                    <div className="activity-remainder-time">
                        <div>- 活动时间 -</div>
                        <div>
                            {this.state.startDate} ~ {this.state.endDate}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
