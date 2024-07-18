import { translate } from "$ACTIONS/Translate";
function Error({ statusCode }) {
    return (
        <p style={{ textAlign: "center", marginTop: 20 }}>
            {statusCode
                ? `${translate("服务端编译错误")} ${statusCode} ${translate("请联系在线客服")}`
                : translate("系统错误，请返回")}{" "}
            <br />
            <a href="/vn/">{translate("首页")}</a>
        </p>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
