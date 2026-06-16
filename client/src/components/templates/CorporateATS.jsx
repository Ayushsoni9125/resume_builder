// Template 4: Corporate ATS-Friendly — Plain, single-column, no graphics
export default function CorporateATS({ data }) {
  const p = data.personalInfo || {};

  const Divider = () => <div className="w-full h-px bg-black my-1" />;

  const Section = ({ title, children }) => (
    <section className="mb-4">
      <h2 className="text-[10pt] font-bold uppercase text-black tracking-wide">{title}</h2>
      <Divider />
      {children}
    </section>
  );

  return (
    <div className="resume-page bg-white p-8 text-black" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-[18pt] font-bold uppercase tracking-wider">
          {p.fullName || 'YOUR NAME'}
        </h1>
        <div className="text-[9pt] mt-1 space-y-0.5">
          <p>
            {[p.email, p.phone, p.location].filter(Boolean).join(' | ')}
          </p>
          <p>
            {[p.linkedin, p.github, p.portfolio].filter(Boolean).map(u => u.replace('https://', '')).join(' | ')}
          </p>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <Section title="Professional Summary">
          <p className="text-[9.5pt] leading-relaxed">{data.summary}</p>
        </Section>
      )}

      {/* Skills */}
      {(data.skills?.technical?.length > 0 || data.skills?.soft?.length > 0) && (
        <Section title="Core Competencies">
          {data.skills?.technical?.length > 0 && (
            <p className="text-[9pt] mb-1"><strong>Technical Skills:</strong> {data.skills.technical.join(' | ')}</p>
          )}
          {data.skills?.soft?.length > 0 && (
            <p className="text-[9pt]"><strong>Soft Skills:</strong> {data.skills.soft.join(' | ')}</p>
          )}
        </Section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <Section title="Professional Experience">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <strong className="text-[10pt]">{exp.role}</strong>
                <span className="text-[9pt]">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9.5pt]">{exp.company}</span>
                {exp.location && <span className="text-[9pt]">{exp.location}</span>}
              </div>
              {exp.description && (
                <p className="text-[9pt] mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-1.5">
              <div>
                <strong className="text-[10pt]">{edu.degree}</strong>
                <br />
                <span className="text-[9.5pt]">{edu.institution}</span>
                {edu.gpa && <span className="text-[9pt]"> | GPA: {edu.gpa}</span>}
              </div>
              <span className="text-[9pt]">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <strong className="text-[10pt]">{proj.name}</strong>
              {proj.techStack?.length > 0 && <span className="text-[9pt]"> | {proj.techStack.join(', ')}</span>}
              {proj.description && <p className="text-[9pt] mt-0.5 leading-relaxed whitespace-pre-line">{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((c, i) => (
            <p key={i} className="text-[9pt] mb-0.5">
              {c.name} — {c.organization}{c.date ? `, ${c.date}` : ''}
            </p>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <Section title="Achievements">
          <ul className="text-[9pt] space-y-0.5">
            {data.achievements.map((a, i) => <li key={i}>• {a}</li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
