/**
 * Represents a song creator with methods to manage audio sequences.
 */
export default class SongCreator {
    /**
     * Constructs a new SongCreator instance.
     */
    constructor() {
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
    }
    /**
     * Adds a new sequence to the song.
     * @param {Array<Object>} noteObjects - An array of note objects to be played in the sequence.
     * @param {Object} [options={}] - The options for the sequence.
     * @param {boolean} [options.loop=false] - Whether the sequence should loop.
     * @param {boolean} [options.distortion=false] - Whether to apply distortion to the sequence.
     */
    addSequence(noteObjects, { loop = false, distortion = false } = {}) {

        if (!Array.isArray(noteObjects) || noteObjects.length === 0) {
            throw new Error('Invalid noteObjects: Must be a non-empty array.');
        }

        this.sequences.push({ 'notes': noteObjects, 'loop': loop, 'distortion': distortion });
    }

    /**
     * Plays a specific sequence.
     * @param {Object} sequence - The sequence to play.
     * @param {AudioContext} audioContext - The audio context to use for playing the sequence.
     */
    playSequence(sequence, audioContext) {
        const scheduleSequence = (startTime) => {
            sequence.notes.forEach(noteObject => {
                let oscillator = audioContext.createOscillator();
                let gainNode = audioContext.createGain();

                oscillator.frequency.value = this.noteToFrequency(noteObject.note);
                oscillator.type = this.oscillatorType;

                const attackTime = 0.2;
                const decayTime = 0.1;
                const sustainLevel = 0.7;
                const releaseTime = 0.5;

                oscillator.connect(gainNode);
                if (sequence.distortion) {
                    const distortionNode = this.createDistortion(audioContext);
                    gainNode.connect(distortionNode);
                    distortionNode.connect(audioContext.destination);
                } else {
                    gainNode.connect(audioContext.destination);
                }

                let noteEndTime = startTime + noteObject.duration;

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(1, startTime + attackTime); // Attack
                gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime); // Decay to Sustain
                gainNode.gain.setValueAtTime(sustainLevel, noteEndTime); // Sustain
                gainNode.gain.linearRampToValueAtTime(0, noteEndTime + releaseTime); // Release

                oscillator.start(startTime);
                oscillator.stop(noteEndTime + releaseTime);


                startTime = noteEndTime + releaseTime;
            });

            if (sequence.loop) {
                const sequenceDuration = sequence.notes.reduce((total, noteObject) => total + noteObject.duration, 0);
                setTimeout(() => scheduleSequence(audioContext.currentTime), sequenceDuration * 1000);
            }
        };

        scheduleSequence(audioContext.currentTime);
    }

    /**
     * Converts a musical note to its corresponding frequency.
     * @param {string} note - The musical note to convert.
     * @returns {number} The frequency of the note.
     */
    // noteToFrequency(note) {

    //     const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


    //     const noteRegex = /([A-G]#?)(\d+)/;
    //     const match = note.match(noteRegex);
    //     const baseNote = match[1];
    //     const octave = parseInt(match[2], 10);

    //     const noteIndex = notes.indexOf(baseNote);

    //     const keyNumber = noteIndex + (octave + 1) * 12;

    //     const refKey = 49;


    //     return 440 * Math.pow(2, (keyNumber - refKey) / 12);
    // }
    noteToFrequency(note) {
        const A4 = 440;
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
        // A map to convert flat notes to sharp notes
        const flatToSharp = {
          'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
        };
    
        // Replace flat notes with their sharp equivalents
        if (note.includes("b")) {  // Checks for notes like 'Eb4'
          let baseNote = note.substring(0, 2);  
          let octave = parseInt(note.charAt(2), 10);
          baseNote = flatToSharp[baseNote] || baseNote;
          note = baseNote + octave;
        }
    
        let baseNote = note.slice(0, -1);
        let octave = parseInt(note.slice(-1), 10);
        let semitones = notes.indexOf(baseNote) - notes.indexOf('A') + (octave - 4) * 12;
        return A4 * Math.pow(2, semitones / 12);
      }
    /**
     * Creates a distortion effect.
     * @param {AudioContext} audioContext - The audio context to use for the distortion.
     * @returns {WaveShaperNode} The created distortion node.
     */
    createDistortion(audioContext){
        const distortion = audioContext.createWaveShaper();
        function makeDistortionCurve(amount) {
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;

            for (let i = 0; i < n_samples; ++i ) {
                const x = i * 2 / n_samples - 1;
                curve[i] = x / (1 + Math.abs(k * x));
            }

            return curve;
        }

        distortion.curve = makeDistortionCurve(200);
        distortion.oversample = '4x';

        return distortion;
    }
    /**
     * Plays all sequences in the song.
     */
    play() {
        this.sequences.forEach(sequence => {
            this.playSequence(sequence, this.audioContext);
        });
    }
}
