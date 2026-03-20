import ToptalLogo from "./ToptalLogo";
import IndicatorContainer from "./IndicatorContainer";
import VideoSnippet from "./VideoSnippet";
import ChatInput from "./ChatInput";
import SidePanel from "./SidePanel";

export default function MatchingWorkspace() {
  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F0F2F5" }}>

      {/* Logo — top-left of page, outside card */}
      <div className="absolute top-6 left-6 z-10">
        <ToptalLogo />
      </div>

      {/* Centered card — full page height */}
      <div className="flex justify-center items-start" style={{ minHeight: "100vh", padding: "16px 0" }}>
        {/* Card: 1024px wide, fixed height, 24px padding all around, flex row with 16px gap */}
        <div
          className="bg-white rounded-2xl"
          style={{
            width: 1024,
            height: "calc(100vh - 32px)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
            display: "flex",
            flexDirection: "row",
            padding: 24,
            gap: 16,
          }}
        >
          {/* Left — 600px fixed */}
          <div
            style={{
              flex: "0 0 600px",
              width: 600,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Heading */}
            <div className="shrink-0 pb-4">
              <h1
                className="font-bold leading-tight mb-2"
                style={{ fontSize: 26, color: "#1a1a2e", letterSpacing: "-0.3px" }}
              >
                Java Script Back-end Developer
              </h1>
              <IndicatorContainer activePhase={1} label="Draft Requirements" />
            </div>

            {/* Scrollable thread */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 pb-4">
                <p className="font-semibold text-[16px]" style={{ color: "#1a1a2e" }}>
                  Welcome to your Matching Workspace.
                </p>
                <p className="text-[14px] leading-[1.6]" style={{ color: "#455065" }}>
                  In this short video we are explaining your next steps and the purpose of this
                  workspace. Please watch the video to continue.
                </p>
                <VideoSnippet />
              </div>
            </div>

            {/* Input pinned to bottom */}
            <div
              className="shrink-0 pt-3"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 24%)",
              }}
            >
              <ChatInput />
            </div>
          </div>

          {/* Right — 360px fixed, full height via stretch */}
          <div style={{ flex: "0 0 360px", width: 360 }}>
            <SidePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
