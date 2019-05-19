import React from 'react';

import { map, orderBy } from 'lodash';


const ResourceList = ({ res }) => {
    return (
        <React.Fragment>
            <div className="item">
                <div className="header">
                    <a className="item" href='/#entry=PLAY'>
                        Play
                    </a>
                </div>
            </div>
            <div className="item">
                <div className="header">{res.resources[0].name}</div>
                <div className="menu">
                    {map(orderBy(res.resources[0].entries, ['type'], ['asc']), 
                    (entry) => {
                        if (entry.type === 'VIN') {
                            return null;
                        }
                        return (
                            <a key={entry.name} className="item" href={`/#entry=${entry.name}`}>
                                {entry.name}
                            </a>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
}

export default ResourceList;
