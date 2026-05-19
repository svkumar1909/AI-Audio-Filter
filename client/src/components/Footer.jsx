import {
  Link
} from 'react-router-dom';

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaMicrophoneAlt
} from 'react-icons/fa';

const Footer = () => {

  return (

    <footer className="mt-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">

                <FaMicrophoneAlt className="text-white text-2xl" />

              </div>

              <div>

                <h2 className="text-3xl font-extrabold">

                  SpeakRight AI

                </h2>

                <p className="text-gray-400 text-sm">

                  AI Pronunciation Assistant

                </p>

              </div>

            </div>

            <p className="text-gray-400 leading-relaxed">

              Improve your pronunciation and fluency
              with advanced AI speech analysis and
              real-time feedback.

            </p>

          </div>

          {/* LINKS */}
          <div>

            <h3 className="text-xl font-bold mb-5">

              Navigation

            </h3>

            <div className="space-y-3">

              <Link
                to="/dashboard"
                className="block text-gray-400 hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                to="/practice"
                className="block text-gray-400 hover:text-white transition"
              >
                Practice
              </Link>

              <Link
                to="/history"
                className="block text-gray-400 hover:text-white transition"
              >
                History
              </Link>

            </div>

          </div>

          {/* FEATURES */}
          <div>

            <h3 className="text-xl font-bold mb-5">

              Features

            </h3>

            <div className="space-y-3 text-gray-400">

              <p>AI Speech Analysis</p>

              <p>Real-time Feedback</p>

              <p>Audio Recording</p>

              <p>Progress Tracking</p>

            </div>

          </div>

          {/* SOCIAL */}
          <div>

            <h3 className="text-xl font-bold mb-5">

              Connect

            </h3>

            <div className="flex gap-4">

              <a
                href="#"
                className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-blue-500 transition"
              >

                <FaGithub className="text-2xl" />

              </a>

              <a
                href="#"
                className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-pink-500 transition"
              >

                <FaInstagram className="text-2xl" />

              </a>

              <a
                href="#"
                className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-blue-600 transition"
              >

                <FaLinkedin className="text-2xl" />

              </a>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-14 pt-8 text-center text-gray-400">

          © 2026 SpeakRight AI.
          All rights reserved.

        </div>

      </div>

    </footer>
  );
};

export default Footer;