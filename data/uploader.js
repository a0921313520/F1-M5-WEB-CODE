/*
 * @Author: Alan
 * @Date: 2022-03-31 10:46:05
 * @LastEditors: Alan
 * @LastEditTime: 2023-04-04 14:11:43
 * @Description: 上传文件
 * @FilePath: \F1-M1-WEB-Code\data\uploader.js
 */
import { get, post, patch } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";

import Qs from "qs";

/**
 * @description 获取是否需要上传文档的状态
 * @param {*} call
 * @return {*}
 */
export function GetDocumentApprovalStatus(call) {
    get(ApiPort.GetDocumentApprovalStatus)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetDocumentApprovalStatus error:", error);
            return null;
        });
}

/**
 * @description 获取上传文档的进度
 * @param {*} call
 * @return {*}
 */
export function GetVerificationMemberDocuments(call) {
    get(ApiPort.GetVerificationMemberDocuments)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetVerificationMemberDocuments error:", error);
            return null;
        });
}

/**
 * @description: 上传身份证资料
 * @param {*} params
 * @param {*} call
 * @return {*}
 */
export function UploadDocument(datas, call) {
    post(
        ApiPort.UploadDocument + "&" + Qs.stringify(datas.params) + "&",
        datas.data
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("UploadDocument error:", error);
            return null;
        });
}
