"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Leaf, Volume2, VolumeX } from "lucide-react";
import {
  CSSProperties,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type SectionKey =
  | "me"
  | "experience"
  | "project"
  | "skill"
  | "interest"
  | "value"
  | "contact";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationVelocity: number;
  size: number;
  age: number;
  ttl: number;
  phase: number;
  opacity: number;
};

type PetalCanvasHandle = {
  spawn: (
    count: number,
    origin: { x: number; y: number },
    gentle?: boolean,
  ) => void;
};

type GardenMode = "loading" | "webgl" | "fallback";

type GardenViewState = {
  yaw: number;
  pitch: number;
  distance: number;
};

type FluidShaderHandle = {
  play: (options: {
    origin: { x: number; y: number };
    duration: number;
  }) => Promise<void>;
};

const navItems: { key: SectionKey; label: string }[] = [
  { key: "me", label: "Me" },
  { key: "contact", label: "Contact" },
  { key: "experience", label: "Experience" },
  { key: "project", label: "Project" },
  { key: "skill", label: "Skill" },
  { key: "interest", label: "Interest" },
  { key: "value", label: "Value" },
];

const experiences = [
  {
    date: "09/2025—Present",
    role: "HR & Talent Partnership",
    company: "flinkbrandcoach",
    copy: "Built a 100+ US creator database, achieved a 35% response rate and expanded the creator pool by 60%.",
  },
  {
    date: "08/2025—11/2025",
    role: "User Operations & Growth Lead",
    company: "Jaaz.ai",
    copy: "Grew Discord from zero to 1,000+ members in three months and translated global research into two shipped product updates.",
  },
  {
    date: "06/2025—09/2025",
    role: "Business Development",
    company: "fenz.ai",
    copy: "Structured 50+ enterprise leads, converted 15% into pilots and secured five qualified partnerships.",
  },
];

const projects = [
  {
    number: "01",
    title: "North America Creator Ecosystem",
    kind: "Strategy · Creator partnerships",
    copy: "A discovery-to-partnership funnel supporting 10+ short-form video projects.",
    href: "https://www.flinkbrandcoach.com",
    cta: "Visit flinkbrandcoach",
  },
  {
    number: "02",
    title: "GEO / GTM Deck",
    kind: "fenz.ai · Market intelligence",
    copy: "A structured go-to-market narrative translating market signals, competitive context and growth opportunities into action.",
    href: "https://fenz.ai/",
    cta: "Visit fenz.ai",
    secondaryHref: "/projects/fenz-geo-gtm",
    secondaryCta: "Open web deck",
  },
  {
    number: "03",
    title: "AGI Summit SF 2026",
    kind: "Field notes · Web experience",
    copy: "A designed and deployed editorial field-notes website documenting ideas, people and moments from the summit.",
    href: "https://agi-summit-2026-field-notes.kittyxuaxuan.chatgpt.site",
    cta: "Open the live site",
  },
];

const skillGroups = [
  {
    title: "Analysis",
    copy: "Market research · Funnel analysis · User interviews · Strategic reporting",
  },
  {
    title: "Growth",
    copy: "Community operations · Creator ecosystems · Partnerships · Cross-platform campaigns",
  },
  {
    title: "Tools",
    copy: "Codex · Claude · Gemini · NotebookLM · Figma · Canva · Google Workspace",
  },
  {
    title: "Languages",
    copy: "Chinese (native) · English (professional) · French (fluent)",
  },
];

const interests = [
  ["Skydiving", "Perspective, surrender and the clarity of a wide horizon."],
  ["Photography", "Learning to notice light before it disappears."],
  ["Art galleries", "Quiet rooms where an idea can change scale."],
  ["Jazz & guitar", "Improvisation, rhythm and listening before responding."],
];

const values = [
  {
    title: "Kindness as a way of seeing",
    copy: "Kindness not as softness, but as attention — the choice to notice what another person may need.",
  },
  {
    title: "Resilience in quiet bloom",
    copy: "Growth that survives winter before it becomes visible; faith in patient, unglamorous work.",
  },
  {
    title: "Already whole",
    copy: "Nothing essential is missing; becoming is remembering what has always been within.",
  },
];

const contacts = [
  {
    label: "Rednote",
    href: "https://xhslink.cn/m/9o0RUThTHGo",
    metric: "66,712",
    unit: "likes",
    featured: true,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@kitty_xuanan?igshid=NTc4MTIwNjQ2YQ==",
    metric: "80K",
    unit: "views · past 30 days",
    featured: true,
  },
  {
    label: "Email",
    href: "mailto:heykittyinworld@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/xuan-he-7b9b78323",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kitty_xuanan?igsh=bThqOGcycXZ6dzR2&utm_source=qr",
  },
];

