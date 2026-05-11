import React, { useState, useEffect, useCallback } from "react";
import { Clock, ShieldCheck, LogOut } from "lucide-react";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE = 60; // seconds before timeout

export default function SessionTimeoutModal() {
  const [secondsLeft, setSecondsLeft] = useState(WARNING_BEFORE);
  const [visible, setVisible] = useState(false);

  const resetTimer = useCallback(() => {
    setVisible(false);
    setSecondsLeft(WARNING_BEFORE);
  }, []);

  useEffect(() => {
    let idleTimer;
    let countdownInterval;

    const startIdleTimer = () => {
      clearTimeout(idleTimer);
      clearInterval(countdownInterval);
      setVisible(false);
      setSecondsLeft(WARNING_BEFORE);

      idleTimer = setTimeout(() => {
        setVisible(true);
        let secs = WARNING_BEFORE;
        countdownInterval = setInterval(() => {
          secs -= 1;
          setSecondsLeft(secs);
          if (secs <= 0) {
            clearInterval(countdownInterval);
            window.location.href = "/login";
          }
        }, 1000);
      }, IDLE_TIMEOUT);
    };

    // For demo/dev: show modal after 30s of no interaction
    const DEMO_DELAY = 30 * 1000;
    const demoTimer = setTimeout(() => {
      setVisible(true);
      let secs = WARNING_BEFORE;
      countdownInterval = setInterval(() => {
        secs -= 1;
        setSecondsLeft(secs);
        if (secs <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
    }, DEMO_DELAY);

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, startIdleTimer));

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(demoTimer);
      clearInterval(countdownInterval);
      events.forEach(e => window.removeEventListener(e, startIdleTimer));
    };
  }, []);

  if (!visible) return null;

  const pct = (secondsLeft / WARNING_BEFORE) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted w-full">
          <div
            className="h-full bg-tactical-gold transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center gap-3 text-center mb-6">
            <div className="w-14 h-14 bg-tactical-gold/10 border border-tactical-gold/25 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-tactical-gold" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Session Expiring</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Due to inactivity, your secure session will expire in
              </p>
              <p className="text-4xl font-black text-tactical-gold mt-2">{secondsLeft}s</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              EDS Sentrix ASM enforces Zero Trust session controls. Click below to extend your session.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = "/login"}
              className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-semibold border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button
              onClick={resetTimer}
              className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-bold bg-tactical-gold hover:bg-tactical-amber text-navy-900 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Extend Session
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-muted/20 border-t border-border/40 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-muted-foreground">Secured via Cloudflare Zero Trust &amp; Azure Identity</span>
        </div>
      </div>
    </div>
  );
}