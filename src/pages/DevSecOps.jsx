import React, { useState } from "react";
import { CheckCircle2, Copy, ChevronDown, ChevronRight, GitBranch, Shield, Cloud, FileCode, Lock, AlertTriangle, Terminal } from "lucide-react";
import { toast } from "sonner";

const WORKFLOW_YML = `name: EDS Sentrix ASM — CI/CD Pipeline

on:
  push:
    branches:
      - main

env:
  NODE_VERSION: "20"

jobs:
  build-scan-deploy:
    name: Build · Scan · Deploy
    runs-on: ubuntu-latest

    steps:
      # ─── Step 1: Checkout & Environment Setup ─────────────────────────────
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history required for secret scanning

      - name: Setup Node.js \${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: "npm"

      # ─── Step 2: Install Dependencies ─────────────────────────────────────
      - name: Install Dependencies
        run: npm ci --prefer-offline

      # ─── Step 3: DevSecOps — Aikido Security Scan ─────────────────────────
      # CRITICAL: Build FAILS on any critical vulnerability or detected secret.
      # Configure your Aikido workspace at https://app.aikido.dev
      - name: Aikido Security Scan (SAST + Secret Scanning)
        uses: AikidoSec/github-actions-workflow@v1.0.13
        with:
          secret-key: \${{ secrets.AIKIDO_SECRET_KEY }}
          fail-on-critical-or-above: true   # Blocks deployment on critical CVEs
          fail-on-timeout: true
          minimum-severity: CRITICAL         # SAST threshold
          scan-secrets: true                 # Detect hardcoded keys / tokens
          scan-dependencies: true            # SCA — known CVEs in node_modules

      # ─── Step 4: Next.js Production Build ─────────────────────────────────
      - name: Build Next.js Application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_ENV: production
          NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN: \${{ secrets.CF_BEACON_TOKEN }}

      # ─── Step 5: Rafter Deployment ─────────────────────────────────────────
      # Rafter handles infrastructure orchestration & edge deployments.
      # Docs: https://rafter.app/docs
      - name: Deploy via Rafter CLI
        run: |
          npm install -g @rafter/cli
          rafter deploy \\
            --project eds-sentrix-asm \\
            --environment production \\
            --token \${{ secrets.RAFTER_API_KEY }} \\
            --confirm
        env:
          RAFTER_API_KEY: \${{ secrets.RAFTER_API_KEY }}

      # ─── Step 6: Cloudflare Cache Purge ────────────────────────────────────
      # Purges all cached assets on Cloudflare edge after every successful deploy.
      - name: Purge Cloudflare Edge Cache
        run: |
          curl -s -X POST "https://api.cloudflare.com/client/v4/zones/\${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \\
            -H "Authorization: Bearer \${{ secrets.CLOUDFLARE_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            --data '{"purge_everything": true}' | tee cf_response.json
          # Fail the step if Cloudflare reports an error
          grep -q '"success":true' cf_response.json || (echo "Cloudflare cache purge FAILED" && cat cf_response.json && exit 1)

      # ─── Post-Deploy: Notify ────────────────────────────────────────────────
      - name: Deployment Summary
        if: success()
        run: |
          echo "✅ EDS Sentrix ASM deployed successfully to production."
          echo "🔒 Aikido scan passed — no critical vulnerabilities."
          echo "🌐 Cloudflare cache purged."
`;

const NEXT_CONFIG = `/** @type {import('next').NextConfig} */

// ─── Security Headers — NIST SP 800-53 / Zero Trust Aligned ──────────────────
const securityHeaders = [
  {
    // Prevent clickjacking (NIST AC-4)
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Block MIME-type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Force HTTPS for 2 years — includeSubDomains + preload (NIST SC-8)
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Restrict referrer info on cross-origin requests
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable browser features not needed by the app (NIST CM-7)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Content Security Policy — strict allowlist (NIST SI-10)
    // Adjust 'connect-src' if you add new API origins
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://media.base44.com https://images.unsplash.com",
      "connect-src 'self' https://api.emergingdefensesolutions.com https://cloudflareinsights.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  // ── Strict mode for React (catches side-effect bugs early)
  reactStrictMode: true,

  // ── Disable x-powered-by header (information disclosure prevention)
  poweredByHeader: false,

  // ── Cloudflare Proxy: trust X-Forwarded-* headers from CF edge
  // IMPORTANT: Only set this if you are behind Cloudflare or a trusted proxy.
  // Exposing this without a proxy allows IP spoofing.
  experimental: {
    serverActions: {
      allowedOrigins: ["emergingdefensesolutions.com", "*.emergingdefensesolutions.com"],
    },
  },

  // ── Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Redirect all HTTP → HTTPS (belt-and-suspenders with Cloudflare)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://emergingdefensesolutions.com/:path*",
        permanent: true,
      },
    ];
  },

  // ── Image optimization — restrict allowed remote domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.base44.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // ── Output: standalone bundle for containerized / Rafter deployment
  output: "standalone",
};

module.exports = nextConfig;
`;

