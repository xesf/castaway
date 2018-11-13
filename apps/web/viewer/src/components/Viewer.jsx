import React, { setState } from 'react';
import async from 'async';

import { preloadFileAsync } from './utils';
import { loadResources } from '@castaway/lifeboat/src/resources';

const Viewer = () => {
    const [resindex, setResindex] = setState();

    async.auto({
        resindex: preloadFileAsync('data/RESOURCE.MAP'),
        res: preloadFileAsync('data/RESOURCE.001'),
    }, (err, files) => {
        // todo
        setResindex(loadResources(files.resindex, files.res));
    });

    return (
        <div>
            {resindex && `Viewer: resources loaded`}
        </div>
    );
};

export default Viewer;