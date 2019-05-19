
import { loadResourceEntry } from '@castaway/lifeboat/src/resources';

import { drawImage, drawScreen, getPaletteColor } from "../../resources/image";
import { createAudioManager } from "../../resources/audio";
import { PALETTE } from '../../../../../node_modules/@castaway/lifeboat/src/constants';

let tick = null;
let prevTick = Date.now();
let elapsed = null;
const fps = 1000 / 60;

let state = null;
let currentScene = 0;

let bkgScreen = null;
let bkgRes = null;
let bkgOcean = [];
let bkgRaft = null;
let cloudIdx = Math.floor((Math.random() * 3) + 15);
let cloudX = Math.floor((Math.random() * 640));
let cloudY = Math.floor((Math.random() * 80));
let cloudElapsed = 0;

const clearContext = (context) => {
    context.clearRect(0, 0, 640, 480);
}

const drawContext = (state, index) => {
    const save = state.save[state.saveIndex];
    if (save.canDraw) {
        save.canDraw = false;
        state.context.drawImage(save.context.canvas, 0, 0);
    }
}

// FIXME Improve this code repetition
const drawBackground = (state, context) => {
    // Draw background / ocean / night
    if (bkgScreen) {
        drawScreen(bkgScreen, context);
    }

    if (state.island) {
        const posX = (state.island === 1) ? 288 : 16;

        if (!cloudElapsed) {
            cloudElapsed = Math.floor((Math.random() * 640)) + Date.now();
        }
        if (Date.now() > cloudElapsed) {
            cloudElapsed = 0;
            cloudX--;
        }

        // Draw island
        if (bkgRes) {
            // Draw clouds (random and animated)
            let image = bkgRes.images[cloudIdx];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, cloudX, cloudY, image.width, image.height);

            // Draw raft based on state
            image = bkgRaft.images[3];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 222, 268, image.width, image.height);

            // isle
            image = bkgRes.images[0];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX, 280, image.width, image.height);

            // palm tree
            image = bkgRes.images[14];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 108, 280, image.width, image.height);
            image = bkgRes.images[13];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 154, 148, image.width, image.height);
            image = bkgRes.images[12];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 77, 122, image.width, image.height);
            
            // Draw shore with animations
            image = bkgRes.images[3];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX - 13, 305, image.width, image.height);

            image = bkgRes.images[6];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 76, 320, image.width, image.height);

            image = bkgRes.images[10];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 230, 303, image.width, image.height);

            // Draw low tide
        }
    }
}

// TTM COMMANDS
const SAVE_BACKGROUND = (state) => { };

const DRAW_BACKGROUND = (state) => {
    drawBackground(state, state.mainContext);
};

const PURGE = (state) => {
    // state.purge = true;
};

const UPDATE = (state) => { 
    if (state.continue) {
        if (!state.delay) {
            return;
        }
        state.continue = false;
        state.elapsed = state.delay + Date.now();
    }
    if (Date.now() > state.elapsed) {
        state.elapsed = 0;
        state.continue = true;
        // TODO not reaching here for some reason
        if (state.lastCommand) {
            state.lastCommand = false;
            state.played = true; // time is over since last update
        }
    }
};

const SET_DELAY = (state, delay) => {
    state.delay = ((delay === 0 ? 1 : delay) * 20);
};

const SLOT_IMAGE = (state, slot) => {
    state.slot = slot;
};

const SLOT_PALETTE = (state) => { };
const TTM_UNKNOWN_0 = (state) => { };

const SET_SCENE = (state) => {};

const SET_BACKGROUND = (state, index) => {
    state.saveIndex = index;
};

const GOTO = (state, tagId) => {
    state.reentry = 0; // TODO check for other scenes
};

const SET_COLORS = (state, fc, bc) => {
    if (fc < 16) {
        state.foregroundColor = PALETTE[fc];
    }
    if (bc < 16) {
        state.backgroundColor = PALETTE[bc];
    }
};

const SET_FRAME1 = (state) => { };
const SET_TIMER = (state) => { };

const SET_CLIP_REGION = (state, x1, y1, x2, y2) => {
    state.clip = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
    };
};

const FADE_OUT = (state) => { };
const FADE_IN = (state) => { };

const SAVE_IMAGE0 = (state, x, y, width, height) => {
    const save = state.save[state.saveIndex];
    save.canDraw = true;
    save.x = x;
    save.y = y;
    save.width = width;
    save.height = height;
    save.context.drawImage(
        state.context.canvas,
        x, y, width, height,
        x, y, width, height,
    );
};

const SAVE_IMAGE1 = (state, x, y, width, height) => {
    const save = state.save[state.saveIndex];
    save.canDraw = true;
    save.x = x;
    save.y = y;
    save.width = width;
    save.height = height;
    save.context.drawImage(
        state.context.canvas,
        x, y, width, height,
        x, y, width, height,
    );
};

