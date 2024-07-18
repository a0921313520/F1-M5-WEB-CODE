import React from "react";
import Router, { withRouter } from "next/router";
import Layout from "@/Layout";
import { Menu, Tabs } from "antd";
import { translate } from "$ACTIONS/Translate";
import { isWebPSupported } from "$ACTIONS/helper";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";

const { TabPane } = Tabs;
export async function getStaticPaths() {
    return {
        paths: [
            { params: { helpcenterModule: "ve-fun88" } }, //关于fun88
            { params: { helpcenterModule: "lien-He" } }, //联系我们
            { params: { helpcenterModule: "account-management" } }, //账号信息
            { params: { helpcenterModule: "khuyen-mai-khac" } }, //红利
            { params: { helpcenterModule: "hoan-tra" } }, //返水
            { params: { helpcenterModule: "promotion-others" } }, //其他
            { params: { helpcenterModule: "gui-tien" } }, //存款
            { params: { helpcenterModule: "chuyen-quy" } }, //转账
            { params: { helpcenterModule: "rut-tien" } }, //提款
            { params: { helpcenterModule: "rewards" } }, //会员奖励
            { params: { helpcenterModule: "affiliate" } }, //合作伙伴
            { params: { helpcenterModule: "fun88-mobile" } }, //手机版fun88
            { params: { helpcenterModule: "responsible-gaming" } }, //投注责任
            { params: { helpcenterModule: "betting-rules" } }, //投注规则
            { params: { helpcenterModule: "privacy-policy" } }, //隐私权政策
            { params: { helpcenterModule: "disclaimer" } }, //免责声明
        ],
        fallback: false,
    };
}
export async function getStaticProps(context) {
    console.log(
        "🚀 ~ getStaticProps ~ context:",
        context.params.helpcenterModule,
        typeof context.params.helpcenterModuleb,
    );

    const seoPage = `/faq/${context.params.helpcenterModule}`;
    return await getStaticPropsFromStrapiSEOSetting(seoPage); //參數帶本頁的路徑
}
const CONTENTDATA = [
    {
        title: translate("公司介绍"),
        tabs: [
            {
                title: translate("关于乐天堂"),
                key: "1",
                content: (
                    <>
                        <p>{translate("欢迎来到亚洲领先的在线投注网站。")}</p>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("实现你的梦想 - 实现你的激情")}
                            </div>
                            <p>
                                {translate(
                                    "- 立即开始您的日常乐趣：Fun88 很荣幸能够与世界著名的超级巨星信任并合作。 立即与传奇人物一起加入 Fun88，以获得最佳选择。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 享受Fun88提供的各种独特且有价值的欢迎礼物：在Fun88，您总是会收到最有吸引力的礼物。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("动态设计的新界面")}
                            </div>
                            <p>
                                {translate(
                                    "- 我们珍惜您与 Fun88 一起度过的时光，并始终希望您在我们这里的体验是完美的。 成功登录后，Fun88主页将自动更新并重新设计适合您的界面和功能。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 新设计优化您的报价：具有智能功能的新设计将更新您在 Fun88 的习惯，并优化所有信息，为您提供找到最快、最便捷方式所需的一切。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("Fun88 手机版")}
                            </div>
                            <p>
                                {translate(
                                    "- 无论您身在何处，您的每一次体验都是独一无二的。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 与 Fun88 一起放松，无论您身在何处，都能享受胜利的乐趣！",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">{translate("赞助")}</div>
                            <p>
                                {translate(
                                    "Fun88 是英超顶级足球俱乐部的官方区域合作伙伴，例如",
                                )}
                            </p>
                            <p>{translate("- 伯恩利足球俱乐部")}</p>
                            <p>{translate("- 托特纳姆热刺足球俱乐部")}</p>
                            <p>{translate("- 纽卡斯尔联队")}</p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("品牌代言人")}
                            </div>
                            <p>
                                {translate(
                                    "Fun88也非常荣幸能够与像这样的传奇选手签订品牌大使合同",
                                )}
                            </p>
                            <p>{translate("- 伊克尔·卡西利亚斯 - 传奇门将")}</p>
                            <p>{translate("- 罗比·福勒 - 利物浦传奇")}</p>
                            <p>
                                {translate(
                                    "- 史蒂夫·纳什 - NBA 篮球传奇人物（2 次 MVP NBA 名人堂成员）",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 科比·布莱恩特 - NBA 篮球传奇人物（4 次荣获全明星 MVP 称号）",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <div className="sub-title">
                                {translate("FUN88历程")}
                            </div>
                            <p>
                                {translate(
                                    "2022 年至今：与伊克尔·卡西利亚斯签署品牌大使合同",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2013 年至今：托特纳姆热刺足球俱乐部官方赞助商",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2017 年至今：纽卡斯尔俱乐部官方赞助商。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2019年：与传奇人物科比·布莱恩特签署品牌大使合同。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2016 - 2017：托特纳姆热刺足球俱乐部在亚洲和拉丁美洲的官方区域合作伙伴。 篮球传奇人物史蒂夫·纳什还与 Fun88 签署了品牌大使合同。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2014 - 2015：伯恩利足球俱乐部官方球衣赞助商。 与利物浦传奇人物罗比·福勒签署品牌大使合同。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "巴克莱英超联赛现场投注门户网站的官方投注合作伙伴。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("联系方式2"),
                key: "2",
                content: (
                    <>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <h3>{translate("热线电话：")} (+84) 2844581397 </h3>
                            <h3>{translate("邮箱")}: cs.viet@fun88.com </h3>
                            <h3>{translate("招聘邮箱：")} hr@fun88.com</h3>
                            <div className="line-distance"></div>
                            <p>{translate("- 成为 Fun88 团队的一员")}</p>
                            <p>
                                {translate(
                                    "- 这是您与亚洲领先的在线游戏品牌建立令人兴奋的职业生涯的机会！ 我们正在招聘具有不同专业领域的许多职位。 Fun88拥有一支充满热情、充满活力的员工团队，我们赞赏并奖励员工的贡献。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("账户资料"),
        tabs: [
            {
                title: translate("账户管理"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("忘记密码")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 单击忘记密码")}</p>
                            <p>{translate("2. 输入电子邮件和用户名")}</p>
                            <p>{translate("3. 单击发送")}</p>
                            <p>
                                {translate(
                                    "4. 登录注册邮箱，点击Fun88发来的邮件中的CHANGE PASSWORD",
                                )}
                            </p>
                            <p>{translate("5. 输入新密码，确认新密码")}</p>
                            <p>{translate("6. 按<保存>")}</p>
                            <div className="line-distance"></div>
                            <p>{translate("忘了用户名了吗")}</p>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 单击忘记密码")}</p>
                            <p>{translate("2. 单击忘记用户名")}</p>
                            <p>{translate("3.填写注册邮箱然后点击发送")}</p>
                            <p>{translate("4. 登录并查看您的注册邮箱")}</p>
                        </div>

                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("更新个人信息")}
                            </div>
                            <p>{translate("- 无法更新的信息：")}</p>
                            <p>
                                {translate(
                                    "用户名/性别/出生日期/最喜欢的货币/安全问题/安全答案",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>{translate("- 信息可以更新：")}</p>
                            <p>
                                {translate(
                                    "全名/电子邮件（联系在线支持寻求帮助）电话号码/最喜欢的电子钱包/语言/信使/国家/地址（会员根据以下说明自行更改）。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 单击用户名")}</p>
                            <p>
                                {translate("2. 选择<更新个人资料>并更改信息")}
                            </p>
                            <p>{translate("3. Nhấn <Lưu> ")}</p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("邮箱认证")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 点击<用户名>")}</p>
                            <p>
                                {translate("2. 在我的个人资料中选择<摘要>按钮")}
                            </p>
                            <p>{translate("3. 选择<点击此处验证>")}</p>
                            <p>{translate("4. 查看注册邮箱")}</p>
                            <p>{translate("5. 点击邮件中的<立即验证>")}</p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: "0" }}
                        >
                            <div className="sub-title">
                                {translate("自我排除模式")}
                            </div>
                            <p>
                                {translate(
                                    "自禁模式有2个功能：转账金额限制和自禁模式",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 转账金额限制：将限制7天内的转账金额",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 自封锁模式：会员可以登录账户，但在规定时间内不能参与任何赛段的投注。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 如果会员想要关闭自我禁入，请联系在线支持",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "要激活自我排除模式，请按照以下说明操作：",
                                )}
                            </p>
                            <p>{translate("1. 点击<用户名>")}</p>
                            <p>{translate("2. 选择<自我排除>")}</p>
                            <p>{translate("3. 将状态从<关闭>更改为<打开>")}</p>
                            <p>
                                {translate(
                                    "4. 如果会员要设置<转账限额>，请输入汇款限额",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "5. 如果会员想设置<自我封锁模式>，请选择时间段",
                                )}
                            </p>
                            <p>{translate("6. 设置完成后按<保存>")}</p>
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("优惠"),
        tabs: [
            {
                title: translate("奖金"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("晋升制度")}
                            </div>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("我的优惠")}
                            </div>
                            <p>
                                {translate(
                                    "- 用于检查注册的促销活动和促销状态。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">{translate("返水")}</div>
                            <p>
                                {translate(
                                    "- 退款促销活动与其他促销活动分开，帮助玩家更快地查看退款金额和状态。",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <div className="sub-title">
                                {translate("每日优惠")}
                            </div>
                            <p>
                                {translate(
                                    "- 每天为会员提供多样化的奖励计划。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("返水"),
                key: "2",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("退款信息")}
                            </div>
                        </div>
                        <div className="">
                            <img
                                src={`${process.env.BASE_PATH}/img/help/Table2@3x.${isWebPSupported() ? "webp" : "png"}`}
                                alt="tx"
                            />
                        </div>
                    </>
                ),
            },
            {
                title: translate("其他促销活动"),
                key: "3",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("查看当前促销活动")}
                            </div>
                            <p>{translate("查看当前促销活动")}</p>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate("1. 点击网站右上角的<PROMOTION>项")}
                            </p>
                            <p>{translate("2. 按产品选择<促销详情>")}</p>
                            <p>
                                {translate(
                                    "3. 点击<上一次促销>，在进度/状态栏中查看促销收入",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("检查免费旋转")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate(
                                    "1. 选择网页右上角的“邮箱”图标，选择<查看更多>",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2. 点击<通知>，选择<促销通知>查看更新的免费旋转游戏",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "3. 根据公告中的游戏名称，请进入游戏部分，在搜索字段中输入游戏名称并使用免费旋转",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <div className="sub-title">
                                {translate("加入每日奖金")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate("1. 点击网站右上角的<PROMOTION>项")}
                            </p>
                            <p>
                                {translate("2. 在“每日奖金”部分选择<促销详情>")}
                            </p>
                            <p>{translate("3.选择<每日奖励>即可查看奖励")}</p>
                            <p>{translate("4.选择<奖励历史>查看收到的奖励")}</p>
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("银行信息"),
        tabs: [
            {
                title: translate("存款说明"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("本地银行存款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 选择右上角的<存款>（绿色）")}</p>
                            <p>{translate("2. 选择<本地银行>")}</p>
                            <p>
                                {translate(
                                    "3.点击您要转账的银行：外贸、科技、东亚...",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "4. 选择存款银行后，会员点击“账户信息详情”即可获取Fun88银行账号信息。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "5. 成功转账至Fun88账户后，会员请在转账确认处填写所有信息",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "会员请在用户账户部分再次核对会员的银行账户信息，然后点击提交完成存款确认。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("通过 Fastpay 汇款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 选择右上角的<存款>（绿色）")}</p>
                            <p>{translate("2. 选择<快捷支付>")}</p>
                            <p>{translate("3.填写存款金额，然后点击转账")}</p>
                            <p>
                                {translate(
                                    "4. 会员将被重定向到Fastpay页面，请选择您要用于转账的银行，然后选择发送",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "5. 会员将被重定向到下一页，在那里他们可以登录当前银行的网上银行账户",
                                )}
                            </p>
                            <p>
                                {translate("会员填写OTP确认信息并按<CONTINUE>")}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("通过电子钱包 Momopay 汇款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 选择右上角的<存款>（绿色）")}</p>
                            <p>{translate("2. 选择<Momopay>")}</p>
                            <p>{translate("3. 输入您要发送的金额")}</p>
                            <p>{translate("4. 单击“传输”")}</p>
                            <p>
                                {translate(
                                    "5. 系统会将您重定向至包含转账信息的窗口。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "7. 在 Momopay 应用程序上选择“扫码”。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "8.扫描/扫描Fun88提供的二维码进行转账。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "9. 继续在 Momopay App 上进行转账的步骤，例如检查、确认转账。 完成后，您将在 Momopay 收到有关交易状态的通知。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "10. 返回 Fun88 页面，您将在右上角收到一条通知，告知您账户中的金额已更新。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "*注：请复制红色代码并填写在Momopay的消息框中",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("通过 QRPay 汇款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 选择右上角的<存款>（绿色）")}</p>
                            <p>{translate("2. 选择<QRPay>")}</p>
                            <p>
                                {translate("3. 输入金额，选择您要汇款的银行")}
                            </p>
                            <p>{translate("4. 单击“传输”")}</p>
                            <p>
                                {translate(
                                    "5. 系统会将您重定向至包含转账信息的窗口。 请按要求行事",
                                )}
                            </p>
                            <p>{translate("6. 打开银行应用程序")}</p>
                            <p>{translate("7.选择QRPay扫描二维码并支付")}</p>
                            <p>
                                {translate(
                                    "8. 返回Fun88页面，您将在右上角收到金额已更新到您帐户的通知。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("通过电子钱包 Viettelpay 汇款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 选择右上角的<存款>（绿色）")}</p>
                            <p>{translate("2. 选择<Viettelpay>")}</p>
                            <p>{translate("3. 输入您要发送的金额")}</p>
                            <p>{translate("4. 单击“传输”")}</p>
                            <p>
                                {translate(
                                    "5. 系统会将您重定向至包含转账信息的窗口。",
                                )}
                            </p>
                            <p>{translate("6. 打开 Viettelpay 应用程序。")}</p>
                            <p>
                                {translate(
                                    "7. 在 Viettelpay 应用程序上选择“扫描代码”。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "8.扫描/扫描Fun88提供的二维码进行转账。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "9. 继续在 Viettelpay App 上进行转账步骤直至成功",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "10. 返回 Fun88 页面，您将在右上角收到一条通知，告知您账户中的金额已更新。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "***注意：请复制红色提供的代码并填写 Viettelpay 的消息框",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("存款订单更新延迟")}
                            </div>
                            <p>{translate("- 通过当地银行：")}</p>
                            <p>
                                {translate(
                                    "如果存款尚未存入帐户，会员请通过在线支持发送确认转账成功的收据照片",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "对于存款更新延迟，有以下几种情况：",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "1. 银行更新交易信息较慢，导致确认时间较长 - 存款将在与银行确认成功后更新",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2. 存款少于系统规定的金额 - 客户需要追加存款才能达到规定的最低金额",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "3. 客户在验证转账时提供的信息不正确 - 客户需要使用与转账收据上完全相同的信息再次执行转账确认操作",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "4. 将资金存入未使用的账户 - 客户在汇款前需要检查其账户信息",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>{translate("-通过网上支付")}</p>
                            <p>
                                {translate(
                                    "如果存款尚未存入账户，请通过在线支持发送成功转账确认收据的快照",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "对于存款更新延迟，有以下几种情况：",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "1.传输中断导致交易更新缓慢 - 存款订单将在收到客户确认转账成功的收据后30分钟内更新",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2. 暂停交易：正常情况下存款交易将在7-10个工作日内继续处理处理结果：①退款至客户银行账户②当Fun88确认收到客户转账后更新至以下投注账户",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("充值更新时间")}
                            </div>
                            <p>
                                {translate(
                                    "存款订单的最长处理时间为 30 分钟。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("资金转账指南"),
                key: "2",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("一触式资金转账 - 超快速钱包转账！")}
                            </div>
                            <p>
                                {translate(
                                    "一键转账”功能，在Fun88钱包之间转账，简单快捷。",
                                )}
                            </p>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate(
                                    "1. 登录账户。 选择屏幕右上角图像“邮箱”旁边的“传输”项目",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2. 从可用选项中单击要转账的钱包。 系统会自动将全部余额转入您想要的钱包！",
                                )}
                            </p>
                            <p>{translate("资金划拨成功！ 祝您投注好运！")}</p>
                            <p>
                                {translate(
                                    "***注意：使用“一键转账”时，转账金额不可调整。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("Fun88 资金转账")}
                            </div>
                            <p>
                                {translate(
                                    "如需进行转账，会员请选择网站顶部的资金转账。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "会员选择从账户（转账账户）转账至账户（收款账户），并在转账金额字段输入金额，然后点击发送。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "***注意：输入金额时，请在末尾留3个零。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("提款说明"),
                key: "3",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("如何提款")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 点击网页顶部的<提现>。")}</p>
                            <p>{translate("2.填写会员银行账户信息，")}</p>
                            <p>{translate("3. 点击SEND完成提现订单")}</p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("一天可以提款多少次")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("Fun88每日提现次数限制如下：")}</p>
                            <p>{translate("- 对于老顾客，每天 10 个订单")}</p>
                            <p>{translate("- VIP客户每天20个订单")}</p>
                            <p>{translate("- 最低提现金额为20万/订单")}</p>
                            <p>{translate("- 最大金额为1亿/单，1天为2亿")}</p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("提款订单处理时间")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate(
                                    "提现处理时间在24小时内，如果处理时间长于24小时，可能是由于以下原因：",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "1. 最常见的原因是提款流水未完全更新——从客户下注到完全更新提款流水大约需要1小时",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "2. 账户信息随机验证流程——玩家需要提供一些文件，可以联系在线支持寻求帮助",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "3. 通过第三账户提款——指使用非Fun88账户持有人拥有的银行账户提款，Fun88不支持通过第三方提款。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "4. 提现功能正在维护中 - 客户请查看新信息/通知部分更新维护时间。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate(
                                    "Page Thai 取款指令成功但银行账户尚未收到款项",
                                )}
                            </div>
                            <p>
                                {translate(
                                    "原因：银行正在处理转账或提现退至Fun88账户",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "解决方案：玩家向在线支持提供其银行账户交易历史记录的快照结果：",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "① 银行处理交易速度较慢，通常客户会在24小时内收到款项",
                                )}
                            </p>
                            <p>{translate("② 提现退回Fun88账户：")}</p>
                            <p>
                                {translate(
                                    "Fun88转账给玩家后，由于银行原因拒绝转账，如果拒绝，Fun88会将这笔金额转回客户的投注钱包，客户可以重新提款",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("电话信息"),
        tabs: [
            {
                title: translate("Fun88 移动应用程序"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <img
                                src={`${process.env.BASE_PATH}/img/help/ComingSoon.${isWebPSupported() ? "webp" : "png"}`}
                                alt="download app"
                            />
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("奖品信息"),
        tabs: [
            {
                title: translate("天王俱乐部"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("查看奖励")}
                            </div>
                            <p>{translate("请按照以下步骤操作：")}</p>
                            <p>{translate("1. 点击网页右上角的<添加>")}</p>
                            <p>
                                {translate("2. 选择<奖品页>，点击<立即观看>")}
                            </p>
                            <p>
                                {translate(
                                    "3.检查<当前级别>并得分到下一个级别",
                                )}
                            </p>
                            <p>{translate("4.查看本月和上月累积积分明细")}</p>
                            <p>{translate("5.查看可用于兑换礼品的积分数量")}</p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("升级和升级奖励")}
                            </div>
                            <p>- {translate("请按照以下步骤操作：")}</p>
                            <p>
                                {translate(
                                    "如果会员在每个级别的规定时间后未能保持所需的积分，则该会员的级别将被降一级。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 会员需要保持每个级别所需的积分，否则会员的级别将不断下降，直到会员恢复到银级。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <img
                                src={`${process.env.BASE_PATH}/img/help/Image2@3x.${isWebPSupported() ? "webp" : "png"}`}
                                alt="cl"
                            />
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("代理"),
        tabs: [
            {
                title: translate("联盟计划"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("Fun88 联盟计划")}
                            </div>
                            <p>
                                {translate(
                                    "- 是 Fun88 与您之间的合作伙伴计划。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "简而言之，这是一个合作伙伴计划，您可以根据您推荐的玩家数量赚取利润并分享利润。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 您推荐的玩家越多，玩家消费越多，您赚取的利润就越多。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("为什么要加入 Fun88 联盟计划？")}
                            </div>
                            <p>
                                {translate(
                                    "- 基于赢得公司利润，为您带来高达每月佣金40%的收入。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "使用代理网站上的信息，您可以检查代理工作的绩效，在工具栏上报告以研究和开发您的工作，并且可以下载工具来推销您的代理工作。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 具有图形显示功能的精确详细的报告引擎可以在您的代理活动、佣金、会员数量等方面提供许多指标的完整性。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "-Fun88提供多种图像营销工具可供下载，例如各种尺寸的横幅。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("如何通过Fun88联盟计划赚取利润？")}
                            </div>
                            <p>{translate("- 首先，会员按要求开立账户。")}</p>
                            <p>
                                {translate(
                                    "- 请点击此处申请，确认信息正确完整后，您的申请将很快获得批准。 您将获得一个免费的协作帐户。 然后登录我们的合作伙伴界面并开始您的业务。 一个独特的代码，可以将您推荐的玩家与其他合作伙伴的玩家区分开来。 佣金是根据玩家花费的金额根据利润支付给您的。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("如何开始使用 Fun88 联属网站？")}
                            </div>
                            <p>
                                {translate(
                                    "- 将通过建设网站来开展合作伙伴计划。 您的唯一代码包含在本网站中，供您的网站访问者使用。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "尽管大多数联属计划都通过该网站运营，但并非所有合作者都拥有该网站。 因此在Fun88，一切都将在您网站的设计中得到控制。 您需要做的就是利用您所有的才能和创造力来接触更多的玩家。 在杂志或报纸、电子邮件会员或任何其他快速有效的方式中放置广告。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "***注意：未经会员同意，您不得向会员发送电子邮件。 否则，您的联盟帐户将被终止，收入将被没收。",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            {translate("- 立即加入 Fun88 联盟计划！")}
                        </div>
                    </>
                ),
            },
        ],
    },
    {
        title: translate("投注政策"),
        tabs: [
            {
                title: translate("投注责任"),
                key: "1",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("Fun88 负责任的投注政策")}
                            </div>
                            <p>
                                {translate(
                                    "- Fun88 保留规范负责任投注以及了解预防问题投注、干扰和处理的权利。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- Fun88 的负责任投注政策旨在最大限度地减少问题投注的负面影响并促进负责任的投注实践。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "我们相信，我们的会员和客户有责任确保在我们的网站上获得舒适的赌博体验，同时充分认识到与赌博相关的危害、财务和社会问题。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 为了帮助玩家负责任地投注，我们确保所有员工对负责任的投注有清晰的了解。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "如果您需要更多信息或帮助，请联系我们的帮助中心。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("保持控制")}
                            </div>
                            <p>
                                {translate(
                                    "- 虽然我们的大多数客户都以真正的娱乐方式进行投注，但少数人可能很难实现这一目标。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 为了保持对投注习惯的控制，我们希望会员牢记以下几点：",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "1) 博彩应适度，应被视为娱乐而非赚钱的唯一途径",
                                )}
                            </p>
                            <p>{translate("2）避免追赶失败")}</p>
                            <p>
                                {translate(
                                    "3) 仅在会员可以控制损失的情况下投注",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "4) 保持平衡的时间节奏并跟踪会员每天的消费金额",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("会员有什么问题？")}
                            </div>
                            <p>
                                {translate(
                                    "- 如果会员担心投注会对会员或某人的生活产生负面影响，以下问题将帮助会员感到更加安全。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 投注是否会干扰会员工作或与朋友会面？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 投注会员是为了消磨时间还是为了摆脱无聊？",
                                )}
                            </p>
                            <p>{translate("- 会员长期独自投注？")}</p>
                            <p>{translate("- 有没有人批评会员的投注？")}</p>
                            <p>
                                {translate(
                                    "- 会员是否因投注而对家人、朋友或个人兴趣失去兴趣？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 该会员是否曾通过欺骗手段获取金钱或时间来投资投注？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 会员是否曾欺骗、偷窃或借钱沉迷赌博？",
                                )}
                            </p>
                            <p>
                                {translate("- 会员不愿意花钱投注或其他什么？")}
                            </p>
                            <p>
                                {translate(
                                    "- 会员投注直到会员输掉所有资产为止，对吧？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 亏损后，会员是否觉得必须尝试挽回这些损失？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 如果会员在投注时破产，会员是否会感到沮丧并感到需要不惜一切代价重试？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 争吵、损失或失望是否会促使会员前来投注？",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 投注是否会令会员感到绝望甚至自杀？",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "- 会员回答“是”的问题越多，会员在投注方面遇到的实际困难就越大。 要与可为会员提供建议和支持的人员交谈，请联系下列组织之一。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "匿名投注者是一个由男性和女性组成的团体，他们聚集在一起做一些事情来解决自己的投注问题并帮助其他赌徒了解问题。 世界各地有许多区域协会。 匿名投注粉丝服务网站是 www.gamblersanonymous.org",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "博彩治疗为任何受到博彩影响的人提供帮助和建议。 会员可以访问该组织的网站：www.gamblingtherapy.org",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("未成年投注")}
                            </div>
                            <p>
                                {translate(
                                    "- 21岁以下人士在FUN88开设账户或进行投注是违法的。 FUN88非常重视这个细节。 我们对所有使用 21 岁以下付款机制的客户进行年龄验证，并对使用其他付款方式的客户进行随机年龄检查。 请注意，任何 21 岁以下的人如果发现使用本网站，都会被找到。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("过滤系统")}
                            </div>
                            <p>
                                {translate(
                                    "- FUN88 鼓励其客户防止未成年人访问投注网站。 ICRA（互联网内容分类协会）为家长提出了完整的过滤解决方案，FUN88 已在该解决方案中注册，作为博彩网站内容的一部分。 如果会员在我们的网站上分享或下注，请点击此链接进行注册：www.icra.org。 NetNanny 或 Cyber​​patrol 提供替代过滤解决方案。",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <div className="sub-title">
                                {translate("投注限额")}
                            </div>
                            <p>
                                {translate(
                                    "- 在 Fun88.com，我们认识到并承认实施限制以有效遏制在线博彩问题的重要性。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 因此，我们为会员提供适当的工具来控制会员用于赌博的资金数额。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 会员将能够设置自己的体育博彩限额，并在会员认为合适的时候随时进行调整。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "- 只需从帐户管理部分选择投注预算并勾选激活框即可。 然后输入您想要的最大投注限额",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("投注规则及规定"),
                key: "2",
                content: (
                    <>
                        <div className="content-container_small">
                            <div className="sub-title">{translate("基诺")}</div>
                            <p>
                                {translate(
                                    "基诺的玩法是从 80 个数字（从 01 到 80）中随机抽取 20 个球。 这组20个号码将被拆分并分成几种不同类型和类型的投注。 每种类型的投注都有自己的计算方法和总体获胜赔率。",
                                )}
                            </p>
                            <p>{translate("投注类型")}</p>
                            <p>{translate("可以选择以下类型的投注：")}</p>
                            <p>{translate("大小盘；")}</p>
                            <p>{translate("奇偶;")}</p>
                            <p>{translate("龙/虎/虎；")}</p>
                            <p>{translate("上/撕/下；")}</p>
                            <p>{translate("上/下单/上/双/下双； 和")}</p>
                            <p>{translate("五行（金/木/水/火/土）。")}</p>
                            <p>
                                {translate(
                                    "结果将基于加拿大、加拿大西部、俄亥俄州、马萨诸塞州、马耳他、澳大利亚、斯洛伐克、密歇根州、肯塔基州和韩国基诺市场的官方结果。 正式开奖结果的时间与每个举办彩票比赛的地区完全相同。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "如果在一定的延长期内未收到正式的抽奖结果，公司保留取消或无效受影响的抽奖结果的权利。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "如果在投注系统关闭之前公开宣布任何正式开奖结果，公司保留取消受影响开奖结果并作废的权利。",
                                )}
                            </p>
                            <p>{translate("大小盘")}</p>
                            <p>
                                {translate(
                                    "公司允许对抽出的 20 个编号球的总结果是“大”还是“小”进行投注。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "超过 - 随机抽取的 20 个球的总和大于或等于 811。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "下 - 20次随机抽取的总和小于或等于810。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "示例：随机抽取的球编号为 69、42、37、8、68、74、45、71、64、16、17、19、41、39、23、61、70、51、36 和 72 . 这些球上的数字之和为 923。数字 923 的类型大于或等于 811。因此投注“TO”获胜。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">{translate("奇偶")}</div>
                            <p>
                                {translate(
                                    "公司允许对抽出的 20 个编号球的总数是“单”还是“双”进行投注。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "奇数 - 20 个随机抽取的球的总和被视为奇数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "偶数 - 20 个随机抽取的球的总和被视为偶数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "示例：随机抽取的球编号为 69、42、37、8、68、74、45、71、64、16、17、19、41、39、23、61、70、51、36 和 72这些球上的数字之和是923。923是奇数。 因此，投注“ROID”获胜。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("龙/泪/虎")}
                            </div>
                            <p>
                                {translate(
                                    "本公司允许对抽出的 20 个编号为“龙”、“平”和“虎”的球的总结果进行投注。 龙（十）或虎（一排单位）之间的较大数字将决定获胜者。 如果龙和虎势均力敌，则平局获胜。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "龙 - 20 个数字球之和的十位数（倒数第二个数字）。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "老虎 - 20 个编号球之和的单位数字（最后一位数字）。",
                                )}
                            </p>
                            <p>{translate("平局 - 如果龙和虎相等。")}</p>
                            <p>
                                {translate(
                                    "示例：随机抽取的球编号为 69、42、37、8、68、74、45、71、64、16、17、19、41、39、23、61、70、51、36 和 72这些球上的数字之和为923。以数字最大的龙（十）或虎（个）为胜者。 在此示例中，龙（十位数）为“2”，虎（个位数）为“3”。 因此“3”大于“2”，因此投注“老虎”获胜。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "如果这两个数字相等，则“树”赌注获胜，但押在“龙”或“虎”上的全额赌注将被退回。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "如果是“获胜”，则支付给获胜者的赌注乘以 1.95；如果是“平局”，则支付给获胜者的赌注乘以 9（包括赌注）。",
                                )}
                            </p>
                        </div>
                        <div className="content-container_small">
                            <div className="sub-title">
                                {translate("上/撕/下")}
                            </div>
                            <p>
                                {translate(
                                    "公司允许对抽出的 20 个编号球的总结果是“大”、“平局”或“小”进行投注。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "上图 - 随机抽取的 20 个号码球中 01-40 范围内的位数大于 10。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "抽奖 - 随机抽取 20 个号码球，其中 01-40 范围内的位数恰好为 10，并且 41-80 范围内的位数也恰好为 10。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "下 - 随机抽取的 20 个号码球中 41-80 范围内的位数大于 10。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "示例：随机抽取的球编号为 69、42、37、8、68、74、45、71、64、16、17、19、41、39、23、61、70、51、36 和 72 . 01-40 范围内共有 8 位数字（8 ,16 ,17 ,19 ,23 ,36 ,37 ,39 ）和 12 位数字（41 ,42 ,45 ,51 ,61 ,64 , 68 ,69 ） ,70 ,71 ,72 ,74 ) 在 41-80 范围内。 所以赌“低于”获胜。",
                                )}
                            </p>
                        </div>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <div className="sub-title">
                                {translate("上/下-单/上-偶/下-偶")}
                            </div>
                            <p>
                                {translate(
                                    "公司允许根据抽出的 20 个编号球的总结果进行投注，分为“单”、“小单”、“大双”和“小双”。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "赔率 - 随机抽取的 20 个数字球的总和大于或等于 811，且总和的最后一位数字为奇数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "小奇数 - 随机抽取的 20 个数字球的总和小于或等于 810，且总和的最后一位数字为奇数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "超偶数 - 随机抽取的 20 个数字球的总和大于或等于 811，且总和的最后一位数字为偶数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "偶数下 - 随机抽取 20 个号码球之和小于或等于 810，且最后一位数字为偶数。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "示例：随机抽取的球编号为 69、42、37、8、68、74、45、71、64、16、17、19、41、39、23、61、70、51、36 和 72这些球上的数字之和是 923。数字 923 大于 811，并且最后一位数字为奇数。 所以赌注“FIRE”获胜。",
                                )}
                            </p>
                            <p>{translate("五行（金/木/水/火/土）")}</p>
                            <p>
                                {translate(
                                    "公司允许对“金”、“木”、“水”、“火”和“土”这 20 个编号的球的总结果进行投注。",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "针 - 随机抽取 20 个平躺数字球的总结果",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("隐私政策(大写)"),
                key: "3",
                content: (
                    <>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <p>
                                {translate(
                                    "Fun88始终承认并尊重会员的隐私。 保护会员数据的安全是我们的首要任务。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "我们保留所有会员的个人数据，并且不会将此信息透露给任何第三方，除非适用法律法规或法院命令要求这样做，但我们保留将会员的个人信息披露和转让给我们的权利的情况除外。信誉良好的支付服务提供商和金融机构在必要的范围内完成我们网站所提供服务的付款。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "用户提供的所有个人信息均使用 Secure Drive 软件（根据 128 位 SSL 安全标准）进行传输，并保存在安全的操作环境中，任何人都无法访问。 内部对数据的访问受到严格限制和控制。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "Fun88.com 和我们的合作伙伴可能会通过电子邮件联系会员，了解有利于会员的计划。 Fun88.com 的政策是不与任何第三方共享存储在 Fun88.com 上的任何个人身份资料。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>{translate("通过呼叫中心记录信息：")}</p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "当会员主动联系或在线客服联系会员时，通话内容将被录音，以检查通话质量并确保账户安全。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "会员请注意：在本网站成功注册账户即表示会员已认可并同意我们收集个人资料以及通话录音。",
                                )}
                            </p>
                        </div>
                    </>
                ),
            },
            {
                title: translate("责任声明"),
                key: "4",
                content: (
                    <>
                        <div
                            className="content-container_small"
                            style={{ marginBottom: 0 }}
                        >
                            <p>
                                {translate(
                                    "Fun88 以其成为一家值得信赖和负责任的在线游戏公司而自豪。 15年来，Fun88始终坚持以保护客户权益高于一切为主要目标。 同时始终遵守行业的规章制度，提高从注册到其他服务的客户服务质量。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "Fun88经过严格的安全检查，不仅为客户提供愉快的体验，还确保安全的游戏和交易场所。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "由于广大客户的支持，Fun88不断蓬勃发展。 不过，Fun88在服务质量上肯定会有短板，没有给顾客带来最好的。 近期，市场上出现多个假冒Fun88品牌并并行存在。 这严重损害了Fun88的形象，给会员造成混乱和欺诈。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "因此，出于澄清目的，Fun88 发表公开声明，Fun88 与 fun88.casino 网站没有任何关系。 Fun88 对通过本网站发生的任何客户交易不承担任何责任。 同时，Fun88目前正在采取必要行动，起诉fun88.casino的犯罪行为。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "请在登录或注册Fun88官方网站和频道时仔细咨询在线客服。 如果您发现或掌握上述诈骗公司的相关信息，请联系Fun88在线客服。 我们感谢您的支持。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "请放心，Fun88将始终致力于提供最优质的产品和服务以及安全可靠的交易。",
                                )}
                            </p>
                            <div className="line-distance"></div>
                            <p>{translate("谢谢。")}</p>
                        </div>
                    </>
                ),
            },
        ],
    },
];
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Tabactive: "0",
            defaultOpenKey: "Sub0",
            currentContentDataIndex: 0,
            tabsActiveKey: "1",
            isTriggerByQuery: false,
        };
    }
    componentDidMount() {
        if (this.props.router.query.type && this.props.router.query.key) {
            this.setState({ isTriggerByQuery: true });
            this.changeMenu(this.props.router.query.type);
            this.changeTab(this.props.router.query.key);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.router.query.type !== this.props.router.query.type ||
            prevProps.router.query.key !== this.props.router.query.key
        ) {
            this.setState({ isTriggerByQuery: true });
            this.changeMenu(this.props.router.query.type);
            this.changeTab(this.props.router.query.key);
        }
        if (
            prevState.Tabactive !== this.state.Tabactive &&
            !this.state.isTriggerByQuery
        ) {
            this.setState({
                tabsActiveKey: "1",
            });
        }
    }
    componentWillUnmount() {
        this.setState = () => false;
    }

    changeMenu = (type) => {
        let Tabactive;
        let defaultOpenKey;
        let currentContentDataIndex;
        switch (type) {
            case "Sub2":
                Tabactive = "2";
                defaultOpenKey = "Sub2";
                currentContentDataIndex = 2;
                break;
            case "Sub3":
                Tabactive = "3";
                defaultOpenKey = "Sub3";
                currentContentDataIndex = 3;
                break;
            case "Sub7":
                Tabactive = "7";
                defaultOpenKey = "Sub7";
                currentContentDataIndex = 7;
                break;
            default:
                Tabactive = "0";
                defaultOpenKey = "Sub0";
                currentContentDataIndex = 0;
                break;
        }
        this.setState({
            Tabactive,
            defaultOpenKey,
            currentContentDataIndex,
        });
    };
    changeTab = (key) => {
        let tabsActiveKey;
        switch (key) {
            // 如何提现
            case "132":
                tabsActiveKey = "3";
                break;
            // 如何转账
            case "133":
                tabsActiveKey = "2";
                break;
            // 彩金讯息
            case "134":
                tabsActiveKey = "1";
                break;
            // 规则条款
            case "137":
                tabsActiveKey = "2";
                break;
            // 隱私政策
            case "1086":
                tabsActiveKey = "3";
                break;
            default:
                tabsActiveKey = "1";
                break;
        }
        this.setState({
            tabsActiveKey,
        });
    };

    handleClick = (e) => {
        console.log("🚀 ~ Main ~ e.key:", e.key);
        this.setState({
            Tabactive: e.key,
            defaultOpenKey: e.keyPath[1] || e.key,
            currentContentDataIndex: Number(e.key),
            isTriggerByQuery: false,
        });
        let path = "";
        switch (e.key) {
            case "0":
                path = "/faq/ve-fun88";
                break;
            case "1":
                path = "/faq/account-management";
                break;
            case "2":
                path = "/faq/khuyen-mai-khac";
                break;
            case "3":
                path = "/faq/gui-tien";
                break;
            case "4":
                path = "/faq/fun88-mobile";
                break;
            case "5":
                path = "/faq/rewards";
                break;
            case "6":
                path = "/faq/affiliate";
                break;
            case "7":
                path = "/faq/responsible-gaming";
                break;
            default:
                break;
        }
        path && Router.push(path);
    };

    /**
     * TabPane 每个类型的子类
     * @param {Syring} e //TabPane 的key
     */
    changeTabPath = (e) => {
        console.log(
            "🚀 ~ Main ~ Tabactive:",
            this.state.Tabactive,
            typeof this.state.Tabactive,
            "e:",
            e,
            typeof e,
        );
        let path = "";
        switch (this.state.Tabactive) {
            case "0":
                if (e === "1") {
                    path = "/faq/ve-fun88";
                } else if (e === "2") {
                    path = "/faq/lien-He";
                }
                break;
            case "1":
                break;
            case "2":
                if (e === "1") {
                    path = "/faq/khuyen-mai-khac";
                } else if (e === "2") {
                    path = "/faq/hoan-tra";
                } else if (e === "3") {
                    path = "/faq/promotion-others";
                }
                break;
            case "3":
                if (e === "1") {
                    path = "/faq/gui-tien";
                } else if (e === "2") {
                    path = "/faq/chuyen-quy";
                } else if (e === "3") {
                    path = "/faq/rut-tien";
                }
                break;
            case "4":
                break;
            case "5":
                break;
            case "6":
                break;
            case "7":
                if (e === "1") {
                    path = "/faq/responsible-gaming";
                } else if (e === "2") {
                    path = "/faq/betting-rules";
                } else if (e === "3") {
                    path = "/faq/privacy-policy";
                } else if (e === "4") {
                    path = "/faq/disclaimer";
                }
                break;
        }
        path && Router.push(path);
    };
    render() {
        const { defaultOpenKey, currentContentDataIndex, tabsActiveKey } =
            this.state;
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                seoData={this.props.seoData}
            >
                <div className="common-distance-wrap" id="help">
                    <div className="common-distance about-content">
                        <div className="left">
                            <Menu
                                key={this.state.Tabactive}
                                defaultSelectedKeys={[this.state.Tabactive]}
                                defaultOpenKeys={[defaultOpenKey]}
                                style={{ width: 200 }}
                                onClick={(e) => this.handleClick(e)}
                                mode="inline"
                            >
                                {CONTENTDATA.map((item, index) => {
                                    return (
                                        <Menu.Item
                                            key={index}
                                            mkeys={index}
                                            type={item.title}
                                        >
                                            {item.title}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu>
                        </div>
                        <div className="right">
                            <div className="box_body">
                                <div
                                    id={`ID_${currentContentDataIndex}`}
                                    style={{ width: 780 }}
                                >
                                    <h2>
                                        {
                                            CONTENTDATA[currentContentDataIndex]
                                                .title
                                        }
                                    </h2>
                                    <Tabs
                                        className="help-tabBar"
                                        activeKey={tabsActiveKey}
                                        tabBarStyle={{
                                            borderBottom: "1px solid #E0E0E0",
                                            marginBottom: "30px",
                                        }}
                                        onChange={(e) => {
                                            this.setState({
                                                tabsActiveKey: e,
                                            });
                                            this.changeTabPath(e);
                                        }}
                                    >
                                        {CONTENTDATA[
                                            currentContentDataIndex
                                        ].tabs.map((tab) => {
                                            return (
                                                <TabPane
                                                    className="help-tabPane"
                                                    tab={tab.title}
                                                    key={tab.key}
                                                >
                                                    {tab.content}
                                                </TabPane>
                                            );
                                        })}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
export default withRouter(Main);
