import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';
import ProgressChart from '../components/ProgressChart';
import { formatDate } from '../utils/formatters';

const HistoryPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true);
        const data = await audioService.getUserRecordings(1, 50, filter);
        setRecordings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recording history:', err);
        setError('Failed to load your pronunciation history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Calculate average score
  const averageScore = recordings.length 
    ? recordings.reduce((sum, rec) => sum + rec.score, 0) / recordings.length 
    : 0;

  // Group recordings by date for the chart
  const chartData = recordings.reduce((acc, recording) => {
    const date = new Date(recording.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        averageScore: recording.score,
        count: 1
      };
    } else {
      acc[date].averageScore = (acc[date].averageScore * acc[date].count + recording.score) / (acc[date].count + 1);
      acc[date].count += 1;
    }
    return acc;
  }, {});

  const processedChartData = Object.values(chartData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Pronunciation History</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Total Recordings: <span className="font-semibold">{recordings.length}</span></p>
            <p className="text-gray-600">Average Score: <span className="font-semibold">{averageScore.toFixed(1)}/10</span></p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFilterChange('all')}
            >
              All Time
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFilterChange('month')}
            >
              Last Month
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFilterChange('week')}
            >
              Last Week
            </button>
          </div>
        </div>
        
        <div className="h-64">
          {processedChartData.length > 0 ? (
            <ProgressChart data={processedChartData} />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No data available for the selected period</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Recording History</h2>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <p>Loading your recordings...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="p-6 text-center">
            <p>No recordings found for the selected period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word/Phrase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recordings.map((recording) => (
                  <tr key={recording._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{recording.word}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(recording.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 rounded text-sm ${
                          recording.score >= 8 ? 'bg-green-100 text-green-800' : 
                          recording.score >= 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {recording.score.toFixed(1)}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">{recording.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;