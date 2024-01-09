import SongCreator from "../src/songCreator.js";


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



// Play the song
songCreator.playSong();
