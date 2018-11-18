import React from 'react';

import { map, orderBy } from 'lodash';


const ResourceList = ({ res }) => {
    return (
        <div className="item">
            <div className="header">{res.resources[0].name}</div>
            <div className="menu">
                {map(orderBy(res.resources[0].entries, ['type'], ['asc']), (entry) => {
                    if (entry.type !== 'ADS') {
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
