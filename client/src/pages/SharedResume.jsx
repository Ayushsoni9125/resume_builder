import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resumeAPI } from '../api';
import ResumeTemplate from '../components/templates';
import { Sparkles, Loader2 } from 'lucide-react';

export default function SharedResume() {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    resumeAPI.getShared(shareId)
      .then(({ data }) => setResume(data.resume))
      .catch(() => setError('This resume is not available or is no longer shared.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        const computedZoom = Math.max(0.35, (window.innerWidth - 32) / 800);
        setZoom(computedZoom);
      } else {
        setZoom(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4 p-4">
      <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-dark-400" />
      </div>
      <p className="text-dark-400 text-center max-w-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center py-8 px-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-6 text-dark-400 text-sm">
        <Sparkles className="w-4 h-4 text-primary-400" />
        <span>Shared via <strong className="text-primary-400">ResumeAI</strong></span>
      </div>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          marginBottom: `${(1 - zoom) * -297 * 3.78}px`,
        }}
      >
        <div className="shadow-2xl">
          <ResumeTemplate data={resume} />
        </div>
      </div>
    </div>
  );
}
