import api from './api';

export const audioService = {

  // 🎧 Upload recording
  uploadRecording: async (
    audioBlob,
    text,
    language = 'en'
  ) => {

    const formData = new FormData();

    formData.append(
      'audio',
      audioBlob,
      'recording.wav'
    );

    formData.append(
      'originalText',
      text
    );

    // ✅ LANGUAGE SUPPORT
    formData.append(
      'language',
      language
    );

    const response =
      await api.post(
        '/audio',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data'
          }
        }
      );

    return response.data.data;
  },

  // 📊 Get recordings
  getUserRecordings:
    async () => {

      const res =
        await api.get('/audio');

      return res.data.data;
    }

};