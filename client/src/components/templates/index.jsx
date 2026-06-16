import ModernProfessional from './ModernProfessional';
import MinimalClean from './MinimalClean';
import DeveloperPortfolio from './DeveloperPortfolio';
import CorporateATS from './CorporateATS';
import CreativeDesigner from './CreativeDesigner';

const TEMPLATES = {
  'modern-professional': ModernProfessional,
  'minimal-clean': MinimalClean,
  'developer-portfolio': DeveloperPortfolio,
  'corporate-ats': CorporateATS,
  'creative-designer': CreativeDesigner,
};

export default function ResumeTemplate({ data }) {
  const Template = TEMPLATES[data?.template] || ModernProfessional;
  return <Template data={data} />;
}

export { TEMPLATES };
