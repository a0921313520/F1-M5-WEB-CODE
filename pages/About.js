import React from "react";
import Layout from "@/Layout";
import { Menu, Icon, Input, Empty, Spin, Divider, Skeleton } from "antd";
const { SubMenu } = Menu;
const { Search } = Input;
import About from "@/About/AboutUS";
import Router from "next/router";
import { get } from "$ACTIONS/TlcRequest";
import { CMSAPIUrl } from "$ACTIONS/TLCAPI";
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Tabactive: "1",
            Contentdata: "",
            loading: true,
            Menudata: "",
            defaultOpenKey: "Sub0",
            htmlcode: "",
        };
    }
    componentDidMount() {
        this.setState({
            // Tabactive: Router.router.query.key || '0',
            defaultOpenKey: Router.router.query.type || "Sub0",
        });
        get(`${CMSAPIUrl}/vi-vn/api/v1/web/about`).then((res) => {
            if (res) {
                console.log(res);
                let intid = res[0].menus.filter((item, index) => {
                    return index == 0;
                })[0].id;
                this.setState({
                    Menudata: res,
                    loading: true,
                    Tabactive: Router.router.query.key || intid,
                });
                let defaultid =
                    Router.router.query && Router.router.query.key
                        ? Router.router.query.key
                        : intid;
                console.log(defaultid);
                this.Helpdata(defaultid);
            }
        });

        // get(`${CMSAPIUrl}/vi-vn/api/v1/web/about/detail/5609`).then((res) => {
        // 	if (res) {
        // 		this.setState({
        // 			htmlcode: res
        // 		});
        // 	}
        // });
    }

    componentWillReceiveProps() {
        this.setState({
            Tabactive: Router.router.query.key,
            defaultOpenKey: Router.router.query.type || "1",
        });
        // let defaultid = this.state.Menudata[Router.router.query.key].menus.filter((item, index) => {
        // 	return index == 0;
        // })[0].id;

        this.Helpdata(Router.router.query.key);
    }

    handleClick = (e) => {
        console.log(e);
        this.setState({
            Tabactive: e.key,
            defaultOpenKey: e.keyPath[1] || e.key,
        });
        console.log("click ", e.item.props.type);
        this.Helpdata(e.item.props.type);
    };

    /* 获取api的静态html */
    Helpdata(id) {
        this.setState({
            Contentdata: "",
            loading: true,
        });
        get(`${CMSAPIUrl}/vi-vn/api/v1/web/about/detail/${id}`).then((res) => {
            if (res) {
                console.log(res);
                this.setState({
                    Contentdata: res,
                    loading: false,
                });
            }
        });
    }
    render() {
        const { Contentdata, loading, Menudata, defaultOpenKey } = this.state;
        const loadings = {
            textAlign: "center",
            lineHeight: "345px",
        };
        let int = 0;
        return (
            <Layout title="FUN88" Keywords="" description="" status={1}>
                <div className="common-distance-wrap" id="about">
                    {Menudata == "" ? (
                        <div className="common-distance about-content">
                            <Skeleton
                                active
                                avatar
                                className="tlc-about-skeleton"
                                paragraph={{ rows: 14 }}
                            />
                        </div>
                    ) : (
                        <div className="common-distance about-content">
                            <div className="left">
                                <Menu
                                    key={this.state.Tabactive}
                                    onClick={(e) => this.handleClick(e)}
                                    style={{ width: 200 }}
                                    defaultSelectedKeys={[this.state.Tabactive]}
                                    defaultOpenKeys={[defaultOpenKey]}
                                    mode="inline"
                                    //openKeys={[ defaultOpenKey ]}
                                >
                                    {Menudata != "" &&
                                        Menudata.map((items, index) => {
                                            int++;
                                            return items.menus.length > 1 ? (
                                                <SubMenu
                                                    key={"Sub" + (int - 1)}
                                                    keys={"Sub" + (int - 1)}
                                                    title={
                                                        <span>
                                                            {items.title}
                                                        </span>
                                                    }
                                                >
                                                    {items.menus.map(
                                                        (val, indexs) => {
                                                            return (
                                                                <Menu.Item
                                                                    key={val.id}
                                                                    mkeys={
                                                                        val.id
                                                                    }
                                                                    type={
                                                                        val.id
                                                                    }
                                                                >
                                                                    {val.title}
                                                                </Menu.Item>
                                                            );
                                                        },
                                                    )}
                                                </SubMenu>
                                            ) : (
                                                <Menu.Item
                                                    key={items.menus[0].id}
                                                    mkeys={index}
                                                    type={items.menus[0].id}
                                                >
                                                    {items.menus[0].title}
                                                </Menu.Item>
                                            );
                                        })}
                                </Menu>
                            </div>
                            <div className="right">
                                <div
                                    className="box_body"
                                    style={loading ? loadings : null}
                                >
                                    <div className="box_body">
                                        <About
                                            Tabactive={this.state.Tabactive}
                                            Contentdata={Contentdata}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Layout>
        );
    }
}
