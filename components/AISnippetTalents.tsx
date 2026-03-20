function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="#455065" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#EBECED", width: 64 }} />;
}

function SkillPill({ label }: { label: string }) {
  return (
    <div
      className="px-3 py-1.5 rounded-xl text-[12px] font-semibold leading-[12px] bg-white"
      style={{ border: "1px solid #03B080", color: "#03B080" }}
    >
      {label}
    </div>
  );
}

export default function AISnippetTalents() {
  return (
    <div className="relative" style={{ width: 600, height: 370 }}>
      {/* Card 3 — back */}
      <div
        className="absolute rounded-sm"
        style={{
          left: 61, top: 99,
          width: 478, height: 265,
          border: "1px solid #EBECED",
          boxShadow: "0 0 8px rgba(0,0,0,0.08)",
          background: "white",
        }}
      />
      {/* Card 2 — middle */}
      <div
        className="absolute rounded-sm"
        style={{
          left: 33, top: 53,
          width: 534, height: 296,
          border: "1px solid #EBECED",
          boxShadow: "0 0 8px rgba(0,0,0,0.08)",
          background: "white",
        }}
      />
      {/* Card 1 — front */}
      <div
        className="absolute flex gap-6 rounded-sm"
        style={{
          left: 0, top: 0,
          width: 600,
          border: "1px solid #EBECED",
          boxShadow: "0 0 8px rgba(0,0,0,0.08)",
          background: "white",
          padding: 24,
        }}
      >
        {/* Left — photo + name + button */}
        <div className="flex flex-col gap-3 shrink-0 bg-white" style={{ width: 150 }}>
          {/* Avatar */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ width: 150, height: 150, background: "linear-gradient(135deg, #d4cfc9 0%, #b8afa7 100%)" }}
          >
            <div
              style={{
                width: "100%", height: "100%",
                background: "radial-gradient(ellipse at 50% 30%, #c8b8ac 0%, #a8998c 50%, #907f74 100%)",
              }}
            />
          </div>
          {/* Name + role */}
          <div>
            <p className="font-semibold text-[16px] leading-[24px] text-black">Kimberly Saxton</p>
            <p className="text-[14px] leading-[22px] text-black">Frontend Developer</p>
          </div>
          {/* CTA */}
          <button
            className="w-full py-2 rounded text-[13px] font-semibold text-white text-center"
            style={{ background: "#204ECF" }}
          >
            Review Candidate
          </button>
        </div>

        {/* Right — details */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] leading-[20px] text-black">Why this might be a fit:</span>
            <div
              className="px-2 py-0.5 rounded-lg text-[12px] font-semibold leading-[18px]"
              style={{ border: "1px solid #6727CF", color: "#6727CF" }}
            >
              Auto-matched
            </div>
          </div>

          {/* Fit reasons */}
          <div className="flex flex-col gap-2">
            {[
              [<><span className="font-semibold">8 years</span> building financial platforms at scale</>],
              [<><span className="font-semibold">Led migration to microservices</span> at previous role</>],
              [<>Strong track record with <span className="font-semibold">real-time data systems</span></>],
            ].map((content, i) => (
              <div key={i} className="flex items-center gap-2">
                <ArrowRightIcon />
                <span className="text-[14px] leading-[22px] text-black">{content}</span>
              </div>
            ))}
          </div>

          <Divider />

          {/* Meta info */}
          <div className="flex flex-col gap-2 text-[13px] leading-[20px]" style={{ color: "#455065" }}>
            <span>Can start: Immediately</span>
            <span>Availability: Part Time (20 hours/week)</span>
            <span>2:55 PM Local Time</span>
          </div>

          <Divider />

          {/* Skill pills */}
          <div className="flex gap-2 flex-wrap">
            <SkillPill label="React | 4 years" />
            <SkillPill label="CSS | 4 years" />
            <SkillPill label="HTML | 4 years" />
          </div>
        </div>
      </div>
    </div>
  );
}
