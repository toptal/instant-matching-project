interface Props {
  onBack: () => void;
}

const Separator = () => <div style={{ height: 1, background: "#EBECED" }} />;

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8l4 4" stroke="#455065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function JobDetailsPanel({ onBack }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button onClick={onBack} className="flex items-center justify-center">
          <BackIcon />
        </button>
        <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
          Job Details
        </span>
      </div>

      <Separator />

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 text-[14px] leading-[22px]"
        style={{ color: "#455065" }}
      >
        <p className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>About the job</p>
        <p className="mb-3">
          We are looking for a skilled Front-End Developer to join our team and help create
          engaging, responsive, and high-performance web applications. You should be proficient
          in modern front-end technologies, passionate about delivering excellent user
          experiences, and able to collaborate effectively with designers and back-end developers.
        </p>

        <p className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Key Requirements:</p>
        <ul className="list-none flex flex-col gap-0.5 mb-3">
          {[
            "Expertise in HTML, CSS, JavaScript, and frameworks like React or Vue.js.",
            "Experience with responsive design and cross-browser compatibility.",
            "Familiarity with RESTful APIs and integrating front-end with back-end systems.",
            "Knowledge of version control systems like Git.",
            "Eye for detail and commitment to clean, maintainable code.",
          ].map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <p className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Nice to Have:</p>
        <ul className="list-none flex flex-col gap-0.5 mb-3">
          {[
            "Experience with design tools like Figma or Sketch.",
            "Understanding of accessibility standards (WCAG).",
            "Basic knowledge of back-end technologies for collaboration.",
          ].map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <p>
          This is an exciting opportunity to contribute to projects with real impact and grow in
          a dynamic team environment. Let&apos;s create amazing digital experiences together!
        </p>
      </div>
    </div>
  );
}
