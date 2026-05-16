// 🔹 Similarity helper
const getSimilarity = (a = '', b = '') => {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();

  if (!a || !b) return 0;

  let matches = 0;
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / Math.max(a.length, b.length);
};


// 🔥 MAIN FUNCTION
export const analyzePronunciation = (spoken, target, duration) => {

  spoken = (spoken || '').toLowerCase();
  target = (target || '').toLowerCase();

  const spokenWords = spoken.split(' ').filter(Boolean);
  const targetWords = target.split(' ').filter(Boolean);

  let correctWords = 0;

  // 🔥 Word-level feedback
  const wordLevelFeedback = targetWords.map(word => {
    if (spokenWords.includes(word)) {
      correctWords++;
      return { word, score: 100 };
    }
    return { word, score: 40 };
  });

  // 🎯 Accuracy
  const accuracy = targetWords.length
    ? Math.round((correctWords / targetWords.length) * 100)
    : 0;

  // ⏱ Fluency (timing-based)
  const expectedTime = targetWords.length * 0.5;
  let fluency = 100 - Math.abs(duration - expectedTime) * 15;
  fluency = Math.max(0, Math.min(100, fluency));

  // 🧠 Similarity (character-based)
  const similarity = getSimilarity(spoken, target);
  const similarityPercent = Math.round(similarity * 100);

  // 🎯 Final Score
  const overallScore = Math.round(
    (accuracy * 0.5) + 
    (fluency * 0.2) + 
    (similarityPercent * 0.3)
  );

  // 🔥 AI-like message (VERY IMPORTANT FOR PROJECT)
  let pronunciationMessage = "";

  if (similarityPercent < 50) {
    pronunciationMessage = "Your pronunciation is quite different. Try speaking slowly and clearly.";
  } else if (similarityPercent < 80) {
    pronunciationMessage = "You're close! Focus on improving clarity and word accuracy.";
  } else {
    pronunciationMessage = "Great pronunciation! Your speech is clear and natural.";
  }

  // 🔥 Suggestions
  const wrongWords = wordLevelFeedback
    .filter(w => w.score < 60)
    .map(w => w.word);

  const improvementSuggestions = wrongWords.length > 0
    ? [`Practice these words: ${wrongWords.join(', ')}`]
    : ['Excellent work! Keep practicing to maintain your level.'];

  return {
    accuracy,
    fluency,
    overallScore,
    wordLevelFeedback,
    improvementSuggestions,
    pronunciationMessage,
    similarity: similarityPercent // 🔥 BONUS (for future UI)
  };
};