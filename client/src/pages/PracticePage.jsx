import { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import AudioRecorder from '../components/AudioRecorder';
import PronunciationFeedback from '../components/PronunciationFeedback';
import WaveformVisualizer from '../components/WaveformVisualizer';

function PracticePage() {
  const [targetPhrase, setTargetPhrase] = useState('');
  const [practiceMode, setPracticeMode] = useState('phrase'); // 'phrase' or 'paragraph'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'

  const { 
    audioBlob, 
    analysis, 
    loading, 
    error, 
    analyzeAudio, 
    clearRecording 
  } = useAudio();

  const predefinedPhrases = {
    easy: [
      "Hello, how are you today?",
      "My name is John and I'm learning English.",
      "I would like a cup of coffee, please."
    ],
    medium: [
      "The quick brown fox jumps over the lazy dog.",
      "She sells seashells by the seashore.",
      "How much wood would a woodchuck chuck if a woodchuck could chuck wood?"
    ],
    hard: [
      "The sixth sick sheikh's sixth sheep's sick.",
      "Peter Piper picked a peck of pickled peppers.",
      "Supercalifragilisticexpialidocious is an extraordinarily long word."
    ]
  };

  const predefinedParagraphs = {
    easy: [
      "Today is a beautiful day. The sun is shining and the birds are singing. I think I will go for a walk in the park.",
      "My favorite season is summer. I love going to the beach and swimming in the ocean. The warm weather makes me happy."
    ],
    medium: [
      "Learning a new language can be challenging but rewarding. It opens doors to new cultures and ways of thinking. Consistent practice is the key to mastery.",
      "The benefits of regular exercise include improved mood, better sleep, and increased energy levels. Even a short daily walk can make a significant difference in your overall health."
    ],
    hard: [
      "The intricate relationship between linguistics and cognitive psychology reveals fascinating insights into human language acquisition. Children's natural ability to absorb language rules implicitly contrasts with adults' more analytical approach.",
      "Quantum physics challenges our intuitive understanding of reality. Phenomena such as superposition and entanglement suggest that particles can exist in multiple states simultaneously until observed, defying classical physics principles."
    ]
  };

  const selectRandomPhrase = () => {
    const phrasesArray = practiceMode === 'phrase' 
      ? predefinedPhrases[difficulty] 
      : predefinedParagraphs[difficulty];
    
    const randomIndex = Math.floor(Math.random() * phrasesArray.length);
    setTargetPhrase(phrasesArray[randomIndex]);
  };

  // Select a random phrase when component mounts or when settings change
  useEffect(() => {
    selectRandomPhrase();
  }, [practiceMode, difficulty]);

  const handleSubmitRecording = async () => {
    if (audioBlob) {
      try {
        await analyzeAudio(targetPhrase, audioBlob);
      } catch (err) {
        console.error("Error analyzing audio:", err);
      }
    }
  };

  const handleNewPractice = () => {
    clearRecording();
    selectRandomPhrase();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Practice Your Pronunciation</h1>
      
      {/* Practice Settings */}
      <div className="bg-gray-50 p-6 mb-8 rounded-lg">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Practice Mode</label>
            <select
              value={practiceMode}
              onChange={(e) => setPracticeMode(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="phrase">Phrases</option>
              <option value="paragraph">Paragraphs</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={selectRandomPhrase}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200"
            >
              New {practiceMode === 'phrase' ? 'Phrase' : 'Paragraph'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Target Phrase */}
      <div className="bg-white border p-6 mb-8 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-2">Repeat the following:</h2>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-xl text-blue-900 font-medium">{targetPhrase}</p>
        </div>
      </div>
      
      {/* Audio Recorder */}
      <div className="bg-white border p-6 mb-8 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Record Your Voice</h2>
        <AudioRecorder onRecordingComplete={handleSubmitRecording} />
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white border p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3">Analyzing your pronunciation...</span>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 mb-8 rounded-lg">
          <h2 className="text-lg font-medium text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Audio Waveform Visualization */}
      {audioBlob && !loading && !analysis && (
        <div className="bg-white border p-6 mb-8 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Your Recording</h2>
          <WaveformVisualizer audioBlob={audioBlob} />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmitRecording}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Analyze Pronunciation
            </button>
          </div>
        </div>
      )}
      
      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white border p-6 mb-8 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Pronunciation Feedback</h2>
          <PronunciationFeedback 
            analysis={analysis} 
            targetPhrase={targetPhrase} 
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNewPractice}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Practice Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticePage;