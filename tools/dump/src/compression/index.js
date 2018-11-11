import { CompressionType } from "./data/types";

export function decompress(type, data) {
    if (!type) {
        return data;
    }
    return CompressionType[type].callback(data);
}
