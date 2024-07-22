/*
 * @Author: Alan
 * @Date: 2023-07-07 17:35:00
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-07 18:02:19
 * @Description: 应用程序的根组件
 * @FilePath: \F1-M1-WEB-Code\pages\_app.js
 */
// _app.js 文件是 Next.js 框架中的一个特殊文件，用于自定义应用程序的根组件。
// 在 Next.js 中，_app.js 是包装所有页面组件的父组件，充当应用程序的布局文件。
// 在 _app.js 中定义的内容将应用于整个应用程序的每个页面。
// 你可以在 _app.js 中设置全局 CSS 样式、引入全局状态管理器（例如 Redux），
// 使用特定于应用程序的布局，或者实施其他全局逻辑。
// 此外，你还可以在 _app.js 中拦截路由并实施页面级别的身份验证或其他自定义逻辑。
// 总之，_app.js 文件允许你在 Next.js 应用程序的每个页面之间共享代码和逻辑，
// 并提供了一种集中管理应用程序布局和全局装饰的方式。
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ConfigProvider, Spin } from "antd";
import locale from "antd/lib/locale/vi_VN";
import "$DATA/tlcLess/merge.less";
import "$DATA/tlcLess/error.less";
import store from "../store/store";
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }) {
    const { status, text } = useSelector((state) => state.spin);

    console.log("Redux Store State:", store.getState());

    useEffect(() => {
        window.piwikLoadFinished = true;
    }, []);

    return (
        <ConfigProvider locale={locale}>
            <Spin spinning={status} tip={text}>
                <Component {...pageProps} />
            </Spin>
        </ConfigProvider>
    );
}

function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <MyApp Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

export default appWithTranslation(App);
