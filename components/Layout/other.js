/**
 * 404、维护、IP限制等页面
 */
import React from "react";
import Head from "next/head";
import { useReducer, useState, useEffect } from "react";
import PublicHead from "./PublicHead";

export default ({
    children,
    title = "FUN88",
    description = "",
    Keywords = "",
    notFound = false
}) => {
    const [contextValue, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            downloadLinks: "",
        }
    );
    
    return (
        <React.Fragment>
            <Head key="layout-otherpage-head">
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="description" content={description} />
                <meta name="Keywords" content={Keywords} />
                <link
                    rel="shortcut icon"
                    type="image/x-icon"
                    href="/vn/img/logo/favicon.ico"
                />
            </Head>
            <div id="maintain" className="common-distance-wrap">
                <div className="maintain-header-wrap">
                    <PublicHead notFound={notFound}/>
                </div>
                <div className="common-distance">{children} </div>
            </div>
        </React.Fragment>
    );
};
