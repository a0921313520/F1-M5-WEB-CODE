import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const ImageWithSkeleton = ({ src, alt, className }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {!imageLoaded && (
                <Skeleton
                    baseColor="#E0E0E0"
                    highlightColor="#F5F5F5"
                    className="absolute inset-0 h-full w-full !rounded-lg"
                    style={{ lineHeight: 1 }}
                />
            )}
            <img
                className={`h-full w-full rounded-lg object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                src={src}
                alt={alt}
                onLoad={() => setImageLoaded(true)}
            />
        </div>
    );
};

export default ImageWithSkeleton;
