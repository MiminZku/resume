import { useState, useEffect } from 'react'
import resumeData from './data/resumeData.json'

// Target SHA-256 Hash provided by user
const ADMIN_HASH = '5421e9ff1712278b3df88c08937bc8f0b1d272b2a22abd869e9cfa565f092e14'

const TAB_CONFIG = {
  all: { label: '🌐 전체 마스터', title: 'Software Engineer (AI Backend / Cloud / Systems)' },
  ai: { label: '🤖 AI 서비스 / 백엔드', title: 'AI Service & Backend Engineer' },
  security: { label: '🛡️ 보안 솔루션 엔지니어', title: 'Security Solution & Tech Engineer' },
  cloud: { label: '☁️ 클라우드 엔지니어', title: 'Cloud & Infrastructure Engineer' },
}

// SHA-256 hash helper using Web Crypto API
async function computeSha256(text) {
  const buffer = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase()
}

export default function App() {
  const [activeTab, setActiveTab] = useState('all')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')

  const { basicInfo, summaries, techStack, experience, education, certifications, awards } = resumeData

  // Check initial authentication and #edit hash
  useEffect(() => {
    const storedAuth = localStorage.getItem('resume_admin_auth') === 'true'
    if (storedAuth) {
      setIsAdmin(true)
    }

    const checkHash = () => {
      if (window.location.hash.toLowerCase().includes('edit')) {
        setShowAuthModal(true)
        setPasswordInput('')
        setAuthError('')
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  // Handle password submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    if (!passwordInput.trim()) return

    try {
      const hashedInput = await computeSha256(passwordInput.trim())
      if (hashedInput === ADMIN_HASH.toLowerCase()) {
        setIsAdmin(true)
        localStorage.setItem('resume_admin_auth', 'true')
        setShowAuthModal(false)
        setPasswordInput('')
        setAuthError('')
        // Clean up #edit from URL bar cleanly
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      } else {
        setAuthError('비밀번호가 일치하지 않습니다.')
      }
    } catch (err) {
      setAuthError('인증 중 오류가 발생했습니다.')
    }
  }

  // Handle logout (switch back to visitor view)
  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('resume_admin_auth')
  }

  // Active tab settings
  const currentSummary = summaries[activeTab] || summaries.all
  const currentRoleTitle = TAB_CONFIG[activeTab]?.title || basicInfo.role

  // Re-order projects by priority for the active tab
  const sortedProjects = [...resumeData.projects].sort((a, b) => {
    const pA = a.priority?.[activeTab] ?? 99
    const pB = b.priority?.[activeTab] ?? 99
    return pA - pB
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="resume-container">
      {/* Password Authentication Modal (Triggered by /#edit) */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔒 관리자 인증</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAuthModal(false)}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <p className="modal-desc">
              이력서 관리 기능(직무 탭 전환, A4 PDF 인쇄, 데이터 편집)에 접근하려면 비밀번호를 입력하세요.
            </p>
            <form onSubmit={handleAuthSubmit}>
              <input
                type="password"
                className="modal-input"
                placeholder="비밀번호 입력"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setAuthError('')
                }}
                autoFocus
              />
              {authError && <div className="modal-error">{authError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowAuthModal(false)}
                >
                  취소
                </button>
                <button type="submit" className="modal-submit-btn">
                  인증하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screen Only Control Bar (ONLY visible to Admin) */}
      {isAdmin && (
        <header className="control-bar">
          <div className="tab-group" role="tablist" aria-label="직무 선택">
            {Object.entries(TAB_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {config.label}
              </button>
            ))}
          </div>

          <div className="action-group">
            <button
              type="button"
              className="action-btn btn-print"
              onClick={handlePrint}
              title="현재 탭 상태로 A4 PDF 저장"
            >
              📄 PDF 인쇄 / 저장
            </button>
            <a
              href={basicInfo.repoEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn btn-edit"
              title="GitHub 웹 에디터에서 JSON 직접 수정"
            >
              ✏️ 데이터 수정
            </a>
            <button
              type="button"
              className="action-btn btn-logout"
              onClick={handleLogout}
              title="일반 방문자 뷰로 전환"
            >
              🔓 관리자 끄기
            </button>
          </div>
        </header>
      )}

      {/* Printable Resume Paper */}
      <main className="resume-paper">
        {/* Header Section */}
        <header className="resume-header">
          <div className="header-top">
            <div className="name-block">
              <h1>
                {basicInfo.name}{' '}
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#64748b' }}>
                  ({basicInfo.nameEn})
                </span>
              </h1>
              <div className="role-title">{currentRoleTitle}</div>
            </div>
            <div className="contact-block">
              <div>
                📧 <a href={`mailto:${basicInfo.email}`}>{basicInfo.email}</a>
              </div>
              <div>📱 {basicInfo.phone}</div>
              <div>
                🐙{' '}
                <a href={basicInfo.github} target="_blank" rel="noopener noreferrer">
                  GitHub 프로필
                </a>
              </div>
              <div>
                📑{' '}
                <a href={basicInfo.portfolio} target="_blank" rel="noopener noreferrer">
                  Notion 포트폴리오
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="resume-section">
          <h2 className="section-title">
            About Me
            {isAdmin && (
              <span className="badge-tag">
                {TAB_CONFIG[activeTab]?.label.replace(/^[^\s]+\s/, '')} 맞춤 요약
              </span>
            )}
          </h2>
          <p className="summary-text">{currentSummary}</p>
        </section>

        {/* Tech Stack */}
        <section className="resume-section">
          <h2 className="section-title">Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-label">Languages</div>
            <div className="tech-tags">
              {techStack.languages.map((item, i) => (
                <span key={i} className="tag">
                  {item}
                </span>
              ))}
            </div>

            <div className="tech-label">Backend & Cloud</div>
            <div className="tech-tags">
              {techStack.backendCloud.map((item, i) => (
                <span key={i} className="tag">
                  {item}
                </span>
              ))}
            </div>

            <div className="tech-label">Systems & AI</div>
            <div className="tech-tags">
              {techStack.systemsAI.map((item, i) => (
                <span key={i} className="tag">
                  {item}
                </span>
              ))}
            </div>

            <div className="tech-label">Tools & VCS</div>
            <div className="tech-tags">
              {techStack.tools.map((item, i) => (
                <span key={i} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Work Experience (Displayed higher if Security tab) */}
        {activeTab === 'security' && (
          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>
            {experience.map((exp, idx) => (
              <article key={idx} className="timeline-block">
                <div className="timeline-item">
                  <div>
                    <span className="item-main">{exp.company}</span>
                    <span className="item-role">{exp.position}</span>
                  </div>
                  <span className="item-period">{exp.period}</span>
                </div>
                <ul className="timeline-subtext">
                  {exp.descriptions.map((desc, dIdx) => (
                    <li key={dIdx}>{desc}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}

        {/* Projects */}
        <section className="resume-section">
          <h2 className="section-title">
            Key Projects
            {isAdmin && <span className="badge-tag">우선순위 자동 정렬됨</span>}
          </h2>

          {sortedProjects.map((proj) => (
            <article key={proj.id} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{proj.title}</h3>
                <span className="project-period">{proj.period}</span>
              </div>
              <div className="project-subtitle">{proj.subTitle}</div>

              <div className="project-meta">
                <span>
                  역할: <strong className="project-role">{proj.role}</strong>
                </span>
              </div>

              <div className="project-tags">
                {proj.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <ul className="project-highlights">
                {proj.highlights.map((item, hIdx) => (
                  <li key={hIdx}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* Work Experience (Default position for other tabs) */}
        {activeTab !== 'security' && (
          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>
            {experience.map((exp, idx) => (
              <article key={idx} className="timeline-block">
                <div className="timeline-item">
                  <div>
                    <span className="item-main">{exp.company}</span>
                    <span className="item-role">{exp.position}</span>
                  </div>
                  <span className="item-period">{exp.period}</span>
                </div>
                <ul className="timeline-subtext">
                  {exp.descriptions.map((desc, dIdx) => (
                    <li key={dIdx}>{desc}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}

        {/* Dual Grid: Education & Certifications */}
        <div className="dual-grid">
          {/* Education */}
          <section className="resume-section">
            <h2 className="section-title">Education & Training</h2>
            <ul className="simple-list">
              {education.map((edu, idx) => (
                <li key={idx}>
                  <div>
                    <div className="title">{edu.institution}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{edu.program}</div>
                  </div>
                  <span className="date">{edu.period}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Certifications & Awards */}
          <section className="resume-section">
            <h2 className="section-title">Certificates & Awards</h2>
            <ul className="simple-list">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <div>
                    <div className="title">{cert.name}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{cert.issuer}</div>
                  </div>
                  <span className="date">{cert.date}</span>
                </li>
              ))}
              {awards.map((award, idx) => (
                <li key={idx}>
                  <div className="title">{award.title}</div>
                  <span className="date">{award.date}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="resume-footer">
          <p>© 2026 강민기. Built with React & Vite. Deployed with GitHub Pages.</p>
        </footer>
      </main>
    </div>
  )
}
