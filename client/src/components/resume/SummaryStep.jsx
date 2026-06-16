import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore from '../../store/resumeStore';
import { aiAPI } from '../../api';

export default function SummaryStep() {
  const { currentResume, updateSection } = useResumeStore();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await aiAPI.generateSummary({
        name: currentResume.personalInfo?.fullName,
        skills: currentResume.skills?.technical,
        experience: currentResume.experience,
        projects: currentResume.projects,
        yearsOfExperience: currentResume.experience?.length > 0 ? 'Multiple years' : 'Entry level',
      });
      updateSection('summary', data.summary);
      toast.success('AI Summary generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Check your Gemini API key.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Professional Summary</h2>
        <p className="section-subtitle">A brief overview of your professional background and goals</p>
      </div>

      <div className="form-section">
        <div className="flex items-center justify-between mb-3">
          <label className="input-label mb-0">Summary</label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn-ai"
            id="generate-summary-btn"
          >
            {generating ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-3 h-3" /> AI Generate</>
            )}
          </button>
        </div>

        <div className="relative">
          <textarea
            value={currentResume.summary || ''}
            onChange={e => updateSection('summary', e.target.value)}
            placeholder="Write a compelling 3-4 sentence professional summary, or click AI Generate to let our AI craft one for you based on your experience and skills..."
            className="input-field min-h-[160px] resize-none leading-relaxed"
            id="summary-textarea"
          />
          {generating && (
            <div className="absolute inset-0 bg-dark-800/80 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-primary-400 animate-pulse mx-auto mb-2" />
                <p className="text-sm text-primary-300">AI is crafting your summary...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-dark-500 mt-2">
          <span>{currentResume.summary?.length || 0} characters</span>
          <span>Recommended: 150–300 characters</span>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
          <p className="text-xs text-primary-300 font-medium mb-1">💡 AI Tip</p>
          <p className="text-xs text-dark-400">
            Fill in your <strong className="text-dark-300">Skills</strong> and <strong className="text-dark-300">Experience</strong> sections first for better AI-generated summaries.
          </p>
        </div>
      </div>
    </div>
  );
}
