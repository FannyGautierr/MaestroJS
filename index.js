import StringMaestro from './src/maestro.js';

const maestro = new StringMaestro();

const maryHadALittleLamb = [
  'E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4',
  'D4', 'D4', 'D4', 'E4', 'G4', 'G4',
  'E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'E4',
  'D4', 'D4', 'E4', 'D4', 'C4'
];

const auClairDeLaLune = [
  'C4', 'C4', 'C4', 'D4', 'E4', '-', 'D4', '-',
  'C4', 'E4', 'D4', 'D4', 'C4', '-'
  // Repeat or continue the song as needed
];

const starWarsTheme = [
  'G4', 'G4', 'G4', 'Eb4', 'Bb4', '-', 'G4',
  'Eb4', 'Bb4', '-', 'G4', 'D5', '-', '-', 'D5', '-', '-',
  'C5', '-', 'B4', '-', 'A4', 'G5', '-', '-', 'Eb5', 'Eb5', 'Eb5',
  'F5', 'D5', '-', '-', 'C5', '-', 'B4', '-', 'A4', 'G5', '-', '-',
  'Eb5', 'Eb5', 'Eb5', 'F5', 'D5', '-', '-', 'C5', '-', 'B4', '-',
  'C5', '-', 'A4', '-', '-',
  // Repeat or continue as needed
];

const imperialMarch = [
  'G4', 'G4', 'G4', 'Eb4', 'Bb4', 'G4',
  'Eb4', 'Bb4', 'G4', 'D5', 'D5', 'D5',
  'Eb5', 'Bb4', 'Gb4', 'Eb4', 'Bb4', '-', 'F4', 'F4', 'F4',
  'Eb4', 'Bb4', 'G4', 'Eb4', 'Bb4', 'G4'
];

// Play a melody
maestro.playMelody(imperialMarch.join(' '), 120); // Plays these notes in sequence at 120 BPM
