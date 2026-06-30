interface ProtectedImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ProtectedImage({ src, alt, className }: ProtectedImageProps) {
    return (
        <div className="relative select-none" style={{ WebkitTouchCallout: "none" }}>
            <img
                src={src}
                alt={alt}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                className={`select-none w-full ${className ?? ""}`}
            />
        </div>
    );
}