/**
 * @jest-environment jsdom
 */

 import SongCreator from "../dist/song-creator.js";

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
  
describe('SongCreator', () => {
    let songCreator;
  
    beforeEach(() => {
      songCreator = new SongCreator();
    });
    
    it('should convert a musical note to its corresponding frequency', () => {
      expect(songCreator.noteToFrequency('A4')).toBe(440);
      expect(songCreator.noteToFrequency('C4')).toBeCloseTo(261.63, 2);
      expect(() => {
        songCreator.noteToFrequency('H8');
      }).toThrow('Invalid note format. Expected format like "A4", "C#3", or "Bb2".');
    });
  
    it('should create a distortion effect', () => {
      const distortion = songCreator.createDistortion(songCreator.audioContext);
      expect(distortion).toBeDefined();
      expect(distortion.curve).toBeDefined();
      expect(distortion.oversample).toBe('4x');
    });
  
    it('should add a new track correctly', () => {
      const trackIndex = songCreator.addTimedTrack(0, 10);
      expect(trackIndex).toBe(0);
      expect(songCreator.tracks[trackIndex]).toEqual({ sequences: [], startTime: 0, endTime: 10 });
    });
  
    it('should throw error when adding a track with invalid times', () => {
      expect(() => {
        songCreator.addTimedTrack('start', 'end');
      }).toThrow('Invalid start or end time: Must be a number.');
    });
  
    it('should add a sequence to a track correctly', () => {
      const trackIndex = songCreator.addTimedTrack(0, 10);
      const noteObjects = [{ note: 'C4', duration: 2 }];
      const options = { startTime: 0, endTime: 5, loop: false, distortion: false };
      songCreator.addSequenceToTrack(trackIndex, noteObjects, options);
      expect(songCreator.tracks[trackIndex].sequences.length).toBe(1);
      expect(songCreator.tracks[trackIndex].sequences[0]).toEqual({ 
        notes: noteObjects, 
        startTime: 0, 
        endTime: 5,
        loop: false, 
        distortion: false 
      });
    });
  
    it('should throw error when adding a sequence to a non-existent track', () => {
      const noteObjects = [{ note: 'C4', duration: 2 }];
      const options = { startTime: 0, endTime: 5, loop: false, distortion: false };
      expect(() => {
        songCreator.addSequenceToTrack(99, noteObjects, options);
      }).toThrow('Track with index 99 does not exist.');
    });

  });
  
  
