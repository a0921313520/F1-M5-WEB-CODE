// This file doesn't go through babel or webpack transformation.
// 这个文件不通过babel或webpack转型
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// 确保此文件所需的语法和源与正在运行的node版本兼容
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const port = 8003;
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

/*
 * 可以通过server.js自定义服务端路由，但是只支持node端，如需使用其它服务器需要使用其它方法。
 * module.export { useFileSystemPublicRoutes: false } 禁止路由链接到/pages下的文件。
 * 可以通过next({ dev }).setAssetPrefix('')设置域名前缀。
 */
app.prepare().then(() => {
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // 请确保将“true”作为第二个参数传递给“url.parse”
        // This tells it to parse the query portion of the URL.
        // 这会告诉它解析URL的查询部分
        const parsedUrl = parse(req.url, true);
        // const { pathname, query } = parsedUrl

        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:" + port);
    });
});
