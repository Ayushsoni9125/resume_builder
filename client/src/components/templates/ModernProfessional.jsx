// Template 1: Modern Professional — Two-column with colored left sidebar
export default function ModernProfessional({ data }) {
  const color = data.themeColor || '#6C47FF';
  const p = data.personalInfo || {};

  return (
    <div className="resume-page flex" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Left sidebar */}
      <div className="w-[35%] min-h-full text-white p-6 flex flex-col gap-5" style={{ backgroundColor: color }}>
        {/* Name */}
        <div>
          <h1 className="text-[18pt] font-bold leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            {p.fullName || 'Your Name'}
          </h1>
          {data.experience?.[0]?.role && (
            <p className="text-[9pt] mt-1 opacity-80">{data.experience[0].role}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[8pt] uppercase tracking-widest opacity-60 font-bold mb-2">Contact</h2>
          <div className="space-y-1 text-[8.5pt]">
            {p.email && <p>✉ {p.email}</p>}
            {p.phone && <p>📞 {p.phone}</p>}
            {p.location && <p>📍 {p.location}</p>}
            {p.linkedin && <p>🔗 {p.linkedin.replace('https://', '').replace('http://', '')}</p>}
            {p.github && <p>⚡ {p.github.replace('https://', '').replace('http://', '')}</p>}
            {p.portfolio && <p>🌐 {p.portfolio.replace('https://', '').replace('http://', '')}</p>}
          </div>
        </div>

        {/* Skills */}
        {(data.skills?.technical?.length > 0 || data.skills?.soft?.length > 0) && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest opacity-60 font-bold mb-2">Skills</h2>
            {data.skills?.technical?.length > 0 && (
              <>
                <p className="text-[7.5pt] opacity-70 mb-1">Technical</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {data.skills.technical.map(s => (
                    <span key={s} className="text-[7.5pt] bg-white/20 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </>
            )}
            {data.skills?.soft?.length > 0 && (
              <>
                <p className="text-[7.5pt] opacity-70 mb-1">Soft Skills</p>
                <div className="flex flex-wrap gap-1">
                  {data.skills.soft.map(s => (
                    <span key={s} className="text-[7.5pt] bg-white/20 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest opacity-60 font-bold mb-2">Certifications</h2>
            <div className="space-y-1.5">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-[8pt]">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="opacity-70">{cert.organization} {cert.date ? `· ${cert.date}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements?.length > 0 && (
          <div>
            <h2 className="text-[8pt] uppercase tracking-widest opacity-60 font-bold mb-2">Achievements</h2>
            <ul className="space-y-1 text-[8pt]">
              {data.achievements.map((a, i) => <li key={i}>• {a}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-6 space-y-5 text-gray-800">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-[10pt] font-bold uppercase tracking-wider mb-1.5 pb-0.5" style={{ color, borderBottom: `2px solid ${color}` }}>
              Professional Summary
            </h2>
            <p className="text-[9pt] leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-[10pt] font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color, borderBottom: `2px solid ${color}` }}>
              Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10pt] font-bold text-gray-900">{exp.role}</p>
                      <p className="text-[9pt] font-semibold" style={{ color }}>{exp.company}</p>
                    </div>
                    <span className="text-[8pt] text-gray-500 shrink-0">
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="mt-1 text-[8.5pt] leading-relaxed text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-[10pt] font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color, borderBottom: `2px solid ${color}` }}>
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-[10pt] font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-[9pt]" style={{ color }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-[8.5pt] text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[8pt] text-gray-500 shrink-0">
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-[10pt] font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color, borderBottom: `2px solid ${color}` }}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="text-[10pt] font-bold text-gray-900">{proj.name}</p>
                    <div className="text-[8pt] text-gray-500">
                      {proj.githubLink && <span>GitHub · </span>}
                      {proj.liveDemo && <span>Demo</span>}
                    </div>
                  </div>
                  {proj.techStack?.length > 0 && (
                    <p className="text-[8pt] mt-0.5" style={{ color }}>
                      {proj.techStack.join(' · ')}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-[8.5pt] text-gray-700 leading-relaxed mt-0.5 whitespace-pre-line">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