const TTM_UNKNOWN_4 = (state, x, y, width, height) => {
    // state.context.fillStyle = getPaletteColor(1);
    // state.context.fillRect(x, y, width, height);
};
const TTM_UNKNOWN_5 = (state, x, y, width, height) => {
    // state.context.fillStyle = getPaletteColor(2);
    // state.context.fillRect(x, y, width, height);
};
const TTM_UNKNOWN_6 = (state, x, y, width, height) => {
    // state.context.fillStyle = getPaletteColor(3);
    // state.context.fillRect(x, y, width, height);
};

const DRAW_LINE = (state, x1, y1, x2, y2) => {
    state.context.beginPath();
    state.context.moveTo(x1, y1);
    state.context.lineTo(x2, y2);
    state.context.closePath();
    state.context.strokeStyle = 'white';
    state.context.stroke();
};

const DRAW_RECT = (state, x, y, width, height) => {
    state.context.fillStyle = getPaletteColor(state.foregroundColor);
    state.context.fillRect(x, y, width, height);
};

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
    if (state.res[slot] === undefined) {
        return;
    }
    const image = state.res[slot].images[index];
    if (image !== undefined) {
        state.context.beginPath();
        state.context.rect(state.clip.x, state.clip.y, state.clip.width, state.clip.height);
        state.context.clip();

        drawImage(image, state.tmpContext, 0, 0);
        state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, offsetX, offsetY, image.width, image.height);
    }
};

const DRAW_SPRITE_FLIP = (state, offsetX, offsetY, index, slot) => {
    if (state.res[slot] === undefined) {
        return;
    }
    const image = state.res[slot].images[index];
    if (image !== undefined) {
        state.context.beginPath();
        state.context.rect(state.clip.x, state.clip.y, state.clip.width, state.clip.height);
        state.context.clip();

        drawImage(image, state.tmpContext, 0, 0);
        state.context.save();
        state.context.translate(image.width, 0);
        state.context.scale(-1, 1);
        state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, -offsetX, offsetY, image.width, image.height);
        state.context.restore();
    }
};

const DRAW_SPRITE1 = (state) => { };
const DRAW_SPRITE3 = (state) => { };

const clearScreen = (state, index) => {
    clearContext(state.context);
    clearContext(state.tmpContext);
    drawContext(state);
};

