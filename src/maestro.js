export default class StringMaestroJS {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillatorType = 'sine'; // Default oscillator type
  }

  playNote(note, startTime, duration = 0.5) {
    const frequency = this.noteToFrequency(note);
    if (frequency) {
      this.playFrequency(frequency, startTime, duration);
    }
  }

  playChord(notes, duration = 1) {
    notes.forEach(note => {
      this.playNote(note, duration);
    });
  }

  noteToFrequency(note) {
    // Mapping of note names to their frequency multipliers relative to C0
    const noteFrequencies = {
      'C': 16.35, 'C#': 17.32, 'Db': 17.32, 'D': 18.35, 'D#': 19.45, 'Eb': 19.45,
      'E': 20.60, 'F': 21.83, 'F#': 23.12, 'Gb': 23.12, 'G': 24.50, 'G#': 25.96, 'Ab': 25.96,
      'A': 27.50, 'A#': 29.14, 'Bb': 29.14, 'B': 30.87
    };

    const [parsedNote, octave] = /^([A-Ga-g#b]+)(\d)$/.exec(note).slice(1);
    const frequency = noteFrequencies[parsedNote.toUpperCase()] * Math.pow(2, octave);
    return frequency;
  }

  playFrequency(frequency, startTime, duration) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = this.oscillatorType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime + startTime);
    oscillator.stop(this.audioContext.currentTime + startTime + duration);
  }

  playMelody(melody, tempo = 60) {
    const noteDuration = 60 / tempo; // Duration of a quarter note in seconds
    let currentTime = 0;

    melody.forEach(note => {
      this.playNote(note, currentTime, noteDuration);
      currentTime += noteDuration;
    });
  }

  setOscillatorType(type) {
    this.oscillatorType = type;
  }
}