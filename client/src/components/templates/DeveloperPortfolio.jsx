// Template 3: Developer Portfolio — Dark header, code-inspired
export default function DeveloperPortfolio({ data }) {
  const color = data.themeColor || '#6C47FF';
  const p = data.personalInfo || {};

  return (
    <div className="resume-page bg-white" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      {/* Dark header */}
      <div className="p-7 text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[8pt] mb-1" style={{ color }}>{'<developer>'}</div>
            <h1 className="text-[22pt] font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
              {p.fullName || 'Your Name'}
            </h1>
            {data.experience?.[0]?.role && (
              <p className="text-[10pt] text-gray-400 mt-0.5">{data.experience[0].role}</p>
            )}
            <div className="text-[8pt] mt-1" style={{ color }}>{'</developer>'}</div>
          </div>
          <div className="text-right text-[8pt] text-gray-400 space-y-0.5 mt-2">
            {p.email && <p>$ echo {p.email}</p>}
            {p.phone && <p>$ call {p.phone}</p>}
            {p.location && <p>$ locate {p.location}</p>}
            {p.github && (
              <p>
                $ git:{' '}
                <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color }}>
                  {p.github.replace('https://github.com/', '')}
                </a>
              </p>
            )}
            {p.linkedin && (
              <p>
                $ in:{' '}
                <a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                  {p.linkedin.replace('https://www.linkedin.com/in/', '')}
                </a>
              </p>
            )}
            {p.portfolio && (
              <p>
                $ web:{' '}
                <a href={p.portfolio.startsWith('http') ? p.portfolio : `https://${p.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color }}>
                  {p.portfolio.replace('https://', '')}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Skills bar */}
        {data.skills?.technical?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[8pt] text-gray-500 mb-2">// tech_stack</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.technical.map(s => (
                <span key={s} className="text-[8pt] px-2 py-0.5 rounded" style={{ backgroundColor: `${color}25`, color }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-7 space-y-5 text-gray-800 text-[9pt]">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-2" style={{ color }}>
              // about_me
            </h2>
            <p className="leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-3" style={{ color }}>
              // work_experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="border-l-2 pl-4" style={{ borderColor: color }}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[10pt] text-gray-900">{exp.role}</p>
                    <span className="text-[8pt] text-gray-500">{exp.startDate} → {exp.endDate || 'now'}</span>
                  </div>
                  <p className="font-semibold text-[8.5pt] mb-1" style={{ color }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  {exp.description && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-3" style={{ color }}>
              // projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    <div className="text-[8pt] text-gray-500">
                      {proj.githubLink && (
                        <a href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          github
                        </a>
                      )}
                      {proj.githubLink && proj.liveDemo && <span> · </span>}
                      {proj.liveDemo && (
                        <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color }}>
                          live
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.techStack?.length > 0 && (
                    <p className="text-[8pt] mb-1" style={{ color }}>[{proj.techStack.join(', ')}]</p>
                  )}
                  {proj.description && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-2" style={{ color }}>// education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-[9.5pt]">{edu.degree}</p>
                  <p style={{ color }}>{edu.institution}</p>
                  <p className="text-gray-500">{edu.startDate} – {edu.endDate}{edu.gpa ? ` · ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </section>
          )}

          {/* Soft skills + certs */}
          <div className="space-y-3">
            {data.skills?.soft?.length > 0 && (
              <section>
                <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-2" style={{ color }}>// soft_skills</h2>
                <p className="text-gray-700">{data.skills.soft.join(' · ')}</p>
              </section>
            )}
            {data.certifications?.length > 0 && (
              <section>
                <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-2" style={{ color }}>// certs</h2>
                {data.certifications.map((c, i) => (
                  <p key={i} className="text-[8.5pt] text-gray-700">{c.name}</p>
                ))}
              </section>
            )}
            {data.achievements?.length > 0 && (
              <section>
                <h2 className="text-[8pt] tracking-widest uppercase font-bold mb-2" style={{ color }}>// wins</h2>
                {data.achievements.map((a, i) => <p key={i} className="text-[8.5pt] text-gray-700">★ {a}</p>)}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
