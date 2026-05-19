import {
  useState
} from 'react';

import AudioRecorder
from '../components/AudioRecorder';

import PronunciationFeedback
from '../components/PronunciationFeedback';

import {
  audioService
} from '../services/audioService';

const SpeechAnalysisPage = () => {

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // ====================================
  // HANDLE RECORDING
  // ====================================

  const handleSaveRecording =
    async (blob, time) => {

      try {

        setLoading(true);

        setError(null);

        const response =
          await audioService.uploadSpeechAnalysis(
            blob
          );

        setAnalysis(response);

      } catch (err) {

        console.log(err);

        setError(
          'Failed to analyze speech'
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="mb-10 text-center">

          <h1 className="text-6xl font-extrabold gradient-text mb-5">

            AI Speech Intelligence

          </h1>

          <p className="text-gray-600 text-xl max-w-3xl mx-auto">

            Speak naturally in any language and let AI analyze your fluency,
            pronunciation, confidence, and communication quality.

          </p>

        </div>

        {/* RECORDER */}
        <AudioRecorder
          textPrompt={
            'Speak freely in any language'
          }
          freeMode={true}
          onSaveRecording={
            handleSaveRecording
          }
        />

        {/* LOADING */}
        {loading && (

          <div className="mt-10 premium-card p-10 text-center">

            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h2 className="text-3xl font-bold gradient-text mb-3">

              AI is analyzing speech...

            </h2>

            <p className="text-gray-500 text-lg">

              Evaluating fluency, pronunciation,
              clarity and communication patterns

            </p>

          </div>
        )}

        {/* ERROR */}
        {error && (

          <div className="mt-8 bg-red-100 text-red-700 p-5 rounded-3xl shadow-lg">

            {error}

          </div>
        )}

        {/* ANALYSIS */}
        {analysis && (

          <div className="mt-10">

            <PronunciationFeedback
              analysis={analysis}
              targetText={null}
              freeSpeech={true}
            />

          </div>
        )}

      </div>

    </div>
  );
};

export default SpeechAnalysisPage;