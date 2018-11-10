import { INDEX_STRING_SIZE } from '../constants';
import { getString } from '../utils';

export function loadBMPResourceEntry(entry) {
    let bmp = {
        name: getString(entry.data, 0, INDEX_STRING_SIZE),
        type: '',
        data: []
    }


    
    return bmp;
}
