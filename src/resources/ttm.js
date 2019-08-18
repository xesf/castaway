import { getString } from '../utils/string';
import { decompress } from "../compression";

import { TTMCommandType } from './data/scripting';

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
        offset += description.length + 1;
    }

    let lineNumber = 1;
    let innerOffset = 0;
    const scripts = [];
    let prevTagId = 0;
    const scenes = [];
    let sceneScripts = [];
    while (innerOffset < uncompressedSize) {
        let opcode = data.getUint16(innerOffset, true);
        innerOffset += 2;
        const size = opcode & 0x000f;
        opcode &= 0xfff0;
        let command = {
            opcode,
            lineNumber,
            line: null,
            name: null,
            tag: null,
            params: []
        }
        if (opcode == 0x1110 && size === 1) {
            const tagId = data.getUint16(innerOffset, true);
            innerOffset += 2;
            command.tag = tags.find(t => t.id === tagId);
            if (command.tag !== undefined) {
                command.name = `${tagId}:${command.tag.description}`;
            } else {
                command.name = ` tag[${tagId}]`;
            }
            scenes.push({
                tagId: prevTagId,
                script: sceneScripts
            });
            sceneScripts = []; // reset scene script
            prevTagId = tagId;
        } else if (size === 15) {
            command.name = getString(data, innerOffset);
            innerOffset += command.name.length;
            if (data.getUint8(innerOffset, true) === 0) {
                innerOffset++;
            }
            if (data.getUint8(innerOffset, true) === 0) {
                innerOffset++;
            }
            command.params.push(command.name);
        } else {
            for (let b = 0; b < size; b++) {
                command.params.push(data.getInt16(innerOffset, true));
                innerOffset += 2;
            }
        }

        const type = TTMCommandType.find(ct => ct.opcode === command.opcode);
        command.line = ''; // [0x${c.opcode.toString(16)}] 
        if (type !== undefined) {
            command.line += `${type.command} `;
            if (command.opcode == 0x1110 && command.name) {
                command.line += command.name.toUpperCase();
            }
        } else {
            command.line = 'UNKNOWN ';
        }
        for (let p = 0; p < command.params.length; p++) {
            command.line += `${command.params[p]} `;
        }

        lineNumber++;
        scripts.push(command);
        sceneScripts.push(command);
    }

    scenes.push({
        tagId: prevTagId,
        script: sceneScripts
    });

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
        scenes,
    };
}
