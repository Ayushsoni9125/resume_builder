import { useState } from 'react';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore from '../../store/resumeStore';
import { aiAPI } from '../../api';

const POPULAR_TECH_SKILLS = [
  'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Python', 'Java', 'C++',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  'Git', 'REST APIs', 'GraphQL', 'Next.js', 'Express.js', 'Tailwind CSS',
  'Vue.js', 'Angular', 'Spring Boot', 'Django', 'FastAPI', 'Linux', 'CI/CD'
];

const POPULAR_SOFT_SKILLS = [
  'Team Leadership', 'Communication', 'Problem Solving', 'Time Management',
  'Critical Thinking', 'Adaptability', 'Collaboration', 'Project Management',
  'Mentoring', 'Agile / Scrum', 'Attention to Detail', 'Initiative'
];

function SkillTag({ skill, onRemove }) {
  return (
    <span className="badge-primary flex items-center gap-1.5 text-sm py-1 px-3">
      {skill}
      <button type="button" onClick={onRemove} className="hover:text-primary-800 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function SkillInput({ label, skills, onAdd, onRemove, popularSkills, inputId }) {
  const [input, setInput] = useState('');

  const handleAdd = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) onAdd(s);
    setInput('');
  };

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="input-field min-h-[60px] flex flex-wrap gap-1.5 cursor-text mb-2"
        onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
        {skills.map(skill => (
          <SkillTag key={skill} skill={skill} onRemove={() => onRemove(skill)} />
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
              e.preventDefault();
              handleAdd(input);
            }
          }}
          placeholder={skills.length === 0 ? 'Type and press Enter...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-dark-900 text-sm outline-none placeholder-dark-400"
          id={inputId}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {popularSkills.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
          <button key={s} type="button" onClick={() => handleAdd(s)}
            className="text-xs px-2.5 py-1 rounded-full border border-dark-300 text-dark-600 hover:border-primary-500/50 hover:text-primary-600 hover:bg-primary-500/5 transition-all">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SkillsStep() {
  const { currentResume, updateSkills } = useResumeStore();
  const [suggesting, setSuggesting] = useState(false);
  const skills = currentResume.skills || { technical: [], soft: [] };

  const addSkill = (type, skill) => {
    updateSkills(type, [...(skills[type] || []), skill]);
  };
  const removeSkill = (type, skill) => {
    updateSkills(type, (skills[type] || []).filter(s => s !== skill));
  };

  const handleAISuggest = async () => {
    setSuggesting(true);
    try {
      const { data } = await aiAPI.suggestSkills({
        currentSkills: [...(skills.technical || []), ...(skills.soft || [])],
        role: currentResume.experience?.[0]?.role || 'Software Developer',
        experience: currentResume.experience?.length > 2 ? 'Senior' : 'Mid-level',
      });
      // Add suggested skills that aren't already there
      const newTech = (data.skills?.technical || []).filter(s => !skills.technical?.includes(s));
      const newSoft = (data.skills?.soft || []).filter(s => !skills.soft?.includes(s));
      if (newTech.length) updateSkills('technical', [...(skills.technical || []), ...newTech]);
      if (newSoft.length) updateSkills('soft', [...(skills.soft || []), ...newSoft]);
      toast.success(`Added ${newTech.length + newSoft.length} skill suggestions!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI suggestion failed');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">Add your technical and soft skills</p>
        </div>
        <button type="button" onClick={handleAISuggest} disabled={suggesting} className="btn-ai mt-1" id="ai-suggest-skills-btn">
          {suggesting ? <><Loader2 className="w-3 h-3 animate-spin" /> Suggesting...</> : <><Sparkles className="w-3 h-3" /> AI Suggest</>}
        </button>
      </div>

      <div className="form-section space-y-6">
        <SkillInput
          label="Technical Skills"
          skills={skills.technical || []}
          onAdd={(s) => addSkill('technical', s)}
          onRemove={(s) => removeSkill('technical', s)}
          popularSkills={POPULAR_TECH_SKILLS}
          inputId="tech-skills-input"
        />
        <div className="divider" />
        <SkillInput
          label="Soft Skills"
          skills={skills.soft || []}
          onAdd={(s) => addSkill('soft', s)}
          onRemove={(s) => removeSkill('soft', s)}
          popularSkills={POPULAR_SOFT_SKILLS}
          inputId="soft-skills-input"
        />
      </div>

      <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
        <p className="text-xs text-primary-600 font-medium mb-1">💡 ATS Tip</p>
        <p className="text-xs text-dark-600">Include <strong className="text-dark-800">10–15 technical skills</strong> for best ATS performance. Mirror keywords from the job description.</p>
      </div>
    </div>
  );
}
