import api from './api';

export const audioService = {

  // 🎤 Upload recording
  uploadRecording: async (audioBlob, text) => {

    const formData = new FormData();

    formData.append(
      'audio',
      audioBlob,
      'recording.webm'
    );

    formData.append(
      'originalText',
      text || ''
    );

    formData.append(
      'language',
      'en-US'
    );

    const response = await api.post(
      '/audio',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.data;
  },

  // 📊 Get history
  getUserRecordings: async () => {

    const response = await api.get('/audio');

    return response.data.data;
  }
};