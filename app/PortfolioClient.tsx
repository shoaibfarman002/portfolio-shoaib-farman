"use client";

import emailjs from "@emailjs/browser";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FaCss3Alt,
  FaGithub,
  FaGitAlt,
  FaHtml5,
  FaInstagram,
  FaJava,
  FaLinkedinIn,
  FaReact,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiDownload,
  FiEdit3,
  FiExternalLink,
  FiFilter,
  FiMail,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiPhone,
  FiPlus,
  FiSend,
  FiSun,
  FiTrash2,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";
import { SiJavascript, SiTailwindcss } from "react-icons/si";

type Theme = "dark" | "light";

type Project = {
  id: string;
  title: string;
  description: string;
  liveLink: string;
  githubLink: string;
  thumbnail: string;
  tags: string[];
};

type ProjectForm = {
  title: string;
  description: string;
  liveLink: string;
  githubLink: string;
  thumbnail: string;
  tags: string;
};

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
};

type AmbientTrack = {
  context: AudioContext;
  stop: () => void;
};

const contact = {
  name: "Shoaib Farman",
  role: "Frontend Developer & UI/UX Designer",
  location: "Daltonganj, Jharkhand",
  address: "Balta House, Jamia Nagar, Okhla, New Delhi - 110025",
  phone: "8092870350",
  email: "imraankhan23180@gmail.com",
  whatsapp:
    "https://wa.me/918092870350?text=Hi%20Shoaib%2C%20I%20want%20to%20discuss%20a%20project.",
  resume: "/resume-shoaib-farman.html",
};

const navItems = [
  ["Home", "home"],
  ["Story", "story"],
  ["Skills", "skills"],
  ["Services", "services"],
  ["Projects", "projects"],
  ["Contact", "contact"],
];

