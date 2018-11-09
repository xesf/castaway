import path from 'path';
import { loadResourceIndex } from './resindex';

const filepath = path.join(__dirname,'../../../data');
const resourceIndex = loadResourceIndex(filepath, "RESOURCE.MAP");

console.log(resourceIndex);
