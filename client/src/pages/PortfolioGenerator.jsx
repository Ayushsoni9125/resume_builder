import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../api';

const THEMES = [
  { name: 'Orange Glow', hex: '#f97316', bg: 'bg-orange-500' },
  { name: 'Modern Indigo', hex: '#6C47FF', bg: 'bg-indigo-500' },
  { name: 'Emerald Code', hex: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Sky Tech', hex: '#0ea5e9', bg: 'bg-sky-500' },
  { name: 'Dark Slate', hex: '#475569', bg: 'bg-slate-600' },
];

export default function PortfolioGenerator() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    resumeAPI.getById(id)
      .then(({ data }) => {
        setResumeData(data.resume);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load resume details');
        setLoading(false);
      });
  }, [id]);

  function generatePortfolioHTML(data, themeHex) {
    const p = data.personalInfo || {};
    const skills = data.skills || {};
    const experience = data.experience || [];
    const education = data.education || [];
    const projects = data.projects || [];
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.fullName || 'My Portfolio'} - Personal Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; scroll-behavior: smooth; }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { brand: '${themeHex}' }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 text-slate-800">
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="#" class="text-xl font-bold tracking-tight text-slate-900">${p.fullName || 'Portfolio'}</a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#about" class="hover:text-brand transition-colors">About</a>
        ${experience.length ? `<a href="#experience" class="hover:text-brand transition-colors">Experience</a>` : ''}
        ${projects.length ? `<a href="#projects" class="hover:text-brand transition-colors">Projects</a>` : ''}
        ${education.length ? `<a href="#education" class="hover:text-brand transition-colors">Education</a>` : ''}
        <a href="#contact" class="hover:text-brand transition-colors">Contact</a>
      </nav>
    </div>
  </header>

  <section class="max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-start gap-6">
    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand">Welcome to my space</span>
    <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
      Hi, I'm <span class="text-brand">${p.fullName || 'Your Name'}</span>
    </h1>
    ${experience.length ? `<p class="text-lg md:text-xl text-slate-600 max-w-2xl">${experience[0].role} at ${experience[0].company}</p>` : ''}
    <div class="flex items-center gap-4 mt-2">
      <a href="#contact" class="px-6 py-3 rounded-xl bg-brand text-white font-semibold transition-all hover:opacity-95 hover:shadow-lg">Get in touch</a>
      <a href="#projects" class="px-6 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-600 transition-all hover:bg-slate-50">View Work</a>
    </div>
  </section>

  <section id="about" class="bg-white border-y border-slate-100 py-20">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-8">About Me</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-4 text-slate-600 leading-relaxed">
          <p>${data.summary || 'Summary not provided.'}</p>
          ${p.location ? `<p class="flex items-center gap-2">📍 Based in <strong>${p.location}</strong></p>` : ''}
        </div>
        <div class="space-y-4">
          <h3 class="font-bold text-slate-900">Skills</h3>
          <div class="flex flex-wrap gap-2">
            ${(skills.technical || []).map(s => `<span class="px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-600 font-semibold">${s}</span>`).join('')}
            ${(skills.soft || []).map(s => `<span class="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${experience.length ? `
  <section id="experience" class="py-20">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-10">Work Experience</h2>
      <div class="space-y-8">
        ${experience.map(exp => `
        <div class="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div class="flex justify-between items-baseline mb-2">
            <h3 class="font-bold text-slate-900 text-lg">${exp.role}</h3>
            <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0">${exp.startDate} – ${exp.endDate || 'Present'}</span>
          </div>
          <p class="text-brand font-semibold text-sm">${exp.company} ${exp.location ? `· ${exp.location}` : ''}</p>
          ${exp.description ? `<p class="text-slate-600 text-sm mt-3 leading-relaxed whitespace-pre-line">${exp.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${projects.length ? `
  <section id="projects" class="bg-white border-y border-slate-100 py-20">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-10">Featured Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${projects.map(proj => `
        <div class="flex flex-col p-6 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div class="flex items-start justify-between">
            <h3 class="font-bold text-slate-900 text-lg">${proj.name}</h3>
            <div class="flex gap-2 text-xs font-semibold text-slate-500">
              ${proj.githubLink ? `<a href="${proj.githubLink}" target="_blank" rel="noopener noreferrer" class="hover:text-brand hover:underline">GitHub</a>` : ''}
              ${proj.githubLink && proj.liveDemo ? `<span>·</span>` : ''}
              ${proj.liveDemo ? `<a href="${proj.liveDemo}" target="_blank" rel="noopener noreferrer" class="hover:text-brand hover:underline text-brand">Live</a>` : ''}
            </div>
          </div>
          ${proj.techStack?.length ? `<div class="flex flex-wrap gap-1.5 my-3">${proj.techStack.map(t => `<span class="px-2 py-0.5 rounded-md bg-brand/5 text-[10px] text-brand font-semibold">${t}</span>`).join('')}</div>` : ''}
          ${proj.description ? `<p class="text-slate-600 text-sm leading-relaxed mt-2 whitespace-pre-line">${proj.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${education.length ? `
  <section id="education" class="py-20">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-10">Education</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${education.map(edu => `
        <div class="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <span class="text-xs font-semibold text-slate-400">${edu.startDate} – ${edu.endDate}</span>
          <h3 class="font-bold text-slate-900 mt-1">${edu.degree}</h3>
          <p class="text-brand font-medium text-sm">${edu.institution}</p>
          ${edu.gpa ? `<p class="text-slate-500 text-xs mt-1">GPA: ${edu.gpa}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <section id="contact" class="bg-slate-900 text-white py-20">
    <div class="max-w-5xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold tracking-tight mb-4">Let's Connect</h2>
      <p class="text-slate-400 max-w-sm mx-auto mb-8 text-sm">Feel free to reach out to me for collaboration, opportunities, or just to say hi!</p>
      
      <div class="flex justify-center flex-wrap gap-6 text-sm mb-12">
        ${p.email ? `<a href="mailto:${p.email}" class="hover:text-brand transition-colors">✉ ${p.email}</a>` : ''}
        ${p.phone ? `<span class="text-slate-600">|</span><a href="tel:${p.phone}" class="hover:text-brand transition-colors">📞 ${p.phone}</a>` : ''}
        ${p.linkedin ? `<span class="text-slate-600">|</span><a href="${p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`}" target="_blank" rel="noopener noreferrer" class="hover:text-brand transition-colors">LinkedIn</a>` : ''}
        ${p.github ? `<span class="text-slate-600">|</span><a href="${p.github.startsWith('http') ? p.github : `https://${p.github}`}" target="_blank" rel="noopener noreferrer" class="hover:text-brand transition-colors">GitHub</a>` : ''}
      </div>

      <p class="text-xs text-slate-600">&copy; ${new Date().getFullYear()} ${p.fullName || 'Portfolio'}. All rights reserved.</p>
    </div>
  </section>
</body>
</html>`;
  }

  const handleCopyCode = () => {
    if (!resumeData) return;
    const html = generatePortfolioHTML(resumeData, selectedTheme.hex);
    navigator.clipboard.writeText(html)
      .then(() => {
        setCopied(true);
        toast.success('Portfolio HTML code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy code'));
  };

  const handleDownload = () => {
    if (!resumeData) return;
    const html = generatePortfolioHTML(resumeData, selectedTheme.hex);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Portfolio'}_website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Portfolio website downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-dark-600 text-sm">Generating your portfolio website...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-dark-100 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-dark-900 mb-2">Resume Not Found</h2>
        <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
      </div>
    );
  }

  const generatedHTML = generatePortfolioHTML(resumeData, selectedTheme.hex);

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col">
      <header className="sticky top-0 z-30 border-b border-dark-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-semibold text-dark-900 text-sm flex items-center gap-1.5">
                Portfolio Generator <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              </h1>
              <p className="text-xs text-dark-600">Based on: {resumeData.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopyCode} className="btn-secondary py-2 px-3 text-sm">
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button onClick={handleDownload} className="btn-primary py-2 px-3 text-sm">
              <Download className="w-4 h-4" /> Download HTML
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-screen-2xl mx-auto w-full p-4 gap-4 overflow-hidden">
        {/* Settings sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="card">
            <h2 className="font-semibold text-dark-900 text-sm mb-3">Theme Color</h2>
            <div className="space-y-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left
                    ${selectedTheme.name === theme.name ? 'border-primary-500 bg-primary-500/5 text-primary-700' : 'border-dark-200 text-dark-600 hover:bg-dark-100'}`}
                >
                  <span className={`w-4 h-4 rounded-full shrink-0 ${theme.bg}`} />
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="card text-xs text-dark-600 space-y-3 leading-relaxed">
            <p className="font-bold text-dark-900 mb-1">💡 What is this?</p>
            <p>This generator compiles your resume data into a completely responsive, modern personal website.</p>
            <p>You can <strong>Download HTML</strong> to get a standalone website file which you can host for free on Vercel, Netlify, Github, or any server.</p>
          </div>
        </aside>

        {/* Live Preview area */}
        <main className="flex-1 bg-white border border-dark-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="bg-dark-100 px-4 py-2 border-b border-dark-200 flex items-center justify-between text-xs text-dark-500">
            <span>💻 LIVE SITE PREVIEW</span>
            <span className="text-[10px] text-dark-400 font-semibold bg-dark-200 px-2 py-0.5 rounded">stand-alone sandbox</span>
          </div>
          <iframe
            title="Portfolio Site Live Preview"
            srcDoc={generatedHTML}
            className="flex-1 w-full border-none bg-slate-50"
            sandbox="allow-scripts"
          />
        </main>
      </div>
    </div>
  );
}