const CLEAR_SCREEN = (state, index) => {
    clearScreen(state, index);
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

const SCREEN_TYPE = {
    'ISLETEMP.SCR': 1,
    'ISLAND2.SCR': 2,
    'SUZBEACH.SCR': 0,
    'JOFFICE.SCR': 0,
    'THEEND.SCR': 0,
    'INTRO.SCR': 0,
}

const loadBackground = (state) => {
    // Load background assets if not loaded yet
    if (!bkgRes) {
        const entry = state.entries.find(e => e.name === 'BACKGRND.BMP');
        if (entry !== undefined) {
            bkgRes = loadResourceEntry(entry);
        }
    }
}

const loadRaft = (state) => {
    if (!bkgRaft) {
        const entry = state.entries.find(e => e.name === 'MRAFT.BMP');
        if (entry !== undefined) {
            bkgRaft = loadResourceEntry(entry);
        }
    }
}

const loadOcean = (state) => {
    if (bkgOcean.length === 0) {
        // FIXME shorten this code later
        let entry = state.entries.find(e => e.name === 'OCEAN00.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'OCEAN01.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'OCEAN02.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'NIGHT.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        const isNight = false; // calculate night shift here
        let oceanIdx = Math.floor((Math.random() * 4)); // 0 to 3 (adding night for now)
        if (isNight) {
            oceanIdx = 4;
        }
        bkgScreen = bkgOcean[oceanIdx];
    }
}

const LOAD_SCREEN = (state, name) => {
    state.island = SCREEN_TYPE[name];
    
    // if (!bkgScreen) {
    //     const entry = state.entries.find(e => e.name === name);
    //     if (entry !== undefined) {
    //         bkgScreen = loadResourceEntry(entry);
    //     }
    // }

    if (state.island) {
        loadBackground(state);
        loadRaft(state);
        loadOcean(state);
    }
};

const LOAD_IMAGE = (state, name) => {
    if (name === 'FLAME.BMP' || name === 'FLURRY.BMP') {
        name = 'FIRE1.BMP';
    }
    const entry = state.entries.find(e => e.name === name);
    if (entry !== undefined) {
        state.res[state.slot] = loadResourceEntry(entry);
    }
};

const LOAD_PALETTE = (state) => { };

// ADS COMMANDS
const ADS_UNKNOWN_0 = (state) => { };

const IF_NOT_PLAYED = (state, sceneIdx, tagId) => {
    // if (state.continue) {
    //     state.continue = false;
    // }
    // if (state.played.length > 0) {
    //     const scene = state.played.find(s => s.sceneIdx === sceneIdx && s.tagId === tagId);
    //     if (scene !== undefined) {
    //         state.continue = true;
    //         // TODO OR Skip
    //     }
    // } else {
    //     state.continue = true;
    // }
};

const IF_PLAYED = (state, sceneIdx, tagId) => {
    if (state.continue) {
        state.continue = false;
    }
    const scene = state.scenes.find(s => 
        s.sceneIdx === sceneIdx && s.tagId === tagId
        && s.state.played);
    if (scene !== undefined) {
        STOP_SCENE(state, sceneIdx, tagId, 0);
        state.continue = true;
    }
};

const IF_NOT_RUNNING = (state) => { };
const IF_RUNNING = (state) => { };
const AND = (state) => { };
const OR = (state) => { };

const PLAY_SCENE = (state) => {
    if (state.continue) {
        state.continue = false;
    }
    let canContinue = false
    state.scenes.forEach(s => {
        canContinue = canContinue | (s.state.runs > 0) ? true : false;
    });
    state.continue = canContinue;
}; // runScripts has the continue logic 
const PLAY_SCENE_2 = (state) => { };

const initialState = {
    reentry: 0,
    lastCommand: false,
    runs: 0,
    played: false,
    continue: true,
    skip: false,
    island: 1
};

const ADD_SCENE = (state, sceneIdx, tagId, retriesDelay, unk) => {    
    const ttm = state.scenesRes[sceneIdx - 1];
    if (ttm === undefined || ttm.scenes === undefined) {
        console.log('add failed ttm', sceneIdx, tagId);
        return;
    }
    const scene = ttm.scenes.find(s => s.tagId === tagId);
    const retries = retriesDelay >= 0 ? retriesDelay : 0;
    const delay = retriesDelay < 0 ? retriesDelay : state.delay;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const stateInit = { ...initialState, context: canvas.getContext('2d') };

    const s = Object.assign({ sceneIdx, delay, retries }, scene);
    if (s.script === undefined) {
        console.log('add failed script', sceneIdx, tagId, scene, ttm);
        return;
    }
    if (!state.scenes.length) {
        s.script.unshift(...ttm.scenes[0].script);
        s.state = Object.assign({}, state, stateInit);
    } else {
        s.state = Object.assign({}, state.scenes[0].state, stateInit);
    }
    console.log(s);
    state.scenes.push(s);
};

const STOP_SCENE = (state, sceneIdx, tagId, retries) => {
    const scenes = state.scenes.filter(s => s.sceneIdx !== sceneIdx && s.tagId !== tagId);
    if (scenes !== undefined) {
        state.scenes = scenes;
    } else {
        state.scenes = [];
    }
};

const RANDOM_START = (state) => {
    state.randomize = true;
};

const RANDOM_UNKNOWN_0 = (state) => { };

const RANDOM_END = (state) => {
    const index = Math.floor((Math.random() * state.scenes.length));
    const scene = state.scenes[index];
    if (scene !== undefined) {
        const tagId = scene.tagId;
        state.scenes = state.scenes.filter(s => s.tagId === tagId);
    }
    state.randomize = false;
};

const ADS_UNKNOWN_6 = (state) => { };
const ADS_FADE_OUT = (state) => { };
const RUN_SCRIPT = (state) => { };

const END = (state) => {
    if (!state.continue) {
        state.continue = true;
    } else if (state.continue) {
        state.continue = false;
        console.log('end pause', state.lastCommand);
    }
    const scene = state.scenes.find(s => s.state.played);
    if (state.lastCommand && scene !== undefined) {
        state.scenes = [];
        state.continue = true;
        console.log('end resume', state.lastCommand);
    }
    // if (!state.continue && !state.lastCommand) {
    //     console.log('last command', state.lastCommand);
    //     state.continue = true;
    // }
    
    // // TODO this should be place elsewhere
    // // reset clouds
    // cloudIdx = Math.floor((Math.random() * 3) + 15);
    // cloudX = Math.floor((Math.random() * 640));
    // cloudY = Math.floor((Math.random() * 80));
    // let oceanIdx = Math.floor((Math.random() * 4)); // 0 to 3 (adding night for now)
    // bkgScreen = bkgOcean[oceanIdx];
    // drawBackground(state, state.mainContext);
};

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
    { opcode: 0x1200, callback: GOTO }, 
    { opcode: 0x2000, callback: SET_COLORS },
    { opcode: 0x2010, callback: SET_FRAME1 },
    { opcode: 0x2020, callback: SET_TIMER },
    { opcode: 0x4000, callback: SET_CLIP_REGION },
    { opcode: 0x4110, callback: FADE_OUT },
    { opcode: 0x4120, callback: FADE_IN },
    { opcode: 0x4200, callback: SAVE_IMAGE0 },
    { opcode: 0x4210, callback: SAVE_IMAGE1 },
    { opcode: 0xA000, callback: TTM_UNKNOWN_4 },
    { opcode: 0xA050, callback: TTM_UNKNOWN_5 },
    { opcode: 0xA060, callback: TTM_UNKNOWN_6 },
    { opcode: 0xA0A0, callback: DRAW_LINE },
    { opcode: 0xA100, callback: DRAW_RECT },
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
    { opcode: 0x1330, callback: IF_NOT_PLAYED },
    { opcode: 0x1350, callback: IF_PLAYED },
    { opcode: 0x1360, callback: IF_NOT_RUNNING },
    { opcode: 0x1370, callback: IF_RUNNING },
    { opcode: 0x1420, callback: AND },
    { opcode: 0x1430, callback: OR },
    { opcode: 0x1510, callback: PLAY_SCENE },
    { opcode: 0x1520, callback: PLAY_SCENE_2 },
    { opcode: 0x2005, callback: ADD_SCENE },
    { opcode: 0x2010, callback: STOP_SCENE },
    { opcode: 0x3010, callback: RANDOM_START },
    { opcode: 0x3020, callback: RANDOM_UNKNOWN_0 },
    { opcode: 0x30ff, callback: RANDOM_END },
    { opcode: 0x4000, callback: ADS_UNKNOWN_6 },
    { opcode: 0xf010, callback: ADS_FADE_OUT },
    { opcode: 0xf200, callback: RUN_SCRIPT }, 
    { opcode: 0xffff, callback: END },
    // CUSTOM: Added for text script
    { opcode: 0xfff0, callback: END_IF },
];

const runScript = (state, script, main = false) => {
    if (script === undefined) {
        return true;
    }
    for (let i = state.reentry; i < script.length; i++) {
        const c = script[i];
        const type = CommandType.find(ct => ct.opcode === c.opcode);
        if (!type) {
            continue;
        }
        if (main) {
            console.log(c.line);
        }
        if (i === (script.length - 1)) {
            state.lastCommand = true;
        }
        type.callback(state, ...c.params);
        state.reentry = i;
        if (!state.continue) {
            break;
        }
    }
    if (state.reentry === (script.length - 1)) {
        state.lastCommand = true;
        state.reentry = 0;
        state.runs++;
        if (!state.continue) {
            state.continue = true;
        }
        state.played = true;
        if (main) {
            currentScene++;
        }
    }
    return false;
};

const runScripts = () => {
    let exitFrame = false;
    clearContext(state.context);
    
    if (state.island) {
        drawBackground(state, state.mainContext);
    }

    const scene = state.data.scenes[currentScene];
    if (scene !== undefined) {
        exitFrame = runScript(state, scene.script, true);
    }
    
    if (!state.continue) {
        state.scenes.forEach(s => {
            runScript(s.state, s.script);
        });
        state.scenes.forEach(s => {
            state.context.drawImage(s.state.context.canvas, 0, 0);
        });
    }
    return exitFrame;
};

export const startProcess = (initialState) => {
    // FIXME this state needs a deep clean up
    state = {
        data: null,
        context: null,
        tmpContext: null,
        mainContext: null,
        save: [],
        saveIndex: 0,
        audioManager: null,
        slot: 0,
        res: [],
        // this should be for multiple running scripts
        reentry: 0,
        elapsed: 0,
        delay: 0,
        continue: true,
        frameId: null,
        island: 1,
        scenesRes: [],
        scenesState: [],
        scenes: [],
        foregroundColor: PALETTE[0],
        backgroundColor: PALETTE[0],
        clip: { x: 0, y: 0, width: 640, height: 480 },
        type: null,
        skip: false,
        randomize: false,
        purge: false,
        played: false,
        runs: 0,
        lastCommand: false,
        ...initialState,
    };
    bkgScreen = null;
    bkgRes = null;
    bkgOcean = [];
    bkgRaft = null;
    currentScene = 0;

    // temp canvas
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = 640;
    tmpCanvas.height = 480;  
    state.tmpContext = tmpCanvas.getContext('2d');

    for (let s = 0; s < 3; s += 1) {
        const c = document.createElement("canvas");
        c.width = 640;
        c.height = 480;
        state.save.push({
            context: c.getContext('2d'),
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            canDraw: false,
        });
    }

    state.audioManager = createAudioManager({ soundFxVolume: 0.50 });

    if (state.type === 'ADS') {
        state.data.resources.forEach(r => {
            const entry = state.entries.find(e => e.name === r.name);
            if (entry !== undefined) {
                state.scenesRes.push(loadResourceEntry(entry));
            }
        });
    }
    console.log(state.data.scenes);
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

    if (runScripts()) {
        cancelAnimationFrame(state.frameId);
    }
}
