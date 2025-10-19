
"use client";

import React, { useEffect, useState } from 'react';

const PUMPKIN_COUNT = 30;

export function HalloweenEffect() {
    const [pumpkins, setPumpkins] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const createPumpkins = () => {
            const newPumpkins = Array.from({ length: PUMPKIN_COUNT }).map((_, index) => {
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 5 + 5}s`, // Slower fall
                    animationDelay: `${Math.random() * 10}s`,
                };
                return <div key={index} className="pumpkin" style={style}>🎃</div>;
            });
            setPumpkins(newPumpkins);
        };

        createPumpkins();
    }, []);

    return <>{pumpkins}</>;
};
