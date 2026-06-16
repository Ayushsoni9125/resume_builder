import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Link2, GitBranch, Globe } from 'lucide-react';
import useResumeStore from '../../store/resumeStore';

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
  const { currentResume, updateSection } = useResumeStore();
  const { register, watch, formState: { errors } } = useForm({
    defaultValues: currentResume.personalInfo
  });
  const values = watch();

  useEffect(() => {
    const sub = watch((data) => updateSection('personalInfo', data));
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Personal Information</h2>
        <p className="section-subtitle">This will appear at the top of your resume</p>
      </div>

      <div className="form-section">
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
