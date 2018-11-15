import React, { useState, useEffect } from 'react';
import async from 'async';

import './viewerapp.css';

import ResourceList from './components/ResourceList';

import { preloadFileAsync } from './utils/preload';
import { loadResources } from '@castaway/lifeboat/src/resources';

const ViewerApp = () => {
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
            return () => {}
        }
    });

    return (
        <div>
            {resindex && <ResourceList res={resindex} />}
        </div>
    );
};

export default ViewerApp;
