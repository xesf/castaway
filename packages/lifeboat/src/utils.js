
/**
 * Converts byte sequence numbers into String
 * @param {*} buffer DataView buffer
 * @param {*} offset Offset of the current DataView buffer
 * @param {*} length Max size of the string
 */
export function getString(buffer, offset, length = 100) {
    let str = '';
    for (let i = 0; i < length; i++) {
        let char = buffer.getUint8(offset + i);
        if (char == 0) {
            break;
        }
        str += String.fromCharCode(char);
    }
    return str;
}
