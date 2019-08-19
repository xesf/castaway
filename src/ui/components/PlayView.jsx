import React, { useRef, useEffect, useState } from 'react';

import { loadResourceEntry } from '../../resources';
import { startProcess, stopProcess } from '../../scripting/process';

const PlayView = ({ entries }) => {
    const canvasRef = useRef();
    const mainCanvasRef = useRef();
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(480);

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

    const handleResize = () => {
        let cw = 0;
        let ch = 0;
        const rw = 640;
        const rh = 480;
        const wh = window.innerHeight;
        const ww = window.innerWidth;
        const rwh = rw / rh;
        const rhw = rh / rw;

        if (wh * rwh < ww) {
            ch = wh;
            cw = wh * rwh;
        } else {
            ch = ww * rhw;
            cw = ww;
        }

        setWidth(cw);
        setHeight(ch);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const style = {
        position: 'absolute',
        zIndex: '0',
        width: `${width}px`,
        height: `${height}px`,
    };

    return (
        <>
            <canvas ref={mainCanvasRef} width="640" height="480" style={style} />
            <canvas ref={canvasRef} width="640" height="480" style={{ ...style, zIndex: '1' }} />
        </>
    );
};

export default PlayView;
