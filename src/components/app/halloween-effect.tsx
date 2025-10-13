"use client";

import React, { useEffect, useState } from 'react';

const HALLOWEEN_ELEMENT_COUNT = 20;

export function HalloweenEffect() {
    const [elements, setElements] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const createElements = () => {
            const newElements = Array.from({ length: HALLOWEEN_ELEMENT_COUNT }).map((_, index) => {
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                };
                return <div key={index} className="pumpkin" style={style}>🎃</div>;
            });
            setElements(newElements);
        };

        createElements();
    }, []);

    return <>{elements}</>;
};
