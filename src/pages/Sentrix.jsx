import React from "react";
import SentrixHero from "../components/sentrix/SentrixHero";
import SentrixTrustBar from "../components/sentrix/SentrixTrustBar";
import SentrixPillars from "../components/sentrix/SentrixPillars";
import SentrixProShop from "../components/sentrix/SentrixProShop";
import SentrixWaitlist from "../components/sentrix/SentrixWaitlist";

export default function Sentrix() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter overflow-x-hidden">
      <SentrixHero />
      <SentrixTrustBar />
      <SentrixPillars />
      <SentrixProShop />
      <SentrixWaitlist />
    </div>
  );
}