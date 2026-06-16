import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Link2, GitBranch, Globe, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useResumeStore from '../../store/resumeStore';
import { aiAPI } from '../../api';

const fields = [
  { name: 'fullName', label: 'Full Name *', placeholder: 'John Doe', icon: User, type: 'text' },
  { name: 'email', label: 'Email Address *', placeholder: 'john@example.com', icon: Mail, type: 'email' },
  { name: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', icon: Phone, type: 'tel' },
  { name: 'location', label: 'Location', placeholder: 'New York, NY', icon: MapPin, type: 'text' },
  { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe', icon: Link2, type: 'url' },
  { name: 'github', label: 'GitHub URL', placeholder: 'github.com/johndoe', icon: GitBranch, type: 'url' },
  { name: 'portfolio', label: 'Portfolio URL', placeholder: 'johndoe.dev', icon: Globe, type: 'url' },
];

export default function PersonalInfoStep() {
  const { currentResume, updateSection, updateSkills } = useResumeStore();
  const [importing, setImporting] = useState(false);
  const { register, watch, setValue, formState: { errors } } = useForm({
    defaultValues: currentResume.personalInfo
  });
  const values = watch();

  useEffect(() => {
    const sub = watch((data) => updateSection('personalInfo', data));
    return () => sub.unsubscribe();
  }, [watch]);

  const githubUrl = values.github;
  const linkedinUrl = values.linkedin;
  const hasSocialLink = (githubUrl && githubUrl.includes('github.com')) || (linkedinUrl && linkedinUrl.includes('linkedin.com'));

  const handleImportSocials = async () => {
    const confirmImport = window.confirm(
      "Would you like to import details from your GitHub/LinkedIn profile? This will automatically update your Full Name, Location, Portfolio, Summary, Technical Skills, and Projects."
    );
    if (!confirmImport) return;

    setImporting(true);
    try {
      const { data } = await aiAPI.importSocials({ githubUrl, linkedinUrl });
      if (data.success && data.profileData) {
        const { personalInfo, summary, skills, projects } = data.profileData;
        
        // Update current step form inputs
        if (personalInfo?.fullName) setValue('fullName', personalInfo.fullName);
        if (personalInfo?.location) setValue('location', personalInfo.location);
        if (personalInfo?.portfolio) setValue('portfolio', personalInfo.portfolio);
        
        // Update other sections in Zustand store
        if (summary) updateSection('summary', summary);
        if (skills?.technical) {
          updateSkills('technical', skills.technical);
        }
        if (projects) {
          updateSection('projects', projects);
        }
        
        if (data.warning) {
          toast(data.warning, { icon: '⚠️', duration: 6000 });
        } else {
          toast.success('Resume details imported successfully! ✨');
        }
      } else {
        toast.error('Could not parse profile details.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Personal Information</h2>
          <p className="section-subtitle">This will appear at the top of your resume</p>
        </div>
      </div>

      <div className="form-section">
        {/* Dynamic Autofill Card */}
        {hasSocialLink && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-primary-500 animate-pulse shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-dark-900">Autofill Resume with AI</p>
                <p className="text-xs text-dark-600">We detected GitHub/LinkedIn links. Import summary, skills, and projects automatically.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleImportSocials}
              disabled={importing}
              className="btn-primary py-2 px-4 text-xs whitespace-nowrap"
            >
              {importing ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Importing...
                </span>
              ) : (
                'Autofill Profile'
              )}
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
            <div key={name} className={name === 'fullName' || name === 'email' ? 'sm:col-span-1' : ''}>
              <label className="input-label">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  {...register(name, {
                    required: name === 'fullName' || name === 'email' ? `${label.replace(' *', '')} is required` : false
                  })}
                  type={type}
                  placeholder={placeholder}
                  className="input-field pl-10"
                  id={`personal-${name}`}
                />
              </div>
              {errors[name] && <p className="input-error">{errors[name].message}</p>}
            </div>
          ))}
        </div>

        {/* Resume title */}
        <div className="pt-2">
          <label className="input-label">Resume Title (internal only)</label>
          <input
            value={currentResume.title}
            onChange={e => updateSection('title', e.target.value)}
            placeholder="e.g. Software Engineer Resume 2024"
            className="input-field"
            id="resume-title"
          />
          <p className="text-xs text-dark-500 mt-1">This is only visible to you in your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
