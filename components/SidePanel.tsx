"use client";

import { useState } from "react";
import MatcherCard from "./MatcherCard";
import NavRow from "./NavRow";
import MatcherTooltip from "./MatcherTooltip";

const Separator = () => (
  <div style={{ height: 1, background: "#EBECED" }} />
);

export default function SidePanel() {
  const [showTooltip, setShowTooltip] = useState(true);

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
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          background: "#FCFCFC",
          border: "1px solid #EBECED",
        }}
      >
        {/* Matcher section */}
        <div className="px-5 py-4">
          <span className="text-[14px] font-semibold" style={{ color: "#455065" }}>
            Your Matcher
          </span>
        </div>

        <Separator />

        <div className="p-5">
          <MatcherCard />
        </div>

        <Separator />

        {/* Navigation rows */}
        <div className="flex flex-col">
          <NavRow label="Job Details" badge="Updated" />
          <Separator />
          <NavRow label="Candidates" disabled />
          <Separator />
        </div>
      </div>
    </div>
  );
}
