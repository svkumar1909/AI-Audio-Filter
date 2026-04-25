import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import util from 'util';
import asyncHandler from 'express-async-handler';

// Convert fs.stat to Promise
const stat = util.promisify(fs.stat);

/**
 * Process audio file - normalize, convert format if needed, and get metadata
 * @param {string} filePath Path to the audio file
 * @returns {Object} Audio metadata (duration, format, etc.)
 */
export const processAudio = asyncHandler(async (filePath) => {
  const fileInfo = await stat(filePath);
  
  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  
  // Check if we need to convert the file
  let normalizedPath = filePath;
  let needsConversion = false;
  
  // We'll standardize on WAV for better AI processing
  if (ext !== '.wav') {
    normalizedPath = filePath.replace(ext, '.wav');
    needsConversion = true;
  }
  
  // If conversion is needed, perform it
  if (needsConversion) {
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .audioFrequency(16000) // 16kHz for better speech recognition
        .audioChannels(1)      // Mono
        .audioBitrate('128k')  // Reasonable quality
        .format('wav')
        .on('error', (err) => {
          console.error('Error during conversion:', err);
          reject(err);
        })
        .on('end', () => {
          // Remove original file if conversion successful
          fs.unlinkSync(filePath);
          resolve();
        })
        .save(normalizedPath);
    });
  }
  
  // Get audio duration and other metadata
  const metadata = await getAudioMetadata(normalizedPath || filePath);
  
  return {
    filePath: normalizedPath || filePath,
    duration: metadata.duration,
    format: metadata.format,
    channels: metadata.channels,
    sampleRate: metadata.sampleRate
  };
});

/**
 * Get audio file metadata
 * @param {string} filePath Path to the audio file
 * @returns {Object} Audio metadata
 */
const getAudioMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      
      const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
      
      resolve({
        duration: metadata.format.duration || 0,
        format: metadata.format.format_name,
        channels: audioStream ? audioStream.channels : 1,
        sampleRate: audioStream ? audioStream.sample_rate : 16000
      });
    });
  });
};