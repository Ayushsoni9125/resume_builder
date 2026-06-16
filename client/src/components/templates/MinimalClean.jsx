// Template 2: Minimal Clean — Single-column, serif typography, generous whitespace
export default function MinimalClean({ data }) {
  const color = data.themeColor || '#1a1a2e';
  const p = data.personalInfo || {};

  const Section = ({ title, children }) => (
    <section className="mb-5">
      <h2 className="text-[9pt] uppercase tracking-[3px] font-bold mb-2" style={{ color }}>
        {title}
      </h2>
      <div className="w-full h-px bg-gray-200 mb-3" />
      {children}
    </section>
  );

  return (
    <div className="resume-page p-10 text-gray-800" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[22pt] font-bold tracking-wide text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        {data.experience?.[0]?.role && (
          <p className="text-[10pt] mt-1" style={{ color }}>{data.experience[0].role}</p>
        )}
        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-3 text-[8.5pt] text-gray-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <><span className="text-gray-300">|</span><span>{p.phone}</span></>}
          {p.location && <><span className="text-gray-300">|</span><span>{p.location}</span></>}
          {p.linkedin && <><span className="text-gray-300">|</span><span>{p.linkedin.replace('https://', '')}</span></>}
          {p.github && <><span className="text-gray-300">|</span><span>{p.github.replace('https://', '')}</span></>}
          {p.portfolio && <><span className="text-gray-300">|</span><span>{p.portfolio.replace('https://', '')}</span></>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <Section title="Profile">
          <p className="text-[9.5pt] leading-relaxed text-gray-700 text-center italic">{data.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <Section title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[10pt] font-bold text-gray-900">{exp.role}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="text-[9.5pt] font-semibold" style={{ color }}>{exp.company}</span>
                  {exp.location && <span className="text-[8.5pt] text-gray-500"> · {exp.location}</span>}
                </div>
                <span className="text-[8.5pt] text-gray-500 shrink-0">
                  {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                </span>
              </div>
              {exp.description && (
                <p className="text-[9pt] text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="text-[10pt] font-bold text-gray-900">{edu.degree}</span>
                <span className="text-gray-400 mx-2">·</span>
                <span className="text-[9.5pt]" style={{ color }}>{edu.institution}</span>
                {edu.gpa && <span className="text-[8.5pt] text-gray-500"> · {edu.gpa}</span>}
              </div>
              <span className="text-[8.5pt] text-gray-500 shrink-0">
                {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10pt] font-bold text-gray-900">{proj.name}</span>
                {proj.techStack?.length > 0 && (
                  <span className="text-[8pt] text-gray-500">{proj.techStack.join(', ')}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[9pt] text-gray-700 mt-0.5 leading-relaxed whitespace-pre-line">{proj.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {(data.skills?.technical?.length > 0 || data.skills?.soft?.length > 0) && (
        <Section title="Skills">
          {data.skills?.technical?.length > 0 && (
            <p className="text-[9pt] text-gray-700 mb-1">
              <strong>Technical:</strong> {data.skills.technical.join(', ')}
            </p>
          )}
          {data.skills?.soft?.length > 0 && (
            <p className="text-[9pt] text-gray-700">
              <strong>Soft Skills:</strong> {data.skills.soft.join(', ')}
            </p>
          )}
        </Section>
      )}

      {/* Certifications + Achievements inline */}
      {(data.certifications?.length > 0 || data.achievements?.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          {data.certifications?.length > 0 && (
            <Section title="Certifications">
              {data.certifications.map((c, i) => (
                <p key={i} className="text-[8.5pt] text-gray-700 mb-1">{c.name} — <em>{c.organization}</em>{c.date ? `, ${c.date}` : ''}</p>
              ))}
            </Section>
          )}
          {data.achievements?.length > 0 && (
            <Section title="Achievements">
              <ul className="space-y-1">
                {data.achievements.map((a, i) => <li key={i} className="text-[8.5pt] text-gray-700">• {a}</li>)}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
