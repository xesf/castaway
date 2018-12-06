import { getString } from '../utils';
import { decompress } from "../compression";

import { ADSCommandType } from './data/scripting';

export function loadADSResourceEntry(entry) {
    let offset = 0;
    const type = getString(entry.data, offset, 3);
    if (type !== 'VER') {
        throw `Invalid Type ${type}: expecting header type VER`;
    }
    const versionSize = entry.data.getUint32(offset + 4, true);
    const version = getString(entry.data, offset + 8, versionSize); // 4.09
    offset += 8;
    offset += versionSize;

    let block = getString(entry.data, offset, 3);
    if (block !== 'ADS') {
        throw `Invalid Type ${block}: expecting block type ADS`;
    }
    offset += 4;
    const adsUnknown01 = entry.data.getUint16(offset, true);
    const adsUnknown02 = entry.data.getUint16(offset + 2, true);
    // Skip unknown fields
    offset += 4;

    block = getString(entry.data, offset, 3);
    if (block !== 'RES') {
        throw `Invalid Type ${block}: expecting block type RES`;
    }
    offset += 4;
    const resSize = entry.data.getUint32(offset, true);
    const numResources = entry.data.getUint16(offset + 4, true);
    // Skip unknown fields
    offset += 6;

    const resources = [];
    for (let r = 0; r < numResources; r++) {
        const id = entry.data.getUint16(offset, true);
        const name = getString(entry.data, offset + 2);
        resources.push({
            id,
            name
        });
        offset += 2;
        offset += name.length + 1;
    }

    block = getString(entry.data, offset, 3);
    if (block !== 'SCR') {
        throw `Invalid Type ${block}: expecting block type SCR`;
    }
    let blockSize = entry.data.getUint32(offset + 4, true);
    const compressionType = entry.data.getUint8(offset + 8, true);
    const uncompressedSize = entry.data.getUint32(offset + 9, true);
    offset += 13;
    blockSize -= 5; // take type and size out of the block
    const compressedData = new DataView(entry.buffer.slice(offset, offset + blockSize));
    offset += blockSize;
    let data = decompress(compressionType, compressedData, 0, compressedData.byteLength);
    data = new DataView(new Int8Array(data).buffer);

    block = getString(entry.data, offset, 3);
    if (block !== 'TAG') {
        throw `Invalid Type ${block}: expecting block type TAG`;
    }
    offset += 4;
    const tagSize = entry.data.getUint32(offset, true);
    const numTags = entry.data.getUint16(offset + 4, true);
    offset += 6;
    
    const tags = [];
    for (let t = 0; t < numTags; t++) {
        const id = entry.data.getUint16(offset, true);
        const description = getString(entry.data, offset + 2);
        tags.push({
            id,
            description
        });
        offset += 2;
        offset += description.length + 1;
    }

    let lineNumber = 1;
    let innerOffset = 0;
    const scripts = [];
    while (innerOffset < uncompressedSize) {
        let opcode = data.getUint16(innerOffset, true);
        innerOffset += 2;
        let command = {
            opcode,
            lineNumber,
            line: '',
            tag: null,
            params: []
        }
        if (opcode > 0x100) {
            const c = ADSCommandType.find(ct => ct.opcode === opcode);
            
            if (c !== undefined) {
                const size = c.paramSize;
                command.line += `${c.command} `;

                for (let b = 0; b < size; b++) {
                    const param = data.getUint16(innerOffset, true);
                    command.params.push(param);
                    innerOffset += 2;

                    command.line += `${param} `;
                }
            }
        } else {
            command.tag = tags.find(t => t.id === command.opcode);
            command.line += `${command.tag.description}`;
        }

        lineNumber++;
        scripts.push(command);
    }

    return {
        name: entry.name,
        type: entry.type,
        adsUnknown01,
        adsUnknown02,
        resources,
        tags,
        buffer: data,
        scripts,
    };
}
