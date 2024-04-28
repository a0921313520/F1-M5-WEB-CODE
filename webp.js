var fs = require('fs')
var path = require('path')
var webp = require('webp-converter');

function copyFile(srcPath, tarPath) {
    // 创建字节读取流
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
    })

    // 创建字节写入流
    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
    })
    ws.on('close', function (ex) {
    })

    rs.pipe(ws)
    console.log('copySuccess:' + srcPath)
}


// 源目录 目标目录 是否生成文件(如果不生成则生成json)
function copyFolder (srcDir) {
    // 读取当前路径下的所有目录和文件，返回字符串数组
    fs.readdir(srcDir, function (err, files) {
        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(srcDir, file.substring(0, file.lastIndexOf(".")) + ".webp")
            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    copyFolder(srcPath, tarPath)
                } else {
                    if (~file.indexOf('.png')|| ~file.indexOf('.jpg')) {
                        const result = webp.cwebp(srcPath, tarPath, "-q 80")
                        result.then((res) => {
                            console.log("🚀 ~ file: webp.js:44 ~ .then ~ res:", file.substring(0, file.lastIndexOf("."))  + '.webp created successfully')
                        }).catch((error) => {
                            console.log("🚀 ~ file: webp.js:49 ~ webp.cwebp ~ error:", error)
                        });
                    }
                }
            })
        })

    })
}


/*
可以把要转换的png/jpg格式的图放在这里（public/img/webp），转换完后再从此文件夹里移走
也可以把此路径改为图片所在文件夹的路径，但是这样会把选中文件夹内的所有图片都转换一个webp格式的图片，导致多余。
故 webp/ 用这个文件夹专门来放需要转换的文件。用完记得把文件都移走保持为空的文件夹
node webp 执行此命令就可以生成对应的 webp格式的图片了
*/
copyFolder("public/img/webp")
