"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a song creator with methods to manage audio sequences.
 */
var SongCreator = /** @class */ (function () {
    /**
     * Constructs a new SongCreator instance.
     */
    function SongCreator() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        catch (error) {
            throw new Error('AudioContext is not supported in this browser.');
        }
        /**
         * The AudioContext used for managing and playing sounds.
         * @type {AudioContext}
         */
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        /**
         * The type of oscillator to use for sound generation.
         * @type {string}
         */
        this.oscillatorType = 'sine';
        /**
         * A collection of sequences to be played.
         * @type {Array}
         */
        this.sequences = [];
        /**
         * The total duration of the song.
         * @type {number}
         */
        this.songDuration = 0;
        /**
         * Your tracks
         * @type {Array}
         */
        this.tracks = [];
    }
    /**
     * Adds a new sequence to the song.
     * @param {Array<Object>} noteObjects - An array of note objects to be played in the sequence.
     * @param {Object} [options={}] - The options for the sequence.
     * @param {boolean} [options.loop=false] - Whether the sequence should loop.
     * @param {boolean} [options.distortion=false] - Whether to apply distortion to the sequence.
     */
    SongCreator.prototype.addSequence = function (noteObjects, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.loop, loop = _c === void 0 ? false : _c, _d = _b.distortion, distortion = _d === void 0 ? false : _d;
        if (!Array.isArray(noteObjects) || noteObjects.length === 0) {
            throw new Error('Invalid noteObjects: Must be a non-empty array.');
        }
        this.sequences.push({ 'notes': noteObjects, 'loop': loop, 'distortion': distortion, 'activeNodes': [] });
    };
    /**
     * Plays a specific sequence.
     * @param {Object} sequence - The sequence to play.
     * @param {AudioContext} audioContext - The audio context to use for playing the sequence.
     */
    SongCreator.prototype.playSequence = function (sequence, audioContext) {
        var _this = this;
        try {
            if (!sequence || !Array.isArray(sequence.notes)) {
                throw new Error('Invalid sequence: Must contain an array of notes.');
            }
            if (!sequence.activeNodes) {
                sequence.activeNodes = [];
            }
            var scheduleSequence_1 = function (startTime) {
                sequence.notes.forEach(function (noteObject) {
                    var oscillator = audioContext.createOscillator();
                    var gainNode = audioContext.createGain();
                    oscillator.frequency.value = _this.noteToFrequency(noteObject.note);
                    oscillator.type = _this.oscillatorType;
                    var attackTime = 0.2;
                    var decayTime = 0.1;
                    var sustainLevel = 0.7;
                    var releaseTime = 0.5;
                    oscillator.connect(gainNode);
                    if (sequence.distortion) {
                        var distortionNode = _this.createDistortion(audioContext);
                        gainNode.connect(distortionNode);
                        distortionNode.connect(audioContext.destination);
                    }
                    else {
                        gainNode.connect(audioContext.destination);
                    }
                    var noteEndTime = startTime + noteObject.duration;
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(1, startTime + attackTime);
                    gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
                    gainNode.gain.setValueAtTime(sustainLevel, noteEndTime);
                    gainNode.gain.linearRampToValueAtTime(0, noteEndTime + releaseTime);
                    sequence.activeNodes.push({ oscillator: oscillator, gainNode: gainNode });
                    oscillator.start(startTime);
                    oscillator.stop(noteEndTime + releaseTime);
                    startTime = noteEndTime + releaseTime;
                });
                if (sequence.loop) {
                    var sequenceDuration = sequence.notes.reduce(function (total, noteObject) { return total + noteObject.duration; }, 0);
                    setTimeout(function () { return scheduleSequence_1(audioContext.currentTime); }, sequenceDuration * 1000);
                }
            };
            scheduleSequence_1(audioContext.currentTime);
        }
        catch (error) {
            throw new Error('Failed to play sequence');
        }
    };
    /**
     * Converts a musical note to its corresponding frequency.
     * @param {string} note - The musical note to convert.
     * @returns {number} The frequency of the note.
     */
    SongCreator.prototype.noteToFrequency = function (note) {
        if (!/^[A-G][#b]?[0-8]$/.test(note)) {
            throw new Error('Invalid note format. Expected format like "A4", "C#3", or "Bb2".');
        }
        var A4 = 440;
        var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        var flatToSharp = {
            'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
        };
        if (note.includes("b")) {
            var baseNote_1 = note.substring(0, 2);
            var octave_1 = parseInt(note.charAt(2), 10);
            baseNote_1 = flatToSharp[baseNote_1] || baseNote_1;
            note = baseNote_1 + octave_1;
        }
        var baseNote = note.slice(0, -1);
        var octave = parseInt(note.slice(-1), 10);
        var semitones = notes.indexOf(baseNote) - notes.indexOf('A') + (octave - 4) * 12;
        return A4 * Math.pow(2, semitones / 12);
    };
    /**
     * Creates a distortion effect.
     * @param {AudioContext} audioContext - The audio context to use for the distortion.
     * @returns {WaveShaperNode} The created distortion node.
     */
    SongCreator.prototype.createDistortion = function (audioContext) {
        var distortion = audioContext.createWaveShaper();
        function makeDistortionCurve(amount) {
            var k = typeof amount === 'number' ? amount : 50;
            var n_samples = 44100;
            var curve = new Float32Array(n_samples);
            for (var i = 0; i < n_samples; ++i) {
                var x = i * 2 / n_samples - 1;
                curve[i] = x / (1 + Math.abs(k * x));
            }
            return curve;
        }
        try {
            distortion.curve = makeDistortionCurve(200);
            distortion.oversample = '4x';
            return distortion;
        }
        catch (error) {
            throw new TypeError('Failed to create distortion');
        }
    };
    /**
     * Plays all sequences in the song.
     */
    SongCreator.prototype.play = function () {
        var _this = this;
        this.sequences.forEach(function (sequence) {
            _this.playSequence(sequence, _this.audioContext);
        });
    };
    /**
     * Adds a track with specified start and end times.
     * @param {number} startTime - The start time of the track in seconds.
     * @param {number} endTime - The end time of the track in seconds.
     * @return {number} The index of the newly added track.
     */
    SongCreator.prototype.addTimedTrack = function (startTime, endTime) {
        if (typeof startTime !== 'number' || typeof endTime !== 'number') {
            throw new Error('Invalid start or end time: Must be a number.');
        }
        var newTrack = {
            sequences: [],
            startTime: startTime,
            endTime: endTime
        };
        this.tracks.push(newTrack);
        return this.tracks.length - 1;
    };
    /**
     * Schedules and plays the entire song with all tracks and their sequences.
     */
    SongCreator.prototype.playSong = function () {
        var _this = this;
        this.tracks.forEach(function (track) {
            var trackStartDelay = track.startTime * 1000;
            var trackEndDelay = track.endTime * 1000;
            setTimeout(function () {
                _this.playTrack(track);
            }, trackStartDelay);
            setTimeout(function () {
                _this.stopTrack(track);
            }, trackEndDelay);
        });
    };
    /**
     * Stops all sequences in a track.
     * @param {Object} track - The track to stop.
     */
    SongCreator.prototype.stopTrack = function (track) {
        track.sequences.forEach(function (sequence) {
            sequence.activeNodes.forEach(function (_a) {
                var oscillator = _a.oscillator;
                try {
                    oscillator.stop();
                }
                catch (error) {
                    console.error('Error stopping oscillator:', error);
                }
            });
            sequence.activeNodes = [];
        });
    };
    /**
     * Plays a single track.
     * @param {Object} track - The track to play.
     */
    SongCreator.prototype.playTrack = function (track) {
        var _this = this;
        try {
            if (!track || !Array.isArray(track.sequences)) {
                throw new Error('Invalid track: Must contain an array of sequences.');
            }
            var trackStartTime_1 = track.startTime * 1000;
            track.sequences.forEach(function (sequence) {
                var _a;
                var sequenceStartTime = ((_a = sequence.startTime) !== null && _a !== void 0 ? _a : 0) * 1000;
                var delay = sequenceStartTime - trackStartTime_1;
                setTimeout(function () {
                    _this.playSequence(sequence, _this.audioContext);
                }, delay);
            });
        }
        catch (error) {
            throw new TypeError('Failed to play track');
        }
    };
    /**
     * Adds a sequence with specific configurations to a track.
     * @param {number} trackIndex - The index of the track.
     * @param {Array<Object>} noteObjects - An array of note objects to be played.
     * @param {Object} options - The options for the sequence (start time, end time, loop, distortion).
     */
    SongCreator.prototype.addSequenceToTrack = function (trackIndex, noteObjects, options) {
        if (!this.tracks[trackIndex]) {
            throw new Error("Track with index ".concat(trackIndex, " does not exist."));
        }
        if (!Array.isArray(noteObjects) || noteObjects.length === 0) {
            throw new Error('Invalid noteObjects: Must be a non-empty array.');
        }
        var track = this.tracks[trackIndex];
        if (track) {
            track.sequences.push({
                notes: noteObjects,
                startTime: options.startTime || 0,
                endTime: options.endTime || this.songDuration,
                loop: options.loop || false,
                distortion: options.distortion || false,
                activeNodes: []
            });
        }
    };
    return SongCreator;
}());
exports.default = SongCreator;
