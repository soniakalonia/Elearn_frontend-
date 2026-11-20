export type Level = "Beginner" | "Intermediate" | "Advanced" | "All levels";

export type Lesson = { title: string; duration: string; preview?: boolean };
export type Module = { title: string; duration: string; lessons: Lesson[] };

export type Instructor = {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  rating?: number;
  students?: number;
  courses?: number;
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: Level;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  learners: number;
  hours: number;
  lessons: number;
  updated: string;
  language: string;
  image: string;
  tag?: "Bestseller" | "New" | "Trending" | "Editor's pick";
  instructor: Instructor;
  tools: string[];
  outcomes: string[];
  description: string[];
  requirements: string[];
  curriculum: Module[];
  audience: string[];
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  count: number;
  blurb: string;
  color: string;
  soft: string;
};

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  billing?: "monthly" | "annual";
  popular?: boolean;
  features: string[];
  cta: string;
};

export type Review = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  course: string;
  courseSlug: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  helpful: number;
};

export const INSTRUCTORS = {
  meg: {
    name: "Meghna Rao",
    role: "Principal DevOps Engineer, ex-AWS",
    avatar: "https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Meghna has shipped infrastructure for fintech platforms handling 40M+ requests a day. She teaches cloud the way it is actually practised — small steps, real pipelines, production-grade habits.",
    rating: 4.9,
    students: 38400,
    courses: 6,
  },
  arjun: {
    name: "Arjun Nair",
    role: "CAD Lead & BIM Architect",
    avatar: "https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Arjun has led drafting and BIM delivery for 60+ built projects. He turns dense CAD fundamentals into a design workflow you can bill clients for.",
    rating: 4.8,
    students: 24100,
    courses: 4,
  },
  ishita: {
    name: "Ishita Sharma",
    role: "Data Scientist & AI Educator",
    avatar: "https://images.pexels.com/photos/4126749/pexels-photo-4126749.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Ishita builds recommendation systems for consumer products and has mentored 1,000+ career switchers into data roles. Expect notebooks, not just slides.",
    rating: 4.9,
    students: 31200,
    courses: 5,
  },
  dev: {
    name: "Dev Malhotra",
    role: "Security Architect & SOC Lead",
    avatar: "https://images.pexels.com/photos/35681211/pexels-photo-35681211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Dev has defended cloud estates across BFSI and SaaS. His labs replicate the alerts and escalation decisions you will face on shift.",
    rating: 4.8,
    students: 17600,
    courses: 3,
  },
  tara: {
    name: "Tara Iyer",
    role: "Design Director, ex-Atlassian",
    avatar: "https://images.pexels.com/photos/34930167/pexels-photo-34930167.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Tara has designed products used by millions and hired designers at three unicorns. Her feedback framework is the secret sauce of this course.",
    rating: 4.9,
    students: 21900,
    courses: 4,
  },
  kabir: {
    name: "Kabir Sheikh",
    role: "Staff Full-stack Engineer",
    avatar: "https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Kabir writes production React and Node daily. He believes you learn architecture by breaking it, then rebuilding it more simply.",
    rating: 4.7,
    students: 28400,
    courses: 5,
  },
  naina: {
    name: "Naina Kapoor",
    role: "Product Lead, Analytics",
    avatar: "https://images.pexels.com/photos/4126756/pexels-photo-4126756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Naina turns messy business questions into dashboards teams actually use. Previously led analytics at two Series C startups.",
    rating: 4.8,
    students: 14800,
    courses: 3,
  },
  vikram: {
    name: "Vikram Bose",
    role: "AI Product Strategist",
    avatar: "https://images.pexels.com/photos/35490803/pexels-photo-35490803.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    bio: "Vikram has launched AI features for 20M+ users. He focuses on the unglamorous part: evaluation, guardrails and customer trust.",
    rating: 4.9,
    students: 12400,
    courses: 2,
  },
};

const commonRequirements = [
  "A laptop with at least 8GB RAM and a stable internet connection",
  "No prior experience required for beginner-friendly modules",
  "Curiosity and around 6 focused hours each week",
];

export const categories: Category[] = [
  {
    slug: "devops-cloud",
    name: "DevOps & Cloud",
    icon: "cloud",
    count: 34,
    blurb: "Ship faster, break less.",
    color: "#1A1225",
    soft: "#CDF56A",
  },
  {
    slug: "cad-design",
    name: "CAD & Design",
    icon: "compass",
    count: 28,
    blurb: "Draft, model, build.",
    color: "#241533",
    soft: "#D9C8FF",
  },
  {
    slug: "data-ai",
    name: "Data & AI",
    icon: "sparkle",
    count: 41,
    blurb: "Turn data into decisions.",
    color: "#1A1225",
    soft: "#A9DDF5",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    icon: "shield",
    count: 19,
    blurb: "Defend what matters.",
    color: "#1A1225",
    soft: "#FFD3C7",
  },
  {
    slug: "web-development",
    name: "Web Development",
    icon: "code",
    count: 37,
    blurb: "Build for the browser.",
    color: "#1A1225",
    soft: "#B9ECD4",
  },
  {
    slug: "ux-ui",
    name: "Product & UX",
    icon: "pen",
    count: 22,
    blurb: "Design products people love.",
    color: "#241533",
    soft: "#FFE3A8",
  },
  {
    slug: "business-analytics",
    name: "Business & Analytics",
    icon: "chart",
    count: 26,
    blurb: "Make numbers make sense.",
    color: "#1A1225",
    soft: "#F2D6FF",
  },
  {
    slug: "ai-fluency",
    name: "AI Fluency",
    icon: "bot",
    count: 16,
    blurb: "Work smarter with AI.",
    color: "#1A1225",
    soft: "#CDF56A",
  },
];

