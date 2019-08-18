import React, { useRef, useEffect } from 'react';

import { loadResourceEntry } from '../../../resources';
import { startProcess, stopProcess } from '../../../scripting/process';

const PlayView = ({ entries }) => {
    const canvasRef = useRef();
    const mainCanvasRef = useRef();

    useEffect(
        () => {
            if (entries !== undefined) {
                stopProcess();

                const context = canvasRef.current.getContext('2d');
                context.clearRect(0, 0, 640, 480);

                const mainContext = mainCanvasRef.current.getContext('2d');
                context.clearRect(0, 0, 640, 480);

                const entry = entries.find((e) => e.name === 'BUILDING.ADS');
                const data = loadResourceEntry(entry);

                startProcess({
                    type: 'ADS',
                    context,
                    mainContext,
                    data,
                    entries,
                });
            }

            return () => {};
        },
        [entries]
    );

    return (
        <div style={{ display: 'block', width: '100%', overflowX: 'auto'}}>
            <canvas ref={mainCanvasRef} width="640" height="480" style={{ position: 'absolute', zIndex: '0' }} />
            <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', zIndex: '1' }} />
        </div>
    );
};

export default PlayView;
