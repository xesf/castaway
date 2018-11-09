
export function getString(buffer, offset, length) {
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
