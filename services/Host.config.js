// 初始化 Config 对象和 CMS_ID 变量
let Config = {};
let CMS_ID = 1;
// 定义 SL_LIVE_CMS_TOKEN、SL_CMS_URL、LIVE_CMS_URL 和 STAGE_CMS_URL 常量
export const STAGE_KZAPI_TOKEN = "HUJGHPA2UV5HJYFONNG0UVKZHAUFFGZ";
export const PROD_KZAPI_TOKEN = "BTOY9COS1QKDJREUGFA2BTAMVPEOA0C";
export const STAGE_CMS_URL = "https://cmsapistag.fun88.biz";
export const SL_CMS_URL = "https://cmsapisl.fun88.biz";
export const LIVE_CMS_URL = "https://cache.huya66.cc";

// 导入 Domainparse 函数（从 "$ACTIONS/util" 模块中）
import { Domainparse } from "./../utils";

// 检查是否在浏览器环境中运行
if (typeof global.location !== "undefined") {
    // 获取当前主机名，并检查其是否与任何测试 URL 匹配
    const LocalHost = global.location.host;
    const stagingMap = LocalHost.match(/p5stag(\S*).fun88.biz/);
    const Devwhich = stagingMap && stagingMap.length >= 2 ? stagingMap[1] : "";

    //灰度环境测试域名
    const SlApi = Boolean(
        [
            "p5sl.fun88.biz",
            "p5sl1.fun88.biz",
            "p5sl2.fun88.biz",
            "p5sl3.fun88.biz",
            "p5sl4.fun88.biz",
            "p5sl5.fun88.biz",
            "p5sl6.fun88.biz",
            "p5sl7.fun88.biz",
            "p5sl8.fun88.biz",
            "localhost:6868",
        ].find((v) => global.location.href.includes(v))
    );
    // 本地开发环境
    if (LocalHost === "localhost:8003") {
        Config = {
            HostApi: "https://gateway-idcstgf1p5vn.gamealiyun.com", //STG Master
            // HostApi: "https://gateway-idcslf5vn.gamealiyun.com", //SL Master
            // HostApi: "https://gateway-idcf5vn.fun601.com", //Live
            BffscHostApi: "https://febff-api-staging-m3-instance01.fun88.biz",
            LocalHost: "https://" + LocalHost + "/",
            IMAccessCode: "cbe2c39c75137de4",
            seasonId: 24,
            CMSAPIUrl: STAGE_CMS_URL,
            IsLIVE: false,
            IsSoftLaunch: false,
            IsStaging: true,
            Devwhich,
        };
        CMS_ID = 0;
    }
    //测试1-8分支
    else if (Devwhich) {
        Config = {
            HostApi: `https://gateway-idcstgf1p5vn0${Devwhich}.gamealiyun.com`,
            BffscHostApi: `https://febff-api-staging-m3-instance0${Devwhich}.fun88.biz`,
            LocalHost: "https://" + LocalHost + "/",
            IMAccessCode: "cbe2c39c75137de4",
            seasonId: 24,
            CMSAPIUrl: STAGE_CMS_URL,
            IsLIVE: false,
            IsSoftLaunch: false,
            IsStaging: true,
            Devwhich,
        };
        CMS_ID = 0;
    }
    //测试主分支
    else if (LocalHost === "p5stag.fun88.biz") {
        Config = {
            HostApi: `https://gateway-idcstgf1p5vn.gamealiyun.com`,
            BffscHostApi: "https://febff-api-staging-m3.fun88.biz",
            LocalHost: "https://" + LocalHost + "/",
            IMAccessCode: "cbe2c39c75137de4",
            seasonId: 24,
            CMSAPIUrl: STAGE_CMS_URL,
            IsLIVE: false,
            IsSoftLaunch: false,
            IsStaging: true,
            Devwhich,
        };
        CMS_ID = 0;
    }
    // 如果在 SL URL 上，则使用灰度环境设置
    else if (SlApi) {
        Config = {
            HostApi: "https://gateway-idcslf5vn.gamealiyun.com",
            BffscHostApi: "https://febff-api-softlaunch-m3.fun88.biz",
            LocalHost: "https://" + LocalHost + "/",
            IMAccessCode: "85a983ec2611cc67",
            seasonId: 24,
            CMSAPIUrl: SL_CMS_URL,
            IsLIVE: false,
            IsSoftLaunch: true,
            IsStaging: false,
        };
    }
    // 否则，使用线上环境设置
    else {
        const parsed = Domainparse(window.location.host);
        const LiveHostApi = `https://gateway-idcf5vn.${
            parsed.sld || "gamealiyun"
        }.${parsed.tld}`;
        Config = {
            HostApi: LiveHostApi,
            BffscHostApi: "https://gatewayvn-scf1.fun88.biz",
            IMAccessCode: "85a983ec2611cc67",
            seasonId: 24,
            LocalHost: "https://" + LocalHost + "/",
            CMSAPIUrl: LIVE_CMS_URL,
            IsLIVE: true,
            IsSoftLaunch: false,
            IsStaging: false,
        };
    }
}

// 将 Config 和 CMS_ID 导出为默认值
export default { Config, CMS_ID };
