import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaTrash, FaSave } from 'react-icons/fa';
import WaveformVisualizer from './WaveformVisualizer';

const AudioRecorder = ({ onSaveRecording, textPrompt }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioStream, setAudioStream] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyzerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const setupAudioAnalyzer = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzerRef.current = analyzer;
    visualize();
  };

  const visualize = () => {
    if (!analyzerRef.current) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      analyzerRef.current.getByteFrequencyData(dataArray);
      const sampleData = Array.from(dataArray).filter((_, i) => i % 4 === 0);
      setVisualizerData(sampleData);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      setupAudioAnalyzer(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      setError('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopTimer();

    audioStream?.getTracks().forEach(track => track.stop());
    cancelAnimationFrame(animationFrameRef.current);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const handleSave = () => {
    if (audioBlob && onSaveRecording) {
      onSaveRecording(audioBlob, recordingTime, textPrompt); // ✅ FIX
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">

      {textPrompt && (
        <div className="mb-4 p-3 bg-blue-50">
          <p className="text-blue-800">{textPrompt}</p>
        </div>
      )}

      <WaveformVisualizer data={visualizerData} isRecording={isRecording} />

      <div className="flex gap-3 mt-4">
        {!isRecording && !audioBlob && (
          <button onClick={startRecording}><FaMicrophone /></button>
        )}

        {isRecording && (
          <button onClick={stopRecording}><FaStop /></button>
        )}

        {audioBlob && (
          <>
            <button onClick={resetRecording}><FaTrash /></button>
            <button onClick={handleSave}><FaSave /></button>
          </>
        )}
      </div>

      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  );
};

export default AudioRecorder;