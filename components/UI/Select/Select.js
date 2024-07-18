import React, { useState } from "react";
import { Icon } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { translate } from "$ACTIONS/Translate";
//Child
//props: index ,optionName, confirmedOptionIndex, isTempSwitchOption,
export function Option(props) {
    const { index, optionName, confirmedOptionIndex, isTempSwitchOption } =
        props;

    return (
        <div
            className={`option-item ${
                props.clickedOption === index ? "clicked-item" : ""
            } 
   ${
       props.clickedOption === index && !isTempSwitchOption
           ? "confirmed-item"
           : ""
   }`}
            key={index}
            data-key={index}
            onClick={props.clickOptionHandler}
        >
            <p onClick={props.clickOptionHandler} data-key={index}>
                {optionName}
            </p>
            <div className="check-box">
                {(props.clickedOption === index ||
                    (confirmedOptionIndex === index &&
                        !isTempSwitchOption)) && <Icon type="check" />}
            </div>
        </div>
    );
}

// Props: placeholder, options, menuTitle, labelTitle, onConfirmSelect
function Select(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [clickedOption, setClickOption] = useState(null);
    const [isTempSwitchOption, setIsTempSwitchOption] = useState(false);

    const clickOptionHandler = function (e) {
        if (e.target.dataset.key === undefined) return;
        const index = Number(e.target.dataset.key);
        setClickOption(index);
        setIsTempSwitchOption(true);
    };

    const openMenuHandler = function () {
        setIsMenuOpen(true);
    };

    const closeMenuHandler = function () {
        setIsMenuOpen(false);
        setIsTempSwitchOption(false);
        setClickOption(null);
    };

    const confirmHandler = function () {
        if (clickedOption === null || clickedOption === undefined) return;
        props.onConfirmSelect(clickedOption);
        closeMenuHandler();
    };

    const childrenWithAdjustedProps = React.Children.map(
        props.children,
        (child) =>
            React.cloneElement(child, {
                clickedOption,
                clickOptionHandler,
                isTempSwitchOption,
            }),
    );

    return (
        <div className="ui-modal-select-box">
            <label className="select-title">{props.labelTitle}</label>
            <div className="selection-container">
                <div className="current-select-box" onClick={openMenuHandler}>
                    {!props.selectedTitle ? (
                        <p className="placeholder">{props.placeholder}</p>
                    ) : (
                        <p className="selected-item-title">
                            {props.selectedTitle}
                        </p>
                    )}

                    <div className="arrow">
                        <Icon type="caret-down" />
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="selection-menu">
                        <header>
                            <button onClick={closeMenuHandler}>
                                <CloseOutlined />
                            </button>
                            <p>{props.menuTitle}</p>
                            <button onClick={confirmHandler}>
                                {translate("选择")}
                            </button>
                        </header>
                        <main className="options-box">
                            {childrenWithAdjustedProps}
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Select;
