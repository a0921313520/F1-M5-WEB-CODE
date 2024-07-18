import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

class whatIsUsdtLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.addEventListener(
            "keydown",
            function (event) {
                event.stopPropagation();
                console.log(event);
            },
            true,
        );
    }

    handleChange = (key) => {
        console.log(key);
    };

    handleClick = () => {
        console.log("close modal");
        this.props.onhandleCancel();
    };

    render() {
        return (
            <React.Fragment>
                <div className="usdt-introduce-model-wrapper">
                    <Tabs
                        defaultActiveKey="1"
                        onChange={this.handleChange}
                        centered={true}
                    >
                        <TabPane
                            className="usdt-panel"
                            tab="什么是 USDT"
                            key="1"
                        >
                            <h3 className="panel-Title">泰达币简介</h3>
                            <ul className="panel-List">
                                <li>
                                    <p>
                                        泰达币（USDT）是Tether公司推出的基于稳定价值货币美元（USD）的代币Tether
                                        USD。
                                        每发行1个USDT，Tether公司的银行账户都会有1美元的资金保障，用户可以在Tether平台进行资金查询。
                                    </p>
                                </li>
                            </ul>

                            <h3 className="panel-Title">泰达币特点</h3>
                            <ul className="panel-List">
                                <li>
                                    <h6 className="panel-List-Title">
                                        稳定的货币
                                    </h6>
                                    <p>
                                        Tether将现金转换成数字货币，锚定或将美元、欧元和日元等国家货币的价格钩。
                                    </p>
                                </li>
                                <li>
                                    <h6 className="panel-List-Title">透明的</h6>
                                    <p>
                                        我们的外汇储备每天都在公布，并受到频繁的专业审计。流通中的所有东西总是与我们的储备相匹配。
                                    </p>
                                </li>
                                <li>
                                    <h6 className="panel-List-Title">
                                        区块链技术
                                    </h6>
                                    <p>
                                        Tether平台建立在区块链技术的基础之上，利用它们提供的安全性和透明性。
                                    </p>
                                </li>
                                <li>
                                    <h6 className="panel-List-Title">安全</h6>
                                    <p>
                                        Tether的区块链技术在满足国际合规标准和法规的同时，提供了世界级的安全保障。
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        USDT最大的特点是，它与同数量的美元是等值的，1USDT=1美元。使之成为波动剧烈的加密货币市场中良好的保值代币。
                                    </p>
                                </li>
                            </ul>
                        </TabPane>

                        <TabPane
                            className="usdt-panel wallet-agreement-box"
                            tab="钱包协议"
                            key="2"
                        >
                            <h3 className="panel-Title">钱包协议的类型</h3>
                            <ul className="panel-List">
                                <li>
                                    <h6 className="panel-List-Title">
                                        第1种 ：ERC20
                                    </h6>
                                    <p>
                                        存储在以太坊的 USDT （基于 ERC - 20
                                        协议发行）
                                        <br />
                                        这种USDT存储在以太坊地址上，相对应的，每次转账（链接上转账）是
                                        需要消耗GAS ，也就是ETH。
                                    </p>
                                </li>
                                <li>
                                    <h6 className="panel-List-Title">
                                        第2种 ：TRC20
                                    </h6>
                                    <p>
                                        存储在波场网络的 USDT（基于 TRC - 20
                                        协议发行）
                                        <br />
                                        该USDT 存储在TRON 的地址中，存款
                                        提款都是通过 TRON网络进行的。
                                    </p>
                                </li>
                                <li>
                                    <h6 className="panel-List-Title">
                                        第3种：OMNI
                                    </h6>
                                    <p>
                                        存储在比特币网络的 USDT （基于 OMNI
                                        协议发行）这种 USDT
                                        存储在比特币地址上，所以每次转账（链上转账）时，都需要支付少量比特币作为矿工费。
                                    </p>
                                </li>
                            </ul>
                            <h3 className="panel-Title">三种 USDT 科普</h3>
                            <div className="panel-Table">
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        三种USDT
                                    </div>
                                    <div className="panel-Table-td">OMNI</div>
                                    <div className="panel-Table-td">
                                        ERC20协议
                                    </div>
                                    <div className="panel-Table-td">
                                        TRC20协议
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        地址样式（谨防充错）
                                    </div>
                                    <div className="panel-Table-td">
                                        数字1或3开头, <br />
                                        例如183hmJGRu
                                    </div>
                                    <div className="panel-Table-td">
                                        数字0或小写x开头，
                                        <br />
                                        例如 0xbd7e4b
                                    </div>
                                    <div className="panel-Table-td">
                                        大写字母T开头，
                                        <br />
                                        例如： T9zp14nm
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        使用情况
                                    </div>
                                    <div className="panel-Table-td">
                                        比特币网络
                                    </div>
                                    <div className="panel-Table-td">
                                        以太坊网络
                                    </div>
                                    <div className="panel-Table-td">
                                        波场网络
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        网络拥堵情况
                                    </div>
                                    <div className="panel-Table-td">
                                        偶尔拥堵
                                    </div>
                                    <div className="panel-Table-td">
                                        经常拥堵
                                    </div>
                                    <div className="panel-Table-td">
                                        基本不拥堵
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        日常转账速度
                                    </div>
                                    <div className="panel-Table-td">
                                        慢 （0.6-2小时 不等）
                                    </div>
                                    <div className="panel-Table-td">
                                        中等 （几分钟到十几分钟不等）
                                    </div>
                                    <div className="panel-Table-td">
                                        快 （几秒钟到几 分钟不等）
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">手续费</div>
                                    <div className="panel-Table-td">
                                        最高 转账手续费和BTC一致，
                                        平台提现一般收2-20USDT不等
                                    </div>
                                    <div className="panel-Table-td">
                                        一般 钱包转账手续费与ETH一致，
                                        平台提现一般收1-5USDT 不等
                                    </div>
                                    <div className="panel-Table-td">
                                        无 钱包转账0手续费，
                                        平台提现时有可能收取少量手续费
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">安全性</div>
                                    <div className="panel-Table-td">最高</div>
                                    <div className="panel-Table-td">高</div>
                                    <div className="panel-Table-td">
                                        低于前两者
                                    </div>
                                </div>
                                <div className="panel-Table-tr4">
                                    <div className="panel-Table-td">
                                        使用建议
                                    </div>
                                    <div className="panel-Table-td">
                                        大额低频走比特币网络
                                    </div>
                                    <div className="panel-Table-td">
                                        中等额度走 ETC网络
                                    </div>
                                    <div className="panel-Table-td">
                                        小额高频走 波场网络
                                    </div>
                                </div>
                            </div>
                            <p className="table-remarks">
                                * 三种USDT
                                地址不互通，转账请务必鉴别，存款等操作应注意严格存入对应地址。
                            </p>
                            <h3 className="panel-Title">
                                哪种协议更加符合您的需求？
                            </h3>
                            <ul>
                                <li>
                                    <p>
                                        1.大笔转账推荐 OMNI
                                        的USDT，手续费贵，慢一点，但最安全。
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        2.中等额度就选择 ERC20 的
                                        USDT，手续费一般。速度一般，安全性较高。
                                    </p>
                                </li>
                                <p>
                                    3.小额转账可以用波场USDT，速度更快一点，波场网络转账本身不收手续费（交易平台可能收一些）。
                                </p>
                                <li></li>
                            </ul>
                        </TabPane>
                    </Tabs>
                </div>
            </React.Fragment>
        );
    }
}
export default whatIsUsdtLesson;
