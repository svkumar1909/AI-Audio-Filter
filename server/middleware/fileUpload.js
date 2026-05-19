import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES MODULE FIX
const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

// ======================================
// UPLOADS FOLDER
// ======================================

const uploadDir =
  path.join(
    __dirname,
    '../uploads'
  );

// CREATE MAIN UPLOAD FOLDER
if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(uploadDir, {

    recursive: true
  });
}

// ======================================
// STORAGE CONFIG
// ======================================

const storage =
  multer.diskStorage({

    // DESTINATION
    destination: function (
      req,
      file,
      cb
    ) {

      try {

        // USER FOLDER
        const userDir =
          path.join(

            uploadDir,

            req.user.id.toString()
          );

        // CREATE USER FOLDER
        if (
          !fs.existsSync(userDir)
        ) {

          fs.mkdirSync(userDir, {

            recursive: true
          });
        }

        console.log(
          'UPLOAD DESTINATION:',
          userDir
        );

        cb(null, userDir);

      } catch (error) {

        console.log(
          'DESTINATION ERROR:',
          error
        );

        cb(error);
      }
    },

    // FILENAME
    filename: function (
      req,
      file,
      cb
    ) {

      try {

        // FILE EXTENSION
        const ext =
          path.extname(
            file.originalname
          );

        // UNIQUE NAME
        const uniqueName =
          `${Date.now()}-${Math.round(
            Math.random() * 1E9
          )}${ext}`;

        console.log(
          'GENERATED FILE:',
          uniqueName
        );

        cb(null, uniqueName);

      } catch (error) {

        console.log(
          'FILENAME ERROR:',
          error
        );

        cb(error);
      }
    }
  });

// ======================================
// FILE FILTER
// ======================================

const fileFilter = (
  req,
  file,
  cb
) => {

  try {

    // ALLOWED EXTENSIONS
    const filetypes =
      /wav|mp3|m4a|aac|ogg|webm/;

    // EXTENSION CHECK
    const extname =
      filetypes.test(

        path.extname(
          file.originalname
        ).toLowerCase()
      );

    // ALLOWED MIME TYPES
    const allowedMimeTypes = [

      'audio/wav',

      'audio/x-wav',

      'audio/mpeg',

      'audio/mp3',

      'audio/m4a',

      'audio/aac',

      'audio/ogg',

      'audio/webm'
    ];

    // MIME CHECK
    const mimetype =
      allowedMimeTypes.includes(
        file.mimetype
      );

    console.log(
      'FILE MIME:',
      file.mimetype
    );

    console.log(
      'FILE EXT:',
      path.extname(
        file.originalname
      )
    );

    // VALIDATION
    if (
      mimetype &&
      extname
    ) {

      return cb(null, true);

    } else {

      return cb(

        new Error(
          'Only audio files are allowed!'
        )
      );
    }

  } catch (error) {

    console.log(
      'FILE FILTER ERROR:',
      error
    );

    cb(error);
  }
};

// ======================================
// MULTER EXPORT
// ======================================

export const upload =
  multer({

    storage,

    limits: {

      fileSize:
        10 * 1024 * 1024 // 10MB
    },

    fileFilter
  });