import React, { useState, useEffect } from 'react';
import async from 'async';

import './viewerapp.css';

import ResourceList from './components/ResourceList';
import ResourceContent from './components/ResourceContent';

import { preloadFileAsync } from '../../utils/preload';
import { loadResources } from '../../resources';

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
        }
        return () => {};
    });

    return (
        <div style={{ width: 'auto', height: 'auto' }}>
            <div className="ui visible inverted vertical menu large viewer-bkg">
                {resindex && <ResourceList res={resindex} />}
            </div>
            <div className="pusher" style={{ marginLeft: '250px', backgroundColor: '#fff' }}>
                {resindex && <ResourceContent res={resindex} />}
            </div>
        </div>
    );
};

export default ViewerApp;
