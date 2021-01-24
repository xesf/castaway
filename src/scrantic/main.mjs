import { drawScreen } from '../dgds/graphics.mjs';
import { loadResources, loadResourceEntry } from '../dgds/resource.mjs';
import { startProcess, stopProcess } from '../dgds/scripting/process.mjs';
import Story from './story.mjs';

export const run = async () => {
    const currentDay = localStorage.getItem('currentDay') || 1;

    const mainContext = document.getElementById('mainCanvas').getContext('2d');
    mainContext.clearRect(0, 0, 640, 480);

    const [resIndex, resFile] = await Promise.all([
        fetch('data/RESOURCE.MAP'),
        fetch('data/RESOURCE.001'),
    ]);
    
    const res = loadResources(await resIndex.arrayBuffer(), await resFile.arrayBuffer());
    const resource = res.getResource('RESOURCE.001');

    const introRes = resource.loadEntry('INTRO.SCR');
    drawScreen(introRes, mainContext);

    await new Promise(r => setTimeout(r, window.location.hostname === 'localhost' ? 1000: 3000));

    const story = new Story(resource, currentDay);
    await story.play();
};
