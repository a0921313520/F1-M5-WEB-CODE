import { get, post, patch } from "$SERVICES/TlcRequest";
import { ApiPort } from "$SERVICES/TLCAPI";

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
        datas.data,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("UploadDocument error:", error);
            return null;
        });
}
