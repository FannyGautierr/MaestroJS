import StringMaestro from './src/maestro.js';

const maestro = new StringMaestro();

// Play a melody
maestro.playMelody(['C4', 'D4', 'E4', 'F4', 'G4'], 120); // Plays these notes in sequence at 120 BPM
