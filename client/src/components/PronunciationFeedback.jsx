import React, { useState } from 'react';

import {
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBrain,
  FaWaveSquare
} from 'react-icons/fa';

const PronunciationFeedback = ({
  analysis,
  recordingUrl,
  targetText
}) => {

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [audioPlayer] =
    useState(new Audio());

  const getScoreColor = (score) => {

    if (score >= 90)
      return 'from-green-500 to-emerald-500';

    if (score >= 75)
      return 'from-blue-500 to-cyan-500';

    if (score >= 60)
      return 'from-yellow-500 to-orange-500';

    return 'from-red-500 to-pink-500';
  };

  const getScoreText = (score) => {

    if (score >= 90)
      return 'Excellent';

    if (score >= 75)
      return 'Very Good';

    if (score >= 60)
      return 'Good';

    return 'Needs Improvement';
  };

  const toggleAudio = () => {

    if (!recordingUrl) return;

    if (isPlaying) {

      audioPlayer.pause();

      setIsPlaying(false);

    } else {

      audioPlayer.src =
        recordingUrl;

      audioPlayer.play();

      setIsPlaying(true);

      audioPlayer.onended = () =>
        setIsPlaying(false);
    }
  };

  const renderTargetText = () => {

    if (
      analysis?.wordLevelFeedback &&
      targetText
    ) {

      const words =
        targetText.split(' ');

      return (

        <div className="flex flex-wrap gap-3">

          {words.map((word, index) => {

            const wordAnalysis =
              analysis.wordLevelFeedback.find(
                w =>
                  w.word.toLowerCase() ===
                  word.toLowerCase()
              );

            let style =
              'bg-gray-100 text-gray-700';

            if (wordAnalysis) {

              if (
                wordAnalysis.score >= 90
              ) {

                style =
                  'bg-green-100 text-green-700';

              } else if (
                wordAnalysis.score >= 75
              ) {

                style =
                  'bg-blue-100 text-blue-700';

              } else if (
                wordAnalysis.score >= 60
              ) {

                style =
                  'bg-yellow-100 text-yellow-700';

              } else {

                style =
                  'bg-red-100 text-red-700';
              }
            }

            return (

              <div
                key={index}
                className={`px-4 py-2 rounded-2xl font-semibold flex items-center gap-2 ${style}`}
              >

                {word}

                {wordAnalysis?.score >= 75 ? (

                  <FaCheckCircle />

                ) : (

                  <FaExclamationTriangle />
                )}

              </div>
            );
          })}

        </div>
      );
    }

    return (

      <p className="text-gray-500">

        No detailed feedback available

      </p>
    );
  };

  if (!analysis) {

    return (

      <div className="premium-card p-10 text-center">

        <div className="w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-6"></div>

        <h2 className="text-3xl font-bold gradient-text">

          AI Analysis Running...

        </h2>

      </div>
    );
  }

  return (

    <div className="premium-card p-8 mt-10">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl glow-animation">

            <FaBrain className="text-white text-4xl" />

          </div>

          <div>

            <h2 className="text-4xl font-extrabold gradient-text">

              AI Pronunciation Analysis

            </h2>

            <p className="text-gray-500 text-lg mt-2">

              Real-time pronunciation evaluation & feedback

            </p>

          </div>

        </div>

        {recordingUrl && (

          <button
            onClick={toggleAudio}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300"
          >

            {isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}

            {isPlaying
              ? 'Pause Audio'
              : 'Play Audio'}

          </button>
        )}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* SCORE SECTION */}
        <div className="glass rounded-3xl p-10">

          <div className="flex items-center gap-3 mb-8">

            <FaWaveSquare className="text-blue-600 text-3xl" />

            <h3 className="text-3xl font-bold">

              AI Score

            </h3>

          </div>

          {/* CIRCLE */}
          <div className="flex justify-center mb-10">

            <div className={`w-60 h-60 rounded-full bg-gradient-to-r ${getScoreColor(analysis.overallScore)} flex items-center justify-center shadow-[0_20px_60px_rgba(99,102,241,0.4)] floating`}>

              <div className="w-44 h-44 rounded-full bg-white flex flex-col items-center justify-center">

                <h2 className="text-6xl font-extrabold gradient-text">

                  {analysis.overallScore || 0}

                </h2>

                <p className="text-gray-500 font-semibold">

                  / 100

                </p>

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="text-center">

            <p className="text-3xl font-bold mb-3">

              {
                getScoreText(
                  analysis.overallScore
                )
              }

            </p>

            <p className="text-gray-500 text-lg">

              AI pronunciation confidence level

            </p>

          </div>

        </div>

        {/* METRICS */}
        <div className="space-y-8">

          {/* ACCURACY */}
          <div className="glass rounded-3xl p-8">

            <div className="flex justify-between mb-4">

              <h3 className="text-2xl font-bold">

                Accuracy

              </h3>

              <span className="text-2xl font-bold text-green-600">

                {analysis.accuracy || 0}%

              </span>

            </div>

            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${analysis.accuracy || 0}%`
                }}
              />

            </div>

          </div>

          {/* FLUENCY */}
          <div className="glass rounded-3xl p-8">

            <div className="flex justify-between mb-4">

              <h3 className="text-2xl font-bold">

                Fluency

              </h3>

              <span className="text-2xl font-bold text-purple-600">

                {analysis.fluency || 0}%

              </span>

            </div>

            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${analysis.fluency || 0}%`
                }}
              />

            </div>

          </div>

          {/* TRANSCRIPT */}
          <div className="glass rounded-3xl p-8">

            <h3 className="text-2xl font-bold mb-5">

              AI Transcript

            </h3>

            <div className="bg-white/70 rounded-2xl p-5 text-gray-700 text-lg">

              {
                analysis.transcription ||
                'No transcription available'
              }

            </div>

          </div>

        </div>

      </div>

      {/* WORD FEEDBACK */}
      <div className="glass rounded-3xl p-8 mt-10">

        <h3 className="text-3xl font-bold mb-8">

          Word-Level Feedback

        </h3>

        {renderTargetText()}

      </div>

    </div>
  );
};

export default PronunciationFeedback;