import React from "react";
import {
    Modal,
    Pagination,
    Tabs,
    Radio,
    Select,
    Button,
    Icon,
    message,
    Empty,
} from "antd";
import { get, patch } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
// 针对消息中心UAT新增样式表
import { translate } from "$ACTIONS/Translate";
const { TabPane } = Tabs;
const { Option } = Select;

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemMessageList: [], // 当前展示的系统消息
            myMessageList: [], // 当前展示的我的消息
            myMessageType: "2", // 我的消息分类（交易/个人）
            countSystemSize: 0, // 系统消息总长度
            countPersonSize: 0, // 我的消息总长度
            systemMessageHasUnRead: false, // 是否有未读消息公告
            myMessageHasUnRead1: 0, // 通知-交易未读数量
            myMessageHasUnRead2: 0, // 通知-个人未读数量
            currentPage: 1,
            minIndex: 0,
            maxIndex: 0,
            totalPage: 0, // 總數
            pageSize: 8, // 一頁顯示的數量
            originHeightOfTitle: 0,
            originHeightOfPersonalMessageTitle: 0,
        };
        this.currentSize = 8; // 当前每页条数
        this.systemMessageType = 0; // 系统消息类型记录
        this.systemPageIndex = 1; // 系统消息页数
        this.personMessageType = 0; // 我的消息类型记录
        this.personPageIndex = 1; // 我的消息页数
        this.getSystemData = this.getSystemData.bind(this); // 获取系统消息
        this.getPersonData = this.getPersonData.bind(this); // 获取我的消息
        this.markAllRead = this.markAllRead.bind(this); // 标记全部消息为已读
        this.filterPersonData = this.filterPersonData.bind(this); // 切换我的消息（交易/个人）分类
        this.toggleDetail = this.toggleDetail.bind(this); // 标记系统消息已读并获取详情
        this.stagEventTransition = this.stagEventTransition.bind(this);
        this.stagEventSystem = this.stagEventSystem.bind(this);
        this.isFinishFrontData = []; // 是否已获取完成数据
        this.messageUnReadTimer = null;
        this.currentMessageType = sessionStorage.getItem("messageType") || "1";
    }
    componentDidMount() {
        this.getPersonData("0");
        this.getSystemData("0");

        this.messageUnReadTimer = setInterval(() => {
            this.getPersonData();
            this.getSystemData();
        }, 120000);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState !== this.state) {
            if (
                !this.state.myMessageHasUnRead1 &&
                !this.state.myMessageHasUnRead2 &&
                !this.state.systemMessageHasUnRead
            ) {
                this.props.clearRedDot();
            }
        }
    };

    componentWillUnmount() {
        clearInterval(this.messageUnReadTimer);
        this.setState = () => false;
    }
    // 切换显示详情
    toggleDetail(e, detail) {
        e.persist();
        let self = this;
        let setLoading = this.props.setLoading,
            // memberCode = this.props.memberCode;
            memberCode = localStorage.getItem("memberCode");
        const URLObject = detail.memberNotificationID
            ? [
                  ApiPort.InboxMessageIndividualDetail +
                      "&MessageID=" +
                      detail.messageID,
                  ApiPort.ActionOnInboxMessage,
                  {
                      personalMessageUpdateItem: [
                          {
                              messageID: detail.messageID,
                              memberNotificationID: detail.memberNotificationID,
                              isRead: true,
                              isOpen: true,
                          },
                      ],
                      actionBy: memberCode,
                      timestamp: moment().format(),
                  },
                  "myMeesage",
              ]
            : [
                  ApiPort.AnnouncementIndividualDetail +
                      "&AnnouncementID=" +
                      detail.announcementID,
                  ApiPort.ActionOnAnnouncement,
                  {
                      announcementUpdateItems: [
                          {
                              announcementID: detail.announcementID,
                              isRead: true,
                              isOpen: true,
                          },
                      ],
                      actionBy: memberCode,
                      timestamp: moment().format(),
                  },
                  "systemMessage",
              ];

        function findParent(node) {
            //console.log('URLObject', URLObject)
            let parent = node.parentNode;

            const messageItem = "message-item";
            if (~Array.from(parent.classList).indexOf(messageItem)) {
                //  const parentChildren = parent.children[0].children[2].children[2];
                //GET  message - title -inner wrap
                const parentChildren =
                    parent.children[0].children[2].children[0]; // GET <h3> <span>[]</span> </h3>
                const parentOfMainContent =
                    parent.children[0].children[2].children[2];
                const mainContent =
                    parent.children[0].children[2].children[2].children[0];

                if (~parent.getAttribute("class").indexOf("close")) {
                    const contentNode = parentChildren.children[0];

                    (!detail.isRead || !detail.isOpen) &&
                        patch(URLObject[1], URLObject[2]).then(() => {
                            // 由於一鍵已讀IsOpen = false，若再次展開，需單一請求api改為true
                            // 标记当前条为已读
                            detail.isRead = true;
                            detail.isOpen = true;

                            // 本地已读条数减一
                            const HAS_UNREAD_COUNT =
                                "myMessageHasUnRead" + self.state.myMessageType;

                            detail.memberNotificationID &&
                                self.setState({
                                    [HAS_UNREAD_COUNT]:
                                        self.state[HAS_UNREAD_COUNT] - 1,
                                });
                        });

                    if (contentNode !== undefined) {
                        if (
                            contentNode.getAttribute("data-is-content") === "0"
                        ) {
                            setLoading(true);
                            get(URLObject[0]).then((res) => {
                                setLoading(false);
                                contentNode.setAttribute("data-is-content", 1);
                                parent.children[0].setAttribute(
                                    "class",
                                    parent.children[0].classList.value.replace(
                                        " unread",
                                        "",
                                    ),
                                );
                                parent.setAttribute(
                                    "class",
                                    messageItem + " open",
                                );
                                contentNode.innerHTML =
                                    (URLObject[3] === "myMeesage" &&
                                    self.state.myMessageType !== "1"
                                        ? res.personalMessage.appContent
                                        : self.state.myMessageType == "1"
                                          ? res.personalMessage.Content
                                          : res.announcementResponse.content) ||
                                    "";

                                if (!self.state.originHeightOfTitle) {
                                    self.setState({
                                        originHeightOfTitle:
                                            parentChildren.clientHeight,
                                    });
                                }

                                parentChildren.style.height =
                                    (self.state.originHeightOfTitle ||
                                        parentChildren.clientHeight) + "px";
                                parentOfMainContent.style.height =
                                    mainContent.clientHeight + "px";
                            });
                        } else {
                            parent.children[0].setAttribute(
                                "class",
                                parent.children[0].classList.value.replace(
                                    " unread",
                                    "",
                                ),
                            );
                            parent.setAttribute("class", messageItem + " open");

                            if (!self.state.originHeightOfTitle) {
                                self.setState({
                                    originHeightOfTitle:
                                        parentChildren.clientHeight,
                                });
                            }

                            parentChildren.style.height =
                                (self.state.originHeightOfTitle ||
                                    parentChildren.clientHeight) + "px";
                            parentOfMainContent.style.height =
                                mainContent.clientHeight + "px";
                        }
                    } else {
                        parent.children[0].setAttribute(
                            "class",
                            parent.children[0].classList.value.replace(
                                " unread",
                                "",
                            ),
                        );
                        parent.setAttribute("class", messageItem + " open");

                        if (!self.state.originHeightOfPersonalMessageTitle) {
                            self.setState({
                                originHeightOfPersonalMessageTitle:
                                    parentChildren.clientHeight,
                            });
                        }

                        parentChildren.style.height =
                            (self.state.originHeightOfPersonalMessageTitle ||
                                parentChildren.clientHeight) + "px";
                        parentOfMainContent.style.height =
                            mainContent.clientHeight + "px";
                    }
                } else {
                    parent.setAttribute("class", messageItem + " close");
                    parentChildren.style.height = "28px";
                    parentOfMainContent.style.height = "24px";
                }
            } else {
                findParent(parent);
            }
        }

        findParent(e.target);
    }
    /**
     * @param {string, number} type String代表改变改变类型，Number代表改变页数
     */
    getSystemData(type) {
        const newLen2 = this.isFinishFrontData.push(0);
        this.props.setLoading(true);
        // 0:All, 7:Banking, 8:Products, 9:Promotions, 10:General
        typeof type === "string" && (this.systemMessageType = type);
        typeof type === "number" && (this.systemPageIndex = type);
        get(
            ApiPort.Announcements +
                "&messageTypeOptionID=" +
                this.systemMessageType +
                "&pageSize=" +
                this.currentSize +
                "&pageIndex=" +
                this.state.currentPage,
        ).then((res) => {
            this.props.setLoading(false);
            if (
                typeof res !== "undefined" &&
                res.isSuccess &&
                res.result?.announcementsByMember
            ) {
                this.setState(
                    {
                        systemMessageList: res.result.announcementsByMember,
                        countSystemSize: res.result.totalGrandRecordCount,
                        systemMessageHasUnRead: res.result.totalUnreadCount,
                        totalPage: res.length / this.state.pageSize,
                        minIndex: 0,
                        maxIndex: this.state.pageSize,
                    },
                    () => {
                        this.isFinishFrontData.splice(newLen2 - 1, 1, 1);
                        if (
                            this.isFinishFrontData.length &&
                            !~this.isFinishFrontData.indexOf(0)
                        ) {
                            this.props.setCircleHasUnRead(
                                this.state.systemMessageHasUnRead, //||
                                // this.state.myMessageHasUnRead1 !== 0 ||
                                // this.state.myMessageHasUnRead2 !== 0
                            );
                        }
                    },
                );
            }
        });
    }
    /**
     * @param {string, number, boolean} type String代表改变改变类型，Number代表改变页数, Boolean代表是否需要获取
     * @param {string} messageTypeID 要获取通知的类型
     */
    getPersonData(type, messageTypeID) {
        const newLen1 = this.isFinishFrontData.push(0);
        this.props.setLoading(true);
        // 0:All, 7:Banking, 8:Products, 9:Promotions, 10:General
        typeof type === "string" && (this.personMessageType = type);
        typeof type === "number" && (this.personPageIndex = type);
        const MY_MESSAGE_ID = messageTypeID || this.state.myMessageType; // 通知消息的类型
        // 1: General, 2: Promotion, 3: Deposit, 4. Transfer, 5: Withdrawal, : Bonus
        get(
            ApiPort.InboxMessages +
                "&MessageTypeID=" +
                MY_MESSAGE_ID +
                "&messageTypeOptionID=" +
                this.personMessageType +
                "&pageSize=" +
                this.currentSize +
                "&pageIndex=" +
                this.state.currentPage,
        ).then((res) => {
            this.props.setLoading(false);
            if (res?.result?.inboxMessagesListItem) {
                // 如果传递了我的消息类型，则代表它需要手动设置消息类型，所以需调用更换消息类型的SetState
                messageTypeID &&
                    this.setState({ myMessageType: messageTypeID });
                this.setState({
                    myMessageList: res.result.inboxMessagesListItem,
                    countPersonSize: res.result.totalGrandRecordCount,
                    ["myMessageHasUnRead" + MY_MESSAGE_ID]:
                        res.result.totalUnreadCount,
                    totalPage: res.length / this.state.pageSize,
                    minIndex: 0,
                    maxIndex: this.state.pageSize,
                });

                const OTHER_MESSAGE_ID = MY_MESSAGE_ID === "2" ? "1" : "2";
                get(
                    ApiPort.InboxMessages +
                        "&MessageTypeID=" +
                        OTHER_MESSAGE_ID +
                        "&messageTypeOptionID=0&pageSize=1&pageIndex=1",
                ).then((res) => {
                    if (res?.result?.inboxMessagesListItem) {
                        this.setState(
                            {
                                ["myMessageHasUnRead" + OTHER_MESSAGE_ID]:
                                    res.result.totalUnreadCount,
                                totalPage: res.length / this.state.pageSize,
                                minIndex: 0,
                                maxIndex: this.state.pageSize,
                            },
                            () => {
                                this.isFinishFrontData.splice(
                                    newLen1 - 1,
                                    1,
                                    1,
                                );
                                if (
                                    this.isFinishFrontData.length &&
                                    !~this.isFinishFrontData.indexOf(0)
                                ) {
                                    this.props.setCircleHasUnRead(
                                        this.state.systemMessageHasUnRead ||
                                            this.state[
                                                "myMessageHasUnRead" +
                                                    MY_MESSAGE_ID
                                            ] !== 0 ||
                                            this.state[
                                                "myMessageHasUnRead" +
                                                    OTHER_MESSAGE_ID
                                            ] !== 0,
                                    );
                                }
                            },
                        );
                    }
                });
            }
        });
    }

    /* 處理頁數 */
    handlePageChange = (value) => {
        this.setState(
            {
                currentPage: value,
                minIndex: (value - 1) * this.state.pageSize,
                maxIndex: value * this.state.pageSize,
            },
            () => {
                if (this.currentMessageType == 1) {
                    this.getPersonData();
                } else {
                    this.getSystemData();
                }
            },
        );
    };

    /**
     * @param {string} type  2: Transactions, 1: Personal
     */
    filterPersonData(type) {
        this.personMessageType = 0;
        this.setState({ currentPage: 1 }, () => {
            this.getPersonData(1, type.target.value);
        });

        Pushgtagdata(
            type.target.value === ""
                ? "Transaction_messsage_PMA"
                : "Personal_PMA_profilepage",
        );
    }
    /**
     * @param {string} type 标记全部已读的类型
     */
    markAllRead(type) {
        Modal.confirm({
            icon: null,
            centered: true,
            title: translate("注意"),
            content: translate("您确认要将所有帖子标记为已读吗？"),
            className: "markAllRead",
            okButtonProps: { size: "large" },
            cancelButtonProps: { size: "large" },
            okText: translate("确认"),
            cancelText: translate("稍后"),
            onOk: () => {
                console.log(this.props);
                this.props.setLoading(true);
                let messageItemArray = {},
                    URLAddress = "";
                if (type === "myMessage") {
                    URLAddress = ApiPort.ActionOnInboxMessage;
                    console.log(URLAddress);
                    messageItemArray.personalMessageUpdateItem = [];
                    this.state.myMessageList.forEach((val) => {
                        console.log(val);
                        const isOpen = val.isOpen == true ? true : false; // 一鍵已讀改為IsOpen = false, IsRead = true
                        messageItemArray.personalMessageUpdateItem.push({
                            messageID: val.messageID,
                            memberNotificationID: val.memberNotificationID,
                            isRead: true,
                            isOpen: isOpen,
                        });
                    });

                    Pushgtagdata(
                        type === "2"
                            ? "Allread_transaction_message"
                            : "Allread_personal_message",
                    );
                } else {
                    URLAddress = ApiPort.ActionOnAnnouncement;
                    messageItemArray.announcementUpdateItem = [];
                    this.state.systemMessageList.forEach((val) => {
                        messageItemArray.announcementUpdateItem.push({
                            announcementID: val.announcementID,
                            isRead: true,
                            isOpen: false,
                        });
                    });

                    Pushgtagdata("Allread_announcement_PMA");
                }
                if (type === "myMessage") {
                    patch(URLAddress, {
                        ...messageItemArray,
                        // actionBy: this.props.memberCode,
                        actionBy: localStorage.getItem("memberCode"),
                        timestamp: moment().format(),
                        readAll: true,
                    }).then((res) => {
                        this.props.setLoading(false);
                        if (res) {
                            this.getPersonData();
                        }
                    });
                } else {
                    patch(URLAddress, {
                        ...messageItemArray,
                        // actionBy: this.props.memberCode,
                        actionBy: localStorage.getItem("memberCode"),
                        timestamp: moment().format(),
                        readAll: true,
                    }).then((res) => {
                        this.props.setLoading(false);
                        if (res) {
                            this.getSystemData();
                        }
                    });
                }
            },
        });
    }
    stagEventTransition(val) {
        this.getPersonData(val);
        switch (val) {
            case "0":
                Pushgtagdata("All_sorting_transaction");
                break;
            case "3":
                Pushgtagdata("Deposit_sorting_transaction");
                break;
            case "4":
                Pushgtagdata("Transfer_sorting_transaction");
                break;
            case "5":
                Pushgtagdata("Withdrawal_sorting_transaction");
                break;
            case "6":
                Pushgtagdata("Bonus_sorting_transaction");
                break;
            default:
                break;
        }
    }
    stagEventSystem(val) {
        this.getSystemData(val);
        switch (val) {
            case "0":
                Pushgtagdata("All_sorting_announcement");
                break;
            case "7":
                Pushgtagdata("Bank_sorting_announcement");
                break;
            case "8":
                Pushgtagdata("Product_sorting_announcement");
                break;
            case "9":
                Pushgtagdata("Promotion_sorting_announcement");
                break;
            case "10":
                Pushgtagdata("Other_sorting_announcement");
                break;
            default:
                break;
        }
    }
    // 时区 +8 小时
    dealWithTime(item) {
        // let times = (new Date(item.replace('T', ' ').replace(/\-/g, '/'))).getTime() + 60 * 60 * 8 * 1000;  //原本的
        let times = new Date(item).getTime() + 60 * 60 * 8 * 1000;

        let myDate = new Date(times);
        let y = myDate.getFullYear();
        let m = myDate.getMonth() + 1;
        let d = myDate.getDate();
        let h = myDate.getHours();
        let mi = myDate.getMinutes();

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

        return `${y}-${m}-${d} ${h}:${mi}`;
    }

    testRadio(e) {
        Pushgtagdata(e.target.value);
    }

    render() {
        return (
            <div className="account-wrap message-wrap clear-border">
                <div></div>
                <h2>{translate("通知")}</h2>
                <div className="message-container">
                    <Tabs
                        tabBarStyle={{
                            borderBottom: "1px solid #E0E0E0",
                        }}
                        defaultActiveKey={this.currentMessageType}
                        className="border-tabs"
                        onChange={(v) => {
                            this.currentMessageType = v;
                            this.setState(
                                {
                                    currentPage: 1,
                                },
                                () => {
                                    this.getPersonData("0");
                                    this.getSystemData("0");
                                },
                            );
                            Pushgtagdata(
                                v === "1"
                                    ? "Message_PMA_profilepage"
                                    : "Announcement_PMA_profilepage",
                            );
                        }}
                    >
                        <TabPane
                            tab={
                                <div
                                    className={
                                        !!this.state.myMessageHasUnRead1 ||
                                        !!this.state.myMessageHasUnRead2
                                            ? "hasRead"
                                            : ""
                                    }
                                >
                                    {translate("信息")}
                                </div>
                            }
                            key="1"
                        >
                            <div className="message-button">
                                <div className="usercenter-title-brief">
                                    <Radio.Group
                                        defaultValue="2"
                                        buttonStyle="solid"
                                        value={this.state.myMessageType}
                                        onChange={this.filterPersonData}
                                    >
                                        <Radio.Button value="2">
                                            {translate("交易(邮箱)")}
                                            {this.state.myMessageHasUnRead2 ? (
                                                <span>
                                                    [
                                                    {
                                                        this.state
                                                            .myMessageHasUnRead2
                                                    }
                                                    ]
                                                </span>
                                            ) : (
                                                <span>
                                                    [
                                                    {
                                                        this.state
                                                            .myMessageHasUnRead2
                                                    }
                                                    ]
                                                </span>
                                            )}
                                        </Radio.Button>
                                        <Radio.Button value="1">
                                            {translate("个人")}
                                            {this.state.myMessageHasUnRead1 ? (
                                                <span>
                                                    [
                                                    {
                                                        this.state
                                                            .myMessageHasUnRead1
                                                    }
                                                    ]
                                                </span>
                                            ) : (
                                                <span>
                                                    [
                                                    {
                                                        this.state
                                                            .myMessageHasUnRead1
                                                    }
                                                    ]
                                                </span>
                                            )}
                                        </Radio.Button>
                                    </Radio.Group>
                                </div>
                                {this.state.myMessageType === "2" ? (
                                    <Select
                                        className="message-selection"
                                        suffixIcon={
                                            <Icon
                                                type="caret-down"
                                                style={{ color: "#000" }}
                                            />
                                        }
                                        dropdownClassName="message-option small-option"
                                        defaultValue="0"
                                        onFocus={() => {
                                            Pushgtagdata(
                                                "Sorting_transaction_message",
                                            );
                                        }}
                                        onChange={(val) => {
                                            this.stagEventTransition(val);
                                        }}
                                    >
                                        <Option value="0">
                                            {translate("全部")}
                                        </Option>
                                        <Option value="3">
                                            {translate("存款")}
                                        </Option>
                                        <Option value="4">
                                            {translate("转账")}
                                        </Option>
                                        <Option value="5">
                                            {translate("提款")}
                                        </Option>
                                        <Option value="6">
                                            {translate("红利")}
                                        </Option>
                                    </Select>
                                ) : null}
                                <Button
                                    onClick={() => {
                                        this.markAllRead("myMessage");
                                    }}
                                >
                                    {translate("标记全部已读")}
                                </Button>
                            </div>
                            <ul className="message-list">
                                {this.state.myMessageList.length ? (
                                    this.state.myMessageList.map(
                                        (val, index) => {
                                            let titleName, titleClass;
                                            if (
                                                this.state.myMessageType == "1"
                                            ) {
                                                //个人
                                                val.appTitle =
                                                    val.title || val.appTitle;
                                                val.appContent =
                                                    val.content ||
                                                    val.appContent;
                                            }
                                            if (val.messageTypeID === 1) {
                                                (titleName = "一般"),
                                                    (titleClass = "general");
                                                val.messageTypeOptionID === 2 &&
                                                    ((titleName =
                                                        translate("优惠")),
                                                    (titleClass = "promotion"));
                                            } else {
                                                switch (
                                                    val.messageTypeOptionID
                                                ) {
                                                    case 3:
                                                        (titleName =
                                                            translate("存款")),
                                                            (titleClass =
                                                                "bank");
                                                        break;
                                                    case 4:
                                                        (titleName =
                                                            translate("转账")),
                                                            (titleClass =
                                                                "transfer");
                                                        break;
                                                    case 5:
                                                        (titleName =
                                                            translate("提款")),
                                                            (titleClass =
                                                                "withdraw");
                                                        break;
                                                    case 6:
                                                        (titleName =
                                                            translate("奖金")),
                                                            (titleClass =
                                                                "bonus");
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }

                                            return (
                                                index >= this.state.minIndex &&
                                                index < this.state.maxIndex && (
                                                    <li
                                                        key={
                                                            "messageSystem" +
                                                            val.memberNotificationID
                                                        }
                                                        className="message-item close"
                                                        onClick={(event) => {
                                                            this.toggleDetail(
                                                                event,
                                                                val,
                                                            );
                                                        }}
                                                    >
                                                        <div
                                                            className={`message ${
                                                                this.state
                                                                    .myMessageType !==
                                                                "1"
                                                                    ? titleClass
                                                                    : "transition"
                                                            } ${
                                                                val.isRead
                                                                    ? ""
                                                                    : "unread"
                                                            }`}
                                                        >
                                                            <div className="message-remind-circle inline-block"></div>
                                                            <div className="message-photo inline-block"></div>
                                                            <div className="message-title-wrap inline-block">
                                                                <h3>
                                                                    {this.state
                                                                        .myMessageType !==
                                                                    "1" ? (
                                                                        <span>
                                                                            [
                                                                            {
                                                                                titleName
                                                                            }
                                                                            ]{" "}
                                                                        </span>
                                                                    ) : null}
                                                                    {
                                                                        val.appTitle
                                                                    }
                                                                </h3>
                                                                <p>
                                                                    {this.dealWithTime(
                                                                        val.sendOn,
                                                                    )}
                                                                </p>
                                                                <div className="message-title-inner-wrap">
                                                                    {val.appContent.split(
                                                                        "[/",
                                                                    ).length >
                                                                    1 ? (
                                                                        <p
                                                                            className="message-title"
                                                                            data-is-content={
                                                                                val.messageTypeID ===
                                                                                2
                                                                                    ? 1
                                                                                    : 0
                                                                            }
                                                                        >
                                                                            {
                                                                                val.appContent.split(
                                                                                    "[/",
                                                                                )[0]
                                                                            }{" "}
                                                                            [
                                                                            {
                                                                                <CopyToClipboard
                                                                                    text={val.appContent
                                                                                        .split(
                                                                                            "[/",
                                                                                        )[1]
                                                                                        .substring(
                                                                                            val.appContent.split(
                                                                                                "[/",
                                                                                            )[1],
                                                                                            val.appContent
                                                                                                .split(
                                                                                                    "[/",
                                                                                                )[1]
                                                                                                .lastIndexOf(
                                                                                                    "]",
                                                                                                ),
                                                                                        )}
                                                                                    onCopy={() => {
                                                                                        message.success(
                                                                                            translate(
                                                                                                "复制成功",
                                                                                            ),
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <span className="teal-color">
                                                                                        <>
                                                                                            {val.appContent
                                                                                                .split(
                                                                                                    "[/",
                                                                                                )[1]
                                                                                                .substring(
                                                                                                    val.appContent.split(
                                                                                                        "[/",
                                                                                                    )[1],
                                                                                                    val.appContent
                                                                                                        .split(
                                                                                                            "[/",
                                                                                                        )[1]
                                                                                                        .lastIndexOf(
                                                                                                            "]",
                                                                                                        ),
                                                                                                )}
                                                                                        </>
                                                                                    </span>
                                                                                </CopyToClipboard>
                                                                            }
                                                                            {val.appContent
                                                                                .split(
                                                                                    "[/",
                                                                                )[1]
                                                                                .substring(
                                                                                    val.appContent
                                                                                        .split(
                                                                                            "[/",
                                                                                        )[1]
                                                                                        .lastIndexOf(
                                                                                            "]",
                                                                                        ),
                                                                                )}
                                                                        </p>
                                                                    ) : (
                                                                        <p
                                                                            className="message-title"
                                                                            data-is-content={
                                                                                val.messageTypeID ===
                                                                                2
                                                                                    ? 1
                                                                                    : 0
                                                                            }
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: val.appContent,
                                                                            }}
                                                                        ></p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="message-arrow">
                                                            <Icon
                                                                type="down"
                                                                style={{
                                                                    color: "#999",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            />
                                                        </div>
                                                        {/* <div className="message-detail-wrap">
                                                            <div className="message-detail" dangerouslySetInnerHTML={{__html: val.MessageTypeID === 2 ? val.AppContent : ""}}></div>
                                                            </div> */}
                                                    </li>
                                                )
                                            );
                                        },
                                    )
                                ) : (
                                    <li className="center">
                                        <Empty
                                            image={
                                                "/vn/img/icon/img-no-record.svg"
                                            }
                                            className="big-empty-box"
                                            description={translate("没有数据")}
                                        />
                                    </li>
                                )}
                            </ul>

                            <Pagination
                                className="message-pagination"
                                hideOnSinglePage={true}
                                pageSize={this.state.pageSize}
                                current={this.state.currentPage}
                                total={this.state.countPersonSize}
                                onChange={this.handlePageChange}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <div
                                    className={
                                        this.state.systemMessageHasUnRead
                                            ? "hasRead"
                                            : ""
                                    }
                                >
                                    {translate("通知")}
                                </div>
                            }
                            key="2"
                        >
                            <div className="message-button">
                                <Select
                                    className="message-selection"
                                    suffixIcon={
                                        <Icon
                                            type="caret-down"
                                            style={{ color: "#000" }}
                                        />
                                    }
                                    dropdownClassName="message-option small-option"
                                    defaultValue="0"
                                    onFocus={() => {
                                        Pushgtagdata(
                                            "Sorting_announcement_PMA",
                                        );
                                    }}
                                    // dropdownStyle={{ width: 100, zIndex: 1 }}
                                    onChange={this.stagEventSystem}
                                >
                                    <Option value="0">
                                        {translate("全部")}
                                    </Option>
                                    <Option value="7">
                                        {translate("个人")}
                                    </Option>
                                    <Option value="8">
                                        {translate("产品")}
                                    </Option>
                                    <Option value="9">
                                        {translate("优惠")}
                                    </Option>
                                    <Option value="10">
                                        {translate("其它")}
                                    </Option>
                                </Select>
                                <Button
                                    onClick={() => {
                                        this.markAllRead(
                                            "UnreadAnnouncementCounts",
                                        );
                                    }}
                                >
                                    {translate("标记全部已读")}
                                </Button>
                            </div>
                            <ul className="message-list">
                                {this.state.systemMessageList.length ? (
                                    this.state.systemMessageList.map(
                                        (val, index) => {
                                            let titleName = "其它",
                                                titleClass = "general";

                                            switch (val.newsTemplateCategory) {
                                                case 7:
                                                    (titleName = "个人"),
                                                        (titleClass =
                                                            "personal");
                                                    break;
                                                case 8:
                                                    (titleName = "产品"),
                                                        (titleClass =
                                                            "product");
                                                    break;
                                                case 9:
                                                    (titleName = "优惠"),
                                                        (titleClass =
                                                            "promotion");
                                                    break;
                                                default:
                                                    break;
                                            }
                                            return (
                                                index >= this.state.minIndex &&
                                                index < this.state.maxIndex && (
                                                    <li
                                                        key={
                                                            "messageSystem" +
                                                            val.announcementID
                                                        }
                                                        className="message-item close"
                                                        onClick={(event) => {
                                                            this.toggleDetail(
                                                                event,
                                                                val,
                                                            );
                                                        }}
                                                    >
                                                        <div
                                                            className={`message ${titleClass} ${
                                                                val.isRead
                                                                    ? ""
                                                                    : "unread"
                                                            }`}
                                                        >
                                                            <div className="message-remind-circle inline-block"></div>
                                                            <div className="message-photo inline-block"></div>
                                                            <div className="message-title-wrap inline-block">
                                                                <h3>
                                                                    <span>
                                                                        [
                                                                        {translate(
                                                                            titleName,
                                                                        )}
                                                                        ]
                                                                    </span>{" "}
                                                                    {val.topic}
                                                                </h3>
                                                                <p>
                                                                    {this.dealWithTime(
                                                                        val.sendOn,
                                                                    )}
                                                                </p>
                                                                <div className="message-title-inner-wrap">
                                                                    <p
                                                                        className="message-title"
                                                                        data-is-content={
                                                                            0
                                                                        }
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: val.content,
                                                                        }}
                                                                    ></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="message-arrow">
                                                            <Icon
                                                                type="down"
                                                                style={{
                                                                    color: "#999",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            />
                                                        </div>
                                                    </li>
                                                )
                                            );
                                        },
                                    )
                                ) : (
                                    <li className="center">
                                        <Empty
                                            image={
                                                "/vn/img/icon/img-no-record.svg"
                                            }
                                            className="big-empty-box"
                                            description={translate("没有数据")}
                                        />
                                    </li>
                                )}
                            </ul>
                            <Pagination
                                className="message-pagination"
                                hideOnSinglePage={true}
                                pageSize={this.state.pageSize}
                                current={this.state.currentPage}
                                total={this.state.countSystemSize}
                                onChange={this.handlePageChange}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Message;
