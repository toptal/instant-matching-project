interface Props {
  label: string;
  disabled?: boolean;
  badge?: string;
}

export default function NavRow({ label, disabled, badge }: Props) {
  const color = disabled ? "#C2C8D0" : "#1a1a2e";
  return (
    <button
      className="flex items-center justify-between w-full px-5 py-4 text-left cursor-default"
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold" style={{ color }}>
          {label}
        </span>
        {badge && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ background: "#E6F9F2", color: "#03B080" }}
          >
            {badge}
          </span>
        )}
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
