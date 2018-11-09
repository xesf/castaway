import fs from 'fs';
import path from 'path';
import { getString } from './utils';

const INDEX_HEADER_SIZE = 6;
const INDEX_STRING_SIZE = 12;

/**
 * Load a Resource Index File
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export function loadResourceIndex(filepath, filename) {
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
            fileSize: 0,
            entries: [],
        }
        resources.push(res);
        innerOffset += 15;

        // read resource file to get extra content like name for easy identification of the asset
        const resfn = path.join(filepath, res.name);
        const resfc = fs.readFileSync(resfn);
        const resbuffer = resfc.buffer.slice(resfc.byteOffset, resfc.byteOffset + resfc.byteLength);
        res.fileSize = resbuffer.byteLength;

        for (let e = 0; e < res.numEntries; e++) {
            let entry = {
                length: data.getUint16(innerOffset, true), // uncompressed size
                offset: data.getUint32(innerOffset + 4, true),
                name: ''
            }
            innerOffset += 8;

            const entryData = new DataView(resbuffer, entry.offset, INDEX_STRING_SIZE);
            entry.name = getString(entryData, 0, INDEX_STRING_SIZE);

            res.entries.push(entry);
        }
    }

    return {
        header,
        resources
    };
}
