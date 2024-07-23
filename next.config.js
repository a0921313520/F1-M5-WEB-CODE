/*
 * @Author: Alan
 * @Date: 2023-01-12 09:46:43
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-20 10:23:18
 * @Description: Next.js 配置文件
 * @FilePath: \F1-M1-WEB-Code\next.config.js
 */

const withPlugins = require("next-compose-plugins"); //多插件配置
const optimizedImages = require("next-optimized-images");
//你分析打包后的文件并可视化展示出来，方便优化打包过程中的文件大小。
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true", // 是否启用分析
});
const path = require("path"); //处理文件路径
const withProgressBar = require("next-progressbar"); //构建进度
const { withSentryConfig } = require("@sentry/nextjs"); //sentry 网站监控
const withLess = require("next-with-less"); //处理LESS
const isDev = process.env.NODE_ENV !== "production"; //判断开发环境
const PATH_PREFIX = "";
const BASE_PATH = "";
const withTM = require("next-transpile-modules")(["central-payment"]);
const CopyPlugin = require("copy-webpack-plugin");

//NEXT.js 默认配置
const nextConfig = {
    images: {
        domains: [
            "cache.f866u.com",
            "cache.jiadingyeya.com",
            "f1-api-stage-web.fubnb.com",
            "media.stagingp3.fun88.biz",
        ],
        formats: ["image/avif", "image/webp"],
        loader: "akamai",
        path: "",
    },
    distDir: "build",
    trailingSlash: true,
    env: {
        LANGUAGE_PREFIX: (() => {
            if (isDev) return "";
            return PATH_PREFIX;
        })(),
        CURRENCY: "VND",
        BASE_PATH: BASE_PATH, //這個給程序用，用來處理圖片(img src)路徑
    },
    assetPrefix: isDev ? "" : PATH_PREFIX, //设置资产前缀并配置 CDN 的来源以解析为托管 Next.js 的域
    basePath: BASE_PATH, //next內建支持根目錄 處理js和css引用
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? {
                      exclude: ["error"], //只保留error紀錄
                  }
                : false,
    },
    poweredByHeader: false, // 是否显示 X-Powered-By 头部信息
    reactStrictMode: true, // 是否启用 React 严格模式
    purgeCSS: true, //内置了自动删除未使用CSS的功能
    webpack: (config, { isServer }) => {
        // 在这里修改 Webpack 配置
        const webpackConfig = {
            resolve: {
                alias: {
                    ...(config.resolve.alias || {}),
                    $DATA: path.resolve(__dirname, "./data"),
                    $SERVICES: path.resolve(__dirname, "./services"),
                    $UTILS: path.resolve(__dirname, "./utils"),
                    $STORE: path.resolve(__dirname, "./redux/store"),
                    $ZUSTAND_STORE: path.resolve(__dirname, "./zustand"),
                    "@": path.resolve(__dirname, "./components"),
                    $Deposits: path.resolve(
                        __dirname,
                        "./node_modules/central-payment/Deposit/M3",
                    ),
                    // $Deposits: path.resolve(__dirname, './Central-Payment/Deposit/M3'),
                },
            },
        };
        return {
            ...config,
            ...webpackConfig,
        };
    },
    exportPathMap: async function (defaultPathMap) {
        return {
            ...defaultPathMap,
            "/login/index.htm": { page: "/safehouse" },
        };
    },
};

//插件和插件配置
const plugins = [
    [withTM],
    [withLess],
    [withProgressBar],
    [withBundleAnalyzer],
    [
        optimizedImages,
        {
            optimizeImages: false, // 是否优化图片 禁用默认的
            handleImages: ["jpeg", "png", "svg", "webp", "gif"], // 处理哪些类型的图片
            mozjpeg: {
                quality: 80, // mozjpeg 压缩质量
            },
            pngquant: {
                speed: 3, // pngquant 压缩速度
                strip: true, // 是否去除元数据
                verbose: true, // 是否输出详细信息
            },
            svgo: {
                plugins: [
                    { removeViewBox: false }, // svgo 插件，是否移除 viewBox 属性
                    { removeDimensions: true }, // svgo 插件，是否移除宽高属性
                    { removeAttrs: { attrs: "(data-name)" } }, // svgo 插件，是否移除指定属性
                ],
            },
            webp: {
                preset: "default", // webp 压缩预设
                quality: 80, // webp 压缩质量
            },
        },
    ],
    [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(
                        __dirname,
                        "./node_modules/central-payment/StyleSheet/Web/M3/F1/img",
                    ),
                    to: path.resolve(__dirname, "./public/img/central-payment"),
                },
            ],
        }),
    ],
];

module.exports = withPlugins(plugins, nextConfig);

//Sentry性能监控配置
module.exports = withSentryConfig(
    module.exports,
    {
        silent: true,
        org: "it-cx-ip",
        project: "f1-m1-web",
    },
    {
        widenClientFileUpload: true,
        transpileClientSDK: true,
        // tunnelRoute: "/monitoring",
        hideSourceMaps: false,
        disableLogger: true,
    },
);
