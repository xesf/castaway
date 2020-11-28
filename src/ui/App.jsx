import React from 'react';

import { loadParams } from './params';
import Story from './Story';
import Viewer from './Viewer';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        const params = loadParams();
        params.editor = true;
        this.state = {
            params,
        };
    }

    render() {
        const { params } = this.state;
        return (
            <>
                {params.editor ? <Viewer /> : <Story />}
            </>
        );
    }
}
