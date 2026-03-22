"use client";

import { useState } from "react";
import MatcherCard from "./MatcherCard";
import NavRow from "./NavRow";
import MatcherTooltip from "./MatcherTooltip";
import JobDetailsPanel from "./JobDetailsPanel";
import CandidatesPanel from "./CandidatesPanel";

type ActivePanel = "default" | "job-details" | "candidates";

const Separator = () => (
  <div style={{ height: 1, background: "#EBECED" }} />
);

export default function SidePanel() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("default");
  const [showTooltip, setShowTooltip] = useState(true);

  const translateX =
    activePanel === "default"
      ? "translateX(0)"
      : activePanel === "job-details"
      ? "translateX(-33.333%)"
      : "translateX(-66.666%)";

  return (
    <div className="relative h-full">
      {/* Matcher tooltip — floats to the left of the sidebar */}
      {showTooltip && (
        <div
          className="absolute z-20"
          style={{ right: "calc(100% + 0px)", top: 180 }}
        >
          <MatcherTooltip
            onDismiss={() => setShowTooltip(false)}
            onAccept={() => setShowTooltip(false)}
          />
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          background: "#FCFCFC",
          border: "1px solid #EBECED",
        }}
      >
        {/* Sliding container — 3 panels wide */}
        <div
          style={{
            display: "flex",
            width: "300%",
            height: "100%",
            transform: translateX,
            transition: "transform 0.3s ease",
          }}
        >
          {/* Panel 1: Default */}
          <div
            style={{
              width: "33.333%",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div className="px-5 py-4 shrink-0">
              <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
                Your Matcher
              </span>
            </div>
            <Separator />
            <div className="p-5 shrink-0">
              <MatcherCard />
            </div>
            <Separator />
            <div className="flex flex-col">
              <NavRow
                label="Job Details"
                badge="Updated"
                onClick={() => setActivePanel("job-details")}
              />
              <Separator />
              <NavRow
                label="Candidates"
                onClick={() => setActivePanel("candidates")}
              />
              <Separator />
            </div>
          </div>

          {/* Panel 2: Job Details */}
          <div
            style={{
              width: "33.333%",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <JobDetailsPanel onBack={() => setActivePanel("default")} />
          </div>

          {/* Panel 3: Candidates */}
          <div
            style={{
              width: "33.333%",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <CandidatesPanel onBack={() => setActivePanel("default")} />
          </div>
        </div>
      </div>
    </div>
  );
}