const ENV_EXAMPLE = `# ════════════════════════════════════════════════════════════════════════════
# EDS Sentrix ASM — Environment Variables Reference
# ════════════════════════════════════════════════════════════════════════════
#
# ⚠️  SECURITY RULES:
#     1. NEVER commit real values for keys marked [SECRET] to this file or
#        any other file tracked by Git.
#     2. All [SECRET] values MUST live in GitHub Actions Secrets, Rafter's
#        encrypted environment store, or an Azure Key Vault reference.
#     3. Only NEXT_PUBLIC_* variables are safe to expose to the browser.
#        All others are server-side only.
#     4. Rotate all secrets immediately if any are accidentally committed.
#
# ════════════════════════════════════════════════════════════════════════════


# ── Application ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_ENV=development              # development | staging | production
NEXT_PUBLIC_APP_URL=http://localhost:3000


# ── Cloudflare (Public Beacon — safe to expose) ──────────────────────────────
NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN=your_cf_beacon_token_here

# [SECRET] Cloudflare API Token — Purge Cache permission only
# Store in: GitHub Actions → Settings → Secrets → CLOUDFLARE_API_TOKEN
CLOUDFLARE_API_TOKEN=

# [SECRET] Cloudflare Zone ID for emergingdefensesolutions.com
# Store in: GitHub Actions → Settings → Secrets → CLOUDFLARE_ZONE_ID
CLOUDFLARE_ZONE_ID=


# ── Rafter Deployment ────────────────────────────────────────────────────────
# [SECRET] Rafter API Key — full deploy access
# Store in: GitHub Actions → Settings → Secrets → RAFTER_API_KEY
RAFTER_API_KEY=


# ── Aikido Security ──────────────────────────────────────────────────────────
# [SECRET] Aikido Secret Key for CI scans
# Store in: GitHub Actions → Settings → Secrets → AIKIDO_SECRET_KEY
AIKIDO_SECRET_KEY=


# ── Database (Server-side ONLY — never expose publicly) ──────────────────────
# [SECRET] PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/sentrix_dev


# ── Authentication / Azure Identity ─────────────────────────────────────────
# [SECRET] Azure AD / Entra ID credentials for Zero Trust auth
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
NEXTAUTH_SECRET=generate_with__openssl_rand_-base64_32
NEXTAUTH_URL=http://localhost:3000


# ── Payments (Stripe) ────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
# [SECRET] Stripe Secret Key — server-side billing operations ONLY
STRIPE_SECRET_KEY=
# [SECRET] Stripe Webhook Signing Secret
STRIPE_WEBHOOK_SECRET=


# ── Notifications ────────────────────────────────────────────────────────────
# [SECRET] Twilio credentials for SMS dispatch alerts
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# [SECRET] SendGrid API Key for transactional email
SENDGRID_API_KEY=


# ════════════════════════════════════════════════════════════════════════════
# REMINDER: Add this file to .gitignore for your actual .env.local file.
# Only .env.example (with blank secret values) should ever be committed.
# ════════════════════════════════════════════════════════════════════════════
`;

