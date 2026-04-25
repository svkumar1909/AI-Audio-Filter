import api from './api';

export const audioService = {

  // ✅ Upload recording (FIXED ROUTE)
  uploadRecording: async (audioBlob, word) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // optional fields (match backend)
      formData.append('title', word);
      formData.append('originalText', word);

      const response = await api.post('/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Audio upload failed');
    }
  },

  // ✅ Get all recordings (FIXED ROUTE)
  getUserRecordings: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/audio?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user recordings');
    }
  },

  // ✅ Get single recording
  getRecordingById: async (id) => {
    try {
      const response = await api.get(`/audio/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recording');
    }
  },

  // ✅ Get pronunciation analysis (OK)
  getPronunciationAnalysis: async (recordingId) => {
    try {
      const response = await api.get(`/analysis/${recordingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pronunciation analysis');
    }
  },

  // ❌ REMOVE (not implemented in backend)
  // getReferencePronunciation → DELETE or implement backend later

  // ❌ REMOVE (not implemented in backend)
  // getUserProgress → DELETE or implement backend later
};