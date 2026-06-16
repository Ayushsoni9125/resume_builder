/**
 * Utility to download resume data as a styled Microsoft Word (.doc) document
 * with inline styles, proper tabular spacing, and clickable hyperlinks.
 */
export function downloadResumeAsWord(resume) {
  if (!resume) return;

  const themeColor = resume.themeColor || '#6C47FF';
  const p = resume.personalInfo || {};

  // Formats URL to be absolute
  const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  // Cleans display text for links
  const displayUrl = (url) => {
    if (!url) return '';
    return url.replace('https://', '').replace('http://', '').replace('www.', '');
  };

  // HTML content generator helper for sections
  const sections = {
    summary: () => {
      if (!resume.summary) return '';
      return `
        <h2>Summary</h2>
        <p style="margin-bottom: 12pt; text-align: justify; line-height: 1.3;">${resume.summary.replace(/\n/g, '<br/>')}</p>
      `;
    },

    experience: () => {
      if (!resume.experience || resume.experience.length === 0) return '';
      const items = resume.experience.map(exp => {
        const dateStr = [exp.startDate, exp.endDate || (exp.current ? 'Present' : '')].filter(Boolean).join(' — ');
        return `
          <table class="section-table">
            <tr>
              <td class="bold">${exp.role || 'Role'}</td>
              <td class="align-right">${dateStr}</td>
            </tr>
            <tr>
              <td class="italic" style="color: ${themeColor}; font-weight: bold;">${exp.company || ''}${exp.location ? ` · ${exp.location}` : ''}</td>
              <td></td>
            </tr>
          </table>
          ${exp.description ? `<p style="margin-bottom: 8pt; text-align: justify; line-height: 1.3;">${exp.description.replace(/\n/g, '<br/>')}</p>` : ''}
        `;
      }).join('');

      return `
        <h2>Experience</h2>
        ${items}
      `;
    },

    education: () => {
      if (!resume.education || resume.education.length === 0) return '';
      const items = resume.education.map(edu => {
        const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(' — ');
        return `
          <table class="section-table">
            <tr>
              <td class="bold">${edu.degree || 'Degree'}</td>
              <td class="align-right">${dateStr}</td>
            </tr>
            <tr>
              <td class="italic" style="color: ${themeColor}; font-weight: bold;">${edu.institution || ''}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}</td>
              <td></td>
            </tr>
          </table>
          ${edu.description ? `<p style="margin-bottom: 8pt; text-align: justify; line-height: 1.3;">${edu.description.replace(/\n/g, '<br/>')}</p>` : ''}
        `;
      }).join('');

      return `
        <h2>Education</h2>
        ${items}
      `;
    },

    projects: () => {
      if (!resume.projects || resume.projects.length === 0) return '';
      const items = resume.projects.map(proj => {
        const links = [];
        if (proj.githubLink) {
          links.push(`<a href="${formatUrl(proj.githubLink)}">GitHub</a>`);
        }
        if (proj.liveDemo) {
          links.push(`<a href="${formatUrl(proj.liveDemo)}">Demo</a>`);
        }
        const linksStr = links.length > 0 ? `(${links.join(' | ')})` : '';

        return `
          <table class="section-table">
            <tr>
              <td><span class="bold">${proj.name || 'Project Name'}</span> ${linksStr}</td>
              <td class="align-right italic" style="font-size: 9.5pt; color: #555555;">
                ${proj.techStack && proj.techStack.length > 0 ? proj.techStack.join(', ') : ''}
              </td>
            </tr>
          </table>
          ${proj.description ? `<p style="margin-bottom: 8pt; text-align: justify; line-height: 1.3;">${proj.description.replace(/\n/g, '<br/>')}</p>` : ''}
        `;
      }).join('');

      return `
        <h2>Projects</h2>
        ${items}
      `;
    },

    skills: () => {
      const hasTech = resume.skills?.technical && resume.skills.technical.length > 0;
      const hasSoft = resume.skills?.soft && resume.skills.soft.length > 0;
      if (!hasTech && !hasSoft) return '';

      return `
        <h2>Skills</h2>
        <table class="section-table" style="margin-bottom: 6pt;">
          ${hasTech ? `
            <tr>
              <td style="width: 120pt;" class="bold">Technical Skills:</td>
              <td>${resume.skills.technical.join(', ')}</td>
            </tr>
          ` : ''}
          ${hasSoft ? `
            <tr>
              <td style="width: 120pt;" class="bold">Soft Skills:</td>
              <td>${resume.skills.soft.join(', ')}</td>
            </tr>
          ` : ''}
        </table>
      `;
    },

    certifications: () => {
      if (!resume.certifications || resume.certifications.length === 0) return '';
      const items = resume.certifications.map(c => {
        const certLink = c.url ? ` · <a href="${formatUrl(c.url)}">Link</a>` : '';
        return `
          <table class="section-table">
            <tr>
              <td><span class="bold">${c.name}</span> — <i>${c.organization || ''}</i>${certLink}</td>
              <td class="align-right">${c.date || ''}</td>
            </tr>
          </table>
        `;
      }).join('');

      return `
        <h2>Certifications</h2>
        ${items}
      `;
    },

    achievements: () => {
      if (!resume.achievements || resume.achievements.length === 0) return '';
      const items = resume.achievements.map(a => `
        <li style="margin-bottom: 3pt; line-height: 1.3;">${a}</li>
      `).join('');

      return `
        <h2>Achievements</h2>
        <ul class="bullet-list">
          ${items}
        </ul>
      `;
    }
  };

  // Compile layout
  const sectionOrder = resume.sectionOrder || [
    'summary',
    'experience',
    'education',
    'projects',
    'skills',
    'certifications',
    'achievements'
  ];

  let sectionsHtml = '';
  sectionOrder.forEach(key => {
    if (sections[key]) {
      sectionsHtml += sections[key]();
    }
  });

  // Languages section (appended at the end if present)
  if (resume.languages && resume.languages.length > 0) {
    const langItems = resume.languages
      .map(l => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`)
      .join(', ');
    sectionsHtml += `
      <h2>Languages</h2>
      <p style="margin-bottom: 8pt; line-height: 1.3;">${langItems}</p>
    `;
  }

  // Header Details
  const contactParts = [];
  if (p.email) contactParts.push(`<a href="mailto:${p.email}">${p.email}</a>`);
  if (p.phone) contactParts.push(p.phone);
  if (p.location) contactParts.push(p.location);

  const socialParts = [];
  if (p.linkedin) {
    socialParts.push(`<a href="${formatUrl(p.linkedin)}">LinkedIn: ${displayUrl(p.linkedin)}</a>`);
  }
  if (p.github) {
    socialParts.push(`<a href="${formatUrl(p.github)}">GitHub: ${displayUrl(p.github)}</a>`);
  }
  if (p.portfolio) {
    socialParts.push(`<a href="${formatUrl(p.portfolio)}">Portfolio: ${displayUrl(p.portfolio)}</a>`);
  }

  const headerHtml = `
    <div style="text-align: center; margin-bottom: 15pt;">
      <h1>${p.fullName || resume.title || 'Your Name'}</h1>
      <div class="contact-info">
        ${contactParts.join(' &nbsp; | &nbsp; ')}
        ${socialParts.length > 0 ? `<br/>${socialParts.join(' &nbsp; | &nbsp; ')}` : ''}
      </div>
    </div>
  `;

  // Combine into complete MS Word XML/HTML document
  const documentHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.75in 0.75in 0.75in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10.5pt;
          line-height: 1.25;
          color: #333333;
        }
        h1 {
          font-family: 'Calibri Light', 'Arial', sans-serif;
          font-size: 20pt;
          font-weight: bold;
          margin: 0 0 4pt 0;
          color: #111111;
        }
        h2 {
          font-family: 'Calibri Light', 'Arial', sans-serif;
          font-size: 12pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 14pt;
          margin-bottom: 6pt;
          border-bottom: 1.5pt solid ${themeColor};
          padding-bottom: 2pt;
          color: ${themeColor};
        }
        p {
          margin: 0 0 4pt 0;
        }
        a {
          color: ${themeColor};
          text-decoration: underline;
        }
        .contact-info {
          font-size: 9.5pt;
          color: #555555;
          line-height: 1.4;
        }
        .contact-info a {
          color: #555555;
          text-decoration: none;
        }
        .section-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 3pt;
          margin-top: 2pt;
        }
        .section-table td {
          padding: 0;
          vertical-align: top;
          font-size: 10.5pt;
        }
        .align-right {
          text-align: right;
          font-size: 9.5pt;
          color: #555555;
        }
        .bold {
          font-weight: bold;
          color: #222222;
        }
        .italic {
          font-style: italic;
        }
        .bullet-list {
          margin-top: 0;
          margin-bottom: 8pt;
          padding-left: 18pt;
        }
      </style>
    </head>
    <body>
      ${headerHtml}
      ${sectionsHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + documentHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.title || 'Resume'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
