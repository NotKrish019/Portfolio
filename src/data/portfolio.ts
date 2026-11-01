/**
 * Single source of truth for all portfolio content.
 * Everything shown on the site (3D shell + inner OS) is read from here.
 * Leave a URL as an empty string to hide that link.
 */

export const profile = {
  name: 'Krish',
  shortTitle: 'AI/ML & Full-Stack Developer',
  headline: 'AI/ML & Full-Stack Developer',
  location: 'Sonipat, India',
  email: 'notkrish19@gmail.com',
  phone: '+91 93066 45807',
  phoneHref: 'tel:+919306645807',
  /** Served from public/resume/ (copied from KrishNew.pdf). */
  resume: '/resume/Krish_Resume.pdf',
  resumeDownloadName: 'Krish_Resume.pdf',
  osName: 'KRISH OS',
  monogram: 'KR',
  year: 2026,
  /** Phrases typed after the C:\KRISH> prompt on the home screen. */
  terminalPhrases: [
    'building practical AI systems',
    'segmenting heritage sites with YOLOv8',
    'hunting threats across 8.85M network flows',
    'matching lost items with DINOv2 + FAISS',
    'turning data into decisions',
  ],
  summary:
    "I'm a B.Tech Computer Science and Engineering student specializing in Data Science and Artificial Intelligence at SRM University, Delhi NCR. I enjoy working across AI/ML and full-stack development, building intelligent applications that combine machine learning, data-driven problem-solving, and end-to-end web development.",
  about: [
    'I love building practical intelligent systems: taking a real problem, collecting the data, experimenting with models, and shipping something people can actually use. Most of my work lives in Python, where I move between classical machine learning ensembles and modern deep-learning models for vision and retrieval.',
    "My projects so far span three very different worlds. Jaldrishti uses Computer Vision and Indian Knowledge Systems to help conserve India's traditional water heritage. DRISHTI is a machine learning ensemble that detects cyber threats across 8.85 million network flows. BACK2U is a multimodal lost & found platform that re-identifies the same physical item from images and text.",
    "Outside of models, I'm a member of the Developers Team at Appirates (SRM) and I regularly volunteer at technical and career events on campus. I'm currently sharpening my Data Structures & Algorithms and Web Development skills with Apna College.",
  ],
};

/** Social profiles (taken from the links embedded in the resume PDF). */
export const socials = {
  github: 'https://github.com/NotKrish019',
  linkedin: 'https://www.linkedin.com/in/krish-jagya-520b78354/',
};

export type Education = {
  school: string;
  location: string;
  degree: string;
  duration: string;
  score: string;
};

export const education: Education[] = [
  {
    school: 'SRM University, Delhi NCR',
    location: 'Sonepat, India',
    degree: 'B.Tech in Computer Science and Engineering (Data Science and Artificial Intelligence)',
    duration: '2024 - 2028',
    score: 'CGPA: 9.09/10',
  },
  {
    school: 'Little Angel Sr. Sec. School',
    location: 'Sonepat, India',
    degree: 'Class XII (CBSE)',
    duration: '2023 - 2024',
    score: 'Percentage: 90.6%',
  },
  {
    school: 'SpringBird Sr. Sec. School',
    location: 'Sonepat, India',
    degree: 'Class X (CBSE)',
    duration: '2021 - 2022',
    score: 'Percentage: 89.8%',
  },
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  tags: string[];
  bullets: string[];
  tech: string[];
  /** Add real URLs here; empty strings are hidden. */
  links: { github: string; live: string };
  /** Accent colour used for the project's illustration. */
  accent: string;
  award?: string;
};

