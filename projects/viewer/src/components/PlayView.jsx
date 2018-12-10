import React, { useRef, useEffect } from 'react'

import { loadResourceEntry } from '@castaway/lifeboat/src/resources';
import { startProcess } from './scripting/process';

const PlayView = ({ entries }) => {
    const canvasRef = useRef();

    useEffect(
        () => {
            if (entries !== undefined) {
                const context = canvasRef.current.getContext("2d");
                context.fillStyle = 'black';
                context.fillRect(0, 0, 640, 480);
                
                const entry = entries.find(e => e.name === 'MJJOG.TTM');
                const data = loadResourceEntry(entry);

                startProcess({
                    context,
                    data,
                    entries,
                });
            }

            return () => {}
        },
        [entries]
    );
    
    return (
        <div style={{ display: 'block', width: '100%', overflowX: 'auto'}}>
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default PlayView;
