// Format date to ISO string without milliseconds
export const formatDate = (date) => {
  return new Date(date).toISOString().split('.')[0] + 'Z';
};

// Format file size to human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration in seconds to MM:SS format
export const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format API response
export const formatApiResponse = (data, message = null) => {
  return {
    success: true,
    message,
    data
  };
};

// Format error response
export const formatErrorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors
  };
};

// Format pronunciation feedback
export const formatPronunciationFeedback = (analysis) => {
  // Format overall result
  const result = {
    score: analysis.overallScore,
    classification: analysis.scoreClassification,
    feedback: getFeedbackMessage(analysis.scoreClassification),
    wordAnalysis: []
  };
  
  // Format word-level feedback
  if (analysis.wordLevelFeedback && analysis.wordLevelFeedback.length > 0) {
    result.wordAnalysis = analysis.wordLevelFeedback.map(word => {
      return {
        word: word.word,
        score: word.score,
        feedback: getWordFeedback(word.score),
        timeMarkers: {
          start: word.startTime,
          end: word.endTime
        }
      };
    });
  }
  
  // Add improvement suggestions
  result.improvementSuggestions = analysis.improvementSuggestions || [];
  
  return result;
};

// Helper function to get feedback message based on score classification
function getFeedbackMessage(classification) {
  switch (classification) {
    case 'excellent':
      return "Excellent pronunciation! Your speech is very clear and natural.";
    case 'good':
      return "Good pronunciation! You're doing well with a few areas to improve.";
    case 'fair':
      return "Fair pronunciation. Keep practicing to improve clarity and rhythm.";
    case 'needsWork':
      return "Needs work. Focus on the highlighted words and keep practicing.";
    default:
      return "Keep practicing to improve your pronunciation.";
  }
}

// Helper function to get word-level feedback
function getWordFeedback(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Focus on this word";
}

// Format user progress data for charts
export const formatProgressForChart = (progressData) => {
  if (!progressData.progressByWeek || progressData.progressByWeek.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  const labels = progressData.progressByWeek.map(week => 
    new Date(week.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  
  const scoreData = progressData.progressByWeek.map(week => week.averageScore);
  const practiceData = progressData.progressByWeek.map(week => week.practiceCount);
  
  return {
    labels,
    datasets: [
      {
        label: 'Average Score',
        data: scoreData,
        borderColor: '#4C51BF',
        backgroundColor: 'rgba(76, 81, 191, 0.2)'
      },
      {
        label: 'Practice Count',
        data: practiceData,
        borderColor: '#38B2AC',
        backgroundColor: 'rgba(56, 178, 172, 0.2)'
      }
    ]
  };
};