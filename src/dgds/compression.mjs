import { decompressRLE } from './compression/rle.mjs';
import { decompressLZW } from './compression/lzw.mjs';
import { decompressRLE2 } from './compression/rle2.mjs';

export const CompressionType = [
    { index: 0, type: 'None', callback: null },
    { index: 1, type: 'RLE', callback: decompressRLE },
    { index: 2, type: 'LZW', callback: decompressLZW },
    { index: 3, type: 'RLE2', callback: decompressRLE2 },
];

export function decompress(type, data, offset, length) {
    if (!type) {
        return data;
    }
    return CompressionType[type].callback(data, offset, length);
}
