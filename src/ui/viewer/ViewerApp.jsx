import React, { useState, useEffect } from 'react';
import async from 'async';

import './viewerapp.css';
import jonny from '../assets/jonny.png';

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
        <div>
            <div className="ui visible sidebar inverted vertical menu large viewer-bkg">
                <div className="item">
                    <a className="ui logo icon image" href="/">
                        <img src={jonny} alt="Castaway Viewer" width="36" />
                    </a>
                    <a href="/"><b> Castaway Viewer</b></a>
                </div>
                {resindex && <ResourceList res={resindex} />}
            </div>
            <div className="pusher" style={{ marginLeft: '250px' }}>
                {resindex && <ResourceContent res={resindex} />}
            </div>
        </div>
    );
};

export default ViewerApp;
