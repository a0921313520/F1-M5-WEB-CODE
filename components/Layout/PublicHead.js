import React from "react";
import { translate } from "$ACTIONS/Translate";
import Router from "next/router";

// 404 ip地区限制 维护中 访问限制等账户限制等页面公用head
export default function PublicHead({notFound}) {
    const navigatorPage = ()=>{
        if(notFound){
            Router.push("/")
        }
    } 
    return (
        <React.Fragment>
            <div className="common-distance">
                <div className="logo-wrap inline-block" onClick={navigatorPage} style={{cursor: notFound ? "pointer":"default"}}>
                    <img
                        src={`${process.env.BASE_PATH}/img/logo/logo.svg`}
                        alt="FUN88"
                        style={{ width: "140px", height: "70px" }}
                    />
                </div>
                <div className="sponsor-wrap inline-block">
                    <div className="tlc-title-partner inline-block">
                        <img
                            src={`${process.env.BASE_PATH}/img/logo/logo-Sevilla1.png`}
                            alt="FUN88"
                            style={{
                                width: "40px",
                                marginTop: "-19px",
                                marginRight: "10px",
                            }}
                            width="40px"
                        />
                        <div
                            className="tlc-partner-section inline-block"
                            style={{ paddingRight: "20px" }}
                        >
                            {translate("官方球衣赞助商")} <br />
                            {translate("纽卡斯尔俱乐部")}
                        </div>
                    </div>
                    <div className="tlc-title-partner inline-block">
                        <img
                            src={`${process.env.BASE_PATH}/img//logo/logo-Sevilla2x.png`}
                            alt="FUN88"
                            width="40px"
                            style={{
                                width: "40px",
                                marginTop: "-19px",
                                marginRight: "10px",
                            }}
                        />
                        <div className="tlc-partner-section inline-block">
                            {translate("亚洲官方博彩合作伙伴")} <br />
                            {translate("托特纳姆热刺俱乐部")}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}