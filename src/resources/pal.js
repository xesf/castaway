import { getString } from '../utils/string';

export function loadPALResourceEntry(entry) {
    let offset = 0;
    const type = getString(entry.data, offset, 3);
    if (type !== 'PAL') {
        throw `Invalid Type ${type}: expecting header type PAL`;
    }
    offset += 4;
    // skip unknown bytes    
    offset += 4;

    let block = getString(entry.data, offset, 3);
    if (block !== 'VGA') {
        throw `Invalid Type ${block}: expecting block type VGA`;
    }
    offset += 4;
    
    const palette = [];
    // read all 256 palette colors
    for (let c = 0; c < 256; c++) {
        const r = entry.data.getUint8(offset + 0, true);
        const g = entry.data.getUint8(offset + 1, true);
        const b = entry.data.getUint8(offset + 2, true);
        offset += 3;

        palette.push({ 
            index: c,
            a: 255,
            r: r * 4,
            g: g * 4,
            b: b * 4,
        });
    }

    return {
        name: entry.name,
        type,
        palette,
    };
}
