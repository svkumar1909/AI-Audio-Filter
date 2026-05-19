import {
  useState,
  useEffect
} from 'react';

import AudioRecorder
from '../components/AudioRecorder';

import PronunciationFeedback
from '../components/PronunciationFeedback';

import {
  audioService
} from '../services/audioService';

const PracticePage = () => {

  const [targetPhrase, setTargetPhrase] =
    useState('');

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // ✅ LANGUAGE
  const [language, setLanguage] =
    useState('en');

  const phrases = [

    'Hello how are you',

    'Practice makes perfect',

    'Artificial Intelligence is the future',

    'I love programming',

    'Confidence comes with practice'
  ];

  useEffect(() => {

    generatePhrase();

  }, []);

  const generatePhrase = () => {

    const randomPhrase =
      phrases[
        Math.floor(
          Math.random() *
          phrases.length
        )
      ];

    setTargetPhrase(
      randomPhrase
    );
  };

  // ✅ FIXED
  const handleSaveRecording =
    async (
      blob,
      time
    ) => {

      try {

        setLoading(true);

        setError(null);

        const response =
          await audioService.uploadRecording(
            blob,
            targetPhrase,
            language
          );

        setAnalysis(
          response
        );

      } catch (err) {

        console.log(err);

        setError(
          'Failed to analyze pronunciation'
        );

      } finally {

        setLoading(false);
      }
    };

  const handleNext = () => {

    setAnalysis(null);

    generatePhrase();
  };

  return (

    <div className="min-h-screen">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="mb-10 text-center">

          <h1 className="text-6xl font-extrabold gradient-text mb-5">

            AI Pronunciation Lab

          </h1>

          <p className="text-gray-600 text-xl max-w-3xl mx-auto">

            Practice your speaking skills with
            real-time AI-powered pronunciation
            analysis and feedback.

          </p>

        </div>

        {/* LANGUAGE SELECT */}
        <div className="flex justify-center mb-8">

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="glass px-6 py-4 rounded-2xl text-lg font-semibold outline-none"
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              Hindi
            </option>

            <option value="bn">
              Bengali
            </option>

          </select>

        </div>

        {/* RECORDER */}
        <AudioRecorder
          textPrompt={targetPhrase}
          onSaveRecording={
            (
              blob,
              time
            ) =>
              handleSaveRecording(
                blob,
                time
              )
          }
        />

        {/* LOADING */}
        {loading && (

          <div className="mt-10 premium-card p-10 text-center">

            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h2 className="text-3xl font-bold gradient-text mb-3">

              AI is analyzing...

            </h2>

            <p className="text-gray-500 text-lg">

              Processing pronunciation and speech patterns

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
              targetText={targetPhrase}
            />

            <div className="flex justify-center mt-8">

              <button
                onClick={handleNext}
                className="glow-btn px-10 py-4 rounded-3xl text-xl font-bold shadow-2xl"
              >

                Next Practice

              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default PracticePage;