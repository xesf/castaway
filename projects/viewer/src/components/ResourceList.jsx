import React from 'react';

import { map } from 'lodash';


const ResourceList = ({ res }) => {
    return (
        <div className="item">
            <div className="header">{res.resources[0].name}</div>
            <div className="menu">
                {map(res.resources[0].entries, (entry) => {
                    if (entry.type === 'BMP' ||
                        entry.type === 'PAL') {
                        return (
                            <a key={entry.name} className="item" href={`/#entry=${entry.name}`}>
                                {entry.name}
                            </a>
                        );
                    }
                    return (
                        <div key={entry.name} className="item" style={{ color: 'dimgray' }}>
                            {entry.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResourceList;
