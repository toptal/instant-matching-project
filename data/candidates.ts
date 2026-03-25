export type Decision = "interested" | "not-a-fit" | null;

export type Candidate = {
  id: string;
  name: string;
  photo?: string;
  role: string;
  badge: string;
  source: "system" | "matcher";
  matcherName?: string;
  reasons: Array<{ full?: string; pre?: string; bold: string; post?: string }>;
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
    photo: "/photos/woman1.png",
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
      "Kimberly is a deeply experienced strategy and operations executive with over eight years building consumer-facing digital products for financial institutions and global brands. She is a consumer-first leader who crafts brand, marketing, and digital strategies to drive growth, launch products, and turn around underperforming lines. Her strength lies in uniting cross-functional teams — spanning engineering, design, supply chain, and marketing — around a single roadmap and a shared set of metrics. Most recently, Kimberly shaped a DTC strategy that enabled a consumer goods company to create direct, rich relationships with consumers and crafted a hero product strategy to leverage marketing spend efficiently while driving trial and repeat. She is equally comfortable in the boardroom presenting to C-suite stakeholders and in the weeds reviewing A/B test results or debating information architecture with a product team.",
    experience: [
      {
        title: "Vice President | Brand Operations and Strategy",
        company: "CitiBank",
        years: "2018 - 2021",
        bullets: [
          "Defined the concept-to-market process, delineating interdependencies and the critical path between marketing, supply chain, and creative. Developed an integrated timeline to create milestone transparency. Reduced time to market by over 15%.",
          "Led cross-functional team of 12 to deliver $40M product launch on time and under budget.",
          "Introduced OKR framework across three product lines, improving quarterly goal attainment from 58% to 84%.",
        ],
      },
      {
        title: "Senior Product Manager",
        company: "Estée Lauder",
        years: "2015 - 2018",
        bullets: [
          "Managed portfolio of 8 beauty product lines generating $200M+ in annual revenue.",
          "Drove 22% YoY growth through strategic repositioning and new channel development.",
          "Partnered with UX and engineering to redesign the e-commerce checkout flow, lifting conversion by 18%.",
        ],
      },
      {
        title: "Product Manager",
        company: "American Express",
        years: "2013 - 2015",
        bullets: [
          "Owned the digital rewards dashboard used by 4M cardholders, shipping 6 major releases in 18 months.",
          "Reduced customer support contacts related to rewards by 31% through improved self-service flows.",
        ],
      },
      {
        title: "Associate Product Manager",
        company: "JPMorgan Chase",
        years: "2011 - 2013",
        bullets: [
          "Supported launch of mobile banking app that reached 1M downloads in its first quarter.",
          "Coordinated UAT cycles with QA and compliance teams, cutting release-blocking defects by 40%.",
        ],
      },
      {
        title: "Business Analyst",
        company: "Deloitte Digital",
        years: "2009 - 2011",
        bullets: [
          "Delivered requirements and functional specifications for three Fortune 500 financial services clients.",
          "Facilitated stakeholder workshops to align competing priorities and produce signed-off product roadmaps.",
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Chris Davenport",
    photo: "/photos/man3.png",
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
      "Chris is a full-stack engineer with deep expertise in building high-throughput distributed systems. He specialises in API architecture, real-time features, and cloud infrastructure on AWS, and has a strong record of leading technical migrations without service disruption. Chris has mentored junior and mid-level engineers throughout his career and is known for raising the bar on code quality through thoughtful pull-request reviews and design documents. He communicates clearly with non-technical stakeholders and is comfortable owning entire product surface areas end-to-end — from database schema design to React component libraries. Outside of work he contributes to open-source projects in the Node.js ecosystem and writes a technical blog followed by over 8,000 developers.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Stripe",
        years: "2020 - 2024",
        bullets: [
          "Architected and maintained GraphQL gateway handling 50M+ daily requests.",
          "Led migration from monolith to microservices, reducing deployment time by 60%.",
          "Introduced contract testing with Pact, eliminating a class of integration regressions that had caused two production incidents.",
          "Mentored three engineers who were subsequently promoted to senior level.",
        ],
      },
      {
        title: "Software Engineer",
        company: "Atlassian",
        years: "2018 - 2020",
        bullets: [
          "Built real-time notification service for Jira, supporting 500K concurrent WebSocket connections.",
          "Reduced end-to-end test suite runtime by 45% through parallelisation and selective test execution.",
          "Contributed to internal platform SDK adopted by 30+ product teams.",
        ],
      },
      {
        title: "Full-Stack Engineer",
        company: "Canva",
        years: "2016 - 2018",
        bullets: [
          "Developed collaborative editing backend using operational transforms, enabling real-time co-editing for design teams.",
          "Improved API p95 response time from 420ms to 85ms through query optimisation and Redis caching.",
        ],
      },
      {
        title: "Junior Developer",
        company: "Freelance / Startups",
        years: "2014 - 2016",
        bullets: [
          "Delivered full-stack web applications for five early-stage startups, each under tight deadlines.",
          "Gained broad exposure to React, Express, PostgreSQL, and deployment on Heroku and AWS.",
        ],
      },
    ],
  },
  {
    id: "c3",
    name: "Emma Walsh",
    photo: "/photos/woman3.png",
    role: "Backend Developer",
    badge: "Matcher pick",
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
      "Emma is a backend engineer with a strong foundation in cloud infrastructure and distributed systems design. She has led architecture reviews, designed event-driven systems using AWS EventBridge and SQS, and mentored junior engineers across multiple teams. Emma has a rigorous approach to reliability engineering — she introduced SLO frameworks at her last two employers and drove the adoption of chaos engineering practices that proactively surfaced failure modes before they reached production. She holds AWS Solutions Architect – Professional and AWS DevOps Engineer – Professional certifications, and regularly speaks at local cloud meetups. Her communication style is precise and jargon-free, making her particularly effective at bridging engineering and product conversations.",
    experience: [
      {
        title: "Backend Engineer",
        company: "Amazon",
        years: "2019 - 2024",
        bullets: [
          "Designed and deployed serverless data pipelines processing 10TB+ daily.",
          "Reduced infrastructure costs by 35% through architectural optimisations.",
          "Established SLO dashboards and error-budget policies adopted across six services.",
          "Led quarterly architecture reviews for the Prime Video personalisation platform.",
        ],
      },
      {
        title: "Cloud Engineer",
        company: "Thoughtworks",
        years: "2017 - 2019",
        bullets: [
          "Migrated three legacy monolithic applications to AWS, cutting hosting costs by 50%.",
          "Built CI/CD pipelines using CodePipeline and CodeBuild for five client projects.",
          "Implemented infrastructure-as-code with Terraform, reducing environment provisioning from days to minutes.",
        ],
      },
      {
        title: "Software Engineer",
        company: "Zalando",
        years: "2015 - 2017",
        bullets: [
          "Developed order management microservices handling 2M+ transactions per day during peak sale events.",
          "Improved service resilience by implementing circuit breakers and retry logic using Hystrix.",
        ],
      },
      {
        title: "Junior Software Engineer",
        company: "Accenture",
        years: "2013 - 2015",
        bullets: [
          "Built REST APIs for banking clients using Python and Django, meeting stringent security compliance requirements.",
          "Automated regression test suite, reducing QA cycle time by three days per release.",
        ],
      },
    ],
  },

  // ── Batch 2 (matcher-suggested) ────────────────────────────────────────────
  {
    id: "c4",
    name: "Aleksei Volkov",
    photo: "/photos/man1.png",
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
      "Aleksei is a senior backend engineer specialising in high-throughput data pipelines and distributed messaging systems. He has spent the last decade building the kind of infrastructure that financial services companies depend on 24/7 — systems where correctness, latency, and fault tolerance are non-negotiable. Aleksei has a strong track record of leading small platform teams, defining engineering standards, and delivering infrastructure that scales gracefully under pressure. He is deeply familiar with the operational challenges of running Kafka at scale — from partition rebalancing and consumer lag monitoring to schema evolution with Confluent Schema Registry. Beyond the technical depth, Aleksei is valued by peers for his pragmatic approach to trade-offs and his ability to produce clear architectural decision records that teams can refer back to years later.",
    experience: [
      {
        title: "Principal Backend Engineer",
        company: "Revolut",
        years: "2019 - 2024",
        bullets: [
          "Designed core transaction processing pipeline handling 80K events/sec.",
          "Reduced p99 latency by 40% through Kafka partition rebalancing and consumer tuning.",
          "Introduced dead-letter queue strategy that eliminated silent message loss across 12 services.",
          "Owned database performance for a 6TB PostgreSQL cluster, implementing query plan caching and connection pooling.",
        ],
      },
      {
        title: "Senior Software Engineer",
        company: "N26",
        years: "2016 - 2019",
        bullets: [
          "Built fraud detection microservice that cut false-positive rate by 30%.",
          "Designed multi-region failover architecture for core banking APIs with sub-30-second recovery time.",
          "Led hiring process and onboarded four backend engineers within a six-month growth sprint.",
        ],
      },
      {
        title: "Software Engineer",
        company: "Sberbank Technology",
        years: "2013 - 2016",
        bullets: [
          "Developed high-performance messaging middleware for inter-bank settlement processing.",
          "Contributed to migration from Oracle to PostgreSQL, documenting 200+ stored procedures.",
        ],
      },
      {
        title: "Junior Java Developer",
        company: "EPAM Systems",
        years: "2011 - 2013",
        bullets: [
          "Worked across three client projects in banking and insurance verticals, gaining broad Java EE experience.",
          "Achieved Oracle Certified Professional Java SE 7 Programmer certification.",
        ],
      },
    ],
  },
  {
    id: "c5",
    name: "Sofia Lindqvist",
    photo: "/photos/woman4.png",
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
      "Sofia is a frontend specialist known for building scalable component libraries and pixel-perfect UIs that hold up under real product demands. She is highly attuned to accessibility standards — WCAG 2.1 AA compliance is a baseline expectation in everything she ships, not an afterthought — and has led frontend guilds at two unicorn-stage startups. Sofia has a gift for translating ambiguous design intentions into robust, well-documented component APIs that other engineers actually enjoy using. She has contributed significantly to open-source UI libraries including Radix UI and React Aria, and her writing on frontend architecture has been featured in CSS-Tricks and Smashing Magazine. She thrives in organisations where design and engineering collaborate closely and where craft is taken seriously.",
    experience: [
      {
        title: "Senior Frontend Engineer",
        company: "Spotify",
        years: "2021 - 2024",
        bullets: [
          "Owned the design system used by 200+ engineers across 4 product teams.",
          "Improved Lighthouse accessibility score from 72 to 98 across all core surfaces.",
          "Reduced bundle size by 38% through code splitting, tree shaking, and audit of transitive dependencies.",
          "Introduced visual regression testing with Chromatic, catching 120+ regressions before production in the first six months.",
        ],
      },
      {
        title: "Frontend Engineer",
        company: "Klarna",
        years: "2018 - 2021",
        bullets: [
          "Built React component library from the ground up, adopted across 8 squads in under three months.",
          "Led frontend performance initiative that reduced First Contentful Paint by 1.4 seconds on the checkout flow.",
          "Co-authored the internal frontend coding standards document used by 60+ engineers.",
        ],
      },
      {
        title: "UI Developer",
        company: "King (Candy Crush)",
        years: "2016 - 2018",
        bullets: [
          "Developed accessible, responsive UI components for web game interfaces reaching 30M+ monthly players.",
          "Collaborated with localisation team to support RTL layouts and 12 language variants.",
        ],
      },
      {
        title: "Junior Frontend Developer",
        company: "Doberman Agency",
        years: "2014 - 2016",
        bullets: [
          "Delivered interactive web experiences for brand campaigns including IKEA and H&M.",
          "Gained deep CSS and animation expertise, delivering award-shortlisted microsites.",
        ],
      },
    ],
  },
  {
    id: "c6",
    name: "Daniel Osei",
    photo: "/photos/man2.png",
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
      "Daniel is a platform engineer with deep experience automating infrastructure for fast-growing engineering teams. He has designed multi-region Kubernetes clusters, implemented GitOps workflows with ArgoCD and Flux, and significantly reduced operational toil across complex multi-cloud environments. Daniel's approach is developer-experience first — he believes that a platform team's primary output is the productivity of the engineers it serves, not just the uptime of the systems it runs. He has built internal developer platforms that collapsed environment setup from hours to minutes, and has introduced SRE practices including runbooks, post-mortem templates, and on-call rotation frameworks that dramatically improved team confidence during incidents. He holds CKA and CKS Kubernetes certifications.",
    experience: [
      {
        title: "Lead Platform Engineer",
        company: "Monzo",
        years: "2020 - 2024",
        bullets: [
          "Managed 400-node Kubernetes cluster across 3 AWS regions with 99.99% uptime.",
          "Built internal developer platform that cut environment setup from 4 hours to 8 minutes.",
          "Implemented GitOps deployment model with ArgoCD, enabling 15+ daily deployments with zero downtime.",
          "Reduced cloud spend by $1.2M annually through right-sizing and reserved instance planning.",
        ],
      },
      {
        title: "Senior DevOps Engineer",
        company: "OakNorth Bank",
        years: "2018 - 2020",
        bullets: [
          "Migrated on-premise workloads to AWS, achieving SOC 2 Type II compliance throughout the process.",
          "Introduced infrastructure-as-code practices using Terraform, eliminating manual configuration drift.",
          "Built observability stack with Prometheus, Grafana, and PagerDuty, cutting mean time to detection by 55%.",
        ],
      },
      {
        title: "DevOps Engineer",
        company: "Sky Betting & Gaming",
        years: "2016 - 2018",
        bullets: [
          "Containerised 40+ microservices with Docker and orchestrated them on Kubernetes.",
          "Automated blue-green deployment pipeline, enabling same-day releases to production.",
        ],
      },
      {
        title: "Systems Administrator",
        company: "Capita",
        years: "2014 - 2016",
        bullets: [
          "Managed Linux and Windows server estate for 10,000+ user organisation.",
          "Scripted routine maintenance tasks in Bash and PowerShell, saving 12 hours per week of manual work.",
        ],
      },
    ],
  },

  // ── Batch 3 (additional matches) ───────────────────────────────────────────
  {
    id: "c7",
    name: "Yuki Tanaka",
    photo: "/photos/woman5.png",
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
      "Yuki is a versatile full-stack engineer who thrives working autonomously on ambiguous, high-impact problems. With extensive experience in serverless and edge deployments, she has independently shipped four production SaaS products — handling everything from architecture and backend APIs to frontend UI and payment integrations. Yuki is deeply knowledgeable about the Next.js ecosystem and has contributed directly to the framework's routing and middleware layer. She collaborates seamlessly with design and product stakeholders and is known for asking the right questions early so that engineering effort is never wasted on the wrong thing. Her work style is asynchronous-first, making her a natural fit for distributed teams across time zones.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Vercel",
        years: "2022 - 2024",
        bullets: [
          "Built internal analytics dashboard used daily by 500+ enterprise customers.",
          "Contributed core features to open-source Next.js routing and middleware.",
          "Designed edge-rendered personalisation pipeline reducing TTFB by 200ms globally.",
          "Ran weekly developer-experience office hours, gathering feedback from 80+ enterprise users to guide roadmap priorities.",
        ],
      },
      {
        title: "Full-Stack Engineer",
        company: "Linear",
        years: "2020 - 2022",
        bullets: [
          "Implemented real-time collaboration features with 100ms sync latency.",
          "Owned the public API surface, writing documentation and managing the developer changelog.",
          "Built webhook delivery system with retry logic handling 5M+ events per month reliably.",
        ],
      },
      {
        title: "Software Engineer",
        company: "Mercari",
        years: "2018 - 2020",
        bullets: [
          "Developed seller dashboard used by 2M+ monthly active sellers across Japan and the US.",
          "Introduced TypeScript across the frontend codebase, reducing runtime errors by an estimated 40%.",
        ],
      },
      {
        title: "Freelance Developer",
        company: "Self-employed",
        years: "2016 - 2018",
        bullets: [
          "Shipped four independent SaaS products covering productivity, scheduling, and invoicing verticals.",
          "Grew one product to $8K MRR before acquisition by a US-based startup.",
        ],
      },
    ],
  },
  {
    id: "c8",
    name: "Ravi Patel",
    photo: "/photos/man4.png",
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
      "Ravi is a data engineer with a strong background in building reliable, cost-efficient data platforms that analytics and machine learning teams can actually trust. He has worked across the full data stack — from ingestion pipelines and CDC streams to dbt transformation layers and Looker semantic models — and has a reputation for meticulous documentation and clean, maintainable SQL that junior analysts can extend without fear. Ravi has led data teams of up to eight engineers, introduced modern lakehouse architectures at two organisations, and consistently delivers pipeline cost reductions through disciplined query optimisation and intelligent partitioning strategies. He is a regular speaker at dbt Community meetups and has published open-source dbt packages with over 600 GitHub stars.",
    experience: [
      {
        title: "Senior Data Engineer",
        company: "Databricks",
        years: "2021 - 2024",
        bullets: [
          "Designed lakehouse architecture processing 2PB+ of customer data monthly.",
          "Mentored team of 6 data engineers and established company-wide pipeline standards.",
          "Reduced Spark job costs by 45% through partition pruning, broadcast joins, and cluster auto-scaling tuning.",
          "Built real-time feature store for ML models, reducing feature serving latency from 800ms to 40ms.",
        ],
      },
      {
        title: "Data Engineer",
        company: "Deliveroo",
        years: "2018 - 2021",
        bullets: [
          "Built event ingestion platform consuming 300K+ Kafka messages per minute from rider and restaurant apps.",
          "Migrated legacy ETL from Airflow 1.x to Airflow 2 with zero downtime, retiring 90+ unmaintained DAGs.",
          "Introduced dbt to the analytics engineering team, enabling self-service transformation for six analysts.",
        ],
      },
      {
        title: "Data Engineer",
        company: "Just Eat",
        years: "2016 - 2018",
        bullets: [
          "Developed Spark batch jobs for restaurant performance reporting reaching 50K+ restaurant partners.",
          "Improved data freshness SLA from daily to hourly for key operational metrics.",
        ],
      },
      {
        title: "Python Developer",
        company: "Mu Sigma",
        years: "2014 - 2016",
        bullets: [
          "Built data processing scripts and reporting pipelines for FMCG and retail clients.",
          "Automated manual Excel-based reporting processes, saving analysts 20+ hours per week.",
        ],
      },
    ],
  },
  {
    id: "c9",
    name: "Amara Okonkwo",
    photo: "/photos/woman2.png",
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
      "Amara is a mobile engineer who has led cross-platform development at scale, shipping apps used by tens of millions of users across iOS and Android. She is an expert in React Native performance — from JS thread optimisation and Hermes engine configuration to native bridge modules and the New Architecture migration. Amara has built mobile CI/CD pipelines from scratch using Fastlane and Bitrise, introduced crash monitoring and session replay tooling, and driven significant improvements in app store ratings through systematic performance and stability work. She brings genuine full-stack mobile depth: she can write Swift when a native module is the right answer and has contributed to the open-source React Native community through bug reports, reproductions, and patches. She leads with data and rarely makes architectural decisions without first establishing clear metrics to validate the outcome.",
    experience: [
      {
        title: "Lead Mobile Engineer",
        company: "Wise",
        years: "2020 - 2024",
        bullets: [
          "Owned React Native codebase with 10M+ MAU across iOS and Android.",
          "Reduced app crash rate by 60% through systematic error boundary and monitoring work.",
          "Led New Architecture migration, improving JS thread performance by 35% and eliminating bridge bottlenecks.",
          "Built mobile CI/CD pipeline with Fastlane and Bitrise, reducing release cycle from two weeks to three days.",
        ],
      },
      {
        title: "Senior Mobile Engineer",
        company: "Intercom",
        years: "2018 - 2020",
        bullets: [
          "Developed React Native SDK embedded in 3,000+ customer apps, handling in-app messaging and support flows.",
          "Implemented background sync and push notification delivery with 99.5% reliability.",
          "Co-designed the SDK's public API, deprecating breaking changes gracefully across a two-version support window.",
        ],
      },
      {
        title: "Mobile Developer",
        company: "Paystack",
        years: "2016 - 2018",
        bullets: [
          "Built the consumer-facing payments app from zero to 500K downloads in its first year.",
          "Integrated with native biometric authentication on both iOS and Android ahead of schedule.",
        ],
      },
      {
        title: "iOS Developer",
        company: "Andela",
        years: "2015 - 2016",
        bullets: [
          "Developed Swift features for client applications across healthcare and logistics verticals.",
          "Completed Andela's intensive engineering programme, finishing in the top 5% of the cohort.",
        ],
      },
    ],
  },
];
