import api from './api';

export const audioService = {
  uploadRecording: async (audioBlob, word) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('word', word);
      
      const response = await api.post('/audio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Audio upload failed');
    }
  },

  getPronunciationAnalysis: async (recordingId) => {
    try {
      const response = await api.get(`/analysis/${recordingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pronunciation analysis');
    }
  },

  getUserRecordings: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/audio/recordings?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user recordings');
    }
  },

  getReferencePronunciation: async (word) => {
    try {
      const response = await api.get(`/audio/reference/${word}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reference pronunciation');
    }
  },

  getUserProgress: async (timeframe = 'week') => {
    try {
      const response = await api.get(`/analysis/progress?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user progress');
    }
  }
};