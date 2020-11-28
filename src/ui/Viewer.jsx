import React, { useState } from 'react';

import './viewer/viewerapp.css';

// import Tab from './viewer/components/Tab';
// import TabItem from './viewer/components/TabItem';
import Story from './Story';
import ViewerApp from './viewer/ViewerApp';

const Viewer = () => {
    const [mode, setMode] = useState('story');

    return (
        <>
            <div className="ui inverted stackable mini menu" style={{ margin: '0' }}>
                <div className="item">
                    <img src="assets/jonny.png" />
                </div>
                <a
                    className={`item${mode === 'story' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setMode('story')}
                >
                    Story
                </a>
                <a
                    className={`item${mode === 'viewer' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setMode('viewer')}
                >
                    Viewer
                </a>
            </div>
            <div>
                {mode === 'story' && <Story />}
                {mode === 'viewer' && <ViewerApp />}
            </div>
        </>
    );
};

export default Viewer;
