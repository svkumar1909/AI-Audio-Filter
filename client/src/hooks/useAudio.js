import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AudioContext } from '../context/AudioContext';
import { audioProcessing } from '../utils/audioProcessing';

export const useAudio = () => {
  const { 
    startRecording: contextStartRecording,
    stopRecording: contextStopRecording,
    analyzeRecording,
    clearRecording
  } = useContext(AudioContext);
  
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioError, setAudioError] = useState(null);
  
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  
  const getMicrophonePermission = useCallback(async () => {
    setAudioError(null);
    
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      return audioStream;
    } catch (err) {
      setAudioError(err.message || 'Failed to access microphone');
      return null;
    }
  }, []);
  
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setRecordingTime(0);
    const startTime = Date.now();
    
    timerRef.current = setInterval(() => {
      setRecordingTime((Date.now() - startTime) / 1000);
    }, 100);
  }, []);
  
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const startRecording = useCallback(async () => {
    try {
      const audioStream = stream || await getMicrophonePermission();
      if (!audioStream) return false;
      
      audioChunks.current = [];
      const recorder = new MediaRecorder(audioStream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = audioProcessing.audioBufferToBlob(audioChunks.current);
        const url = audioProcessing.createObjectURL(audioBlob);
        
        setAudioURL(url);
        contextStopRecording(audioBlob);
        setIsRecording(false);
        stopTimer();
      };
      
      recorder.onerror = (err) => {
        setAudioError(err.message || 'Recording error occurred');
        stopTimer();
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      contextStartRecording(audioStream);
      startTimer();
      
      return true;
    } catch (err) {
      setAudioError(err.message || 'Failed to start recording');
      return false;
    }
  }, [stream, getMicrophonePermission, contextStartRecording, contextStopRecording, startTimer, stopTimer]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }, [mediaRecorder]);
  
  const analyzeAudio = useCallback(async (word) => {
    if (!audioURL) {
      setAudioError('No recording available to analyze');
      return null;
    }
    
    try {
      // Get the blob from the URL
      const response = await fetch(audioURL);
      const blob = await response.blob();
      return await analyzeRecording(blob, word);
    } catch (err) {
      setAudioError(err.message || 'Failed to analyze audio');
      return null;
    }
  }, [audioURL, analyzeRecording]);
  
  const resetAudio = useCallback(() => {
    if (audioURL) {
      audioProcessing.revokeObjectURL(audioURL);
    }
    
    setAudioURL('');
    clearRecording();
    setRecordingTime(0);
    setAudioError(null);
  }, [audioURL, clearRecording]);
  
  useEffect(() => {
    return () => {
      stopTimer();
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (audioURL) {
        audioProcessing.revokeObjectURL(audioURL);
      }
    };
  }, [stream, audioURL, stopTimer]);
  
  return {
    stream,
    mediaRecorder,
    audioURL,
    isRecording,
    recordingTime,
    error: audioError,
    startRecording,
    stopRecording,
    analyzeAudio,
    resetAudio
  };
};