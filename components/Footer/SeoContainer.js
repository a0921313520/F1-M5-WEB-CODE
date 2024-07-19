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
            seo footer
        </div>
    );
}
