
export function decompressRLE(data, offset, length) {
    const pdata = [];
    while (offset < length) {
        const control = data.getUint8(offset++, true);
        if ((control & 0x80) === 0x80) {
            const len = (control & 0x7F);
            const value = data.getUint8(offset++, true);
            for (let i = 0; i < len; i++) {
                pdata.push(value);
            }
        } else {
            for (let i = 0; i < control; i++) {
                pdata.push(data.getUint8(offset++, true));
            }
        }
    }
    return pdata;
}
