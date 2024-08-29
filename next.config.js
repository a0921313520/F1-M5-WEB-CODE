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
const withTM = require("next-transpile-modules")(["central-payment-m5"]);
const CopyPlugin = require("copy-webpack-plugin");
const { colors } = require("central-payment-m5/common/styles/themes/F1"); // 引入顏色變數的 JS 文件

//NEXT.js 默认配置
const nextConfig = {
    images: {
        minimumCacheTTL: 60,
        unoptimized: true,
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
    swcMinify: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
        additionalData: `
      ${Object.entries(colors)
          .map(([key, value]) => `$${key}: ${value};`)
          .join("\n")}
      $images-path: '/public/images';
    `, // 注入顏色變數和圖片路徑變數到每個 SCSS 文件
    },
    distDir: "build",
    trailingSlash: true,
    env: {
        LANGUAGE_PREFIX: (() => {
            if (isDev) return "";
            return PATH_PREFIX;
        })(),
        CURRENCY: "INR",
        BASE_PATH: BASE_PATH, //這個給程序用，用來處理圖片(img src)路徑
    },
    assetPrefix: isDev ? "" : PATH_PREFIX, //设置资产前缀并配置 CDN 的来源以解析为托管 Next.js 的域
    basePath: BASE_PATH, //next內建支持根目錄 處理js和css引用
    compiler: {
        styledComponents: true,
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
    transpilePackages: ["@radix-ui"],
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
                    $HOOKS: path.resolve(__dirname, "./hooks"),
                    "@": path.resolve(__dirname, "./components"),
                    $CentralPayment: path.resolve(
                        __dirname,
                        "./node_modules/central-payment-m5"
                    ),
                    $CPImg: path.resolve(
                        __dirname,
                        "./node_modules/central-payment-m5/common/assets/images"
                    ),
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
    [withBundleAnalyzer]
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
    }
);
