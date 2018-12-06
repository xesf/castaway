import React, { useRef, useLayoutEffect } from 'react'

import { drawAllImages, drawPalette, drawScreen } from '../resources/image';
import ScriptCode from './ScriptCode';

const nop = (data, context) => {
    context.canvas.width  = 640;
    context.canvas.height = 480;

    context.fillStyle = 'black';
    context.fillRect(0, 0, 640, 480);
};

export const ResourceType = [
    { type: 'ADS', callback: nop }, // Animation sequences
    { type: 'BMP', callback: drawAllImages }, // Various raw images
    { type: 'PAL', callback: drawPalette }, // VGA palette
    { type: 'SCR', callback: drawScreen }, // Background raw images
    { type: 'TTM', callback: nop }, // Scripting macros
    { type: 'VIN', callback: nop }, // preload files
];

const ResourceView = ({ data }) => {
    const canvasRef = useRef();
    
    useLayoutEffect(() => {
        const context = canvasRef.current.getContext("2d");
        const resType = ResourceType.find(r => r.type === data.type);
        
        if (resType !== undefined) {
            resType.callback(data, context);
        }
        return () => {}
    });

    return (
        <React.Fragment>
            <div style={{ display: 'block', width: '100%', overflowX: 'auto'}}>
                <canvas ref={canvasRef} width="640" height="480" />
            </div>
            {data.scripts &&
                <div style={{
                    height:'350px',
                    width: '640px',
                    overflowY: 'scroll'
                }}>
                    <ScriptCode scripts={data.scripts} />
                </div>
            }
        </React.Fragment>
    );
};

export default ResourceView;
