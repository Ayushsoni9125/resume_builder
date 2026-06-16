import { useState } from 'react';
import { Plus, Trash2, Award, Trophy } from 'lucide-react';
import useResumeStore from '../../store/resumeStore';

const emptyCert = { name: '', organization: '', date: '', url: '' };

export default function CertificationsStep() {
  const { currentResume, addItem, updateItem, removeItem, updateSection } = useResumeStore();
  const certifications = currentResume.certifications || [];
  const achievements = currentResume.achievements || [];
  const [achInput, setAchInput] = useState('');

  const addAchievement = () => {
    if (achInput.trim()) {
      updateSection('achievements', [...achievements, achInput.trim()]);
      setAchInput('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Certifications */}
      <div className="space-y-4">
        <div>
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Add your professional certifications</p>
        </div>

        <div className="space-y-3">
          {certifications.map((cert, i) => (
            <div key={i} className="card border border-white/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium text-white">{cert.name || `Certification ${i + 1}`}</span>
                </div>
                <button type="button" onClick={() => removeItem('certifications', i)}
                  className="p-1 hover:text-red-400 text-dark-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Certification Name</label>
                  <input value={cert.name} onChange={e => updateItem('certifications', i, { name: e.target.value })}
                    placeholder="AWS Solutions Architect" className="input-field" id={`cert-name-${i}`} />
                </div>
                <div>
                  <label className="input-label">Issuing Organization</label>
                  <input value={cert.organization} onChange={e => updateItem('certifications', i, { organization: e.target.value })}
                    placeholder="Amazon Web Services" className="input-field" id={`cert-org-${i}`} />
                </div>
                <div>
                  <label className="input-label">Date</label>
                  <input value={cert.date} onChange={e => updateItem('certifications', i, { date: e.target.value })}
                    placeholder="March 2024" className="input-field" id={`cert-date-${i}`} />
                </div>
                <div>
                  <label className="input-label">Certificate URL (optional)</label>
                  <input value={cert.url} onChange={e => updateItem('certifications', i, { url: e.target.value })}
                    placeholder="https://..." className="input-field" id={`cert-url-${i}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => addItem('certifications', { ...emptyCert })}
          className="btn-secondary w-full justify-center" id="add-cert-btn">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" /> Achievements
          </h2>
          <p className="section-subtitle">Highlight your notable accomplishments</p>
        </div>

        <div className="form-section space-y-3">
          {achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
              <span className="flex-1 text-sm text-white">{ach}</span>
              <button type="button" onClick={() => {
                const updated = achievements.filter((_, idx) => idx !== i);
                updateSection('achievements', updated);
              }} className="p-1 hover:text-red-400 text-dark-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              value={achInput}
              onChange={e => setAchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              placeholder="Won 1st place in national hackathon"
              className="input-field flex-1"
              id="achievement-input"
            />
            <button type="button" onClick={addAchievement} className="btn-secondary px-4">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-dark-500">Press Enter or click + to add each achievement</p>
        </div>
      </div>
    </div>
  );
}
