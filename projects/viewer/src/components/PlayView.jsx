import React, { useRef, useLayoutEffect } from 'react'

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
