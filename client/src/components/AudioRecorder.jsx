import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import {
  FaMicrophone,
  FaStop,
  FaTrash,
  FaSave
} from 'react-icons/fa';

import WaveformVisualizer from './WaveformVisualizer';

const AudioRecorder = ({
  onSaveRecording,
  textPrompt
}) => {

  const [isRecording, setIsRecording] =
    useState(false);

  const [audioBlob, setAudioBlob] =
    useState(null);

  const [audioUrl, setAudioUrl] =
    useState(null);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const [audioStream, setAudioStream] =
    useState(null);

  const [visualizerData, setVisualizerData] =
    useState([]);

  const [error, setError] =
    useState(null);

  const mediaRecorderRef =
    useRef(null);

  const timerRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const analyzerRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  // =========================
  // AUDIO VISUALIZER
  // =========================

  const setupAudioAnalyzer =
    (stream) => {

      const audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      const analyzer =
        audioContext.createAnalyser();

      analyzer.fftSize = 256;

      source.connect(analyzer);

      analyzerRef.current =
        analyzer;

      visualize();
    };

  const visualize = () => {

    if (!analyzerRef.current)
      return;

    const bufferLength =
      analyzerRef.current.frequencyBinCount;

    const dataArray =
      new Uint8Array(bufferLength);

    const updateVisualizer =
      () => {

        analyzerRef.current.getByteFrequencyData(
          dataArray
        );

        const sampleData =
          Array.from(dataArray).filter(
            (_, i) => i % 4 === 0
          );

        setVisualizerData(
          sampleData
        );

        animationFrameRef.current =
          requestAnimationFrame(
            updateVisualizer
          );
      };

    updateVisualizer();
  };

  // =========================
  // START RECORDING
  // =========================

  const startRecording =
    async () => {

      try {

        setError(null);

        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true
          });

        setAudioStream(stream);

        setupAudioAnalyzer(stream);

        // ✅ FIXED MIME TYPE
        const mediaRecorder =
          new MediaRecorder(
            stream,
            {
              mimeType:
                'audio/webm;codecs=opus'
            }
          );

        mediaRecorderRef.current =
          mediaRecorder;

        audioChunksRef.current =
          [];

        mediaRecorder.ondataavailable =
          (event) => {

            if (
              event.data.size > 0
            ) {

              audioChunksRef.current.push(
                event.data
              );
            }
          };

        mediaRecorder.onstop =
          () => {

            // ✅ CREATE WEBM BLOB
            const blob =
              new Blob(
                audioChunksRef.current,
                {
                  type:
                    'audio/webm'
                }
              );

            setAudioBlob(blob);

            // ✅ LOCAL PLAYBACK URL
            const url =
              URL.createObjectURL(
                blob
              );

            setAudioUrl(url);
          };

        mediaRecorder.start();

        setIsRecording(true);

        startTimer();

      } catch (err) {

        console.error(err);

        setError(
          'Microphone access denied'
        );
      }
    };

  // =========================
  // STOP RECORDING
  // =========================

  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setIsRecording(false);

    stopTimer();

    audioStream
      ?.getTracks()
      .forEach(track =>
        track.stop()
      );

    cancelAnimationFrame(
      animationFrameRef.current
    );
  };

  // =========================
  // RESET RECORDING
  // =========================

  const resetRecording = () => {

    setAudioBlob(null);

    setAudioUrl(null);

    setRecordingTime(0);
  };

  // =========================
  // TIMER
  // =========================

  const startTimer = () => {

    timerRef.current =
      setInterval(() => {

        setRecordingTime(
          prev => prev + 1
        );

      }, 1000);
  };

  const stopTimer = () => {

    clearInterval(
      timerRef.current
    );
  };

  // =========================
  // SAVE RECORDING
  // =========================

  const handleSave =
    async () => {

      try {

        if (!audioBlob)
          return;

        await onSaveRecording(
          audioBlob,
          recordingTime,
          textPrompt
        );

        alert(
          'Recording saved successfully'
        );

        resetRecording();

      } catch (error) {

        console.error(error);

        setError(
          'Failed to save recording'
        );
      }
    };

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {

    return () => {

      stopTimer();
    };

  }, []);

  return (

    <div className="premium-card p-8">

      {/* PROMPT */}
      {textPrompt && (

        <div className="mb-8 glass p-6 rounded-3xl">

          <h3 className="text-xl font-bold gradient-text mb-2">

            Pronunciation Practice

          </h3>

          <p className="text-3xl font-semibold text-gray-800">

            "{textPrompt}"

          </p>

        </div>
      )}

      {/* TIMER */}
      <div className="text-center mb-6">

        <p className="text-5xl font-extrabold gradient-text">

          {recordingTime}s

        </p>

      </div>

      {/* VISUALIZER */}
      <div className="mb-8">

        <WaveformVisualizer
          data={visualizerData}
          isRecording={isRecording}
        />

      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-6">

        {!isRecording &&
          !audioBlob && (

          <button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-all duration-300"
          >

            <FaMicrophone />

          </button>
        )}

        {isRecording && (

          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center text-3xl shadow-2xl animate-pulse"
          >

            <FaStop />

          </button>
        )}

        {audioBlob && (

          <>

            <button
              onClick={resetRecording}
              className="w-20 h-20 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-3xl shadow-xl hover:bg-gray-300 transition"
            >

              <FaTrash />

            </button>

            <button
              onClick={handleSave}
              className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-all duration-300"
            >

              <FaSave />

            </button>

          </>
        )}

      </div>

      {/* AUDIO PREVIEW */}
      {audioUrl && (

        <div className="mt-10">

          <audio
            controls
            className="w-full rounded-2xl"
            preload="metadata"
          >

            <source
              src={audioUrl}
              type="audio/webm"
            />

            Your browser does not support audio.

          </audio>

        </div>
      )}

      {/* ERROR */}
      {error && (

        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-2xl">

          {error}

        </div>
      )}

    </div>
  );
};

export default AudioRecorder;