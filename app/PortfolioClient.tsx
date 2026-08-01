"use client";

import emailjs from "@emailjs/browser";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react";
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
  FiCheckCircle,
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
import * as THREE from "three";

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
  { label: "GitHub", href: "#projects", Icon: FaGithub },
  { label: "LinkedIn", href: "#contact", Icon: FaLinkedinIn },
  { label: "Instagram", href: "#contact", Icon: FaInstagram },
  { label: "WhatsApp", href: contact.whatsapp, Icon: FaWhatsapp },
];

const storyCards = [
  {
    year: "Class 7",
    title: "A New City, A New Direction",
    body: "When I passed Class 7, my father sent me to stay with my relatives in Delhi to pursue my further studies.",
  },
  {
    year: "2022",
    title: "The First Spark",
    body: "I started coding in 2022 while studying in Class 9th, and technology quickly became the thing I wanted to build my life around.",
  },
  {
    year: "2024 - 2025",
    title: "A Different Path",
    body: "During Class 11th and Class 12th, I stepped away from coding because my father wanted me to become a doctor. I moved to Kota and prepared for the NEET exam at ALLEN Kota.",
  },
  {
    year: "Nov 2025",
    title: "The Hardest Season",
    body: "In November 2025, my father suddenly suffered kidney failure. Our family went through an extremely difficult time with treatments, hospital visits, and uncertainty.",
  },
  {
    year: "Jan 11",
    title: "A Life-Changing Loss",
    body: "He was admitted to a hospital in Kolkata where he passed away on January 11th. That phase deeply affected my mental health, with only three months remaining before the NEET exam.",
  },
  {
    year: "Now",
    title: "Return To Technology",
    body: "Eventually, I returned to my original passion - technology and development. I enrolled in BCA in Delhi and rebuilt my path with focus.",
  },
  {
    year: "4-5 Months",
    title: "Frontend Mastery",
    body: "Within 4-5 months I mastered frontend fundamentals including HTML, CSS, JavaScript, React.js, Tailwind CSS, and UI/UX design by building real-world projects.",
  },
  {
    year: "Next",
    title: "Full-Stack Mission",
    body: "Now I am learning Java for backend development and working toward becoming a full-stack developer.",
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
    amount: "From ₹7,999",
    body: "Fast, animated, component-driven websites built with React and clean UI architecture.",
    perks: ["Responsive pages", "Reusable components", "Performance-focused build"],
  },
  {
    title: "Landing Page Design",
    price: "Project",
    amount: "From ₹3,999",
    body: "Conversion-ready hero sections, smooth sections, and premium visual polish for launches.",
    perks: ["Modern copy layout", "CTA strategy", "Mobile-first design"],
  },
  {
    title: "Admin Dashboard UI",
    price: "Project",
    amount: "From ₹9,999",
    body: "Dense, usable dashboards with clean tables, charts, controls, and responsive states.",
    perks: ["Role-ready layouts", "Data cards", "Filtering UI"],
  },
  {
    title: "UI/UX Design",
    price: "Monthly",
    amount: "From ₹12,999/mo",
    body: "Interface redesign, wireframes, design systems, and product flows that feel smooth.",
    perks: ["UX audit", "Visual system", "Prototype-ready screens"],
  },
  {
    title: "Responsive Website Development",
    price: "Project",
    amount: "From ₹5,999",
    body: "Pixel-clean websites that adapt beautifully across mobile, tablet, and desktop.",
    perks: ["Cross-device QA", "SEO structure", "Accessibility pass"],
  },
];