export const courses: Course[] = [
  {
    slug: "complete-devops-engineer-bootcamp",
    title: "The Complete DevOps Engineer Bootcamp",
    tagline: "Linux to Kubernetes, CI/CD and cloud — one practical path.",
    category: "devops-cloud",
    level: "Beginner",
    price: 3499,
    mrp: 8999,
    rating: 4.9,
    reviews: 2840,
    learners: 18450,
    hours: 42,
    lessons: 186,
    updated: "Feb 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Bestseller",
    instructor: INSTRUCTORS.meg,
    tools: ["Linux", "Docker", "Kubernetes", "AWS", "GitHub Actions", "Terraform"],
    outcomes: [
      "Build and harden Linux environments from first principles",
      "Containerise real apps with Docker and ship multi-service Compose stacks",
      "Deploy, scale and debug workloads on Kubernetes",
      "Build production CI/CD pipelines with GitHub Actions and Argo CD",
      "Provision AWS infrastructure with Terraform modules",
      "Monitor services with Prometheus, Grafana and actionable alerts",
      "Prepare for the AWS Solutions Architect Associate exam",
      "Walk into interviews with three portfolio-grade projects",
    ],
    description: [
      "DevOps is not a tool list — it is a way of shipping. This bootcamp follows the lifecycle of a real product: from a bare Linux server to an automated pipeline that deploys to Kubernetes on every merge.",
      "You will work in the same repos, terminals and cloud consoles professionals use. Every module ends with a hands-on lab and a short checkpoint, and your capstone is a fully observable three-tier application deployed through CI/CD.",
      "If you are moving from support, QA or a junior developer role, the career track inside will also help you translate these projects into interview stories recruiters understand.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Foundations of Linux & networking",
        duration: "5h 20m",
        lessons: [
          { title: "How this bootcamp works", duration: "06:12", preview: true },
          { title: "Linux filesystem, users and permissions", duration: "18:40" },
          { title: "Processes, services and systemd", duration: "21:05" },
          { title: "Networking for engineers: DNS, TCP, TLS", duration: "24:30" },
          { title: "Lab: provision and harden an Ubuntu server", duration: "32:10" },
        ],
      },
      {
        title: "Git, Docker & the build pipeline",
        duration: "7h 45m",
        lessons: [
          { title: "Git branching that scales with a team", duration: "17:20", preview: true },
          { title: "Your first production-ready Dockerfile", duration: "22:12" },
          { title: "Multi-stage builds and image hygiene", duration: "19:44" },
          { title: "Docker Compose for local environments", duration: "26:10" },
          { title: "Lab: containerise a Node + Postgres app", duration: "31:25" },
        ],
      },
      {
        title: "Kubernetes in the real world",
        duration: "9h 10m",
        lessons: [
          { title: "Pods, deployments and services", duration: "24:00" },
          { title: "ConfigMaps, secrets and health probes", duration: "21:15" },
          { title: "Ingress, autoscaling and resource limits", duration: "27:40" },
          { title: "Helm, namespaces and progressive rollout", duration: "30:08" },
          { title: "Lab: deploy a resilient three-tier app", duration: "38:30" },
        ],
      },
      {
        title: "CI/CD with GitHub Actions & Argo CD",
        duration: "8h 05m",
        lessons: [
          { title: "Pipeline anatomy and quality gates", duration: "15:50" },
          { title: "Build, test and publish on every merge", duration: "26:20" },
          { title: "GitOps with Argo CD", duration: "29:12" },
          { title: "Rollbacks, canaries and feature flags", duration: "23:05" },
        ],
      },
      {
        title: "AWS infrastructure with Terraform",
        duration: "8h 30m",
        lessons: [
          { title: "Cloud accounts, IAM and budgets", duration: "20:15" },
          { title: "VPC, subnets and security groups", duration: "27:45" },
          { title: "Terraform modules and state management", duration: "28:00" },
          { title: "Capstone: infra + pipeline, end to end", duration: "41:10" },
        ],
      },
    ],
    audience: [
      "Early-career engineers aiming for a DevOps or SRE role",
      "Developers who want to own deployment and reliability",
      "QA and support professionals moving into cloud operations",
    ],
  },
  {
    slug: "autocad-2026-drafting-to-3d",
    title: "AutoCAD 2026: From Drafting to 3D Design",
    tagline: "Draw like a professional and build a portfolio that stands out.",
    category: "cad-design",
    level: "All levels",
    price: 2499,
    mrp: 6499,
    rating: 4.8,
    reviews: 1920,
    learners: 14320,
    hours: 28,
    lessons: 124,
    updated: "Jan 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/3862379/pexels-photo-3862379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Bestseller",
    instructor: INSTRUCTORS.arjun,
    tools: ["AutoCAD", "AutoCAD LT", "Sheet sets", "3D modelling", "Layout & plot"],
    outcomes: [
      "Set up drawings with the right units, layers and standards",
      "Draft floor plans, elevations and sections with precision",
      "Use blocks, dynamic blocks and xrefs like a studio professional",
      "Master annotative dimensions, text and sheet sets",
      "Model your first 3D object and render a clean presentation view",
      "Produce a client-ready drawing package and portfolio sheet",
    ],
    description: [
      "Most AutoCAD courses are a tour of the toolbar. This one is a project: a two-bedroom apartment drawn, dimensioned and plotted to studio standards, then extended into a simple 3D model.",
      "You will build the habits that separate a drafter from a designer — layer logic, drawing templates, revision control and clean presentation. Every section includes a downloadable exercise file and a short critique from Arjun.",
      "The final module turns your drawings into portfolio-ready sheets that you can show in an internship or freelance conversation.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Drawing setup & precision",
        duration: "4h 30m",
        lessons: [
          { title: "Interface and the 10 commands you need", duration: "14:20", preview: true },
          { title: "Units, limits and drawing templates", duration: "18:10" },
          { title: "Object snaps and precision drafting", duration: "20:45" },
        ],
      },
      {
        title: "Plans, elevations & sections",
        duration: "6h 15m",
        lessons: [
          { title: "Walls, openings and columns", duration: "22:30" },
          { title: "Stairs and railings", duration: "19:20" },
          { title: "Elevations from a floor plan", duration: "26:00" },
        ],
      },
      {
        title: "Blocks, xrefs & productivity",
        duration: "4h 50m",
        lessons: [
          { title: "Blocks and attributes", duration: "21:15" },
          { title: "Dynamic blocks for doors and windows", duration: "18:40" },
          { title: "Xrefs and team workflows", duration: "16:30" },
        ],
      },
      {
        title: "Annotations, sheets & plotting",
        duration: "5h 40m",
        lessons: [
          { title: "Annotative dimensions", duration: "23:10" },
          { title: "Layouts, viewports and title blocks", duration: "25:20" },
          { title: "Publishing a full sheet set", duration: "14:50" },
        ],
      },
      {
        title: "Introduction to 3D & folio",
        duration: "6h 45m",
        lessons: [
          { title: "Extruding and modifying 3D solids", duration: "24:00" },
          { title: "Rendering a presentation view", duration: "19:10" },
          { title: "Portfolio sheet assembly", duration: "22:35" },
        ],
      },
    ],
    audience: [
      "Civil, mechanical and architecture students",
      "Drafters returning to AutoCAD after a break",
      "Designers who need production-grade drawing skills",
    ],
  },
  {
    slug: "aws-solutions-architect-path",
    title: "AWS Cloud Practitioner to Solutions Architect",
    tagline: "A clear, exam-ready path through the AWS landscape.",
    category: "devops-cloud",
    level: "Intermediate",
    price: 3999,
    mrp: 9999,
    rating: 4.8,
    reviews: 1640,
    learners: 11240,
    hours: 36,
    lessons: 152,
    updated: "Feb 2026",
    language: "English",
    image:
      "https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Trending",
    instructor: INSTRUCTORS.meg,
    tools: ["AWS", "IAM", "VPC", "S3", "Lambda", "CloudFormation"],
    outcomes: [
      "Design resilient, cost-aware architectures on AWS",
      "Secure accounts with IAM, roles and guardrails",
      "Choose the right storage, compute and messaging services",
      "Automate infrastructure with CloudFormation",
      "Prepare confidently for SAA-C03",
      "Practise with two full-length mock exams",
    ],
    description: [
      "AWS is a large surface area. You do not need all of it — you need the 20% that appears in architecture decisions and exams, taught with boring clarity.",
      "Each week you complete a guided build in a sandbox account and a scenario quiz built on the official exam guide. The mock exams include detailed explanations, not just answer keys.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Cloud foundations & cost",
        duration: "5h 10m",
        lessons: [
          { title: "Regions, AZs and the shared responsibility model", duration: "16:20", preview: true },
          { title: "IAM users, roles and policy evaluation", duration: "24:00" },
          { title: "Budgets, cost explorer and right-sizing", duration: "18:15" },
        ],
      },
      {
        title: "Core services in depth",
        duration: "10h 25m",
        lessons: [
          { title: "EC2, load balancers and auto scaling", duration: "29:30" },
          { title: "S3 storage classes and lifecycle", duration: "22:10" },
          { title: "RDS, DynamoDB and caching", duration: "27:40" },
          { title: "SQS, SNS and EventBridge patterns", duration: "24:50" },
        ],
      },
      {
        title: "Architecture patterns",
        duration: "8h 30m",
        lessons: [
          { title: "Multi-tier and serverless designs", duration: "26:00" },
          { title: "Reliability and disaster recovery", duration: "23:30" },
          { title: "Migration strategies", duration: "19:45" },
        ],
      },
      {
        title: "Exam preparation",
        duration: "7h 40m",
        lessons: [
          { title: "SAA-C03 blueprint walkthrough", duration: "18:00" },
          { title: "Mock exam one: timed", duration: "1:50:00" },
          { title: "Mock exam two & review", duration: "1:45:00" },
        ],
      },
    ],
    audience: [
      "Cloud engineers preparing for the Solutions Architect Associate",
      "Backend developers owning AWS deployments",
      "IT professionals moving into cloud roles",
    ],
  },
  {
    slug: "data-science-machine-learning-python",
    title: "Data Science & Machine Learning with Python",
    tagline: "From your first notebook to a deployed ML project.",
    category: "data-ai",
    level: "Beginner",
    price: 3799,
    mrp: 9499,
    rating: 4.9,
    reviews: 3260,
    learners: 21890,
    hours: 46,
    lessons: 204,
    updated: "Feb 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/4816921/pexels-photo-4816921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Bestseller",
    instructor: INSTRUCTORS.ishita,
    tools: ["Python", "pandas", "scikit-learn", "XGBoost", "Streamlit", "SQL"],
    outcomes: [
      "Clean and explore real datasets with pandas",
      "Choose the right model for a business question",
      "Evaluate models without fooling yourself",
      "Build a feature pipeline you can defend in interviews",
      "Deploy an interactive model with Streamlit",
      "Complete a portfolio capstone with a written case study",
    ],
    description: [
      "This is a hands-on path for career switchers. You will learn just enough maths to reason about models, and a lot of Python by doing the analysis, not by watching someone else do it.",
      "There are no toy datasets after module two. You will work with messy retail, churn and operations data, make trade-offs, and defend them in a weekly written note.",
      "The capstone ends as a deployed app plus a short case study — the two artefacts hiring managers actually open.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Python & analysis foundations",
        duration: "8h 15m",
        lessons: [
          { title: "Python for data in one sitting", duration: "24:10", preview: true },
          { title: "pandas: loading, joining, grouping", duration: "31:00" },
          { title: "Exploratory analysis with intent", duration: "27:20" },
        ],
      },
      {
        title: "Statistics that matter",
        duration: "6h 40m",
        lessons: [
          { title: "Distributions and sampling", duration: "22:30" },
          { title: "Experiments and significance", duration: "25:15" },
          { title: "Correlation, causation and confounders", duration: "18:40" },
        ],
      },
      {
        title: "Machine learning foundations",
        duration: "12h 05m",
        lessons: [
          { title: "Regression and regularisation", duration: "28:45" },
          { title: "Classification and metrics", duration: "30:20" },
          { title: "Trees, forests and gradient boosting", duration: "32:15" },
          { title: "Cross-validation done right", duration: "21:10" },
        ],
      },
      {
        title: "Capstone & deployment",
        duration: "10h 20m",
        lessons: [
          { title: "Framing the case study", duration: "17:00" },
          { title: "Building a model pipeline", duration: "34:30" },
          { title: "Deploying with Streamlit", duration: "26:15" },
          { title: "Interview walkthrough", duration: "19:20" },
        ],
      },
    ],
    audience: [
      "Graduates and career switchers entering data roles",
      "Analysts ready to move from reports to models",
      "Product and ops professionals who want to work with data teams",
    ],
  },
  {
    slug: "cybersecurity-analyst-bootcamp",
    title: "Cybersecurity Analyst Bootcamp: SOC to Cloud",
    tagline: "Investigate alerts, hunt threats and think like a defender.",
    category: "cybersecurity",
    level: "Intermediate",
    price: 3299,
    mrp: 8499,
    rating: 4.8,
    reviews: 1180,
    learners: 8210,
    hours: 34,
    lessons: 148,
    updated: "Jan 2026",
    language: "English",
    image:
      "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Editor's pick",
    instructor: INSTRUCTORS.dev,
    tools: ["Splunk", "Wireshark", "Nmap", "MITRE ATT&CK", "AWS GuardDuty", "Burp Suite"],
    outcomes: [
      "Triage and document alerts in a simulated SOC",
      "Read packet captures and identify malicious traffic",
      "Map incidents to MITRE ATT&CK",
      "Hunt for threats across identity and cloud logs",
      "Write an incident report leadership understands",
      "Prepare for entry-level blue-team interviews",
    ],
    description: [
      "Security is a judgement job. This bootcamp gives you the reps: 30+ alert scenarios, realistic logs, and a decision framework for every escalation.",
      "You will alternate between attacker thinking and defender constraints. The final assessed exercise is a full shift simulation, complete with noisy alerts and a report deadline.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Security foundations",
        duration: "6h 10m",
        lessons: [
          { title: "CIA triad and the modern threat landscape", duration: "19:20", preview: true },
          { title: "Identity, access and least privilege", duration: "22:30" },
          { title: "Cryptography without the maths panic", duration: "25:10" },
        ],
      },
      {
        title: "SOC operations",
        duration: "9h 45m",
        lessons: [
          { title: "Alert triage and severity", duration: "24:00" },
          { title: "SIEM queries that answer questions", duration: "28:30" },
          { title: "Phishing and endpoint cases", duration: "31:15" },
        ],
      },
      {
        title: "Network & cloud defence",
        duration: "10h 20m",
        lessons: [
          { title: "Packets, DNS and command-and-control", duration: "27:40" },
          { title: "Cloud identity attacks and GuardDuty", duration: "29:10" },
          { title: "Threat hunting with ATT&CK", duration: "32:00" },
        ],
      },
      {
        title: "Capstone: live incident",
        duration: "7h 45m",
        lessons: [
          { title: "Shift simulation brief", duration: "10:00" },
          { title: "Investigate the intrusion", duration: "48:00" },
          { title: "Report and debrief", duration: "24:30" },
        ],
      },
    ],
    audience: [
      "IT support professionals moving into security",
      "SOC analysts sharpening cloud detection skills",
      "Developers who want to build securely",
    ],
  },
  {
    slug: "ui-ux-design-portfolio",
    title: "UI/UX Design: From Wireframe to Portfolio",
    tagline: "Design thoughtful products and prove it with three strong case studies.",
    category: "ux-ui",
    level: "Beginner",
    price: 2999,
    mrp: 7499,
    rating: 4.9,
    reviews: 2140,
    learners: 16730,
    hours: 32,
    lessons: 140,
    updated: "Feb 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Trending",
    instructor: INSTRUCTORS.tara,
    tools: ["Figma", "FigJam", "Maze", "Notion", "Design systems"],
    outcomes: [
      "Run lightweight research that informs real decisions",
      "Turn insights into flows, wireframes and testable prototypes",
      "Build a visual system with type, colour and motion",
      "Usability-test without a dedicated lab",
      "Design accessible interfaces by default",
      "Publish three case studies that hold up in interviews",
    ],
    description: [
      "Good design is not decoration. It is a sequence of well-explained decisions. This course makes that sequence visible through three projects: a fintech onboarding flow, a learning app and a marketplace checkout.",
      "You will get structured critique from Tara and a peer cohort at the end of each project. The final module is dedicated to turning your work into a portfolio that reads clearly to a hiring manager.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Research & problem framing",
        duration: "6h 30m",
        lessons: [
          { title: "From brief to a sharp problem statement", duration: "18:40", preview: true },
          { title: "Interviews that surface behaviour", duration: "25:10" },
          { title: "Synthesis and journey maps", duration: "23:00" },
        ],
      },
      {
        title: "Interaction & prototyping",
        duration: "8h 20m",
        lessons: [
          { title: "Information architecture", duration: "21:30" },
          { title: "Wireframing with intent", duration: "24:15" },
          { title: "High-fidelity prototyping in Figma", duration: "35:00" },
        ],
      },
      {
        title: "Visual craft & systems",
        duration: "7h 15m",
        lessons: [
          { title: "Type scales that behave", duration: "22:40" },
          { title: "Colour, contrast and accessibility", duration: "26:20" },
          { title: "Design tokens and components", duration: "28:00" },
        ],
      },
      {
        title: "Test, present, publish",
        duration: "6h 40m",
        lessons: [
          { title: "Running a usability session", duration: "20:30" },
          { title: "Writing the case study narrative", duration: "24:15" },
          { title: "Portfolio review workshop", duration: "31:00" },
        ],
      },
    ],
    audience: [
      "Beginners looking for a first product design role",
      "Graphic designers moving into digital products",
      "Founders and PMs who want to prototype with confidence",
    ],
  },
  {
    slug: "full-stack-react-node",
    title: "Full-Stack Web Development with React & Node",
    tagline: "Build, test and deploy real products end to end.",
    category: "web-development",
    level: "Intermediate",
    price: 3299,
    mrp: 8499,
    rating: 4.7,
    reviews: 2540,
    learners: 19240,
    hours: 48,
    lessons: 218,
    updated: "Feb 2026",
    language: "English",
    image:
      "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Bestseller",
    instructor: INSTRUCTORS.kabir,
    tools: ["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Vite"],
    outcomes: [
      "Build accessible React interfaces with TypeScript",
      "Design REST APIs with validation and error handling",
      "Model relational data with PostgreSQL and Prisma",
      "Implement authentication and role-based access",
      "Write tests that catch regressions",
      "Deploy a full-stack app with CI and monitoring",
    ],
    description: [
      "You will build one product from wireframe to production: a multi-tenant project tracker with authentication, billing-ready plans and a public API.",
      "The course is opinionated about code reading. Every module asks you to review, refactor and test an existing implementation before adding a feature — closer to the job than greenfield tutorials.",
    ],
    requirements: [
      "Basic HTML, CSS and JavaScript familiarity",
      "A laptop with Node 20+ installed",
      "Around 7 hours each week",
    ],
    curriculum: [
      {
        title: "React & TypeScript foundations",
        duration: "10h 15m",
        lessons: [
          { title: "Thinking in components", duration: "22:10", preview: true },
          { title: "TypeScript for product code", duration: "29:40" },
          { title: "Data fetching and state", duration: "31:20" },
        ],
      },
      {
        title: "APIs & data",
        duration: "11h 50m",
        lessons: [
          { title: "Designing a pragmatic REST API", duration: "27:30" },
          { title: "PostgreSQL modelling", duration: "32:10" },
          { title: "Auth, sessions and permissions", duration: "34:00" },
        ],
      },
      {
        title: "Product features",
        duration: "12h 40m",
        lessons: [
          { title: "Search, filters and pagination", duration: "29:15" },
          { title: "File uploads and background jobs", duration: "30:40" },
          { title: "Billing and entitlements", duration: "28:20" },
        ],
      },
      {
        title: "Testing & shipping",
        duration: "13h 15m",
        lessons: [
          { title: "Unit, integration and e2e testing", duration: "35:00" },
          { title: "CI/CD and environments", duration: "26:45" },
          { title: "Observability and launch checklist", duration: "24:00" },
        ],
      },
    ],
    audience: [
      "Frontend developers who want to own the backend",
      "Bootcamp graduates filling in production gaps",
      "Junior engineers preparing for full-stack interviews",
    ],
  },
  {
    slug: "terraform-kubernetes-infrastructure",
    title: "Terraform & Kubernetes: Infrastructure as Code",
    tagline: "Repeatable platforms, sensible defaults and zero snowflakes.",
    category: "devops-cloud",
    level: "Advanced",
    price: 2999,
    mrp: 7499,
    rating: 4.8,
    reviews: 940,
    learners: 6520,
    hours: 24,
    lessons: 98,
    updated: "Jan 2026",
    language: "English",
    image:
      "https://images.pexels.com/photos/10845119/pexels-photo-10845119.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "New",
    instructor: INSTRUCTORS.meg,
    tools: ["Terraform", "Kubernetes", "Helm", "AWS EKS", "Terragrunt"],
    outcomes: [
      "Structure Terraform for teams, not demos",
      "Manage remote state and environment separation safely",
      "Provision and upgrade an EKS cluster",
      "Package services with Helm",
      "Automate cluster add-ons and policy",
      "Design a platform developers actually enjoy using",
    ],
    description: [
      "A focused course for engineers who already know the basics. We cover the decisions that cause 3 a.m. pages: state boundaries, drift, cluster upgrades and ownership.",
      "You will build a small internal platform with reusable modules and a paved road for new services.",
    ],
    requirements: [
      "Comfort with the command line and AWS basics",
      "Some Docker and Kubernetes exposure",
      "An AWS sandbox account (costs are kept low)",
    ],
    curriculum: [
      {
        title: "Terraform at team scale",
        duration: "7h 10m",
        lessons: [
          { title: "Module boundaries and composition", duration: "24:30", preview: true },
          { title: "Remote state, locking and workspaces", duration: "21:40" },
          { title: "Drift, imports and safe refactors", duration: "27:15" },
        ],
      },
      {
        title: "Platform engineering with EKS",
        duration: "8h 30m",
        lessons: [
          { title: "Provisioning a production EKS cluster", duration: "36:00" },
          { title: "Helm charts and release management", duration: "28:20" },
          { title: "Add-ons, autoscaling and policy", duration: "31:10" },
        ],
      },
      {
        title: "Paved road capstone",
        duration: "8h 20m",
        lessons: [
          { title: "Self-service service template", duration: "29:45" },
          { title: "Upgrade runbook", duration: "21:30" },
          { title: "Final review", duration: "18:00" },
        ],
      },
    ],
    audience: [
      "DevOps engineers owning cloud platforms",
      "SREs standardising infrastructure",
      "Senior developers moving toward platform roles",
    ],
  },
  {
    slug: "revit-bim-architecture",
    title: "Revit & BIM for Modern Architecture",
    tagline: "Model coordinated buildings and deliver drawings that build.",
    category: "cad-design",
    level: "Intermediate",
    price: 2799,
    mrp: 6999,
    rating: 4.7,
    reviews: 860,
    learners: 5980,
    hours: 26,
    lessons: 112,
    updated: "Dec 2025",
    language: "English",
    image:
      "https://images.pexels.com/photos/15764116/pexels-photo-15764116.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "New",
    instructor: INSTRUCTORS.arjun,
    tools: ["Revit", "BIM 360", "Navisworks", "Family editor", "Clash detection"],
    outcomes: [
      "Set up a BIM project with shared coordinates",
      "Model walls, floors, roofs and stairs parametrically",
      "Build custom families and schedules",
      "Coordinate architecture with structure and MEP",
      "Run a clash detection review",
      "Issue a complete documentation set",
    ],
    description: [
      "BIM is a coordination practice, not a 3D modelling trick. You will work on a small mixed-use building and deliver the same drawings, schedules and coordination outputs a practice expects.",
      "The course includes model-health checks, naming conventions and handover workflows that make you immediately useful on a project team.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "Project setup & modelling",
        duration: "8h 40m",
        lessons: [
          { title: "Templates, levels and grids", duration: "20:15", preview: true },
          { title: "Walls, floors and roofs", duration: "31:20" },
          { title: "Stairs and railings", duration: "24:40" },
        ],
      },
      {
        title: "Families & documentation",
        duration: "9h 10m",
        lessons: [
          { title: "Family editor essentials", duration: "29:30" },
          { title: "Tags, schedules and legends", duration: "26:00" },
          { title: "Sheets and revision control", duration: "22:10" },
        ],
      },
      {
        title: "Coordination & handover",
        duration: "8h 25m",
        lessons: [
          { title: "Linking disciplines and shared coordinates", duration: "25:40" },
          { title: "Clash detection in Navisworks", duration: "27:20" },
          { title: "Model audit and issue", duration: "21:00" },
        ],
      },
    ],
    audience: [
      "Architects and engineers entering BIM teams",
      "CAD drafters moving into coordinated models",
      "Construction professionals reviewing models",
    ],
  },
  {
    slug: "power-bi-sql-business-analytics",
    title: "Power BI & SQL for Business Analytics",
    tagline: "Answer business questions with dashboards leaders trust.",
    category: "business-analytics",
    level: "Beginner",
    price: 2299,
    mrp: 5999,
    rating: 4.8,
    reviews: 1480,
    learners: 10640,
    hours: 22,
    lessons: 96,
    updated: "Jan 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/8204311/pexels-photo-8204311.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "Trending",
    instructor: INSTRUCTORS.naina,
    tools: ["Power BI", "DAX", "SQL", "Excel", "Power Query"],
    outcomes: [
      "Write joins, aggregates and window functions in SQL",
      "Model data cleanly with star schemas",
      "Write DAX measures that are easy to audit",
      "Design dashboards with a clear narrative",
      "Automate refreshes with Power Query",
      "Present insights that lead to a decision",
    ],
    description: [
      "Dashboards fail when they answer questions nobody asked. This course begins with decisions, then works backward into SQL and Power BI.",
      "You will build a commercial performance dashboard and a retention analysis, and practise presenting both in five minutes.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "SQL for analysis",
        duration: "7h 20m",
        lessons: [
          { title: "Select, filter, aggregate", duration: "21:10", preview: true },
          { title: "Joins and CTEs", duration: "25:40" },
          { title: "Window functions and retention", duration: "29:15" },
        ],
      },
      {
        title: "Power BI modelling",
        duration: "7h 50m",
        lessons: [
          { title: "Star schemas that scale", duration: "24:30" },
          { title: "DAX fundamentals", duration: "30:20" },
          { title: "Time intelligence", duration: "22:40" },
        ],
      },
      {
        title: "Storytelling & delivery",
        duration: "6h 30m",
        lessons: [
          { title: "Dashboard design patterns", duration: "26:00" },
          { title: "Automation with Power Query", duration: "21:15" },
          { title: "The five-minute insight presentation", duration: "18:30" },
        ],
      },
    ],
    audience: [
      "Analysts building their first BI stack",
      "Ops and finance professionals owning reporting",
      "Managers who want to read data independently",
    ],
  },
  {
    slug: "python-automation-professionals",
    title: "Python Automation for Busy Professionals",
    tagline: "Save hours every week with small, useful scripts.",
    category: "data-ai",
    level: "Beginner",
    price: 1499,
    mrp: 3999,
    rating: 4.7,
    reviews: 1120,
    learners: 9340,
    hours: 12,
    lessons: 58,
    updated: "Feb 2026",
    language: "English · Hindi subtitles",
    image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "New",
    instructor: INSTRUCTORS.ishita,
    tools: ["Python", "pandas", "openpyxl", "requests", "Playwright"],
    outcomes: [
      "Write readable Python with no prior experience",
      "Automate Excel reports and file cleanup",
      "Pull data from APIs and scheduled jobs",
      "Build a simple browser automation script",
      "Handle errors and log what happened",
      "Package a script your teammate can run",
    ],
    description: [
      "A short, applied course for people who do not want to become software engineers — they want to stop copying rows between spreadsheets.",
      "Nine tiny projects, each under 40 lines, that you can adapt to your own work the same day.",
    ],
    requirements: ["A computer (Windows, Mac or Linux)", "No coding experience needed", "Around 3 hours each week"],
    curriculum: [
      {
        title: "Python basics with a purpose",
        duration: "4h 10m",
        lessons: [
          { title: "Install, run, repeat", duration: "12:10", preview: true },
          { title: "Lists, dicts and loops", duration: "26:30" },
          { title: "Functions and files", duration: "22:15" },
        ],
      },
      {
        title: "Automate the boring work",
        duration: "4h 30m",
        lessons: [
          { title: "Excel reports with openpyxl", duration: "28:20" },
          { title: "APIs and scheduled jobs", duration: "24:40" },
          { title: "Browser tasks with Playwright", duration: "26:10" },
        ],
      },
      {
        title: "Make it reliable",
        duration: "3h 20m",
        lessons: [
          { title: "Errors, retries and logs", duration: "18:30" },
          { title: "Packaging for teammates", duration: "16:20" },
          { title: "Your automation plan", duration: "12:00" },
        ],
      },
    ],
    audience: [
      "Operations, admin and finance professionals",
      "Researchers juggling repetitive data work",
      "Anyone curious about practical coding",
    ],
  },
  {
    slug: "ai-product-management-prompting",
    title: "AI Product Management & Prompt Engineering",
    tagline: "Ship useful AI features — and know when not to.",
    category: "ai-fluency",
    level: "All levels",
    price: 2699,
    mrp: 6999,
    rating: 4.8,
    reviews: 720,
    learners: 5210,
    hours: 18,
    lessons: 74,
    updated: "Feb 2026",
    language: "English",
    image:
      "https://images.pexels.com/photos/5866051/pexels-photo-5866051.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tag: "New",
    instructor: INSTRUCTORS.vikram,
    tools: ["LLM APIs", "Prompt design", "Evals", "RAG", "Guardrails"],
    outcomes: [
      "Spot AI use cases with real user value",
      "Write prompts that are testable, not magic",
      "Build a lightweight evaluation harness",
      "Design guardrails and escalation paths",
      "Estimate cost, latency and quality trade-offs",
      "Present an AI product brief to stakeholders",
    ],
    description: [
      "Most AI features fail on quality, trust or economics. This course gives product managers and builders a practical system for evaluating all three before writing a spec.",
      "You will ship a small internal assistant, measure it honestly, and write the launch memo.",
    ],
    requirements: commonRequirements,
    curriculum: [
      {
        title: "AI product fundamentals",
        duration: "5h 20m",
        lessons: [
          { title: "What models are good and bad at", duration: "22:30", preview: true },
          { title: "Mapping user jobs to AI", duration: "24:10" },
          { title: "Cost, latency and UX", duration: "21:40" },
        ],
      },
      {
        title: "Prompting & evaluation",
        duration: "6h 30m",
        lessons: [
          { title: "Prompt patterns that survive scale", duration: "27:15" },
          { title: "Building an eval set", duration: "29:00" },
          { title: "RAG without the cargo cult", duration: "25:30" },
        ],
      },
      {
        title: "Trust & launch",
        duration: "6h 10m",
        lessons: [
          { title: "Guardrails and human handoff", duration: "23:20" },
          { title: "Launch metrics and feedback loops", duration: "21:50" },
          { title: "Writing the AI product brief", duration: "24:00" },
        ],
      },
    ],
    audience: [
      "Product managers adding AI to existing products",
      "Founders validating an AI-first idea",
      "Designers and engineers shaping AI features",
    ],
  },
];

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Test the waters, free forever.",
    monthly: 0,
    annual: 0,
    cta: "Create free account",
    features: [
      "Preview lessons from every course",
      "1 full starter course",
      "AI mentor · 20 messages / month",
      "Community access",
      "Progress tracking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For the learner who is all in.",
    monthly: 1299,
    annual: 999,
    popular: true,
    cta: "Start 7-day free trial",
    features: [
      "Unlimited access to all 180+ courses",
      "Unlimited AI mentor & career roadmaps",
      "Downloadable resources & projects",
      "Verified certificates",
      "Live monthly workshops",
      "Offline lesson downloads",
      "Priority learner support",
    ],
  },
  {
    id: "teams",
    name: "Teams",
    tagline: "Upskill your whole team.",
    monthly: 2499,
    annual: 1999,
    cta: "Talk to our team",
    features: [
      "Everything in Pro, per seat",
      "Admin dashboard & seat management",
      "Custom learning paths",
      "Skills assessments for teams",
      "Dedicated success manager",
      "GST invoicing & consolidated billing",
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Priya Menon",
    role: "DevOps Engineer at Finlytic",
    avatar: "https://images.pexels.com/photos/4126756/pexels-photo-4126756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "The Complete DevOps Engineer Bootcamp",
    courseSlug: "complete-devops-engineer-bootcamp",
    rating: 5,
    date: "18 Feb 2026",
    title: "The projects did it for me",
    text: "I had done tutorial after tutorial and still could not explain my work. The capstone pipeline gave me something real to discuss. Three interviews later I moved from support into a DevOps role with a 2.1× jump.",
    helpful: 184,
  },
  {
    id: "r2",
    name: "Rohan Bhatt",
    role: "Civil engineering student",
    avatar: "https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "AutoCAD 2026: From Drafting to 3D Design",
    courseSlug: "autocad-2026-drafting-to-3d",
    rating: 5,
    date: "04 Feb 2026",
    title: "Portfolio changed my internship luck",
    text: "My college lab never covered sheet sets or xrefs. The apartment project is now the first thing I show. Got a paid internship two weeks after finishing.",
    helpful: 142,
  },
  {
    id: "r3",
    name: "Sneha Kulkarni",
    role: "Data Analyst at a retail brand",
    avatar: "https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "Data Science & Machine Learning with Python",
    courseSlug: "data-science-machine-learning-python",
    rating: 4,
    date: "27 Jan 2026",
    title: "Rigorous without being scary",
    text: "The evaluation module humbled me — in a good way. I finally understand why my earlier models looked great offline and failed in production. The pace is demanding but the mentor keeps you honest.",
    helpful: 96,
  },
  {
    id: "r4",
    name: "Aditya Verma",
    role: "Product designer",
    avatar: "https://images.pexels.com/photos/35681211/pexels-photo-35681211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "UI/UX Design: From Wireframe to Portfolio",
    courseSlug: "ui-ux-design-portfolio",
    rating: 5,
    date: "11 Feb 2026",
    title: "Critique was worth the price",
    text: "Tara's review of my fintech flow was brutally clear and kind at the same time. I rebuilt the case study and it became the centrepiece of a successful switch into product design.",
    helpful: 211,
  },
  {
    id: "r5",
    name: "Fatima Ansari",
    role: "SOC Analyst L1",
    avatar: "https://images.pexels.com/photos/34930167/pexels-photo-34930167.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "Cybersecurity Analyst Bootcamp: SOC to Cloud",
    courseSlug: "cybersecurity-analyst-bootcamp",
    rating: 5,
    date: "22 Jan 2026",
    title: "The shift simulation is genius",
    text: "It felt like my actual first week. The report template we built is still what I use at work. I would recommend it to anyone trying to break into blue team.",
    helpful: 134,
  },
  {
    id: "r6",
    name: "Karan Suri",
    role: "Founder, 2-person studio",
    avatar: "https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "Full-Stack Web Development with React & Node",
    courseSlug: "full-stack-react-node",
    rating: 4,
    date: "16 Jan 2026",
    title: "Finally understand deployment",
    text: "The testing and deploy sections filled a huge gap. I shipped a client project without panicking. Would love a deeper section on background jobs, but the AI mentor filled most gaps.",
    helpful: 78,
  },
  {
    id: "r7",
    name: "Ira Deshmukh",
    role: "HR to data analytics",
    avatar: "https://images.pexels.com/photos/4126749/pexels-photo-4126749.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "Power BI & SQL for Business Analytics",
    courseSlug: "power-bi-sql-business-analytics",
    rating: 5,
    date: "09 Feb 2026",
    title: "Resume-to-interview in six weeks",
    text: "I used the retention analysis as a talking point and it led the conversation for twenty minutes. The career roadmap from the AI mentor told me exactly what to learn next.",
    helpful: 119,
  },
  {
    id: "r8",
    name: "Neel Abraham",
    role: "Automation lead",
    avatar: "https://images.pexels.com/photos/37273005/pexels-photo-37273005.png?auto=compress&cs=tinysrgb&dpr=2&h=180&w=180",
    course: "Python Automation for Busy Professionals",
    courseSlug: "python-automation-professionals",
    rating: 5,
    date: "31 Jan 2026",
    title: "Saved 11 hours a month",
    text: "Short, practical, no fluff. I automated two weekly reports during the course itself. My manager noticed before I finished module three.",
    helpful: 88,
  },
];

