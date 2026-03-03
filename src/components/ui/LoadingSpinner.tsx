import React from 'react';

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    color?: string; // Kept for compatibility, but ignored
    className?: string;
    showLabel?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className = "", showLabel = true }) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <img
                src="/loading.gif"
                alt="Loading..."
                className={`object-contain ${sizeClasses[size]} ${className}`}
            />
            {showLabel && (
                <p className="text-sm text-foreground/60 font-medium">Loading...</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
