import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ProgressChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (data && data.progressByWeek) {
      // Format data for the chart
      const formattedData = data.progressByWeek.map(item => ({
        date: new Date(item.weekStarting).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        score: item.averageScore,
        practiceCount: item.practiceCount
      }));
      
      setChartData(formattedData);
    }
  }, [data]);
  
  const scoreTooltip = (value) => `Score: ${value}`;
  const countTooltip = (value) => `Sessions: ${value}`;
  
  if (!data || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
        <p className="text-gray-500">No progress data available yet. Start practicing to see your improvements!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Progress</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
              label={{ 
                value: 'Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Sessions', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke="#4C51BF"
              activeDot={{ r: 8 }}
              name="Pronunciation Score"
              strokeWidth={2}
              formatter={scoreTooltip}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="practiceCount"
              stroke="#38B2AC"
              name="Practice Sessions"
              strokeWidth={2}
              formatter={countTooltip}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-600">Average Score</p>
          <p className="text-2xl font-bold text-blue-800">{data.averageScore}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-sm text-green-600">Best Score</p>
          <p className="text-2xl font-bold text-green-800">{data.bestScore}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-md">
          <p className="text-sm text-purple-600">Total Sessions</p>
          <p className="text-2xl font-bold text-purple-800">{data.practiceCount}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-sm text-yellow-600">Improvement</p>
          <p className="text-2xl font-bold text-yellow-800">
            {data.improvementRate > 0 ? `+${data.improvementRate}%` : `${data.improvementRate}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;