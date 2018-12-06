import { INDEX_STRING_SIZE, PALETTE } from '../constants';
import { getString } from '../utils';
import { decompress } from "../compression";

export function loadSCRResourceEntry(entry) {
    let offset = 0;
    const type = getString(entry.data, offset, 3);
    if (type !== 'SCR') {
        throw `Invalid Type ${type}: expecting header type SCR`;
    }
    // info does not seem to be used - also has weird values
    const totalSize = entry.data.getUint16(offset + 4, true);
    const flags = entry.data.getUint16(offset + 6, true);
    offset += 8;

    let block = getString(entry.data, offset, 3);
    if (block !== 'DIM') {
        throw `Invalid Type ${block}: expecting block type DIM`;
    }
    let blockSize = entry.data.getUint32(offset + 4, true);
    const width = entry.data.getUint16(offset + 8, true);
    const height = entry.data.getUint16(offset + 10, true);
    offset += 12;

    block = getString(entry.data, offset, 3);
    if (block !== 'BIN') {
        throw `Invalid Type ${block}: expecting block type BIN`;
    }
    blockSize = entry.data.getUint32(offset + 4, true);
    const compressionType = entry.data.getUint8(offset + 8, true);
    const uncompressedSize = entry.data.getUint32(offset + 9, true);
    offset += 13;
    blockSize -= 5; // take type and size out of the block

    const compressedData = new DataView(entry.buffer.slice(offset, offset + blockSize));
    const data = decompress(compressionType, compressedData, 0, compressedData.byteLength);

    const numImages = 1;
    const images = [{
        width,
        height,
        buffer: [],
        pixels: []
    }];
    const image = images[0];
    let dataIndex = 0;
    let pixelIndex = 0;
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            let c = data[dataIndex];
            if (pixelIndex % 2 === 0) {
                c = c >> 4;
            } else {
                c = (c & 0x0f);
                dataIndex++;
            }
            const pal = PALETTE[c];
            image.buffer[w + image.width * h] = c;
            image.pixels[w + image.width * h] = { 
                index: c,
                a: pal.a,
                r: pal.r,
                g: pal.g,
                b: pal.b,
            };
            pixelIndex++;
        }
    }

    return {
        name: entry.name,
        type,
        totalSize,
        flags,
        width,
        height,
        numImages,
        images,
    };
}
