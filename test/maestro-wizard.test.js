/**
 * @jest-environment jsdom
 */

import MaestroWizard from "../dist/maestro-wizard.js";

// Mock AudioContext
const mockOscillator = {
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  type: '',
  frequency: {
    setValueAtTime: jest.fn(),
  },
};
const mockGainNode = {
  connect: jest.fn(),
  gain: {
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
  },
};

global.AudioContext = jest.fn().mockImplementation(() => {
  return {
    createOscillator: jest.fn().mockReturnValue(mockOscillator),
    createGain: jest.fn().mockReturnValue(mockGainNode),
    currentTime: 0,
    destination: {},
  };
});

const maestro = new MaestroWizard();

test('playNote', () => {
  expect(() => maestro.playNote(1, 0, 1)).toThrow(TypeError);
  expect(() => maestro.playNote('A4', '0', 1)).toThrow(TypeError);
  expect(() => maestro.playNote('A4', 0, '1')).toThrow(TypeError);

  maestro.playNote('A4', 0, 1);
  expect(maestro.audioContext.createOscillator).toHaveBeenCalled();
  expect(maestro.audioContext.createGain).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createGain().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().start).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().stop).toHaveBeenCalled();
});

test('noteToFrequency', () => {
  expect(() => maestro.noteToFrequency(1)).toThrow(TypeError);

  expect(Math.round(maestro.noteToFrequency('A4'))).toBe(440);
  expect(Math.round(maestro.noteToFrequency('C4'))).toBe(262);
  expect(Math.round(maestro.noteToFrequency('A5'))).toBe(880);
  expect(Math.round(maestro.noteToFrequency('Ré4'))).toBe(294);
  expect(Math.round(maestro.noteToFrequency('F#5'))).toBe(740);
  expect(Math.round(maestro.noteToFrequency('Eb4'))).toBe(311);
});

test('setOscillatorType', () => {
  expect(() => maestro.setOscillatorType(1)).toThrow(TypeError);

  maestro.setOscillatorType('sawtooth');
  expect(maestro.oscillatorType).toBe('sawtooth');
});

test('playFrequency', () => {
  expect(() => maestro.playFrequency('A4', 0, 1)).toThrow(TypeError);
  expect(() => maestro.playFrequency(440, '0', 1)).toThrow(TypeError);
  expect(() => maestro.playFrequency(440, 0, '1')).toThrow(TypeError);

  maestro.playFrequency(440, 0, 1);
  expect(maestro.audioContext.createOscillator).toHaveBeenCalled();
  expect(maestro.audioContext.createGain).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createGain().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().start).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().stop).toHaveBeenCalled();
});

test('playMelody', () => {
  expect(() => maestro.playMelody(1)).toThrow(TypeError);
  expect(() => maestro.playMelody('A4', '60')).toThrow(TypeError);

  maestro.playMelody('A4', 60);
  expect(maestro.audioContext.createOscillator).toHaveBeenCalled();
  expect(maestro.audioContext.createGain).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createGain().connect).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().start).toHaveBeenCalled();
  expect(maestro.audioContext.createOscillator().stop).toHaveBeenCalled();
});
