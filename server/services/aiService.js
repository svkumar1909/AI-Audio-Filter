import { spawn } from 'child_process';
import path from 'path';

export const speechToText = (
  audioPath,
  language = null
) => {

  return new Promise((resolve, reject) => {

    const absoluteAudioPath =
      path.resolve(audioPath);

    const args = [
      './ai/whisper_engine.py',
      absoluteAudioPath
    ];

    // optional language
    if (language) {

      args.push(language);
    }

    const pythonProcess = spawn(
      'python',
      args
    );

    let result = '';

    let error = '';

    // stdout
    pythonProcess.stdout.on(
      'data',
      (data) => {

        result += data.toString();
      }
    );

    // stderr
    pythonProcess.stderr.on(
      'data',
      (data) => {

        error += data.toString();

        console.log(
          'PYTHON ERROR:',
          data.toString()
        );
      }
    );

    // close
    pythonProcess.on(
      'close',
      (code) => {

        if (code !== 0) {

          return reject(
            new Error(error)
          );
        }

        try {

          const parsed =
            JSON.parse(result);

          resolve({

            text:
              parsed.text || '',

            language:
              parsed.language || 'unknown'
          });

        } catch (err) {

          reject(err);
        }
      }
    );
  });
};