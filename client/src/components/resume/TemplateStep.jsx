import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import useResumeStore from '../../store/resumeStore';

const TEMPLATES = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    desc: 'Two-column layout with vibrant accent colors. Perfect for tech roles.',
    preview: 'bg-gradient-to-br from-blue-600 to-primary-600',
    tag: 'Popular',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    desc: 'Single-column, elegant typography. Timeless and versatile.',
    preview: 'bg-gradient-to-br from-gray-600 to-gray-800',
    tag: 'Classic',
  },
  {
    id: 'developer-portfolio',
    name: 'Developer Portfolio',
    desc: 'Dark header, code-inspired style. Ideal for software developers.',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-700',
    tag: 'Tech',
  },
  {
    id: 'corporate-ats',
    name: 'Corporate ATS-Friendly',
    desc: 'Simple, clean, single-column. Optimized for ATS systems.',
    preview: 'bg-gradient-to-br from-slate-600 to-slate-800',
    tag: 'ATS Safe',
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    desc: 'Colorful sidebar, icon-rich layout. Stands out in creative fields.',
    preview: 'bg-gradient-to-br from-pink-600 to-purple-600',
    tag: 'Creative',
  },
];

const COLORS = [
  '#6C47FF', '#2563eb', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#065f46', '#92400e', '#be123c',
];

export default function TemplateStep() {
  const { currentResume, setTemplate, setThemeColor } = useResumeStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="section-title">Choose Your Template</h2>
        <p className="section-subtitle">Select a professional design that matches your style</p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((tpl, i) => (
          <motion.button
            key={tpl.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setTemplate(tpl.id)}
            className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-200
              ${currentResume.template === tpl.id
                ? 'border-primary-500 shadow-glow'
                : 'border-white/10 hover:border-primary-500/40'}`}
            id={`template-${tpl.id}`}
          >
            {/* Preview strip */}
            <div className={`h-28 ${tpl.preview} relative flex items-end p-3`}>
              {/* Mini resume mockup */}
              <div className="absolute inset-2 bg-white/10 rounded-lg backdrop-blur-sm flex flex-col gap-1 p-2">
                <div className="h-2.5 bg-white/60 rounded w-24" />
                <div className="h-1.5 bg-white/30 rounded w-16" />
                <div className="mt-auto flex gap-1">
                  <div className="h-1 bg-white/20 rounded flex-1" />
                  <div className="h-1 bg-white/20 rounded flex-1" />
                </div>
              </div>
              <span className="relative badge-primary text-xs z-10">{tpl.tag}</span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white text-sm">{tpl.name}</h3>
                {currentResume.template === tpl.id && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-dark-400">{tpl.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Theme Color */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-white">Accent Color</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setThemeColor(color)}
              className={`w-9 h-9 rounded-xl border-2 transition-all duration-200 hover:scale-110
                ${currentResume.themeColor === color ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              title={color}
              id={`color-${color.replace('#', '')}`}
            />
          ))}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentResume.themeColor || '#6C47FF'}
              onChange={e => setThemeColor(e.target.value)}
              className="w-9 h-9 rounded-xl cursor-pointer border-2 border-white/20"
              title="Custom color"
            />
            <span className="text-xs text-dark-400">Custom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
