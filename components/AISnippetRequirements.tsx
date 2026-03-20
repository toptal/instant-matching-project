function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="9" rx="1" stroke="#84888e" strokeWidth="1.2" />
      <path d="M3 11V3a1 1 0 011-1h6" stroke="#84888e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function AISnippetRequirements() {
  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden w-full"
      style={{
        background: "#F3F4F6",
        border: "1px solid #EBECED",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <span className="text-[13px] leading-[20px]" style={{ color: "#84888e" }}>
          Job Details
        </span>
        <CopyIcon />
      </div>

      {/* Content — fixed height, scrollable */}
      <div className="flex overflow-hidden" style={{ height: 320 }}>
        <div
          className="flex-1 overflow-y-auto text-[14px] leading-[22px] px-4 pb-4"
          style={{ color: "#455065" }}
        >
          <p className="font-semibold mb-1">About the job</p>
          <p className="mb-3">
            We are looking for a skilled Front-End Developer to join our team and help create
            engaging, responsive, and high-performance web applications. You should be proficient
            in modern front-end technologies, passionate about delivering excellent user
            experiences, and able to collaborate effectively with designers and back-end developers.
          </p>

          <p className="font-semibold mb-1">Key Requirements:</p>
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

          <p className="font-semibold mb-1">Nice to Have:</p>
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

        {/* Scrollbar track */}
        <div
          className="shrink-0 flex items-start justify-center py-6"
          style={{
            width: 14,
            background: "#FCFCFC",
            borderLeft: "1px solid #EBECED",
          }}
        >
          <div className="rounded-full" style={{ width: 6, height: 60, background: "#C4C6CA" }} />
        </div>
      </div>
    </div>
  );
}
