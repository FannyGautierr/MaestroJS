declare global {
    interface Window {
        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
    }
}
/**
 * Represents a music player that can play notes, chords, and melodies.
 */
export default class MaestroWizard {
    private audioContext;
    private oscillatorType;
    /**
     * Creates a StringMaestroJS instance.
     */
    constructor();
    /**
     * Plays a single musical note.
     * @param {string} note - The musical note to play (e.g., 'C4').
     * @param {number} startTime - The time at which the note should start playing.
     * @param {number} [duration=0.5] - The duration in seconds for which the note should play.
     */
    playNote(note: string, startTime: number, duration?: number): void;
    /**
     * Plays a chord consisting of multiple notes.
     * @param {string[]} notes - An array of musical notes to be played as a chord.
     * @param {number} [duration=1] - The duration in seconds for which each note in the chord should play.
     */
    playChord(notes: string[], duration?: number): void;
    /**
     * Converts a musical note to its corresponding frequency.
     * @param {string} note - The musical note to convert (e.g., 'A4').
     * @returns {number} The frequency of the note in hertz.
     */
    noteToFrequency(note: string): number;
    /**
     * Plays a frequency for a specified duration starting at a specified time.
     * @param {number} frequency - The frequency to play.
     * @param {number} startTime - The time at which to start playing the frequency.
     * @param {number} duration - The duration in seconds for which to play the frequency.
     * @private
     */
    playFrequency(frequency: number, startTime: number, duration: number): void;
    /**
     * Plays a melody.
     * @param {string|string[]} melody - A string or an array of musical notes to be played in sequence.
     *                                  If a string is provided, notes should be separated by spaces or commas.
     * @param {number} [tempo=60] - The tempo of the melody in beats per minute.
     */
    playMelody(melody: string | string[], tempo?: number): void;
    /**
     * Sets the oscillator type for sound generation.
     * @param {OscillatorType} type - The type of oscillator to use (e.g., 'sine', 'square').
     */
    setOscillatorType(type: OscillatorType): void;
}
