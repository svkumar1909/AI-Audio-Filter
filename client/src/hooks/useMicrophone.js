import { useState, useEffect } from 'react';

export const useMicrophone = () => {
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestMicrophoneAccess = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setHasPermission(true);
      setError(null);
      return audioStream;
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
      return null;
    }
  };

  const startRecording = async () => {
    if (!stream) {
      const audioStream = await requestMicrophoneAccess();
      if (!audioStream) return false;
    }
    setIsRecording(true);
    return true;
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const closeStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      closeStream();
    };
  }, []);

  return {
    stream,
    isRecording,
    error,
    hasPermission,
    requestMicrophoneAccess,
    startRecording,
    stopRecording,
    closeStream
  };
};