import React from "react";
import { Row, Col, Popover, Select, Modal } from "antd";
import Router from "next/router";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { translate } from "$ACTIONS/Translate";
import LanguageSwitcher from "./LanguageSwitcher";

const { Option } = Select;
export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <div>footer</div>
                <LanguageSwitcher />
            </React.Fragment>
        );
    }
}
