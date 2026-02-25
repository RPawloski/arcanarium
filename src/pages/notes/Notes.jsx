import { useState } from 'react'
import { TEMPLATES, CATEGORIES } from './templates'

function CopyButton({ content }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.1)',
        border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.2)'}`,
        color: copied ? '#34d399' : '#38bdf8',
        borderRadius: 6,
        padding: '5px 14px',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.08em',
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function TemplateCard({ template }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.01em' }}>
          {template.title}
        </span>
        <CopyButton content={template.content} />
      </div>
      <pre style={{
        margin: 0,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {template.content}
      </pre>
    </div>
  )
}

function CategorySection({ category, templates }) {
  const [open, setOpen] = useState(true)
  if (templates.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: '#94a3b8',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: open ? 10 : 0,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>{category.label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: '#334155', fontFamily: "'JetBrains Mono', monospace" }}>
            {templates.length}
          </span>
          <span style={{ fontSize: 12, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </span>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {templates.map(t => <TemplateCard key={t.id} template={t} />)}
        </div>
      )}
    </div>
  )
}

export default function Notes() {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const filtered = query
    ? TEMPLATES.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query)
      )
    : TEMPLATES

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #07090f 0%, #0d1120 100%)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#e2e8f0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', padding: '28px 24px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <a href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#334155', letterSpacing: '0.15em', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
            ← ARCANARIUM
          </a>
          <h1 style={{
            margin: '0 0 4px',
            fontFamily: "'Cinzel', serif",
            fontSize: 22,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.03em',
          }}>
            Note Templates
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#334155', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
            PT Documentation · Click any template to copy
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 24px 60px' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 13, color: '#334155', pointerEvents: 'none',
          }}>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '11px 14px 11px 36px',
              fontSize: 13,
              color: '#e2e8f0',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.3)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16, padding: 2, lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>

        {/* Results */}
        {query ? (
          <div>
            {filtered.length === 0 ? (
              <p style={{ color: '#334155', fontSize: 13, textAlign: 'center', marginTop: 40, fontStyle: 'italic' }}>No templates match "{search}"</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
              </div>
            )}
          </div>
        ) : (
          CATEGORIES.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              templates={filtered.filter(t => t.category === cat.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
