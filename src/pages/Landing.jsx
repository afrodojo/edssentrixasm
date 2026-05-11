import React, { useRef, useState } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import PartnersBanner from "../components/landing/PartnersBanner";
import FeaturesSection from "../components/landing/FeaturesSection";
import TrustSection from "../components/landing/TrustSection";
import WaitlistSection from "../components/landing/WaitlistSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  const heroRef = useRef(null);
  const waitlistRef = useRef(null);

  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToWaitlist = () => waitlistRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter overflow-x-hidden">
      <Navbar onJoinBeta={scrollToHero} />
      <div ref={heroRef}>
        <HeroSection onScrollToWaitlist={scrollToWaitlist} />
      </div>
      <PartnersBanner />
      <FeaturesSection />
      <TrustSection />
      <div ref={waitlistRef}>
        <WaitlistSection />
      </div>
      <LandingFooter />
    </div>
  );
}