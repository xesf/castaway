import React, { useRef, useLayoutEffect } from 'react'

const ResourceView = ({ data }) => {
    const canvasRef = useRef();
    const image = data.images[0];
    
    useLayoutEffect(() => {
        const context = canvasRef.current.getContext("2d");
        const img = context.createImageData(640, 480); //image.width, image.height);
        for (let p = 0; p < image.pixels.length; p++) {
            img.data[p + 0] = image.pixels[p].r;
            img.data[p + 1] = image.pixels[p].g;
            img.data[p + 2] = image.pixels[p].b;
            img.data[p + 3] = image.pixels[p].a;
        }
        context.fillRect(0, 0, 640, 480);
        context.putImageData(img, 0, 0);
        return () => {}
    });

    return (
        <div>
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default ResourceView;
