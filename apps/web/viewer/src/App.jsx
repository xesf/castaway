import React from 'react';

import './App.css';
import Viewer from './components/Viewer';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">castaway-viewer</h1>
      </header>
      <Viewer />
    </div>
  );
};

export default App;
