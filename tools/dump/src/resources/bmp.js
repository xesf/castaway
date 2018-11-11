import { INDEX_STRING_SIZE } from '../constants';
import { getString } from '../utils';
import { decompress } from "../compression";

export function loadBMPResourceEntry(entry) {
    let offset = 0;
    const type = getString(entry.data, offset, 3);
    if (type !== 'BMP') {
        throw `Invalid Type ${type}: expecting header type BMP`;
    }
    // info does not seem to be used - also has weird values
    const width = entry.data.getUint16(offset + 4, true);
    const height = entry.data.getUint16(offset + 6, true);
    offset += 8;

    let block = getString(entry.data, offset, 3);
    if (block !== 'INF') {
        throw `Invalid Type ${block}: expecting block type INF`;
    }
    // const blockSize = entry.data.getUint32(offset + 4, true);
    const numImages = entry.data.getUint16(offset + 8, true);
    offset += 10;

    const images = [];
    // get width value for all images
    for (let i = 0; i < numImages; i++) {
        const w = entry.data.getUint16(offset, true);
        offset += 2;

        images.push({ width: w, height: 0, pixel: null });
    }
    // get height value for all images
    for (let i = 0; i < numImages; i++) {
        const h = entry.data.getUint16(offset, true);
        offset += 2;

        images[i].height = h;
    }
    block = getString(entry.data, offset, 3);
    if (block !== 'BIN') {
        throw `Invalid Type ${block}: expecting block type BIN`;
    }
    let blockSize = entry.data.getUint32(offset + 4, true);
    const compressionType = entry.data.getUint8(offset + 8, true);
    const uncompressedSize = entry.data.getUint32(offset + 9, true);
    offset += 13;
    blockSize -= 5; // take type and size out of the block
    const compressedData = entry.buffer.slice(offset, blockSize);

    const data = decompress(compressionType, compressedData);

    return {
        type,
        width,
        height,
        numImages,
        images,
        data: []
    };
}
