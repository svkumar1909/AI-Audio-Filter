import React from 'react';

const AnimatedBackground = () => {

  return (

    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* TOP LEFT */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* TOP RIGHT */}
      <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* CENTER */}
      <div className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] bg-pink-500/10 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>

      {/* BOTTOM */}
      <div className="absolute bottom-0 left-1/3 w-[25rem] h-[25rem] bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

    </div>
  );
};

export default AnimatedBackground;