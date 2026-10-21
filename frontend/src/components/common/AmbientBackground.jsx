import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Modern ambient background with animated aurora mesh and floating nodes,
 * dynamically responsive to Dark/Light mode theme.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);
  const { isLight } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Subtle particle nodes
    const nodeCount = 35;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections between nearby nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = isLight
              ? `rgba(2, 132, 199, ${0.08 * (1 - dist / 140)})`
              : `rgba(0, 242, 254, ${0.12 * (1 - dist / 140)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.fillStyle = isLight
          ? `rgba(2, 132, 199, ${node.alpha * 0.45})`
          : `rgba(56, 189, 248, ${node.alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
    };
  }, [isLight]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Aurora glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '15%',
          width: '50vw',
          height: '50vw',
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(2, 132, 199, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 8s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '45vw',
          height: '45vw',
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float-slow 10s ease-in-out infinite alternate-reverse',
        }}
      />
      {/* Digital Grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(15, 23, 42, 0.025) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.025) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
        }}
      />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}