const FluidShaderTransition = forwardRef<FluidShaderHandle>(
  function FluidShaderTransition(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const runtimeRef = useRef<{
      play: FluidShaderHandle["play"];
      dispose: () => void;
    } | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        play: (options) =>
          runtimeRef.current?.play(options) ?? Promise.resolve(),
      }),
      [],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
      if (!gl) return;

      const vertexSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      const fragmentSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform vec2 u_origin;
        uniform float u_progress;
        uniform float u_time;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p);
            p = p * 2.03 + 7.13;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
          float enter = smoothstep(0.0, 0.52, u_progress);
          float leave = 1.0 - smoothstep(0.56, 1.0, u_progress);
          float envelope = min(enter, leave);
          vec2 center = mix(u_origin, vec2(1.0) - u_origin, smoothstep(0.48, 0.68, u_progress));
          vec2 liquidUv = uv;
          float flow = fbm(uv * vec2(3.2, 4.7) + vec2(u_time * 0.055, -u_time * 0.036));
          liquidUv.x += (flow - 0.5) * 0.115 * envelope;
          liquidUv.y += (fbm(uv.yx * 4.2 - u_time * 0.027) - 0.5) * 0.055 * envelope;
          float distanceField = length((liquidUv - center) * aspect);
          float radius = envelope * 1.92;
          float feather = 0.065 + envelope * 0.035;
          float body = 1.0 - smoothstep(radius - feather, radius + feather, distanceField);
          float edge = 1.0 - smoothstep(0.0, 0.075, abs(distanceField - radius));

          vec3 sage = vec3(0.365, 0.400, 0.306);
          vec3 cream = vec3(0.980, 0.961, 0.918);
          vec3 platinum = vec3(0.898, 0.894, 0.886);
          float silk = smoothstep(0.28, 0.78, fbm(uv * 5.5 + flow));
          vec3 color = mix(sage, cream, silk * 0.42);
          color = mix(color, platinum, edge * 0.42);
          float alpha = clamp(body * 0.985 + edge * 0.16, 0.0, 0.995);
          gl_FragColor = vec4(color, alpha);
        }
      `;

      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Unable to create fluid shader");
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const log = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Error(log ?? "Unable to compile fluid shader");
        }
        return shader;
      };

      let vertexShader: WebGLShader;
      let fragmentShader: WebGLShader;
      let program: WebGLProgram;
      try {
        vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
        fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
        const nextProgram = gl.createProgram();
        if (!nextProgram) throw new Error("Unable to create fluid program");
        program = nextProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) ?? "Unable to link fluid program");
        }
      } catch {
        return;
      }

      const buffer = gl.createBuffer();
      const position = gl.getAttribLocation(program, "a_position");
      const resolution = gl.getUniformLocation(program, "u_resolution");
      const origin = gl.getUniformLocation(program, "u_origin");
      const progress = gl.getUniformLocation(program, "u_progress");
      const time = gl.getUniformLocation(program, "u_time");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      let frame = 0;
      let disposed = false;
      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.floor(window.innerWidth * ratio));
        const height = Math.max(1, Math.floor(window.innerHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };
      resize();
      window.addEventListener("resize", resize);

      const render = (
        currentProgress: number,
        currentOrigin: { x: number; y: number },
        elapsed: number,
      ) => {
        resize();
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(origin, currentOrigin.x, currentOrigin.y);
        gl.uniform1f(progress, currentProgress);
        gl.uniform1f(time, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      const play: FluidShaderHandle["play"] = ({ origin, duration }) =>
        new Promise((resolve) => {
          cancelAnimationFrame(frame);
          const startedAt = performance.now();
          const animate = (now: number) => {
            if (disposed) {
              resolve();
              return;
            }
            const phase = Math.min(1, (now - startedAt) / duration);
            render(phase, origin, (now - startedAt) / 1000);
            if (phase < 1) {
              frame = requestAnimationFrame(animate);
            } else {
              gl.clearColor(0, 0, 0, 0);
              gl.clear(gl.COLOR_BUFFER_BIT);
              resolve();
            }
          };
          frame = requestAnimationFrame(animate);
        });

      runtimeRef.current = {
        play,
        dispose: () => {
          disposed = true;
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          gl.deleteBuffer(buffer);
          gl.deleteProgram(program);
          gl.deleteShader(vertexShader);
          gl.deleteShader(fragmentShader);
        },
      };

      return () => {
        runtimeRef.current?.dispose();
        runtimeRef.current = null;
      };
    }, []);

    return <canvas ref={canvasRef} className="fluid-shader-canvas" aria-hidden />;
  },
);

function SkillFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest(".skill-section") as HTMLElement | null;
    if (!canvas || !section) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertexSource =
      "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fragmentSource = `
      precision mediump float;
      uniform vec2 r;
      uniform float s;
      float wave(vec2 p,float k){return sin(p.x*k+s*6.283+sin(p.y*5.+s*3.1));}
      void main(){
        vec2 uv=gl_FragCoord.xy/r;
        float a=wave(uv,8.)*.5+.5;
        float b=wave(uv.yx+vec2(.18,.07),11.)*.5+.5;
        float ribbon=smoothstep(.72,.94,a*b);
        float veil=smoothstep(.15,.88,uv.x+s*.38-uv.y*.18);
        vec3 platinum=vec3(.82,.81,.78);
        vec3 sage=vec3(.53,.57,.45);
        vec3 color=mix(platinum,sage,b*.5);
        gl_FragColor=vec4(color,(ribbon*.15+veil*.035)*(1.-abs(s-.5)*.5));
      }`;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const point = gl.getAttribLocation(program, "p");
    const resolution = gl.getUniformLocation(program, "r");
    const scroll = gl.getUniformLocation(program, "s");
    let frame = 0;
    let visible = false;
    let sectionProgress = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) frame = requestAnimationFrame(draw);
    });
    const update = () => {
      const rect = section.getBoundingClientRect();
      sectionProgress = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)),
      );
      if (visible && !frame) frame = requestAnimationFrame(draw);
    };
    const draw = () => {
      frame = 0;
      if (!visible) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const bounds = section.getBoundingClientRect();
      const width = Math.max(1, Math.floor(bounds.width * ratio));
      const height = Math.max(1, Math.floor(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(point);
      gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(scroll, sectionProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    observer.observe(section);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="skill-fluid-canvas" aria-hidden />;
}

const PetalCanvas = forwardRef<PetalCanvasHandle>(function PetalCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number | null>(null);
  const lastTime = useRef(0);

  const drawPetal = (
    context: CanvasRenderingContext2D,
    particle: Particle,
    alpha: number,
  ) => {
    const { x, y, size, rotation } = particle;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = alpha;

    const silk = context.createLinearGradient(
      -size * 0.45,
      -size,
      size * 0.5,
      size,
    );
    silk.addColorStop(0, "rgba(255,255,255,.94)");
    silk.addColorStop(0.5, "rgba(247,244,236,.88)");
    silk.addColorStop(0.76, "rgba(229,228,226,.58)");
    silk.addColorStop(1, "rgba(255,255,255,.72)");

    context.beginPath();
    context.moveTo(0, -size * 0.82);
    context.bezierCurveTo(
      size * 0.72,
      -size * 0.43,
      size * 0.62,
      size * 0.5,
      0,
      size * 0.82,
    );
    context.bezierCurveTo(
      -size * 0.54,
      size * 0.48,
      -size * 0.64,
      -size * 0.42,
      0,
      -size * 0.82,
    );
    context.fillStyle = silk;
    context.fill();
    context.strokeStyle = "rgba(202,201,196,.5)";
    context.lineWidth = 0.7;
    context.stroke();

    context.beginPath();
    context.moveTo(0, -size * 0.63);
    context.quadraticCurveTo(size * 0.08, 0, -size * 0.03, size * 0.63);
    context.strokeStyle = "rgba(229,228,226,.68)";
    context.lineWidth = 0.55;
    context.stroke();
    context.restore();
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const delta = Math.min((time - (lastTime.current || time)) / 1000, 0.034);
    lastTime.current = time;
    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.current = particles.current.filter((particle) => {
      particle.age += delta;
      if (particle.age >= particle.ttl) return false;

      particle.phase += delta * 1.3;
      particle.vx += Math.sin(particle.phase) * 2.8 * delta;
      particle.vy += 7 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.rotation += particle.rotationVelocity * delta;

      const progress = particle.age / particle.ttl;
      const fadeIn = Math.min(progress / 0.12, 1);
      const fadeOut = Math.min((1 - progress) / 0.24, 1);
      drawPetal(
        context,
        particle,
        Math.min(fadeIn, fadeOut) * particle.opacity,
      );
      return particle.y < window.innerHeight + 100;
    });

    if (particles.current.length > 0) {
      animationFrame.current = requestAnimationFrame(animate);
    } else {
      animationFrame.current = null;
      lastTime.current = 0;
    }
  };

  useImperativeHandle(ref, () => ({
    spawn(count, origin, gentle = false) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const available = Math.min(count, 12 - particles.current.length);
      if (available <= 0) return;

      for (let index = 0; index < available; index += 1) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        particles.current.push({
          x: origin.x + (Math.random() - 0.5) * (gentle ? 26 : 86),
          y: origin.y + (Math.random() - 0.5) * (gentle ? 20 : 48),
          vx: direction * (gentle ? 7 : 14 + Math.random() * 15),
          vy: gentle ? 16 + Math.random() * 8 : 22 + Math.random() * 14,
          rotation: Math.random() * Math.PI,
          rotationVelocity:
            direction * (0.24 + Math.random() * (gentle ? 0.22 : 0.48)),
          size: gentle ? 7 + Math.random() * 5 : 9 + Math.random() * 7,
          age: 0,
          ttl: gentle ? 6.8 + Math.random() * 1.8 : 5.6 + Math.random() * 1.9,
          phase: Math.random() * Math.PI * 2,
          opacity: gentle ? 0.42 : 0.68,
        });
      }

      if (animationFrame.current === null) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext("2d");
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden />;
});

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const point = useRef({ x: -30, y: -30 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("custom-cursor-ready");

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0)`;
      }
      raf.current = null;
    };
    const move = (event: PointerEvent) => {
      point.current = { x: event.clientX, y: event.clientY };
      cursorRef.current?.classList.add("is-visible");
      if (raf.current === null) raf.current = requestAnimationFrame(render);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      cursorRef.current?.classList.toggle(
        "is-interactive",
        Boolean(target?.closest("a, button, [role='button']")),
      );
    };
    const leave = () => cursorRef.current?.classList.remove("is-visible");

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("custom-cursor-ready");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div ref={cursorRef} className="gardenia-cursor" aria-hidden />;
}

