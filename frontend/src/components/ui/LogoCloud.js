import React from 'react';
import { InfiniteSlider } from "./InfiniteSlider";

export function LogoCloud({ className, logos, ...props }) {
    return (
        <div
            {...props}
            className={`overflow-hidden py-4 logo-cloud-mask ${className || ''}`}
        >
            <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
                {logos.map((logo) => (
                    <img
                        alt={logo.alt}
                        className="pointer-events-none user-select-none h-4 md:h-5 logo-dark-mode-adjust"
                        style={{ height: '30px', width: 'auto' }} // Explicit height as Tailwind h-4 is 1rem (16px) but usually logos need a bit more in bootstrap context if not using utility classes fully
                        key={`logo-${logo.alt}`}
                        loading="lazy"
                        src={logo.src}
                    />
                ))}
            </InfiniteSlider>
        </div>
    );
}
