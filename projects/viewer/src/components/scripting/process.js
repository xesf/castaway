
import { loadResourceEntry } from '@castaway/lifeboat/src/resources';

import { drawImage, drawScreen } from "../../resources/image";
import { createAudioManager } from "../../resources/audio";

/**
 * TODO
 * 8h full day cycle
 *  - 6h Day
 *  - 2h Night 
 * By default night begins at 3pm (Day starts at 9am)
 * Create random Ocean Background
 * If day cicle ends, show Night Background
 * Random island position (perhaps set via command?!)
 */
let tick = null;
let prevTick = Date.now();
let elapsed = null;
// let startTime = prevTick;
const fps = 1000 / 60;

let state = null;

const clearContext = (context) => {
    context.canvas.width = 640;
    context.canvas.height = 480;
    context.fillStyle = 'black';
    context.fillRect(0, 0, 640, 480);
}

// FIXME Improve this code repetition
const drawBackground = (state) => {
    // Draw background / ocean / night
    if (state.bkgScreen) {
        drawScreen(state.bkgScreen, state.context);
    }
    if (state.drawIsland) {
        // Draw island
        if (state.bkgRes) {            
            // Draw clouds (random and animated)
            // const cloudIdx = Math.floor((Math.random() * 3) + 15);
            // const x = Math.floor((Math.random() * 640));
            // const y = Math.floor((Math.random() * 80));
            let image = state.bkgRes.images[17];
            drawImage(image, state.tmpContext, 0, 0);
            state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 120, 40, image.width, image.height);

            // isle
            image = state.bkgRes.images[0];
            drawImage(image, state.tmpContext, 0, 0);
            state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 288, 280, image.width, image.height);

            // palm tree
            image = state.bkgRes.images[14];
            drawImage(image, state.tmpContext, 0, 0);state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 396, 280, image.width, image.height);
            image = state.bkgRes.images[13];
            drawImage(image, state.tmpContext, 0, 0);state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 442, 148, image.width, image.height);
            image = state.bkgRes.images[12];
            drawImage(image, state.tmpContext, 0, 0);state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 365, 122, image.width, image.height);
            
            // Draw shore with animations
            image = state.bkgRes.images[3];
            drawImage(image, state.tmpContext, 0, 0);
            state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 275, 305, image.width, image.height);

            image = state.bkgRes.images[6];
            drawImage(image, state.tmpContext, 0, 0);
            state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 364, 320, image.width, image.height);

            image = state.bkgRes.images[10];
            drawImage(image, state.tmpContext, 0, 0);
            state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, 518, 303, image.width, image.height);
            
            // Draw clouds (random and animated)
            // Draw low tide
            // Draw raft based on state
        }
    }
}


// TTM COMMANDS
const SAVE_BACKGROUND = (state) => { };
const DRAW_BACKGROUND = (state) => { };
const PURGE = (state) => { };
const UPDATE = (state) => { 
    if (state.continue) {
        // TODO update function here before the delay
        // update will run once only inside this if
        if (!state.delay) {
            return;
        }
        state.continue = false;
    }
    if (!state.elapsed) {
        state.elapsed = state.delay + Date.now();
    }

    if (Date.now() > state.elapsed) {
        state.elapsed = 0;
        state.continue = true;
    }
};
const SET_DELAY = (state, delay) => {
    state.delay = (delay * 20); // FIXME validate this value
};

const SLOT_IMAGE = (state, slot) => {
    state.slot = slot;
};

const SLOT_PALETTE = (state) => { };
const TTM_UNKNOWN_0 = (state) => { };
const SET_SCENE = (state) => { };
const SET_BACKGROUND = (state) => { };

const TTM_UNKNOWN_2 = (state) => { };
const SET_FRAME0 = (state) => { };
const SET_FRAME1 = (state) => { };
const TTM_UNKNOWN_3 = (state) => { };
const SET_WINDOW1 = (state) => { };
const FADE_OUT = (state) => { };
const FADE_IN = (state) => { };
const SAVE_IMAGE0 = (state) => { };
const SAVE_IMAGE1 = (state) => { };
const TTM_UNKNOWN_4 = (state) => { };
const TTM_UNKNOWN_5 = (state) => { };
const TTM_UNKNOWN_6 = (state) => { };

const DRAW_WHITE_LINE = (state, x1, y1, x2, y2) => {
    state.context.beginPath();
    state.context.moveTo(x1, y1);
    state.context.lineTo(x2, y2);
    state.context.closePath();
    state.context.strokeStyle = 'white';
    state.context.stroke();
};

const SET_WINDOW0 = (state) => { };

const DRAW_BUBBLE = (state, x, y, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;
    state.context.beginPath();
    state.context.arc(x + centerX, y + centerY, radius, 0, 2 * Math.PI, false);
    state.context.closePath();
    state.context.fillStyle = 'white';
    state.context.fill();
    state.context.strokeStyle = 'white';
    state.context.stroke();
};

const DRAW_SPRITE = (state, offsetX, offsetY, index, slot) => { 
    const image = state.res[slot].images[index];
    drawImage(image, state.tmpContext, 0, 0);
    state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, offsetX, offsetY, image.width, image.height);
};