function GardeniaHero({
  onShed,
}: {
  onShed: (
    count: number,
    origin: { x: number; y: number },
    gentle?: boolean,
  ) => void;
}) {
  const [stage, setStage] = useState(0);
  const flowerRef = useRef<HTMLDivElement>(null);
  const hoverDelay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverLoop = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMove = useRef(0);

  useEffect(() => {
    const halfOpen = setTimeout(() => setStage(1), 680);
    const fullBloom = setTimeout(() => setStage(2), 1880);
    return () => {
      clearTimeout(halfOpen);
      clearTimeout(fullBloom);
    };
  }, []);

  const origin = () => {
    const bounds = flowerRef.current?.getBoundingClientRect();
    return bounds
      ? { x: bounds.left + bounds.width * 0.51, y: bounds.top + bounds.height * 0.37 }
      : { x: window.innerWidth * 0.68, y: window.innerHeight * 0.42 };
  };
  const stop = () => {
    if (hoverDelay.current) clearTimeout(hoverDelay.current);
    if (hoverLoop.current) clearInterval(hoverLoop.current);
    hoverDelay.current = null;
    hoverLoop.current = null;
  };
  const begin = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || stage < 2) return;
    onShed(3, origin());
    stop();
    hoverDelay.current = setTimeout(() => {
      onShed(2, origin());
      hoverLoop.current = setInterval(() => onShed(1, origin(), true), 1650);
    }, 1900);
  };

  return (
    <div
      ref={flowerRef}
      className={`gardenia-photo stage-${stage}`}
      role="button"
      tabIndex={0}
      aria-label="Interactive gardenia. Hover, move gently, touch, or press Enter to release petals."
      onPointerEnter={begin}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onPointerMove={(event) => {
        if (
          event.pointerType === "mouse" &&
          stage === 2 &&
          performance.now() - lastMove.current > 1450
        ) {
          lastMove.current = performance.now();
          onShed(1, origin(), true);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") onShed(2, origin());
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onShed(3, origin());
        }
      }}
    >
      <span className="photo-aura" aria-hidden />
      <span className="hero-portrait portrait-hollywood">
        <img
          src="/kitty-hollywood.jpg"
          alt="Xuan He smiling in the California sunshine near the Hollywood sign"
          draggable={false}
        />
      </span>
      <span className="hero-portrait portrait-cafe">
        <img
          src="/kitty-sunlit-cafe.jpg"
          alt="Xuan He in a sunlit garden café"
          draggable={false}
        />
      </span>
      {[0, 1, 2].map((frame) => (
        <span
          key={frame}
          className={`gardenia-frame gardenia-frame-${frame}`}
          aria-hidden
        >
          <img
            src="/gardenia-bloom-transparent-v3.png"
            alt=""
            draggable={false}
            style={{ "--frame": frame } as CSSProperties}
          />
        </span>
      ))}
      <span className="flower-hover-note">hover gently</span>
    </div>
  );
}

