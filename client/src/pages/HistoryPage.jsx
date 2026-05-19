import {
  useState,
  useEffect
} from 'react';

import {
  FaHistory,
  FaPlayCircle,
  FaChartLine
} from 'react-icons/fa';

import {
  audioService
} from '../services/audioService';

import ProgressChart
from '../components/ProgressChart';

import {
  formatDate
} from '../utils/formatters';

const HistoryPage = () => {

  const [recordings, setRecordings] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    fetchRecordings();

  }, []);

  const fetchRecordings =
    async () => {

      try {

        setIsLoading(true);

        const data =
          await audioService.getUserRecordings();

        setRecordings(data);

        setError(null);

      } catch (err) {

        console.log(err);

        setError(
          'Failed to load recordings'
        );

      } finally {

        setIsLoading(false);
      }
    };

  // Average score
  const averageScore =
    recordings.length > 0

      ? recordings.reduce(
          (sum, rec) =>
            sum + (rec.overallScore || 0),
          0
        ) / recordings.length

      : 0;

  // Chart Data
  const chartData =
    recordings.map((item) => ({

      date:
        new Date(
          item.createdAt
        ).toLocaleDateString(),

      averageScore:
        item.overallScore || 0
    }));

  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-3xl font-bold gradient-text">

            Loading History...

          </h2>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="premium-card p-10 mb-10 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <div className="flex items-center gap-5 mb-5">

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">

                <FaHistory className="text-white text-4xl" />

              </div>

              <div>

                <h1 className="text-5xl font-extrabold gradient-text">

                  Pronunciation History

                </h1>

                <p className="text-gray-500 text-lg mt-2">

                  Review all your practice sessions and track your growth.

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-700 p-5 rounded-3xl mb-8 shadow-lg">

            {error}

          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* TOTAL */}
          <div className="premium-card p-8">

            <h3 className="text-gray-500 text-lg mb-3">

              Total Sessions

            </h3>

            <p className="text-6xl font-extrabold gradient-text">

              {recordings.length}

            </p>

          </div>

          {/* AVERAGE */}
          <div className="premium-card p-8">

            <h3 className="text-gray-500 text-lg mb-3">

              Average Score

            </h3>

            <p className="text-6xl font-extrabold text-green-500">

              {averageScore.toFixed(0)}

            </p>

          </div>

          {/* BEST */}
          <div className="premium-card p-8">

            <h3 className="text-gray-500 text-lg mb-3">

              Best Performance

            </h3>

            <p className="text-6xl font-extrabold text-purple-500">

              {
                recordings.length > 0
                  ? Math.max(
                      ...recordings.map(
                        r =>
                          r.overallScore || 0
                      )
                    )
                  : 0
              }

            </p>

          </div>

        </div>

        {/* CHART */}
        <div className="premium-card p-8 mb-10">

          <div className="flex items-center gap-4 mb-8">

            <FaChartLine className="text-3xl text-blue-600" />

            <h2 className="text-3xl font-bold">

              Performance Analytics

            </h2>

          </div>

          <div className="h-80">

            {chartData.length > 0 ? (

              <ProgressChart
                data={chartData}
              />

            ) : (

              <div className="h-full flex items-center justify-center text-gray-400 text-xl">

                No chart data available

              </div>
            )}

          </div>

        </div>

        {/* RECORDINGS */}
        <div className="premium-card p-8">

          <h2 className="text-3xl font-bold mb-8">

            Recording Timeline

          </h2>

          {recordings.length === 0 ? (

            <div className="text-center py-20">

              <div className="text-8xl mb-6">
                🎤
              </div>

              <h3 className="text-3xl font-bold text-gray-700 mb-4">

                No Recordings Yet

              </h3>

              <p className="text-gray-500 text-lg">

                Start practicing to build your pronunciation history.

              </p>

            </div>

          ) : (

            <div className="space-y-8">

              {recordings.map(
                (recording) => (

                  <div
                    key={recording._id}
                    className="glass rounded-3xl p-8 border border-white/30 hover:scale-[1.01] transition-all duration-300"
                  >

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                      {/* LEFT */}
                      <div className="flex-1">

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">

                          {
                            recording.originalText ||
                            'Practice Session'
                          }

                        </h3>

                        <div className="space-y-3">

                          <p className="text-gray-500">

                            <span className="font-semibold">
                              Transcript:
                            </span>

                            {' '}

                            {
                              recording.transcription ||
                              'No transcript available'
                            }

                          </p>

                          <p className="text-blue-500 font-medium">

                            Detected Language:
                            {' '}
                            {recording.language}

                          </p>

                          <p className="text-gray-500">

                            <span className="font-semibold">
                              Date:
                            </span>

                            {' '}

                            {
                              formatDate(
                                recording.createdAt
                              )
                            }

                          </p>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col items-center gap-6">

                        {/* SCORE */}
                        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">

                          <div className="text-center">

                            <p className="text-3xl font-extrabold text-white">

                              {
                                recording.overallScore || 0
                              }

                            </p>

                            <p className="text-xs text-blue-100">

                              SCORE

                            </p>

                          </div>

                        </div>

                        {/* AUDIO */}
                        {recording.filePath && (

                          <div className="w-72">

                            <div className="flex items-center gap-3 mb-3">

                              <FaPlayCircle className="text-blue-600 text-2xl" />

                              <p className="font-semibold text-gray-700">

                                Audio Playback

                              </p>

                            </div>

                            <audio
                              controls
                              className="w-full rounded-xl"
                              preload="metadata"
                            >

                              <source
                                src={`http://localhost:5000/uploads/${recording.filePath}`}
                                type="audio/webm"
                              />

                              Your browser does not support audio.

                            </audio>

                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default HistoryPage;