import React, { useState, useEffect } from 'react';

import { loadResourceEntry } from '@castaway/lifeboat/src/resources';

import ResourceView from './ResourceView'

const ResourceContent = ({ res }) => {
    const [data, setData] = useState();
    const [name, setName] = useState(window.location.hash.split('=')[1]);

    const onHashChanged = () => {
        setName(window.location.hash.split('=')[1]);
    };

    useEffect(() => {
        window.addEventListener('hashchange', onHashChanged);
        return () => {
            window.removeEventListener('hashchange', onHashChanged)
        }
    },[res]);
    
    useEffect(() => {
        if (name) {
            const entry = res.resources[0].entries.find(f => f.name === name);
            setData(loadResourceEntry(entry));
        }
        return () => {}
    }, [res, name]);

    return (
        <div className="ui segment">
            <div className="ui basic segment">
                <b>{name}</b>
            </div>
            {data && <ResourceView data={data} />}
            {!name && `No resource loaded. Please select one of the resources from the left menu.`}
        </div>
    );
};

export default ResourceContent;
