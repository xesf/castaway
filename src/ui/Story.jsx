import React, { useState, useEffect } from 'react';
import async from 'async';

import './lost.css';

import ResourceContent from './components/ResourceContent';

import { preloadFileAsync } from '../utils/preload';
import { loadResources } from '../resources';

const Story = () => {
    const [resindex, setResindex] = useState();

    useEffect(() => {
        if (!resindex) {
            async.auto({
                resindex: preloadFileAsync('data/RESOURCE.MAP'),
                res: preloadFileAsync('data/RESOURCE.001'),
            }, (err, files) => {
                // todo
                setResindex(loadResources(files.resindex, files.res));
            });
        }
        return () => {};
    });

    return (
        <>
            {resindex && <ResourceContent res={resindex} />}
        </>
    );
};

export default Story;
