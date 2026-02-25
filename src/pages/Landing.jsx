import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const APPS = [
  {
    id: 'calculator',
    name: '8-Minute Calculator',
    glyph: '⌬',
    description: 'Medicare billing units under the CMS 8-Minute Rule',
    path: '/calculator',
    accent: '#38bdf8',
    accentDim: 'rgba(56,189,248,0.08)',
    accentBorder: 'rgba(56,189,248,0.2)',
  },
  {
    id: 'notes',
    name: 'Note Templates',
    glyph: '≡',
    description: 'PT documentation templates, one click to clipboard',
    path: '/notes',
    accent: '#a78bfa',
    accentDim: 'rgba(167,139,250,0.08)',
    accentBorder: 'rgba(167,139,250,0.2)',
  },
]

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.2 + 0.4,
      hue: Math.random() > 0.5 ? '167, 139, 250' : '56, 189, 248',
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.12 * (1 - dist / 130)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.hue}, 0.5)`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .app-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .app-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56,189,248,0.45) !important;
          box-shadow: 0 8px 40px rgba(56,189,248,0.1) !important;
        }
      `}</style>

      <ParticleCanvas />

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '100px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.7s ease-out both', marginBottom: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: '#4c1d95', textTransform: 'uppercase', marginBottom: 16, animation: 'subtlePulse 4s ease-in-out infinite' }}>
            arcanarium.me
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.15,
          }}>
            The Arcanarium
          </h1>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0 18px', width: '100%', maxWidth: 400, animation: 'fadeIn 0.7s 0.1s ease-out both' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.25))' }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4c1d95' }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(167,139,250,0.25))' }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: 14,
          color: '#475569',
          textAlign: 'center',
          margin: '0 0 64px',
          letterSpacing: '0.02em',
          animation: 'fadeIn 0.7s 0.2s ease-out both',
          maxWidth: 340,
          lineHeight: 1.6,
        }}>
          A collection of tools built for the work that actually matters.
        </p>

        {/* App grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          width: '100%',
          animation: 'fadeIn 0.7s 0.35s ease-out both',
        }}>
          {APPS.map((app) => (
            <Link to={app.path} key={app.id}>
              <div
                className="app-card"
                style={{
                  width: 220,
                  background: `linear-gradient(145deg, rgba(13,17,28,0.95), ${app.accentDim})`,
                  border: `1px solid ${app.accentBorder}`,
                  borderRadius: 16,
                  padding: '28px 22px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 30, color: app.accent, marginBottom: 14, opacity: 0.9 }}>
                  {app.glyph}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.04em', marginBottom: 8 }}>
                  {app.name}
                </div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                  {app.description}
                </div>
                <div style={{ marginTop: 18, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', color: app.accent, opacity: 0.6, textTransform: 'uppercase' }}>
                  Open →
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder */}
          <div style={{
            width: 220,
            background: 'rgba(255,255,255,0.01)',
            border: '1px dashed rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: '28px 22px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.06)' }}>+</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.08)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
              MORE SOON
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 80, fontSize: 10, color: '#1e293b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
          ARCANARIUM · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
