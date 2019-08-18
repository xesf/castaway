import React, { useState, useEffect } from 'react';
import async from 'async';

import './lost.css';

import ResourceContent from './components/ResourceContent';

import { preloadFileAsync } from '../utils/preload';
import { loadResources } from '../resources';

const Lost = () => {
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
        <div className="viewer-bkg">
            <div>
                <a href="/viewer">Viewer</a>
            </div>
            {resindex && <ResourceContent res={resindex} />}
        </div>
    );
};

export default Lost;