const socialLinks: Array<{ label: string; href: string; Icon: IconType }> = [
  { label: "GitHub", href: "https://github.com/shoaibfarman002", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shoaib-farman-4b2b27402/", Icon: FaLinkedinIn },
  { label: "Instagram", href: "https://www.instagram.com/i.shoaib.002", Icon: FaInstagram },
  { label: "WhatsApp", href: contact.whatsapp, Icon: FaWhatsapp },
];

const storyParagraphs = [
  {
    marker: "Class 7",
    text: "When I passed Class 7, my father sent me to stay with my relatives in Delhi to pursue my further studies.",
  },
  {
    marker: "2022",
    text: "I started coding in 2022 while studying in Class 9th.",
  },
  {
    marker: "2024 and 2025",
    text: "In 2024 during Class 11th and in 2025 during Class 12th, I stepped away from coding because my father wanted me to become a doctor. I moved to Kota and prepared for the NEET exam at ALLEN Kota.",
  },
  {
    marker: "November 2025",
    text: "In November 2025, my father suddenly suffered kidney failure. Our family went through an extremely difficult time. After several treatments and hospital visits, he was admitted to a hospital in Kolkata where he passed away on January 11th.",
  },
  {
    marker: "Three months",
    text: "That phase completely changed my life and deeply affected my mental health. With only three months remaining before the NEET exam, I felt lost and overwhelmed.",
  },
  {
    marker: "Technology",
    text: "Eventually, I decided to return to my original passion - technology and development.",
  },
  {
    marker: "BCA in Delhi",
    text: "I enrolled in a BCA program in Delhi and within 4-5 months I mastered frontend development fundamentals including HTML, CSS, JavaScript, React.js, Tailwind CSS, and UI/UX design by building many real-world projects.",
  },
  {
    marker: "Now",
    text: "Now I am learning Java for backend development and working toward becoming a full-stack developer.",
  },
];

const skills: Array<{
  name: string;
  percent: number;
  status: string;
  Icon: IconType;
  tone: string;
}> = [
  { name: "HTML", percent: 96, status: "Semantic UI structure", Icon: FaHtml5, tone: "orange" },
  { name: "CSS", percent: 93, status: "Responsive layouts", Icon: FaCss3Alt, tone: "blue" },
  { name: "JavaScript", percent: 88, status: "Interactive logic", Icon: SiJavascript, tone: "yellow" },
  { name: "React.js", percent: 86, status: "Modern components", Icon: FaReact, tone: "cyan" },
  { name: "Tailwind CSS", percent: 90, status: "Utility-first systems", Icon: SiTailwindcss, tone: "teal" },
  { name: "Git/GitHub", percent: 78, status: "Version control", Icon: FaGitAlt, tone: "pink" },
  { name: "Java", percent: 42, status: "Learning backend", Icon: FaJava, tone: "violet" },
];

const services = [
  {
    title: "React Website Development",
    price: "Project",
    amount: "From Rs. 7,999",
    body: "Fast, animated, component-driven websites built with React and clean UI architecture.",
    perks: ["Responsive pages", "Reusable components", "Performance-focused build"],
  },
  {
    title: "Landing Page Design",
    price: "Project",
    amount: "From Rs. 3,999",
    body: "Conversion-ready hero sections, smooth sections, and premium visual polish for launches.",
    perks: ["Modern copy layout", "CTA strategy", "Mobile-first design"],
  },
  {
    title: "Admin Dashboard UI",
    price: "Project",
    amount: "From Rs. 9,999",
    body: "Dense, usable dashboards with clean tables, charts, controls, and responsive states.",
    perks: ["Role-ready layouts", "Data cards", "Filtering UI"],
  },
  {
    title: "UI/UX Design",
    price: "Monthly",
    amount: "From Rs. 12,999/mo",
    body: "Interface redesign, wireframes, design systems, and product flows that feel smooth.",
    perks: ["UX audit", "Visual system", "Prototype-ready screens"],
  },
  {
    title: "Responsive Website Development",
    price: "Project",
    amount: "From Rs. 5,999",
    body: "Pixel-clean websites that adapt beautifully across mobile, tablet, and desktop.",
    perks: ["Cross-device QA", "SEO structure", "Accessibility pass"],
  },
];

const defaultProjects: Project[] = [
  {
    id: "varish-service-center",
    title: "Varish Service Center Website",
    description:
      "A modern bike service center website with a strong hero section, service highlights, booking flow, and clean responsive presentation.",
    liveLink: "https://shofar-service-center.vercel.app/",
    githubLink: "",
    thumbnail: "/projects/varish-service-center.png",
    tags: ["Service Website", "React", "Responsive"],
  },
  {
    id: "sofar-resume",
    title: "Sofar Resume Website",
    description:
      "A focused resume website designed to present profile details, skills, experience, and professional information in a simple digital format.",
    liveLink: "https://shofar-resume.vercel.app/",
    githubLink: "",
    thumbnail: "/projects/sofar-resume.png",
    tags: ["Resume", "Portfolio", "React"],
  },
  {
    id: "abc-education-delhi",
    title: "ABC Education Delhi",
    description:
      "An education website for ABC Education Delhi with informative sections, clean layout, and direct access for students and parents.",
    liveLink: "https://abc-education-delhi-4yc4.vercel.app/",
    githubLink: "",
    thumbnail: "/projects/abc-education-delhi.png",
    tags: ["Education", "Landing Page", "Responsive"],
  },
  {
    id: "dharmaseva",
    title: "DharmaSeva Online Pandit Booking",
    description:
      "An online pandit booking and live darshan platform concept with devotional service sections, booking-focused UI, and accessible navigation.",
    liveLink: "https://pandit-puja-live-darshan.vercel.app/",
    githubLink: "",
    thumbnail: "/projects/dharmaseva.png",
    tags: ["Booking", "Service Platform", "React"],
  },
];

const githubStats = [
  { label: "Total Projects", value: 18, suffix: "+" },
  { label: "Commits", value: 420, suffix: "+" },
  { label: "Technologies Used", value: 9, suffix: "" },
  { label: "Learning Progress", value: 72, suffix: "%" },
];

const caseStudies = [
  {
    title: "Dashboard Usability Upgrade",
    challenge: "Complex data needed to feel readable without slowing down decision-making.",
    process: "Grouped related actions, improved hierarchy, and added quick filters with clear states.",
    result: "Cleaner scanning, faster review flows, and a more professional admin experience.",
  },
  {
    title: "Landing Page Performance",
    challenge: "A visual page needed animation without heavy loading or layout shifts.",
    process: "Reduced animation cost, used progressive reveals, and kept assets lightweight.",
    result: "Smoother scrolling, stronger CTA focus, and better first impression on mobile.",
  },
  {
    title: "Mobile UI Refinement",
    challenge: "Desktop layouts were visually strong but mobile controls felt crowded.",
    process: "Rebuilt spacing, simplified cards, and made tap targets easier to use.",
    result: "More confidence on small screens and a product feel that stays premium everywhere.",
  },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Startup Founder",
    text: "Shoaib thinks beyond the screen. The React UI felt polished, fast, and ready for real users.",
  },
  {
    name: "Nisha Khan",
    role: "Product Designer",
    text: "His sense of spacing, motion, and detail makes simple interfaces feel premium and intentional.",
  },
  {
    name: "Rohit Verma",
    role: "Small Business Owner",
    text: "He translated my idea into a clean website with strong mobile design and smooth interactions.",
  },
  {
    name: "Priya Sharma",
    role: "Education Consultant",
    text: "The website felt professional from the first screen. The sections were clear, responsive, and easy to navigate.",
  },
  {
    name: "Sameer Ali",
    role: "Service Business Owner",
    text: "Shoaib created a polished service website that made our work look more trustworthy and organized online.",
  },
  {
    name: "Anjali Verma",
    role: "Career Mentor",
    text: "His resume-style web design is clean, readable, and much better than sharing a plain document.",
  },
  {
    name: "Kunal Raj",
    role: "Freelance Client",
    text: "He listens carefully, improves the UI details, and makes the final page feel smooth on both laptop and phone.",
  },
  {
    name: "Meera Iqbal",
    role: "Product Reviewer",
    text: "The design has a premium feel without becoming heavy. It loads well and the call-to-action buttons are easy to find.",
  },
];

