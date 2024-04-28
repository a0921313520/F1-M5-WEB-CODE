import React from "react";
import { Modal,  } from "antd";
/**
 * 一个加载中的loading modal 可以公用
 * @param {*} Loadingvisible 开启关闭
 * @param {*} loadText 自定义文字
 * @returns 
 */
function UploadingModal({ Loadingvisible,loadText }) {
    return (
        <Modal
            title={``}
            visible={Loadingvisible}
            footer={null}
            className="showInfoModal  depositLoading"
            centered={true}
        >
            <div className="loadimg">
                <img
                    src={`${process.env.BASE_PATH}/img/icons/loading.gif`}
                    style={{ width: "40px", height: "40px" }}
                    alt="gif"
                />
                <p
                    style={{
                        marginTop: 10,
                        marginBottom: 0,
                        padding: 0,
                    }}
                >
                    {loadText}
                </p>
            </div>
        </Modal>
    )
}
export default UploadingModal