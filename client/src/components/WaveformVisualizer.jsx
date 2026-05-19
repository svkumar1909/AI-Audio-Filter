import React, {
  useRef,
  useEffect
} from 'react';

const WaveformVisualizer = ({
  data = [],
  isRecording
}) => {

  const canvasRef =
    useRef(null);

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext('2d');

    const width =
      canvas.width;

    const height =
      canvas.height;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    // background
    const bgGradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    bgGradient.addColorStop(
      0,
      '#eef2ff'
    );

    bgGradient.addColorStop(
      1,
      '#f5f3ff'
    );

    ctx.fillStyle = bgGradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    // flat line
    if (
      !isRecording &&
      data.length === 0
    ) {

      ctx.beginPath();

      ctx.moveTo(
        0,
        height / 2
      );

      ctx.lineTo(
        width,
        height / 2
      );

      ctx.strokeStyle =
        '#cbd5e1';

      ctx.lineWidth = 3;

      ctx.stroke();

      return;
    }

    const barWidth =
      width / data.length;

    const centerY =
      height / 2;

    data.forEach(
      (value, index) => {

        const barHeight =
          (value / 255) *
          (height * 0.9);

        const x =
          index * barWidth;

        const gradient =
          ctx.createLinearGradient(
            0,
            0,
            0,
            height
          );

        if (isRecording) {

          gradient.addColorStop(
            0,
            '#ef4444'
          );

          gradient.addColorStop(
            1,
            '#ec4899'
          );

        } else {

          gradient.addColorStop(
            0,
            '#6366f1'
          );

          gradient.addColorStop(
            1,
            '#8b5cf6'
          );
        }

        ctx.fillStyle = gradient;

        const halfHeight =
          barHeight / 2;

        ctx.beginPath();

        ctx.roundRect(
          x,
          centerY - halfHeight,
          barWidth - 2,
          barHeight,
          10
        );

        ctx.fill();
      }
    );

    // glow line
    if (isRecording) {

      ctx.beginPath();

      ctx.moveTo(
        0,
        centerY
      );

      ctx.lineTo(
        width,
        centerY
      );

      ctx.strokeStyle =
        'rgba(239,68,68,0.2)';

      ctx.lineWidth =
        height * 0.8;

      ctx.filter =
        'blur(10px)';

      ctx.stroke();

      ctx.filter =
        'none';
    }

  }, [data, isRecording]);

  return (

    <div className="glass rounded-3xl overflow-hidden shadow-2xl">

      <canvas
        ref={canvasRef}
        width={900}
        height={180}
        className="w-full h-48"
      />

    </div>
  );
};

export default WaveformVisualizer;