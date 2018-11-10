import fs from 'fs';
import path from 'path';

import { INDEX_STRING_SIZE } from '../constants';
import { getString } from '../utils';

import { ResourceType } from './data/types';

const INDEX_HEADER_SIZE = 6;

/**
 * Load all Resource details based on index resource file
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export function loadResources(filepath, filename) {
    const absFilename = path.join(filepath, filename);

    const fc = fs.readFileSync(absFilename);
    const buffer = fc.buffer.slice(fc.byteOffset, fc.byteOffset + fc.byteLength);

    let offset = 0; // current resource offest
    let resources = []; // list of resource files
    const data = new DataView(buffer, offset, buffer.byteLength);

    const header = {
        unk0: data.getUint8(offset, true),
        unk1: data.getUint8(offset + 1, true), // number of entries?
        unk2: data.getUint8(offset + 2, true),
        unk3: data.getUint8(offset + 3, true),
        numResources: data.getUint8(offset + 4, true),
        unk5: data.getUint8(offset + 5, true),
    };
    offset += INDEX_HEADER_SIZE;

    // Read resource files and entries
    // Read number of resource files (castaway only uses a single one)
    for (let r = 0; r < header.numResources; r++) {
        let innerOffset = offset;
        let res = {
            name: getString(data, innerOffset, INDEX_STRING_SIZE),
            numEntries: data.getUint16(innerOffset + 13, true),
            size: 0,
            entries: [],
        }
        resources.push(res);
        innerOffset += 15;

        // read resource file to get extra content like name for easy identification of the asset
        const resfn = path.join(filepath, res.name);
        const resfc = fs.readFileSync(resfn);
        const resbuffer = resfc.buffer.slice(resfc.byteOffset, resfc.byteOffset + resfc.byteLength);
        res.size = resbuffer.byteLength;
        const resData = new DataView(resbuffer, 0, res.size);

        for (let e = 0; e < res.numEntries; e++) {
            // from index
            const entrySize = data.getUint16(innerOffset, true); // uncompressed size
            const entryOffset = data.getUint32(innerOffset + 4, true);
            // from resource
            const entryCompressedSize = resData.getUint32(entryOffset + 13, true);
            const name = getString(resData, entryOffset, INDEX_STRING_SIZE);

            const startOffset = entryOffset + 17;
            const endOffset = startOffset + entryCompressedSize;

            let entry = {
                name,
                type: name.split('.')[1],
                size: entrySize, // uncompressed size
                offset: entryOffset,
                compressedSize: entryCompressedSize,
                buffer: resfc.buffer.slice(startOffset, endOffset),
                data: new DataView(resbuffer, startOffset, entryCompressedSize),
            }
            innerOffset += 8;

            res.entries.push(entry);
        }
    }

    return {
        header,
        resources
    };
}

export function loadResourceEntry(entry) {
    const resType = ResourceType.find(r => r.type === entry.type);
    return resType.callback(entry);
}
