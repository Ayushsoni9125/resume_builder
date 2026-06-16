import { useState } from 'react';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore from '../../store/resumeStore';
import { aiAPI } from '../../api';

import AIRewriter from './AIRewriter';

const emptyExp = { company: '', role: '', startDate: '', endDate: '', current: false, location: '', description: '' };

function ExperienceCard({ exp, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true);
  const [generating, setGenerating] = useState(false);

  const generateDesc = async () => {
    setGenerating(true);
    try {
      const { data } = await aiAPI.generateExperienceDesc({
        company: exp.company, role: exp.role,
        duration: `${exp.startDate} - ${exp.endDate || 'Present'}`,
        technologies: exp.description
      });
      onUpdate('description', data.description);
      toast.success('AI description generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border border-dark-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-100 cursor-pointer hover:bg-dark-200 transition-colors"
        onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-dark-900">
            {exp.role || 'New Experience'} {exp.company ? `@ ${exp.company}` : ''}
          </span>
          {exp.current && <span className="badge-success text-xs">Current</span>}
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
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Role / Position *</label>
            <input value={exp.role} onChange={e => onUpdate('role', e.target.value)}
              placeholder="Senior Frontend Developer" className="input-field" id={`exp-role-${index}`} />
          </div>
          <div>
            <label className="input-label">Company *</label>
            <input value={exp.company} onChange={e => onUpdate('company', e.target.value)}
              placeholder="Google" className="input-field" id={`exp-company-${index}`} />
          </div>
          <div>
            <label className="input-label">Start Date</label>
            <input value={exp.startDate} onChange={e => onUpdate('startDate', e.target.value)}
              placeholder="Jan 2022" className="input-field" id={`exp-start-${index}`} />
          </div>
          <div>
            <label className="input-label">End Date</label>
            <input value={exp.endDate} onChange={e => onUpdate('endDate', e.target.value)}
              placeholder="Present" disabled={exp.current} className="input-field disabled:opacity-50" id={`exp-end-${index}`} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" id={`exp-current-${index}`} checked={exp.current}
              onChange={e => { onUpdate('current', e.target.checked); if (e.target.checked) onUpdate('endDate', 'Present'); }}
              className="w-4 h-4 rounded accent-primary-500" />
            <label htmlFor={`exp-current-${index}`} className="text-sm text-dark-600">I currently work here</label>
          </div>
          <div>
            <label className="input-label">Location</label>
            <input value={exp.location} onChange={e => onUpdate('location', e.target.value)}
              placeholder="Remote / San Francisco, CA" className="input-field" id={`exp-location-${index}`} />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="input-label mb-0">Description</label>
              <div className="flex items-center gap-2">
                <AIRewriter
                  text={exp.description || ''}
                  onRewrite={newVal => onUpdate('description', newVal)}
                />
                <button type="button" onClick={generateDesc} disabled={generating} className="btn-ai" id={`exp-ai-${index}`}>
                  {generating ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</> : <><Sparkles className="w-3 h-3" /> AI Generate</>}
                </button>
              </div>
            </div>
            <textarea value={exp.description} onChange={e => onUpdate('description', e.target.value)} rows={4}
              placeholder="• Developed scalable microservices reducing latency by 40%&#10;• Led a team of 5 engineers to deliver product features on time&#10;• Integrated CI/CD pipelines improving deployment frequency by 3x"
              className="input-field resize-none" id={`exp-desc-${index}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceStep() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore();
  const experience = currentResume.experience || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Work Experience</h2>
        <p className="section-subtitle">Add your relevant work experience (most recent first)</p>
      </div>

      <div className="space-y-3">
        {experience.map((exp, i) => (
          <ExperienceCard key={i} exp={exp} index={i}
            onUpdate={(field, val) => updateItem('experience', i, { [field]: val })}
            onRemove={() => removeItem('experience', i)} />
        ))}
      </div>

      <button type="button" onClick={() => addItem('experience', { ...emptyExp })}
        className="btn-secondary w-full justify-center" id="add-experience-btn">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}
