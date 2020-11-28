/* eslint-disable */
function getBits(data, offset, numBits, current, nextBit) {
    let value = 0, innerOffset = 0;
    if (numBits === 0) {
        return { value: 0, innerOffset: 0, c: current, nb: nextBit };
    }
    for (let b = 0; b < numBits; b++) {
        if (((current & (1 << nextBit))) !== 0) {
            value += (1 << b);
        }
        nextBit++;
        if (nextBit > 7) {
            if (offset + innerOffset >= data.byteLength) {
                current = 0;
            } else {
                current = data.getUint8(offset + innerOffset, true);
                innerOffset++;
            }
            nextBit = 0;
        }
    }
    return { value, innerOffset, c: current, nb: nextBit };
};

export function decompressLZW(data, offset, length) {
    const pdata = [];
    const decodeStack = [];
    const codeTable = [];
    let numBits = 9;
    let freeEntry = 257;
    let nextBit = 0, stackIndex = 0, bitPos = 0;

    let current = data.getUint8(offset++, true);

    const { value, innerOffset, c, nb } = getBits(data, offset, numBits, current, nextBit);
    let oldCode = value;
    nextBit = nb;
    current = c;
    offset += innerOffset;
    let lastByte = oldCode;

    pdata.push(oldCode);

    try {
        while (offset < length) {
            const { value, innerOffset, c, nb } = getBits(data, offset, numBits, current, nextBit);
            const newCode = value;
            nextBit = nb;
            current = c;
            offset += innerOffset;
            bitPos += numBits;
            if (newCode === 256) {
                const numBits3 = numBits << 3;
                const numSkip = (numBits3 - ((bitPos - 1) % numBits3)) - 1;
                const { value, innerOffset, c, nb } = getBits(data, offset, numSkip, current, nextBit);
                nextBit = nb;
                current = c;
                offset += innerOffset; 
                numBits = 9;
                freeEntry = 256;
                bitPos = 0;
            } else {
                let code = newCode;
                if (code >= freeEntry) {
                    if (stackIndex >= 4096) {
                        break;
                    }
                    decodeStack[stackIndex] = lastByte;
                    stackIndex++;
                    code = oldCode;
                }
                while (code >= 256) {
                    if (code > 4095) {
                        break;
                    }
                    decodeStack[stackIndex] = codeTable[code].append;
                    stackIndex++;
                    code = codeTable[code].prefix;
                }
                decodeStack[stackIndex] = code;
                stackIndex++;
                lastByte = code;
                while (stackIndex > 0) {
                    stackIndex--;
                    pdata.push(decodeStack[stackIndex]);
                }
                if (freeEntry < 4096) {
                    codeTable[freeEntry] = {
                        prefix: oldCode,
                        append: lastByte,
                    };
                    freeEntry++;
                    if (freeEntry >= (1 << numBits) && numBits < 12) {
                        numBits++;
                        bitPos = 0;
                    }
                }
                oldCode = newCode;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return pdata;
}
/* eslint-enable */
