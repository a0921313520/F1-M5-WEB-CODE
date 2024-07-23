function Error({ statusCode }) {
    return (
        <p style={{ textAlign: "center", marginTop: 20 }}>
            {statusCode
                ? `${"服务端编译错误"} ${statusCode} ${"请联系在线客服"}`
                : "系统错误，请返回"}{" "}
            <br />
            <a href="/vn/">{"首页"}</a>
        </p>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
