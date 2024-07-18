import moment from "moment";
import { Popover, Icon } from "antd";
import { RiSettings5Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { translate } from "$ACTIONS/Translate";

function AppliedHistoryCard(props) {
    const categories = useSelector((state) => state.promotion.categories);
    const promotions = useSelector((state) => state.promotion.promotions);

    const {
        item,
        isValid,
        index,
        selectedPopoverIndex,
        onCancelPromotion,
        onCancelPopover,
        onOpenPopover,
        onOpenAppliedDataModal,
        onBonusClaim,
        openPromotionDetail,
    } = props;

    return (
        <div
            data-key={index}
            className={`promotion-card ${
                !isValid ? "promotion-card-disabled" : ""
            }`}
        >
            <div
                className="promotion-card-container"
                onClick={openPromotionDetail}
            >
                <div className="promotion-info-box">
                    <div className="promotion-card-list-img">
                        {/* categories={Categories} */}
                        <img
                            src={
                                item.status == "Served" &&
                                item.promotionCategory == null
                                    ? `${process.env.BASE_PATH}/img/promotions/icon/icon-GeneralServed.png`
                                    : categories.find(
                                          (category) =>
                                              category.PromoCatCode ===
                                              item.promotionCategory,
                                      )?.promoCatImageUrl ||
                                      `${process.env.BASE_PATH}/img/promotions/icon/icon-General.png`
                            }
                        />
                    </div>

                    <div className="promotion-card-list-title">
                        <div className="promotion-card-list-title-name">
                            <span>{item.promotionTitle || item.bonusName}</span>
                        </div>

                        <div className="promotion-card-list-title-time">
                            {item.status != "Pending" && (
                                <span>
                                    {translate("交易时间")}:&nbsp;
                                    {item.promotionType === "Manual" &&
                                        `${
                                            item.promotionEndDate
                                                ? moment(item.promotionEndDate)
                                                      .utcOffset(8)
                                                      .format(
                                                          "DD-MM-YYYY HH:mm:ss",
                                                      )
                                                : "--"
                                        }`}
                                    {(item.promotionType === "Bonus" ||
                                        !item.promotionType) &&
                                        `${
                                            item.expiredDate
                                                ? moment(item.expiredDate)
                                                      .utcOffset(8)
                                                      .format(
                                                          "DD-MM-YYYY HH:mm:ss",
                                                      )
                                                : "--"
                                        }`}
                                </span>
                            )}
                        </div>
                        {item.status !== "Release" &&
                            item.status !== "Served" &&
                            item.status !== "Force to served" && (
                                <div className="promotion-card-list-title-time-icon">
                                    <Popover
                                        placement="bottomRight"
                                        trigger="click"
                                        visible={selectedPopoverIndex === index}
                                        overlayClassName="appliedHistory-popover"
                                        align={{ offset: [13, 15] }}
                                        content={
                                            <div className="popover-text-container">
                                                {item.status !== "Pending" && (
                                                    <div className="promotion-CancellPopup-text">
                                                        <p>
                                                            {translate(
                                                                "免费投注奖金无法取消。 请联系实时聊天寻求支持",
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                                {item.status === "Pending" && (
                                                    <div className="promotion-CancellPopupAsk-text">
                                                        <p>
                                                            {translate(
                                                                "想要取消您的优惠吗？",
                                                            )}
                                                        </p>
                                                        <div className="promotion-CancellPopupAsk-btn">
                                                            <button
                                                                onClick={
                                                                    onCancelPromotion
                                                                }
                                                            >
                                                                {translate(
                                                                    "取消",
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div
                                                    className="promotion-CancellPopup-close"
                                                    onClick={onCancelPopover}
                                                >
                                                    <Icon type="close" />
                                                </div>
                                            </div>
                                        }
                                    >
                                        <RiSettings5Fill
                                            size={18}
                                            cursor={
                                                isValid ? "pointer" : "default"
                                            }
                                            color={
                                                isValid ? "#646464" : "#BCBEC3"
                                            }
                                            onClick={() => {
                                                if (
                                                    item.status == "Expired" ||
                                                    !isValid
                                                ) {
                                                    return;
                                                }
                                                onOpenPopover();
                                            }}
                                        />
                                    </Popover>
                                </div>
                            )}
                    </div>
                </div>

                <div className="button-box">
                    {/*----------------------------------------
                      流水進度條
    ------------------------------------------*/}
                    {(item.status === "Serving" ||
                        item.status === "Canceled" ||
                        item.status === "Expired") &&
                        item.progress !== "-" && (
                            <div className="progress-box">
                                <div
                                    className="ProgressBar"
                                    style={{ marginTop: "20px" }}
                                >
                                    <div
                                        className="Progress"
                                        style={{
                                            width: `${item.percentage}%`,
                                        }}
                                    />
                                </div>

                                <div className="progress-text">
                                    <span>
                                        {translate("还需")}{" "}
                                        {item.turnoverNeeded}
                                    </span>
                                    {(item.status === "Serving" ||
                                        item.status === "Release" ||
                                        item.status === "Canceled" ||
                                        item.status === "Expired") && (
                                        <span style={{ color: "#46A5F8" }}>
                                            {item.bonusAmount}
                                            {" đ "}
                                            {translate("红利")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                    {/*----------------------------------------
              已达到领取红利的条件 等待领取
    ------------------------------------------*/}
                    {item.status === "Release" && (
                        <div>
                            <div className="promotion-card-info-bonustext">
                                <span>
                                    {item.bonusAmount || 0}
                                    {" đ "}
                                    {translate("红利")}
                                </span>
                            </div>

                            <div className="promotion-card-release-btn">
                                <button
                                    onClick={() => {
                                        onBonusClaim(item.playerBonusId);
                                    }}
                                >
                                    {translate("立即获得奖励")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/*----------------------------------------
                    已领取
    ------------------------------------------*/}
                    {(item.status === "Served" ||
                        item.status === "Force to served") && (
                        <div>
                            <div className="promotion-card-info-bonustext">
                                <span>
                                    {item.bonusAmount || 0}
                                    {" đ "}
                                    {translate("红利")}
                                </span>
                            </div>

                            <div className="promotion-card-info-btn-disabled">
                                <button disabled>已領取</button>
                            </div>
                        </div>
                    )}

                    {/*----------------------------------------
                      待派发
    ------------------------------------------*/}
                    {promotions && item.status === "Waiting for release" && (
                        <div>
                            <div className="promotion-card-info-bonustext">
                                <span>
                                    {item.bonusAmount || 0}
                                    {" đ "}
                                    {translate("红利")}
                                </span>
                            </div>

                            <div className="promotion-card-info-btn-disabled">
                                <button disabled>{translate("待派发")}</button>
                            </div>
                        </div>
                    )}

                    {/*----------------------------------------
                    待处理红利（可取消）
    ------------------------------------------*/}

                    {(item.status === "Pending" ||
                        item.status === "Processing") && (
                        <div>
                            <div className="promotion-card-info-bonustext">
                                <span>{item.localizedStatus}</span>
                            </div>

                            {item.promotionType === "Manual" && (
                                <div className="promotion-card-info-btn-pending">
                                    <button onClick={onOpenAppliedDataModal}>
                                        {translate("查看申请")}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {/*----------------------------------------
                   已批准
    ------------------------------------------*/}
                    {item.status === "Approved" &&
                        item.promotionType === "Manual" && (
                            <div>
                                {/*  下行樣式用 勿刪  */}
                                <div className="promotion-card-info-bonustext"></div>

                                <div className="promotion-card-info-btn-disabled">
                                    <button disabled>已批准</button>
                                </div>
                            </div>
                        )}
                    {/*----------------------------------------
                   不符合資格
    ------------------------------------------*/}
                    {item.status === "Not Eligible" &&
                        item.promotionType === "Manual" && (
                            <div>
                                {/*  下行樣式用 勿刪  */}
                                <div className="promotion-card-info-bonustext"></div>

                                <div className="promotion-card-info-btn-disabled">
                                    <button disabled>
                                        {translate("不符合资格")}
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AppliedHistoryCard;