const DRAW_SPRITE_FLIP = (state, offsetX, offsetY, index, slot) => { 
    const image = state.res[slot].images[index];
    drawImage(image, state.tmpContext, 0, 0);
    state.context.save();
    state.context.translate(image.width, 0);
    state.context.scale(-1, 1);
    state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, -offsetX, offsetY, image.width, image.height);
    state.context.restore();
};

const DRAW_SPRITE1 = (state) => { };
const DRAW_SPRITE3 = (state) => { };
const CLEAR_SCREEN = (state) => {
    clearContext(state.context);
    clearContext(state.tmpContext);
    drawBackground(state);
};

const DRAW_SCREEN = (state) => { };

const LOAD_SAMPLE = (state) => { };
const SELECT_SAMPLE = (state) => { };
const DESELECT_SAMPLE = (state) => { };

const PLAY_SAMPLE = (state, index) => {
    const sampleSource = state.audioManager.getSoundFxSource();
    sampleSource.load(index, () => {
        sampleSource.play();
    });
};

const STOP_SAMPLE = (state) => { };

const LOAD_SCREEN = (state, name) => {
    const entry = state.entries.find(e => e.name === name);
    if (entry !== undefined) {
        state.bkgScreen = loadResourceEntry(entry);
    }

    if (name === 'ISLETEMP.SCR' || name === 'ISLAND2.SCR') {
        state.drawIsland = true;
        // Load background assets if not loaded yet
        if (!state.bkgRes) {
            const entry = state.entries.find(e => e.name === 'BACKGRND.BMP');
            if (entry !== undefined) {
                state.bkgRes = loadResourceEntry(entry);
            }
        }
        if (state.bkgOcean.length === 0) {
            // FIXME shorten this code later
            let entry = state.entries.find(e => e.name === 'OCEAN00.SCR');
            if (entry !== undefined) {
                state.bkgOcean.push(loadResourceEntry(entry));
            }
            entry = state.entries.find(e => e.name === 'OCEAN01.SCR');
            if (entry !== undefined) {
                state.bkgOcean.push(loadResourceEntry(entry));
            }
            entry = state.entries.find(e => e.name === 'OCEAN02.SCR');
            if (entry !== undefined) {
                state.bkgOcean.push(loadResourceEntry(entry));
            }
            entry = state.entries.find(e => e.name === 'NIGHT.SCR');
            if (entry !== undefined) {
                state.bkgOcean.push(loadResourceEntry(entry));
            }
        }

        const isNight = false; // calculate night shift here
        let oceanIdx = Math.floor((Math.random() * 4)); // 0 to 3 (adding night for now)
        if (isNight) {
            oceanIdx = 4;
        }

        state.bkgScreen = state.bkgOcean[oceanIdx];
    }
};

const LOAD_IMAGE = (state, name) => {
    const entry = state.entries.find(e => e.name === name);
    if (entry !== undefined) {
        state.res[state.slot] = loadResourceEntry(entry);
    }
};

const LOAD_PALETTE = (state) => { };

// ADS COMMANDS
const ADS_UNKNOWN_0 = (state) => { };
const IF_UNKNOWN_1 = (state) => { };
const IF_LASTPLAYED = (state) => { };
const IF_SKIP_NEXT2 = (state) => { };
const IF_UNKNOWN_2 = (state) => { };
const OR_UNKNOWN_3 = (state) => { };
const OR = (state) => { };
const PLAY_SCENE = (state) => { };
const PLAY_SCENE_2 = (state) => { };
const ADD_SCENE = (state) => { };
const ADD_SCENE_UNKNOWN_4 = (state) => { };
const ADS_UNKNOWN_5 = (state) => { };
const RANDOM_START = (state) => { };
const RANDOM_UNKNOWN_0 = (state) => { };
const RANDOM_END = (state) => { };
const ADS_UNKNOWN_6 = (state) => { };
const ADS_FADE_OUT = (state) => { };
const ADS_UNKNOWN_8 = (state) => { };
const END = (state) => { };

// CUSTOM COMMAND
const END_IF = (state) => { };

