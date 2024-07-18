/*
 * @Author: Alan
 * @Date: 2023-06-06 10:09:36
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-29 11:22:28
 * @Description: 图片组件
 * @FilePath: /F1-M1-WEB-Code/components/ImageWithFallback/index.js
 */
import Image from "next/image";
import PropTypes from "prop-types";
import { useState } from "react";

function ImageWithFallback({
    src,
    width,
    height,
    alt,
    fallbackSrc = `${process.env.BASE_PATH}/img/logo/logo.svg`,
    local,
}) {
    const [hasError, setHasError] = useState(false);

    return (
        <div key={src}>
            {hasError ? (
                <img
                    src={fallbackSrc}
                    alt="Default Image"
                    width={width || "100%"}
                />
            ) : local ? (
                <img
                    src={src}
                    width={width}
                    height={height}
                    alt={alt}
                    onError={(e) => {
                        setHasError(true);
                    }}
                />
            ) : (
                <Image
                    src={src}
                    width={width}
                    height={height}
                    layout="responsive"
                    alt={alt}
                    onError={(e) => {
                        setHasError(true);
                    }}
                    loading="lazy"
                />
            )}
        </div>
    );
}

ImageWithFallback.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    alt: PropTypes.string.isRequired,
    fallbackSrc: PropTypes.string.isRequired,
};

export default ImageWithFallback;
