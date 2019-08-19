import React, { useState, useEffect } from 'react';

import { loadResourceEntry } from '../../../resources';

import PlayView from './PlayView';
import ResourceView from './ResourceView';

const ResourceContent = ({ res }) => {
    const [data, setData] = useState();
    const [entries, setEntries] = useState();
    const [name, setName] = useState(window.location.hash.split('=')[1]);
    const isPlayMode = name === 'PLAY';

    const onHashChanged = () => {
        setName(window.location.hash.split('=')[1]);
    };

    useEffect(() => {
        window.addEventListener('hashchange', onHashChanged);
        return () => {
            window.removeEventListener('hashchange', onHashChanged);
        };
    }, [res]);

    useEffect(() => {
        if (name) {
            const e = res.resources[0].entries;
            setEntries(e);
            if (!isPlayMode) {
                const entry = res.resources[0].entries.find((f) => f.name === name);
                setData(loadResourceEntry(entry));
            }
        }
        return () => {};
    }, [res, name]);

    return (
        <div className="ui basic segment" style={{ overflowY: 'scroll' }}>
            <div className="ui basic segment">
                <b>{name}</b>
            </div>
            {data && isPlayMode && <PlayView entries={entries} />}
            {data && !isPlayMode && <ResourceView entries={entries} data={data} />}
            {!name && 'No resource loaded. Please select one of the resources from the left menu.'}
        </div>
    );
};

export default ResourceContent;