export const testimonials = [
  {
    quote: "Elearn Hub is the first platform where the AI mentor knew my actual gaps. It routed me from support into a platform engineering role in five months.",
    name: "Priya Menon",
    role: "DevOps Engineer · Bengaluru",
    avatar: reviews[0].avatar,
    rating: 5,
  },
  {
    quote: "The CAD track is taught like a studio, not a software manual. My portfolio finally looks like the work I want to be hired for.",
    name: "Rohan Bhatt",
    role: "Design Intern · Pune",
    avatar: reviews[1].avatar,
    rating: 5,
  },
  {
    quote: "I run a two-person studio. The Pro plan pays for itself every time I use the mentor to sanity-check a data model or a deployment plan.",
    name: "Karan Suri",
    role: "Founder, Studio Nine",
    avatar: reviews[5].avatar,
    rating: 4,
  },
];

export const faqs = [
  {
    q: "Do I need a subscription to take a course?",
    a: "No. Every course can be purchased individually and stays in your library for 12 months. A Pro subscription is the better value if you plan to take more than two courses, because it unlocks the entire catalogue plus unlimited AI mentorship.",
  },
  {
    q: "How does the AI career mentor work?",
    a: "The mentor asks about your current role, target role and available time, then drafts a week-by-week roadmap. It can also review your project approach, explain course concepts and run mock interview questions. All suggestions are grounded in our curriculum and are reviewed by human career coaches each month.",
  },
  {
    q: "Are the certificates recognised by employers?",
    a: "Our certificates carry a verifiable credential ID and a skills summary employers can check. They are valued as evidence of applied work — which is why every certificate is backed by a completed project, not just video watch time.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "There is a no-questions 7-day money-back window for individual courses and new subscriptions, as long as you have completed less than 40% of the content. See the Cancellation & Refund page for full details and the quick request form.",
  },
  {
    q: "Can my employer pay for the subscription?",
    a: "Yes. Teams billing supports GST invoices, purchase orders and consolidated card or bank payment. Reach out through the contact page and we will set up a team account within one working day.",
  },
  {
    q: "Do courses include live support?",
    a: "Pro and Teams members get access to monthly live workshops, cohort channels and priority answers. Everyone can use the AI mentor 24/7, plus the moderated community forum.",
  },
];

