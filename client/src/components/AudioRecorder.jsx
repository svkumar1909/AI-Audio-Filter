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
  
  // Initialize analyzer for visualization
  const setupAudioAnalyzer = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzerRef.current = analyzer;
    
    // Start visualization
    visualize();
  };
  
  // Generate visualization data
  const visualize = () => {
    if (!analyzerRef.current) return;
    
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualizer = () => {
      analyzerRef.current.getByteFrequencyData(dataArray);
      // Get a sample of data for visualization (we don't need all 128 values)
      const sampleData = Array.from(dataArray).filter((_, i) => i % 4 === 0);
      setVisualizerData(sampleData);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };
    
    updateVisualizer();
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Setup audio analyzer for visualization
      setupAudioAnalyzer(stream);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      startTimer();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      
      // Stop audio stream tracks
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      
      // Stop visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };
  
  // Reset recording
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setVisualizerData([]);
  };
  
  // Timer functions
  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Save the recording
  const handleSave = () => {
    if (audioBlob && onSaveRecording) {
      onSaveRecording(audioBlob, recordingTime);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {textPrompt && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-gray-700 mb-1">Phrase to pronounce:</h3>
          <p className="text-lg font-medium text-blue-800">{textPrompt}</p>
        </div>
      )}
      
      <div className="mb-4 h-24">
        <WaveformVisualizer data={visualizerData} isRecording={isRecording} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
        
        <div className="flex gap-3">
          {!isRecording && !audioBlob ? (
            <button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 flex items-center justify-center"
              title="Start Recording"
            >
              <FaMicrophone className="text-xl" />
            </button>
          ) : isRecording ? (
            <button
              onClick={stopRecording}
              className="bg-gray-700 hover:bg-gray-800 text-white rounded-full p-4 flex items-center justify-center"
              title="Stop Recording"
            >
              <FaStop className="text-xl" />
            </button>
          ) : (
            <>
              <button
                onClick={resetRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-3 flex items-center justify-center"
                title="Discard Recording"
              >
                <FaTrash className="text-lg" />
              </button>
              
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 flex items-center justify-center"
                title="Save Recording"
              >
                <FaSave className="text-lg" />
              </button>
              
              <button
                onClick={startRecording}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 flex items-center justify-center"
                title="Record Again"
              >
                <FaMicrophone className="text-lg" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {audioUrl && !isRecording && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Preview:</h3>
          <audio controls className="w-full" src={audioUrl}></audio>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;