import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PIIMaskedField({ label, value, masked = "••••••••••••" }) {
  const [revealed, setRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pin, setPin] = useState("");

  const handleReveal = () => {
    if (!revealed) {
      setConfirming(true);
    } else {
      setRevealed(false);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (pin.length >= 4) {
      setRevealed(true);
      setConfirming(false);
      setPin("");
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2 p-2.5 bg-muted/30 border border-border/60 rounded-lg group">
        <div className="flex-1 text-sm font-mono">
          {revealed ? (
            <span className="text-foreground">{value}</span>
          ) : (
            <span className="text-muted-foreground blur-[3px] select-none">{masked}</span>
          )}
        </div>
        <button
          onClick={handleReveal}
          title={revealed ? "Hide PII" : "Click and re-authenticate to reveal PII"}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md bg-tactical-gold/10 border border-tactical-gold/25 text-tactical-gold hover:bg-tactical-gold/20 transition-all shrink-0"
        >
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {revealed ? "Hide" : "Reveal PII"}
        </button>
      </div>

      {/* Re-auth modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-6 w-80">
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-tactical-gold/10 border border-tactical-gold/25 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-tactical-gold" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-foreground">Re-authenticate to View PII</h3>
                <p className="text-xs text-muted-foreground mt-1">Enter your PIN to reveal <span className="font-semibold text-foreground">{label}</span></p>
              </div>
            </div>
            <form onSubmit={handleConfirm} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                placeholder="Enter PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
                className="w-full h-11 px-4 bg-muted/40 border border-border rounded-xl text-foreground placeholder-muted-foreground text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-tactical-gold/40"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setConfirming(false); setPin(""); }}
                  className="flex-1 h-10 text-sm font-semibold border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 text-sm font-bold bg-tactical-gold hover:bg-tactical-amber text-navy-900 rounded-xl transition-colors"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}