// 测试线与线上的CMS ID分类
/*
// Stage Live 整理： https://docs.google.com/spreadsheets/d/1W0-6ZcoWMB9c--Q2v9R1Do0Whybca6yj1MneIbCSSAM/edit#gid=1845510735

// 生成简介
let str1 = "规则与条款-----彩票游戏玩法介紹-----电子游戏玩法介紹-----棋牌游戏玩法介紹-----行为限制的介绍-----让分后，XXXXXX？-----什么叫做滚球？-----IM 体育-----MG 电子-----GD百家乐-----操作界面-----苹果安装-----优惠规则-----真人娱乐玩法介紹-----什么是体育投注？-----电子竞技玩法介紹-----如何充值-----5. Colossus 钜彩（Colossus Bets）-----4. 虚拟运动规则-----3. 特定赛事投注规则-----2. 赌盘（投注类型）规则之一般规则-----隐私政策-----理性博彩-----1. 一般投注规则与规定-----体育投注-----规则条款-----电子投注-----彩金讯息-----如何转账-----如何提现-----行为限制-----银行资料-----资料更新-----更新密码-----关于兑换记录-----联赛赞助-----联系我们-----VIP 制度-----同乐币介绍-----诚信保证-----合作伙伴-----同乐口号-----关于我们".split("-----")
let str2 = "9022-----8973-----8972-----8971-----8970-----8969-----8968-----8967-----8966-----8965-----8964-----8963-----8962-----8961-----8960-----8959-----8958-----8957-----8956-----8955-----8954-----8953-----8952-----8951-----8941-----8950-----8949-----8948-----8947-----8946-----8945-----8944-----8943-----8942-----9015-----8983-----8940-----8939-----8938-----8937-----8936-----8935-----8934".split("-----")
let str3 = "5887-----5767-----5766-----5765-----5764-----5763-----5762-----5759-----5758-----5757-----5756-----5755-----5754-----5742-----5741-----5740-----2207-----1091-----1090-----1089-----1088-----1086-----1084-----1083-----136-----137-----135-----134-----133-----132-----131-----130-----129-----128-----5812-----5781-----5659-----5658-----5657-----5656-----5655-----5625-----5609".split("-----")
str1.forEach((item, index) => {
    console.log(str1[index] + ": Live=" + str2[index] + "     Stage=" + str3[index] + "     index:" + index + "\n" )
})

// 生成ID集合
let xmsml = "[";
let xmsssml = "[";
str1.forEach((item, index) => {
    xmsml += "\"" + str3[index] + "\",";
    xmsssml += "\"" + str2[index] + "\",";
});
xmsml += "]";
xmsssml += "]";
console.log(xmsml + "\n");
console.log(xmsssml);

规则与条款: Live=9022     Stage=5887     index:0  ==========done===========
彩票游戏玩法介紹: Live=8973     Stage=5767     index:1  ==========done===========
电子游戏玩法介紹: Live=8972     Stage=5766     index:2  ==========done===========
棋牌游戏玩法介紹: Live=8971     Stage=5765     index:3  ==========done===========
行为限制的介绍: Live=8970     Stage=5764     index:4  ==========不用改 他根本沒給內容===========
让分后，XXXXXX？: Live=8969     Stage=5763     index:5
什么叫做滚球？: Live=8968     Stage=5762     index:6
IM 体育: Live=8967     Stage=5759     index:7  ==========后端获取ID===========
MG 电子: Live=8966     Stage=5758     index:8  ==========后端获取ID===========
GD百家乐: Live=8965     Stage=5757     index:9  ==========后端获取ID===========
操作界面: Live=8964     Stage=5756     index:10  ==========后端获取ID===========
苹果安装: Live=8963     Stage=5755     index:11  ==========后端获取ID===========
优惠规则: Live=8962     Stage=5754     index:12  ==========后端获取ID===========
真人娱乐玩法介紹: Live=8961     Stage=5742     index:13  ==========done===========
什么是体育投注？: Live=8960     Stage=5741     index:14  ==========done===========
电子竞技玩法介紹: Live=8959     Stage=5740     index:15  ==========done===========
如何充值: Live=8958     Stage=2207     index:16  ==========后端获取ID===========
5. Colossus 钜彩（Colossus Bets）: Live=8957     Stage=1091     index:17
4. 虚拟运动规则: Live=8956     Stage=1090     index:18
3. 特定赛事投注规则: Live=8955     Stage=1089     index:19
2. 赌盘（投注类型）规则之一般规则: Live=8954     Stage=1088     index:20
隐私政策: Live=8953     Stage=1086     index:21  ==========后端获取ID===========
理性博彩: Live=8952     Stage=1084     index:22  ==========后端获取ID===========
1. 一般投注规则与规定: Live=8951     Stage=1083     index:23
体育投注: Live=8941     Stage=136     index:24  ==========后端获取ID===========
规则条款: Live=8950     Stage=137     index:25  ==========后端获取ID===========
电子投注: Live=8949     Stage=135     index:26  ==========后端获取ID===========
彩金讯息: Live=8948     Stage=134     index:27  ==========后端获取ID===========
如何转账: Live=8947     Stage=133     index:28  ==========后端获取ID===========
如何提现: Live=8946     Stage=132     index:29  ==========后端获取ID===========
行为限制: Live=8945     Stage=131     index:30  ==========后端获取ID===========
银行资料: Live=8944     Stage=130     index:31  ==========后端获取ID===========
资料更新: Live=8943     Stage=129     index:32  ==========后端获取ID===========
更新密码: Live=8942     Stage=128     index:33  ==========后端获取ID===========
关于兑换记录: Live=9015     Stage=5812     index:34
联赛赞助: Live=8983     Stage=5781     index:35
联系我们: Live=8940     Stage=5659     index:36  ==========done===========
VIP 制度: Live=8939     Stage=5658     index:37
同乐币介绍: Live=8938     Stage=5657     index:38
诚信保证: Live=8937     Stage=5656     index:39
合作伙伴: Live=8936     Stage=5655     index:40
同乐口号: Live=8935     Stage=5625     index:41
关于我们: Live=8934     Stage=5609     index:42  ==========done===========
加密货币：Live=11543    Stage=2207(测试线没有加密货币，维持到如何存款)     index:43
USDT介绍优惠：Live=11984     Stage=7704  index:44
 */