export const learningPaths = [
  {
    slug: "devops-launchpad",
    name: "DevOps Launchpad",
    kicker: "Career track",
    months: "5 months",
    courses: "4 courses",
    level: "Beginner friendly",
    description: "Linux, containers, cloud and CI/CD — with a deployed capstone and interview prep.",
    image: courses[0].image,
    tint: "#CDF56A",
    skills: ["Linux", "Docker", "Kubernetes", "AWS"],
    learners: "4.2k learners",
  },
  {
    slug: "design-to-build",
    name: "Design → Build",
    kicker: "Career track",
    months: "6 months",
    courses: "5 courses",
    level: "All levels",
    description: "From CAD fundamentals and BIM coordination to a portfolio that survives a review.",
    image: courses[1].image,
    tint: "#D9C8FF",
    skills: ["AutoCAD", "Revit", "BIM", "Portfolio"],
    learners: "2.8k learners",
  },
  {
    slug: "ai-data-accelerator",
    name: "AI & Data Accelerator",
    kicker: "Career track",
    months: "7 months",
    courses: "6 courses",
    level: "Intermediate",
    description: "Python, machine learning, analytics and AI product thinking for data-led roles.",
    image: courses[3].image,
    tint: "#A9DDF5",
    skills: ["Python", "ML", "SQL", "AI products"],
    learners: "3.6k learners",
  },
];