export const projects: Project[] = [
  {
    id: 'jaldrishti',
    title: 'Jaldrishti',
    subtitle: "AI-Powered Digital Intelligence for India's Traditional Water Heritage",
    duration: '2026 - Present',
    tags: ['Computer Vision', 'Heritage Tech', 'IKS'],
    bullets: [
      'Built an AI-assisted heritage conservation platform using Computer Vision and Indian Knowledge Systems (IKS).',
      'Enabled damage assessment and restoration planning through image analysis and 3D modelling.',
    ],
    tech: ['Python', 'OpenCV', 'YOLOv8-Seg'],
    links: {
      github: 'https://github.com/NotKrish019/JalDrishti',
      live: 'https://jaldrishti-sigma.vercel.app/',
    },
    accent: '#1f6f8b',
    award: 'Winner, Viksit Bharat Conclave 2026',
  },
  {
    id: 'drishti',
    title: 'DRISHTI',
    subtitle: 'AI-Powered Real-Time Network Threat Intelligence Platform',
    duration: '2026 - Present',
    tags: ['Cybersecurity', 'ML Ensemble', 'Explainable AI'],
    bullets: [
      'Built a machine learning ensemble to detect cyber threats across 8.85 million network flows.',
      'Implemented dynamic feature extraction, risk scoring, explainable evidence graphs, and real-time human-in-the-loop alerts.',
    ],
    tech: ['Python', 'scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'Pandas', 'NumPy'],
    links: {
      github: 'https://github.com/NotKrish019/DRISHTI',
      live: '',
    },
    accent: '#a33a2c',
    award: 'National-Level Finalist, IBM National Hackathon 2026',
  },
  {
    id: 'back2u',
    title: 'BACK2U',
    subtitle: 'AI-Powered Multimodal Lost & Found Platform',
    duration: '2026 - Present',
    tags: ['Multimodal Retrieval', 'Re-Identification', 'Full-Stack'],
    bullets: [
      'Built image-text retrieval to identify the same physical lost item using instance-level re-identification.',
      'Developed multimodal reranking and uncertainty calibration.',
      'Contributed to the user interface, APIs, and database architecture.',
    ],
    tech: ['PyTorch', 'DINOv2', 'Grounding DINO', 'SigLIP2', 'FAISS', 'FastAPI'],
    links: {
      // The resume's BACK2U GitHub label points at the Jaldrishti repo, so it is left empty here.
      github: '',
      live: '',
    },
    accent: '#2f7d4f',
  },
];

export const skills: { category: string; items: string[] }[] = [
  { category: 'Programming Languages', items: ['C', 'C++', 'Python', 'JavaScript', 'SQL'] },
  {
    category: 'AI/ML & Data Science',
    items: ['Artificial Intelligence', 'Machine Learning', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
  },
  { category: 'Full-Stack Development', items: ['MERN Stack', 'MongoDB', 'Express.js', 'React.js', 'Node.js'] },
  { category: 'Databases', items: ['SQL', 'MySQL', 'MongoDB', 'IBM Cloudant', 'PostgreSQL'] },
  {
    category: 'Core Computer Science',
    items: ['Data Structures & Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Theory of Computation'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'VS Code', 'Antigravity', 'Postman', 'Docker', 'Vercel', 'Firebase', 'Google Cloud Platform', 'Tableau', 'Power BI', 'IBM Watson AI Services', 'CI/CD'],
  },
];

export type Award = {
  title: string;
  org: string;
  detail: string[];
  date: string;
  project: string;
  certificate: string;
};

export const awards: Award[] = [
  {
    title: 'Winner: Viksit Bharat Conclave 2026',
    org: 'SRM University Delhi-NCR',
    detail: ['1st Position in Parampara to Prototype – Design Hackathon', 'Team of 4'],
    date: '8 October 2026',
    project: 'Jaldrishti',
    certificate: 'https://drive.google.com/file/d/1hkCGxylhQX88lYLXDvEeSD0bqXUzqrpQ/view?usp=sharing',
  },
  {
    title: 'National-Level Finalist: IBM National Hackathon 2026',
    org: 'IBM Expert Labs · Coimbatore',
    detail: ['Qualified as one of 8 campus finalists', 'Team of 4'],
    date: '12–13 September 2026',
    project: 'DRISHTI',
    certificate: 'https://drive.google.com/file/d/1C3zKV5yvvCP3IA5qRjfUaBYCUzXb-z80/view?usp=sharing',
  },
];

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  kind: 'program' | 'workshop' | 'competition';
  note?: string;
  /** Link to a genuine certificate file, if one exists. Empty = none available. */
  file?: string;
};

export const certifications: Certification[] = [
  { title: 'SRM Builds 6.0', issuer: 'Verge 2025', date: '2025', kind: 'competition', note: 'Beginners Top 3 Team' },
  { title: 'GenAI & Prompt Engineering Workshop', issuer: 'AILytics × HackWithIndia', date: 'Oct 2025', kind: 'workshop', note: '3rd Rank' },
  { title: 'Tata GenAI Data Analytics Simulation', issuer: 'Forage', date: 'Oct 2026', kind: 'program' },
  { title: 'BCG X Data for Decision Makers Simulation', issuer: 'Forage', date: 'Jan 2026', kind: 'program' },
  { title: 'ServiceNow AI Foundation', issuer: 'FutureSkills Prime', date: 'Oct 2026', kind: 'program' },
  { title: 'AI Tools and ChatGPT Workshop', issuer: 'be10x', date: 'Oct 2026', kind: 'workshop' },
  { title: 'Full-Stack Web Development', issuer: '1-week workshop', date: 'Feb 2026', kind: 'workshop' },
  { title: 'SRM Builds 7.0', issuer: 'Verge 2026', date: '2026', kind: 'competition' },
];

/**
 * Research interests & explorations. There are no formal publications yet;
 * each area is grounded in a real project or skill from the resume.
 */
export const research: { area: string; exploredIn: string; summary: string; points: string[]; methods: string[] }[] = [
  {
    area: 'Applied AI for Heritage Conservation',
    exploredIn: 'Jaldrishti',
    summary: "Using Computer Vision alongside Indian Knowledge Systems (IKS) to support the conservation of India's traditional water heritage.",
    points: ['Damage assessment through image analysis and segmentation.', 'Restoration planning supported by 3D modelling.'],
    methods: ['Python', 'OpenCV', 'YOLOv8-Seg'],
  },
  {
    area: 'Explainable Machine Learning for Security',
    exploredIn: 'DRISHTI',
    summary: 'Detecting cyber threats in network traffic with machine learning, while keeping every decision explainable to a human analyst.',
    points: [
      'A gradient-boosting ensemble evaluated across 8.85 million network flows.',
      'Dynamic feature extraction and risk scoring.',
      'Explainable evidence graphs and real-time human-in-the-loop alerts.',
    ],
    methods: ['scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'Pandas', 'NumPy'],
  },
  {
    area: 'Multimodal AI & Retrieval',
    exploredIn: 'BACK2U',
    summary: 'Matching images and text descriptions to the same physical object, a fine-grained retrieval problem.',
    points: [
      'Image-text retrieval with instance-level re-identification.',
      'Multimodal reranking and uncertainty calibration.',
    ],
    methods: ['PyTorch', 'DINOv2', 'Grounding DINO', 'SigLIP2', 'FAISS'],
  },
  {
    area: 'Intelligent Full-Stack Systems',
    exploredIn: 'BACK2U · Full-Stack Web Development workshop',
    summary: 'Taking models out of notebooks and into complete applications with real interfaces, APIs, and databases.',
    points: ['Contributed to the UI, APIs, and database architecture of BACK2U.', 'Serving models behind FastAPI; building with the MERN stack.'],
    methods: ['FastAPI', 'MongoDB', 'Express.js', 'React.js', 'Node.js', 'PostgreSQL'],
  },
  {
    area: 'Data-Driven Problem Solving',
    exploredIn: 'Tata GenAI Data Analytics & BCG X Data for Decision Makers simulations',
    summary: 'Turning raw data into analysis, visualisation, and decisions.',
    points: ['Exploratory analysis and visualisation of real-world datasets.', 'Communicating insights for decision makers.'],
    methods: ['Pandas', 'NumPy', 'Matplotlib', 'Tableau', 'Power BI'],
  },
];

export const extracurricular: { role: string; org: string; date?: string; description: string }[] = [
  { role: 'Developers Team Member', org: 'Appirates (SRM)', description: 'Contributing to student-led product development.' },
  { role: 'Volunteer', org: 'Agentic AI/GenAI Bootcamp (SRM)', description: 'Supported a one-day technical event.' },
  { role: 'Volunteer', org: 'Walk In with Zero Experience (SRM)', date: 'Oct 2026', description: 'Supported hackathon preparation activities.' },
  { role: 'Volunteer', org: 'From Campus to Global Careers (SRM)', description: 'Assisted with career-event coordination.' },
];

export const learning: { title: string; provider: string; status: string }[] = [
  { title: 'Data Structures & Algorithms', provider: 'Apna College', status: 'In Progress' },
  { title: 'Web Development', provider: 'Apna College', status: 'In Progress' },
];
