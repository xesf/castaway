import { loadADSResourceEntry } from '../ads.mjs';
import { loadBMPResourceEntry } from '../bmp.mjs';
import { loadPALResourceEntry } from '../pal.mjs';
import { loadSCRResourceEntry } from '../scr.mjs';
import { loadTTMResourceEntry } from '../ttm.mjs';

export const ResourceType = [
    { type: 'ADS', callback: loadADSResourceEntry }, // Animation sequences
    { type: 'BMP', callback: loadBMPResourceEntry }, // Various raw images
    { type: 'PAL', callback: loadPALResourceEntry }, // VGA palette
    { type: 'SCR', callback: loadSCRResourceEntry }, // Background raw images
    { type: 'TTM', callback: loadTTMResourceEntry }, // Scripting macros
];
