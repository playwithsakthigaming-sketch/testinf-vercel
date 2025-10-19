
"use client";

import React, { useEffect, useState } from 'react';

const SPARKLE_COUNT = 50;

export function DiwaliEffect() {
    const [sparkles, setSparkles] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const createSparkles = () => {
            const newSparkles = Array.from({ length: SPARKLE_COUNT }).map((_, index) => {
                const size = Math.random() * 3 + 1;
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}vw`,
                    top: `${Math.random() * 100}vh`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: `${Math.random() * 1 + 0.5}s`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    backgroundColor: `hsl(${Math.random() * 60}, 100%, 70%)`,
                };
                return <div key={index} className="sparkle" style={style} />;
            });
            setSparkles(newSparkles);
        };

        createSparkles();
    }, []);

    return <>{sparkles}</>;
};
