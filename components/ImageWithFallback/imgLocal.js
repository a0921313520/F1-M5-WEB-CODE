/*
 * @Author: Alan
 * @Date: 2023-06-06 10:09:36
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-26 22:15:39
 * @Description: 图片组件
 * @FilePath: /F1-M1-WEB-Code/components/ImageWithFallback/imgLocal.js
 */
import NextImage from "next/image";
import PropTypes from "prop-types";
import { useState } from "react";

function ImageWithFallback({
    src,
    width = "100%",
    height = "auto",
    alt,
    fallbackSrc = "/vn/img/logo/logo.svg",
}) {
    const [hasError, setHasError] = useState(false);
    return (
        <div key={src}>
            {hasError ? (
                <NextImage
                    src={"/" + fallbackSrc}
                    width={width}
                    height={height}
                    alt={alt}
                    loading="lazy"
                />
            ) : (
                <NextImage
                    src={"/" + src}
                    width={width}
                    height={height}
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
