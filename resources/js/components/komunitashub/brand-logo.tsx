import React from 'react';

interface BrandLogoProps {
    className?: string;
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({
    className = '',
    showTagline = false,
    size = 'md',
}: BrandLogoProps) {
    const iconSizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    return (
        <div
            className={`inline-flex items-center gap-2.5 font-sans ${className}`}
        >
            {/* Logo Emblem: Geometric architectural representation of home & community courtyard */}
            <div
                className={`relative flex items-center justify-center rounded-md bg-[#2F6B57] text-[#FFFEFA] shadow-xs ${iconSizes[size]}`}
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5/7 w-5/7 text-[#FFFEFA]"
                >
                    {/* Roofline / community shelter */}
                    <path d="M3 10.5L12 3l9 7.5" />
                    {/* Walls and central hub courtyard */}
                    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
                    {/* Connected gateway representing trust & community security */}
                    <path d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
                </svg>
            </div>

            <div className="flex flex-col">
                <span
                    className={`leading-none font-semibold tracking-tight text-[#1D2924] ${textSizes[size]}`}
                >
                    Komunitas
                    <span className="font-bold text-[#2F6B57]">Hub</span>
                </span>
                {showTagline && (
                    <span className="mt-1 text-[11px] font-medium tracking-wide text-[#66736C]">
                        Operasional RT & Cluster
                    </span>
                )}
            </div>
        </div>
    );
}
