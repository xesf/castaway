import React, { useState, useEffect } from 'react';

import PlayView from './PlayView';

const ResourceContent = ({ res }) => {
    const [entries, setEntries] = useState();

    useEffect(() => {
        const e = res.resources[0].entries;
        setEntries(e);
        return () => {}
    }, [res]);

    return (
        <PlayView entries={entries} />
    );
};

export default ResourceContent;