export default [
    // Stage
    [
        "5887",
        "5767",
        "5766",
        "5765",
        "5764",
        "5763",
        "5762",
        "5759",
        "5758",
        "5757",
        "5756",
        "5755",
        "5754",
        "5742",
        "5741",
        "5740",
        "2207",
        "1091",
        "1090",
        "1089",
        "1088",
        "1086",
        "1084",
        "1083",
        "136",
        "137",
        "135",
        "134",
        "133",
        "132",
        "131",
        "130",
        "129",
        "128",
        "5812",
        "5781",
        "5659",
        "5658",
        "5657",
        "5656",
        "5655",
        "5625",
        "5609",
        "2207",
        "7614",
        "7704",
    ],
    // Live
    [
        "9022",
        "8973",
        "8972",
        "8971",
        "8970",
        "8969",
        "8968",
        "8967",
        "8966",
        "8965",
        "8964",
        "8963",
        "8962",
        "8961",
        "8960",
        "8959",
        "8958",
        "8957",
        "8956",
        "8955",
        "8954",
        "8953",
        "8952",
        "8951",
        "8941",
        "8950",
        "8949",
        "8948",
        "8947",
        "8946",
        "8945",
        "8944",
        "8943",
        "8942",
        "9015",
        "8983",
        "8940",
        "8939",
        "8938",
        "8937",
        "8936",
        "8935",
        "8934",
        "11543",
        "11943",
        "11984",
    ],
];
