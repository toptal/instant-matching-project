import ToptalLogo from "./ToptalLogo";
import IndicatorContainer from "./IndicatorContainer";
import VideoSnippet from "./VideoSnippet";
import ChatInput from "./ChatInput";

export default function MatchingWorkspace() {
  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F0F2F5" }}>

      {/* Logo — top-left of page, outside card */}
      <div className="absolute top-6 left-6 z-10">
        <ToptalLogo />
      </div>

      {/* Centered card — full page height */}
      <div className="flex justify-center" style={{ minHeight: "100vh", padding: "16px 0" }}>
        <div
          className="relative bg-white rounded-2xl overflow-hidden"
          style={{
            width: 648,
            minHeight: "calc(100vh - 32px)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          }}
        >
          {/* LeftContainer — scrollable thread + fixed input */}
          <div
            className="absolute inset-y-0 left-0 flex flex-col"
            style={{ width: "100%" }}
          >
            {/* Heading */}
            <div className="shrink-0 px-6 pt-8 pb-4 bg-white z-10">
              <h1
                className="font-bold leading-tight mb-2"
                style={{ fontSize: 26, color: "#1a1a2e", letterSpacing: "-0.3px" }}
              >
                Java Script Back-end Developer
              </h1>
              <IndicatorContainer activePhase={1} label="Draft Requirements" />
            </div>

            {/* Scrollable thread */}
            <div className="flex-1 overflow-y-auto px-6">
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

            {/* Fixed-to-bottom input */}
            <div
              className="shrink-0 px-6 pb-6 pt-3"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 24%)",
              }}
            >
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
