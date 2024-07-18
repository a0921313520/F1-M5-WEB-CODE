import React from "react";
import { get } from "$ACTIONS/TlcRequest";
import { getQueryVariable } from "$ACTIONS/helper";
import { ApiPort } from "$ACTIONS/TLCAPI";
import Router from "next/router";
import { translate } from "$ACTIONS/Translate";
import { connect } from "react-redux";
import { userCenterActions } from "$STORE/userCenterSlice";
import { pathNameList } from "$DATA/me.static";
class Notice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            noticeList: [],
            currTime: 0,
        };

        this.updateNoticeList = this.updateNoticeList.bind(this);
        this.marquee = React.createRef(); // 公告轮播节点
        this.timerInter = null;
        this.timertimeout = null;
    }
    componentDidMount() {
        if (getQueryVariable("redirectToken")) return;
        if (sessionStorage.getItem("isGamePage")) return;
        if (
            this.props.propsData &&
            this.props.propsData.status &&
            localStorage.getItem("access_token")
        ) {
            //已登录，因为父组件在被判断时会先是0后是1，会触发请求两次，所以加个限制
            get(
                ApiPort.Announcements +
                    "&messageTypeOptionID=10&pageSize=8&pageIndex=1",
            )
                .then((res) => {
                    res?.result?.announcementsByMember?.length &&
                        this.updateNoticeList(res.result.announcementsByMember);
                })
                .catch((error) => {
                    console.log("GETNewsUrl" + error);
                });
        } else if (!localStorage.getItem("access_token")) {
            //未登录
            get(
                ApiPort.Announcements +
                    "&messageTypeOptionID=10&pageSize=8&pageIndex=1",
            )
                .then((res) => {
                    res?.result?.announcementsByMember?.length &&
                        this.updateNoticeList(res.result.announcementsByMember);
                })
                .catch((error) => {
                    console.log("GETNewsUrl" + error);
                });
        }
    }
    componentWillUnmount() {
        // 清除轮播定时器
        clearInterval(this.timerInter);
        clearTimeout(this.timertimeout);
        this.marquee.current.onmouseenter = null;
        this.marquee.current.onmouseleave = null;
        // 清除公告设置方法（防止异步内存泄漏）
        this.updateNoticeList = () => {};
        this.setState = () => false;
    }
    updateNoticeList(list) {
        this.setState(
            {
                noticeList: list,
            },
            function () {
                list &&
                    list.length > 1 &&
                    this.marqueeAnimate(this.marquee.current);
            },
        );
    }
    marqueeAnimate() {
        const speed = 300; // 单条数据向上滚动速度（单位 ms）
        const target = this.marquee.current; // 父层元素
        const containerUl = target.childNodes[0].childNodes[0]; // Ul 元素
        const containerLi = containerUl.childNodes[0]; // Li 元素
        const containerLiLen = containerUl.childNodes.length; // Li 元素长度
        const containerUlHeight = containerUl.clientHeight; // Ul 元素的高度
        const containerLiHeight = containerLi.clientHeight; // Li 元素的高度

        let currHeight = containerLiHeight; // 滚动过程中的高度临时变量
        containerUl.appendChild(containerLi.cloneNode(true)); // 将第一条数据添加到最后一条（防止最后一条为空的情况）

        // 避免重复执行setInterval，执行前进行清除操作
        clearInterval(this.timerInter);
        clearTimeout(this.timertimeout);

        // 间隔切换公告数据
        const timerRun = () => {
            this.timerInter = setInterval(() => {
                // 同步更新对应的发布时间
                const currIndex = currHeight / containerLiHeight;
                this.setState({
                    currTime: currIndex === containerLiLen ? 0 : currIndex,
                });
                // 通过设置Ul元素的margin-top进行切换Li元素的位置
                containerUl.setAttribute(
                    "style",
                    "transition-duration: " +
                        speed +
                        "ms;margin-top: -" +
                        currHeight +
                        "px;",
                );
                // 递增Li条数（高度）
                currHeight += containerLiHeight;

                // 如果当前高度大于总高度则重置为0并等待最后一条动画完成后趁它不注意重置为第一条
                if (currHeight > containerUlHeight) {
                    currHeight = containerLiHeight;
                    this.timertimeout = setTimeout(() => {
                        containerUl.setAttribute(
                            "style",
                            "transition-duration: 0;margin-top: 0;",
                        );
                    }, speed);
                }
            }, 3000);
        };

        timerRun();

        // 绑定事件
        target.onmouseenter = () => {
            clearInterval(this.timerInter);
            clearTimeout(this.timertimeout);
        };
        target.onmouseleave = () => {
            timerRun();
        };
    }
    // 时区 +8 小时
    dealWithTime(item) {
        let times =
            new Date(item.replace("T", " ").replace(/\-/g, "/")).getTime() +
            60 * 60 * 8 * 1000;

        let myDate = new Date(times);
        let y = myDate.getFullYear();
        let m = myDate.getMonth() + 1;
        let d = myDate.getDate();
        let h = myDate.getHours();
        let mi = myDate.getMinutes();
        let s = myDate.getSeconds();

        if (m < 10) {
            m = "0" + m.toString();
        }
        if (d < 10) {
            d = "0" + d.toString();
        }
        if (h < 10) {
            h = "0" + h.toString();
        }
        if (mi < 10) {
            mi = "0" + mi.toString();
        }
        if (s < 10) {
            s = "0" + s.toString();
        }

        return `${d}-${m}-${y} ${h}:${mi}:${s}`;
    }
    goMessage = () => {
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
            return;
        }
        sessionStorage.setItem("messageType", "2");
        const pathKey = this.props.userCenterTabKey;
        if (~global.location.pathname.indexOf(`/vn/${pathNameList[pathKey]}`)) {
            return; //禁止重复选择一样的tab
        } else {
            this.props.changeUserCenterTabKey("message");
            Router.push("/notification");
        }
    };
    render() {
        return (
            <div id="t_header_notice_wrapper" className="notice-wrap">
                {/* Notice 公告 */}
                <div className="manager-picture">
                    <img
                        width={"48"}
                        height={"48"}
                        src={`${process.env.BASE_PATH}/img/icon/fun.svg`}
                        alt="fun88vn"
                    />
                </div>
                <div
                    className="marquee-container-wrapper"
                    onClick={this.goMessage}
                >
                    <div className="marquee-title">
                        <span>{translate("乐天使")}</span>
                        <span>
                            {this.state.noticeList.length
                                ? this.state.noticeList[this.state.currTime] &&
                                  this.state.noticeList[this.state.currTime]
                                      .sendOn &&
                                  this.dealWithTime(
                                      this.state.noticeList[this.state.currTime]
                                          .sendOn,
                                  )
                                : null}
                        </span>
                    </div>
                    <div className="marquee-container">
                        <div className="tlc-notice-wrap" ref={this.marquee}>
                            <div className="tlc-notice">
                                <ul>
                                    {this.state.noticeList.length
                                        ? this.state.noticeList.map(
                                              (val, index) => {
                                                  return val.isRunningText ? (
                                                      <li
                                                          key={index}
                                                          data-marquee-item
                                                          title={val.topic}
                                                      >
                                                          {val.topic}
                                                      </li>
                                                  ) : (
                                                      <li key={index}></li>
                                                  );
                                              },
                                          )
                                        : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        userCenterTabKey: state.userCenter.userCenterPageTabKey,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey: (tabkey) => {
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
