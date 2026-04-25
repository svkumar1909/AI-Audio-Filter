import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { currentUser } = useAuth();
  const slideRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const totalSlides = slideRef.current.children.length;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % totalSlides;
      const offset = currentIndex.current * -100;

      slideRef.current.style.transform = `translateX(${offset}%)`;
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">

      {/* Hero Slider with Marquee */}
      <section id="hero" className="relative w-full h-screen overflow-hidden text-white bg-black">
        {/* Slides */}
        <div
          id="heroSlides"
          ref={slideRef}
          className="absolute inset-0 flex transition-transform duration-[2000ms] ease-out"
        >
          {[
            {
              image: "/img1.jpg",
              heading: "SPEAK CLEARLY"
            },
            {
              image: "/img2.jpg",
              heading: "SOUND CONFIDENT"
            },
            {
              image: "/img3.jpg",
              heading: "BE UNDERSTOOD"
            },
            {
              image: "/microphone.jpg",
              heading: "BE LOUD"
            }
          ].map((slide, index) => (
            <div
              key={index}
              className="w-full h-screen flex-shrink-0 bg-cover bg-center relative flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold text-white animate-slideIn backdrop-blur-md bg-black/40 px-6 py-4 rounded">
                {slide.heading}
              </h2>
            </div>
          ))}
        </div>

        {/* Marquee heading */}
        <div className="absolute top-10 left-0 w-full overflow-hidden z-10">
          <h1 className="marquee text-3xl md:text-5xl font-extrabold text-white opacity-20 uppercase whitespace-nowrap">
            &nbsp;Perfect Pronunciation • Perfect Pronunciation • Perfect Pronunciation •
          </h1>
        </div>
      </section>

      {/* CTA Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 overflow-hidden mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between gap-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight drop-shadow-md">
                Perfect Your Pronunciation with AI
              </h1>
              <p className="mt-6 max-w-xl text-lg text-indigo-100 md:text-xl">
                Get instant feedback on your pronunciation using our advanced AI technology. Practice and improve your accent for any language in real-time.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {currentUser ? (
                  <Link
                    to="/practice"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300"
                  >
                    Start Practicing
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300"
                    >
                      Try For Free
                    </Link>
                    <Link
                      to="/login"
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-700 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center md:justify-end">
              <img
                className="w-full max-w-md rounded-xl shadow-2xl ring-1 ring-white/10"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsn_VImzLySeENxVU0j7bUmny4FtKOSiYYQ&s"
                alt="Person speaking into microphone"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl drop-shadow-md">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
              Improve your pronunciation in three simple steps
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {[
              {
                step: 1,
                title: "Record Your Voice",
                description:
                  "Use our recorder to capture your pronunciation of words and phrases.",
                color: "from-blue-100 to-blue-200",
              },
              {
                step: 2,
                title: "Get AI Analysis",
                description:
                  "Our AI technology instantly analyzes your pronunciation and identifies areas for improvement.",
                color: "from-purple-100 to-purple-200",
              },
              {
                step: 3,
                title: "Practice & Improve",
                description:
                  "Follow our feedback to practice and track your improvement over time.",
                color: "from-pink-100 to-pink-200",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`bg-gradient-to-br ${item.color} p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105`}
              >
                <div className="w-14 h-14 bg-white text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold shadow mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gradient-to-b from-white via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real feedback from learners and professionals around the world
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonials */}
            {[
              {
                name: "Sarah K.",
                role: "English Learner",
                quote: "This app has been a game-changer for my English pronunciation. The instant feedback helps me correct mistakes I didn't even know I was making.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHuCdtJJv3lG7XypPIxwSOELkfHlU9fsVhiQ&s"
              },
              {
                name: "Miguel R.",
                role: "Spanish Teacher",
                quote: "I recommend this tool to all my students. It gives them the confidence to practice on their own and come to class better prepared.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHQzIZOf1MpDcmljz8RxelTDgOm_X6YPlD0w&s"
              },
              {
                name: "Yuki T.",
                role: "Business Professional",
                quote: "Preparing for international presentations became so much easier with this app. My confidence in speaking English has improved significantly.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfJBmWMJVSiA2JRayIg2cbEJRleGQgFlfcEQ&s"
              }
            ].map((user, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-md">"{user.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Highlights */}
      <div className="relative bg-gray-50 overflow-hidden py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Highlights</h2>
          <div className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
            {[
              {
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                title: "Explore New Languages",
                desc: "Practice pronunciation easily.",
              },
              {
                img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                title: "Instant Feedback",
                desc: "Get real-time AI corrections.",
              },
              {
                img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
                title: "User Friendly",
                desc: "Simple & effective interface.",
              },
              {
                img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
                title: "Track Your Progress",
                desc: "Visualize your improvements.",
              },
              {
                img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
                title: "Join the Community",
                desc: "Learn with others worldwide.",
              },
            ].map(({ img, title, desc }, idx) => (
              <div
                key={idx}
                className="inline-block mr-6 w-64 rounded-lg shadow-lg bg-white overflow-hidden"
              >
                <img src={img} alt={title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-gray-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="block">Ready to improve your pronunciation?</span>
              <span className="block text-indigo-100">Start practicing today.</span>
            </h2>
          </div>
          <div className="mt-8 lg:mt-0">
            {currentUser ? (
              <Link
                to="/practice"
                className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300"
              >
                Practice Now
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
