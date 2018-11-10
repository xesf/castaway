import fs from 'fs';
import path from 'path';
import { loadResources } from './resources';

const filepath = path.join(__dirname,'../../../data');
const resources = loadResources(filepath, "RESOURCE.MAP");

console.log(resources);

const dumppath = path.join(__dirname,'../../../data/dump');
fs.writeFileSync(path.join(dumppath, 'resources.json'), JSON.stringify(resources, null, 2) , 'utf-8');
