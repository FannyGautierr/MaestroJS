# MaestroWizardJS

MaestroWizardJS is a versatile JavaScript library for web-based music applications, enabling you to effortlessly play notes, chords, and melodies directly in the browser. It leverages the Web Audio API to generate sound, providing a simple yet powerful interface for music programming.

## Features

- **Play Individual Notes**: Easily play single musical notes.
- **Chord Support**: Combine multiple notes to play chords.
- **Melody Playback**: Sequence notes to create and play melodies.
- **Frequency Conversion**: Convert musical notes to their corresponding frequencies.
- **Customizable Oscillator**: Choose from various waveforms for sound synthesis.

## Installation

```bash
npm install maestro-wizard
```

## Usage of MaestroWizard - play simple notes and melodies

First, import `MaestroWizard` into your project:

```javascript
import MaestroWizard from 'maestro-wizard';
```

Then, create a new instance of `MaestroWizard`:

```javascript
const maestro = new MaestroWizard();
```

### Playing a note

```javascript
maestro.play('C4', 0, 0.5);
```

### Play a melody

Use a dash (`-`) to indicate holding the previous note for an additional beat. Use a period (`.`) to represent a rest, where no note is played.

```javascript
maestro.playMelody(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], 120);
```

### API

#### `play(note, startTime, duration)`
Plays a single note.

- `note`: The note to play. Can be a string or a number.
- `startTime`: The time, in seconds, at which to play the note.
- `duration`: The duration, in seconds, of the note.

#### `playChord(notes, duration)`
Plays a chord.

- `notes`: An array of notes to play. Can be an array of strings or numbers.
- `duration`: The duration, in seconds, of the chord.

#### `playMelody(notes, tempo)`
Plays a melody.

- `notes`: An array of notes to play, or a string of space-separated notes.
- `tempo`: The tempo, in beats per minute, of the melody.

#### `setOscillatorType(type)`
Sets the oscillator type.

- `type`: The oscillator type. Can be one of the following: `'sine'`, `'square'`, `'sawtooth'`, `'triangle'`, `'custom'`.



## SongCreator - create tracks by overlaping melodies and tracks 

First, import `SongCreator` into your project:

```javascript
import SongCreator from 'songCreator';
```

Then, create a new instance of `SongCreator`:

```javascript
const maestro = new SongCreator();
```

### Methods

#### addSequence

- `addSequence(noteObjects, options)`: Adds a new sequence to the song.
  - `noteObjects` (Array<Object>): An array of note objects to be played in the sequence.
  - `options` (Object): Optional settings for the sequence including `loop` and `distortion`.

#### playSequence

- `playSequence(sequence, audioContext)`: Plays a specific sequence.
  - `sequence` (Object): The sequence to play.
  - `audioContext` (AudioContext): The audio context to use for playing the sequence.

#### noteToFrequency

- `noteToFrequency(note)`: Converts a musical note to its corresponding frequency.
  - `note` (string): The musical note to convert.

#### createDistortion

- `createDistortion(audioContext)`: Creates a distortion effect.
  - `audioContext` (AudioContext): The audio context for the distortion.

#### play

- `play()`: Plays all sequences in the song.

#### addTimedTrack

- `addTimedTrack(startTime, endTime)`: Adds a track with specified start and end times.
  - `startTime` (number): The start time of the track in seconds.
  - `endTime` (number): The end time of the track in seconds.

#### playSong

- `playSong()`: Schedules and plays the entire song with all tracks and their sequences.

#### stopTrack

- `stopTrack(track)`: Stops all sequences in a track.
    - `track` (Object): The track to stop.

#### playTrack

- `playTrack(track)`: Plays a single track.
  - `track` (Object): The track to play.

#### addSequenceToTrack

- `addSequenceToTrack(trackIndex, noteObjects, options)`: Adds a sequence with specific configurations to a track.
  - `trackIndex` (number): The index of the track.
  - `noteObjects` (Array<Object>): An array of note objects to be played.
  - `options` (Object): The options for the sequence (start time, end time, loop, distortion).


## License
MaestroWizardJS is open-source and available under the MIT License.