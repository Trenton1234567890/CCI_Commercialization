"use client";
import { useState } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ResearchPortfolio() {
  const [page, setPage] = useState("home");

  const projects = [
    {
      title: "THReaD: The Distributed Wearable Embedded Network",
      description:
        "Ultra-small interconnected SoCs embedded into yarns enabling fault-tolerant distributed sensing and computation across wearable and textile-integrated systems.",
        image: "/THReaD_Swatch.jpg",
        link: "https://ieeexplore.ieee.org/document/11509578",
    },
    {
      title: "Distributed ExG Signal Systems",
      description:
        "Multi-node biosignal acquisition and processing architectures for scalable, high-fidelity physiological monitoring.",
        image: "/ECG_Elliott_v0.png",
        link: "https://ieeexplore.ieee.org/document/9354209"
    },
    {
      title: "KNoT: Chip-Scale Communication & Network Topologies",
      description:
        "Fault-tolerant interconnects, routing, and synchronization strategies for sub-millimeter-scale distributed systems.",
        image: "/NodeC_Accelerometers.jpg",
        link: "https://ieeexplore.ieee.org/document/10904771",
    },
  ];

  const Nav = () => (
    <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur">
      <div className="font-bold tracking-widest text-cyan-300">
        ETILE · Embedded Textile Intelligence Lab for Electronics
      </div>
      <div className="flex gap-6 text-sm text-neutral-300">
        <button onClick={() => setPage("home")} className="hover:text-cyan-300">Home</button>
        <button onClick={() => setPage("vision")} className="hover:text-cyan-300">Vision</button>
        <button onClick={() => setPage("applications")} className="hover:text-cyan-300">Applications</button>
        <button onClick={() => setPage("works")} className="hover:text-cyan-300">Recent Works</button>
      </div>
    </nav>
  );

const Background = () => {
  const svgRef = useRef(null);
  const animationsRef = useRef([]);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState([]);

  const GRID = 40;

  // ---------- TRACK SCREEN SIZE ----------
  useEffect(() => {
    const update = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ---------- GENERATE GRID-ALIGNED PATHS ----------
  useEffect(() => {
    if (!size.w || !size.h) return;

    const snap = (v) => Math.round(v / GRID) * GRID;

    const makePath = () => {
      let x = snap(Math.random() * size.w);
      let y = snap(Math.random() * size.h);

      let d = `M ${x} ${y}`;

      const segments = 8 + Math.floor(Math.random() * 5);
      let dir = Math.random() > 0.5 ? "x" : "y";

      for (let i = 0; i < segments; i++) {
        const steps = 1 + Math.floor(Math.random() * 2);

        for (let s = 0; s < steps; s++) {
          if (dir === "x") {
            x += Math.random() > 0.5 ? GRID : -GRID;
          } else {
            y += Math.random() > 0.5 ? GRID : -GRID;
          }

          x = Math.max(0, Math.min(size.w, x));
          y = Math.max(0, Math.min(size.h, y));

          d += ` L ${x} ${y}`;
        }

        dir = dir === "x" ? "y" : "x";
      }

      return d;
    };

    const count = 50;
    setPaths(Array.from({ length: count }, makePath));
  }, [size]);

  // ---------- ANIMATION ----------
  useEffect(() => {
    const svg = svgRef.current;
    const els = svg?.querySelectorAll(".trace-path");
    if (!els || els.length === 0) return;

    const anims = [];

    els.forEach((path) => {
      const length = path.getTotalLength();

      path.style.strokeDasharray = `${length * 0.2} ${length}`;
      path.style.strokeDashoffset = `${length}`;

      anims.push({
        path,
        length,
        speed: 0.05 + Math.random() * 0.6,
        offset: Math.random() * length,
      });
    });

    animationsRef.current = anims;

    let raf;

    const animate = () => {
      const arr = animationsRef.current;

      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];

        a.offset -= a.speed;
        if (a.offset < 0) a.offset += a.length*1.01;

        a.path.style.strokeDashoffset = a.offset;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, [paths]);

  // ---------- GRID ----------
  const cols = Math.ceil(size.w / GRID);
  const rows = Math.ceil(size.h / GRID);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-black" />

      {/* glow field */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,140,0.10)_0,transparent_65%)]" />

      {/* SVG WORLD */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* GRID (true screen-space alignment) */}
        <g opacity="0.08">
          {Array.from({ length: cols }).map((_, i) => {
            const x = i * GRID;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={size.h}
                stroke="rgba(0,255,140,0.35)"
                strokeWidth="1"
              />
            );
          })}

          {Array.from({ length: rows }).map((_, i) => {
            const y = i * GRID;
            return (
              <line
                key={`h-${i}`}
                x1={0}
                y1={y}
                x2={size.w}
                y2={y}
                stroke="rgba(0,255,140,0.35)"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* traces */}
        <g
          stroke="rgba(0,255,140,0.22)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
        >
          {paths.map((d, i) => (
            <path key={i} className="trace-path" d={d} />
          ))}
        </g>
      </svg>

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-emerald-950/20" />
    </div>
  );
};

const Home = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setStatus("sending");

    try {
      // 🔗 Replace this with your Google Apps Script endpoint later
      const res = await fetch("https://script.google.com/macros/s/AKfycbwsxN88s_h98y_MqW7T8a8fTaGiyHfqWlFgxdqeAzYEz0NAK8QPQn_zH0GRsvfGB7sdzg/exec", {
        method: "POST",
        //headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => setOpen(false), 1200);
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="px-8 py-28 max-w-6xl mx-auto relative z-10">
      <div className="space-y-12">

        {/* Identity / label */}
        <div className="space-y-3">
          <div className="text-emerald-300 tracking-[0.35em] text-xs font-medium">
            ETILE · Embedded Textile Intelligence Lab for Electronics
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Distributed
            <span className="block text-emerald-300">
              Chip-Scale Intelligence
            </span>
          </h1>

          <p className="text-neutral-400 max-w-2xl leading-relaxed">
            Building physically distributed embedded systems where sensing,
            communication, and computation emerge from the material itself.
          </p>
        </div>

        {/* Primary thesis */}
        <div className="space-y-5 max-w-3xl">
          <p className="text-lg text-neutral-300 leading-relaxed">
            ETILE develops sub-millimeter-scale distributed embedded systems that merge
            sensing, communication, and computation into unified wearable architectures.
          </p>

          <p className="text-neutral-400 leading-relaxed">
            Instead of centralized compute, intelligence is spatially distributed across
            ultra-constrained nodes.
          </p>
        </div>

        {/* Key pillars */}
        <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
          {[
            "Wearable chip-scale distributed systems",
            "Textile-integrated architectures",
            "Fault-tolerant inter-chip communication",
            "Ultra-low-power sensing",
            "Analog front-end systems",
            "Edge intelligence under constraints",
            "Biomedical sensing fabrics",
            "HW–SW co-design",
          ].map((item) => (
            <div
              key={item}
              className="px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-neutral-200"
            >
              {item}
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="flex flex-wrap gap-4 pt-4 items-center">

          <a
            href="https://engineering.virginia.edu/labs-groups/robust-low-power-vlsi/people"
            className="px-6 py-3 rounded-xl bg-emerald-400 text-black font-medium hover:scale-105 transition"
          >
            View Lab Affiliation
          </a>

          <a
            href="https://www.linkedin.com/in/trenton-elliott-6450a5241"
            className="px-6 py-3 rounded-xl border border-emerald-400/30 hover:bg-emerald-400/10 transition"
          >
            LinkedIn
          </a>

          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 rounded-xl border border-white/20 text-neutral-200 hover:border-emerald-300/40 hover:text-emerald-200 transition"
          >
            Stay in Touch
          </button>
        </div>

        {/* micro footer */}
        <div className="text-xs text-neutral-500 pt-6">
          Research focus: distributed embedded systems · wearable intelligence · ultra-low-power architectures
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-500/20 bg-black p-6 space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-emerald-300">
                Stay in Touch
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
            />

            <input
              name="email"
              value={form.email}
              onChange={update}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={update}
              placeholder="What are you interested in? (optional)"
              rows={4}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
            />

            <button
              onClick={submit}
              disabled={status === "sending"}
              className="w-full py-3 rounded-lg bg-emerald-400 text-black font-medium hover:opacity-90 transition"
            >
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                ? "Sent ✓"
                : "Submit"}
            </button>

            {status === "error" && (
              <p className="text-red-400 text-sm">
                Something went wrong. Try again.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const Vision = () => (
  <section className="px-8 py-24 max-w-4xl mx-auto relative z-10 space-y-10">

    <h2 className="text-4xl font-bold text-emerald-300">
      Vision
    </h2>

    {/* Core thesis */}
    <div className="space-y-4">
      <p className="text-xl text-neutral-200 leading-relaxed">
        ETILE explores a shift from centralized embedded systems toward
        physically distributed, chip-scale intelligence embedded directly
        into textiles and wearable substrates.
      </p>

      <p className="text-neutral-300 leading-relaxed">
        Instead of treating wearables as devices connected to compute,
        we treat computation, communication, and sensing as a
        <span className="text-emerald-300"> spatially distributed system </span>
        that exists at the scale of the material itself.
      </p>
    </div>

    {/* Technical stance */}
    <div className="space-y-4 border-l border-emerald-500/30 pl-6">
      <p className="text-neutral-300 leading-relaxed">
        Traditional embedded systems assume a small number of powerful nodes.
        ETILE instead assumes a large number of extremely constrained nodes,
        where system behavior emerges from interconnect topology, fault tolerance,
        and local cooperation.
      </p>

      <p className="text-neutral-300 leading-relaxed">
        This requires rethinking communication, power distribution, and signal
        processing from the ground up — not as layers on top of silicon,
        but as properties of the physical network itself.
      </p>
    </div>

    {/* Direction boundary */}
    <div className="space-y-4">
      <p className="text-neutral-300 leading-relaxed">
        The goal is not to build smaller devices, but to eliminate the
        distinction between device and system.
      </p>

      <p className="text-neutral-400 leading-relaxed">
        Applications include wearable health monitoring, distributed sensing
        fabrics, and constrained environments where traditional architectures
        fail. The core focus remains on improving architecture and productization.
      </p>
    </div>

  </section>
);

  const Applications = () => (
  <section className="px-8 py-24 max-w-6xl mx-auto relative z-10 space-y-14">

    {/* Header / framing */}
    <div className="space-y-4 max-w-3xl">
      <h2 className="text-4xl font-bold text-emerald-300">
        Applications
      </h2>

      <p className="text-neutral-300 leading-relaxed text-lg">
        ETILE systems are designed for physical environments where computation,
        sensing, and communication must be embedded directly into materials.
        These are not application “use cases” in the traditional sense —
        they are operating regimes that define system architecture itself.
      </p>

      <p className="text-neutral-400 leading-relaxed">
        Across these regimes, the same constraint set appears repeatedly:
        mobility, limited energy, high noise, and partial or unreliable connectivity.
      </p>
    </div>

    {/* Core conceptual idea strip */}
    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40">
      <p className="text-neutral-300 leading-relaxed">
        The central shift is from <span className="text-emerald-300">application-driven design</span>
        to <span className="text-emerald-300">regime-driven architecture</span> —
        where systems are defined by the physical constraints of their deployment
        environment rather than a fixed computational task.
      </p>
    </div>

    {/* Domain grid */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* Wearables / Health */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40 space-y-3">
        <h3 className="text-xl font-semibold text-emerald-300">
          Wearable & Biomedical Systems
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Continuous physiological monitoring using distributed ExG and
          sensing fabrics embedded into garments for long-term, real-world operation.
        </p>
      </div>

      {/* Defense */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40 space-y-3">
        <h3 className="text-xl font-semibold text-emerald-300">
          Defense & Security Systems
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Distributed sensing fabrics for contested or constrained environments
          where robustness, redundancy, and failure tolerance are critical.
        </p>
      </div>

      {/* Environmental */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40 space-y-3">
        <h3 className="text-xl font-semibold text-emerald-300">
          Environmental Monitoring
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Large-scale sensor fabrics for tracking physical conditions in
          distributed, hard-to-access, or dynamic environments.
        </p>
      </div>

      {/* Smart textiles */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40 space-y-3">
        <h3 className="text-xl font-semibold text-emerald-300">
          Smart Textile Computing
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Computation embedded directly into fabric structures, enabling
          garments that compute rather than merely host electronics.
        </p>
      </div>

      {/* Constrained systems */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-black/40 space-y-3 md:col-span-2">
        <h3 className="text-xl font-semibold text-emerald-300">
          Extreme & Constrained Operational Systems
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Systems designed for environments with severe energy constraints,
          intermittent connectivity, mechanical deformation, or high uncertainty —
          where traditional centralized architectures degrade.
        </p>
      </div>
    </div>

    {/* Closing anchor */}
    <div className="max-w-3xl space-y-4 border-t border-white/10 pt-10">
      <p className="text-neutral-300 leading-relaxed">
        Across all domains, the same principle applies:
        intelligence is not deployed as a device feature, but as a property of the material system.
      </p>

      <p className="text-neutral-500 text-sm">
        These domains are not independent applications — they are manifestations
        of a shared architectural constraint space.
      </p>
    </div>

  </section>
);

  const Works = () => (
    <section className="px-10 py-10 max-w-7x1 relative z-10">
      <h2 className="text-4xl font-bold text-emerald-300">Recent Works</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 w-full">
     {projects.map((p) => {
  const Card = (
    <div className="relative p-8 rounded-2xl border border-emerald-500/20 bg-black/40 hover:scale-[1.03] hover:border-emerald-300/40 transition-all duration-300 shadow-lg shadow-emerald-500/5 group overflow-hidden">

      {/* IMAGE */}
      {p.image && (
        <div className="relative w-full aspect-[16/9] mb-5 overflow-hidden rounded-xl border border-emerald-500/20">
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* TITLE */}
      <h3 className="text-2xl font-semibold mb-3 text-neutral-100">
        {p.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-neutral-300 text-sm leading-relaxed">
        {p.description}
      </p>

      {/* HOVER OVERLAY */}
      {p.link && (
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-emerald-300 text-2xl font-semibold tracking-wide transform scale-95 group-hover:scale-100 transition-all duration-300">
          Read More →
        </span>
      </div>
    )}
    </div>
  );

  return p.link ? (
    <a
      key={p.title}
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {Card}
    </a>
  ) : (
    <div key={p.title}>{Card}</div>
  );
})}
    </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Background />
      <Nav />

      {page === "home" && <Home />}
      {page === "vision" && <Vision />}
      {page === "applications" && <Applications />}
      {page === "works" && <Works />}

      <footer className="relative z-10 px-8 py-10 border-t border-white/10 text-center text-neutral-500 text-sm">
        © 2026 ETILE · Embedded Textile Intelligence Lab for Electronics
      </footer>
    </div>
  );
}