const suggestedQuestions = [
  "Who is Shoaib?",
  "What technologies does he use?",
  "Can Shoaib build React websites?",
  "How can I hire Shoaib?",
];

const heroPhrases = ["React.js interfaces", "clean UI/UX systems", "responsive websites", "full-stack growth"];
const graphLevels = Array.from({ length: 112 }, (_, index) =>
  (index * 7 + index / 3) % 5 > 3 ? 4 : Math.floor((index * 5) % 4),
);

const emptyProjectForm: ProjectForm = {
  title: "",
  description: "",
  liveLink: "",
  githubLink: "",
  thumbnail: "",
  tags: "",
};

const legacyProjectIds = new Set(["admission-dashboard", "portfolio-system", "landing-lab"]);

function normalizeSavedProjects(savedProjects: Project[]) {
  const savedRealProjects = savedProjects.filter((project) => !legacyProjectIds.has(project.id));
  const merged = new Map<string, Project>();

  defaultProjects.forEach((project) => merged.set(project.id, project));
  savedRealProjects.forEach((project) => merged.set(project.id, project));

  return Array.from(merged.values());
}

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const ambientNotes = [196, 246.94, 293.66, 369.99];
const melodyNotes = [392, 493.88, 587.33, 739.99, 659.25, 493.88];

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
    null
  );
}

function createAmbientTrack(): AmbientTrack | null {
  const AudioContextCtor = getAudioContextConstructor();
  if (!AudioContextCtor) return null;

  const context = new AudioContextCtor();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(1.8);
  const feedback = context.createGain();
  const melodyBus = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  const oscillators: OscillatorNode[] = [];
  let melodyStep = 0;

  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.linearRampToValueAtTime(0.22, context.currentTime + 0.8);
  master.connect(context.destination);

  filter.type = "lowpass";
  filter.frequency.value = 820;
  filter.Q.value = 0.82;
  filter.connect(master);

  delay.delayTime.value = 0.46;
  feedback.gain.value = 0.22;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(filter);

  melodyBus.gain.value = 0.42;
  melodyBus.connect(filter);
  melodyBus.connect(delay);

  ambientNotes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index % 2 === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 4 - 6;
    gain.gain.value = 0.052 + index * 0.006;
    oscillator.connect(gain);
    gain.connect(filter);
    gain.connect(delay);
    oscillator.start();
    oscillators.push(oscillator);
  });

  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 110;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  const playMelodyNote = () => {
    const frequency = melodyNotes[melodyStep % melodyNotes.length];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.13, startAt + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.25);
    oscillator.connect(gain);
    gain.connect(melodyBus);
    oscillator.start(startAt);
    oscillator.stop(startAt + 1.35);
    melodyStep += 1;
  };

  playMelodyNote();
  const melodyTimer = window.setInterval(playMelodyNote, 1750);

  return {
    context,
    stop: () => {
      const endAt = context.currentTime + 0.22;
      window.clearInterval(melodyTimer);
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setValueAtTime(master.gain.value, context.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, endAt);
      oscillators.forEach((oscillator) => oscillator.stop(endAt + 0.02));
      lfo.stop(endAt + 0.02);
      window.setTimeout(() => {
        void context.close().catch(() => undefined);
      }, 280);
    },
  };
}

function playInterfaceTone(context: AudioContext, frequency = 660, level = 0.055) {
  if (context.state !== "running") return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startAt = context.currentTime;
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(level, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.15);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + 0.17);
}

