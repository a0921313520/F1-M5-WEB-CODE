import React from "react";
import { Select, Form, Input } from "antd";
import { GetWalletBonus } from "$DATA/wallet";
import { connect } from "react-redux";
import { translate } from "$ACTIONS/Translate";
const { Item } = Form;
const { Option } = Select;

class BonusList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bonusList: [], // 可申请优惠列表
            bonusLoading: false, // 是否加载优惠中
            BonusCodeOpen: false, // 是否需要输入优惠券代码
        };

        this.getDepositWalletBonus = this.getDepositWalletBonus.bind(this); // 获取当前目标账户的优惠列表
        this.setBonusName = this.setBonusName.bind(this); // 设置当前选中的优惠名称和优惠值
        this.setWalletBonus = this.setWalletBonus.bind(this); // 获取当前账户优惠列表成功回调
    }
    componentDidMount() {
        //虚拟币交易所(OTC)使用
        if (this.props.targetValue) {
            this.getDepositWalletBonus(this.props.targetValue);
        }

        // if (this.props.selectedBonus) {
        //     this.getDepositWalletBonus(this.props.targetValue);
        // }
        // if (this.props.depositMethod == "OTC") {
        //     this.getDepositWalletBonus(this.props.targetValue);
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(
            "获取当前目标账户的优惠列表:",
            prevProps.targetValue,
            this.props.targetValue
        );
        if (prevProps.targetValue !== this.props.targetValue) {
            this.getDepositWalletBonus(this.props.targetValue);
        }
    }
    componentWillUnmount() {
        this.setWalletBonus = null; // 卸载优惠列表回调
    }
    setBonusName(v) {
        const currVal = this.state.bonusList.find((val) => val.id === v);
        this.props.setBonusValue(
            v,
            currVal && currVal.title,
            this.state.bonusList
        );
    }
    /**
     * 获取当前账户优惠列表成功回调
     * @param {string} type 需要获取的目标账户类型
     * @param {object} res 获取到的返回数据
     */
    setWalletBonus(type, res) {
        if (res) {
            const inputBonus = res.result.filter((item) => item.id == type); // 是否需要输入优惠券代码筛选
            let bonusInfo;
            this.setState({
                // bonusLoading: false,
                bonusList: res.result,
                BonusCodeOpen:
                    inputBonus.length && inputBonus[0].bonusCouponID !== "0", // 设置是否需要输入优惠券代码
            });

            if (sessionStorage.getItem("promoDeposit")) {
                bonusInfo = JSON.parse(sessionStorage.getItem("promoDeposit"));
            }

            // 父级传递默认优惠ID修改默认优惠ID
            let bonusId = this.props.bonusId;
            if (!(this.props.targetValue === this.props.targetAccount)) {
                if (sessionStorage.getItem("promoDeposit")) {
                    bonusId = Number(bonusInfo.bonusId);
                } else if (this.props.transactionType === "Deposit") {
                    bonusId = this.props.bonusVal;
                } else {
                    bonusId = null;
                }
            }
            this.setBonusName(bonusId);
            this.props.CallBonusdata && this.props.CallBonusdata(res.result);
        }

        this.setState({
            bonusLoading: false,
        });
        this.props.setLoading(false); // 关闭父级Modal Loading状态
    }
    // 获取当前目标账户的优惠列表
    getDepositWalletBonus(type) {
        this.setState({ bonusLoading: true });
        this.props.setLoading(true);
        GetWalletBonus(
            type,
            (res) => {
                // 因为获取优惠列表未加Loading，此处为了便面内存泄漏，卸载组件会清空此方法
                typeof this.setWalletBonus === "function" &&
                    this.setWalletBonus(type, res);

                this.setState({ bonusLoading: false });
            },
            this.props.transactionType
        );
    }
    render() {
        const { getFieldDecorator, getFieldValue, targetValue, bonusVal } =
            this.props;
        const { bonusList, BonusCodeOpen, bonusLoading } = this.state;
        console.log("bonusLoading", bonusLoading);
        return (
            <React.Fragment>
                {bonusList.length ? (
                    <Item label={translate("优惠")} key={JSON.stringify(bonusLoading)}>
                        {bonusLoading ? (
                            <Select
                                size="large"
                                value={translate("加载中")}
                                disabled={true}
                                loading={true}
                                dropdownStyle={{ zIndex: 1 }}
                                suffixIcon={
                                    <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown.svg`} />
                                }
                            />
                        ) : (
                            <div className="drop-area-promot">
                                {getFieldDecorator("bonusPromotionValue", {
                                    initialValue: this.props.selectedBonus
                                        ? this.props.selectedBonus.id
                                        : bonusVal,
                                    rules: [
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (value === null) {
                                                    callback(translate("选择优惠"));
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Select
                                        dropdownClassName="transferWellet"
                                        size="large"
                                        className={
                                            bonusVal === null
                                                ? "placeholder-block"
                                                : ""
                                        }
                                        placeholder=""
                                        onChange={this.setBonusName}
                                        disabled={
                                            !!this.props.selectedBonus?.id &&
                                            this.props.selectedBonus.account ===
                                                this.props.targetValue
                                        }
                                        onDropdownVisibleChange={
                                            this.props.openFunc
                                        }
                                        suffixIcon={
                                            this.props.selectPromote ? (
                                                <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown-up.svg`} />
                                            ) : (
                                                <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown.svg`} />
                                            )
                                        }
                                        getPopupContainer={(triggerNode) =>
                                            triggerNode.parentNode
                                        }
                                    >
                                        {bonusList.map((value, index) => {
                                            return (
                                                <Option
                                                    value={value.id}
                                                    key={value.id + index}
                                                >
                                                    <div className="option-item">
                                                        {value.title}
                                                    </div>
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                )}
                            </div>
                        )}
                    </Item>
                ) : (
                    <Item label={translate("优惠")}>
                        <Select
                            size="large"
                            disabled
                            suffixIcon={
                                <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown.svg`} />
                            }
                            placeholder={translate("暂时没有优惠")}
                        />
                    </Item>
                )}
                {/* {targetValue &&
                bonusVal === 0 &&
                parseInt(getFieldValue("money")) > 99 ? (
                    <div className="modal-prompt-info">
                        {targetValue == "MAIN"
                            ? "提示: 您已达到参加优惠活动的要求,请切换目标账户。"
                            : "提示: 你已达到参加优惠活动的要求,请选择相应优惠。"}
                    </div>
                ) : null}
                {BonusCodeOpen ? (
                    <Item label="优惠券代码">
                        {this.props.getFieldDecorator("bonusCode", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入优惠券代码！",
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                placeholder="请输入优惠券代码！"
                                autoComplete="off"
                                maxLength={20}
                            />
                        )}
                    </Item>
                ) : null} */}
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        selectedBonus: state.promotion.selectedBonus,
    };
}

export default connect(mapStateToProps)(BonusList);
