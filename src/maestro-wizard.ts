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
  private audioContext: AudioContext;
  private oscillatorType: OscillatorType;

  /**
   * Creates a StringMaestroJS instance.
   */
  constructor() {
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
  playNote(note: string, startTime: number, duration: number = 0.5) {
    if (typeof note !== 'string') {
      throw new TypeError('Expected a string for note');
    }
    if (typeof startTime !== 'number') {
      throw new TypeError('Expected a number for startTime');
    }
    if (typeof duration !== 'number') {
      throw new TypeError('Expected a number for duration');
    }

    const frequency = this.noteToFrequency(note);
    if (frequency) {
      this.playFrequency(frequency, startTime, duration);
    }
  }

  /**
   * Plays a chord consisting of multiple notes.
   * @param {string[]} notes - An array of musical notes to be played as a chord.
   * @param {number} [duration=1] - The duration in seconds for which each note in the chord should play.
   */
  playChord(notes: string[], duration = 1) {
    if (!Array.isArray(notes)) {
      throw new TypeError('Expected an array of notes');
    }
    if (typeof duration !== 'number') {
      throw new TypeError('Expected a number for duration');
    }

    notes.forEach(note => {
      this.playNote(note, duration);
    });
  }

  /**
   * Converts a musical note to its corresponding frequency.
   * @param {string} note - The musical note to convert (e.g., 'A4').
   * @returns {number} The frequency of the note in hertz.
   */
  noteToFrequency(note: string): number {
    if (typeof note !== 'string') {
      throw new TypeError('Expected a string for note');
    }

    const A4 = 440;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // A map to convert flat notes to sharp notes
    const flatToSharp: Record<string, string> = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };

    const frenchToEnglish: Record<string, string> = {
      'Do': 'C', 'Ré': 'D', 'Mi': 'E', 'Fa': 'F', 'Sol': 'G', 'La': 'A', 'Si': 'B',
      'Ré#': 'D#', 'Mi#': 'E#', 'Fa#': 'F#', 'Sol#': 'G#', 'La#': 'A#',
      'Dob': 'Db', 'Réb': 'Eb', 'Mib': 'Eb', 'Fab': 'Fb', 'Solb': 'Gb', 'Lab': 'Ab', 'Sib': 'Bb'
    };

    // Convert French notes to English notes
    Object.keys(frenchToEnglish).forEach(frenchNote => {
      if (note.startsWith(frenchNote)) {
        note = note.replace(frenchNote, frenchToEnglish[frenchNote]);
      }
    });

    // Replace flat notes with their sharp equivalents
    if (note.includes("b")) {  // Checks for notes like 'Eb4'
      let baseNote = note.substring(0, 2);  // Gets 'Eb'
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
   * Plays a frequency for a specified duration starting at a specified time.
   * @param {number} frequency - The frequency to play.
   * @param {number} startTime - The time at which to start playing the frequency.
   * @param {number} duration - The duration in seconds for which to play the frequency.
   * @private
   */
  playFrequency(frequency: number, startTime: number, duration: number) {
    if (typeof frequency !== 'number') {
      throw new TypeError('Expected a number for frequency');
    }
    if (typeof startTime !== 'number') {
      throw new TypeError('Expected a number for startTime');
    }
    if (typeof duration !== 'number') {
      throw new TypeError('Expected a number for duration');
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = this.oscillatorType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const gainNode = this.audioContext.createGain();
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
  }

  /**
   * Plays a melody.
   * @param {string|string[]} melody - A string or an array of musical notes to be played in sequence.
   *                                  If a string is provided, notes should be separated by spaces or commas.
   * @param {number} [tempo=60] - The tempo of the melody in beats per minute.
   */
  playMelody(melody: string | string[], tempo: number = 60) {
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

    const noteDuration = 60 / tempo;
    let currentTime = 0;
    let lastNote: string | null = null;
    let extendDuration = 0;

    melody.forEach(symbol => {
      if (symbol === '-') {
        extendDuration += noteDuration;
      } else {
        if (lastNote) {
          this.playNote(lastNote, currentTime, noteDuration + extendDuration);
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
  }

  /**
   * Sets the oscillator type for sound generation.
   * @param {OscillatorType} type - The type of oscillator to use (e.g., 'sine', 'square').
   */
  setOscillatorType(type: OscillatorType) {
    const validTypes = ['custom', 'sine', 'square', 'sawtooth', 'triangle'];
    if (typeof type !== 'string' || !validTypes.includes(type)) {
      throw new TypeError('Expected a string for oscillator type');
    }

    this.oscillatorType = type;
  }
}