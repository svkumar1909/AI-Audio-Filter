import React, { useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaExclamationTriangle } from 'react-icons/fa';

const PronunciationFeedback = ({ analysis, recordingUrl, targetText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer] = useState(new Audio());
  
  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get score description
  const getScoreDescription = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };
  
  // Play audio recording
  const toggleAudio = () => {
    if (!recordingUrl) return;
    
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.src = recordingUrl;
      audioPlayer.play();
      setIsPlaying(true);
      
      audioPlayer.onended = () => {
        setIsPlaying(false);
      };
    }
  };
  
  // Word highlighting based on score
  const renderTargetText = () => {
    if (!analysis || !analysis.wordLevelFeedback || !targetText) {
      return <p className="text-lg">{targetText}</p>;
    }
    
    const words = targetText.split(' ');
    
    return (
      <div className="text-lg leading-relaxed">
        {words.map((word, index) => {
          // Find word analysis
          const wordAnalysis = analysis.wordLevelFeedback.find(
            w => w.word.toLowerCase() === word.toLowerCase()
          );
          
          // Choose style based on word score
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
            <span 
              key={`word-${index}`}
              className={className}
              title={wordAnalysis ? `Score: ${wordAnalysis.score}` : 'No data'}
            >
              {word}
              {wordAnalysis && wordAnalysis.score < 60 && (
                <FaExclamationTriangle className="inline ml-1 text-red-500 text-xs" />
              )}
            </span>
          );
        })}
      </div>
    );
  };
  
  // If no analysis yet
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
        <h2 className="text-xl font-semibold text-gray-800">Pronunciation Feedback</h2>
        
        {recordingUrl && (
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            <span>{isPlaying ? 'Pause' : 'Play'} Recording</span>
          </button>
        )}
      </div>
      
      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-700">Overall Score</h3>
          <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}/100
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              analysis.overallScore >= 90 ? 'bg-green-500' :
              analysis.overallScore >= 75 ? 'bg-blue-500' :
              analysis.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.overallScore}%` }}
          />
        </div>
        
        <p className="mt-2 text-gray-600">
          {getScoreDescription(analysis.overallScore)}: {analysis.scoreClassification === 'excellent' 
            ? "Your pronunciation is very clear and natural!" 
            : analysis.scoreClassification === 'good'
            ? "Your pronunciation is good with a few areas to improve." 
            : analysis.scoreClassification === 'fair'
            ? "Your pronunciation is understandable but needs more practice."
            : "Focus on the highlighted words that need improvement."}
        </p>
      </div>
      
      {/* Target Text with Word-Level Feedback */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Word-Level Feedback</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          {renderTargetText()}
        </div>
        <div className="mt-2 flex gap-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-green-100 rounded"></span>
            <span className="text-gray-600">Excellent</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-blue-100 rounded"></span>
            <span className="text-gray-600">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-yellow-100 rounded"></span>
            <span className="text-gray-600">Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-red-100 rounded"></span>
            <span className="text-gray-600">Needs Work</span>
          </div>
        </div>
      </div>
      
      {/* Improvement Suggestions */}
      {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Improvement Suggestions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            {analysis.improvementSuggestions.map((suggestion, index) => (
              <li key={`suggestion-${index}`}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Reference Pronunciation */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Reference Pronunciation</h3>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={() => {
            // Here you'd play a reference pronunciation from your assets
            // This is a placeholder - you'll need to implement actual audio playback
            alert('Playing reference pronunciation');
          }}
        >
          <FaVolumeUp />
          <span>Listen to Reference</span>
        </button>
      </div>
    </div>
  );
};

export default PronunciationFeedback;