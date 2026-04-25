import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../hooks/useAudio';
import ProgressChart from '../components/ProgressChart';

function DashboardPage() {
  const { currentUser } = useAuth();
  const { fetchUserRecordings } = useAudio();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPractices: 0,
    averageScore: 0,
    bestScore: 0,
    recentImprovementRate: 0,
    practicesByDay: []
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userRecordings = await fetchUserRecordings();
        setRecordings(userRecordings);
        
        // Calculate statistics
        if (userRecordings && userRecordings.length > 0) {
          // Total number of practices
          const totalPractices = userRecordings.length;
          
          // Average score
          const totalScore = userRecordings.reduce((sum, rec) => sum + rec.overallScore, 0);
          const averageScore = totalScore / totalPractices;
          
          // Best score
          const bestScore = Math.max(...userRecordings.map(rec => rec.overallScore));
          
          // Recent improvement (compare last 5 with previous 5)
          const recentRecordings = userRecordings.slice(0, 5);
          const previousRecordings = userRecordings.slice(5, 10);
          
          let recentImprovementRate = 0;
          if (previousRecordings.length > 0) {
            const recentAvg = recentRecordings.reduce((sum, rec) => sum + rec.overallScore, 0) / recentRecordings.length;
            const prevAvg = previousRecordings.reduce((sum, rec) => sum + rec.overallScore, 0) / previousRecordings.length;
            recentImprovementRate = ((recentAvg - prevAvg) / prevAvg) * 100;
          }
          
          // Group by day for chart
          const practicesByDay = groupRecordingsByDay(userRecordings);
          
          setStats({
            totalPractices,
            averageScore: averageScore.toFixed(1),
            bestScore: bestScore.toFixed(1),
            recentImprovementRate: recentImprovementRate.toFixed(1),
            practicesByDay
          });
        }
      } catch (err) {
        setError('Failed to load your practice data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [fetchUserRecordings]);
  
  // Helper function to group recordings by day
  const groupRecordingsByDay = (recordings) => {
    const grouped = {};
    
    recordings.forEach(rec => {
      const date = new Date(rec.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = {
          count: 0,
          totalScore: 0
        };
      }
      
      grouped[date].count += 1;
      grouped[date].totalScore += rec.overallScore;
    });
    
    // Convert to array format for chart
    return Object.entries(grouped).map(([date, data]) => ({
      date,
      count: data.count,
      averageScore: data.totalScore / data.count
    }));
  };
  
  // Get data for progress chart
  const getChartData = () => {
    return stats.practicesByDay.slice(0, 14).reverse();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-medium">Welcome back, {currentUser?.displayName || 'User'}!</h2>
        <p className="mt-2">Track your pronunciation progress and keep improving.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Practices</h3>
          <p className="text-3xl font-bold">{stats.totalPractices}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Average Score</h3>
          <p className="text-3xl font-bold">{stats.averageScore}<span className="text-lg">/100</span></p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Best Score</h3>
          <p className="text-3xl font-bold">{stats.bestScore}<span className="text-lg">/100</span></p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Recent Improvement</h3>
          <p className={`text-3xl font-bold ${parseFloat(stats.recentImprovementRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(stats.recentImprovementRate) >= 0 ? '+' : ''}{stats.recentImprovementRate}%
          </p>
        </div>
      </div>
      
      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-medium mb-4">Your Progress</h2>
        <div className="h-80">
          <ProgressChart data={getChartData()} />
        </div>
      </div>
      
      {/* Recent Recordings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Recent Practice Sessions</h2>
        
        {recordings.length === 0 ? (
          <p className="text-gray-500">You haven't recorded any practice sessions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phrase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fluency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recordings.slice(0, 10).map((recording, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(recording.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recording.targetText.length > 30 
                        ? `${recording.targetText.substring(0, 30)}...` 
                        : recording.targetText}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span 
                        className={`px-2 py-1 rounded-full text-white 
                          ${recording.overallScore >= 80 ? 'bg-green-500' : 
                            recording.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      >
                        {recording.overallScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recording.accuracy}/100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recording.fluency}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;