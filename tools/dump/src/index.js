import path from 'path';
import { loadResources } from './resources';

const filepath = path.join(__dirname,'../../../data');
const resources = loadResources(filepath, "RESOURCE.MAP");

console.log(resources);
