// from https://rosettacode.org/wiki/LZW_compression#ES6_Version

export function decompressLZW(data) {
    // Initialize Dictionary (inverse of compress)
    let dict = {};
    for (let i = 0; i < 256; i++)
    {
        dict[i] = String.fromCharCode(i);
    }

    let word = String.fromCharCode(data[0]);
    let result = word;
    let entry = '';
    let dictSize = 256;

    for (let i = 1, len = data.length; i < len; i++)
    {
        let curNumber = data[i];

        if (dict[curNumber] !== undefined)
        {
            entry = dict[curNumber];
        }
        else
        {
            if (curNumber === dictSize)
            {
                entry = word + word[0];
            }
            else
            {
                throw 'Error in processing';
                return null;
            }
        }

        result += entry;

        // Add word + entry[0] to dictionary
        dict[dictSize++] = word + entry[0];

        word = entry;
    }

    return result;
}
