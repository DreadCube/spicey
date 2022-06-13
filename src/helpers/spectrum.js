let requestId = null;
let context;
let analyser;
let src;

const spectrum = {
  start: ({ canvasRef, audioRef }) => {
    if (requestId) {
      spectrum.stop();
    }
    if (!context) {
      context = new AudioContext();
    }

    if (!analyser) {
      analyser = context.createAnalyser();
    }

    if (!src) {
      src = context.createMediaElementSource(audioRef.current);
    }

    if (!audioRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    src.connect(analyser);

    analyser.connect(context.destination);

    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    let barHeight;
    let x = 0;

    function renderFrame() {
      const onTrackPage = window.location.pathname.includes('/track');
      requestId = requestAnimationFrame(renderFrame);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const barWidth = (WIDTH / bufferLength) * 1.5;

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(19, 19, 19, 1)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        ctx.fillStyle = '#ff00a9';

        ctx.fillRect(x, HEIGHT - barHeight, barWidth, (250 / barHeight) * HEIGHT);

        x += barWidth + 1;
      }
    }
    renderFrame();
  },
  stop: () => {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  },
};

export default spectrum;
