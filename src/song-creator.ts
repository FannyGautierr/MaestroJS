type NoteObject = {
  note: string;
  duration: number;
};

type ActiveNode = {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

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
  private audioContext: AudioContext;
  private oscillatorType: OscillatorType;
  private sequences: Sequence[];
  private songDuration: number;
  private tracks: Track[];

  /**
   * Constructs a new SongCreator instance.
   */
  constructor() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
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
    this.tracks = []
  }

  /**
   * Adds a new sequence to the song.
   * @param {Array<Object>} noteObjects - An array of note objects to be played in the sequence.
   * @param {Object} [options={}] - The options for the sequence.
   * @param {boolean} [options.loop=false] - Whether the sequence should loop.
   * @param {boolean} [options.distortion=false] - Whether to apply distortion to the sequence.
   */
  addSequence(noteObjects: NoteObject[], {loop = false, distortion = false} = {}) {

    if (!Array.isArray(noteObjects) || noteObjects.length === 0) {
      throw new Error('Invalid noteObjects: Must be a non-empty array.');
    }

    this.sequences.push({'notes': noteObjects, 'loop': loop, 'distortion': distortion, 'activeNodes': []});
  }

  /**
   * Plays a specific sequence.
   * @param {Object} sequence - The sequence to play.
   * @param {AudioContext} audioContext - The audio context to use for playing the sequence.
   */
  playSequence(sequence: Sequence, audioContext: AudioContext) {
    try {
      if (!sequence || !Array.isArray(sequence.notes)) {
        throw new Error('Invalid sequence: Must contain an array of notes.');
      }
      if (!sequence.activeNodes) {
        sequence.activeNodes = [];
      }

      const scheduleSequence = (startTime: number) => {
        sequence.notes.forEach(noteObject => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

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

          const noteEndTime = startTime + noteObject.duration;

          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(1, startTime + attackTime);
          gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
          gainNode.gain.setValueAtTime(sustainLevel, noteEndTime);
          gainNode.gain.linearRampToValueAtTime(0, noteEndTime + releaseTime);

          sequence.activeNodes.push({oscillator, gainNode});

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
    } catch (error) {
      throw new Error('Failed to play sequence')
    }
  }

  /**
   * Converts a musical note to its corresponding frequency.
   * @param {string} note - The musical note to convert.
   * @returns {number} The frequency of the note.
   */
  noteToFrequency(note: string): number {
    if (!/^[A-G][#b]?[0-8]$/.test(note)) {
      throw new Error('Invalid note format. Expected format like "A4", "C#3", or "Bb2".');
    }
    const A4 = 440;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const flatToSharp: Record<string, string> = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };

    if (note.includes("b")) {
      let baseNote = note.substring(0, 2);
      const octave = parseInt(note.charAt(2), 10);
      baseNote = flatToSharp[baseNote] || baseNote;
      note = baseNote + octave;
    }

    const baseNote = note.slice(0, -1);
    const octave = parseInt(note.slice(-1), 10);
    const semitones = notes.indexOf(baseNote) - notes.indexOf('A') + (octave - 4) * 12;
    return A4 * Math.pow(2, semitones / 12);
  }

  /**
   * Creates a distortion effect.
   * @param {AudioContext} audioContext - The audio context to use for the distortion.
   * @returns {WaveShaperNode} The created distortion node.
   */
  createDistortion(audioContext: AudioContext): WaveShaperNode {
    const distortion = audioContext.createWaveShaper();

    function makeDistortionCurve(amount: number | undefined) {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);


      for (let i = 0; i < n_samples; ++i) {
        const x = i * 2 / n_samples - 1;
        curve[i] = x / (1 + Math.abs(k * x));
      }

      return curve;
    }

    try {
      distortion.curve = makeDistortionCurve(200);
      distortion.oversample = '4x';

      return distortion;
    } catch (error) {
      throw new TypeError('Failed to create distortion')
    }
  }

  /**
   * Plays all sequences in the song.
   */
  play() {
    this.sequences.forEach(sequence => {
      this.playSequence(sequence, this.audioContext);
    });
  }

  /**
   * Adds a track with specified start and end times.
   * @param {number} startTime - The start time of the track in seconds.
   * @param {number} endTime - The end time of the track in seconds.
   * @return {number} The index of the newly added track.
   */
  addTimedTrack(startTime: number | undefined, endTime: number | undefined): number {
    if (typeof startTime !== 'number' || typeof endTime !== 'number') {
      throw new Error('Invalid start or end time: Must be a number.');
    }

    const newTrack = {
      sequences: [],
      startTime: startTime,
      endTime: endTime
    };
    this.tracks.push(newTrack);
    return this.tracks.length - 1;
  }

  /**
   * Schedules and plays the entire song with all tracks and their sequences.
   */
  playSong() {
    this.tracks.forEach(track => {
      const trackStartDelay = track.startTime * 1000;
      const trackEndDelay = track.endTime * 1000;

      setTimeout(() => {
        this.playTrack(track);
      }, trackStartDelay);

      setTimeout(() => {
        this.stopTrack(track);
      }, trackEndDelay);
    });
  }

  /**
   * Stops all sequences in a track.
   * @param {Object} track - The track to stop.
   */
  stopTrack(track: Track) {
    track.sequences.forEach(sequence => {
      sequence.activeNodes.forEach(({oscillator}) => {
        try {
          oscillator.stop();
        } catch (error) {
          console.error('Error stopping oscillator:', error);
        }


      });

      sequence.activeNodes = [];
    });
  }

  /**
   * Plays a single track.
   * @param {Object} track - The track to play.
   */
  playTrack(track: Track) {
    try {
      if (!track || !Array.isArray(track.sequences)) {
        throw new Error('Invalid track: Must contain an array of sequences.');
      }
      const trackStartTime = track.startTime * 1000;

      track.sequences.forEach(sequence => {
        const sequenceStartTime = (sequence.startTime ?? 0) * 1000;
        const delay = sequenceStartTime - trackStartTime;

        setTimeout(() => {
          this.playSequence(sequence, this.audioContext);
        }, delay);
      });
    } catch (error) {
      throw new TypeError('Failed to play track')
    }
  }


  /**
   * Adds a sequence with specific configurations to a track.
   * @param {number} trackIndex - The index of the track.
   * @param {Array<Object>} noteObjects - An array of note objects to be played.
   * @param {Object} options - The options for the sequence (start time, end time, loop, distortion).
   */
  addSequenceToTrack(trackIndex: number, noteObjects: NoteObject[], options: Options) {
    if (!this.tracks[trackIndex]) {
      throw new Error(`Track with index ${trackIndex} does not exist.`);
    }
    if (!Array.isArray(noteObjects) || noteObjects.length === 0) {
      throw new Error('Invalid noteObjects: Must be a non-empty array.');
    }

    const track = this.tracks[trackIndex];
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
  }

}