export const mentorPrompts = [
  "I want to move into DevOps in 6 months",
  "How do I start a career in AutoCAD design?",
  "Review my data science roadmap",
  "What skills do AI product managers need?",
];

export const mentorReplies: { keys: string[]; text: string[]; courses: string[] }[] = [
  {
    keys: ["devops", "cloud", "kubernetes", "aws", "sre", "platform"],
    text: [
      "A realistic 6-month DevOps roadmap from where most switchers start:",
      "1 · Months 1–2 — Linux, networking and Git. Do one small automation project and document it.\n2 · Months 3–4 — Docker, CI/CD and a cloud account. Deploy one real app on every merge.\n3 · Month 5 — Kubernetes and observability. Add monitoring, alerts and a rollback plan.\n4 · Month 6 — A capstone + interview prep. Narrate trade-offs, not just tools.",
      "You already have an advantage: support/QA experience gives you production context most juniors lack. Lead with that in your story. Want me to map this to courses and a weekly schedule?",
    ],
    courses: ["complete-devops-engineer-bootcamp", "aws-solutions-architect-path"],
  },
  {
    keys: ["autocad", "cad", "design", "revit", "bim", "architecture", "drafting"],
    text: [
      "Design careers reward demonstrable craft. Here is the shortest credible path:",
      "1 · Spend 5–6 weeks on AutoCAD precision drafting. Set up templates and layer standards deliberately.\n2 · Build one small building project end to end — plan, elevations, sections, sheet set. This becomes your first case study.\n3 · Add BIM coordination (Revit) if you want to work on larger projects. Clash detection and model audits are the skills teams actually need.\n4 · Publish 3 portfolio sheets per project on Behance or a simple PDF site. Quality of annotation matters as much as the render.",
      "Plan for 8–10 focused hours a week. By month four you can confidently apply for drafting or junior design roles.",
    ],
    courses: ["autocad-2026-drafting-to-3d", "revit-bim-architecture"],
  },
  {
    keys: ["data", "machine learning", "ml", "python", "analyst", "analytics", "sql"],
    text: [
      "For a data career, do not start with deep learning. Start with decision-making:",
      "1 · Python + pandas for cleaning and exploration. One messy dataset is worth ten tutorials.\n2 · SQL joins, CTEs and window functions. Most interviews screen here first.\n3 · One model type you can defend in detail — usually gradient boosting. Understand evaluation and leakage.\n4 · A capstone with a written case study: question, data, trade-offs, impact. A deployed Streamlit app is a bonus.",
      "If you are switching from HR or ops, pick a domain you know. A churn model in a domain you understand beats a generic image classifier in an interview.",
    ],
    courses: ["data-science-machine-learning-python", "power-bi-sql-business-analytics"],
  },
  {
    keys: ["ai", "product", "prompt", "llm", "mentor"],
    text: [
      "AI product work is mostly judgement about quality, trust and cost. Build those muscles:",
      "1 · Learn what model families are genuinely good at, including their failure modes.\n2 · Write 3 small prompts with explicit success criteria, then build a 20-case eval set. This alone puts you ahead of most candidates.\n3 · Design the human handoff, guardrails and feedback loop — the unglamorous parts.\n4 · Ship one internal tool and present a short launch memo with metrics.\n\nFor your portfolio, include a before/after evaluation table. Hiring managers love evidence over enthusiasm.",
    ],
    courses: ["ai-product-management-prompting", "data-science-machine-learning-python"],
  },
  {
    keys: ["security", "soc", "cyber", "blue team", "threat"],
    text: [
      "Blue-team hiring is about demonstrated investigation, not certificate count. A four-month plan:",
      "1 · Networking and identity fundamentals first. You need to know what normal looks like.\n2 · Practise triage on a SIEM: 30 alerts, written notes for each. Build a personal runbook.\n3 · Learn cloud detection basics — identity misuse is the most common real-world incident path.\n4 · Do a full incident report and rehearse a 10-minute verbal walkthrough.",
      "Certificates help you pass HR filters; your investigation write-ups get you the offer.",
    ],
    courses: ["cybersecurity-analyst-bootcamp", "complete-devops-engineer-bootcamp"],
  },
  {
    keys: ["review", "feedback", "portfolio", "resume", "cv", "interview"],
    text: [
      "I can work with a portfolio or roadmap. For the strongest review, share three things:",
      "1 · The target role and 2–3 job descriptions you are aiming at.\n2 · Your current projects (even unfinished) and the decisions behind them.\n3 · The timeline you can realistically commit to each week.",
      "I will score your portfolio on problem framing, craft, evidence of iteration and communication — then give you the three highest-leverage fixes. Start by adding one project's context to our chat.",
    ],
    courses: ["ui-ux-design-portfolio", "ai-product-management-prompting"],
  },
];

