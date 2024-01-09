/**
 * @jest-environment jsdom
 */

 import SongCreator from "../src/songCreator.js";

//  // Mock AudioContext
//  const mockOscillator = {
//      connect: jest.fn(),
//      start: jest.fn(),
//      stop: jest.fn(),
//      type: '',
//      frequency: {
//          setValueAtTime: jest.fn(),
//      },
//  };
//  const mockGainNode = {
//      connect: jest.fn(),
//      gain: {
//          setValueAtTime: jest.fn(),
//          linearRampToValueAtTime: jest.fn(),
//      },
//  };
 
//  global.AudioContext = jest.fn().mockImplementation(() => {
//      return {
//          createOscillator: jest.fn().mockReturnValue(mockOscillator),
//          createGain: jest.fn().mockReturnValue(mockGainNode),
//          currentTime: 0,
//          destination: {},
//      };
//  });

// Mock AudioContext
window.AudioContext = jest.fn().mockImplementation(() => {
    return {
      createOscillator: jest.fn().mockImplementation(() => {
        return {
          frequency: { value: 0 },
          type: '',
          connect: jest.fn(),
          start: jest.fn(),
          stop: jest.fn()
        };
      }),
      createGain: jest.fn().mockImplementation(() => {
        return {
          gain: {
            setValueAtTime: jest.fn(),
            linearRampToValueAtTime: jest.fn()
          },
          connect: jest.fn()
        };
      }),
      createWaveShaper: jest.fn().mockImplementation(() => {
        return {
          curve: null,
          oversample: '',
        };
      }),
      currentTime: 0,
      destination: {}
    };
  });
  
 
// test('send correct notes', () => {
//     expect(
//         song.addSequence([
//     ],
//     {loop:false,distortion:true})).toThrow(TypeError);
// });

describe('SongCreator', () => {
    it('should create a new instance with default values', () => {
        const songCreator = new SongCreator();
        // Check for a standard mocked method
        expect(typeof songCreator.audioContext.createOscillator).toBe('function');
        expect(songCreator.oscillatorType).toBe('sine');
        expect(songCreator.sequences).toEqual([]);
        expect(songCreator.songDuration).toBe(0);
    });
});

describe('addSequence', () => {
    let songCreator;
    beforeEach(() => {
        songCreator = new SongCreator();
    });

    it('should add a valid sequence', () => {
        const noteObjects = [{ note: 'A4', duration: 1 }];
        songCreator.addSequence(noteObjects);
        expect(songCreator.sequences.length).toBe(1);
        expect(songCreator.sequences[0].notes).toBe(noteObjects);
    });

    it('should throw an error for an empty sequence array', () => {
        expect(() => songCreator.addSequence([])).toThrow('Invalid noteObjects: Must be a non-empty array.');
    });

    it('should throw an error for a non-array sequence', () => {
        expect(() => songCreator.addSequence(null)).toThrow('Invalid noteObjects: Must be a non-empty array.');
    });
});

describe('playSequence', () => {
    it('should play a given sequence', () => {
        const songCreator = new SongCreator();
        const sequence = { notes: [{ note: 'C4', duration: 1 }], loop: false, distortion: false };
        const mockAudioContext = new AudioContext();

        songCreator.playSequence(sequence, mockAudioContext);
    });
});

describe('noteToFrequency', () => {
    it('should convert notes to frequencies', () => {
        const songCreator = new SongCreator();
        expect(songCreator.noteToFrequency('A4')).toBeCloseTo(440);
        expect(songCreator.noteToFrequency('C4')).toBeCloseTo(261.63, 2);
    });
});

describe('createDistortion', () => {
    it('should create a distortion node', () => {
        const songCreator = new SongCreator();
        const audioContext = new AudioContext();
        const distortionNode = songCreator.createDistortion(audioContext);
        expect(distortionNode).toBeInstanceOf(WaveShaperNode);
        expect(distortionNode.curve).not.toBeNull();
        expect(distortionNode.oversample).toBe('4x');
    });
});
describe('play', () => {
    it('should play all sequences in the song', () => {
        const songCreator = new SongCreator();
        songCreator.addSequence([{ note: 'C4', duration: 1 }]);
        songCreator.addSequence([{ note: 'D4', duration: 1 }]);
        jest.spyOn(songCreator, 'playSequence');

        songCreator.play();
        expect(songCreator.playSequence).toHaveBeenCalledTimes(songCreator.sequences.length);
    });
});


