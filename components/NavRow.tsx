interface Props {
  label: string;
  disabled?: boolean;
}

export default function NavRow({ label, disabled }: Props) {
  return (
    <button
      className="flex items-center justify-between w-full px-5 py-4 text-left cursor-default"
      disabled={disabled}
    >
      <span className="text-[14px] font-semibold" style={{ color: "#C2C8D0" }}>
        {label}
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="#C2C8D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
