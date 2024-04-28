/*
 * @Author: Alan
 * @Date: 2023-06-14 15:11:45
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-15 14:59:09
 * @Description: 头部注释
 * @FilePath: /F1-M1-WEB-Code/editFile.js
 */
var fs = require("fs");
// var path = require('path');

function editFile(srcPath, tarPath) {
    // let prefix = path.extname(srcPath);
    // 过滤除js和html的文件
    // if (prefix === '.js') {
    const data = fs.readFileSync(srcPath, "utf8");

    fs.writeFileSync(tarPath, data, "utf8");
    console.log("module edit:" + tarPath);
    // }
}

//editFile('./data/js/export.js', './node_modules/next/dist/export/index.js');
// editFile("./data/js/moment.js", "./node_modules/moment/moment.js");
// editFile("./data/icon/dist.js", "./node_modules/@ant-design/icons/lib/dist.js");
// editFile('./data/js/reactCardCarousel.js', './node_modules/react-card-carousel/build/index.js');
editFile(
    "./data/less/antd/menu.less",
    "./node_modules/antd/lib/menu/style/index.less"
);
editFile(
    "./data/less/antd/modal.less",
    "./node_modules/antd/lib/modal/style/modal.less"
);
editFile(
    "./data/less/antd/modal-confirm.less",
    "./node_modules/antd/lib/modal/style/confirm.less"
);
editFile(
    "./data/less/antd/tabs.less",
    "./node_modules/antd/lib/tabs/style/index.less"
);
editFile(
    "./data/less/antd/form.less",
    "./node_modules/antd/lib/form/style/index.less"
);
editFile(
    "./data/less/antd/message.less",
    "./node_modules/antd/lib/message/style/index.less"
);
editFile(
    "./data/less/antd/timeline.less",
    "./node_modules/antd/lib/timeline/style/index.less"
);
