import { CompressionType } from './data/types.mjs';

export function decompress(type, data, offset, length) {
    if (!type) {
        return data;
    }
    return CompressionType[type].callback(data, offset, length);
}
