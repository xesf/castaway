import React from 'react';

import { map } from 'lodash';

const ResourceList = ({ res }) => {
    return (
        <div class="ui visible left sidebar secondary inverted vertical menu large">
            <div class="item">
                <div class="header">{res.resources[0].name}</div>
                <div class="menu">
                    {map(res.resources[0].entries, (entry) => {
                        return (
                            <a class="item">
                                {entry.name}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ResourceList;
