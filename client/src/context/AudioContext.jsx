import { createContext, useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioRecording, setAudioRecording] = useState(null);
  const [recordingState, setRecordingState] = useState('inactive'); // 'inactive', 'recording', 'paused'
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const startRecording = useCallback(async (stream) => {
    setRecordingState('recording');
    setError(null);
  }, []);
  
  const pauseRecording = useCallback(() => {
    if (recordingState === 'recording') {
      setRecordingState('paused');
    }
  }, [recordingState]);
  
  const resumeRecording = useCallback(() => {
    if (recordingState === 'paused') {
      setRecordingState('recording');
    }
  }, [recordingState]);
  
  const stopRecording = useCallback((audioBlob) => {
    setRecordingState('inactive');
    setAudioRecording(audioBlob);
  }, []);
  
  const analyzeRecording = useCallback(async (audioBlob, word) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await audioService.uploadRecording(audioBlob, word);
      const analysis = await audioService.getPronunciationAnalysis(result.recordingId);
      
      setAudioAnalysis(analysis);
      return analysis;
    } catch (err) {
      setError(err.message || 'Failed to analyze pronunciation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearRecording = useCallback(() => {
    setAudioRecording(null);
    setAudioAnalysis(null);
    setError(null);
  }, []);
  
  return (
    <AudioContext.Provider
      value={{
        audioRecording,
        recordingState,
        audioAnalysis,
        isLoading,
        error,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        analyzeRecording,
        clearRecording
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;