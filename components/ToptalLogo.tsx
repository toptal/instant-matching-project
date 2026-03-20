export default function ToptalLogo() {
  return (
    <div className="flex items-center gap-1.5">
      {/* Diamond icon */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1L19 7.5L10 19L1 7.5L10 1Z" fill="#204ECF" />
        <path d="M10 1L14.5 7.5L10 19L5.5 7.5L10 1Z" fill="#3B6FE8" />
      </svg>
      <span className="text-[17px] font-semibold text-[#1a1a2e] tracking-tight">Toptal.</span>
    </div>
  );
}
