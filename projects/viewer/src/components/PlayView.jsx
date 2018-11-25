import React, { useRef, useLayoutEffect } from 'react'

/**
 * TODO
 * 8h full day cycle
 *  - 6h Day
 *  - 2h Night 
 * By default night begins at 3pm (Day starts at 9am)
 * Create random Ocean Background
 * If day cicle ends, show Night Background
 * Random island position (perhaps set via command?!)
 */

const PlayView = ({ data }) => {
    const canvasRef = useRef();
    
    useLayoutEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.fillStyle = 'black';
        context.fillRect(0, 0, 640, 480);

        return () => {}
    });

    return (
        <div style={{ display: 'block', width: '100%', overflowX: 'auto'}}>
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default PlayView;
