import React from 'react';

import { map } from 'lodash';

import jonny from '../assets/jonny.png';

const ResourceList = ({ res }) => {
    return (
        <div class="ui visible left sidebar inverted vertical menu large viewer-bkg">
            <div class="item">
                <a class="ui logo icon image" href="/">
                    <img src={jonny} alt="Castaway Viewer" width="36" />
                </a>
                <a href="/"><b> Castaway Viewer</b></a>
            </div>
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
