
import { loadResources, loadResourceEntry } from './resources/index.mjs';
import { startProcess, stopProcess } from './scripting/process.mjs';

const res = loadResources(files.resindex, files.res);
const entries = res.resources[0].entries;

const context = canvas.getContext('2d');
context.clearRect(0, 0, 640, 480);

const mainContext = mainCanvas.getContext('2d');
context.clearRect(0, 0, 640, 480);

const entry = entries.find((e) => e.name === 'BUILDING.ADS');
const data = loadResourceEntry(entry);

startProcess({
    type: 'ADS',
    context,
    mainContext,
    data,
    entries,
});
