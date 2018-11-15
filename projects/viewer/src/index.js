import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ViewerApp from './ViewerApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ViewerApp />, document.getElementById('root'));
registerServiceWorker();