export const stats = [
  { value: "42k+", label: "careers accelerated" },
  { value: "180+", label: "expert-led courses" },
  { value: "4.9/5", label: "average learner rating" },
  { value: "92%", label: "finish their first project" },
];

export const tools = [
  "AWS",
  "Docker",
  "Kubernetes",
  "AutoCAD",
  "Revit",
  "Figma",
  "Python",
  "Terraform",
  "Power BI",
  "React",
  "Splunk",
  "SQL",
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const courseBySlug = (slug: string) => courses.find((c) => c.slug === slug);
export const planById = (id: string) => plans.find((p) => p.id === id);

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const discountedPercent = (mrp: number, price: number) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const learningCourses = [
  { slug: "complete-devops-engineer-bootcamp", progress: 68, lastLesson: "Helm, namespaces & progressive rollout", nextUp: "Lab: deploy a resilient three-tier app", minutes: 34 },
  { slug: "ui-ux-design-portfolio", progress: 32, lastLesson: "Wireframing with intent", nextUp: "High-fidelity prototyping in Figma", minutes: 45 },
  { slug: "ai-product-management-prompting", progress: 12, lastLesson: "Mapping user jobs to AI", nextUp: "Cost, latency and UX", minutes: 22 },
];

export const mockOrders = [
  { id: "EH-260218-3041", date: "18 Feb 2026", items: "DevOps Engineer Bootcamp", total: 3499, status: "Success" },
  { id: "EH-260204-1127", date: "04 Feb 2026", items: "UX Portfolio Track", total: 2999, status: "Success" },
  { id: "EH-260118-8890", date: "18 Jan 2026", items: "AI Product Management", total: 2699, status: "Success" },
];
