export type Decision = "interested" | "not-a-fit" | null;

export type Candidate = {
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
  {
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
];
