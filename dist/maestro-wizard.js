"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a music player that can play notes, chords, and melodies.
 */
var MaestroWizard = /** @class */ (function () {
    /**
     * Creates a StringMaestroJS instance.
     */
    function MaestroWizard() {
        /**
         * The audio context used for playing sounds.
         * @type {AudioContext}
         */
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        /**
         * The default oscillator type for the sound waves.
         * @type {OscillatorType}
         */
        this.oscillatorType = 'sine'; // Default oscillator type
    }
    /**
     * Plays a single musical note.
     * @param {string} note - The musical note to play (e.g., 'C4').
     * @param {number} startTime - The time at which the note should start playing.
     * @param {number} [duration=0.5] - The duration in seconds for which the note should play.
     */
    MaestroWizard.prototype.playNote = function (note, startTime, duration) {
        if (duration === void 0) { duration = 0.5; }
        if (typeof note !== 'string') {
            throw new TypeError('Expected a string for note');
        }
        if (typeof startTime !== 'number') {
            throw new TypeError('Expected a number for startTime');
        }
        if (typeof duration !== 'number') {
            throw new TypeError('Expected a number for duration');
        }
        var frequency = this.noteToFrequency(note);
        if (frequency) {
            this.playFrequency(frequency, startTime, duration);
        }
    };
    /**
     * Plays a chord consisting of multiple notes.
     * @param {string[]} notes - An array of musical notes to be played as a chord.
     * @param {number} [duration=1] - The duration in seconds for which each note in the chord should play.
     */
    MaestroWizard.prototype.playChord = function (notes, duration) {
        var _this = this;
        if (duration === void 0) { duration = 1; }
        if (!Array.isArray(notes)) {
            throw new TypeError('Expected an array of notes');
        }
        if (typeof duration !== 'number') {
            throw new TypeError('Expected a number for duration');
        }
        notes.forEach(function (note) {
            _this.playNote(note, duration);
        });
    };
    /**
     * Converts a musical note to its corresponding frequency.
     * @param {string} note - The musical note to convert (e.g., 'A4').
     * @returns {number} The frequency of the note in hertz.
     */
    MaestroWizard.prototype.noteToFrequency = function (note) {
        if (typeof note !== 'string') {
            throw new TypeError('Expected a string for note');
        }
        var A4 = 440;
        var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        // A map to convert flat notes to sharp notes
        var flatToSharp = {
            'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
        };
        var frenchToEnglish = {
            'Do': 'C', 'Ré': 'D', 'Mi': 'E', 'Fa': 'F', 'Sol': 'G', 'La': 'A', 'Si': 'B',
            'Ré#': 'D#', 'Mi#': 'E#', 'Fa#': 'F#', 'Sol#': 'G#', 'La#': 'A#',
            'Dob': 'Db', 'Réb': 'Eb', 'Mib': 'Eb', 'Fab': 'Fb', 'Solb': 'Gb', 'Lab': 'Ab', 'Sib': 'Bb'
        };
        // Convert French notes to English notes
        Object.keys(frenchToEnglish).forEach(function (frenchNote) {
            if (note.startsWith(frenchNote)) {
                note = note.replace(frenchNote, frenchToEnglish[frenchNote]);
            }
        });
        // Replace flat notes with their sharp equivalents
        if (note.includes("b")) { // Checks for notes like 'Eb4'
            var baseNote_1 = note.substring(0, 2); // Gets 'Eb'
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
     * Plays a frequency for a specified duration starting at a specified time.
     * @param {number} frequency - The frequency to play.
     * @param {number} startTime - The time at which to start playing the frequency.
     * @param {number} duration - The duration in seconds for which to play the frequency.
     * @private
     */
    MaestroWizard.prototype.playFrequency = function (frequency, startTime, duration) {
        if (typeof frequency !== 'number') {
            throw new TypeError('Expected a number for frequency');
        }
        if (typeof startTime !== 'number') {
            throw new TypeError('Expected a number for startTime');
        }
        if (typeof duration !== 'number') {
            throw new TypeError('Expected a number for duration');
        }
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = this.oscillatorType;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        var gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        // Apply attack envelope
        gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + startTime);
        oscillator.start(this.audioContext.currentTime + startTime);
        // Apply release envelope
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + startTime + duration);
        // Stop the oscillator after the specified duration
        oscillator.stop(this.audioContext.currentTime + startTime + duration);
    };
    /**
     * Plays a melody.
     * @param {string|string[]} melody - A string or an array of musical notes to be played in sequence.
     *                                  If a string is provided, notes should be separated by spaces or commas.
     * @param {number} [tempo=60] - The tempo of the melody in beats per minute.
     */
    MaestroWizard.prototype.playMelody = function (melody, tempo) {
        var _this = this;
        if (tempo === void 0) { tempo = 60; }
        if (typeof melody !== 'string' && !Array.isArray(melody)) {
            throw new TypeError('Expected a string or an array for melody');
        }
        if (typeof tempo !== 'number') {
            throw new TypeError('Expected a number for tempo');
        }
        // Check if melody is a string and split it into an array if it is
        if (typeof melody === 'string') {
            melody = melody.split(/,\s*|\s+/); // Splits on commas or spaces
        }
        var noteDuration = 60 / tempo;
        var currentTime = 0;
        var lastNote = null;
        var extendDuration = 0;
        melody.forEach(function (symbol) {
            if (symbol === '-') {
                extendDuration += noteDuration;
            }
            else {
                if (lastNote) {
                    _this.playNote(lastNote, currentTime, noteDuration + extendDuration);
                    currentTime += noteDuration + extendDuration;
                    extendDuration = 0;
                }
                lastNote = symbol;
            }
        });
        // Play the last note
        if (lastNote) {
            this.playNote(lastNote, currentTime, noteDuration + extendDuration);
        }
    };
    /**
     * Sets the oscillator type for sound generation.
     * @param {OscillatorType} type - The type of oscillator to use (e.g., 'sine', 'square').
     */
    MaestroWizard.prototype.setOscillatorType = function (type) {
        var validTypes = ['custom', 'sine', 'square', 'sawtooth', 'triangle'];
        if (typeof type !== 'string' || !validTypes.includes(type)) {
            throw new TypeError('Expected a string for oscillator type');
        }
        this.oscillatorType = type;
    };
    return MaestroWizard;
}());
exports.default = MaestroWizard;