const defaultProjects: Project[] = [
  {
    id: "admission-dashboard",
    title: "Spot Admission Dashboard",
    description:
      "A polished admin-style interface for managing spot admission workflows, filtering candidates, and reviewing data quickly.",
    liveLink: "https://example.com",
    githubLink: "https://github.com/",
    thumbnail: "",
    tags: ["React", "Dashboard", "Tailwind"],
  },
  {
    id: "portfolio-system",
    title: "Interactive Portfolio System",
    description:
      "A futuristic React portfolio concept with motion, glass UI, chatbot answers, and a project publishing studio.",
    liveLink: "https://example.com",
    githubLink: "https://github.com/",
    thumbnail: "",
    tags: ["React", "UI/UX", "Animation"],
  },
  {
    id: "landing-lab",
    title: "Startup Landing Page Lab",
    description:
      "A modern product landing experience with animated hero states, conversion sections, and responsive design polish.",
    liveLink: "https://example.com",
    githubLink: "https://github.com/",
    thumbnail: "",
    tags: ["Landing", "Tailwind", "UI/UX"],
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
];

const suggestedQuestions = [
  "Who is Shoaib?",
  "What technologies does he use?",
  "Can Shoaib build React websites?",
  "How can I hire Shoaib?",
];

const typingPhrases = ["React.js interfaces.", "cinematic UI/UX.", "responsive web apps.", "full-stack growth."];

const emptyProjectForm: ProjectForm = {
  title: "",
  description: "",
  liveLink: "",
  githubLink: "",
  thumbnail: "",
  tags: "",
};

export default function PortfolioClient() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState<Theme>("dark");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
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
  const storyRef = useRef<HTMLElement | null>(null);
  const themeStorageReady = useRef(false);
  const projectsStorageReady = useRef(false);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const storyX = useTransform(storyProgress, [0, 1], ["0%", "-58%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: shouldReduceMotion ? 0 : 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: shouldReduceMotion ? 0.1 : 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [shouldReduceMotion]);

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
          setProjects(parsed);
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
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion]);

  const playTone = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) return;
    const audio = new AudioContextCtor();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = 540;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, audio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.13);
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
        await new Promise((resolve) => window.setTimeout(resolve, 700));
      }

      setContactStatus("success");
      form.reset();
    } catch {
      setContactStatus("error");
    }
  };

  return (
    <main className="portfolio-shell">
      <motion.div className="scroll-progress" style={{ width: progressWidth }} />
      <CustomCursor />
      <ParticleField />

      <header className="nav-shell">
        <a href="#home" className="brand-mark" aria-label="Shoaib Farman home">
          <span>SF</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, target]) => (
            <a key={target} href={`#${target}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <IconButton
            label={soundEnabled ? "Turn sound effects off" : "Turn sound effects on"}
            onClick={() => setSoundEnabled((current) => !current)}
          >
            {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </IconButton>
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <IconButton label="Close navigation menu" onClick={() => setMobileNavOpen(false)}>
              <FiX />
            </IconButton>
            {navItems.map(([label, target]) => (
              <a key={target} href={`#${target}`} onClick={() => setMobileNavOpen(false)}>
                {label}
              </a>
            ))}
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <aside className="side-nav" aria-label="Section shortcuts">
        {navItems.map(([label, target]) => (
          <a key={target} href={`#${target}`} aria-label={`Go to ${label}`}>
            <span />
          </a>
        ))}
      </aside>

      <section id="home" className="hero-section">
        <HeroScene />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="eyebrow">Frontend Developer & UI/UX Designer</p>
          <h1>
            Hi, I&apos;m <span>Shoaib Farman</span>
          </h1>
          <TypingLine />
          <p className="hero-copy">
            Frontend Developer crafting modern UI/UX experiences with React.js.
          </p>
          <div className="hero-buttons">
            <MagneticLink href={contact.resume} download onClick={playTone} variant="primary">
              <FiDownload />
              Resume Download
            </MagneticLink>
            <MagneticLink href="#contact" onClick={playTone} variant="secondary">
              <FiArrowRight />
              Hire Me
            </MagneticLink>
            <MagneticLink href={contact.whatsapp} target="_blank" rel="noreferrer" onClick={playTone} variant="whatsapp">
              <FaWhatsapp />
              WhatsApp
            </MagneticLink>
          </div>
          <div className="social-row">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="profile-card"
          initial={{ opacity: 0, rotateY: -18, y: 34 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
        >
          <div className="profile-card-inner">
            <div className="profile-orbit">
              <span className="profile-avatar">SF</span>
              <span className="orbit-dot orbit-dot-one" />
              <span className="orbit-dot orbit-dot-two" />
              <span className="orbit-dot orbit-dot-three" />
            </div>
            <div className="profile-meta">
              <span>Available for React projects</span>
              <strong>BCA Student in Delhi</strong>
            </div>
          </div>
        </motion.div>

        <a href="#story" className="scroll-indicator" aria-label="Scroll to story section">
          <span />
        </a>
      </section>

      <section id="story" className="story-section" ref={storyRef}>
        <div className="section-heading story-heading gsap-reveal">
          <p className="eyebrow">My Story</p>
          <h2>A cinematic path back to technology.</h2>
          <p>
            A horizontal, scroll-driven timeline about study, family, grief, recovery, and the choice to build again.
          </p>
        </div>
        <div className="story-sticky">
          <motion.div className="story-progress" style={{ scaleX: storyProgress }} />
          <motion.div className="story-track" style={{ x: storyX }}>
            {storyCards.map((item, index) => (
              <motion.article
                className="story-card"
                key={item.title}
                whileHover={{ y: -12, rotateX: 4, rotateY: -4 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <span className="year-badge">{item.year}</span>
                <span className="story-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="skills" className="content-section skills-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Skills</p>
          <h2>3D skill cards with measurable progress.</h2>
          <p>Frontend fundamentals, modern React UI, Tailwind systems, Git workflow, and Java backend learning.</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.article
              className={`skill-card tone-${skill.tone} gsap-reveal`}
              key={skill.name}
              whileHover={{ y: -14, rotateX: 7, rotateY: index % 2 ? -7 : 7 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <div className="skill-icon">
                <skill.Icon />
              </div>
              <div>
                <h3>{skill.name}</h3>
                <p>{skill.status}</p>
              </div>
              <div className="skill-percent">{skill.percent}%</div>
              <div className="progress-track" aria-label={`${skill.name} skill level ${skill.percent}%`}>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 1.1, delay: index * 0.08 }}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="services" className="content-section services-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Services</p>
          <h2>Premium UI services for real projects.</h2>
          <p>Project and monthly options for websites, dashboards, landing pages, UI/UX, and responsive frontend builds.</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <motion.article className="service-card gsap-reveal" key={service.title} whileHover={{ y: -12, scale: 1.02 }}>
              <div className="service-price">
                <span>{service.price}</span>
                <strong>{service.amount}</strong>
              </div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <ul>
                {service.perks.map((perk) => (
                  <li key={perk}>
                    <FiCheckCircle />
                    {perk}
                  </li>
                ))}
              </ul>
              <MagneticLink href="#contact" variant="secondary" onClick={playTone}>
                <FiSend />
                Get Started
              </MagneticLink>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="projects" className="content-section projects-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Live Projects Dashboard</p>
          <h2>Add, edit, filter, and open project cards.</h2>
          <p>Paste a live link, GitHub link, title, description, thumbnail image URL, and tags. Your browser saves the cards locally.</p>
        </div>

        <div className="project-control gsap-reveal">
          <div>
            <p className="eyebrow">Admin Input</p>
            <h3>{editingProjectId ? "Edit project card" : "Add a project card"}</h3>
          </div>
          <form onSubmit={handleProjectSubmit} className="project-form">
            <label>
              Project title
              <input
                value={projectForm.title}
                onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Modern React Dashboard"
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Write what this project solves..."
                required
              />
            </label>
            <label>
              Live website link
              <input
                value={projectForm.liveLink}
                onChange={(event) => setProjectForm((current) => ({ ...current, liveLink: event.target.value }))}
                placeholder="https://your-live-site.com"
              />
            </label>
            <label>
              GitHub link
              <input
                value={projectForm.githubLink}
                onChange={(event) => setProjectForm((current) => ({ ...current, githubLink: event.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </label>
            <label>
              Thumbnail image
              <input
                value={projectForm.thumbnail}
                onChange={(event) => setProjectForm((current) => ({ ...current, thumbnail: event.target.value }))}
                placeholder="Paste image URL"
              />
            </label>
            <label>
              Technology tags
              <input
                value={projectForm.tags}
                onChange={(event) => setProjectForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="React, Tailwind, UI/UX"
              />
            </label>
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
          </form>
        </div>

        <div className="filter-row gsap-reveal" aria-label="Project filters">
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
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <motion.article className="project-card gsap-reveal" key={project.id} whileHover={{ y: -16, rotateX: 5, rotateY: -5 }}>
              <div className="project-spotlight" />
              <div className="project-thumb">
                {project.thumbnail ? (
                  // Dynamic visitor-supplied thumbnails cannot use a static image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.thumbnail} alt={`${project.title} preview`} />
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
                <a href={project.liveLink || "#projects"} target="_blank" rel="noreferrer">
                  <FiExternalLink />
                  Live Demo
                </a>
                <a href={project.githubLink || "#projects"} target="_blank" rel="noreferrer">
                  <FaGithub />
                  GitHub
                </a>
              </div>
              <div className="project-admin-actions">
                <button type="button" onClick={() => editProject(project)} aria-label={`Edit ${project.title}`}>
                  <FiEdit3 />
                </button>
                <button type="button" onClick={() => removeProject(project.id)} aria-label={`Remove ${project.title}`}>
                  <FiTrash2 />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="content-section github-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">GitHub Activity</p>
          <h2>Learning in public, building with momentum.</h2>
          <p>Contribution-style activity, repository highlights, animated counters, and technology growth indicators.</p>
        </div>
        <div className="github-panel gsap-reveal">
          <div className="stats-grid">
            {githubStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <Counter value={stat.value} suffix={stat.suffix} />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="contribution-graph" aria-label="Stylized GitHub contribution graph">
            {Array.from({ length: 112 }, (_, index) => (
              <span key={index} data-level={(index * 7 + index / 3) % 5 > 3 ? 4 : Math.floor((index * 5) % 4)} />
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
        </div>
      </section>

      <section className="content-section case-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Case Studies</p>
          <h2>Challenges, design process, and measurable UI improvement.</h2>
          <p>Expandable cards showing how Shoaib thinks about clarity, performance, and user experience.</p>
        </div>
        <div className="case-grid">
          {caseStudies.map((study) => {
            const isOpen = expandedCase === study.title;
            return (
              <motion.article className="case-card gsap-reveal" key={study.title} layout>
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
            );
          })}
        </div>
      </section>

      <section className="content-section testimonial-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Testimonials</p>
          <h2>Animated feedback carousel.</h2>
          <p>Glass cards, profile-style avatars, smooth slide transitions, and 3D hover depth.</p>
        </div>
        <div className="testimonial-shell gsap-reveal">
          <AnimatePresence mode="wait">
            <motion.article
              className="testimonial-card"
              key={testimonials[testimonialIndex].name}
              initial={{ opacity: 0, x: 60, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -60, rotateY: 8 }}
              transition={{ duration: 0.45 }}
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
        </div>
      </section>

      <section id="contact" className="content-section contact-section">
        <div className="section-heading gsap-reveal">
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s build something modern.</h2>
          <p>Send a project inquiry, open WhatsApp directly, or use the contact details below.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-panel gsap-reveal">
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
            <MagneticLink href={contact.whatsapp} target="_blank" rel="noreferrer" variant="whatsapp" onClick={playTone}>
              <FaWhatsapp />
              WhatsApp Direct Message
            </MagneticLink>
            <div className="map-panel" aria-label="Animated location map">
              <span className="map-pin delhi">Delhi</span>
              <span className="map-pin home">Jharkhand</span>
              <i />
            </div>
          </div>
          <form className="contact-form gsap-reveal" onSubmit={handleContactSubmit}>
            <label>
              Name
              <input name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Project Type
              <select name="projectType" defaultValue="React Website">
                <option>React Website</option>
                <option>Landing Page</option>
                <option>Admin Dashboard UI</option>
                <option>UI/UX Design</option>
                <option>Responsive Website</option>
              </select>
            </label>
            <label>
              Budget
              <select name="budget" defaultValue="₹5,000 - ₹15,000">
                <option>₹5,000 - ₹15,000</option>
                <option>₹15,000 - ₹35,000</option>
                <option>₹35,000+</option>
                <option>Monthly collaboration</option>
              </select>
            </label>
            <label className="full-field">
              Message
              <textarea name="message" placeholder="Tell me about your project..." required />
            </label>
            <button type="submit" disabled={contactStatus === "loading"}>
              <FiSend />
              {contactStatus === "loading" ? "Sending..." : "Send Inquiry"}
            </button>
            <AnimatePresence>
              {contactStatus === "success" ? (
                <motion.p className="form-status success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Message ready. EmailJS is connected when your public keys are added.
                </motion.p>
              ) : null}
              {contactStatus === "error" ? (
                <motion.p className="form-status error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  EmailJS could not send right now. Please use WhatsApp or email directly.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </form>
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
            <a key={label} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
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

function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x74f7ff,
        metalness: 0.28,
        roughness: 0.22,
        transmission: 0.28,
        thickness: 1.4,
        clearcoat: 0.8,
        emissive: 0x2d44ff,
        emissiveIntensity: 0.16,
      }),
    );
    scene.add(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.018, 18, 160),
      new THREE.MeshBasicMaterial({ color: 0x9b5cff, transparent: true, opacity: 0.75 }),
    );
    ring.rotation.x = Math.PI / 2.6;
    scene.add(ring);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 240;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xb3f8ff, size: 0.028, transparent: true, opacity: 0.82 }),
    );
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0x9fcfff, 1.2));
    const point = new THREE.PointLight(0xffffff, 24, 12);
    point.position.set(2, 3, 5);
    scene.add(point);

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointer);

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const animate = () => {
      if (!shouldReduceMotion) {
        core.rotation.x += 0.004;
        core.rotation.y += 0.006;
        ring.rotation.z += 0.003;
        particles.rotation.y += 0.0008;
        camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
        camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", resize);
      particleGeometry.dispose();
      core.geometry.dispose();
      ring.geometry.dispose();
      (core.material as THREE.Material).dispose();
      (ring.material as THREE.Material).dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [shouldReduceMotion]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

function TypingLine() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const currentPhrase = typingPhrases[phraseIndex];
    const delay = isDeleting ? 35 : 72;
    const timer = window.setTimeout(() => {
      if (!isDeleting && visibleText === currentPhrase) {
        window.setTimeout(() => setIsDeleting(true), 850);
        return;
      }
      if (isDeleting && visibleText === "") {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % typingPhrases.length);
        return;
      }
      setVisibleText((current) =>
        isDeleting ? current.slice(0, -1) : currentPhrase.slice(0, current.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, phraseIndex, shouldReduceMotion, visibleText]);

  const displayText = shouldReduceMotion ? typingPhrases[0] : visibleText;

  return (
    <p className="typing-line">
      Crafting <span>{displayText}</span>
      <i />
    </p>
  );
}

function MagneticLink({
  children,
  variant,
  className = "",
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant: "primary" | "secondary" | "whatsapp" }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: (event.clientX - rect.left - rect.width / 2) * 0.18,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18,
    });
  };

  return (
    <motion.a
      {...props}
      className={`magnetic-button ${variant} ${className}`}
      animate={position}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      onClick={onClick}
    >
      {children}
    </motion.a>
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
          const progress = Math.min((timestamp - start) / 1100, 1);
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
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
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
                <motion.p
                  key={message.id}
                  className={message.from}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.text}
                </motion.p>
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

function CustomCursor() {
  const [position, setPosition] = useState({ x: -40, y: -40 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return <motion.div className="custom-cursor" animate={position} transition={{ type: "spring", stiffness: 550, damping: 38 }} />;
}

function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => {
        const style = {
          "--i": index,
          "--x": `${(index * 37) % 100}%`,
          "--y": `${(index * 53) % 100}%`,
        } as CSSProperties;

        return <span key={index} style={style} />;
      })}
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