export default function PortfolioClient() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState<Theme>("dark");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navHidden, setNavHidden] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState("");
  const [expandedCase, setExpandedCase] = useState(caseStudies[0].title);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      from: "bot",
      text: "Hi, I am Shoaib's portfolio assistant. Ask me about his skills, services, projects, or hiring details.",
    },
  ]);
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const themeStorageReady = useRef(false);
  const projectsStorageReady = useRef(false);
  const lastScrollY = useRef(0);
  const musicRef = useRef<AmbientTrack | null>(null);

  const filters = useMemo(() => {
    const tagSet = new Set<string>(["All"]);
    projects.forEach((project) => project.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;
    return projects.filter((project) => project.tags.includes(selectedFilter));
  }, [projects, selectedFilter]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem("shoaib-theme") as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        themeStorageReady.current = true;
        document.documentElement.dataset.theme = storedTheme;
        setTheme(storedTheme);
      } else {
        themeStorageReady.current = true;
        window.localStorage.setItem("shoaib-theme", "dark");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (themeStorageReady.current) {
      window.localStorage.setItem("shoaib-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedProjects = window.localStorage.getItem("shoaib-projects");
      projectsStorageReady.current = true;
      if (!savedProjects) return;
      try {
        const parsed = JSON.parse(savedProjects) as Project[];
        if (Array.isArray(parsed) && parsed.length) {
          setProjects(normalizeSavedProjects(parsed));
        }
      } catch {
        window.localStorage.removeItem("shoaib-projects");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!projectsStorageReady.current) return;
    window.localStorage.setItem("shoaib-projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % heroPhrases.length);
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const sectionIds = navItems.map(([, target]) => target);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-34% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const shouldHide = currentY > lastScrollY.current && currentY > 180 && !mobileNavOpen;
        setNavHidden(shouldHide);
        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileNavOpen]);

  useEffect(() => {
    return () => {
      musicRef.current?.stop();
      musicRef.current = null;
    };
  }, []);

  const playTone = () => {
    if (!musicEnabled || !musicRef.current) return;
    playInterfaceTone(musicRef.current.context, 520, 0.032);
  };

  const toggleMusic = async () => {
    if (musicRef.current) {
      musicRef.current.stop();
      musicRef.current = null;
      setMusicEnabled(false);
      return;
    }

    const track = createAmbientTrack();
    if (!track) return;

    try {
      if (track.context.state === "suspended") {
        await track.context.resume();
      }
      musicRef.current = track;
      setMusicEnabled(true);
      playInterfaceTone(track.context, 740, 0.06);
    } catch {
      track.stop();
      musicRef.current = null;
      setMusicEnabled(false);
    }
  };

  const handleProjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playTone();
    const tags = projectForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const nextProject: Project = {
      id: editingProjectId || `project-${Date.now()}`,
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      liveLink: projectForm.liveLink.trim() || "#projects",
      githubLink: projectForm.githubLink.trim() || "#projects",
      thumbnail: projectForm.thumbnail.trim(),
      tags: tags.length ? tags : ["React"],
    };

    if (!nextProject.title || !nextProject.description) return;

    setProjects((current) =>
      editingProjectId
        ? current.map((project) => (project.id === editingProjectId ? nextProject : project))
        : [nextProject, ...current],
    );
    setProjectStatus(editingProjectId ? "Project updated and saved in this browser." : "Project added and saved in this browser.");
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
  };

  const editProject = (project: Project) => {
    playTone();
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      thumbnail: project.thumbnail,
      tags: project.tags.join(", "),
    });
  };

  const removeProject = (projectId: string) => {
    playTone();
    setProjects((current) => current.filter((project) => project.id !== projectId));
    if (editingProjectId === projectId) {
      setEditingProjectId(null);
      setProjectForm(emptyProjectForm);
    }
  };

  const answerQuestion = (question: string) => {
    playTone();
    const lower = question.toLowerCase();
    let answer =
      "Shoaib is focused on frontend development, premium UI/UX, React interfaces, and his path toward full-stack development with Java.";

    if (lower.includes("who")) {
      answer =
        "Shoaib Farman is a frontend developer and UI/UX designer from Jharkhand, currently studying BCA in Delhi and building modern React projects.";
    } else if (lower.includes("technolog") || lower.includes("use")) {
      answer =
        "He works with HTML, CSS, JavaScript, React.js, Tailwind CSS, Git/GitHub, UI/UX design, and is currently learning Java for backend development.";
    } else if (lower.includes("react")) {
      answer =
        "Yes. Shoaib can build responsive React websites, landing pages, admin dashboards, animated UI systems, and portfolio experiences.";
    } else if (lower.includes("hire") || lower.includes("contact")) {
      answer = `You can hire Shoaib by WhatsApp at ${contact.phone} or email him at ${contact.email}.`;
    }

    setChatMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, from: "user", text: question },
      { id: `bot-${Date.now() + 1}`, from: "bot", text: answer },
    ]);
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playTone();
    setContactStatus("loading");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const templateParams = {
      from_name: String(formData.get("name") || ""),
      from_email: String(formData.get("email") || ""),
      project_type: String(formData.get("projectType") || ""),
      budget: String(formData.get("budget") || ""),
      message: String(formData.get("message") || ""),
      to_email: contact.email,
    };

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, templateParams, { publicKey });
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 600));
      }

      setContactStatus("success");
      form.reset();
    } catch {
      setContactStatus("error");
    }
  };

  return (
    <main className="portfolio-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <div className="ambient-background" aria-hidden="true" />

      <header className={`nav-shell ${navHidden ? "nav-hidden" : ""}`}>
        <a href="#home" className="brand-mark" aria-label="Shoaib Farman home">
          SF
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, target]) => (
            <a key={target} href={`#${target}`} className={activeSection === target ? "active" : ""}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className={`music-toggle ${musicEnabled ? "active" : ""}`}
            aria-label={musicEnabled ? "Stop background music" : "Play background music"}
            onClick={toggleMusic}
          >
            {musicEnabled ? <FiVolume2 /> : <FiVolumeX />}
            <span>{musicEnabled ? "Music On" : "Play Music"}</span>
          </button>
          <IconButton
            label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </IconButton>
          <IconButton label="Open navigation menu" className="mobile-menu-button" onClick={() => setMobileNavOpen(true)}>
            <FiMenu />
          </IconButton>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.aside
            className="mobile-nav"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mobile-nav-top">
              <span>Menu</span>
              <IconButton label="Close navigation menu" onClick={() => setMobileNavOpen(false)}>
                <FiX />
              </IconButton>
            </div>
            {navItems.map(([label, target]) => (
              <a
                key={target}
                href={`#${target}`}
                className={activeSection === target ? "active" : ""}
                onClick={() => setMobileNavOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <section id="home" className="hero-section">
        <motion.div
          className="hero-copy-panel"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="eyebrow">Frontend Developer & UI/UX Designer</p>
          <h1>
            Hi, I&apos;m <span>Shoaib Farman</span>
          </h1>
          <div className="role-line" aria-live="polite">
            <span>Crafting</span>
            <AnimatePresence mode="wait">
              <motion.strong
                key={phraseIndex}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {heroPhrases[phraseIndex]}
              </motion.strong>
            </AnimatePresence>
          </div>
          <p className="hero-copy">
            Frontend Developer crafting modern UI/UX experiences with React.js.
          </p>
          <div className="hero-buttons">
            <ButtonLink href={contact.resume} download onClick={playTone} variant="primary">
              <FiDownload />
              Resume Download
            </ButtonLink>
            <ButtonLink href="#contact" onClick={playTone} variant="secondary">
              <FiArrowRight />
              Hire Me
            </ButtonLink>
            <ButtonLink href={contact.whatsapp} target="_blank" rel="noreferrer" onClick={playTone} variant="whatsapp">
              <FaWhatsapp />
              WhatsApp
            </ButtonLink>
          </div>
          <div className="social-row">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.aside
          className="hero-profile"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        >
          <div className="profile-visual">
            {/* Static portfolio portrait; using img keeps this client component lightweight. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile-shoaib-farman.jpeg" alt="Shoaib Farman portrait" />
          </div>
          <div className="profile-summary">
            <p>Available for React projects</p>
            <h2>BCA Student in Delhi</h2>
          </div>
          <div className="profile-metrics">
            <span>
              <strong>4-5</strong>
              Months intensive frontend
            </span>
            <span>
              <strong>7</strong>
              Core technologies
            </span>
          </div>
        </motion.aside>
      </section>

      <section id="story" className="story-section section-block">
        <Reveal className="section-heading story-heading">
          <p className="eyebrow">My Story</p>
          <h2>A focused return to the work I love.</h2>
          <p>
            A calm reading experience about study, family, loss, recovery, and choosing technology again.
          </p>
        </Reveal>
        <div className="story-layout">
          <Reveal className="story-intro">
            <span>Personal Journey</span>
            <p>
              The story is emotional, but the design gives it room to breathe: readable paragraphs, highlighted years,
              and a steady rhythm.
            </p>
          </Reveal>
          <article className="story-prose">
            {storyParagraphs.map((item, index) => (
              <Reveal as="p" key={item.marker} delay={index * 0.03}>
                <mark>{item.marker}</mark>
                {item.text}
              </Reveal>
            ))}
          </article>
        </div>
      </section>

      <section id="skills" className="section-block">
        <Reveal className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>Frontend fundamentals with full-stack direction.</h2>
          <p>Clean, focused skill cards with progress indicators and lightweight hover states.</p>
        </Reveal>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <Reveal key={skill.name} delay={index * 0.03}>
              <article className={`skill-card tone-${skill.tone}`}>
                <div className="skill-topline">
                  <span className="skill-icon">
                    <skill.Icon />
                  </span>
                  <strong>{skill.percent}%</strong>
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.status}</p>
                <div className="progress-track" aria-label={`${skill.name} skill level ${skill.percent}%`}>
                  <motion.span
                    initial={shouldReduceMotion ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: skill.percent / 100 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" className="section-block">
        <Reveal className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Services built for polished digital products.</h2>
          <p>Project and monthly options for websites, dashboards, landing pages, UI/UX, and responsive frontend builds.</p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.03}>
              <article className="service-card">
                <div>
                  <div className="service-price">
                    <span>{service.price}</span>
                    <strong>{service.amount}</strong>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
                <ul>
                  {service.perks.map((perk) => (
                    <li key={perk}>
                      <FiCheckCircle />
                      {perk}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="#contact" variant="secondary" onClick={playTone}>
                  <FiSend />
                  Get Started
                </ButtonLink>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="projects" className="section-block">
        <Reveal className="section-heading">
          <p className="eyebrow">Live Projects Dashboard</p>
          <h2>Manage project cards without losing polish.</h2>
          <p>Paste a live link, GitHub link, title, description, thumbnail image URL, and tags. New projects you add here are saved as real project cards in your browser.</p>
        </Reveal>

        <Reveal className="project-control">
          <div className="project-control-copy">
            <p className="eyebrow">Admin Input</p>
            <h3>{editingProjectId ? "Edit project card" : "Add a project card"}</h3>
            <p>Keep your portfolio fresh by adding real project links and previews directly from this page. This form adds your entered project, not dummy data.</p>
          </div>
          <form onSubmit={handleProjectSubmit} className="project-form">
            <FormField label="Project title">
              <input
                value={projectForm.title}
                onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Modern React Dashboard"
                required
              />
            </FormField>
            <FormField label="Description" full>
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Write what this project solves..."
                required
              />
            </FormField>
            <FormField label="Live website link">
              <input
                value={projectForm.liveLink}
                onChange={(event) => setProjectForm((current) => ({ ...current, liveLink: event.target.value }))}
                placeholder="https://your-live-site.com"
              />
            </FormField>
            <FormField label="GitHub link">
              <input
                value={projectForm.githubLink}
                onChange={(event) => setProjectForm((current) => ({ ...current, githubLink: event.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </FormField>
            <FormField label="Thumbnail image">
              <input
                value={projectForm.thumbnail}
                onChange={(event) => setProjectForm((current) => ({ ...current, thumbnail: event.target.value }))}
                placeholder="Paste image URL"
              />
            </FormField>
            <FormField label="Technology tags">
              <input
                value={projectForm.tags}
                onChange={(event) => setProjectForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="React, Tailwind, UI/UX"
              />
            </FormField>
            <div className="project-form-actions">
              <button type="submit">
                <FiPlus />
                {editingProjectId ? "Save Project" : "Add Project"}
              </button>
              {editingProjectId ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm(emptyProjectForm);
                  }}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
            {projectStatus ? <p className="project-status">{projectStatus}</p> : null}
          </form>
        </Reveal>

        <Reveal className="filter-row" aria-label="Project filters">
          <FiFilter />
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={selectedFilter === filter ? "active" : ""}
              onClick={() => {
                playTone();
                setSelectedFilter(filter);
              }}
            >
              {filter}
            </button>
          ))}
        </Reveal>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.03}>
              <ProjectCard project={project} onEdit={editProject} onRemove={removeProject} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-block github-section">
        <Reveal className="section-heading">
          <p className="eyebrow">GitHub Activity</p>
          <h2>Learning in public, building with momentum.</h2>
          <p>Contribution-style activity, repository highlights, animated counters, and technology growth indicators.</p>
        </Reveal>
        <Reveal className="github-panel">
          <div className="stats-grid">
            {githubStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <Counter value={stat.value} suffix={stat.suffix} />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="contribution-graph" aria-label="Stylized GitHub contribution graph">
            {graphLevels.map((level, index) => (
              <span key={index} data-level={level} />
            ))}
          </div>
          <div className="repo-showcase">
            {defaultProjects.map((project) => (
              <article key={project.id}>
                <FaGithub />
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.tags.join(" / ")}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section-block">
        <Reveal className="section-heading">
          <p className="eyebrow">Case Studies</p>
          <h2>Challenges, process, and measurable UI improvement.</h2>
          <p>Expandable cards showing how Shoaib thinks about clarity, performance, and user experience.</p>
        </Reveal>
        <div className="case-grid">
          {caseStudies.map((study, index) => {
            const isOpen = expandedCase === study.title;
            return (
              <Reveal key={study.title} delay={index * 0.03}>
                <motion.article className="case-card" layout>
                  <button type="button" onClick={() => setExpandedCase(isOpen ? "" : study.title)}>
                    <span>{study.title}</span>
                    <FiArrowRight className={isOpen ? "rotated" : ""} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        className="case-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <p>
                          <strong>Challenge:</strong> {study.challenge}
                        </p>
                        <p>
                          <strong>Process:</strong> {study.process}
                        </p>
                        <p>
                          <strong>Result:</strong> {study.result}
                        </p>
                        <div className="before-after">
                          <span>Before</span>
                          <div>
                            <i />
                          </div>
                          <span>After</span>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section-block testimonial-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Testimonials</p>
          <h2>Feedback presented with restraint.</h2>
          <p>Clean testimonial cards, calm transitions, and simple carousel controls.</p>
        </Reveal>
        <Reveal className="testimonial-shell">
          <AnimatePresence mode="wait">
            <motion.article
              className="testimonial-card"
              key={testimonials[testimonialIndex].name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
            >
              <div className="testimonial-avatar">{initials(testimonials[testimonialIndex].name)}</div>
              <p>&quot;{testimonials[testimonialIndex].text}&quot;</p>
              <h3>{testimonials[testimonialIndex].name}</h3>
              <span>{testimonials[testimonialIndex].role}</span>
            </motion.article>
          </AnimatePresence>
          <div className="testimonial-dots">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                className={index === testimonialIndex ? "active" : ""}
                onClick={() => setTestimonialIndex(index)}
                aria-label={`Show testimonial from ${testimonial.name}`}
              />
            ))}
          </div>
        </Reveal>
      </section>

      <section id="contact" className="section-block contact-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s build something modern.</h2>
          <p>Send a project inquiry, open WhatsApp directly, or use the contact details below.</p>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-panel">
            <h3>{contact.name}</h3>
            <p>{contact.role}</p>
            <a href={`tel:+91${contact.phone}`}>
              <FiPhone />
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`}>
              <FiMail />
              {contact.email}
            </a>
            <span>
              <FiMapPin />
              {contact.location}
            </span>
            <span>
              <FiMapPin />
              {contact.address}
            </span>
            <ButtonLink href={contact.whatsapp} target="_blank" rel="noreferrer" variant="whatsapp" onClick={playTone}>
              <FaWhatsapp />
              WhatsApp Direct Message
            </ButtonLink>
            <div className="map-panel" aria-label="Animated location map">
              <span className="map-pin delhi">Delhi</span>
              <span className="map-pin home">Jharkhand</span>
              <i />
            </div>
          </Reveal>
          <Reveal as="form" className="contact-form" onSubmit={handleContactSubmit}>
            <FormField label="Name">
              <input name="name" placeholder="Your name" required />
            </FormField>
            <FormField label="Email">
              <input name="email" type="email" placeholder="you@example.com" required />
            </FormField>
            <FormField label="Project Type">
              <PremiumSelect
                name="projectType"
                defaultValue="React Website"
                options={["React Website", "Landing Page", "Admin Dashboard UI", "UI/UX Design", "Responsive Website"]}
              />
            </FormField>
            <FormField label="Budget">
              <PremiumSelect
                name="budget"
                defaultValue="Rs. 5,000 - Rs. 15,000"
                options={["Rs. 5,000 - Rs. 15,000", "Rs. 15,000 - Rs. 35,000", "Rs. 35,000+", "Monthly collaboration"]}
              />
            </FormField>
            <FormField label="Message" full>
              <textarea name="message" placeholder="Tell me about your project..." required />
            </FormField>
            <button type="submit" disabled={contactStatus === "loading"}>
              <FiSend />
              {contactStatus === "loading" ? "Sending..." : "Send Inquiry"}
            </button>
            <AnimatePresence>
              {contactStatus === "success" ? (
                <motion.p className="form-status success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Message ready. EmailJS is connected when your public keys are added.
                </motion.p>
              ) : null}
              {contactStatus === "error" ? (
                <motion.p className="form-status error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  EmailJS could not send right now. Please use WhatsApp or email directly.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <a href="#home" className="footer-logo">
          SF
        </a>
        <nav aria-label="Footer navigation">
          {navItems.map(([label, target]) => (
            <a key={target} href={`#${target}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="social-row">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <Icon />
            </a>
          ))}
        </div>
        <p>Copyright 2026 Shoaib Farman. Built with React & Passion.</p>
      </footer>

      <ChatAssistant open={chatOpen} setOpen={setChatOpen} messages={chatMessages} onQuestion={answerQuestion} />
    </main>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "form";
} & React.HTMLAttributes<HTMLElement>) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      variants={reveal}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -12% 0px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </Component>
  );
}

function ButtonLink({
  children,
  variant,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant: "primary" | "secondary" | "whatsapp" }) {
  return (
    <a {...props} className={`button-link ${variant} ${className}`}>
      {children}
    </a>
  );
}

function IconButton({
  children,
  label,
  className = "",
  onClick,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`icon-button ${className}`} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function FormField({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`form-field ${full ? "full-field" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function PremiumSelect({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const id = `${name}-select`;

  return (
    <div className="premium-select">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span id={id}>{value}</span>
        <FiChevronDown className={open ? "open" : ""} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            className="select-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            {options.map((option) => (
              <li key={option} role="option" aria-selected={value === option}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {value === option ? <FiCheck /> : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const ProjectCard = memo(function ProjectCard({
  project,
  onEdit,
  onRemove,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="project-card">
      <div className="project-thumb">
        {project.thumbnail ? (
          // Dynamic visitor-supplied thumbnails cannot use a static image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.thumbnail} alt={`${project.title} preview`} loading="lazy" decoding="async" />
        ) : (
          <div className="thumb-fallback">
            <span>{project.title.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-links">
        <a className="live-demo-link" href={project.liveLink || "#projects"} target="_blank" rel="noreferrer">
          <FiExternalLink />
          View Live Demo
        </a>
        {project.githubLink ? (
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            <FaGithub />
            GitHub
          </a>
        ) : null}
      </div>
      <div className="project-admin-actions">
        <button type="button" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`}>
          <FiEdit3 />
        </button>
        <button type="button" onClick={() => onRemove(project.id)} aria-label={`Remove ${project.title}`}>
          <FiTrash2 />
        </button>
      </div>
    </article>
  );
});

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let start: number | null = null;
        const step = (timestamp: number) => {
          start ??= timestamp;
          const progress = Math.min((timestamp - start) / 900, 1);
          setCount(Math.floor(progress * value));
          if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <strong ref={ref}>
      {count}
      {suffix}
    </strong>
  );
}

function ChatAssistant({
  open,
  setOpen,
  messages,
  onQuestion,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: ChatMessage[];
  onQuestion: (question: string) => void;
}) {
  const [customQuestion, setCustomQuestion] = useState("");

  const submitCustomQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = customQuestion.trim();
    if (!question) return;
    onQuestion(question);
    setCustomQuestion("");
  };

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {open ? (
          <motion.section
            className="chat-panel"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            aria-label="Ask About Shoaib chat"
          >
            <header>
              <div>
                <span>AI</span>
                <strong>Ask About Shoaib</strong>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
                <FiX />
              </button>
            </header>
            <div className="chat-messages">
              {messages.map((message) => (
                <p key={message.id} className={message.from}>
                  {message.text}
                </p>
              ))}
            </div>
            <div className="suggested-questions">
              {suggestedQuestions.map((question) => (
                <button key={question} type="button" onClick={() => onQuestion(question)}>
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={submitCustomQuestion}>
              <input
                value={customQuestion}
                onChange={(event) => setCustomQuestion(event.target.value)}
                placeholder="Ask a question..."
                aria-label="Ask a custom question"
              />
              <button type="submit" aria-label="Send question">
                <FiSend />
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
      <button type="button" className="chat-launcher" onClick={() => setOpen(!open)} aria-label="Ask About Shoaib">
        <FiMessageCircle />
        <span>Ask About Shoaib</span>
      </button>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
