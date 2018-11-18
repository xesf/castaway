import React, { useRef, useLayoutEffect } from 'react'
import { drawAllImages, drawPalette, drawScreen } from '../resources/image';

const nop = () => {};

export const ResourceType = [
    { type: 'ADS', callback: nop }, // Animation sequences
    { type: 'BMP', callback: drawAllImages }, // Various raw images
    { type: 'PAL', callback: drawPalette }, // VGA palette
    { type: 'SCR', callback: drawScreen }, // Background raw images
    { type: 'TTM', callback: nop }, // Scripting macros
];

const ResourceView = ({ data }) => {
    const canvasRef = useRef();
    
    useLayoutEffect(() => {
        const context = canvasRef.current.getContext("2d");
        const resType = ResourceType.find(r => r.type === data.type);
        resType.callback(data, context);
        
        return () => {}
    });

    return (
        <div style={{ display: 'block', width: '100%', overflowX: 'auto'}}>
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default ResourceView;
