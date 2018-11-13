import fs from 'fs';
import path from 'path';
import { loadResources, loadResourceEntry } from './resources';

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

function dumpAvailableTypes(filepath, resindex) {
    const types = [];
    const res = resindex.resources[0];
    for (let e = 0; e < res.numEntries; e++) {
        const entry = res.entries[e];
        if (!types.find(f => f === entry.type)) {
            types.push(entry.type);
        }
    }
    const dumppath = path.join(filepath,'dump');
    fs.writeFileSync(path.join(dumppath, 'restypes.json'), JSON.stringify({ types }, null, 2) , 'utf-8');
}

function dumpImages(filepath, resindex) {
    const dumppath = path.join(filepath,'dump','images');
    const res = resindex.resources[0];
    for (let e = 0; e < 3; e++) { // res.numEntries
        const entry = res.entries[e];
        if (entry.type === 'BMP') {
            const e = loadResourceEntry(entry);
            for (let i = 0; i < e.numImages; i++) {
                fs.writeFileSync(path.join(dumppath, `${e.name}_img_${i}.json`), JSON.stringify(e.images[i], null, 2) , 'utf-8');
                fs.writeFileSync(path.join(dumppath, `${e.name}_img_${i}.raw`), Buffer.from(e.images[i].buffer));
            }
        }
    }
}


const filepath = path.join(__dirname,'../../../data');
const resindex = loadResources(filepath, "RESOURCE.MAP");

// Export Resource Index in JSON file
//dumpResourceIndex(filepath, resindex);
//dumpResourceEntriesCompressed(filepath, resindex);
//dumpAvailableTypes(filepath, resindex);
dumpImages(filepath, resindex);

//const entry = loadResourceEntry(resindex.resources[0].entries[2]);
//console.log(entry);

console.log('Dump Complete!!');
