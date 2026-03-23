export type Decision = "interested" | "not-a-fit" | null;

export type Candidate = {
  id: string;
  name: string;
  role: string;
  badge: string;
  source: "system" | "matcher";
  matcherName?: string;
  reasons: Array<{ pre?: string; bold: string; post?: string }>;
  skills: string[];
  canStart: string;
  availability: string;
  localTime: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    years: string;
    bullets: string[];
  }>;
};

export const CANDIDATES: Candidate[] = [
  // ── Batch 1 (auto-matched) ─────────────────────────────────────────────────
  {
    id: "c1",
    name: "Kimberly Saxton",
    role: "Frontend Developer",
    badge: "Auto-matched",
    source: "system",
    reasons: [
      { bold: "8 years", post: " building financial platforms at scale" },
      { bold: "Led migration to microservices", post: " at previous role" },
      { pre: "Strong track record with ", bold: "real-time data systems" },
    ],
    skills: ["React | 4 years", "CSS | 4 years", "HTML | 4 years"],
    canStart: "Immediately",
    availability: "Part Time (20 hours/week)",
    localTime: "2:55 PM Local Time",
    about:
      "Kimberly is a deeply experienced strategy and operations executive. She is a consumer-first leader who crafts brand, marketing, and digital strategies to drive growth, launch products, and turnaround brands. Most recently, Kimberly shaped a DTC strategy that enabled a consumer goods company to create direct, rich relationships with consumers and crafted a hero product strategy to leverage marketing spend efficiently while driving trial and repeat.",
    experience: [
      {
        title: "Vice President | Brand Operations and Strategy",
        company: "CitiBank",
        years: "2018 - 2021",
        bullets: [
          "Defined the concept-to-market process, delineating interdependencies and the critical path between marketing, supply chain, and creative. Developed an integrated timeline to create milestone transparency. Reduced time to market by over 15%.",
          "Led cross-functional team of 12 to deliver $40M product launch on time and under budget.",
        ],
      },
      {
        title: "Senior Product Manager",
        company: "Estée Lauder",
        years: "2015 - 2018",
        bullets: [
          "Managed portfolio of 8 beauty product lines generating $200M+ in annual revenue.",
          "Drove 22% YoY growth through strategic repositioning and new channel development.",
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Marcus Chen",
    role: "Full-Stack Developer",
    badge: "Auto-matched",
    source: "system",
    reasons: [
      { bold: "6 years", post: " in Node.js and React ecosystems" },
      { bold: "Built scalable APIs", post: " serving 1M+ users" },
      { pre: "Expert in ", bold: "TypeScript and GraphQL" },
    ],
    skills: ["Node.js | 6 years", "React | 5 years", "GraphQL | 3 years"],
    canStart: "In 2 weeks",
    availability: "Full Time",
    localTime: "10:30 AM Local Time",
    about:
      "Marcus is a full-stack engineer with deep expertise in building high-throughput distributed systems. He specialises in API architecture, real-time features, and cloud infrastructure. Known for clean code and strong technical mentorship.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Stripe",
        years: "2020 - 2024",
        bullets: [
          "Architected and maintained GraphQL gateway handling 50M+ daily requests.",
          "Led migration from monolith to microservices, reducing deployment time by 60%.",
        ],
      },
    ],
  },
  {
    id: "c3",
    name: "Priya Sharma",
    role: "Backend Developer",
    badge: "Auto-matched",
    source: "matcher",
    matcherName: "Steven",
    reasons: [
      { bold: "5 years", post: " in cloud-native backend development" },
      { bold: "Microservices specialist", post: " with AWS expertise" },
      { pre: "Strong in ", bold: "system design and architecture" },
    ],
    skills: ["AWS | 5 years", "Python | 5 years", "Docker | 4 years"],
    canStart: "Immediately",
    availability: "Part Time (30 hours/week)",
    localTime: "3:15 PM Local Time",
    about:
      "Priya is a backend engineer with a strong foundation in cloud infrastructure and distributed systems. She has led architecture reviews, designed event-driven systems, and mentored junior engineers across multiple teams.",
    experience: [
      {
        title: "Backend Engineer",
        company: "Amazon",
        years: "2019 - 2024",
        bullets: [
          "Designed and deployed serverless data pipelines processing 10TB+ daily.",
          "Reduced infrastructure costs by 35% through architectural optimisations.",
        ],
      },
    ],
  },

  // ── Batch 2 (matcher-suggested) ────────────────────────────────────────────
  {
    id: "c4",
    name: "Aleksei Volkov",
    role: "Backend Developer",
    badge: "Matcher pick",
    source: "matcher",
    matcherName: "Steven",
    reasons: [
      { bold: "10 years", post: " building high-load backend services" },
      { pre: "Deep expertise in ", bold: "Kafka and event-driven architecture" },
      { bold: "Led platform team", post: " at a Series B fintech" },
    ],
    skills: ["Java | 8 years", "Kafka | 5 years", "PostgreSQL | 7 years"],
    canStart: "In 1 week",
    availability: "Full Time",
    localTime: "11:00 AM Local Time",
    about:
      "Aleksei is a senior backend engineer specialising in high-throughput data pipelines and distributed messaging systems. He has a strong track record of leading small platform teams and delivering infrastructure that scales under pressure.",
    experience: [
      {
        title: "Principal Backend Engineer",
        company: "Revolut",
        years: "2019 - 2024",
        bullets: [
          "Designed core transaction processing pipeline handling 80K events/sec.",
          "Reduced p99 latency by 40% through Kafka partition rebalancing and consumer tuning.",
        ],
      },
      {
        title: "Senior Software Engineer",
        company: "N26",
        years: "2016 - 2019",
        bullets: [
          "Built fraud detection microservice that cut false-positive rate by 30%.",
        ],
      },
    ],
  },
  {
    id: "c5",
    name: "Sofia Lindqvist",
    role: "Frontend Engineer",
    badge: "Matcher pick",
    source: "matcher",
    matcherName: "Steven",
    reasons: [
      { bold: "7 years", post: " crafting design-system-level React components" },
      { pre: "Strong background in ", bold: "accessibility and performance" },
      { bold: "Open-source contributor", post: " to major UI libraries" },
    ],
    skills: ["React | 7 years", "TypeScript | 5 years", "CSS-in-JS | 4 years"],
    canStart: "Immediately",
    availability: "Full Time",
    localTime: "9:45 AM Local Time",
    about:
      "Sofia is a frontend specialist known for building scalable component libraries and pixel-perfect UIs. She is highly attuned to accessibility standards and has led frontend guilds at two unicorn-stage startups.",
    experience: [
      {
        title: "Senior Frontend Engineer",
        company: "Spotify",
        years: "2021 - 2024",
        bullets: [
          "Owned the design system used by 200+ engineers across 4 product teams.",
          "Improved Lighthouse accessibility score from 72 to 98 across all core surfaces.",
        ],
      },
    ],
  },
  {
    id: "c6",
    name: "Daniel Osei",
    role: "DevOps / Platform Engineer",
    badge: "Auto-matched",
    source: "system",
    reasons: [
      { bold: "8 years", post: " in cloud infrastructure and CI/CD" },
      { pre: "Expert in ", bold: "Kubernetes and Terraform at scale" },
      { bold: "Reduced deploy time by 70%", post: " at previous engagement" },
    ],
    skills: ["Kubernetes | 6 years", "Terraform | 5 years", "AWS | 8 years"],
    canStart: "In 2 weeks",
    availability: "Full Time",
    localTime: "4:30 PM Local Time",
    about:
      "Daniel is a platform engineer with deep experience automating infrastructure for fast-growing teams. He has designed multi-region Kubernetes clusters, implemented GitOps workflows, and significantly reduced operational toil across complex cloud environments.",
    experience: [
      {
        title: "Lead Platform Engineer",
        company: "Monzo",
        years: "2020 - 2024",
        bullets: [
          "Managed 400-node Kubernetes cluster across 3 AWS regions with 99.99% uptime.",
          "Built internal developer platform that cut environment setup from 4 hours to 8 minutes.",
        ],
      },
    ],
  },

  // ── Batch 3 (additional matches) ───────────────────────────────────────────
  {
    id: "c7",
    name: "Yuki Tanaka",
    role: "Full-Stack Engineer",
    badge: "Auto-matched",
    source: "system",
    reasons: [
      { bold: "6 years", post: " building SaaS products end-to-end" },
      { pre: "Expert in ", bold: "Next.js and serverless architectures" },
      { bold: "Shipped 4 products", post: " as a solo engineer" },
    ],
    skills: ["Next.js | 5 years", "TypeScript | 6 years", "PostgreSQL | 4 years"],
    canStart: "Immediately",
    availability: "Part Time (25 hours/week)",
    localTime: "6:15 PM Local Time",
    about:
      "Yuki is a versatile full-stack engineer who thrives working autonomously. With extensive experience in serverless and edge deployments, she has shipped multiple production SaaS products independently and collaborates seamlessly with design and product stakeholders.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Vercel",
        years: "2022 - 2024",
        bullets: [
          "Built internal analytics dashboard used daily by 500+ enterprise customers.",
          "Contributed core features to open-source Next.js routing and middleware.",
        ],
      },
      {
        title: "Full-Stack Engineer",
        company: "Linear",
        years: "2020 - 2022",
        bullets: [
          "Implemented real-time collaboration features with 100ms sync latency.",
        ],
      },
    ],
  },
  {
    id: "c8",
    name: "Ravi Patel",
    role: "Backend / Data Engineer",
    badge: "Auto-matched",
    source: "system",
    reasons: [
      { bold: "9 years", post: " in data engineering and backend services" },
      { pre: "Expert in ", bold: "Python, Spark, and dbt" },
      { bold: "Reduced pipeline costs by 45%", post: " through query optimisation" },
    ],
    skills: ["Python | 9 years", "Spark | 6 years", "dbt | 4 years"],
    canStart: "In 1 week",
    availability: "Full Time",
    localTime: "1:00 PM Local Time",
    about:
      "Ravi is a data engineer with a strong background in building reliable, cost-efficient data platforms. He has worked across the stack from ingestion pipelines to analytical query layers and has a reputation for thorough documentation and clean, maintainable code.",
    experience: [
      {
        title: "Senior Data Engineer",
        company: "Databricks",
        years: "2021 - 2024",
        bullets: [
          "Designed lakehouse architecture processing 2PB+ of customer data monthly.",
          "Mentored team of 6 data engineers and established company-wide pipeline standards.",
        ],
      },
    ],
  },
  {
    id: "c9",
    name: "Amara Okonkwo",
    role: "Mobile Engineer (React Native)",
    badge: "Matcher pick",
    source: "matcher",
    matcherName: "Steven",
    reasons: [
      { bold: "7 years", post: " shipping mobile apps on iOS and Android" },
      { pre: "Deep expertise in ", bold: "React Native performance optimisation" },
      { bold: "Led mobile team", post: " at a top-10 fintech app" },
    ],
    skills: ["React Native | 7 years", "TypeScript | 6 years", "Swift | 3 years"],
    canStart: "In 2 weeks",
    availability: "Full Time",
    localTime: "5:00 PM Local Time",
    about:
      "Amara is a mobile engineer who has led cross-platform development at scale. She is well-versed in native bridge modules, CI/CD for mobile, and has driven significant improvements in app performance and crash rates across large user bases.",
    experience: [
      {
        title: "Lead Mobile Engineer",
        company: "Wise",
        years: "2020 - 2024",
        bullets: [
          "Owned React Native codebase with 10M+ MAU across iOS and Android.",
          "Reduced app crash rate by 60% through systematic error boundary and monitoring work.",
        ],
      },
    ],
  },
];
