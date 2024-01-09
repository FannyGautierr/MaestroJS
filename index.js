import SongCreator from "../src/songCreator.js";

const maestro = new StringMaestro();
maestro.setOscillatorType('sawtooth')

let songCreator = new SongCreator();


let trackIndex = songCreator.addTimedTrack(0, 20); 



let bassNotes = [
  { note: 'C2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'E2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'C2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'E2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'C2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'E2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'C2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'E2', duration: 1 },
  { note: 'G2', duration: 1 },
  { note: 'G2', duration: 1 },

];
let melodyNotes = [        
  { note: 'A4', duration: 0.5 },
  { note: 'G4', duration: 0.25 },
  { note: 'A4', duration: 0.25 },
  { note: 'D5', duration: 0.5 },
  { note: 'C5', duration: 1 },
  { note: 'A4', duration: 1 },
  { note: 'G4', duration: 1 },
  { note: 'F4', duration: 1 },
  { note: 'D4', duration: 0.5 }
]


const kungFuFightingMelody = [
  { note: 'A4', duration: 0.2 },
  { note: 'G4', duration: 0.2 },
  { note: 'A4', duration: 0.2 },
  { note: 'D5', duration: 0.2 },
  { note: 'C5', duration: 0.2 },
  { note: 'A4', duration: 0.2 },
  { note: 'G4', duration: 0.2 },
  { note: 'F4', duration: 0.2 },
  { note: 'D4', duration: 0.2 },
  { note: 'D4', duration: 0.2 },

];

songCreator.addSequenceToTrack(trackIndex, bassNotes, { 
    startTime: 0, 
    endTime: 10, 
    loop: false, 
    distortion: false 
});

songCreator.addSequenceToTrack(trackIndex, kungFuFightingMelody, { 
  startTime: 10, 
  endTime: 20, 
  loop: false, 
  distortion: true
});


const kungFuFighting = [
  'A4','A4','A4','B4','D5','-', "F#5", "-", "-", "E5", "-", "-", "E5", "-", "-", "F#5",
  '.', '.', '.', '.', '.',
  'B5', "-", "-", "A5", "-", "A5", "-", "F#5", "-", "-", "E5", "-", "-", "E5", "-", "-", "D5",
  '.', '.', '.', '.', '.',
  'A4','-','B4','D5','-', "F#5", "-", "-", "E5", "-", "-", "E5", "-", "-", "F#5",
]

// Play a melody
maestro.playMelody(kungFuFighting, 450); // Plays these notes in sequence at 120 BPM
