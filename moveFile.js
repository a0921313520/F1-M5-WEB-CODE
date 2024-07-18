/*
 * @Author: Alan
 * @Date: 2023-01-12 09:46:43
 * @LastEditors: Alan
 * @LastEditTime: 2023-02-10 22:19:33
 * @Description: 头部注释
 * @FilePath: \F1-M1-WEB-Code\moveFile.js
 */
const fs = require("fs");
const path = require("path");
const mv = require("mv");

// 更正线上zh语言路径
mv("./vn/vn/", "./vn/", { mkdirp: false, clobber: false }, (error) => {
    if (error) {
        console.log("mv error!", error);
        throw error;
    }
    // //取代next的404頁面
    // fs.copyFile('./vn/static_pages/404.html', './vn/404/index.html', (err) => {
    //     if (err) {
    //         console.log('copy 404 error1!', error);
    //         throw err;
    //     }
    // });
    // //複製出根目錄的404頁面
    // fs.copyFile('./vn/static_pages/404.html', './vn/404.html', (err) => {
    //     if (err) {
    //         console.log('copy 404 error2!', error);
    //         throw err;
    //     }
    // });
    //更名自動生成的survey/feedbacks.html/目錄 (之前版本是單獨一個html文件，不是目錄，保持原架構不動，不然還要去刪服務器上的原文件，很麻煩)
    // mv('./vn/survey/feedbackcs.html/','./vn/survey/feedbackcsBAK.html/', {mkdirp: false, clobber: false}, error => {
    //     if (error) {
    //         console.log('mv /vn/survey/feedbackcs.html/ error!', error);
    //         throw error;
    //     }
    //     //複製出 survey/feedbacks.html 文件
    //     fs.copyFile('./vn/survey/feedbackcsBAK.html/index.html', './vn/survey/feedbackcs.html', (err) => {
    //         if (err) {
    //             console.log('copy /vn/survey/feedbackcsBAK.html/index.html error!', error);
    //             throw err;
    //         }
    //         fs.rmdir('./vn/survey/feedbackcsBAK.html/', { recursive: true }, (err) => {
    //             if (err) {
    //                 console.log('rm /vn/survey/feedbackcsBAK.html/ error!', error);
    //                 throw err;
    //             }
    //         });
    //     });
    // })
});
