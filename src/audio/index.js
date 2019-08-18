const samplesSourceCache = [];

function createAudioContext() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext; // needed for Safari
    return new AudioContext();
}

function loadAudioAsync(context, url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        context.decodeAudioData(request.response, callback, (err) => {
            console.error(err);
        });
    };
    request.send();
}

function getSoundFxSource(config, context, data) {
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
        console.log(`data/samples/sample${index}.aac`);
        if (index <= -1 || (source.currentIndex === index && source.isPlaying)) {
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
            loadAudioAsync(context, `data/samples/sample${index}.aac`, (buffer) => {
                // this bypasses a browser issue while loading same sample in short period of time
                if (!samplesSourceCache[index]) {
                    if (!source.bufferSource.buffer) {
                        source.bufferSource.buffer = buffer;
                        samplesSourceCache[index] = buffer;
                        source.connect();
                        callback.call();
                    }
                }
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
}

export function createAudioManager(config) {
    const context = createAudioContext();
    const sfxSource = getSoundFxSource(config, context);
    return {
        context,
        getSoundFxSource: () => sfxSource,
    };
}
