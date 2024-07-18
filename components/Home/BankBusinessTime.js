import React, { useState, useEffect } from "react";
import { Collapse, Row, Col } from "antd";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import { translate } from "$ACTIONS/Translate";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
const { Panel } = Collapse;

export default function BankBusinessTime() {
    const [showMore, changeShowMore] = useState(false);
    const [activeKey, setActiveKey] = useState([]);
    const [bankMaintenanceInfo, setBankMaintenanceInfo] = useState([]);
    const defaultImage = "/vn/img/bank/generic.png";
    const weeksName = [
        translate("周日"),
        translate("周一"),
        translate("周二"),
        translate("周三"),
        translate("周四"),
        translate("周五"),
        translate("周六"),
    ];
    useEffect(() => {
        getBankMaintenanceInfo();
        return () => {
            setBankMaintenanceInfo([]);
        };
    }, []);

    const getBankMaintenanceInfo = () => {
        get(ApiPort.GetBankMaintenanceInfo).then((res) => {
            if (
                res?.isSuccess &&
                Array.isArray(res.result) &&
                res.result.length
            ) {
                setBankMaintenanceInfo(res.result);
            }
        });
    };
    return (
        <div
            className="bankBusinessTime"
            onMouseEnter={() => {
                bankMaintenanceInfo.length && changeShowMore(true);
            }}
            onMouseLeave={() => {
                changeShowMore(false), setActiveKey([]);
            }}
        >
            <div
                className={`default ${showMore ? "moveToLeft" : ""}`}
                // onClick={() => changeShowMore(!showMore)}
            ></div>
            <div className={`showMore ${showMore ? "moveToLeft" : ""}`}>
                <Collapse
                    activeKey={activeKey}
                    onChange={(k) => setActiveKey(k)}
                    expandIconPosition="right"
                    destroyInactivePanel={!showMore}
                >
                    {bankMaintenanceInfo.length &&
                        bankMaintenanceInfo.map((value, index) => (
                            <Panel
                                header={
                                    <Row>
                                        <Col span={2}>
                                            <ImageWithFallback
                                                src={`/vn/img/bank/${value.imageName.toUpperCase()}.png`}
                                                width={20}
                                                height={20}
                                                alt={value.tabBankName}
                                                fallbackSrc={defaultImage}
                                            />
                                        </Col>
                                        <Col span={16}>{value.tabBankName}</Col>
                                        <Col
                                            span={6}
                                            className={`${value.isUnderMaintenance ? "Offline" : "Online"}`}
                                        >
                                            {value.isUnderMaintenance
                                                ? "Offline"
                                                : "Online"}
                                        </Col>
                                    </Row>
                                }
                                key={index + 1}
                                // disabled={value.isUnderMaintenance}
                            >
                                <Row gutter={[40, 10]}>
                                    <Col>
                                        <h4>{translate("营业时间")}</h4>
                                    </Col>
                                    <Col>
                                        {value.item.map((v, i) =>
                                            v.recordType === "R" ? (
                                                <p
                                                    key={
                                                        "maintenanceSD#23LdiO" +
                                                        i
                                                    }
                                                >
                                                    <span>
                                                        {weeksName[v.dayOfWeek]}
                                                    </span>
                                                    <span> : </span>
                                                    <span>{v.startTime}</span>
                                                    <span> - </span>
                                                    <span>
                                                        {
                                                            weeksName[
                                                                v.dayOfWeekEnd
                                                            ]
                                                        }
                                                    </span>
                                                    <span> : </span>
                                                    <span>{v.endTime}</span>
                                                </p>
                                            ) : null,
                                        )}
                                    </Col>
                                    <Col>
                                        {translate("时间按照GMT+8更新。")}
                                    </Col>
                                </Row>
                            </Panel>
                        ))}
                </Collapse>
            </div>
        </div>
    );
}
