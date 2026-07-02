import { useEffect, useRef } from "react";

/**
 * AuroraBackground
 * A calm, professional animated backdrop: soft drifting gradient blobs
 * ("aurora"), a faint grain texture for depth, and a light scattering of
 * slow-floating particles. No connecting lines, no starfield — deliberately
 * avoids the "cosmic / horoscope" look.
 */
function AuroraBackground({ dense = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    const particles = [];
    const COUNT = dense ? 46 : 30;
    const PALETTE = ["#6366f1", "#22d3ee", "#a78bfa"];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.6,
          vy: -(Math.random() * 0.12 + 0.04),
          vx: (Math.random() - 0.5) * 0.06,
          o: Math.random() * 0.35 + 0.15,
          c: PALETTE[i % PALETTE.length],
        });
      }
    }

    resize();
    seed();

    let raf;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.o;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => { resize(); seed(); };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [dense]);

  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-a" />
      <div className="aurora-blob aurora-blob-b" />
      <div className="aurora-blob aurora-blob-c" />
      <canvas ref={canvasRef} className="aurora-particles" />
      <div className="aurora-grain" />
    </div>
  );
}

export default AuroraBackground;
