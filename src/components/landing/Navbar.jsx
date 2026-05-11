import React, { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ onJoinBeta }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://media.base44.com/images/public/6a01a7f0046386899eee80d5/483e87ca1_1778520471105.png"
              alt="EDS Sentrix ASM"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#trust" className="hover:text-white transition-colors">Security</a>
              <a href="#waitlist" className="hover:text-white transition-colors">Beta Access</a>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/app"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                App Demo
              </Link>
              <button
                onClick={onJoinBeta}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
              >
                Join the Beta
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/98 backdrop-blur-md border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#trust" className="block text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>Security</a>
            <a href="#waitlist" className="block text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>Beta Access</a>
            <button
              onClick={() => { onJoinBeta(); setMenuOpen(false); }}
              className="w-full px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-all"
            >
              Join the Beta
            </button>
          </div>
        </div>
      )}
    </header>
  );
}