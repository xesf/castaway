import fs from 'fs';
import path from 'path';
import { loadResources, loadResourceEntry } from './resources';

const filepath = path.join(__dirname,'../../../data');
const resindex = loadResources(filepath, "RESOURCE.MAP");

function dumpResourceIndex(filepath, resindex) {
    const dumppath = path.join(filepath,'dump');
    fs.writeFileSync(path.join(dumppath, 'resindex.json'), JSON.stringify(resindex, null, 2) , 'utf-8');    
}

function dumpResourceEntriesCompressed(filepath, resindex) {
    const dumppath = path.join(filepath,'dump/compressed');
    const res = resindex.resources[0];
    for (let e = 0; e < res.numEntries; e++) {
        const entry = res.entries[e];
        fs.writeFileSync(path.join(dumppath, entry.name), Buffer.from(entry.buffer) , 'utf-8');
    }
} 

// Export Resource Index in JSON file
dumpResourceIndex(filepath, resindex);
dumpResourceEntriesCompressed(filepath, resindex);

const entry = loadResourceEntry(resindex.resources[0].entries[0]);
console.log(entry);

console.log('Dump Complete!!');
