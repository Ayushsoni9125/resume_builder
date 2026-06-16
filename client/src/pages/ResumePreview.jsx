import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, ArrowLeft, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Sparkles, Loader2, TrendingUp, Share2, Check, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI, aiAPI } from '../api';
import useResumeStore from '../store/resumeStore';
import ResumeTemplate from '../components/templates';

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const { setCurrentResume, currentResume, previewZoom, setPreviewZoom } = useResumeStore();
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [improvements, setImprovements] = useState(null);
  const [improvLoading, setImprovLoading] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    resumeAPI.getById(id)
      .then(({ data }) => { setCurrentResume(data.resume); setLoading(false); })
      .catch(() => { toast.error('Resume not found'); navigate('/dashboard'); });
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: currentResume?.title || 'Resume',
    onAfterPrint: () => toast.success('PDF downloaded!'),
  });

  const fetchATS = async () => {
    setAtsLoading(true);
    setShowATS(true);
    try {
      const { data } = await aiAPI.calculateATS({ resume: currentResume });
      setAtsData(data.atsData);
    } catch (err) {
      toast.error('ATS check failed. Check your Gemini API key.');
    } finally {
      setAtsLoading(false);
    }
  };

  const fetchImprovements = async () => {
    setImprovLoading(true);
    try {
      const { data } = await aiAPI.generateImprovements({ resume: currentResume });
      setImprovements(data.improvements);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error('AI analysis failed');
    } finally {
      setImprovLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const { data } = await resumeAPI.toggleShare(id);
      if (data.isPublic && data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Share link copied!');
      } else {
        toast.success('Resume is now private');
      }
    } catch {
      toast.error('Failed to share resume');
    }
  };

  const [zoom, setZoom] = useState(previewZoom || 0.75);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        const computedZoom = Math.max(0.35, (window.innerWidth - 32) / 800);
        setZoom(computedZoom);
      } else {
        setZoom(previewZoom || 0.75);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [previewZoom]);

  const ATSColor = (score) => score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-dark-950 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top bar */}
      <div className="no-print sticky top-0 z-20 bg-dark-900/90 backdrop-blur-sm border-b border-white/5 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link to={`/resume/${id}/edit`} className="btn-ghost p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-semibold text-white text-sm hidden sm:block">{currentResume?.title}</h1>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Zoom */}
            <div className="hidden sm:flex items-center gap-1 bg-dark-800 rounded-lg px-2 py-1">
              <button onClick={() => setPreviewZoom(Math.max(0.4, zoom - 0.1))} className="btn-ghost p-1">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-dark-300 w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setPreviewZoom(Math.min(1.2, zoom + 0.1))} className="btn-ghost p-1">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button onClick={() => setFullscreen(!fullscreen)} className="btn-ghost p-2" title="Fullscreen">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button onClick={fetchATS} disabled={atsLoading} className="btn-ghost gap-1.5 text-sm px-3 py-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ATS Score</span>
            </button>

            <button onClick={fetchImprovements} disabled={improvLoading} className="btn-ai gap-1.5 text-sm px-3 py-2">
              {improvLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">AI Improve</span>
            </button>

            <button onClick={handleShare} className="btn-secondary py-2 px-3 text-sm gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button onClick={handlePrint} className="btn-primary py-2 px-4 text-sm" id="download-pdf-btn">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto min-h-[calc(100vh-60px)]">
        {/* Main preview */}
        <div className="flex-1 flex flex-col items-center py-8 px-4 overflow-auto">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              marginBottom: `${(1 - zoom) * -297 * 3.78}px`,
            }}
          >
            <div ref={printRef} className="shadow-2xl">
              <ResumeTemplate data={currentResume} />
            </div>
          </div>
        </div>

        {/* Right panel — ATS / Improvements */}
        <AnimatePresence>
          {(showATS || improvements) && (
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="no-print w-full lg:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-dark-900 overflow-y-auto lg:h-[calc(100vh-60px)] lg:sticky lg:top-[60px]"
            >
              <div className="p-5 space-y-5">
                {/* ATS Score */}
                {showATS && (
                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary-400" /> ATS Score
                    </h3>
                    {atsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                      </div>
                    ) : atsData ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-5xl font-display font-bold" style={{ color: ATSColor(atsData.score) }}>
                            {atsData.score}
                          </div>
                          <div className="text-sm text-dark-400 mt-1">/ 100 · Grade: {atsData.grade}</div>
                          <div className="text-xs text-dark-500 mt-2">{atsData.summary}</div>
                        </div>

                        {atsData.breakdown && (
                          <div className="space-y-2">
                            {Object.entries(atsData.breakdown).map(([key, val]) => (
                              <div key={key}>
                                <div className="flex justify-between text-xs text-dark-400 mb-1">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  <span>{val}</span>
                                </div>
                                <div className="h-1.5 bg-dark-700 rounded-full">
                                  <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: ATSColor(atsData.score) }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {atsData.suggestions?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-white mb-2">Suggestions</p>
                            <ul className="space-y-1.5">
                              {atsData.suggestions.map((s, i) => (
                                <li key={i} className="text-xs text-dark-300 flex gap-2">
                                  <span className="text-primary-400 shrink-0">→</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* AI Improvements */}
                {improvements && (
                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-400" /> AI Analysis
                    </h3>
                    <div className="space-y-3">
                      {improvements.overall && (
                        <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                          <p className="text-xs text-primary-300">{improvements.overall}</p>
                        </div>
                      )}

                      {improvements.improvements?.map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border text-xs
                          ${item.priority === 'high' ? 'bg-red-500/10 border-red-500/20' :
                            item.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            'bg-green-500/10 border-green-500/20'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`badge text-xs ${item.priority === 'high' ? 'badge-danger' : item.priority === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                              {item.priority}
                            </span>
                            <span className="font-semibold text-white">{item.section}</span>
                          </div>
                          <p className="text-dark-400 mb-1">{item.issue}</p>
                          <p className="text-dark-300">→ {item.suggestion}</p>
                        </div>
                      ))}

                      <button onClick={() => navigate(`/resume/${id}/edit`)}
                        className="btn-primary w-full justify-center text-sm py-2">
                        <Edit3 className="w-3.5 h-3.5" /> Apply Improvements
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
