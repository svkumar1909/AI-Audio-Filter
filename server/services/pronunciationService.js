import { spawn } from 'child_process';

export const analyzeAudioPronunciation = (
  audioPath
) => {

  return new Promise(
    (resolve, reject) => {

      const pythonProcess = spawn(
        'python',
        [
          './ai/pronunciation_ai.py',
          audioPath
        ]
      );

      let result = '';

      let error = '';

      pythonProcess.stdout.on(
        'data',
        (data) => {

          result += data.toString();
        }
      );

      pythonProcess.stderr.on(
        'data',
        (data) => {

          error += data.toString();

          console.log(
            'AI ANALYSIS ERROR:',
            data.toString()
          );
        }
      );

      pythonProcess.on(
        'close',
        () => {

          try {

            const parsed =
              JSON.parse(result);

            resolve(parsed);

          } catch (err) {

            reject(err);
          }
        }
      );
    }
  );
};