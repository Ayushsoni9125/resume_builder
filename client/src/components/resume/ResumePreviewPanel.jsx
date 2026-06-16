import { useEffect, useRef, useState } from 'react';
import useResumeStore from '../../store/resumeStore';
import ResumeTemplate from '../templates';

// Live preview panel shown inside the editor sidebar (fully responsive)
export default function ResumePreviewPanel() {
  const { currentResume } = useResumeStore();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
      // standard A4 width is 794px
      const computedScale = parentWidth / 794;
      setScale(computedScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-xl bg-dark-950 flex flex-col items-start">
      <div
        className="shadow-card bg-white"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '794px',
          height: '1123px', // standard A4 ratio height
        }}
      >
        <ResumeTemplate data={currentResume} />
      </div>
      {/* Spacer to push surrounding layout matching the scaled height */}
      <div style={{ height: `${1123 * scale}px` }} className="w-full shrink-0" />
    </div>
  );
}
