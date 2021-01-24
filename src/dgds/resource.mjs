import { getString } from './utils/string.mjs';

import { loadADSResourceEntry } from './resources/ads.mjs';
import { loadBMPResourceEntry } from './resources/bmp.mjs';
import { loadPALResourceEntry } from './resources/pal.mjs';
import { loadSCRResourceEntry } from './resources/scr.mjs';
import { loadTTMResourceEntry } from './resources/ttm.mjs';

const INDEX_STRING_SIZE = 12;
const INDEX_HEADER_SIZE = 6;

export const ResourceType = [
    { type: 'ADS', callback: loadADSResourceEntry }, // Animation sequences
    { type: 'BMP', callback: loadBMPResourceEntry }, // Various raw images
    { type: 'PAL', callback: loadPALResourceEntry }, // VGA palette
    { type: 'SCR', callback: loadSCRResourceEntry }, // Background raw images
    { type: 'TTM', callback: loadTTMResourceEntry }, // Scripting macros
];

/**
 * Load all Resource details based on index resource file
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export const loadResources = (buffer, resbuffer) => {
    let offset = 0; // current resource offest
    const resources = []; // list of resource files
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
    for (let r = 0; r < header.numResources; r += 1) {
        let innerOffset = offset;
        const res = {
            name: getString(data, innerOffset, INDEX_STRING_SIZE),
            numEntries: data.getUint16(innerOffset + 13, true),
            size: 0,
            entries: [],
        };
        res.getEntry = (name) => res.entries.find(e => e.name === name);
        res.loadEntry = (name) => {
            const entry = res.getEntry(name);
            if (entry !== undefined) {
                return loadResourceEntry(entry);
            }
            return null;
        };
        resources.push(res);
        innerOffset += 15;

        res.size = resbuffer.byteLength;
        const resData = new DataView(resbuffer, 0, res.size);

        for (let e = 0; e < res.numEntries; e += 1) {
            // from index
            const entrySize = data.getUint16(innerOffset, true); // uncompressed size
            const entryOffset = data.getUint32(innerOffset + 4, true);
            // from resource
            const name = getString(resData, entryOffset, INDEX_STRING_SIZE);
            const entryCompressedSize = resData.getUint32(entryOffset + 13, true);
            const startOffset = entryOffset + 17;
            const endOffset = startOffset + entryCompressedSize;

            const entry = {
                name,
                type: name.split('.')[1],
                size: entrySize, // uncompressed size
                offset: entryOffset,
                compressedSize: entryCompressedSize,
                buffer: resbuffer.slice(startOffset, endOffset),
                data: new DataView(resbuffer, startOffset, entryCompressedSize),
            };
            innerOffset += 8;

            res.entries.push(entry);
        }
    }

    return {
        header,
        resources,
        getResource: (name) => resources.find((r) => r.name === name),
    };
};

export const loadResourceEntry = (entry) => {
    const resType = ResourceType.find((r) => r.type === entry.type);
    return resType.callback(entry);
};
