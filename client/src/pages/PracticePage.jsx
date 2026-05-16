import { useState, useEffect } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import PronunciationFeedback from '../components/PronunciationFeedback';
import { audioService } from '../services/audioService';

function PracticePage() {

  const [targetPhrase, setTargetPhrase] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const phrases = [
    "Hello how are you",
    "Practice makes perfect",
    "I love programming"
  ];

  useEffect(() => {
    setTargetPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  // ✅ FIXED
  const handleSaveRecording = async (blob, time, text) => {
    try {
      setLoading(true);
      const data = await audioService.uploadRecording(blob, text);

      // ✅ FIXED
      setAnalysis(data);

    } catch (err) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setAnalysis(null);
    setTargetPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">{targetPhrase}</h2>

      {/* ✅ PASS TEXT PROPERLY */}
      <AudioRecorder
        textPrompt={targetPhrase}
        onSaveRecording={(blob, time) =>
          handleSaveRecording(blob, time, targetPhrase)
        }
      />

      {loading && <p>Analyzing...</p>}
      {error && <p>{error}</p>}

      {analysis && (
        <div className="mt-6">
          <PronunciationFeedback 
            analysis={analysis} 
            targetText={targetPhrase}
          />
          <button 
            onClick={handleNew}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default PracticePage;