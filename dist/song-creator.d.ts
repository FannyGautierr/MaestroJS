type NoteObject = {
    note: string;
    duration: number;
};
type ActiveNode = {
    oscillator: OscillatorNode;
    gainNode: GainNode;
};
type Sequence = {
    notes: NoteObject[];
    loop: boolean;
    distortion: boolean;
    activeNodes: ActiveNode[];
    startTime?: number;
    endTime?: number;
};
type Track = {
    sequences: Sequence[];
    startTime: number;
    endTime: number;
};
type Options = {
    loop?: boolean;
    distortion?: boolean;
    startTime?: number;
    endTime?: number;
};
/**
 * Represents a song creator with methods to manage audio sequences.
 */
export default class SongCreator {
    private audioContext;
    private oscillatorType;
    private sequences;
    private songDuration;
    private tracks;
    /**
     * Constructs a new SongCreator instance.
     */
    constructor();
    /**
     * Adds a new sequence to the song.
     * @param {Array<Object>} noteObjects - An array of note objects to be played in the sequence.
     * @param {Object} [options={}] - The options for the sequence.
     * @param {boolean} [options.loop=false] - Whether the sequence should loop.
     * @param {boolean} [options.distortion=false] - Whether to apply distortion to the sequence.
     */
    addSequence(noteObjects: NoteObject[], { loop, distortion }?: {
        loop?: boolean | undefined;
        distortion?: boolean | undefined;
    }): void;
    /**
     * Plays a specific sequence.
     * @param {Object} sequence - The sequence to play.
     * @param {AudioContext} audioContext - The audio context to use for playing the sequence.
     */
    playSequence(sequence: Sequence, audioContext: AudioContext): void;
    /**
     * Converts a musical note to its corresponding frequency.
     * @param {string} note - The musical note to convert.
     * @returns {number} The frequency of the note.
     */
    noteToFrequency(note: string): number;
    /**
     * Creates a distortion effect.
     * @param {AudioContext} audioContext - The audio context to use for the distortion.
     * @returns {WaveShaperNode} The created distortion node.
     */
    createDistortion(audioContext: AudioContext): WaveShaperNode;
    /**
     * Plays all sequences in the song.
     */
    play(): void;
    /**
     * Adds a track with specified start and end times.
     * @param {number} startTime - The start time of the track in seconds.
     * @param {number} endTime - The end time of the track in seconds.
     * @return {number} The index of the newly added track.
     */
    addTimedTrack(startTime: number | undefined, endTime: number | undefined): number;
    /**
     * Schedules and plays the entire song with all tracks and their sequences.
     */
    playSong(): void;
    /**
     * Stops all sequences in a track.
     * @param {Object} track - The track to stop.
     */
    stopTrack(track: Track): void;
    /**
     * Plays a single track.
     * @param {Object} track - The track to play.
     */
    playTrack(track: Track): void;
    /**
     * Adds a sequence with specific configurations to a track.
     * @param {number} trackIndex - The index of the track.
     * @param {Array<Object>} noteObjects - An array of note objects to be played.
     * @param {Object} options - The options for the sequence (start time, end time, loop, distortion).
     */
    addSequenceToTrack(trackIndex: number, noteObjects: NoteObject[], options: Options): void;
}
export {};
