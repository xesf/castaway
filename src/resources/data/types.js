import { loadADSResourceEntry } from '../ads';
import { loadBMPResourceEntry } from '../bmp';
import { loadPALResourceEntry } from '../pal';
import { loadSCRResourceEntry } from '../scr';
import { loadTTMResourceEntry } from '../ttm';

export const ResourceType = [
    { type: 'ADS', callback: loadADSResourceEntry }, // Animation sequences
    { type: 'BMP', callback: loadBMPResourceEntry }, // Various raw images
    { type: 'PAL', callback: loadPALResourceEntry }, // VGA palette
    { type: 'SCR', callback: loadSCRResourceEntry }, // Background raw images
    { type: 'TTM', callback: loadTTMResourceEntry }, // Scripting macros
];
