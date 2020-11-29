#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import {
    dumpResourceIndex,
    dumpResourceEntriesCompressed,
    dumpAvailableTypes,
    dumpImages,
    dumpMovieScripts,
    dumpADSScripts,
    dumpSamples,
} from './dgds/utils/dump.mjs';

import { loadResources } from './dgds/resource.mjs'

const __dirname = path.resolve();

const filepath = path.join(__dirname, 'data');
const fc = fs.readFileSync(path.join(filepath, 'RESOURCE.MAP'));
const buffer = fc.buffer.slice(fc.byteOffset, fc.byteOffset + fc.byteLength);

// read resource file to get extra content like name for easy identification of the asset
const resfn = path.join(filepath, 'RESOURCE.001');
const resfc = fs.readFileSync(resfn);
const resbuffer = resfc.buffer.slice(resfc.byteOffset, resfc.byteOffset + resfc.byteLength);

const scrfn = path.join(filepath, 'SCRANTIC.SCR');
const scrfc = fs.readFileSync(scrfn);
const scrbuffer = scrfc.buffer.slice(scrfc.byteOffset, scrfc.byteOffset + scrfc.byteLength);

const resindex = loadResources(buffer, resbuffer);

// Export Wave files
dumpSamples(filepath, scrbuffer);

// Export Resource Index in JSON file
dumpResourceIndex(filepath, resindex);
dumpResourceEntriesCompressed(filepath, resindex);
dumpAvailableTypes(filepath, resindex);
dumpImages(filepath, resindex);
dumpMovieScripts(filepath, resindex);
dumpADSScripts(filepath, resindex);

console.log('Dump Complete!!');