const CommandType = [
    // TTM COMMANDS
    { opcode: 0x0020, callback: SAVE_BACKGROUND },
    { opcode: 0x0080, callback: DRAW_BACKGROUND },
    { opcode: 0x0110, callback: PURGE },
    { opcode: 0x0FF0, callback: UPDATE },
    { opcode: 0x1020, callback: SET_DELAY },
    { opcode: 0x1050, callback: SLOT_IMAGE },
    { opcode: 0x1060, callback: SLOT_PALETTE },
    { opcode: 0x1100, callback: TTM_UNKNOWN_0 },
    { opcode: 0x1110, callback: SET_SCENE },
    { opcode: 0x1120, callback: SET_BACKGROUND },
    { opcode: 0x1200, callback: TTM_UNKNOWN_2 }, 
    { opcode: 0x2000, callback: SET_FRAME0 },
    { opcode: 0x2010, callback: SET_FRAME1 },
    { opcode: 0x2020, callback: TTM_UNKNOWN_3 },
    { opcode: 0x4000, callback: SET_WINDOW1 },
    { opcode: 0x4110, callback: FADE_OUT },
    { opcode: 0x4120, callback: FADE_IN },
    { opcode: 0x4200, callback: SAVE_IMAGE0 },
    { opcode: 0x4210, callback: SAVE_IMAGE1 },
    { opcode: 0xA000, callback: TTM_UNKNOWN_4 },
    { opcode: 0xA050, callback: TTM_UNKNOWN_5 },
    { opcode: 0xA060, callback: TTM_UNKNOWN_6 },
    { opcode: 0xA0A0, callback: DRAW_WHITE_LINE },
    { opcode: 0xA100, callback: SET_WINDOW0 },
    { opcode: 0xA400, callback: DRAW_BUBBLE },
    { opcode: 0xA500, callback: DRAW_SPRITE },
    { opcode: 0xA510, callback: DRAW_SPRITE1 },
    { opcode: 0xA520, callback: DRAW_SPRITE_FLIP },
    { opcode: 0xA530, callback: DRAW_SPRITE3 },
    { opcode: 0xA600, callback: CLEAR_SCREEN },
    { opcode: 0xB600, callback: DRAW_SCREEN },
    { opcode: 0xC020, callback: LOAD_SAMPLE },
    { opcode: 0xC030, callback: SELECT_SAMPLE },
    { opcode: 0xC040, callback: DESELECT_SAMPLE },
    { opcode: 0xC050, callback: PLAY_SAMPLE },
    { opcode: 0xC060, callback: STOP_SAMPLE },
    { opcode: 0xF010, callback: LOAD_SCREEN },
    { opcode: 0xF020, callback: LOAD_IMAGE },
    { opcode: 0xF050, callback: LOAD_PALETTE },
    // ADS COMMANDS
    { opcode: 0x1070, callback: ADS_UNKNOWN_0 },
    { opcode: 0x1330, callback: IF_UNKNOWN_1 },
    { opcode: 0x1350, callback: IF_LASTPLAYED },
    { opcode: 0x1360, callback: IF_SKIP_NEXT2 },
    { opcode: 0x1370, callback: IF_UNKNOWN_2 },
    { opcode: 0x1420, callback: OR_UNKNOWN_3 },
    { opcode: 0x1430, callback: OR },
    { opcode: 0x1510, callback: PLAY_SCENE },
    { opcode: 0x1520, callback: PLAY_SCENE_2 },
    { opcode: 0x2005, callback: ADD_SCENE },
    { opcode: 0x2010, callback: ADD_SCENE_UNKNOWN_4 },
    { opcode: 0x2014, callback: ADS_UNKNOWN_5 },
    { opcode: 0x3010, callback: RANDOM_START },
    { opcode: 0x3020, callback: RANDOM_UNKNOWN_0 },
    { opcode: 0x30ff, callback: RANDOM_END },
    { opcode: 0x4000, callback: ADS_UNKNOWN_6 },
    { opcode: 0xf010, callback: ADS_FADE_OUT },
    { opcode: 0xf200, callback: ADS_UNKNOWN_8 }, 
    { opcode: 0xffff, callback: END },
    // CUSTOM: Add for text script
    { opcode: 0xfff0, callback: END_IF },
];

const runScript = () => {
    const scripts = state.data.scripts;
    for (let i = state.reentry; i < scripts.length; i++) {
        const c = scripts[i];
        // setTimeout(state.callback(c), 0); // set current script command
        const type = CommandType.find(ct => ct.opcode === c.opcode);
        console.log(c.line);
        if (!type) {
            continue;
        }
        type.callback(state, ...c.params);
        state.reentry = i;
        if (!state.continue) {
            break;
        }
    }
    if (state.reentry === scripts.length - 1) {
        state.reentry = 0;
        return true; // stop script for now
    }
    return false;
};

export const startProcess = (initialState) => {
    state = {
        data: null,
        context: null,
        tmpContext: null,
        audioManager: null,
        slot: 0,
        res: [],
        // this should be for multiple running scripts
        reentry: 0,
        elapsed: 0,
        delay: 0,
        continue: true,
        frameId: null,
        bkgScreen: null,
        bkgRes: null,
        bkgOcean: [],
        drawIsland: false,
        ...initialState,
    };

    // temp canvas
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = 640;
    tmpCanvas.height = 480;  
    state.tmpContext = tmpCanvas.getContext('2d');

    state.audioManager = createAudioManager({ soundFxVolume: 0.50 });

    // runScript();
    mainloop();

    return state;
};

export const stopProcess = () => {
    if (state && state.frameId) {
        cancelAnimationFrame(state.frameId);
    }
};

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, 1000/60));

const mainloop = () => {
    state.frameId = requestAnimationFrame(mainloop);

    tick = Date.now();
    elapsed = tick - prevTick;

    if (elapsed > fps) {
        prevTick = tick - (elapsed % fps);
    }

    if (runScript()) {
        cancelAnimationFrame(state.frameId);
    }
}
