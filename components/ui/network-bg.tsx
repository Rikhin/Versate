import React, { useRef, useEffect } from "react";

interface NetworkBGProps {
  className?: string;
}

// Node color palette (blue, purple, pink shades)
const NODE_COLORS = ["#7b61ff", "#5ad1ff", "#a78bfa", "#818cf8", "#6366f1", "#a5b4fc"];

const getDotCount = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 48);
const getLineDistance = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 220 : 340);

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export const NetworkBG: React.FC<NetworkBGProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<any[]>([]);
  const edges = useRef<any[]>([]);
  const animationRef = useRef<number>();
  const lastScrollY = useRef<number>(0);

  // Helper: Prim's algorithm for MST
  function computeMST(nodes: any[]) {
    const n = nodes.length;
    const inTree = Array(n).fill(false);
    const minDist = Array(n).fill(Infinity);
    const parent = Array(n).fill(-1);
    minDist[0] = 0;
    for (let i = 0; i < n; i++) {
      let u = -1;
      for (let j = 0; j < n; j++) {
        if (!inTree[j] && (u === -1 || minDist[j] < minDist[u])) u = j;
      }
      inTree[u] = true;
      for (let v = 0; v < n; v++) {
        if (!inTree[v]) {
          const dx = nodes[u].x - nodes[v].x;
          const dy = nodes[u].y - nodes[v].y;
          const dist = dx * dx + dy * dy;
          if (dist < minDist[v]) {
            minDist[v] = dist;
            parent[v] = u;
          }
        }
      }
    }
    const mstEdges = [];
    for (let v = 1; v < n; v++) {
      if (parent[v] !== -1) mstEdges.push([v, parent[v]]);
    }
    return mstEdges;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to fixed, full viewport
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Responsive resize
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // Re-randomize dot positions
      const dotCount = getDotCount();
      dots.current = Array.from({ length: dotCount }, () => ({
        x: randomBetween(0, w),
        y: randomBetween(0, h),
        vx: randomBetween(-0.03, 0.03),
        vy: randomBetween(-0.03, 0.03),
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        size: [6, 12][Math.floor(Math.random() * 2)]
      }));
      // Compute MST edges
      edges.current = computeMST(dots.current);
      // Add more nearest neighbor edges for each node
      for (let i = 0; i < dots.current.length; i++) {
        // Find 4 nearest neighbors
        const dists = dots.current.map((d, j) => ({j, dist: (d.x - dots.current[i].x) ** 2 + (d.y - dots.current[i].y) ** 2}));
        dists.sort((a, b) => a.dist - b.dist);
        for (let k = 1; k <= 4; k++) {
          const j = dists[k].j;
          if (!edges.current.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) {
            edges.current.push([i, j]);
          }
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Parallax on scroll
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.fillStyle = "#111216"; // Pure black background
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Animate node positions
      for (let i = 0; i < dots.current.length; i++) {
        let d = dots.current[i];
        d.x += d.vx;
        d.y += d.vy;
        // Bounce off edges
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }

      // Parallax: shift nodes vertically based on scroll
      const parallax = lastScrollY.current * 0.08;

      // Draw edges (MST + extras)
      ctx.save();
      ctx.strokeStyle = "#f3f4f6";
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.13;
      for (let [i, j] of edges.current) {
        const a = dots.current[i];
        const b = dots.current[j];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y + parallax);
        ctx.lineTo(b.x, b.y + parallax);
        ctx.stroke();
      }
      ctx.restore();

      // Draw nodes as squares (above lines)
      for (let i = 0; i < dots.current.length; i++) {
        const { x, y, color, size } = dots.current[i];
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x - size/2, y - size/2 + parallax, size, size);
        ctx.restore();
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={props.className} />;
}; 