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
        <div style={{ width: 'auto', height: 'auto', backgroundColor: '#fff' }}>
            <div className="ui visible inverted vertical menu small viewer-bkg" style={{ margin: '0', top: '40px', height: 'auto', overflowY: 'scroll' }}>
                {resindex && <ResourceList res={resindex} />}
            </div>
            <div
                className="pusher"
                style={{
                    marginLeft: '180px',
                    height: window.innerHeight - 45,
                    width: window.innerWidth,
                    overflowY: 'scroll'
                }}
            >
                {resindex && <ResourceContent res={resindex} />}
            </div>
        </div>
    );
};

export default ViewerApp;
