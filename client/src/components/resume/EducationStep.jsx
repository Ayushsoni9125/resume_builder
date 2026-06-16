import { useState } from 'react';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import useResumeStore from '../../store/resumeStore';

const emptyEdu = { degree: '', institution: '', startDate: '', endDate: '', gpa: '', description: '' };

function EducationCard({ edu, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-dark-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-dark-100 cursor-pointer hover:bg-dark-200 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-dark-900">
            {edu.degree || 'New Education'} {edu.institution ? `— ${edu.institution}` : ''}
          </span>
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
            <label className="input-label">Degree / Qualification *</label>
            <input value={edu.degree} onChange={e => onUpdate('degree', e.target.value)}
              placeholder="B.Tech Computer Science" className="input-field" id={`edu-degree-${index}`} />
          </div>
          <div>
            <label className="input-label">Institution *</label>
            <input value={edu.institution} onChange={e => onUpdate('institution', e.target.value)}
              placeholder="MIT" className="input-field" id={`edu-institution-${index}`} />
          </div>
          <div>
            <label className="input-label">Start Date</label>
            <input value={edu.startDate} onChange={e => onUpdate('startDate', e.target.value)}
              placeholder="Aug 2020" className="input-field" id={`edu-start-${index}`} />
          </div>
          <div>
            <label className="input-label">End Date</label>
            <input value={edu.endDate} onChange={e => onUpdate('endDate', e.target.value)}
              placeholder="May 2024 (or Present)" className="input-field" id={`edu-end-${index}`} />
          </div>
          <div>
            <label className="input-label">CGPA / Percentage</label>
            <input value={edu.gpa} onChange={e => onUpdate('gpa', e.target.value)}
              placeholder="8.5 / 10 or 85%" className="input-field" id={`edu-gpa-${index}`} />
          </div>
          <div className="sm:col-span-2">
            <label className="input-label">Additional Info (optional)</label>
            <textarea value={edu.description} onChange={e => onUpdate('description', e.target.value)}
              placeholder="Relevant coursework, honors, activities..." rows={2}
              className="input-field resize-none" id={`edu-desc-${index}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationStep() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore();
  const education = currentResume.education || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">Add your educational qualifications</p>
      </div>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <EducationCard key={i} edu={edu} index={i}
            onUpdate={(field, val) => updateItem('education', i, { [field]: val })}
            onRemove={() => removeItem('education', i)} />
        ))}
      </div>

      <button type="button" onClick={() => addItem('education', { ...emptyEdu })}
        className="btn-secondary w-full justify-center" id="add-education-btn">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}
