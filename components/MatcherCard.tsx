export default function MatcherCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #c8c2bc 0%, #b0a89e 60%, #9e9088 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 100,
            height: 150,
            borderRadius: "50% 50% 0 0",
            background: "rgba(170,155,142,0.5)",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        {/* Name + status overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
          }}
        >
          <p className="text-white font-semibold text-[14px] leading-tight">Steven Kovacel</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#03B080] shrink-0" />
            <span className="text-white text-[12px]">Monitoring your activity</span>
          </div>
        </div>
      </div>

      {/* Call / Chat buttons */}
      <div className="flex gap-2">
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold bg-white"
          style={{ border: "1.5px solid #EBECED", color: "#455065" }}
        >
          <PhoneIcon />
          Call
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold bg-white"
          style={{ border: "1.5px solid #EBECED", color: "#455065" }}
        >
          <ChatIcon />
          Chat
        </button>
      </div>

      {/* Description box — light blue background */}
      <div
        className="rounded-xl p-3.5 text-[13px] leading-[1.6]"
        style={{ background: "#EEF2FF", color: "#455065" }}
      >
        <p>Steven Kovacel is our matching expert. He can join to:</p>
        <ul className="mt-1.5 flex flex-col gap-0.5">
          {[
            "refine or formulate your requirements",
            "help with right matches",
            "help with interview preparation",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-[#455065]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2">If you need him just call or have a chat.</p>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M13 9.667l-2.333-.267a1 1 0 00-.834.267l-1.666 1.666A10.04 10.04 0 012.667 5.833l1.666-1.666a1 1 0 00.267-.834L4.333 1a1 1 0 00-1-.967H1.333A1 1 0 00.333 1.1C.333 8.1 5.9 13.667 12.9 13.667A1 1 0 0014 12.667V11a1 1 0 00-.967-1l-.033-.333z"
        fill="#455065"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12.333 1H1.667C.933 1 .333 1.6.333 2.333v8.334C.333 11.4.933 12 1.667 12h2v2l3.333-2h5.333C13.067 12 13.667 11.4 13.667 10.667V2.333C13.667 1.6 13.067 1 12.333 1z"
        stroke="#455065"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
