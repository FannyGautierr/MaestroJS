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

## Usage

First, import `MaestroWizard` into your project:

```javascript
import MaestroWizard from 'maestro-wizard';
```

Then, create a new instance of `MaestroWizard`:

```javascript
const maestro = new MaestroWizard();
```

## Playing a note

```javascript
maestro.play('C4', 0, 0.5);
```

## Play a melody

Use a dash (`-`) to indicate holding the previous note for an additional beat. Use a period (`.`) to represent a rest, where no note is played.

```javascript
maestro.playMelody(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], 120);
```

## API

### `play(note, startTime, duration)`
Plays a single note.

- `note`: The note to play. Can be a string or a number.
- `startTime`: The time, in seconds, at which to play the note.
- `duration`: The duration, in seconds, of the note.

### `playChord(notes, duration)`
Plays a chord.

- `notes`: An array of notes to play. Can be an array of strings or numbers.
- `duration`: The duration, in seconds, of the chord.

### `playMelody(notes, tempo)`
Plays a melody.

- `notes`: An array of notes to play, or a string of space-separated notes.
- `tempo`: The tempo, in beats per minute, of the melody.

## `setOscillatorType(type)`
Sets the oscillator type.

- `type`: The oscillator type. Can be one of the following: `'sine'`, `'square'`, `'sawtooth'`, `'triangle'`, `'custom'`.

## License
MaestroWizardJS is open-source and available under the MIT License.