import React, { useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaExclamationTriangle } from 'react-icons/fa';

const PronunciationFeedback = ({ analysis, recordingUrl, targetText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer] = useState(new Audio());

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  const toggleAudio = () => {
    if (!recordingUrl) return;

    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.src = recordingUrl;
      audioPlayer.play();
      setIsPlaying(true);
      audioPlayer.onended = () => setIsPlaying(false);
    }
  };

  // 🔥 UPDATED: fallback logic added
  const renderTargetText = () => {

    // ✅ CASE 1: AI word-level feedback exists
    if (analysis?.wordLevelFeedback && targetText) {
      const words = targetText.split(' ');

      return (
        <div className="text-lg leading-relaxed">
          {words.map((word, index) => {
            const wordAnalysis = analysis.wordLevelFeedback.find(
              w => w.word.toLowerCase() === word.toLowerCase()
            );

            let className = 'inline-block px-1 mx-0.5 rounded';

            if (!wordAnalysis) {
              className += ' bg-gray-100';
            } else if (wordAnalysis.score >= 90) {
              className += ' bg-green-100';
            } else if (wordAnalysis.score >= 75) {
              className += ' bg-blue-100';
            } else if (wordAnalysis.score >= 60) {
              className += ' bg-yellow-100';
            } else {
              className += ' bg-red-100';
            }

            return (
              <span key={index} className={className}>
                {word}
                {wordAnalysis?.score < 60 && (
                  <FaExclamationTriangle className="inline ml-1 text-red-500 text-xs" />
                )}
              </span>
            );
          })}
        </div>
      );
    }

    // ✅ CASE 2: fallback (simple compare)
    if (analysis?.originalText && analysis?.transcription) {

      const targetWords = analysis.originalText.toLowerCase().split(' ');
      const spokenWords = analysis.transcription.toLowerCase().split(' ');

      return (
        <div className="text-lg leading-relaxed">
          {targetWords.map((word, i) => {
            let className = 'inline-block px-1 mx-0.5 rounded';

            if (spokenWords[i] === word) {
              className += ' bg-green-100';
            } else if (spokenWords[i]) {
              className += ' bg-red-100';
            } else {
              className += ' bg-gray-200';
            }

            return (
              <span key={i} className={className}>
                {word}
              </span>
            );
          })}
        </div>
      );
    }

    return <p>No data</p>;
  };

  if (!analysis) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">Analysis in progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pronunciation Feedback</h2>

        {recordingUrl && (
          <button onClick={toggleAudio} className="flex gap-2 px-4 py-2 bg-blue-100 rounded">
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>

      {/* SCORE */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3>Overall Score</h3>
          <span className={`text-xl font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}/100
          </span>
        </div>

        <div className="bg-gray-200 h-3 rounded mt-2">
          <div
            className="bg-blue-500 h-3 rounded"
            style={{ width: `${analysis.overallScore}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {getScoreDescription(analysis.overallScore)}
        </p>
      </div>

      {/* WORD FEEDBACK */}
      <div className="mb-6">
        <h3 className="mb-2">Word Feedback</h3>
        <div className="p-4 bg-gray-50 rounded">
          {renderTargetText()}
        </div>
      </div>

      {/* SIMPLE EXTRA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-3 rounded text-center">
          Accuracy: {analysis.accuracy}
        </div>
        <div className="bg-purple-100 p-3 rounded text-center">
          Fluency: {analysis.fluency}
        </div>
      </div>

    </div>
  );
};

export default PronunciationFeedback;