import React from "react";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { Spin, message, Modal, Icon, Empty } from "antd";
import Router from "next/router";
import classNames from "classnames";
export default class filterMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameUrl: "",
        };
    }

    componentDidMount() {}

    render() {
        const { typeName, categoryData, typeKey, subcategory, gameSubCatCode } =
            this.props;

        let isHave = categoryData.filter(
            (item) => item.categoryType == typeKey
        );
        return (
            <React.Fragment>
                {isHave && isHave.length > 1 && (
                    <div>
                        <h4>{typeName}</h4>
                        <ul className="game-type">
                            {categoryData != "0" &&
                                categoryData.map((item, index) => {
                                    if (item.categoryType == typeKey) {
                                        return (
                                            <li
                                                onClick={() => {
                                                    subcategory(
                                                        item.category,
                                                        typeKey
                                                    );
                                                }}
                                                key={index}
                                                className={classNames({
                                                    curr:
                                                        gameSubCatCode ===
                                                        item.category,
                                                    isNew: item.isNew,
                                                    isHot: item.isHot,
                                                })}
                                            >
                                                <span className="name">
                                                    {item.name}
                                                </span>
                                            </li>
                                        );
                                    }
                                })}
                            {categoryData == "" && <Empty />}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
