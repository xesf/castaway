import { getString } from '../utils';
import { decompress } from "../compression";

export function loadTTMResourceEntry(entry) {
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
    if (block !== 'PAG') {
        throw `Invalid Type ${block}: expecting block type PAG`;
    }
    offset += 4;
    const numPages = entry.data.getUint32(offset, true);
    const pagUnknown02 = entry.data.getUint16(offset + 4, true);
    // Skip unknown fields
    offset += 6;

    block = getString(entry.data, offset, 3);
    if (block !== 'TT3') {
        throw `Invalid Type ${block}: expecting block type TT3`;
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
    if (block !== 'TTI') {
        throw `Invalid Type ${block}: expecting block type TTI`;
    }
    offset += 4;
    const ttiUnknown01 = entry.data.getUint16(offset, true);
    const ttiUnknown02 = entry.data.getUint16(offset + 2, true);
    // Skip unknown fields
    offset += 4;

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
        offset += description.length - 1;
    }

    let innerOffset = 0;
    const scripts = [];
    while (innerOffset < uncompressedSize) {
        let opcode = data.getUint16(innerOffset, true);
        innerOffset += 2;
        const size = opcode & 0x000f;
        opcode &= 0xfff0;
        let command = {
            opcode,
            name: null,
            tag: null,
            params: []
        }
        if (opcode == 0x1110 && size === 1) {
            const tagId = data.getUint16(innerOffset, true);
            innerOffset += 2;
            command.tag = tags.find(t => t.id === tagId);
            if (command.tag !== undefined) {
                command.name = command.tag.description;
            } else {
                command.name = ` tag[${tagId}]`;
            }
        } else if (size === 15) {
            command.name = getString(data, innerOffset);
            innerOffset += command.name.length;
            if (data.getUint8(innerOffset, true) === 0) {
                innerOffset++;
            }
            if (data.getUint8(innerOffset, true) === 0) {
                innerOffset++;
            }
        } else {
            for (let b = 0; b < size; b++) {
                command.params.push(data.getUint16(innerOffset, true));
                innerOffset += 2;
            }
        }
        scripts.push(command);
    }

    return {
        name: entry.name,
        type: entry.type,
        numPages,
        pagUnknown02,
        ttiUnknown01,
        ttiUnknown02,
        tags,
        buffer: data,
        scripts,
    };
}
