import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { aiAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AIRewriter({ text, onRewrite }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRewrite = async (option) => {
    if (!text || !text.trim()) {
      return toast.error('Please enter some text first to rewrite.');
    }
    setLoading(true);
    setOpen(false);
    try {
      const { data } = await aiAPI.rewriteSection(text, option);
      onRewrite(data.rewritten);
      toast.success('Text rewritten with AI!');
    } catch (err) {
      toast.error('AI rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="btn-ghost py-1 px-2.5 text-xs flex items-center gap-1.5 bg-dark-200 text-dark-700 hover:bg-dark-300 rounded-lg transition-all"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-500" />}
        AI Rewrite
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-dark-200 shadow-xl z-20 overflow-hidden text-xs py-1">
          <button
            onClick={() => handleRewrite('professional')}
            className="w-full text-left px-4 py-2 hover:bg-dark-100 text-dark-800 transition-colors"
          >
            👔 More Professional
          </button>
          <button
            onClick={() => handleRewrite('star')}
            className="w-full text-left px-4 py-2 hover:bg-dark-100 text-dark-800 transition-colors"
          >
            ⭐ Use STAR Method
          </button>
          <button
            onClick={() => handleRewrite('concise')}
            className="w-full text-left px-4 py-2 hover:bg-dark-100 text-dark-800 transition-colors"
          >
            ⚡ Make Concise
          </button>
        </div>
      )}
    </div>
  );
}
