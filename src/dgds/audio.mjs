const samplesSourceCache = [];

export const sampleOffsets = [
    -1,
    0x1DC00, 0x20800, 0x20E00,
    0x22C00, 0x24000, 0x24C00,
    0x28A00, 0x2C600, 0x2D000,
    0x2DE00,
    -1, 0x34400, 0x32E00,
    0x39C00, 0x43400, 0x37200,
    0x37E00, 0x45A00, 0x3AE00,
    0x3E600, 0x3F400, 0x41200,
    0x42600, 0x42C00, 0x43400
];

const createAudioContext = () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
};

const getSoundFxSource = (config, context, data) => {
    const source = {
        volume: config.soundFxVolume,
        isPlaying: false,
        loop: false,
        currentIndex: -1,
        bufferSource: null,
        gainNode: context.createGain(),
        lowPassFilter: context.createBiquadFilter(),
        pause: () => {},
        data
    };
    source.lowPassFilter.type = 'allpass';

    source.play = () => {
        source.isPlaying = true;
        source.bufferSource.start();
    };
    source.stop = () => {
        try {
            if (source.bufferSource) {
                source.bufferSource.stop();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug(error);
        }
        source.isPlaying = false;
    };
    source.suspend = () => {
        context.suspend();
    };
    source.resume = () => {
        context.resume();
    };
    source.load = (index, callback) => {
        if (index <= -1 ||
            (source.currentIndex === index && source.isPlaying) ||
            sampleOffsets[index] === -1) {
            return;
        }
        if (source.isPlaying) {
            source.stop();
        }
        source.currentIndex = index;
        source.bufferSource = context.createBufferSource();
        source.bufferSource.onended = () => {
            source.isPlaying = false;
        };

        if (samplesSourceCache[index]) {
            source.bufferSource.buffer = samplesSourceCache[index];
            source.connect();
            callback.call();
        } else {
            fetch('data/SCRANTIC.SCR').then((response) => response.arrayBuffer()).then((fileBuffer) => {
                const data = new DataView(fileBuffer);
                const size = data.getInt32(sampleOffsets[index] + 4, true) + 8;
                const buffer = data.buffer.slice(sampleOffsets[index], sampleOffsets[index] + size);

                context.decodeAudioData(
                    buffer,
                    (decodeBuffer) => {
                        if (!samplesSourceCache[index]) {
                            if (!source.bufferSource.buffer) {
                                source.bufferSource.buffer = decodeBuffer;
                                samplesSourceCache[index] = decodeBuffer;
                                source.connect();
                                callback.call();
                            }
                        }
                    }, (err) => {
                        console.error(err);
                    }
                );
            });
        }
    };

    source.connect = () => {
        // source->gain->context
        source.bufferSource.connect(source.gainNode);
        source.gainNode.gain.setValueAtTime(source.volume, context.currentTime + 1);
        source.gainNode.connect(source.lowPassFilter);
        source.lowPassFilter.connect(context.destination);
    };

    return source;
};

export const createAudioManager = (config) => {
    const context = createAudioContext();
    const sfxSource = getSoundFxSource(config, context);
    return {
        context,
        getSoundFxSource: () => sfxSource,
    };
};
