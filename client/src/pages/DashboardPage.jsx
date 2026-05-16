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
        const data = await fetchUserRecordings();
        const userRecordings = Array.isArray(data) ? data : [];

        setRecordings(userRecordings);

        if (userRecordings.length > 0) {
          const totalPractices = userRecordings.length;

          const totalScore = userRecordings.reduce(
            (sum, rec) => sum + (rec.overallScore || 0),
            0
          );

          const averageScore = totalScore / totalPractices;

          const bestScore = Math.max(
            ...userRecordings.map(rec => rec.overallScore || 0)
          );

          const recentRecordings = userRecordings.slice(0, 5);
          const previousRecordings = userRecordings.slice(5, 10);

          let recentImprovementRate = 0;

          if (previousRecordings.length > 0) {
            const recentAvg =
              recentRecordings.reduce((sum, r) => sum + (r.overallScore || 0), 0) /
              recentRecordings.length;

            const prevAvg =
              previousRecordings.reduce((sum, r) => sum + (r.overallScore || 0), 0) /
              previousRecordings.length;

            if (prevAvg !== 0) {
              recentImprovementRate = ((recentAvg - prevAvg) / prevAvg) * 100;
            }
          }

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

  // 🔥 GROUP FUNCTION
  const groupRecordingsByDay = (recordings) => {
    const grouped = {};

    recordings.forEach(rec => {
      const date = new Date(rec.createdAt).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = { count: 0, totalScore: 0 };
      }

      grouped[date].count += 1;
      grouped[date].totalScore += rec.overallScore || 0;
    });

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      count: data.count,
      averageScore: data.totalScore / data.count
    }));
  };

  const getChartData = () => {
    return stats.practicesByDay.slice(0, 14).reverse();
  };

  // 🔥 NEW SMART TEXT
  const improvementText =
    parseFloat(stats.recentImprovementRate) > 0
      ? `You improved +${stats.recentImprovementRate}% this week 🔥`
      : stats.totalPractices > 0
      ? `Keep practicing to improve 🚀`
      : `Start practicing to see your progress`;

  const streak = Math.min(stats.totalPractices, 7);

  // 🔥 SCORE COLOR FUNCTION
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {error && (
        <div className="bg-red-100 p-4 rounded mb-6 text-red-600">
          {error}
        </div>
      )}

      {/* Welcome */}
      <div className="bg-blue-600 text-white p-6 rounded mb-6">
        <h2 className="text-2xl">
          Welcome back, {currentUser?.name || 'User'}!
        </h2>
      </div>

      {/* 🔥 AI FEEDBACK */}
      <div className="bg-green-50 p-4 rounded mb-4 text-green-700 font-medium">
        {improvementText}
      </div>

      <div className="bg-yellow-50 p-4 rounded mb-8 text-yellow-700 font-medium">
        🔥 Practice Streak: {streak} days
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total Practices</p>
          <h2 className="text-2xl font-bold">{stats.totalPractices}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Average Score</p>
          <h2 className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}/100
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Best Score</p>
          <h2 className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
            {stats.bestScore}/100
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Improvement</p>
          <h2 className="text-2xl font-bold">
            {stats.recentImprovementRate}%
          </h2>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <ProgressChart data={getChartData()} />
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="mb-4 text-xl">Recent Practice Sessions</h2>

        {recordings.length === 0 ? (
          <p>No recordings yet</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr>
                <th>Date</th>
                <th>Phrase</th>
                <th>Score</th>
                <th>Accuracy</th>
                <th>Fluency</th>
              </tr>
            </thead>

            <tbody>
              {recordings.slice(0, 10).map((rec, i) => (
                <tr key={i}>
                  <td>{new Date(rec.createdAt).toLocaleDateString()}</td>

                  <td>{(rec.originalText || '').slice(0, 30)}</td>

                  <td>
                    <span className={`px-2 py-1 rounded text-white text-sm ${
                      rec.overallScore >= 80 ? 'bg-green-500' :
                      rec.overallScore >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {rec.overallScore || 0}
                    </span>
                  </td>

                  <td>{rec.accuracy || 0}</td>
                  <td>{rec.fluency || 0}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
}

export default DashboardPage;