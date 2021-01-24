import fs from 'fs';
import path from 'path';
import os from 'os';

import { loadResources, loadResourceEntry } from '../resource.mjs';
import { TTMCommandType, ADSCommandType } from '../data/scripting.mjs';
import { sampleOffsets } from '../audio.mjs';

export const dumpSamples = (filepath, scrbuffer) => {
    let dumppath = path.join(filepath, 'dump');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    dumppath = path.join(dumppath, 'riffs');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    const data = new DataView(scrbuffer);
    for (let index = 0; index < sampleOffsets.length; index += 1) {
        if (sampleOffsets[index] === -1) {
            continue;
        }
        const size = data.getInt32(sampleOffsets[index] + 4, true) + 8;
        const buffer = data.buffer.slice(sampleOffsets[index], sampleOffsets[index] + size);
        fs.writeFileSync(path.join(dumppath, `sample${index}.wav`), Buffer.from(buffer), 'utf-8');
    }
};

export const dumpResourceIndex = (filepath, resindex) => {
    const dumppath = path.join(filepath, 'dump');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    fs.writeFileSync(path.join(dumppath, 'resindex.json'), JSON.stringify(resindex, null, 2), 'utf-8');
};

export const dumpResourceEntriesCompressed = (filepath, resindex) => {
    const dumppath = path.join(filepath, 'dump/compressed');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    const res = resindex.resources[0];
    for (let e = 0; e < res.numEntries; e += 1) {
        const entry = res.entries[e];
        fs.writeFileSync(path.join(dumppath, entry.name), Buffer.from(entry.buffer), 'utf-8');
    }
};

export const dumpAvailableTypes = (filepath, resindex) => {
    const types = [];
    const res = resindex.resources[0];
    for (let e = 0; e < res.numEntries; e += 1) {
        const entry = res.entries[e];
        if (!types.find((f) => f === entry.type)) {
            types.push(entry.type);
        }
    }
    const dumppath = path.join(filepath, 'dump');
    fs.writeFileSync(path.join(dumppath, 'restypes.json'), JSON.stringify({ types }, null, 2), 'utf-8');
};

export const dumpImages = (filepath, resindex) => {
    const dumppath = path.join(filepath, 'dump', 'images');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    const res = resindex.resources[0];
    for (let j = 0; j < res.numEntries; j += 1) {
        const entry = res.entries[j];
        if (entry.type === 'BMP') {
            const e = loadResourceEntry(entry);
            for (let i = 0; i < e.numImages; i += 1) {
                fs.writeFileSync(path.join(dumppath, `${e.name}_img_${i}.json`), JSON.stringify(e.images[i], null, 2), 'utf-8');
                fs.writeFileSync(path.join(dumppath, `${e.name}_img_${i}.raw`), Buffer.from(e.images[i].buffer));
            }
        }
    }
};

export const dumpMovieScripts = (filepath, resindex) => {
    const dumppath = path.join(filepath, 'dump', 'scripts');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }
    const res = resindex.resources[0];
    for (let j = 0; j < res.numEntries; j += 1) {
        const entry = res.entries[j];
        if (entry.type === 'TTM') {
            const e = loadResourceEntry(entry);
            fs.writeFileSync(path.join(dumppath, `${e.name}_script.txt`), '');
            fs.writeFileSync(path.join(dumppath, `${e.name}_script.raw`), Buffer.from(entry.buffer));

            fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), `[TAGS]:${os.EOL}`);
            for (let i = 0; i < e.tags.length; i += 1) {
                const t = e.tags[i];
                fs.appendFileSync(
                    path.join(dumppath,
                        `${e.name}_script.txt`),
                    `${t.id} ${t.description} ${os.EOL}`);
            }

            fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), `${os.EOL}[SCRIPTS]:${os.EOL}`);
            for (let i = 0; i < e.scripts.length; i += 1) {
                const c = e.scripts[i];
                const type = TTMCommandType.find((ct) => ct.opcode === c.opcode);
                let command = ''; // [0x${c.opcode.toString(16)}]
                if (type !== undefined) {
                    if (type.command === 'SET_SCENE') {
                        command += os.EOL;
                    }
                    command += `${type.command} `;
                    if (type.command === 'SET_SCENE' && c.name) {
                        command += c.name;
                    }
                } else {
                    command = 'UNKNOWN ';
                }
                for (let p = 0; p < c.params.length; p += 1) {
                    command += `${c.params[p]} `;
                }
                command += os.EOL;
                fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), command);
            }
        }
    }
};

export const dumpADSScripts = (filepath, resindex) => {
    const dumppath = path.join(filepath, 'dump', 'scripts');
    if (!fs.existsSync(dumppath)) {
        fs.mkdirSync(dumppath);
    }

    const res = resindex.resources[0];
    for (let e = 0; e < res.numEntries; e += 1) {
        const entry = res.entries[e];
        if (entry.type === 'ADS') {
            const e = loadResourceEntry(entry);
            fs.writeFileSync(path.join(dumppath, `${e.name}_script.txt`), '');
            fs.writeFileSync(path.join(dumppath, `${e.name}_script.raw`), Buffer.from(entry.buffer));


            fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), `[RESOURCES]: ${os.EOL}`);
            for (let i = 0; i < e.resources.length; i += 1) {
                const r = e.resources[i];
                fs.appendFileSync(
                    path.join(dumppath,
                        `${e.name}_script.txt`),
                    `${r.id} ${r.name} ${os.EOL}`);
            }
            fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), `${os.EOL}[TAGS]:${os.EOL}`);
            for (let i = 0; i < e.tags.length; i += 1) {
                const t = e.tags[i];
                fs.appendFileSync(
                    path.join(dumppath,
                        `${e.name}_script.txt`),
                    `${t.id} ${t.description} ${os.EOL}`);
            }

            fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), `${os.EOL}[SCRIPTS]:${os.EOL}`);

            for (let i = 0; i < e.scripts.length; i += 1) {
                const c = e.scripts[i];
                let command = ''; // [0x${c.opcode.toString(16)}]
                if (c.opcode > 0x100) {
                    const type = ADSCommandType.find((ct) => ct.opcode === c.opcode);
                    command = command.padStart(c.indent * 2, ' ');
                    if (type !== undefined) {
                        command += `${type.command} `;
                    }
                    for (let p = 0; p < c.params.length; p += 1) {
                        command += `${c.params[p]} `;
                    }
                    command += os.EOL;
                    if (type.command === 'END') {
                        command += os.EOL;
                    }
                } else {
                    command += `${c.opcode}:${c.tag.description}`;
                    command += os.EOL;
                }
                fs.appendFileSync(path.join(dumppath, `${e.name}_script.txt`), command);
            }
        }
    }
};
