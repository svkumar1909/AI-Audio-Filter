import {
  useEffect,
  useState
} from 'react';

import {
  FaMicrophone,
  FaChartLine,
  FaTrophy,
  FaArrowUp,
  FaBrain,
  FaFire
} from 'react-icons/fa';

import {
  audioService
} from '../services/audioService';

const DashboardPage = () => {

  const [stats, setStats] =
    useState({

      totalPractices: 0,

      averageScore: 0,

      bestScore: 0,

      improvement: 0
    });

  const [recentRecordings, setRecentRecordings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ====================================
  // 🎯 PRACTICE SESSIONS
  // ====================================

  const practiceSessions =
    recentRecordings.filter(
      item => item.originalText
    );

  // ====================================
  // 🧠 SPEECH SESSIONS
  // ====================================

  const speechSessions =
    recentRecordings.filter(
      item => !item.originalText
    );

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        const recordings =
          await audioService.getUserRecordings();

        setRecentRecordings(
          recordings.slice(0, 5)
        );

        if (
          !recordings ||
          recordings.length === 0
        ) {

          setStats({

            totalPractices: 0,

            averageScore: 0,

            bestScore: 0,

            improvement: 0
          });

          return;
        }

        const totalPractices =
          recordings.length;

        const averageScore =
          recordings.reduce(
            (sum, rec) =>
              sum +
              (rec.overallScore || 0),
            0
          ) / totalPractices;

        const bestScore =
          Math.max(
            ...recordings.map(
              rec =>
                rec.overallScore || 0
            )
          );

        let improvement = 0;

        if (
          recordings.length >= 2
        ) {

          const latest =
            recordings[0]
              .overallScore || 0;

          const oldest =
            recordings[
              recordings.length - 1
            ].overallScore || 0;

          improvement =
            latest - oldest;
        }

        setStats({

          totalPractices,

          averageScore,

          bestScore,

          improvement
        });

      } catch (err) {

        console.log(err);

        setError(
          'Failed to load dashboard'
        );

      } finally {

        setLoading(false);
      }
    };

  // ====================================
  // ⏳ LOADING
  // ====================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-4xl font-bold gradient-text">

            Loading Dashboard...

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

          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <div className="flex items-center gap-4 mb-5">

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl glow-animation">

                    <FaBrain className="text-white text-4xl" />

                  </div>

                  <div>

                    <h1 className="text-6xl font-extrabold gradient-text">

                      AI Dashboard

                    </h1>

                    <p className="text-gray-500 text-xl mt-2">

                      Track your pronunciation journey with AI insights.

                    </p>

                  </div>

                </div>

              </div>

              {/* SCORE CIRCLE */}
              <div className="flex justify-center">

                <div className="w-52 h-52 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_20px_60px_rgba(99,102,241,0.4)] floating">

                  <div className="w-40 h-40 rounded-full bg-white flex flex-col items-center justify-center">

                    <p className="text-6xl font-extrabold gradient-text">

                      {stats.averageScore.toFixed(0)}

                    </p>

                    <p className="text-gray-500 font-semibold">

                      Average Score

                    </p>

                  </div>

                </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">

          {/* TOTAL */}
          <div className="premium-card p-8">

            <div className="flex items-center justify-between mb-6">

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                <FaMicrophone className="text-blue-600 text-3xl" />

              </div>

              <span className="text-sm text-blue-600 font-semibold">

                ACTIVE

              </span>

            </div>

            <h3 className="text-gray-500 text-lg mb-3">

              Total Sessions

            </h3>

            <p className="text-6xl font-extrabold text-gray-800">

              {stats.totalPractices}

            </p>

          </div>

          {/* AVG */}
          <div className="premium-card p-8">

            <div className="flex items-center justify-between mb-6">

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                <FaChartLine className="text-green-600 text-3xl" />

              </div>

              <span className="text-sm text-green-600 font-semibold">

                AI SCORE

              </span>

            </div>

            <h3 className="text-gray-500 text-lg mb-3">

              Average Score

            </h3>

            <p className="text-6xl font-extrabold text-green-600">

              {stats.averageScore.toFixed(0)}

            </p>

          </div>

          {/* BEST */}
          <div className="premium-card p-8">

            <div className="flex items-center justify-between mb-6">

              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <FaTrophy className="text-yellow-600 text-3xl" />

              </div>

              <span className="text-sm text-yellow-600 font-semibold">

                BEST

              </span>

            </div>

            <h3 className="text-gray-500 text-lg mb-3">

              Highest Score

            </h3>

            <p className="text-6xl font-extrabold text-yellow-500">

              {stats.bestScore}

            </p>

          </div>

          {/* IMPROVEMENT */}
          <div className="premium-card p-8">

            <div className="flex items-center justify-between mb-6">

              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">

                <FaArrowUp className="text-purple-600 text-3xl" />

              </div>

              <span className="text-sm text-purple-600 font-semibold">

                GROWTH

              </span>

            </div>

            <h3 className="text-gray-500 text-lg mb-3">

              Improvement

            </h3>

            <p className="text-6xl font-extrabold text-purple-600">

              {stats.improvement}

            </p>

          </div>

        </div>

        {/* DUAL AI ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* PRACTICE */}
          <div className="premium-card p-8 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl shadow-xl">

                  🎯

                </div>

                <div>

                  <h2 className="text-3xl font-extrabold">

                    Pronunciation Trainer

                  </h2>

                  <p className="text-gray-500">

                    Practice analytics

                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div className="glass rounded-3xl p-6 text-center">

                  <h3 className="text-5xl font-extrabold text-blue-600 mb-3">

                    {practiceSessions.length}

                  </h3>

                  <p className="text-gray-500 font-medium">

                    Sessions

                  </p>

                </div>

                <div className="glass rounded-3xl p-6 text-center">

                  <h3 className="text-5xl font-extrabold text-cyan-600 mb-3">

                    {
                      practiceSessions.length > 0
                        ? Math.round(
                            practiceSessions.reduce(
                              (sum, item) =>
                                sum +
                                (item.overallScore || 0),
                              0
                            ) / practiceSessions.length
                          )
                        : 0
                    }

                  </h3>

                  <p className="text-gray-500 font-medium">

                    Avg Score

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* SPEECH */}
          <div className="premium-card p-8 relative overflow-hidden">

            <div className="absolute bottom-0 left-0 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl shadow-xl">

                  🧠

                </div>

                <div>

                  <h2 className="text-3xl font-extrabold">

                    Speech Intelligence

                  </h2>

                  <p className="text-gray-500">

                    AI analytics

                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div className="glass rounded-3xl p-6 text-center">

                  <h3 className="text-5xl font-extrabold text-purple-600 mb-3">

                    {speechSessions.length}

                  </h3>

                  <p className="text-gray-500 font-medium">

                    Sessions

                  </p>

                </div>

                <div className="glass rounded-3xl p-6 text-center">

                  <h3 className="text-5xl font-extrabold text-pink-600 mb-3">

                    {
                      speechSessions.length > 0
                        ? Math.round(
                            speechSessions.reduce(
                              (sum, item) =>
                                sum +
                                (item.overallScore || 0),
                              0
                            ) / speechSessions.length
                          )
                        : 0
                    }

                  </h3>

                  <p className="text-gray-500 font-medium">

                    Avg Score

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RECENT */}
        <div className="premium-card p-10">

          <div className="flex items-center gap-4 mb-10">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center shadow-xl">

              <FaFire className="text-white text-3xl" />

            </div>

            <div>

              <h2 className="text-4xl font-bold">

                Recent Sessions

              </h2>

              <p className="text-gray-500 text-lg">

                Your latest AI analyses

              </p>

            </div>

          </div>

          {recentRecordings.length === 0 ? (

            <div className="text-center py-20">

              <div className="text-8xl mb-6">
                🎤
              </div>

              <h3 className="text-3xl font-bold text-gray-700 mb-4">

                No Sessions Yet

              </h3>

            </div>

          ) : (

            <div className="space-y-8">

              {recentRecordings.map(
                (recording) => (

                  <div
                    key={recording._id}
                    className="glass rounded-3xl p-8 hover:scale-[1.01] transition-all duration-300"
                  >

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-4 mb-4">

                          <h3 className="text-2xl font-bold text-gray-800">

                            {
                              recording.originalText ||
                              'Speech Analysis Session'
                            }

                          </h3>

                        </div>

                        <p className="text-gray-500 mb-3 leading-relaxed">

                          {
                            recording.transcription ||
                            'No transcription available'
                          }

                        </p>

                        <p className="text-blue-500 mb-3 font-medium">

                          Language: {recording.language}

                        </p>

                      </div>

                      <div className="flex flex-col items-center gap-6">

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

                        {recording.filePath && (

                          <div className="w-72">

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

export default DashboardPage;