import { Link } from 'react-router-dom';

import {
  motion
} from 'framer-motion';

import {
  FaMicrophoneAlt,
  FaBrain,
  FaChartLine,
  FaGlobe,
  FaStar,
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaHeadphones
} from 'react-icons/fa';

import {
  useAuth
} from '../context/AuthContext';

function HomePage() {

  const {
    currentUser
  } = useAuth();

  const features = [

    {
      icon: <FaMicrophoneAlt />,
      title: 'Real-Time Voice Recording',
      desc: 'Capture your pronunciation instantly using advanced audio recording.'
    },

    {
      icon: <FaBrain />,
      title: 'AI Speech Analysis',
      desc: 'Our AI evaluates pronunciation, fluency, and speaking confidence.'
    },

    {
      icon: <FaChartLine />,
      title: 'Track Progress',
      desc: 'Visualize your improvement journey through analytics and scoring.'
    },

    {
      icon: <FaGlobe />,
      title: 'Multi Language Practice',
      desc: 'Practice speaking confidently in multiple languages.'
    }
  ];

  const testimonials = [

    {
      name: 'Sarah Johnson',
      role: 'English Learner',
      image:
        'https://randomuser.me/api/portraits/women/44.jpg',

      quote:
        'This AI platform completely transformed my pronunciation confidence.'
    },

    {
      name: 'Miguel Rodriguez',
      role: 'Business Professional',
      image:
        'https://randomuser.me/api/portraits/men/32.jpg',

      quote:
        'The real-time pronunciation analysis feels futuristic and incredibly useful.'
    },

    {
      name: 'Yuki Tanaka',
      role: 'Student',
      image:
        'https://randomuser.me/api/portraits/women/68.jpg',

      quote:
        'The dashboard and progress tracking motivated me to practice daily.'
    }
  ];

  return (

    <div className="relative overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <motion.div
              initial={{
                opacity: 0,
                y: 50
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.8
              }}
            >

              <div className="inline-flex items-center gap-3 glass px-5 py-3 rounded-full shadow-xl mb-8">

                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

                <span className="font-semibold text-gray-700">

                  AI Powered Pronunciation Platform

                </span>

              </div>

              <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight mb-8">

                Speak With

                <span className="gradient-text block">

                  Confidence

                </span>

              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">

                Improve pronunciation using AI-powered speech analysis,
                instant feedback, fluency scoring, and smart voice evaluation.

              </p>

              <div className="flex flex-wrap gap-5">

                {currentUser ? (

                  <Link
                    to="/practice"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                  >

                    Start Practicing

                  </Link>

                ) : (

                  <>

                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                    >

                      Get Started Free

                    </Link>

                    <Link
                      to="/login"
                      className="glass px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-all duration-300"
                    >

                      Login

                    </Link>

                  </>
                )}

              </div>

            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 1
              }}
              className="relative flex justify-center"
            >

              <motion.div
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                className="premium-card p-10 w-full max-w-lg"
              >

                <div className="flex justify-center mb-10">

                  <div className="w-44 h-44 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_20px_60px_rgba(99,102,241,0.4)] glow-animation">

                    <FaMicrophoneAlt className="text-white text-7xl" />

                  </div>

                </div>

                <div className="space-y-4">

                  <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>

                  <div className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-5/6 animate-pulse"></div>

                  <div className="h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-4/6 animate-pulse"></div>

                </div>

                <div className="mt-10 grid grid-cols-3 gap-5">

                  <div className="glass rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-bold text-blue-600">
                      95%
                    </h3>

                    <p className="text-gray-500">
                      Accuracy
                    </p>

                  </div>

                  <div className="glass rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-bold text-purple-600">
                      92%
                    </h3>

                    <p className="text-gray-500">
                      Fluency
                    </p>

                  </div>

                  <div className="glass rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-bold text-pink-600">
                      AI
                    </h3>

                    <p className="text-gray-500">
                      Powered
                    </p>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                value: '10K+',
                label: 'Practice Sessions'
              },
              {
                value: '95%',
                label: 'AI Accuracy'
              },
              {
                value: '50+',
                label: 'Countries'
              },
              {
                value: '24/7',
                label: 'AI Availability'
              }
            ].map((item, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  scale: 1.03
                }}
                className="premium-card p-10 text-center"
              >

                <h2 className="text-6xl font-extrabold gradient-text mb-4">

                  {item.value}

                </h2>

                <p className="text-gray-500 text-xl">

                  {item.label}

                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-extrabold mb-6">

              Why Choose SpeakRight AI

            </h2>

            <p className="text-xl text-gray-500 max-w-3xl mx-auto">

              Experience advanced pronunciation training powered by artificial intelligence.

            </p>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

            {features.map((feature, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  scale: 1.03
                }}
                className="premium-card p-8"
              >

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl mb-8 shadow-2xl">

                  {feature.icon}

                </div>

                <h3 className="text-2xl font-bold mb-4">

                  {feature.title}

                </h3>

                <p className="text-gray-500 leading-relaxed">

                  {feature.desc}

                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* EXTRA BENEFITS */}
      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-extrabold mb-6">

              Premium AI Experience

            </h2>

            <p className="text-xl text-gray-500">

              Everything you need to master pronunciation

            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {[
              {
                icon: <FaRocket />,
                title: 'Fast AI Processing',
                desc: 'Instant analysis with lightning-fast AI response.'
              },
              {
                icon: <FaShieldAlt />,
                title: 'Secure Storage',
                desc: 'Your recordings are stored safely and securely.'
              },
              {
                icon: <FaHeadphones />,
                title: 'Smart Audio Analysis',
                desc: 'Detailed speech breakdown with intelligent suggestions.'
              }
            ].map((item, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -10
                }}
                className="premium-card p-10 text-center"
              >

                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl mx-auto mb-8">

                  {item.icon}

                </div>

                <h3 className="text-3xl font-bold mb-5">

                  {item.title}

                </h3>

                <p className="text-gray-500 text-lg leading-relaxed">

                  {item.desc}

                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* DASHBOARD SHOWCASE */}
      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <motion.div
              initial={{
                opacity: 0,
                x: -50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.8
              }}
            >

              <h2 className="text-6xl font-extrabold mb-8 leading-tight">

                Powerful Analytics

                <span className="gradient-text block">

                  Smart Dashboard

                </span>

              </h2>

              <p className="text-xl text-gray-500 leading-relaxed mb-10">

                Track pronunciation progress, fluency scores, speaking consistency,
                and AI-generated feedback.

              </p>

              <div className="space-y-6">

                {[
                  'AI pronunciation scoring',
                  'Voice history tracking',
                  'Real-time feedback',
                  'Progress visualization'
                ].map((point, index) => (

                  <div
                    key={index}
                    className="glass rounded-2xl p-5 flex items-center gap-4"
                  >

                    <FaCheckCircle className="text-green-500 text-2xl" />

                    <p className="text-lg font-semibold text-gray-700">

                      {point}

                    </p>

                  </div>
                ))}

              </div>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.8
              }}
            >

              <div className="premium-card p-10">

                <div className="space-y-5 mb-10">

                  <div className="h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

                  <div className="h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-5/6"></div>

                  <div className="h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-4/6"></div>

                  <div className="h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-3/6"></div>

                </div>

                <div className="grid grid-cols-2 gap-5">

                  <div className="glass rounded-2xl p-5 text-center">

                    <h4 className="text-4xl font-extrabold text-blue-600">

                      95

                    </h4>

                    <p className="text-gray-500">

                      Accuracy

                    </p>

                  </div>

                  <div className="glass rounded-2xl p-5 text-center">

                    <h4 className="text-4xl font-extrabold text-purple-600">

                      92

                    </h4>

                    <p className="text-gray-500">

                      Fluency

                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-extrabold mb-6">

              Loved By Learners

            </h2>

            <p className="text-xl text-gray-500">

              Real experiences from our users

            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {testimonials.map((user, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -10
                }}
                className="premium-card p-8"
              >

                <div className="flex items-center gap-4 mb-6">

                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-4 border-blue-100"
                  />

                  <div>

                    <h3 className="text-xl font-bold">

                      {user.name}

                    </h3>

                    <p className="text-gray-500">

                      {user.role}

                    </p>

                  </div>

                </div>

                <div className="flex gap-1 mb-5">

                  {[...Array(5)].map((_, i) => (

                    <FaStar
                      key={i}
                      className="text-yellow-400"
                    />
                  ))}

                </div>

                <p className="text-gray-600 leading-relaxed italic">

                  "{user.quote}"

                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="py-28">

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-extrabold mb-6">

              Frequently Asked Questions

            </h2>

            <p className="text-xl text-gray-500">

              Everything you need to know

            </p>

          </div>

          <div className="space-y-8">

            {[
              {
                q: 'How does AI analyze pronunciation?',
                a: 'Our AI compares speech patterns, pronunciation, and fluency to provide smart feedback.'
              },
              {
                q: 'Can I track my progress?',
                a: 'Yes. Your dashboard stores recordings, analytics, and pronunciation scores.'
              },
              {
                q: 'Does it support multiple languages?',
                a: 'Yes. SpeakRight AI supports multiple language pronunciation practice.'
              }
            ].map((item, index) => (

              <motion.div
                key={index}
                whileHover={{
                  scale: 1.02
                }}
                className="premium-card p-8"
              >

                <h3 className="text-2xl font-bold mb-4">

                  {item.q}

                </h3>

                <p className="text-gray-500 text-lg leading-relaxed">

                  {item.a}

                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-28">

        <div className="max-w-6xl mx-auto px-6">

          <div className="premium-card p-16 text-center relative overflow-hidden">

            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <h2 className="text-6xl font-extrabold mb-8">

                Ready To Transform

                <span className="gradient-text block">

                  Your Pronunciation?

                </span>

              </h2>

              <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">

                Join thousands of learners improving their speaking confidence using AI-powered pronunciation analysis.

              </p>

              <Link
                to={
                  currentUser
                    ? '/practice'
                    : '/register'
                }
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300"
              >

                Start Your Journey

              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;