const sections = [
  {
    id: "workflow",
    icon: GitBranch,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: ".github/workflows/main.yml",
    title: "GitHub Actions CI/CD Workflow",
    subtitle: "6-step pipeline: Checkout → Install → Aikido Scan → Build → Rafter Deploy → CF Cache Purge",
    code: WORKFLOW_YML,
    lang: "yaml",
    steps: [
      { label: "Code Checkout & Node Setup", icon: Terminal, color: "text-slate-400" },
      { label: "npm ci (clean install)", icon: Terminal, color: "text-slate-400" },
      { label: "Aikido SAST + Secret Scan", icon: AlertTriangle, color: "text-tactical-gold" },
      { label: "Next.js Production Build", icon: FileCode, color: "text-blue-400" },
      { label: "Rafter Deploy (RAFTER_API_KEY)", icon: Cloud, color: "text-violet-400" },
      { label: "Cloudflare Cache Purge", icon: Shield, color: "text-emerald-400" },
    ],
  },
  {
    id: "nextconfig",
    icon: FileCode,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "next.config.js",
    title: "Secure Next.js Configuration",
    subtitle: "CSP, HSTS, X-Frame-Options, MIME sniff protection, Cloudflare proxy headers — NIST / Zero Trust aligned",
    code: NEXT_CONFIG,
    lang: "javascript",
    steps: [
      { label: "Content-Security-Policy (NIST SI-10)", icon: Lock, color: "text-blue-400" },
      { label: "Strict-Transport-Security (NIST SC-8)", icon: Lock, color: "text-blue-400" },
      { label: "X-Frame-Options: DENY (NIST AC-4)", icon: Lock, color: "text-blue-400" },
      { label: "Cloudflare Trusted Proxy Setup", icon: Cloud, color: "text-emerald-400" },
      { label: "Standalone output for Rafter containers", icon: Terminal, color: "text-violet-400" },
    ],
  },
  {
    id: "env",
    icon: Lock,
    color: "text-tactical-gold",
    bg: "bg-tactical-gold/10 border-tactical-gold/20",
    badge: ".env.example",
    title: "Environment Variables Guide",
    subtitle: "Safe reference file — all secrets marked [SECRET] must live in GitHub Actions Secrets or Azure Key Vault only",
    code: ENV_EXAMPLE,
    lang: "bash",
    steps: [
      { label: "NEXT_PUBLIC_* vars (browser-safe only)", icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Cloudflare API Token & Zone ID", icon: Cloud, color: "text-emerald-400" },
      { label: "Stripe publishable vs secret split", icon: Lock, color: "text-tactical-gold" },
      { label: "Azure AD / Entra ID Zero Trust creds", icon: Shield, color: "text-blue-400" },
      { label: "Twilio + SendGrid for dispatch alerts", icon: Terminal, color: "text-slate-400" },
    ],
  },
];

function CodeBlock({ code, lang, id }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-navy-700/60 bg-navy-950 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-navy-900/80 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-tactical-red/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-tactical-gold/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-[10px] font-mono text-slate-500">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-400 hover:text-white text-xs font-medium transition-all"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-[11px] leading-relaxed text-slate-300 font-mono max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DevSecOps() {
  const [expanded, setExpanded] = useState("workflow");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">DevSecOps & CI/CD Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            GitHub Actions · Aikido SAST · Rafter Deploy · Cloudflare Cache Purge
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          NIST SP 800-53 Aligned
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="bg-card border border-border/60 rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Pipeline Flow</p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Push to main", color: "bg-slate-700 text-slate-200" },
            { label: "Checkout + Node", color: "bg-navy-800 text-slate-300 border border-navy-700" },
            { label: "npm ci", color: "bg-navy-800 text-slate-300 border border-navy-700" },
            { label: "Aikido Scan", color: "bg-tactical-gold/15 text-tactical-gold border border-tactical-gold/30" },
            { label: "Next.js Build", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
            { label: "Rafter Deploy", color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
            { label: "CF Cache Purge", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.color}`}>{s.label}</span>
              {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Secrets reference */}
      <div className="bg-tactical-gold/5 border border-tactical-gold/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-tactical-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-tactical-gold">Required GitHub Actions Secrets</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Add these in your repo → Settings → Secrets and variables → Actions. Never hardcode these values.
            </p>
            <div className="flex flex-wrap gap-2">
              {["AIKIDO_SECRET_KEY", "RAFTER_API_KEY", "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID", "CF_BEACON_TOKEN"].map(s => (
                <code key={s} className="px-2 py-1 bg-navy-800 border border-navy-700 rounded-md text-[10px] font-mono text-tactical-gold">
                  {s}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const isOpen = expanded === sec.id;
          return (
            <div key={sec.id} className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpanded(isOpen ? null : sec.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl border ${sec.bg} flex items-center justify-center shrink-0`}>
                  <sec.icon className={`w-5 h-5 ${sec.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{sec.badge}</code>
                  </div>
                  <p className="font-bold text-foreground text-sm">{sec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{sec.subtitle}</p>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-border/40">
                  {/* Step summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                    {sec.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <step.icon className={`w-3.5 h-3.5 ${step.color} shrink-0`} />
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                  <CodeBlock code={sec.code} lang={sec.lang} id={sec.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}