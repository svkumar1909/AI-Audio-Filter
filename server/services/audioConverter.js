import ffmpeg from 'fluent-ffmpeg';

import path from 'path';

export const convertToWav =
  (inputPath) => {

    return new Promise(

      (resolve, reject) => {

        // CREATE DIFFERENT OUTPUT FILE
        const outputPath =
          inputPath.replace(
            path.extname(inputPath),
            '-converted.wav'
          );

        ffmpeg(inputPath)

          .audioFrequency(16000)

          .audioChannels(1)

          .format('wav')

          .save(outputPath)

          .on(
            'end',

            () => {

              console.log(
                'FFMPEG CONVERSION DONE'
              );

              resolve(outputPath);
            }
          )

          .on(
            'error',

            (err) => {

              console.log(
                'FFMPEG ERROR:',
                err
              );

              reject(err);
            }
          );
      }
    );
  };