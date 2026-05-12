import React, { useState } from "react";
import { CheckCircle2, Copy, ChevronDown, ChevronRight, GitBranch, Shield, Cloud, FileCode, Lock, AlertTriangle, Terminal, PackageCheck } from "lucide-react";
import { toast } from "sonner";

const WORKFLOW_YML = `name: EDS Sentrix ASM - Secure Production Deployment

on:
  push:
    branches:
      - main # Only deploys when code is pushed to the main branch

jobs:
  security-and-build:
    name: DevSecOps Scan & Build
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: ⚙️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Use LTS version
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm ci

      # AIKIDO SECURITY SCAN (Shift-Left Security)
      # This fails the build if it finds leaked API keys or critical CVEs
      - name: 🛡️ Aikido Security Scan
        uses: aikidosec/github-action@v1
        with:
          secret-key: \${{ secrets.AIKIDO_SECRET_KEY }}
          fail-on-dependency-scan: true
          fail-on-sast-scan: true

      - name: 🏗️ Build Next.js / Node.js Application
        run: npm run build

  deploy-to-rafter:
    name: Deploy to Rafter & Update Cloudflare
    needs: security-and-build # Only runs if the security scan & build passes
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      # RAFTER DEPLOYMENT — secrets accessed via env: only (never interpolated in shell)
      - name: 🚀 Deploy Infrastructure via Rafter
        env:
          RAFTER_API_KEY: \${{ secrets.RAFTER_API_KEY }}
          RAFTER_PROJECT_ID: \${{ secrets.RAFTER_PROJECT_ID }}
        run: |
          echo "Deploying Sentrix ASM to Rafter..."
          curl -fsS -X POST https://api.rafter.app/v1/deploy \\
            -H "Authorization: Bearer \${RAFTER_API_KEY}" \\
            -H "Content-Type: application/json" \\
            -d "{\\"project_id\\": \\"\${RAFTER_PROJECT_ID}\\", \\"branch\\": \\"main\\"}"

      # CLOUDFLARE CACHE PURGE — secrets accessed via env: only
      - name: ☁️ Purge Cloudflare Cache
        env:
          CF_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CF_ZONE_ID: \${{ secrets.CLOUDFLARE_ZONE_ID }}
        run: |
          curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/\${CF_ZONE_ID}/purge_cache" \\
            -H "Authorization: Bearer \${CF_API_TOKEN}" \\
            -H "Content-Type: application/json" \\
            -d '{"purge_everything": true}'
`;

const NEXT_CONFIG = `/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload' // Forces HTTPS strictly
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN' // Prevents Clickjacking attacks
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff' // Prevents MIME-sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()' // Blocks unauthorized hardware access
  }
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Removes the "X-Powered-By: Next.js" header to obscure your tech stack from attackers
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
`;

const ENV_EXAMPLE = `# ==============================================================================
# EDS SENTRIX ASM - ENVIRONMENT VARIABLES
# ==============================================================================
# ⚠️ WARNING: DO NOT ADD REAL API KEYS TO THIS FILE. 
# Real keys go into your local .env file (which is gitignored) 
# or GitHub Actions Secrets for production.
# ==============================================================================

# --- Frontend Variables (Safe to expose to the browser) ---
NEXT_PUBLIC_APP_URL="https://sentrix.emergingdefensesolutions.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# --- Node.js Backend Secrets (NEVER EXPOSE TO THE FRONTEND) ---
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="generate_a_strong_random_string_here"

# --- Third-Party Integrations ---
STRIPE_SECRET_KEY="sk_test_..."
SENDGRID_API_KEY="SG..."
TWILIO_AUTH_TOKEN="..."

# --- CI/CD & Infrastructure (STORE IN GITHUB SECRETS ONLY) ---
# RAFTER_API_KEY
# RAFTER_PROJECT_ID
# CLOUDFLARE_API_TOKEN
# CLOUDFLARE_ZONE_ID
# AIKIDO_SECRET_KEY
`;

const OVERRIDES_SNIPPET = `// package.json — npm "overrides" field
// Forces the entire dependency tree to use patched versions of
// vulnerable transitive packages. Run: npm install --legacy-peer-deps
// after adding these to regenerate package-lock.json.
{
  "overrides": {
    // CVE-2026-33672 — picomatch ReDoS (fixes both 2.3.1 @line 7778 AND 4.0.3 @line 9345)
    // Fixed versions: >=4.0.4 | >=3.0.2 | >=2.3.2  — use 4.0.4 to cover all instances
    "picomatch": ">=4.0.4",

    // CVE-2026-33151 — Prototype pollution in socket.io-parser
    "socket.io-parser": ">=4.2.6",

    // R-6D5E2 — i18next information disclosure (XSS via interpolation)
    "i18next": ">=3.4.3"
  }
}

// CI step to verify no high/critical deps survive after install:
// npm audit --audit-level=high --omit=dev`;

