import React from 'react';

import './viewer/viewerapp.css';

// import Tab from './viewer/components/Tab';
// import TabItem from './viewer/components/TabItem';
// import Story from './Story';
// import ViewerApp from './viewer/ViewerApp';

const Viewer = () => (
    <div className="ui inverted stackable menu">
        <div className="item">
            <img src="assets/jonny.png" />
        </div>
        <a className="item" href="/#">Story</a>
        <a className="item" href="/#">Viewer</a>
    </div>
);

export default Viewer;
