import { loadResources, loadResourceEntry } from './resources/index.mjs';
import { startProcess, stopProcess } from './scripting/process.mjs';

const run = async () => {
    const [resIndex, resFile] = await Promise.all([
        fetch('data/RESOURCE.MAP'),
        fetch('data/RESOURCE.001'),
    ]);
    
    const res = loadResources(await resIndex.arrayBuffer(), await resFile.arrayBuffer());
    const entries = res.resources[0].entries;
    
    const context = document.getElementById('canvas').getContext('2d');
    context.clearRect(0, 0, 640, 480);
    
    const mainContext = document.getElementById('mainCanvas').getContext('2d');
    mainContext.clearRect(0, 0, 640, 480);
    
    const entry = entries.find((e) => e.name === 'BUILDING.ADS');
    const data = loadResourceEntry(entry);
    
    startProcess({
        type: 'ADS',
        context,
        mainContext,
        data,
        entries,
    });
    
};

run();
