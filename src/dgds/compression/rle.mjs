export const decompressRLE = (data, offset, length) => {
    const pdata = [];
    while (offset < length) {
        const control = data.getUint8(offset, true);
        offset += 1;
        if ((control & 0x80) === 0x80) {
            const len = (control & 0x7F);
            const value = data.getUint8(offset, true);
            offset += 1;
            for (let i = 0; i < len; i += 1) {
                pdata.push(value);
            }
        } else {
            for (let i = 0; i < control; i += 1) {
                pdata.push(data.getUint8(offset, true));
                offset += 1;
            }
        }
    }
    return pdata;
};
