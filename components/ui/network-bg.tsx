import { useRef, useEffect } from "react";

interface NetworkBGProps {
  className?: string;
}

// Node color palette (blue, purple, pink shades)
const NODE_COLORS = ["#7b61ff", "#5ad1ff", "#a78bfa", "#818cf8", "#6366f1", "#a5b4fc"];

const getDotCount = () => {
  if (typeof window === 'undefined') return 48;
  return window.innerWidth < 768 ? 20 : 48;
};
const getLineDistance = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 220 : 340);

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// 3D node structure
interface Dot3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
}

function project3D(dot: { x: number; y: number; z: number }, w: number, h: number, fov: number = 900) {
  // Simple perspective projection
  const scale = fov / (fov + dot.z);
  return {
    x: w / 2 + dot.x * scale,
    y: h / 2 + dot.y * scale,
    scale,
  };
}

function rotate3D(dot: Dot3D, rotX: number, rotZ: number) {
  // Rotate around X axis
  let y = dot.y * Math.cos(rotX) - dot.z * Math.sin(rotX);
  let z = dot.y * Math.sin(rotX) + dot.z * Math.cos(rotX);
  // Rotate around Z axis
  let x = dot.x * Math.cos(rotZ) - y * Math.sin(rotZ);
  y = dot.x * Math.sin(rotZ) + y * Math.cos(rotZ);
  return { x, y, z };
}

export const NetworkBG = (props: NetworkBGProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot3D[]>([]);
  const edges = useRef<any[]>([]);
  const animationRef = useRef<number>();
  const lastScrollY = useRef<number>(0);
  let rotX = 0;
  let rotZ = 0;
  let lastTimestamp = 0;

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
      const dotCount = 100;
      dots.current = Array.from({ length: dotCount }, () => ({
        x: randomBetween(-500, 500),
        y: randomBetween(-300, 300),
        z: randomBetween(-500, 500),
        vx: randomBetween(-0.5, 0.5),
        vy: randomBetween(-0.5, 0.5),
        vz: randomBetween(-0.5, 0.5),
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        size: [6, 10][Math.floor(Math.random() * 2)]
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

    function draw(timestamp?: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.fillStyle = "#111216";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Animate node positions in 3D
      for (let i = 0; i < dots.current.length; i++) {
        let d = dots.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.z += d.vz;
        // Bounce off a 3D box
        if (d.x < -220 || d.x > 220) d.vx *= -1;
        if (d.y < -140 || d.y > 140) d.vy *= -1;
        if (d.z < -220 || d.z > 220) d.vz *= -1;
      }

      // Animate rotation
      if (timestamp !== undefined) {
        if (lastTimestamp) {
          rotX += 0.00025 * (timestamp - lastTimestamp); // slower
          rotZ += 0.00015 * (timestamp - lastTimestamp); // slower
        }
        lastTimestamp = timestamp;
      }

      // Project and draw edges
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.strokeStyle = "#f3f4f6";
      ctx.lineWidth = 0.7;
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const a = rotate3D(dots.current[i], rotX, rotZ);
          const b = rotate3D(dots.current[j], rotX, rotZ);
          // Only draw if close in 3D
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
          if (dist < 120) {
            const pa = project3D(a, w, h);
            const pb = project3D(b, w, h);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Project and draw nodes
      for (let i = 0; i < dots.current.length; i++) {
        const d = rotate3D(dots.current[i], rotX, rotZ);
        const p = project3D(d, w, h);
        ctx.save();
        ctx.fillStyle = dots.current[i].color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dots.current[i].size * p.scale * 0.5, 0, 2 * Math.PI);
        ctx.fill();
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