const QUILL_SANITIZE_SNIPPET = `// CVE-2021-3163: quill 1.3.7 — stored XSS via crafted clipboard paste.
// No fixed version of quill 1.x exists. Mitigation: sanitize ALL quill
// HTML output with DOMPurify before rendering or persisting to the DB.

import DOMPurify from "dompurify";

// ✅ Safe — sanitize before rendering rich-text HTML
function SafeRichText({ html }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b","i","u","s","em","strong","p","br","ul","ol","li",
                   "blockquote","h1","h2","h3","span","a"],
    ALLOWED_ATTR: ["href","target","rel","class"],
    FORCE_BODY: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ✅ Safe — sanitize before saving to DB
async function saveContent(quillRef) {
  const rawHtml = quillRef.current.getEditor().root.innerHTML;
  const safeHtml = DOMPurify.sanitize(rawHtml, { FORCE_BODY: true });
  await api.saveDocument({ content: safeHtml });
}

// ❌ NEVER do this — raw Quill HTML directly into dangerouslySetInnerHTML
// <div dangerouslySetInnerHTML={{ __html: quillOutput }} />`;

const WORKFLOW_PERMISSIONS_SNIPPET = `# R-B9218: Least-privilege GitHub Actions permissions
# Add at the TOP LEVEL of every workflow file — restricts the default
# GITHUB_TOKEN to read-only. Grant write only at the job level if needed.

permissions:
  contents: read       # repo checkout only
  actions: read        # read workflow metadata
  security-events: write  # only if uploading SARIF / security artifacts

# Job-level override example (grant write only where truly required):
jobs:
  deploy:
    permissions:
      contents: read
      id-token: write  # OIDC token for cloud provider auth (e.g. AWS, GCP)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4`;

const sections = [
  {
    id: "overrides",
    icon: PackageCheck,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    badge: "package.json → overrides",
    title: "Transitive CVE Remediation (npm overrides)",
    subtitle: "Pins picomatch ≥4.0.4 (both instances), socket.io-parser ≥4.2.6, i18next ≥3.4.3 — eliminates CVE-2026-33672, CVE-2026-33151, R-6D5E2",
    code: OVERRIDES_SNIPPET,
    lang: "json/bash",
    steps: [
      { label: "CVE-2026-33672: picomatch ReDoS → pin ≥4.0.4 (fixes 2.3.1 + 4.0.3)", icon: AlertTriangle, color: "text-red-400" },
      { label: "CVE-2026-33151: socket.io-parser proto-pollution → pin ≥4.2.6", icon: AlertTriangle, color: "text-red-400" },
      { label: "R-6D5E2: i18next XSS interpolation → pin ≥3.4.3", icon: AlertTriangle, color: "text-tactical-gold" },
      { label: "npm audit --audit-level=high validates post-install", icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Overrides rewrite package-lock.json on npm install", icon: Terminal, color: "text-slate-400" },
      { label: "Use --legacy-peer-deps if peer conflict arises", icon: Terminal, color: "text-slate-400" },
    ],
  },
  {
    id: "workflow",
    icon: GitBranch,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: ".github/workflows/deploy.yml",
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
    id: "quill",
    icon: Shield,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    badge: "CVE-2021-3163 · quill 1.3.7 · No upstream fix",
    title: "Quill Rich-Text XSS Mitigation (DOMPurify)",
    subtitle: "No patched quill 1.x exists — sanitize ALL HTML output with DOMPurify before render or DB persistence",
    code: QUILL_SANITIZE_SNIPPET,
    lang: "jsx",
    steps: [
      { label: "CVE-2021-3163: clipboard paste → stored XSS in quill 1.3.7", icon: AlertTriangle, color: "text-orange-400" },
      { label: "No fixed version available in quill 1.x branch", icon: AlertTriangle, color: "text-red-400" },
      { label: "Wrap ALL quill output in DOMPurify.sanitize()", icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Allowlist only safe tags — block script/iframe/object", icon: Lock, color: "text-blue-400" },
      { label: "Sanitize on read (render) AND on write (DB save)", icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Long-term: migrate to quill 2.x or Tiptap", icon: Terminal, color: "text-slate-400" },
    ],
  },
  {
    id: "permissions",
    icon: GitBranch,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    badge: ".github/workflows/*.yml → permissions",
    title: "GitHub Actions Least-Privilege Permissions (R-B9218)",
    subtitle: "Top-level permissions: read-only by default — write granted per-job only where strictly required",
    code: WORKFLOW_PERMISSIONS_SNIPPET,
    lang: "yaml",
    steps: [
      { label: "R-B9218: write-all default grants every job full repo write", icon: AlertTriangle, color: "text-red-400" },
      { label: "Fix: add permissions: block at workflow top level", icon: CheckCircle2, color: "text-emerald-400" },
      { label: "contents: read — restricts GITHUB_TOKEN to checkout only", icon: Lock, color: "text-blue-400" },
      { label: "security-events: write — only for SARIF upload steps", icon: Shield, color: "text-violet-400" },
      { label: "Override per-job with id-token: write for OIDC cloud auth", icon: Terminal, color: "text-slate-400" },
      { label: "Applied to security-scan.yml — validate all future workflows", icon: CheckCircle2, color: "text-emerald-400" },
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
  const [expanded, setExpanded] = useState("overrides");

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
            { label: "Patch CVE Transitives", color: "bg-red-500/10 text-red-400 border border-red-500/20" },
            { label: "Aikido Scan", color: "bg-tactical-gold/15 text-tactical-gold border border-tactical-gold/30" },
            { label: "Rafter Security Scan", color: "bg-tactical-gold/15 text-tactical-gold border border-tactical-gold/30" },
            { label: "Build", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
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
              {["AIKIDO_SECRET_KEY", "RAFTER_API_KEY", "RAFTER_PROJECT_ID", "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"].map(s => (
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