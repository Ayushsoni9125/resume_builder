import { useState } from 'react';
import { Plus, Trash2, Code2, ChevronDown, ChevronUp, Sparkles, Loader2, GitBranch, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore from '../../store/resumeStore';
import { aiAPI } from '../../api';

import AIRewriter from './AIRewriter';

const emptyProject = { name: '', techStack: [], githubLink: '', liveDemo: '', description: '' };

function ProjectCard({ project, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [techInput, setTechInput] = useState('');

  const generateDesc = async () => {
    setGenerating(true);
    try {
      const { data } = await aiAPI.generateProjectDesc({
        projectName: project.name,
        techStack: project.techStack,
        githubLink: project.githubLink,
        liveDemo: project.liveDemo,
      });
      onUpdate('description', data.description);
      toast.success('AI description generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const addTech = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const tech = techInput.trim().replace(',', '');
      if (!project.techStack.includes(tech)) {
        onUpdate('techStack', [...project.techStack, tech]);
      }
      setTechInput('');
    }
  };

  const removeTech = (tech) => onUpdate('techStack', project.techStack.filter(t => t !== tech));

  return (
    <div className="border border-dark-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-100 cursor-pointer hover:bg-dark-200 transition-colors"
        onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-dark-900">{project.name || 'New Project'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 hover:text-red-400 text-dark-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <div>
            <label className="input-label">Project Name *</label>
            <input value={project.name} onChange={e => onUpdate('name', e.target.value)}
              placeholder="E-Commerce Platform" className="input-field" id={`proj-name-${index}`} />
          </div>

          <div>
            <label className="input-label">Tech Stack</label>
            <div className="input-field min-h-[48px] flex flex-wrap gap-1.5 cursor-text" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
              {project.techStack.map(tech => (
                <span key={tech} className="badge-primary flex items-center gap-1">
                   {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="hover:text-primary-800"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech}
                placeholder={project.techStack.length === 0 ? 'Type and press Enter...' : ''}
                className="flex-1 min-w-[100px] bg-transparent text-dark-900 text-sm outline-none placeholder-dark-400"
                id={`proj-tech-${index}`} />
            </div>
            <p className="text-xs text-dark-500 mt-1">Press Enter or comma to add each technology</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">GitHub Link</label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input value={project.githubLink} onChange={e => onUpdate('githubLink', e.target.value)}
                  placeholder="github.com/you/project" className="input-field pl-10" id={`proj-github-${index}`} />
              </div>
            </div>
            <div>
              <label className="input-label">Live Demo</label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input value={project.liveDemo} onChange={e => onUpdate('liveDemo', e.target.value)}
                  placeholder="yourproject.vercel.app" className="input-field pl-10" id={`proj-live-${index}`} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="input-label mb-0">Description</label>
              <div className="flex items-center gap-2">
                <AIRewriter
                  text={project.description || ''}
                  onRewrite={newVal => onUpdate('description', newVal)}
                />
                <button type="button" onClick={generateDesc} disabled={generating || !project.name} className="btn-ai" id={`proj-ai-${index}`}>
                  {generating ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</> : <><Sparkles className="w-3 h-3" /> AI Generate</>}
                </button>
              </div>
            </div>
            <textarea value={project.description} onChange={e => onUpdate('description', e.target.value)} rows={4}
              placeholder="• Built a full-stack e-commerce platform with React and Node.js&#10;• Implemented JWT authentication and payment gateway integration&#10;• Achieved 99.9% uptime with Docker and CI/CD pipeline"
              className="input-field resize-none" id={`proj-desc-${index}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsStep() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore();
  const projects = currentResume.projects || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Showcase your best work (most impressive first)</p>
      </div>

      <div className="space-y-3">
        {projects.map((proj, i) => (
          <ProjectCard key={i} project={proj} index={i}
            onUpdate={(field, val) => updateItem('projects', i, { [field]: val })}
            onRemove={() => removeItem('projects', i)} />
        ))}
      </div>

      <button type="button" onClick={() => addItem('projects', { ...emptyProject, techStack: [] })}
        className="btn-secondary w-full justify-center" id="add-project-btn">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}
