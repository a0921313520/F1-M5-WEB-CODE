import HostConfig from "./Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
const URL = HostConfig.Config.HostApi;
const BFFSCURL = HostConfig.Config.BffscHostApi
const LOCAL_HOST = HostConfig.Config.LocalHost;
export const CMSAPIUrl = HostConfig.Config.CMSAPIUrl;
export const APISET = "?api-version=2.0&Platform=Desktop";
export const APISETS = "&api-version=2.0&Platform=Desktop";
export const LoginAPISET = "?api-version=8.0&Platform=Desktop";
export const ApiPort = {
    URL,
    LOCAL_HOST,
    PostLogin: URL + "/api/Auth/Login" + LoginAPISET, // 登录
    LogoutAPI: URL + "/api/Auth/Logout" + APISET, // 注销登录
    PostRegister: URL + "/api/Member/Register" + APISET, // 注册
    GETMemberlistAPI: URL + "/api/Member" + APISET, // 会员中心个人详情数据
    POSTMemberlistAPI: URL + "/api/Member" + APISET, // 更新会员中心资料
    PATCHMemberlistAPI: URL + "/api/Member" + APISET, // PATCH更新单个秘密答案的时候使用
    PUTMemberlistAPI: URL + "/api/Member" + APISET, // PUT更新会员的个人资料
    POSTEmailVerifyAPI: URL + "/api/Verification/Email" + APISET, // 验证邮箱
    POSTEmailVerifyLink: URL + "/api/Verification/Email/VerifyLink" + APISET, // 验证邮箱链接
    POSTEmailTAC: URL + "/api/Verification/Email/VerifyTac" + APISET,
    POSTPhoneVerifyAPI: URL + "/api/Verification/Phone", // 验证手机号码发送验证码
    POSTPhoneVerifyTAC: URL + "/api/Verification/Phone" + APISET,
    MemberFlagsStatus: URL + "/api/Member/CustomFlag" + APISET, //返回存款验证步骤，是否可以修改验证的手机号码
    VerificationAttempt: URL + "/api/Verification/OTPAttempts" + APISET, //验证相关剩余的次数
    GETDepositDetailsAPI:
        URL +
        "/api/Payment/Method/Details?transactionType=deposit" +
        APISETS +
        "&method=", // 返回所选付款方式的详情
    // GETWithdrawalDetailsAPI: URL + '/api/Payment/Method/Details?transactionType=Withdrawal&method=LB' + APISETS, // 获取提款详情
    GETPaymentlistAPI:
        URL + "/api/Payment/Methods?transactionType=Deposit" + APISETS, // 返回平台开启的钱包列表
    GETBonuslistAPI: URL + "/api/Bonus?transactionType=", // 返回优惠信息
    POSTCalculateAPI: URL + "/api/Bonus/Calculate" + APISET, // 向后台传优惠信息的ID计算返回的结果
    POSTApplications: URL + "/api/Payment/Application" + APISET, // 开始充值
    GETWallets: URL + "/api/Transfer/Wallets" + APISET, // 返回可以转账的账户
    POSTTransfer: URL + "/api/Transfer/Application" + APISET, // 转账and一键转账
    GETBalance: URL + "/api/Balance?wallet=", // 余额
    GETtransaction:
        URL +
        "/api/Payment/Applications?transactionType=Deposit&paymentMethod=", // 存款的交易记录
    GETWithdrawalReport:
        URL +
        "/api/Payment/Applications?transactionType=Withdrawal&paymentMethod=", // 提款的交易记录
    GETTransferReport: URL + "/api/Transfer/Histories", // 转账的交易记录
    GETPromotionCategories: URL + "/api/CMS/PromotionCategories" + APISET, // 优惠类别
    POSTPromotionList: URL + "/api/CMS/Promotions?promoCategory=", // 优惠详情
    POSTPromotionApplications: URL + "/api/Promotion/ManualPromo" + APISET, // 申请优惠
    GETManualPromoMaxApplicant:
        URL + "/api/Promotion/ManualPromo/CheckMaxApplicant" + APISET, //取得Manual優惠是否已達最大申請人數
    
    GETCanWithdrawalPay:
        URL + "/api/Payment/Methods?transactionType=Withdrawal" + APISETS, // 返回提款的方式可用列表
    GETWithdrawalbank:
        URL +
        "/api/Payment/Method/Details?transactionType=Deposit&isMobile=false&Withdrawal&method=LB&hostName=" +
        LOCAL_HOST +
        APISETS, // 提款新账户 返回的银行列表
    GETMemberBanksfirst: URL + "/api/Payment/MemberBanks?AccountType=ALL" + APISETS, // 获取提款首选账户
    POSTRememberBanks: URL + "/api/Payment/MemberBank" + APISET, // 提款记住我
    PUTMemberPassword: URL + "/api/Auth/ChangePassword/" + APISET, // 修改密碼
    PTMemberPwd: URL + "/api/Member/Password" + APISET, //安全验证修改密码
    PATCHMemberBanksDefault: URL + "/api/Payment/MemberBank/SetDefault", // 个人资料设置默认银行账户
    DELETEMemberBanksDefault: URL + "/api/Payment/MemberBank/", // 删除银行卡
    GETCategory: URL + "/api/ProfileMasterData?category=Nations" + APISETS, // 国家
    GETCheckVendor: URL + "/api/Vendor/PT" + APISET, // 检查PT金币皇账户是否存在
    GETCheckVendorUsername: URL + "/api/Vendor/PT/Username" + APISET, // 检查PT金币皇用户名是否存在
    PUTPTChangePWD:
        URL + "/api/Vendor/0/Password?redirectUrl=" + LOCAL_HOST + APISETS, // 修改PT金币皇账户密码
    GETSelfExclusions: URL + "/api/Member/SelfExclusion" + APISET, // 行为限制详情
    PUTSelfExclusions:
        URL + "/api/Member/SelfExclusion?redirectUrl=" + LOCAL_HOST + APISETS, // 设置限制
    POSTForgetPassword:
        URL + "/api/Member/ForgetPassword?redirectUrl=" + LOCAL_HOST + APISETS, // 忘记密码
    POSTCZForgetPassword: URL + "/api/Member/ForgetPassword?", // 重置密码
    POSTForgetUsername: URL + "/api/Auth/ForgetUsername/Email?", // 忘记用户名
    POSTEmailForgetPassword: URL + `/api/Auth/ForgetPassword/Email` + APISET, // 忘记密码验证邮箱
    GETDomainUrl: URL + "/api/App/AffiliateLM?domain=" + LOCAL_HOST + APISETS, // 获取合作伙伴地址
    GETBonusOptions: URL + "/api/Bonus" + APISET, // 红利记录的下拉菜单数据
    GETBonusApplications: URL + "/api/Bonus" + APISET, // 红利记录
    GETBonusAppliedHistory: CMSAPIUrl + "/vi-vn/api/v1/bonus/applied/history",
    // GETBonusApplications: URL + '/api/Bonus/Applications?', // 红利记录
    POSTPaymentConfirmStep: URL + "/api/Payment/Application/", // 确认交易
    GETUserBetHistory:
        URL + "/api/Member/MemberDailyTurnoverByProductType" + APISET, // 投注记录
    GETNewBetHistory: URL + "/api/Member/MemberDailyTurnoverByProductType?", // 投注记录新api
    GetNewBetHistoryDetail: URL + "/api/Member/MemberDailyTurnover" + APISET, // 获取投注记录详情
    GETLiveChat: URL + "/api/LiveChat/Url" + APISET, // 在线客服
    POSTNoCancellation: URL + "/api/Payment/Application/Cancellation/", // 取消交易
    GETHomeBannertrue:
        URL +
        "/api/CMS/Banners?pageType=Banner&isLogin=true&category=1" +
        APISETS, // 登录后的首页Banner
    GETHomeBannerfalse:
        URL +
        "/api/CMS/Banners?pageType=Banner&isLogin=false&category=1" +
        APISETS, // 未登录后的首页Banner
    POSTBonusClaim: URL + "/api/Bonus/Claim" + APISET, // 红利奖励领取
    CancelBonusPromotion: URL + "/api/Bonus/CancelPromotion" + APISET, // 我的优惠撤销
    GETSettingwithdrawal:
        URL + "/api/Setting?key=withdrawalverification" + APISETS, // 是否需要强制验证
    GetDownloadLink: URL + "/api/Download", // 下载链接
   
    SosBonusVerifications: URL + "/api/SosBonus/Verifications" + APISET, // 电子游戏紧急救援金 第一步验证
    SosBonusApplications: URL + "/api/SosBonus/Applications" + APISET, // 老虎金紧急救援金 第二步，第一步验证成功后 调用此接口
    LatteryHistory: URL + "/api/CMS/Promotions/Applications", // 彩金历史-其他
    ApplicationsByDate: URL + "/api/Bonus/ApplicationsByDate",
    POSTBonusApplications: URL + "/api/Bonus/Application" + APISET, //申請紅利
    ALBStatus: URL + "/api/Payment/UpdateIsQRLocalAliPay?", // 支付宝转账是否成功充值 回馈
    Verifytest: URL + "/api/Member/Prohibited/Verify" + APISET, // 检测用户
    // getLuckySpinRecords: URL + '/api/MiniGames/LuckySpin/History?dateFrom=2020-10-01&dateTo=2020-11-15&eventType=DoubleEleven' + APISETS, // 輪盤紀錄
    // LuckySpin: URL + '/api/MiniGames/LuckySpin?eventType=DoubleEleven' + APISETS,// 輪盤
    RebateBonus: URL + "/api/Bonus/RebateBonus?", // 彩金历史
    RebateBonusHistory: CMSAPIUrl + "/vi-vn/api/v1/rebate/history" + APISET, // 我的返水
    RebateBonusDetail: URL + "/api/Rebate/RebateDetails" + APISET, // 我的返水详情
    DayBonusHistory: URL + "/api/Bonus/RebateBonusSummary" + APISET,
    RefreshTokenapi: URL + "/api/Auth/RefreshToken" + APISET /* 刷新token */,
   
    PostLinkVerification: URL + "/api/Member/LinkVerification" + APISET,
    GetQuestions:
        URL +
        "/api/Setting/MasterData/SecurityQuestions" +
        APISET /* 获取密保问题 */,

    RegistrationBonus:
        URL + "/api/Bonus/RegistrationSuccess" + APISET /* 获取新用户注册优惠*/,

    /*头部导航菜单列表 */
    GameCategory: CMSAPIUrl + "/vi-vn/Games/Providers/Sequence" + APISET ,

    /* 游戏分类类形列表 */
    CmsSubCategory: CMSAPIUrl + "/vi-vn/Games/Categories/Details" ,

    // 游戏平台接口
    ProvidersDetails: CMSAPIUrl + "/vi-vn/Games/Providers/Details" + APISET, 

    CmsGames: CMSAPIUrl + "/vi-vn/Games",

    CmsPromotionRule:
        CMSAPIUrl +
        "/vi-vn/api/v1/web/faq/detail/" +
        CMSOBJ[HostConfig.CMS_ID][0], // 优惠Page获取规则条款
    Opengame: URL + "/api/Games/Launch",
    GetRebateHistory: CMSAPIUrl + "/vi-vn/api/v1/rebate/history" + APISET,
    Promotions: CMSAPIUrl + "/vi-vn/api/v1/web/Promotions",
    PromotionDetail: CMSAPIUrl + "/vi-vn/api/v1/web/promotion?", //优惠列表
    PromotionContent: CMSAPIUrl + "/vi-vn/api/v1/web/Promotion",
    PromApplications: URL + "/api/CMS/Promotions/Applications" + APISET, // 申请表格优惠
    RewardURLs: URL + "/api/App/RewardURLs",
    Sponsorship: CMSAPIUrl + "/vi-vn/api/v1/web/sponsorship/teams",
    GetVipIntroductioinPicture:
        CMSAPIUrl + "/vi-vn/api/v1/web/webbanners/position/vip", // 获取同乐币介绍图片
    GetCoinIntroductioinPicture:
        CMSAPIUrl + "/vi-vn/api/v1/web/webbanners/position/coin", // 获取会员权益图片
    GetTemplateCategories: URL + "/api/News/TemplateCategories" + APISET, // 获取消息中心分类类别（暂时写死，不使用！）
    GetProductCategories:
        URL + "/api/Games/DailyTurnover/ProductTypes" + APISET, // 获取投注记录筛选分类
    
    ReferrerLinkActivity: URL + "/api/Quelea/ReferrerLinkActivity" + APISET, // 点击链接数量控制
    ReferrerEligible: URL + "/api/Quelea/ReferrerEligible" + APISET, // 获取推荐人资格条件
    GetQueleaInfo: URL + "/api/Quelea/ReferrerInfo" + APISET, // 获取推荐人详情
    ReferrerRewardStatus: URL + "/api/Quelea/ReferrerRewardStatus" + APISET, // 获取推荐人奖励状态
    ReferrerSignUp: URL + "/api/Quelea/ReferrerSignUp" + APISET, // 注册会员成为Quelea推荐人
    GetQueleaActiveCampaign: URL + "/api/Quelea/ActiveCampaign" + APISET, // 获取最新Quelea推荐活动详情
    ReferrerActivity: URL + "/api/Quelea/ReferrerActivity" + APISET, // 获取被推荐人任务详情
    ReferreeTaskStatus: URL + "/api/Quelea/ReferreeTaskStatus" + APISET, // 获取被推荐人任务状态
    Announcements: URL + "/api/Announcement/Announcements" + APISET, // 获取按类别过滤的公告列表(GET)
    ActionOnAnnouncement:
        URL + "/api/Announcement/ActionOnAnnouncement" + APISET, // 更新每个成员的每个公告项目的读取/打开状态(PATCH)
    AnnouncementIndividualDetail:
        URL + "/api/Announcement/AnnouncementIndividualDetail" + APISET, // 通过ID获取公告项(GET)
    InboxMessages: URL + "/api/PersonalMessage/InboxMessages" + APISET, // 通过->消息类型ID和选项ID获取成员收件箱消息。(GET)
    InboxMessageIndividualDetail:
        URL + "/api/PersonalMessage/InboxMessageIndividualDetail" + APISET, // 通过消息ID获取消息。(GET)
    ActionOnInboxMessage:
        URL + "/api/PersonalMessage/ActionOnInboxMessage" + APISET, // 更新消息状态，将IsOpen和IsRead设置为true。(PATCH)
    UnreadCounts: URL + "/api/PersonalMessage/UnreadCounts" + APISET,
    MarkStatistics: URL + "/api/Member/Statistics?key=unreadPMACount" + APISETS, // 获取全部消息的未读数量 旧版本的三个值为(UnreadTransactionCounts, UnreadPersonalMessagCounts, UnreadAnnouncementCounts)
    GetSecurityCode: URL + "/api/Auth/GeneratePasscode" + APISET, // 获取安全码
    GetCryptocurrencyInfo: URL + "/api/Payment/Cryptocurrency/Details" + APISET, //极速虚拟币支付
    SuggestedAmount: URL + "/api/Payment/SuggestedAmounts", // 推荐金额
    GetExchangeRate: URL + "/api/Payment/Cryptocurrency/ExchangeRate", //获取泰达币提现汇率
    GETWithdrawalDetailsAPI:
        URL +
        "/api/Payment/Method/Details?transactionType=Withdrawal" +
        APISETS, // 获取某个方式的提款详情
    AddExchangeRateWallet:
        URL + "/api/Payment/Cryptocurrency/WalletAddress" + APISET, // 添加虚拟货币錢包
    CheckExchangeRateWallet: URL + "/api/Payment/Cryptocurrency/WalletAddress", // 查询会员虚拟货币錢包
    setTDBDefaultWallet:
        URL + "/api/Payment/Cryptocurrency/WalletAddress/Default", //设置默认钱包

    Captchaswitch: URL + "/api/Member/Captcha" + APISET, //极验开关
    ConfiscatedMemberVerification:
        URL + "/api/Member/ConfiscatedMemberVerification" + APISET, //失效帳號驗證/被關閉帳號提示
    ConfiscatedMemberVerifyAttempts:
        URL + "/api/Member/ConfiscatedMemberVerifyAttempts" + APISET, //獲取次數 > 失效帳號驗證/被關閉帳號提示
    ConfiscatedAccountInfoValidation:
        URL + "/api/Member/ConfiscatedAccountInfoValidation" + APISET, //失效帳號驗證/被關閉帳號提示

    CheckIsAbleSmsOTP: URL + "/api/Verification/Payment/Phone" + APISET, // 查询会员是否能够请求短信OTP
    PostSendSmsOTP: URL + "/api/Verification/Payment/Phone", // 提交请求短信OTP
    PostVerifySmsOTP: URL + "/api/Verification/Payment/Phone", // 返回是否成功验证短信OTP
    SurveySubmit: URL + "/api/LiveChat/MemberSurvey/Feedback" + APISET, // 客户服务评价
    SurveyVerifyLink: URL + "/api/LiveChat/MemberSurvey/VerifyLink" + APISET, // 客户服务评价链接是否有效

    CheckWalletPreBonus: URL + "/api/Bonus/CheckWalletPreBonus" + APISET, // 检查

    CheckWithdrawalThreshold:
        URL + "/api/Payment/Transaction/CheckWithdrawalThreshold", //查看用户提款卡是否受限制
    GetWithdrawalThresholdHistory:
        URL + "/api/Payment/Transaction/WithdrawalThresholdHistories", //获取会员已完成某次提款的门槛记录
    GetWithdrawalThresholdLimit:
        URL + "/api/Payment/Transaction/WithdrawalThresholdLimit" + APISET, //获取银行卡咨询提款限制的tip
    SetWithdrawalLimit:
        URL + "/api/Payment/Transaction/MemberWithdrawalThreshold" + APISET, //设置提款额度
    GetMemberWithdrawalThreshold:
        URL + "/api/Payment/Transaction/MemberWithdrawalThreshold" + APISET, //获取提款限制

    InvoiceAutCryptoDeposit:
        URL + "/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit", //虚例币支付二我已成功充值提交
    InvoiceAutCancelTheDeal:
        URL + "/api/Payment/Application/MemberCancelDeposit", //虚例币支付二取消交易
    FastvirtualCurrencyPaymentTwo:
        URL + "/api/Payment/Transaction/ProcessingDepositbyMethod" + APISET, //虚例币支付二
    GenerateRedirectToken: URL + "/api/Member/GenerateRedirectToken" + APISET, // 获取转接8号商城token
    VerifyRedirectToken: URL + "/api/Member/VerifyRedirectToken" + APISET, // 验证首页跳转token
    CancelPaybnbDeposit:
        URL +
        "/api/Payment/Applications/Transactions/CancelPaybnbDeposit" +
        APISET +
        "&", // 本地银行转账银行账户无法使用时取消操作回调

    SubmitResetPasswordLink: URL + "/api/Auth/ResetPassword" + APISET, // 新增重置密码链接
    PhonePrefix: URL + "/api/Setting/Phone/Prefix" + APISET, // 验证注册手机号前缀
    // Feedbackform: URL + '/api/member/feedbackform' + APISET, // USDT介绍问题反馈
    Feedbackform: URL + "/api/LiveChat/USDT/Feedback" + APISET, // USDT介绍问题反馈
    VerifyResetPasswordLink: URL + "/api/Verification/Email/Token" + APISET, // 重置密码EncText验证
    CheckWalletForBonus: URL + "/api/Bonus/CheckWalletForBonus" + APISET, // 直接申请优惠前置判定
    DirectApplyBonus: URL + "/api/Bonus/DirectApplyBonus" + APISET, // 直接申请优惠请求接口
    GetProvinces: URL + "/api/Promotion/Province" + APISET, // 省
    GetDistricts: URL + "/api/Promotion/District" + APISET, // 地区
    GetTowns: URL + "/api/Promotion/Town" + APISET, // 城镇
    GETisSafeHouse: URL + "/api/App/IsSafehouse" + APISET, //判斷安全屋 domain
    Safehouse: URL + "/api/Member/Safehouse" + APISET, //安全屋登入前检查
    SetChangePassword:
        URL +
        "/api/Auth/ChangePassword" +
        APISET +
        "&oldPasswordRequired=false", //更新密码

    GetVipFaqList: CMSAPIUrl + "/vi-vn/api/v1/web/vip/faq", //VIP 详情 常见问题列表
    DiamondClubDetail: CMSAPIUrl + "/vi-vn/api/v1/web/about/detail/all", //天王俱乐部
    CmsBanner: CMSAPIUrl + "/vi-vn/api/v1/web/webbanners/position/", //获取各个位置banner

    /** 双十一2021 <------- */
    LuckySpinHistoryDouble:
        URL +
        "/api/MiniGames/LuckySpin/History?dateFrom=2021-10-22T00:00:00&dateTo=2021-11-30T23:59:59&eventType=DoubleEleven" +
        APISETS, // 获取抽奖记录  2021-09-17&dateTo=2021-09-21&eventType=MidAutumn
    LuckySpinDouble:
        URL + "/api/MiniGames/LuckySpin?eventType=DoubleEleven" + APISETS, // 抽奖
    /** 双十一2021  -------> */

    /** 红包雨2022 <------- */
    RainLuckySpin:
        URL + "/api/MiniGames/LuckySpin?eventType=RainingPromotion" + APISETS, // 抽奖
    /** 红包雨2022  -------> */

    /** 交易记录新版2021 <------- */
    SubWithdrawal: URL + "/api/Payment/Applications", // 交易记录 充值、提现
    BankingHistory: URL + "/api/Payment/Application/BankingHistory" + APISET, // 交易记录 充值、提现
    TransferHistory: URL + "/api/Transfer/Application" + APISET, // 交易记录 转账
    UploadAttachment:
        URL + "/api/Payment/Application/UploadAttachment" + APISET, // 上传交易凭证
    GetResubmitDepositDetails:
        URL + "/api/Payment/Transaction/ResubmitDepositDetails" + APISET, // 重新提交的交易详情
    GetTransactionDetail: URL + "/api/Payment/Transaction/History" + APISET, // 交易记录详情
    MemberRequestDepositReject:
        URL + "/api/Payment/Application/MemberRequestDepositReject" + APISET, // 取消充值
    CreateResubmitOnlineDeposit:
        URL + "/api/Payment/Transaction/CreateResubmitOnlineDeposit" + APISET, // 重新提交充值
    /** 交易记录新版2021  -------> */

    /** 更改注册成功UI，提交是否参加首充验证优惠 <------- */
    MemberHighPriorityCall:
        URL + "/api/CallAgent/MemberHighPriorityCall" + APISET,
    /** 更改注册成功UI，提交是否参加首充验证优惠  -------> */

    /** 新增身份证完善、手机号验证可更新一次逻辑 <------- */
    IsPhoneAllowedEdit: URL + "/api/member/IsPhoneAllowedEdit" + APISET, // 获取手机号是否可更新
    GetOTPAttempts: URL + "/api/Verification/OTPAttempts" + APISET, // 获取手机号尝试次数
    /** 新增身份证完善、手机号验证可更新一次逻辑  -------> */
    //获取邮箱验证剩余尝试次数
    GetEmailOTPAttempts:
        URL + "/api/Verification/Email/GetOTPAttempts" + APISET,

    ConfirmWithdrawalComplete:
        URL + "/api/Payment/Applications/ConfirmWithdrawalComplete",
    CaptchaInfo: URL + '/api/Verification/Captcha/Info'  + APISET, //获取滑动验证码验证记录
    //登录图形验证获取id
    RequestCaptchaChallengeId:
        URL + "/api/Verification/Captcha/ChallengeId" + APISET,
    //上传验证银行卡和身份证照片信息
    BanksVerificationUploadFile:
        URL + "/api/Payment/MemberBanksVerificationAttachment" + APISET,
    MemberBanksVerificationManual:
        URL + "/api/Payment/MemberBanksVerificationManual" + APISET,
    //PII验证银行卡获取验证次数
    GetBankcardVerificationAttempts:
        URL + "/api/Payment/GetBankcardVerificationAttempts" + APISET,

    //世界杯
    GetWcCupLuckySpinHistory: URL + "/api/MiniGames/LuckySpin/History" + APISET, //抽奖记录
    WorldCupLuckySpin: URL + "/api/MiniGames/LuckySpin" + APISET, //活动是否开启
    GetProvidersMaintenanceStatus:
        URL +
        "/api/Games/GetProvidersMaintenanceStatus?Provider=IPSB" +
        APISETS, //IM体育是否能正常
    //获取紧急公告
    getNews: URL + "/api/Announcement/Popup" + APISET,
    //已读该条公告
    readNews: URL + "/api/News/UpdateAnnouncementNotShowAgainFlag" + APISET,
    
    //小额提款第二次建议金额
    GetPrefixAmount: URL + "/api/Payment/ClosestPrefixAmount" + APISET,
    // 每日好禮API
    GetDailydealsList:
        CMSAPIUrl + "/vi-vn/api/v1/web/promotions?type=daily" + APISETS,
    //每日好礼地址信息
    ShippingAddress: URL + "/api/Promotion/ShippingAddress" + APISET,
    //提交每日好礼申请
    PostDailyDeals: URL + "/api/Promotion/DailyDeals" + APISET,
    ThroughoutVerification:
        URL +
        "/api/Quelea/ThroughoutVerification" +
        APISET /*获取好友推荐的优惠逻辑 */,
    GetVerificationMemberDocuments:
        URL + "/api/Verification/MemberDocuments" + APISET, //获取上传文档的进度
    GetDocumentApprovalStatus:
        URL + "/api/Verification/DocumentApprovalStatus" + APISET, //获取是否需要上传文档的状态
    UploadDocument: URL + "/api/Verification/MemberDocument/Upload" + APISET, //上传身份信息资料
    WithdrawalVerification: URL + "/api/Setting/WithdrawalVerification", //获取提款之前验证资料
    AccountHolderName: URL + "/api/Verification/AccountHolderName" + APISET, //提款需要验证文件的弹窗，点击立即验证按钮触发此api
    GetGameMaintenanceStatus:
    URL + "/api/Games/Navigation/MaintenanceStatus" + APISET,
    POSTPhoneVoiceVerifyAPI: URL + "/api/Verification/Voice", // 语音验证(发送)
    PATCHPhoneVoiceVerifyAPI: URL + "/api/Verification/Voice"+APISET, // 语音验证(提交)
    //检查用户名是否被注册过
    GETInfoValidity: URL + "/api/Member/InfoValidity", 
    PostWelcomeCall: URL + "/api/Member/WelcomeCall" + APISET,  
    GetBankMaintenanceInfo: BFFSCURL + "/api/Payment/Banks/MaintenanceInfo"  + APISET, //获取银行营业时间

    /* 整合CMS和BFF API */
    PromotionCategories: CMSAPIUrl + "/vi-vn/api/v1/promotion/categories",
    RebateRunningDetails: URL + "/api/Promotion/Rebate/RunningDetails" + APISET, // 返水細節
    RebateHistories: URL + "/api/Promotion/Rebate/Histories" + APISET, // 返水歷史
    FreebetBonusGroups: URL + "/api/Promotion/Freebet/BonusGroups" + APISET, // 免費投注群組
    AppliedHistory: URL + "/api/Bonus/AppliedHistory" + APISET, // 應用歷史
    DailyDealsHistories: URL + "/api/Promotion/DailyDeals/Histories" + APISET, // 每日好礼记录
    BonuslistAPI: URL + "/api/Bonus" + APISET, // 获取存款红利
    GETDailyDeals: URL + "/api/Promotion/DailyDeals" + APISET, //提交每日好礼申请
    MemberPromoHistories: URL + "/api/Promotion/MemberPromoHistories" + APISET, // 会员促销历史
    CMSRebateList: CMSAPIUrl + "/vi-vn/api/v1/web/promotions?type=rebate", // 反水清單
    CMSPromotionDetail: CMSAPIUrl + "/vi-vn/api/v1/web/promotion?", // api优惠列表
    CMSPromotionList: CMSAPIUrl + "/vi-vn/api/v1/web/promotions?",
    CMSAppliedHistory: CMSAPIUrl + "/cms/promotions-m3/",
    CMSRebateHistory: CMSAPIUrl + "/cms/promotions-m3/rebateids/",
    CMSConfigs: CMSAPIUrl + "/cms/vi-vn/fe-configs",//获取天王俱乐部链接
    /* ----------------------------------------------------------------------------------------- */
};
