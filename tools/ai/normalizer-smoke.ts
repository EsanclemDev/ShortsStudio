import {
  validateDirectorResponse,
  type VisualDirectorInput,
} from '../../src/engine/ai/services/VisualDirector';

const input: VisualDirectorInput = {
  id: 'test',
  title: 'Agua',
  narration: 'Bebe agua',
  duration: 3,
  fps: 30,
  width: 1080,
  height: 1920,
  voiceSrc: 'audio/test.mp3',
  captionsSrc: 'audio/test.json',
  captions: [
    {
      text: 'Bebe agua',
      startMs: 0,
      endMs: 2000,
    },
  ],
};

const candidate = {
  catalogVersion: 'test',
  videoSchema: {},
  schemaVersion: 1,
  id: 'wrong-id',
  title: 'Wrong title',
  duration: 10,
  fps: 60,
  width: 1920,
  height: 1080,

  audio: {
    voice: {
      src: 'incorrect.mp3',
      startFrame: 10,
      loop: true,
      durationInFrames: 20,
    },
  },

  subtitles: {
    src: 'incorrect.json',
  },

  scenes: [
    {
      id: 'hook',
      start: 0,
      end: 3,
      environment: 'studio',
      entities: [
        {
          id: 'glass',
          type: 'object',
          props: {
            type: 'waterGlass',
          },
        },
      ],
    },
  ],
};

const video = validateDirectorResponse(
  JSON.stringify(candidate),
  input
);

if (
  video.id !== input.id ||
  video.duration !== input.duration ||
video.audio?.voice?.src !== input.voiceSrc ||
video.audio?.voice?.loop ||
  video.subtitles?.src !== input.captionsSrc ||
  'catalogVersion' in video ||
  'videoSchema' in video
) {
  throw new Error('Normalization failed');
}

// La normalización no debe ocultar errores visuales.
const invalid = structuredClone(candidate);

Object.assign(invalid.scenes[0].entities[0].props, {
  animation: 'inventedAnimation',
});

let rejected = false;

try {
  validateDirectorResponse(
    JSON.stringify(invalid),
    input
  );
} catch {
  rejected = true;
}

if (!rejected) {
  throw new Error('Invalid animation was accepted');
}

console.log('AI normalizer smoke test OK');