var fs = require("fs");

const deleteDirectory = "./node_modules";
delDir(deleteDirectory);

function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); // 递归删除文件夹
                fs.rmdirSync(curPath); // 删除文件夹 (throws an error if directory not empty)
            } else {
                fs.unlinkSync(curPath); // 删除文件
            }
        });

        deleteDirectory === path && console.log("delete success to: " + path);
    }
}
