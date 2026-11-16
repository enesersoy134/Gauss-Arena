import React from 'react';

export interface CriticalVignetteProps {
  /** Süre kritik seviyede mi (son 5 saniye) */
  active: boolean;
  /** Kalan saniye */
  timeLeft?: number;
}


export const CriticalVignette: React.FC<CriticalVignetteProps> = ({ active, timeLeft }) => {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300 animate-vignette-pulse"
      style={{
        boxShadow: 'inset 0 0 100px 30px rgba(239, 68, 68, 0.45), inset 0 0 40px 10px rgba(241, 78, 19, 0.55)',
      }}
    >
      {/* Üstte acil durum kırmızı ışık çizgisi */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
      {/* Altta acil durum kırmızı ışık çizgisi */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
      
      {/* Son 3 saniyede mikro uyarı rozeti */}
      {timeLeft !== undefined && timeLeft <= 3 && timeLeft > 0 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 animate-ping">
          <span className="px-3 py-1 rounded-full bg-red-600/80 text-white font-mono font-black text-xs uppercase tracking-widest border border-red-400">
            ⏰ SON {Math.ceil(timeLeft)}s!
          </span>
        </div>
      )}
    </div>
  );
};

export default CriticalVignette;
