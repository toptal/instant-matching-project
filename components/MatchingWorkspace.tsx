import ToptalLogo from "./ToptalLogo";
import IndicatorContainer from "./IndicatorContainer";
import VideoSnippet from "./VideoSnippet";
import ChatInput from "./ChatInput";
import SidePanel from "./SidePanel";
import AISnippetSteps from "./AISnippetSteps";
import AISnippetRequirements from "./AISnippetRequirements";
import AISnippetTalents from "./AISnippetTalents";

export default function MatchingWorkspace() {
  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F0F2F5" }}>

      {/* Logo — top-left of page */}
      <div className="absolute top-6 left-6 z-10">
        <ToptalLogo />
      </div>

      <div className="flex justify-center items-start" style={{ minHeight: "100vh", padding: "16px 0" }}>
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
          {/* Left — 600px */}
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

                {/* AI: welcome heading */}
                <p className="font-semibold text-[20px] leading-[30px]" style={{ color: "#455065" }}>
                  Welcome to your Matching Workspace.
                </p>

                {/* AI: intro text */}
                <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  In this short video we are explaining your next steps and the purpose of this
                  workspace. Please watch the video to continue.
                </p>

                {/* Video snippet */}
                <VideoSnippet />

                {/* AI: bullet list */}
                <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  <p className="mb-1">Here&apos;s what you&apos;ll learn from this video:</p>
                  <ul className="list-disc pl-5 flex flex-col gap-0.5">
                    <li>How to collaborate with us on defining your requirements</li>
                    <li>How we suggest initial candidate matches based on your needs</li>
                    <li>How your feedback improves future recommendations</li>
                    <li>How to communicate via text or use voice mode to discuss the details more naturally</li>
                    <li>How and when a matcher can step in for additional support</li>
                  </ul>
                </div>

                {/* AI: transition message */}
                <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  <p>Thank you for watching the video.</p>
                  <p>Here&apos;s what&apos;s coming next.</p>
                </div>

                {/* AI: steps card */}
                <AISnippetSteps />

                {/* AI: question */}
                <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  Can we jump to your requirements?
                </p>

                {/* User message */}
                <div className="flex justify-end">
                  <div
                    className="text-[14px] leading-[22px] px-4 py-2 rounded-2xl max-w-[80%]"
                    style={{ background: "#F3F4F6", color: "#1a1a2e" }}
                  >
                    Yes, let&apos;s use the voice mode
                  </div>
                </div>

                {/* AI: JD intro */}
                <p className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  Here&apos;s what we understand about your role so far.
                </p>

                {/* Job Details card */}
                <AISnippetRequirements />

                {/* AI: candidates intro */}
                <div className="text-[14px] leading-[22px]" style={{ color: "#455065" }}>
                  <p className="mb-1">Please review the three automatically matched candidates:</p>
                  <ul className="list-disc pl-5 flex flex-col gap-0.5">
                    <li>Mark each profile as Interested or Not a fit</li>
                    <li>You may already find the right match here</li>
                    <li>If not, your feedback helps us improve future recommendations or involve a matcher for a more curated selection</li>
                  </ul>
                </div>

                {/* Candidates card stack */}
                <AISnippetTalents />


              </div>
            </div>

            {/* Pinned bottom area: action buttons + input */}
            <div
              className="shrink-0 pt-3 flex flex-col gap-2"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 24%)",
              }}
            >
              <div className="flex gap-2">
                <button
                  className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                  style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
                >
                  Yes, let&apos;s use the voice mode
                </button>
                <button
                  className="rounded-full text-[13px] font-semibold leading-[20px] px-4 py-2 cursor-pointer"
                  style={{ border: "1px solid #204ECF", color: "#204ECF", background: "transparent" }}
                >
                  Yes, let&apos;s chat
                </button>
              </div>
              <ChatInput />
            </div>
          </div>

          {/* Right — 360px */}
          <div style={{ flex: "0 0 360px", width: 360 }}>
            <SidePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
