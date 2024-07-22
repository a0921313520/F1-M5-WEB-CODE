import { useState } from "react";
import { Icon } from "antd";
import { translate } from "$ACTIONS/Translate";

export default function seoContainer({ seocontent }) {
    // console.log("🚀 ~ file: SeoContainer.js:6 ~ seoContainer ~ seocontent:", seocontent,typeof seocontent)
    const [seoDetailStatus, setSeoDetailStatus] = useState(false);
    return (
        <div
            className="common-distance-wrap footer-seo-wrap"
            style={{ height: seoDetailStatus ? "auto" : "290px" }}
        >
            <div className="common-distance">
                {!!seocontent ? (
                    <div className="seo-container">
                        {seoDetailStatus ? (
                            <div
                                className="button-up"
                                onClick={() =>
                                    setSeoDetailStatus(!seoDetailStatus)
                                }
                            >
                                <Icon type="up" />
                            </div>
                        ) : (
                            <div className="button-more">
                                <span
                                    className="show-more-arrow"
                                    onClick={() =>
                                        setSeoDetailStatus(!seoDetailStatus)
                                    }
                                >
                                    {translate("查看更多")}
                                </span>
                            </div>
                        )}

                        {typeof seocontent === "object" ? (
                            <div>{seocontent}</div>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: seocontent }}
                            ></div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