function RevealSection({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.14 },
    );
    observer.observe(node);

    let queued = false;
    const parallax = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => {
          const bounds = node.getBoundingClientRect();
          const centerOffset =
            (bounds.top + bounds.height / 2 - window.innerHeight / 2) /
            window.innerHeight;
          node.style.setProperty(
            "--parallax",
            `${Math.max(-1, Math.min(1, centerOffset)) * -18}px`,
          );
          queued = false;
        });
      }
    };
    window.addEventListener("scroll", parallax, { passive: true });
    parallax();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", parallax);
    };
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      data-garden-scene={id}
      className={`reveal-section ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function GardenSound() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
    wind: AudioBufferSourceNode;
  } | null>(null);
  const dropletTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleDroplet = (context: AudioContext, master: GainNode) => {
    const delay = 6200 + Math.random() * 7400;
    dropletTimer.current = setTimeout(() => {
      if (context.state !== "closed") {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        const now = context.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(760 + Math.random() * 240, now);
        oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.34);
        filter.type = "lowpass";
        filter.frequency.value = 1600;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
        oscillator.connect(filter).connect(gain).connect(master);
        oscillator.start(now);
        oscillator.stop(now + 0.52);
        scheduleDroplet(context, master);
      }
    }, delay);
  };

  const createGardenAudio = async () => {
    const context = new AudioContext({ latencyHint: "playback" });
    const master = context.createGain();
    const windGain = context.createGain();
    const windFilter = context.createBiquadFilter();
    const buffer = context.createBuffer(
      1,
      context.sampleRate * 3,
      context.sampleRate,
    );
    const channel = buffer.getChannelData(0);
    let smoothNoise = 0;

    for (let index = 0; index < channel.length; index += 1) {
      smoothNoise = smoothNoise * 0.985 + (Math.random() * 2 - 1) * 0.015;
      channel[index] = smoothNoise;
    }

    const wind = context.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    windFilter.type = "lowpass";
    windFilter.frequency.value = 720;
    windFilter.Q.value = 0.35;
    windGain.gain.value = 0.48;
    master.gain.value = 0.0001;
    wind.connect(windFilter).connect(windGain).connect(master);
    master.connect(context.destination);
    wind.start();
    await context.resume();
    master.gain.exponentialRampToValueAtTime(0.032, context.currentTime + 1.8);
    audioRef.current = { context, master, wind };
    scheduleDroplet(context, master);
  };

  const toggle = async () => {
    if (!audioRef.current) {
      try {
        await createGardenAudio();
        setEnabled(true);
      } catch {
        setEnabled(false);
      }
      return;
    }

    const { context, master } = audioRef.current;
    if (enabled) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.6,
      );
      window.setTimeout(() => void context.suspend(), 650);
      setEnabled(false);
    } else {
      await context.resume();
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.032, context.currentTime + 1.1);
      setEnabled(true);
    }
  };

  useEffect(
    () => () => {
      if (dropletTimer.current) clearTimeout(dropletTimer.current);
      const audio = audioRef.current;
      if (audio) {
        audio.wind.stop();
        void audio.context.close();
      }
    },
    [],
  );

  return (
    <button
      type="button"
      className={`garden-sound ${enabled ? "is-playing" : ""}`}
      onClick={() => void toggle()}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute garden ambience" : "Play quiet garden ambience"}
    >
      <Leaf size={19} strokeWidth={1.15} aria-hidden />
      <span className="garden-sound-waves" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span>{enabled ? "garden sound on" : "garden sound off"}</span>
      {enabled ? (
        <Volume2 size={12} strokeWidth={1.2} aria-hidden />
      ) : (
        <VolumeX size={12} strokeWidth={1.2} aria-hidden />
      )}
    </button>
  );
}

function GardenScene({
  activeSection,
  onStatus,
}: {
  activeSection: SectionKey;
  onStatus: (mode: GardenMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<GardenMode>("loading");
  const view = useRef<GardenViewState>({
    yaw: -0.12,
    pitch: 0.08,
    distance: 12.8,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("xuan-garden-view");
    if (!saved) return;
    try {
      const restored = JSON.parse(saved) as GardenViewState;
      if (
        Number.isFinite(restored.yaw) &&
        Number.isFinite(restored.pitch) &&
        Number.isFinite(restored.distance)
      ) {
        view.current = restored;
      }
    } catch {
      sessionStorage.removeItem("xuan-garden-view");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const controls = controlsRef.current;
    if (!canvas || !stage || !controls) return;

    let disposed = false;
    let animationFrame = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let scene: import("three").Scene | null = null;
    let camera: import("three").PerspectiveCamera | null = null;
    let root: import("three").Group | null = null;
    let lastRenderedAt = 0;
    let dragging = false;
    let lastPointer = { x: 0, y: 0 };
    let velocity = { yaw: 0, pitch: 0 };
    let pinchDistance = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    const target = { ...view.current };
    const mobile = window.matchMedia(
      "(pointer: coarse), (max-width: 820px)",
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeout = window.setTimeout(() => {
      if (mode === "loading") {
        setMode("fallback");
        onStatus("fallback");
      }
    }, 6500);

    const persistView = () => {
      sessionStorage.setItem("xuan-garden-view", JSON.stringify(view.current));
    };

    const failSoftly = () => {
      if (disposed) return;
      setMode("fallback");
      onStatus("fallback");
      persistView();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      renderer?.dispose();
      renderer = null;
    };

    const resize = () => {
      if (!renderer || !camera) return;
      const bounds = stage.getBoundingClientRect();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5),
      );
      renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
      camera.aspect = Math.max(1, bounds.width) / Math.max(1, bounds.height);
      camera.updateProjectionMatrix();
    };

    const pointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest("button")) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      controls.setPointerCapture(event.pointerId);
      dragging = true;
      lastPointer = { x: event.clientX, y: event.clientY };
      if (pointers.size === 2) {
        const points = Array.from(pointers.values());
        pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y,
        );
      }
    };

    const pointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const points = Array.from(pointers.values());
        const nextDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y,
        );
        if (pinchDistance > 0) {
          target.distance = Math.max(
            8.6,
            Math.min(17.5, target.distance - (nextDistance - pinchDistance) * 0.025),
          );
        }
        pinchDistance = nextDistance;
        return;
      }

      const deltaX = event.clientX - lastPointer.x;
      const deltaY = event.clientY - lastPointer.y;
      target.yaw -= deltaX * 0.0052;
      target.pitch = Math.max(
        -0.28,
        Math.min(0.42, target.pitch + deltaY * 0.0035),
      );
      velocity = {
        yaw: -deltaX * 0.00075,
        pitch: deltaY * 0.00048,
      };
      lastPointer = { x: event.clientX, y: event.clientY };
    };

    const pointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      dragging = pointers.size > 0;
      if (pointers.size < 2) pinchDistance = 0;
      persistView();
    };

    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      target.distance = Math.max(
        8.6,
        Math.min(17.5, target.distance + event.deltaY * 0.009),
      );
    };

    const keyControl = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        target.yaw += event.key === "ArrowLeft" ? 0.12 : -0.12;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        target.pitch = Math.max(
          -0.28,
          Math.min(
            0.42,
            target.pitch + (event.key === "ArrowUp" ? -0.08 : 0.08),
          ),
        );
      }
      if (event.key === "+" || event.key === "=" || event.key === "-") {
        event.preventDefault();
        target.distance = Math.max(
          8.6,
          Math.min(17.5, target.distance + (event.key === "-" ? 0.7 : -0.7)),
        );
      }
    };

    const initialise = async () => {
      try {
        if (!window.WebGLRenderingContext) throw new Error("WebGL unavailable");
        const THREE = await import("three");
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !mobile,
          powerPreference: "high-performance",
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0xfaf5eb, 0);

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xfaf5eb, 0.045);
        camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
        root = new THREE.Group();
        root.position.set(1.35, -0.1, 0);
        scene.add(root);

        const cream = new THREE.MeshBasicMaterial({
          color: 0xf8f5ed,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        });
        const platinum = new THREE.MeshBasicMaterial({
          color: 0xe5e4e2,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
        });
        const sage = new THREE.MeshLambertMaterial({
          color: 0x788166,
          transparent: true,
          opacity: 0.2,
        });
        const stone = new THREE.MeshLambertMaterial({
          color: 0xc9c8bf,
          transparent: true,
          opacity: 0.2,
          flatShading: true,
        });

        scene.add(new THREE.HemisphereLight(0xffffff, 0xa3aa8e, 1.5));
        const sun = new THREE.DirectionalLight(0xfff8e8, 0.9);
        sun.position.set(-5, 9, 6);
        scene.add(sun);

        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(12.5, mobile ? 28 : 52),
          new THREE.MeshBasicMaterial({
            color: 0xdde2cf,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
          }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.62;
        root.add(ground);

        const pathPoints = [
          new THREE.Vector3(-5.8, -1.48, 1.7),
          new THREE.Vector3(-3.8, -1.4, 0.4),
          new THREE.Vector3(-1.9, -1.38, -0.9),
          new THREE.Vector3(0.2, -1.35, -0.4),
          new THREE.Vector3(2.2, -1.38, 0.9),
          new THREE.Vector3(4.1, -1.42, 0.15),
          new THREE.Vector3(5.7, -1.46, -1.3),
        ];
        const gardenPath = new THREE.CatmullRomCurve3(pathPoints);
        root.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(
              gardenPath,
              mobile ? 34 : 72,
              0.12,
              6,
              false,
            ),
            new THREE.MeshBasicMaterial({
              color: 0xd4d1c7,
              transparent: true,
              opacity: 0.34,
            }),
          ),
        );

        const petalGeometry = new THREE.CircleGeometry(0.78, mobile ? 12 : 20);
        petalGeometry.scale(0.48, 1, 1);
        const leafGeometry = new THREE.CircleGeometry(0.62, 12);
        leafGeometry.scale(0.42, 1, 1);
        const markerPositions = pathPoints.map((point) =>
          point.clone().add(new THREE.Vector3(0, 0.54, 0)),
        );

        markerPositions.forEach((position, index) => {
          const locator = new THREE.Group();
          locator.position.copy(position);
          locator.userData.section = navItems[index].key;

          const lod = new THREE.LOD();
          const detailedStone = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.31, 1),
            stone,
          );
          detailedStone.scale.set(1.35, 0.5, 1);
          const quietStone = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.28, 0),
            stone,
          );
          quietStone.scale.set(1.28, 0.46, 0.92);
          lod.addLevel(detailedStone, 0);
          lod.addLevel(quietStone, 10.5);
          locator.add(lod);

          const flower = new THREE.Group();
          flower.position.y = 0.28;
          const petalCount = mobile ? 4 : 6;
          for (let petal = 0; petal < petalCount; petal += 1) {
            const mesh = new THREE.Mesh(
              petalGeometry,
              petal % 2 === 0 ? cream : platinum,
            );
            const angle = (petal / petalCount) * Math.PI * 2;
            mesh.position.set(
              Math.cos(angle) * 0.24,
              Math.sin(angle) * 0.24,
              0,
            );
            mesh.rotation.z = angle - Math.PI / 2;
            mesh.rotation.x = -0.35 + (petal % 2) * 0.18;
            mesh.scale.setScalar(0.48 + (index % 3) * 0.05);
            flower.add(mesh);
          }
          locator.add(flower);
          root?.add(locator);
        });

        const leafCount = mobile ? 16 : 34;
        const leaves = new THREE.InstancedMesh(leafGeometry, sage, leafCount);
        const dummy = new THREE.Object3D();
        for (let index = 0; index < leafCount; index += 1) {
          const side = index % 2 === 0 ? 1 : -1;
          const spread = index / Math.max(1, leafCount - 1);
          dummy.position.set(
            -6.2 + spread * 12.4,
            -1.18 + Math.sin(index * 1.7) * 0.25,
            side * (1.8 + Math.random() * 2.2),
          );
          dummy.rotation.set(
            -0.78 + Math.random() * 0.18,
            Math.random() * 0.6,
            side * (0.65 + Math.random() * 0.65),
          );
          dummy.scale.setScalar(0.46 + Math.random() * 0.42);
          dummy.updateMatrix();
          leaves.setMatrixAt(index, dummy.matrix);
        }
        leaves.instanceMatrix.needsUpdate = true;
        root.add(leaves);

        const branchCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(4.9, -1.58, 3.3),
          new THREE.Vector3(4.5, -0.5, 2.65),
          new THREE.Vector3(4.75, 0.7, 2.25),
          new THREE.Vector3(4.35, 2.3, 1.8),
        ]);
        root.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(branchCurve, mobile ? 18 : 36, 0.035, 5),
            new THREE.MeshBasicMaterial({
              color: 0x75805f,
              transparent: true,
              opacity: 0.32,
            }),
          ),
        );

        resize();
        controls.addEventListener("pointerdown", pointerDown);
        controls.addEventListener("pointermove", pointerMove);
        controls.addEventListener("pointerup", pointerUp);
        controls.addEventListener("pointercancel", pointerUp);
        controls.addEventListener("wheel", wheel, { passive: false });
        controls.addEventListener("keydown", keyControl);
        window.addEventListener("resize", resize);
        window.addEventListener("pagehide", persistView);
        canvas.addEventListener("webglcontextlost", failSoftly);

        setMode("webgl");
        onStatus("webgl");
        window.clearTimeout(timeout);

        const render = (time: number) => {
          if (disposed || !renderer || !scene || !camera || !root) return;
          animationFrame = requestAnimationFrame(render);
          const minimumFrameTime = reducedMotion ? 1000 : mobile ? 32 : 15;
          if (document.hidden || time - lastRenderedAt < minimumFrameTime) {
            return;
          }
          lastRenderedAt = time;

          if (!dragging && !reducedMotion) {
            target.yaw += velocity.yaw;
            target.pitch = Math.max(
              -0.28,
              Math.min(0.42, target.pitch + velocity.pitch),
            );
            velocity.yaw *= 0.925;
            velocity.pitch *= 0.91;
          }

          const damping = reducedMotion ? 1 : mobile ? 0.1 : 0.075;
          view.current.yaw += (target.yaw - view.current.yaw) * damping;
          view.current.pitch += (target.pitch - view.current.pitch) * damping;
          view.current.distance +=
            (target.distance - view.current.distance) * damping;

          const radius = view.current.distance;
          camera.position.set(
            Math.sin(view.current.yaw) * radius,
            3.1 + view.current.pitch * 5.2,
            Math.cos(view.current.yaw) * radius,
          );
          camera.lookAt(0.7, -0.2, 0);
          root.rotation.y = Math.sin(time * 0.00012) * (reducedMotion ? 0 : 0.025);
          root.updateMatrixWorld(true);

          renderer.render(scene, camera);
        };
        animationFrame = requestAnimationFrame(render);
      } catch {
        failSoftly();
      }
    };

    void initialise();
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      controls.removeEventListener("pointerdown", pointerDown);
      controls.removeEventListener("pointermove", pointerMove);
      controls.removeEventListener("pointerup", pointerUp);
      controls.removeEventListener("pointercancel", pointerUp);
      controls.removeEventListener("wheel", wheel);
      controls.removeEventListener("keydown", keyControl);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pagehide", persistView);
      canvas.removeEventListener("webglcontextlost", failSoftly);
      renderer?.dispose();
    };
    // onStatus is a stable React setter supplied by the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={stageRef}
      className={`garden-scene garden-scene-${mode}`}
      data-active-section={activeSection}
    >
      <canvas ref={canvasRef} aria-hidden />
      <div
        ref={controlsRef}
        className="garden-control-surface"
        role="application"
        tabIndex={0}
        aria-label="Interactive 3D garden. Drag to turn, use the wheel or pinch to zoom, and use arrow keys to move the view."
      />
      <p className="garden-controls-note">
        <span>drag to wander</span>
        <i />
        <span>wheel · pinch to breathe closer</span>
      </p>
      {mode === "fallback" && (
        <p className="garden-light-note" role="status">
          The garden is adjusting its light. A lighter view is ready.
        </p>
      )}
    </div>
  );
}

function GardenLoader({
  ready,
  onComplete,
}: {
  ready: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);
  const readyRef = useRef(ready);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    const returning =
      navigation?.type === "back_forward" ||
      sessionStorage.getItem("xuan-garden-visited") === "1";
    const duration = reducedMotion ? 420 : returning ? 720 : 2350;
    const startedAt = performance.now();
    let frame = 0;
    let bloomTimer: ReturnType<typeof setTimeout> | null = null;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;

    document.documentElement.classList.add("garden-loading");
    const tick = (time: number) => {
      const elapsed = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 2.2);
      const waitingProgress = Math.min(88, Math.round(eased * 92));
      const canFinish = readyRef.current && elapsed > (returning ? 0.24 : 0.52);
      const nextProgress = canFinish
        ? Math.min(100, Math.round(88 + eased * 18))
        : waitingProgress;
      setProgress(nextProgress);

      if (!canFinish || nextProgress < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        sessionStorage.setItem("xuan-garden-visited", "1");
        bloomTimer = setTimeout(
          () => {
            setLeaving(true);
            onCompleteRef.current();
            document.documentElement.classList.remove("garden-loading");
            exitTimer = setTimeout(
              () => setVisible(false),
              reducedMotion ? 120 : 620,
            );
          },
          reducedMotion ? 80 : returning ? 520 : 1380,
        );
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (bloomTimer) clearTimeout(bloomTimer);
      if (exitTimer) clearTimeout(exitTimer);
      document.documentElement.classList.remove("garden-loading");
    };
  }, []);

  if (!visible) return null;
  return (
    <div
      className={`garden-loader ${leaving ? "is-leaving" : ""}`}
      style={{ "--load-progress": progress / 100 } as CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={`Xuan He portfolio loading, ${progress} percent`}
    >
      <div className={`loader-bloom ${progress === 100 ? "is-open" : ""}`} aria-hidden>
        <i />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="loader-name" aria-label="Xuan He">
        {"XUAN HE".split("").map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={letter === " " ? "loader-space" : "loader-letter"}
            style={{ "--letter-delay": `${index * 115}ms` } as CSSProperties}
            aria-hidden
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </div>
      <div className="loader-progress">
        <span>Blooming quietly</span>
        <i>
          <b style={{ width: `${progress}%` }} />
        </i>
        <strong>{String(progress).padStart(3, "0")}%</strong>
      </div>
    </div>
  );
}

function GardenJourney({ activeSection }: { activeSection: SectionKey }) {
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.key === activeSection),
  );
  const progress = activeIndex / Math.max(1, navItems.length - 1);

  return (
    <div
      className="garden-journey"
      style={
        {
          "--garden-progress": progress,
          "--garden-stop": activeIndex,
        } as CSSProperties
      }
      aria-hidden
    >
      <span className="garden-moving-light" />
      <span className="garden-branch-axis">
        <i />
        <i />
        <i />
      </span>
      <div className="garden-waypoints">
        {navItems.map((item, index) => (
          <span
            key={item.key}
            className={item.key === activeSection ? "is-current" : ""}
            style={{ "--stop-index": index } as CSSProperties}
          >
            <i />
            <small>{item.label}</small>
          </span>
        ))}
      </div>
      <p className="garden-stop-caption">
        <span>Garden stop {String(activeIndex + 1).padStart(2, "0")}</span>
        <strong>{navItems[activeIndex]?.label}</strong>
      </p>
    </div>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const petals = useRef<PetalCanvasHandle>(null);
  const fluidRef = useRef<HTMLDivElement>(null);
  const fluidShaderRef = useRef<FluidShaderHandle>(null);
  const fluidLabelRef = useRef<HTMLSpanElement>(null);
  const transitionLocked = useRef(false);
  const restoredGardenState = useRef(false);
  const activeSectionRef = useRef<SectionKey>("me");
  const [eggOpen, setEggOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("me");
  const [gardenMode, setGardenMode] = useState<GardenMode>("loading");
  const [introReady, setIntroReady] = useState(false);
  const [exitIntent, setExitIntent] = useState<{
    href: string;
    label: string;
  } | null>(null);
  const exitConfirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const preserveGardenState = () => {
      sessionStorage.setItem(
        "xuan-garden-page-state",
        JSON.stringify({
          scrollY: window.scrollY,
          section: activeSectionRef.current,
          hash: window.location.hash,
        }),
      );
    };

    window.addEventListener("pagehide", preserveGardenState);
    return () => {
      preserveGardenState();
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("pagehide", preserveGardenState);
    };
  }, []);

  useEffect(() => {
    if (gardenMode === "loading" || restoredGardenState.current) return;
    restoredGardenState.current = true;
    const saved = sessionStorage.getItem("xuan-garden-page-state");
    if (!saved) return;

    try {
      const state = JSON.parse(saved) as {
        scrollY?: number;
        section?: SectionKey;
        hash?: string;
      };
      if (state.section && navItems.some((item) => item.key === state.section)) {
        setActiveSection(state.section);
      }
      if (typeof state.scrollY === "number" && state.scrollY > 8) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: state.scrollY, behavior: "auto" });
        });
      }
    } catch {
      sessionStorage.removeItem("xuan-garden-page-state");
    }
  }, [gardenMode]);

  useEffect(() => {
    let lastPointer = { x: 0, y: 0, time: 0 };
    let lastScroll = { y: window.scrollY, time: 0 };

    const pointerTrail = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const distance = Math.hypot(
        event.clientX - lastPointer.x,
        event.clientY - lastPointer.y,
      );
      if (distance > 135 && performance.now() - lastPointer.time > 1100) {
        petals.current?.spawn(
          1,
          { x: event.clientX, y: event.clientY + 8 },
          true,
        );
        lastPointer = {
          x: event.clientX,
          y: event.clientY,
          time: performance.now(),
        };
      }
    };
    const scrollTrail = () => {
      const delta = Math.abs(window.scrollY - lastScroll.y);
      if (delta > 150 && performance.now() - lastScroll.time > 900) {
        petals.current?.spawn(
          1,
          {
            x: window.innerWidth * (0.62 + Math.random() * 0.2),
            y: window.innerHeight * (0.2 + Math.random() * 0.25),
          },
          true,
        );
        lastScroll = { y: window.scrollY, time: performance.now() };
      }
    };
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    const mobileFirst = mobile
      ? setTimeout(
          () =>
            petals.current?.spawn(
              1,
              { x: window.innerWidth * 0.56, y: window.innerHeight * 0.48 },
              true,
            ),
          4800,
        )
      : null;

    window.addEventListener("pointermove", pointerTrail, { passive: true });
    window.addEventListener("scroll", scrollTrail, { passive: true });
    return () => {
      window.removeEventListener("pointermove", pointerTrail);
      window.removeEventListener("scroll", scrollTrail);
      if (mobileFirst) clearTimeout(mobileFirst);
    };
  }, []);

  useEffect(() => {
    if (!exitIntent) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExitIntent(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    requestAnimationFrame(() => exitConfirmRef.current?.focus());
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [exitIntent]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.key))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionKey);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let motionContext: { revert: () => void } | undefined;
    let mediaContext: { revert: () => void } | undefined;
    let disposed = false;

    const composeScrollStory = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !pageRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      motionContext = gsap.context(() => {
        mediaContext = gsap.matchMedia();

        mediaContext.add(
          "(min-width: 981px) and (prefers-reduced-motion: no-preference)",
          () => {
            const experienceCards = gsap.utils.toArray<HTMLElement>(
              ".experience-section .letter-card",
            );
            const projectCards = gsap.utils.toArray<HTMLElement>(
              ".project-section .project-list > article",
            );
            const skillCards = gsap.utils.toArray<HTMLElement>(
              ".skill-section .skill-grid > article",
            );

            experienceCards.forEach((card, index) => {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  end: "bottom 12%",
                  scrub: 0.72,
                  invalidateOnRefresh: true,
                },
              });

              timeline
                .fromTo(
                  card,
                  {
                    y: 84,
                    rotateX: -10,
                    opacity: 0.08,
                    filter: "blur(14px)",
                    clipPath: "inset(0 0 100% 0 round 2px)",
                    transformOrigin: "50% 0%",
                  },
                  {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    clipPath: "inset(0 0 0% 0 round 2px)",
                    duration: 0.34,
                    ease: "power2.out",
                  },
                )
                .to(card, {
                  y: index === 1 ? -4 : 0,
                  duration: 0.4,
                  ease: "none",
                })
                .to(card, {
                  y: -52,
                  opacity: 0.08,
                  filter: "blur(11px)",
                  clipPath: "inset(100% 0 0% 0 round 2px)",
                  duration: 0.26,
                  ease: "power2.in",
                });
            });

            projectCards.forEach((card, index) => {
              const entersFromLeft = index % 2 === 0;
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  end: "bottom 10%",
                  scrub: 0.78,
                  invalidateOnRefresh: true,
                },
              });

              timeline
                .fromTo(
                  card,
                  {
                    x: entersFromLeft ? -72 : 72,
                    skewY: entersFromLeft ? -1.8 : 1.8,
                    opacity: 0.06,
                    filter: "blur(13px)",
                    clipPath: entersFromLeft
                      ? "inset(0 100% 0 0)"
                      : "inset(0 0 0 100%)",
                  },
                  {
                    x: 0,
                    skewY: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    clipPath: "inset(0 0% 0 0%)",
                    duration: 0.36,
                    ease: "power2.out",
                  },
                )
                .to(card, {
                  x: 0,
                  duration: 0.39,
                  ease: "none",
                })
                .to(card, {
                  x: entersFromLeft ? 44 : -44,
                  opacity: 0.08,
                  filter: "blur(10px)",
                  clipPath: entersFromLeft
                    ? "inset(0 0 0 100%)"
                    : "inset(0 100% 0 0)",
                  duration: 0.25,
                  ease: "power2.in",
                });
            });

            skillCards.forEach((card, index) => {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 93%",
                  end: "bottom 13%",
                  scrub: 0.76,
                  invalidateOnRefresh: true,
                },
              });
              timeline
                .fromTo(
                  card,
                  {
                    y: 58,
                    x: index % 2 === 0 ? -26 : 26,
                    skewY: index % 2 === 0 ? -1.4 : 1.4,
                    opacity: 0.08,
                    filter: "blur(13px)",
                    clipPath:
                      index % 2 === 0
                        ? "inset(0 100% 0 0 round 38% 8% 32% 11%)"
                        : "inset(0 0 0 100% round 8% 38% 11% 32%)",
                  },
                  {
                    y: 0,
                    x: 0,
                    skewY: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    clipPath: "inset(0 0 0 0 round 0%)",
                    duration: 0.38,
                    ease: "power2.out",
                  },
                )
                .to(card, {
                  y: -3,
                  duration: 0.36,
                  ease: "none",
                })
                .to(card, {
                  y: -38,
                  x: index % 2 === 0 ? 20 : -20,
                  opacity: 0.1,
                  filter: "blur(9px)",
                  clipPath:
                    index % 2 === 0
                      ? "inset(0 0 0 100% round 8% 34% 12% 42%)"
                      : "inset(0 100% 0 0 round 34% 8% 42% 12%)",
                  duration: 0.26,
                  ease: "power2.in",
                });
            });

            gsap.to(".experience-intro", {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: ".experience-section",
                start: "top 70%",
                end: "bottom 20%",
                scrub: 1.1,
              },
            });

            gsap.to(".project-section .section-title-row", {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: ".project-section",
                start: "top 75%",
                end: "bottom 25%",
                scrub: 1.1,
              },
            });
          },
        );

        mediaContext.add(
          "(max-width: 980px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.utils
              .toArray<HTMLElement>(
                ".experience-section .letter-card, .project-section .project-list > article",
              )
              .forEach((item) => {
                gsap.fromTo(
                  item,
                  { y: 34, opacity: 0.25, filter: "blur(7px)" },
                  {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    ease: "none",
                    scrollTrigger: {
                      trigger: item,
                      start: "top 94%",
                      end: "top 62%",
                      scrub: 0.35,
                    },
                  },
                );
              });
          },
        );
      }, pageRef);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void composeScrollStory();
    return () => {
      disposed = true;
      mediaContext?.revert();
      motionContext?.revert();
    };
  }, []);

  useEffect(() => {
    if (!introReady || !pageRef.current) return;
    let context: { revert: () => void } | undefined;
    let disposed = false;

    void import("gsap").then(({ gsap }) => {
      if (disposed || !pageRef.current) return;
      const mobile = window.matchMedia("(max-width: 720px)").matches;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      context = gsap.context(() => {
        const letters = gsap.utils.toArray<HTMLElement>(".hero-name-letter");
        if (reducedMotion) {
          gsap.set(letters, {
            opacity: 1,
            y: 0,
            filter: "none",
            backgroundPosition: "10% 50%",
          });
          return;
        }
        gsap
          .timeline()
          .fromTo(
            letters,
            {
              opacity: 0,
              y: 4,
              filter: "blur(3px)",
              fontVariationSettings:
                '"opsz" 72, "wght" 260, "SOFT" 40, "WONK" 1',
              backgroundPosition: "125% 50%",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              fontVariationSettings:
                '"opsz" 112, "wght" 430, "SOFT" 68, "WONK" 1',
              duration: mobile ? 0.38 : 0.5,
              stagger: mobile ? 0.06 : 0.09,
              ease: "power2.out",
            },
          )
          .to(
            letters,
            {
              backgroundPosition: "-28% 50%",
              filter: "drop-shadow(0 4px 8px rgba(145, 144, 138, .16))",
              duration: 0.72,
              stagger: 0.075,
              ease: "power1.inOut",
            },
            "-=0.14",
          )
          .to(letters, {
            filter: "drop-shadow(0 2px 5px rgba(145, 144, 138, .08))",
            duration: 0.42,
            ease: "power1.out",
          });
      }, pageRef);
    });

    return () => {
      disposed = true;
      context?.revert();
    };
  }, [introReady]);

  const shed = (
    count: number,
    origin: { x: number; y: number },
    gentle = false,
  ) => petals.current?.spawn(count, origin, gentle);

  const moveToSection = (
    event: React.MouseEvent<HTMLElement>,
    item: { key: SectionKey; label: string },
  ) => {
    event.preventDefault();
    const target = document.getElementById(item.key);
    const fluid = fluidRef.current;
    if (!target || !fluid || transitionLocked.current) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      target.scrollIntoView({ block: "start" });
      window.history.replaceState(null, "", `#${item.key}`);
      return;
    }

    transitionLocked.current = true;
    if (fluidLabelRef.current) fluidLabelRef.current.textContent = item.label;

    const mobile = window.matchMedia(
      "(pointer: coarse), (max-width: 720px)",
    ).matches;
    const duration = mobile ? 1120 : 1480;
    const x = Math.max(7, Math.min(93, (event.clientX / window.innerWidth) * 100));
    const y = Math.max(
      10,
      Math.min(90, (event.clientY / window.innerHeight) * 100),
    );
    const sheet = fluid.querySelector<HTMLElement>(".fluid-sheet");
    const label = fluid.querySelector<HTMLElement>(".fluid-label");
    const orbs = Array.from(
      fluid.querySelectorAll<HTMLElement>(".fluid-orb"),
    );
    const transitionPetals = Array.from(
      fluid.querySelectorAll<HTMLElement>(".fluid-petal"),
    );
    if (!sheet || !label) {
      transitionLocked.current = false;
      return;
    }

    fluid.classList.add("is-active");
    sheet.style.transformOrigin = `${x}% ${y}%`;
    petals.current?.spawn(
      mobile ? 2 : 4,
      { x: event.clientX, y: event.clientY },
      true,
    );

    const sheetAnimation = sheet.animate(
      [
        {
          clipPath: `ellipse(0% 0% at ${x}% ${y}%)`,
          filter: mobile ? "blur(0px)" : "blur(18px)",
        },
        {
          clipPath: `ellipse(150% 155% at ${x}% ${y}%)`,
          filter: "blur(0px)",
          offset: 0.47,
        },
        {
          clipPath: `ellipse(150% 155% at ${x}% ${y}%)`,
          filter: "blur(0px)",
          offset: 0.58,
        },
        {
          clipPath: `ellipse(0% 0% at ${100 - x}% ${100 - y}%)`,
          filter: mobile ? "blur(0px)" : "blur(16px)",
        },
      ],
      {
        duration,
        easing: "cubic-bezier(0.65, 0, 0.22, 1)",
        fill: "both",
      },
    );
    const shaderAnimation =
      fluidShaderRef.current?.play({
        origin: { x: x / 100, y: 1 - y / 100 },
        duration,
      }) ?? Promise.resolve();

    label.animate(
      [
        { opacity: 0, transform: "translate3d(0, 18px, 0)", letterSpacing: "0.28em" },
        { opacity: 0.9, transform: "translate3d(0, 0, 0)", letterSpacing: "0.18em" },
        { opacity: 0, transform: "translate3d(0, -14px, 0)", letterSpacing: "0.24em" },
      ],
      {
        duration: duration * 0.82,
        delay: duration * 0.12,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    );

    if (!mobile) {
      orbs.forEach((orb, index) => {
        orb.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(${index ? 16 : -14}vw, ${index ? -12 : 10}vh, 0) scale(.2)`,
            },
            {
              opacity: 0.82,
              transform: "translate3d(0, 0, 0) scale(1.8)",
              offset: 0.46,
            },
            {
              opacity: 0,
              transform: `translate3d(${index ? -18 : 20}vw, ${index ? 16 : -14}vh, 0) scale(.3)`,
            },
          ],
          {
            duration: duration * 0.94,
            delay: index * 55,
            easing: "cubic-bezier(0.65, 0, 0.22, 1)",
          },
        );
      });
    }

    transitionPetals.forEach((petal, index) => {
      petal.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0) rotate(${index * 32}deg) scale(.45)`,
          },
          {
            opacity: 0.72,
            transform: `translate3d(${window.innerWidth * (0.36 + index * 0.12)}px, ${window.innerHeight * (0.34 + (index % 2) * 0.18)}px, 0) rotate(${90 + index * 70}deg) scale(1)`,
            offset: 0.48,
          },
          {
            opacity: 0,
            transform: `translate3d(${window.innerWidth * (0.54 + index * 0.1)}px, ${window.innerHeight * 0.78}px, 0) rotate(${180 + index * 95}deg) scale(.72)`,
          },
        ],
        {
          duration: duration * 0.88,
          delay: index * 45,
          easing: "cubic-bezier(0.37, 0, 0.23, 1)",
          fill: "both",
        },
      );
    });

    window.setTimeout(() => {
      const destination =
        target.getBoundingClientRect().top + window.scrollY - 94;
      window.scrollTo({ top: Math.max(0, destination), behavior: "auto" });
      window.history.replaceState(null, "", `#${item.key}`);
      setActiveSection(item.key);
      target.animate(
        [
          {
            opacity: 0.42,
            filter: "blur(12px)",
            transform: "translate3d(0, 28px, 0)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translate3d(0, 0, 0)",
          },
        ],
        {
          duration: mobile ? 420 : 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );
    }, duration * 0.49);

    Promise.allSettled([sheetAnimation.finished, shaderAnimation]).finally(() => {
      fluid.classList.remove("is-active");
      sheetAnimation.cancel();
      transitionLocked.current = false;
    });
  };

  const keepTheGardenIntact = (event: React.MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;
    const origin = event.target as HTMLElement | null;
    const anchor = origin?.closest("a");
    if (!anchor) return;

    const rawHref = anchor.getAttribute("href");
    if (!rawHref || !/^https?:\/\//i.test(rawHref)) return;

    const destination = new URL(rawHref, window.location.href);
    if (destination.origin === window.location.origin) return;
    event.preventDefault();

    const hostname = destination.hostname.toLowerCase();
    const platform =
      hostname.includes("linkedin")
        ? "LinkedIn"
        : hostname.includes("instagram")
          ? "Instagram"
          : hostname.includes("threads")
            ? "Threads"
            : hostname.includes("xiaohongshu") || hostname.includes("xhs")
              ? "Rednote"
              : hostname.includes("fenz")
                ? "fenz.ai"
                : hostname.includes("flinkbrandcoach")
                  ? "flinkbrandcoach"
                  : hostname.includes("agi-summit")
                    ? "AGI Summit Field Notes"
                    : anchor.textContent?.trim().replace(/\s+/g, " ") ||
                      destination.hostname;

    setExitIntent({ href: destination.href, label: platform });
  };

  const leaveTheGarden = () => {
    if (!exitIntent) return;
    window.open(exitIntent.href, "_blank", "noopener,noreferrer");
    setExitIntent(null);
  };

  return (
    <main
      ref={pageRef}
      className="portfolio-page"
      data-garden-mode={gardenMode}
      onClick={keepTheGardenIntact}
    >
      <GardenLoader
        ready={gardenMode !== "loading"}
        onComplete={() => setIntroReady(true)}
      />
      <CustomCursor />
      <PetalCanvas ref={petals} />
      <GardenJourney activeSection={activeSection} />
      <div ref={fluidRef} className="fluid-transition" aria-hidden>
        <FluidShaderTransition ref={fluidShaderRef} />
        <div className="fluid-orb fluid-orb-a" />
        <div className="fluid-orb fluid-orb-b" />
        <div className="fluid-sheet" />
        <span className="fluid-petal fluid-petal-a" />
        <span className="fluid-petal fluid-petal-b" />
        <span className="fluid-petal fluid-petal-c" />
        <span className="fluid-label">
          <small>entering</small>
          <span ref={fluidLabelRef}>Me</span>
        </span>
      </div>
      {exitIntent && (
        <div
          className="garden-exit-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setExitIntent(null);
          }}
        >
          <section
            className="garden-exit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="garden-exit-title"
          >
            <span className="exit-petal" aria-hidden />
            <p>Beyond the garden gate</p>
            <h2 id="garden-exit-title">Continue beyond the garden?</h2>
            <p className="garden-exit-copy">
              You’re about to visit <strong>{exitIntent.label}</strong>. This
              garden will stay open for your return.
            </p>
            <div className="garden-exit-actions">
              <button type="button" onClick={() => setExitIntent(null)}>
                Stay in the garden
              </button>
              <button
                ref={exitConfirmRef}
                type="button"
                className="exit-confirm"
                onClick={leaveTheGarden}
              >
                Continue <ArrowUpRight size={14} strokeWidth={1.25} />
              </button>
            </div>
          </section>
        </div>
      )}

      <header className="site-header">
        <a className="folio-mark" href="#top" aria-label="Xuan He home">
          XH<span>✤</span>
        </a>
        <p
          className="header-motto"
          aria-label="Quiet strength, patient bloom."
        >
          <span style={{ "--word-delay": "0ms" } as CSSProperties}>Quiet</span>
          <span style={{ "--word-delay": "150ms" } as CSSProperties}>
            strength,
          </span>
          <em>
            <span style={{ "--word-delay": "300ms" } as CSSProperties}>
              patient
            </span>
            <span style={{ "--word-delay": "450ms" } as CSSProperties}>
              bloom.
            </span>
          </em>
        </p>
        <p className="folio-status">
          <i /> Shanghai · available globally
        </p>
        <a
          className="resume-shortcut"
          href="/resume"
          target="_blank"
          rel="noreferrer"
        >
          Resume <ArrowUpRight size={12} strokeWidth={1.35} />
        </a>
        <GardenSound />
        <nav className="folio-nav" aria-label="Portfolio sections">
          {navItems.map((item, index) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className={activeSection === item.key ? "is-active" : ""}
              aria-current={activeSection === item.key ? "location" : undefined}
              onClick={(event) => moveToSection(event, item)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="hero">
        <GardenScene
          activeSection={activeSection}
          onStatus={setGardenMode}
        />
        <div className="hero-copy">
          <motion.p
            className="hero-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.08, duration: 0.9 }}
          >
            Global marketer · Connector · Community builder
          </motion.p>
          <h1 aria-label="Xuan He">
            {"XUAN HE".split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={
                  char === " " ? "hero-name-space" : "hero-name-letter"
                }
                aria-hidden
              >
                {char === " " ? "\u00a0" : char}
              </span>
            ))}
          </h1>
          <motion.p
            className="hero-intro"
            initial={{ opacity: 0, y: 12 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.92, duration: 1.08 }}
          >
            A connector between AI startups,
            <br />
            creator ecosystems & global communities.
          </motion.p>
        </div>

        <div className="flower-stage">
          <GardeniaHero onShed={shed} />
        </div>

        <a
          className="hero-scroll"
          href="#me"
          onClick={(event) =>
            moveToSection(event, { key: "me", label: "Me" })
          }
        >
          <span>Scroll to unfold</span>
          <i />
        </a>
      </section>

      <RevealSection id="me" className="story-section about-section">
        <div className="section-index">01 / ME</div>
        <div className="about-heading parallax-copy">
          <p className="eyebrow">A quiet introduction</p>
          <h2>I build bridges between worlds.</h2>
        </div>
        <div className="about-body">
          <p className="section-lede">
            I’m Xuan He — Kitty to most people. I work where AI startups,
            creator ecosystems and global communities meet, turning research and
            relationships into momentum.
          </p>
          <div className="about-notes">
            <article>
              <span>01</span>
              <h3>International perspective</h3>
              <p>
                Shanghai-based, globally curious, and shaped by cross-cultural
                study and work.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Connector by nature</h3>
              <p>
                I notice the dots, bring the right people together, and help
                ideas travel between contexts.
              </p>
            </article>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="contact" className="contact-section">
        <div className="section-index">02 / CONTACT</div>
        <div className="contact-heading">
          <p className="eyebrow">A conversation can begin anywhere</p>
          <h2>Come say hello.</h2>
          <p className="contact-copy">
            Follow the work in motion, or write to me about a thoughtful
            collaboration, a curious idea, or a perspective worth exchanging.
          </p>
        </div>
        <div className="contact-network">
          <div className="social-highlights">
            {contacts
              .filter((contact) => contact.featured)
              .map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{contact.label}</span>
                  <strong>{contact.metric}</strong>
                  <small>{contact.unit}</small>
                  <ArrowUpRight size={18} strokeWidth={1.1} />
                </a>
              ))}
          </div>
          <div className="contact-links">
            {contacts
              .filter((contact) => !contact.featured)
              .map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {contact.label}{" "}
                  <ArrowUpRight size={14} strokeWidth={1.25} />
                </a>
              ))}
            <a href="/resume" target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={14} strokeWidth={1.25} />
            </a>
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="experience"
        className="story-section experience-section"
      >
        <div className="section-index">03 / EXPERIENCE</div>
        <div className="experience-intro parallax-copy">
          <p className="eyebrow">Overlapping paths, shared purpose</p>
          <h2>Experience</h2>
          <p>
            Three roles across creator partnerships, business development and
            global community growth.
          </p>
        </div>
        <div className="letter-stack">
          {experiences.map((item, index) => (
            <article
              key={item.company}
              className="letter-card"
              style={{ "--delay": `${index * 120}ms` } as CSSProperties}
            >
              <div className="letter-date">{item.date}</div>
              <div>
                <p>{item.role}</p>
                <h3>{item.company}</h3>
              </div>
              <p className="letter-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="project" className="folio-section project-section">
        <div className="section-index">04 / PROJECT</div>
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Research made actionable</p>
            <h2>Selected projects</h2>
          </div>
          <p>Work that connects market signals, people and opportunity.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.number} className={project.href ? "has-link" : ""}>
              <span>{project.number}</span>
              <div>
                <small>{project.kind}</small>
                <h3>{project.title}</h3>
              </div>
              <div className="project-outcome">
                <p>{project.copy}</p>
                <div className="project-links">
                  {project.href && (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.cta}{" "}
                      <ArrowUpRight size={14} strokeWidth={1.25} />
                    </a>
                  )}
                  {project.secondaryHref && (
                    <a
                      href={project.secondaryHref}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link-featured"
                    >
                      {project.secondaryCta}{" "}
                      <ArrowUpRight size={14} strokeWidth={1.25} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="skill" className="folio-section skill-section">
        <SkillFluidCanvas />
        <div className="section-index">05 / SKILL</div>
        <div className="section-title-row">
          <div>
            <p className="eyebrow">How I work</p>
            <h2>Skills & tools</h2>
          </div>
          <p>
            Analytical structure, human research and AI-enabled execution.
          </p>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group, index) => (
            <article key={group.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
              <p>{group.copy}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="interest" className="folio-section interest-section">
        <div className="section-index">06 / INTEREST</div>
        <div className="interest-heading">
          <p className="eyebrow">Spaces that keep me curious</p>
          <h2>Perspective changes everything.</h2>
        </div>
        <div className="interest-list">
          {interests.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="value" className="folio-section value-section">
        <div className="section-index">07 / VALUE</div>
        <p className="eyebrow">Three quiet forces</p>
        <h2>
          Kind enough to notice.
          <br />
          Brave enough to keep becoming.
        </h2>
        <div className="value-grid">
          {values.map((value, index) => (
            <article key={value.title}>
              <span>0{index + 1}</span>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <footer className="site-footer">
        <button
          className={`garden-note-trigger ${eggOpen ? "is-open" : ""}`}
          onClick={() => setEggOpen((current) => !current)}
          aria-expanded={eggOpen}
        >
          about this garden
        </button>
        <div
          className={`garden-note ${eggOpen ? "is-open" : ""}`}
          aria-hidden={!eggOpen}
        >
          <span className="mini-bloom">✤</span>
          <p>
            Built as a quiet digital garden — a place where resilience can look
            delicate, and becoming can take its time.
          </p>
        </div>

        <div className="footer-line">
          <span>© 2026 Xuan He</span>
          <span>Quiet strength · patient bloom</span>
          <a href="#top">Return to bloom ↑</a>
        </div>
      </footer>
    </main>
  );
}
