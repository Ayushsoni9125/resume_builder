// Template 5: Creative Designer — Colorful sidebar, icon-heavy
export default function CreativeDesigner({ data }) {
  const color = data.themeColor || '#6C47FF';
  const p = data.personalInfo || {};

  const lighten = (hex, amount = 0.9) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.round(Math.min(255, (num >> 16) + (255 - (num >> 16)) * amount));
    const g = Math.round(Math.min(255, ((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
    const b = Math.round(Math.min(255, (num & 0xff) + (255 - (num & 0xff)) * amount));
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="resume-page flex" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Left sidebar */}
      <div className="w-[32%] min-h-full text-white p-6 space-y-5 flex flex-col"
        style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)` }}>
        {/* Profile circle */}
        <div className="flex flex-col items-center text-center pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="w-20 h-20 rounded-full border-4 border-white/40 flex items-center justify-center text-[24pt] font-bold mb-3 bg-white/10">
            {(p.fullName || 'U').charAt(0)}
          </div>
          <h1 className="text-[13pt] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
          {data.experience?.[0]?.role && (
            <p className="text-[8.5pt] mt-1 opacity-80">{data.experience[0].role}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[8pt] uppercase tracking-widest font-bold opacity-60 mb-2">Contact</h2>
          <div className="space-y-1.5 text-[8.5pt]">
            {p.email && <div className="flex items-start gap-1.5"><span>✉</span><span className="break-all">{p.email}</span></div>}
            {p.phone && <div className="flex items-center gap-1.5"><span>☎</span><span>{p.phone}</span></div>}
            {p.location && <div className="flex items-center gap-1.5"><span>📍</span><span>{p.location}</span></div>}
            {p.linkedin && <div className="flex items-start gap-1.5"><span>in</span><span className="break-all opacity-80">{p.linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '')}</span></div>}
            {p.github && <div className="flex items-start gap-1.5"><span>⚡</span><span className="break-all opacity-80">{p.github.replace('https://github.com/', '')}</span></div>}
            {p.portfolio && <div className="flex items-start gap-1.5"><span>🌐</span><span className="break-all opacity-80">{p.portfolio.replace('https://', '')}</span></div>}
          </div>
        </div>

        {/* Skills */}
        {data.skills?.technical?.length > 0 && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest font-bold opacity-60 mb-2">Technical Skills</h2>
            <div className="space-y-1.5">
              {data.skills.technical.slice(0, 12).map((skill, i) => (
                <div key={skill}>
                  <div className="flex justify-between text-[8pt] mb-0.5">
                    <span>{skill}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white/70" style={{ width: `${Math.max(60, 100 - i * 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {data.skills?.soft?.length > 0 && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest font-bold opacity-60 mb-2">Soft Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.soft.map(s => (
                <span key={s} className="text-[7.5pt] bg-white/20 px-1.5 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest font-bold opacity-60 mb-2">Certifications</h2>
            {data.certifications.map((c, i) => (
              <div key={i} className="text-[8pt] mb-1">
                <p className="font-semibold">★ {c.name}</p>
                <p className="opacity-70">{c.organization}{c.date ? ` · ${c.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-6 space-y-5">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-[11pt] font-bold mb-1" style={{ color }}>About Me</h2>
            <div className="h-0.5 rounded mb-2" style={{ backgroundColor: color, width: '40px' }} />
            <p className="text-[9pt] text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold mb-1" style={{ color }}>Work Experience</h2>
            <div className="h-0.5 rounded mb-3" style={{ backgroundColor: color, width: '40px' }} />
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 mt-1 shrink-0" style={{ borderColor: color, backgroundColor: lighten(color) }} />
                    {i < data.experience.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: lighten(color, 0.5) }} />}
                  </div>
                  <div className="pb-3">
                    <div className="flex justify-between items-start">
                      <p className="text-[10pt] font-bold text-gray-900">{exp.role}</p>
                      <span className="text-[8pt] text-gray-500 ml-2 shrink-0">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-[9pt] font-semibold mb-1" style={{ color }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    {exp.description && <p className="text-[8.5pt] text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold mb-1" style={{ color }}>Education</h2>
            <div className="h-0.5 rounded mb-2" style={{ backgroundColor: color, width: '40px' }} />
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start mb-2 p-2 rounded-lg" style={{ backgroundColor: lighten(color) }}>
                <div>
                  <p className="text-[10pt] font-bold text-gray-900">{edu.degree}</p>
                  <p className="text-[9pt] font-semibold" style={{ color }}>{edu.institution}</p>
                  {edu.gpa && <p className="text-[8.5pt] text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-[8pt] text-gray-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold mb-1" style={{ color }}>Projects</h2>
            <div className="h-0.5 rounded mb-2" style={{ backgroundColor: color, width: '40px' }} />
            <div className="grid grid-cols-1 gap-2">
              {data.projects.map((proj, i) => (
                <div key={i} className="p-2.5 rounded-lg border" style={{ borderColor: `${color}40`, backgroundColor: lighten(color) }}>
                  <div className="flex justify-between items-start">
                    <p className="text-[10pt] font-bold text-gray-900">{proj.name}</p>
                    <div className="text-[7.5pt]" style={{ color }}>
                      {proj.githubLink && <span>GitHub </span>}
                      {proj.liveDemo && <span>· Demo</span>}
                    </div>
                  </div>
                  {proj.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-1">
                      {proj.techStack.map(t => (
                        <span key={t} className="text-[7.5pt] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="text-[8.5pt] text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {data.achievements?.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold mb-1" style={{ color }}>Achievements</h2>
            <div className="h-0.5 rounded mb-2" style={{ backgroundColor: color, width: '40px' }} />
            <div className="flex flex-wrap gap-2">
              {data.achievements.map((a, i) => (
                <span key={i} className="text-[8.5pt] px-2.5 py-1 rounded-full border text-gray-700"
                  style={{ borderColor: `${color}60`, backgroundColor: lighten(color) }}>
                  🏆 {a}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
