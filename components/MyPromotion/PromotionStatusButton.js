import { useSelector } from "react-redux";
import { translate } from "$ACTIONS/Translate";

function PromotionStatusButton({
    selectedPromotionItem,
    selectedPromotionDetail,
    applyManualPromotion,
    applyBonusPromotion,
}) {
    const { selectedBonus } = useSelector((state) => state.promotion);
    // 依照Status狀態變換Button內容
    let promotionStatusButton = "";
    console.log("Start change button content by status", selectedBonus);

    // 確認是否後端api回傳Bonus資料 or 該Promotion為Manual Type
    const validStatuses = [
        "Serving",
        "Release",
        "Force to served",
        "Waiting for release",
    ];
   
    if (
        (selectedBonus || selectedPromotionDetail.promoType === "Manual") &&
        (!selectedPromotionItem ||
            !selectedPromotionItem.history ||
            !validStatuses.includes(selectedPromotionItem.history.status))
    ) {
        if (selectedPromotionDetail.actionType === "NO_ACTION") {
            promotionStatusButton = "";
        } else {
            switch (selectedPromotionDetail.promoType) {
                case "Manual":
                    if (
                        !selectedPromotionDetail.isInApplicationDuration &&
                        !selectedPromotionDetail.isExpired &&
                        !selectedPromotionDetail.isNotStart
                    ) {
                        promotionStatusButton = (
                            <button disabled={true}>{translate("仅限指定时间内适用")}</button>
                        );
                        break;
                    } else {
                        switch (selectedPromotionDetail.actionType) {
                            case "APPLY_FORM":
                                promotionStatusButton = (
                                    <button onClick={applyManualPromotion}>
                                        {translate("立即领取")}
                                    </button>
                                );
                                break;
                            case "LIVECHAT":
                                promotionStatusButton = (
                                    <button
                                        onClick={() => {
                                            global.PopUpLiveChat();
                                        }}
                                    >
                                        {translate("在线客服")}
                                    </button>
                                );
                                break;
                            default:
                                promotionStatusButton = "";
                        }
                    }

                    break;
                case "Bonus":
                    promotionStatusButton = (
                        <button onClick={applyBonusPromotion}>{translate("获得奖励")}</button>
                    );
                    break;
                default:
            }
        }
        // 後端未回傳對應Bonus資料但有History資料
    } else if (selectedPromotionItem?.history) {
        switch (
            selectedPromotionItem.promotionType ||
            selectedPromotionDetail.promoType
        ) {
            //Manual Promotion不會有history資料

            case "Bonus":
                switch (selectedPromotionItem.history.status) {
                    case "Serving":
                        promotionStatusButton = (
                            <div className="rate-viewer-box">
                                <div className="rate-base">
                                    <div
                                        style={{
                                            width: `${
                                                (selectedPromotionItem.history
                                                    .percentage /
                                                    100) *
                                                600
                                            }px`,
                                        }}
                                        className="percentage"
                                    >
                                        <div className="indicator"></div>
                                    </div>
                                </div>
                                <div className="scale-box">
                                    {["0%", "50%", "100%"].map((position) => {
                                        return (
                                            <div className="scale-text-box">
                                                <div className="scale-line">
                                                    <p>{position}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p>{translate("还需流水") + selectedPromotionItem.history.turnoverNeeded+","+translate("可以获得红利")+selectedPromotionItem.history.bonusAmount} đ</p>
                            </div>
                        );
                        break;
                    case "Release":
                        if (selectedPromotionItem.history.isClaimable) {
                            promotionStatusButton = (
                                <button className="btn-get-bonus">
                                    {translate("获得奖励")}
                                </button>
                            );
                        } else {
                            promotionStatusButton = (
                                // <p>Error: 狀態為Release但isClaimable為false</p>
                                <p></p>
                            );
                        }
                        break;
                    case "Serving" || "Force to served":
                        promotionStatusButton = (
                            <button disabled>{translate("已领取")}</button>
                        );
                        break;
                    case "Waiting for release":
                        promotionStatusButton = (
                            <button disabled>{translate("待派发")}</button>
                        );
                        break;

                    default:
                        if (
                            selectedPromotionItem.actionType === "NO_ACTION" ||
                            selectedPromotionDetail.actionType === "NO_ACTION"
                        ) {
                            promotionStatusButton = "";
                        }
                }
                break;

            default:
                break;
        }
    }

    return promotionStatusButton;
}

export default PromotionStatusButton;
