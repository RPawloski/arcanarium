import { Link } from 'react-router-dom'

const APPS = [
  {
    id: 'calculator',
    name: '8-Minute Calculator',
    glyph: '⌬',
    description: 'Medicare billing units, precisely conjured',
    path: '/calculator',
    accent: '#38bdf8',
    accentDim: 'rgba(56,189,248,0.12)',
    accentBorder: 'rgba(56,189,248,0.25)',
  },
]

// Deterministic star field — positions are fixed so no flicker on re-render
const STARS = Array.from({ length: 120 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  return {
    top: ((seed / 233280) * 100).toFixed(2),
    left: (((seed * 7) % 233280) / 233280 * 100).toFixed(2),
    size: i % 5 === 0 ? 2 : 1,
    opacity: (0.2 + ((seed % 60) / 60) * 0.6).toFixed(2),
    duration: (4 + (i % 6)).toFixed(1),
    delay: ((i * 0.3) % 6).toFixed(1),
  }
})

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateSlowReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .app-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .app-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
        .orb-glyph {
          transition: text-shadow 0.25s ease;
        }
        .app-card:hover .orb-glyph {
          text-shadow: 0 0 24px currentColor;
        }
      `}</style>

      {/* Star field */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: '#fff',
              '--op': s.opacity,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '80px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>

        {/* Sigil / rotating rings */}
        <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 40, animation: 'floatUp 6s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(167,139,250,0.3)', animation: 'rotateSlow 20s linear infinite' }}>
            <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
          </div>
          <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px dashed rgba(56,189,248,0.25)', animation: 'rotateSlowReverse 14s linear infinite' }}>
            <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
          </div>
          <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1px solid rgba(251,191,36,0.2)', animation: 'rotateSlow 30s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#a78bfa', textShadow: '0 0 20px rgba(167,139,250,0.8)' }}>✦</div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.8s ease-out both', marginBottom: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', color: '#6d40d9', textTransform: 'uppercase', marginBottom: 14 }}>
            ◈ &nbsp; welcome to &nbsp; ◈
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #a78bfa 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
          }}>
            The Arcanarium
          </h1>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 14px', animation: 'fadeIn 0.8s 0.15s ease-out both', width: '100%', maxWidth: 460 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.3))' }} />
          <span style={{ color: '#4c1d95', fontSize: 14 }}>⬡</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(167,139,250,0.3))' }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: '#64748b',
          letterSpacing: '0.04em',
          textAlign: 'center',
          margin: '0 0 72px',
          fontStyle: 'italic',
          animation: 'fadeIn 0.8s 0.25s ease-out both',
        }}>
          A repository of digital instruments, forged at the intersection of logic and magic.
        </p>

        {/* App wheel */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          justifyContent: 'center',
          width: '100%',
          animation: 'fadeIn 0.8s 0.4s ease-out both',
        }}>
          {APPS.map((app) => (
            <Link to={app.path} key={app.id}>
              <div
                className="app-card"
                style={{
                  width: 240,
                  background: `linear-gradient(135deg, rgba(15,18,30,0.9), ${app.accentDim})`,
                  border: `1px solid ${app.accentBorder}`,
                  borderRadius: 20,
                  padding: '32px 24px 28px',
                  cursor: 'pointer',
                  boxShadow: `0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  textAlign: 'center',
                }}
              >
                <div
                  className="orb-glyph"
                  style={{
                    fontSize: 36,
                    color: app.accent,
                    marginBottom: 16,
                    display: 'block',
                    textShadow: `0 0 12px ${app.accent}66`,
                  }}
                >
                  {app.glyph}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.05em', marginBottom: 8 }}>
                  {app.name}
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {app.description}
                </div>
                <div style={{ marginTop: 20, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', color: app.accent, opacity: 0.7, textTransform: 'uppercase' }}>
                  Enter →
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder — future apps */}
          <div style={{
            width: 240,
            background: 'rgba(255,255,255,0.01)',
            border: '1px dashed rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '32px 24px 28px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.08)' }}>◈</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.1)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
              FORTHCOMING
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 80, fontSize: 11, color: '#1e293b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textAlign: 'center' }}>
          ARCANARIUM &nbsp;·&nbsp; arcanarium.me
        </div>
      </div>
    </div>
  )
}
