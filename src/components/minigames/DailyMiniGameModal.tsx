import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Sparkles,
  Swords,
  CheckCircle2,
  X,
  RotateCcw,
  Gamepad2,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import BioCellGame from './BioCellGame';
import ChemMoleculeGame from './ChemMoleculeGame';
import PhysBalanceGame from './PhysBalanceGame';
import MathProfitGame from './MathProfitGame';
import GeoShapePuzzle from './GeoShapePuzzle';
import TurkRapBattle from './TurkRapBattle';

export type MiniGameSubjectId =
  | 'biyoloji'
  | 'kimya'
  | 'fizik'
  | 'matematik'
  | 'geometri'
  | 'turkce';

export interface DailyMiniGameModalProps {
  isOpen: boolean;
  isCompetitiveUnlocked: boolean;
  completedMiniGames: MiniGameSubjectId[];
  initialSubject?: MiniGameSubjectId;
  onCompleteMiniGame: (subjectId: MiniGameSubjectId) => void;
  onProceedToArena: () => void;
  onClose: () => void;
  onResetLockDemo?: () => void;
}

interface SubjectMeta {
  id: MiniGameSubjectId;
  label: string;
  shortTitle: string;
  icon: string;
}

export const MINI_GAME_SUBJECTS: SubjectMeta[] = [
  {
    id: 'biyoloji',
    label: 'Biyoloji',
    shortTitle: 'Hücre & Organel',
    icon: '🦠',
  },
  {
    id: 'kimya',
    label: 'Kimya',
    shortTitle: '3 Formül Sentezi',
    icon: '🧪',
  },
  {
    id: 'fizik',
    label: 'Fizik',
    shortTitle: 'Tork & Denge',
    icon: '⚖️',
  },
  {
    id: 'matematik',
    label: 'Matematik',
    shortTitle: '5 Kollu Fabrika',
    icon: '🏭',
  },
  {
    id: 'geometri',
    label: 'Geometri',
    shortTitle: 'Açı Bulmacası',
    icon: '📐',
  },
  {
    id: 'turkce',
    label: 'Türkçe',
    shortTitle: 'Kibar Rap',
    icon: '🎤',
  },
];

export const DailyMiniGameModal: React.FC<DailyMiniGameModalProps> = ({
  isOpen,
  isCompetitiveUnlocked,
  completedMiniGames,
  initialSubject = 'fizik',
  onCompleteMiniGame,
  onProceedToArena,
  onClose,
  onResetLockDemo,
}) => {
  const [activeSubject, setActiveSubject] = useState<MiniGameSubjectId>(initialSubject);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Aktif ders değiştiğinde otomatik en üste yumuşak kaydır
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSubject]);

  if (!isOpen) return null;

  const currentIndex = MINI_GAME_SUBJECTS.findIndex((s) => s.id === activeSubject);
  const isCurrentDone = completedMiniGames.includes(activeSubject);
  const areAllMiniGamesDone = completedMiniGames.length >= MINI_GAME_SUBJECTS.length;

  // Sıradaki çözülmemiş dersi bul (aktif dersin sonrasından başlayarak döngüsel ara)
  let nextUnsolvedSubject: SubjectMeta | null = null;
  if (!areAllMiniGamesDone) {
    for (let i = 1; i < MINI_GAME_SUBJECTS.length; i++) {
      const candidate = MINI_GAME_SUBJECTS[(currentIndex + i) % MINI_GAME_SUBJECTS.length];
      if (!completedMiniGames.includes(candidate.id)) {
        nextUnsolvedSubject = candidate;
        break;
      }
    }
    // Eğer aktif ders henüz bitirilmemişse ama yukarıdaki döngü bulamadıysa (sadece bu kaldıysa)
    if (!nextUnsolvedSubject && !isCurrentDone) {
      nextUnsolvedSubject = null;
    }
  }

  const handleCompleteCurrent = () => {
    onCompleteMiniGame(activeSubject);
  };

  const handleNextSubject = () => {
    if (nextUnsolvedSubject) {
      setActiveSubject(nextUnsolvedSubject.id);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (areAllMiniGamesDone) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#150A16] border-2 border-[#F14E13]/50 rounded-3xl shadow-2xl shadow-[#F14E13]/20 flex flex-col max-h-[95vh] overflow-hidden my-auto">
        {/* ÜST BAR: Başlık, Kilit Rozeti & 6 Branş Seçici */}
        <div className="bg-[#1A0E1C] border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col gap-2.5 shrink-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex items-center justify-center shadow-md shrink-0">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-poppins font-black text-sm sm:text-base text-white">
                  GÜNLÜK GÖREV
                </h2>
                {isCompetitiveUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Unlock className="w-3 h-3" />
                    <span>1v1 Arena Açık ({completedMiniGames.length}/6)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Lock className="w-3 h-3" />
                    <span>1v1 Kilidini Açmak İçin 1 Oyun Tamamla</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onResetLockDemo && isCompetitiveUnlocked && (
                <button
                  onClick={onResetLockDemo}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 text-[11px] font-mono text-[#B5CBC8] hover:text-red-300 flex items-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Kilidi Sıfırla</span>
                </button>
              )}

              {isCompetitiveUnlocked && (
                <button
                  onClick={onProceedToArena}
                  className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>1v1 Arenaya Geç</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#B5CBC8] hover:text-white transition-all"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Branş Sekme Barı */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
            {MINI_GAME_SUBJECTS.map((subj) => {
              const isActive = activeSubject === subj.id;
              const isDone = completedMiniGames.includes(subj.id);

              return (
                <button
                  key={subj.id}
                  onClick={() => setActiveSubject(subj.id)}
                  className={`px-2.5 py-2 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 ${
                    isActive
                      ? 'bg-[#F14E13] border-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 hover:border-emerald-400'
                      : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base shrink-0">{subj.icon}</span>
                    <div className="min-w-0">
                      <div className="font-poppins font-bold text-xs truncate">{subj.label}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-white/90' : 'text-[#B5CBC8]/75'
                        }`}
                      >
                        {subj.shortTitle}
                      </div>
                    </div>
                  </div>
                  {isDone && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white' : 'text-emerald-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ORTA ALAN: Aktif Mini Oyun Sahnesi */}
        <div ref={scrollContainerRef} className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-3">
          {/* O DERS BİTTİĞİNDE: SONRAKİ DERSE GEÇ BARI */}
          {isCurrentDone && (
            <div className="bg-gradient-to-r from-emerald-950/80 via-[#1A0E1C] to-emerald-950/80 border-2 border-emerald-400 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl shadow-emerald-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center text-xl shrink-0">
                  🎉
                </div>
                <div>
                  <div className="font-poppins font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <span>{MINI_GAME_SUBJECTS[currentIndex].label} Dersi Başarıyla Tamamlandı!</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {completedMiniGames.length}/6 Bitti
                    </span>
                  </div>
                  <p className="text-[11px] text-[#B5CBC8] mt-0.5">
                    Tebrikler! Sıradaki öğretici oyuna geçebilir veya 1v1 Arenaya katılabilirsin.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                {nextUnsolvedSubject ? (
                  <button
                    onClick={handleNextSubject}
                    className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-600/30 w-full sm:w-auto"
                  >
                    <span>Sıradaki Çözülmemiş Derse Geç ({nextUnsolvedSubject.icon} {nextUnsolvedSubject.label})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 !bg-purple-600 hover:!bg-purple-500 shadow-lg shadow-purple-600/30 w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Tüm Dersler Tamamlandı - Çıkış Yap</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {isCompetitiveUnlocked && !isCurrentDone && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">1v1 Rekabetçi Arena Açıldı!</strong> Hemen maça geçebilir veya üstten diğer dersleri deneyebilirsin.
                </span>
              </div>
              <button
                onClick={onProceedToArena}
                className="btn-primary !py-1.5 !px-3.5 text-xs font-bold shrink-0 !bg-emerald-600 hover:!bg-emerald-500 flex items-center gap-1"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Düelloya Başla →</span>
              </button>
            </div>
          )}

          {activeSubject === 'biyoloji' && (
            <BioCellGame
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
          {activeSubject === 'kimya' && (
            <ChemMoleculeGame
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
          {activeSubject === 'fizik' && (
            <PhysBalanceGame
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
          {activeSubject === 'matematik' && (
            <MathProfitGame
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
          {activeSubject === 'geometri' && (
            <GeoShapePuzzle
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
          {activeSubject === 'turkce' && (
            <TurkRapBattle
              onComplete={handleCompleteCurrent}
              onNextSubject={handleNextSubject}
              nextSubjectName={nextUnsolvedSubject ? nextUnsolvedSubject.label : (areAllMiniGamesDone ? 'Çıkış' : undefined)}
            />
          )}
        </div>

        {/* =====================================================================
         * DOCKED BOTTOM BAR: DERS BİTTİĞİNDE ASLA SCROLL ETMEYE GEREK KALMAZ
         * Modalın en altına sabitlenir, kullanıcı anında bir sonrakine geçer.
         * ===================================================================== */}
        {isCurrentDone && (
          <aside aria-label="Günlük Görev Aksiyonu" className="bg-[#180A1A]/98 backdrop-blur-md border-t-2 border-emerald-400 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-30 animate-slide-up">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl shrink-0">🎉</span>
              <div className="min-w-0">
                <span className="font-poppins font-black text-xs sm:text-sm text-white block truncate">
                  {MINI_GAME_SUBJECTS[currentIndex].label} Dersi Tamamlandı! ({completedMiniGames.length}/6 Bitti)
                </span>
                <span className="text-[11px] text-emerald-300/80 font-mono hidden sm:block truncate">
                  {nextUnsolvedSubject
                    ? `Sıradaki çözülmemiş derse (${nextUnsolvedSubject.label}) tek tıkla geçebilirsiniz.`
                    : 'Tüm mini oyunlar tamamlandı!'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {nextUnsolvedSubject ? (
                <button
                  type="button"
                  onClick={handleNextSubject}
                  className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center justify-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-95 animate-pulse"
                >
                  <span>Sıradaki Derse Geç ({nextUnsolvedSubject.icon} {nextUnsolvedSubject.label})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center justify-center gap-1.5 !bg-purple-600 hover:!bg-purple-500 shadow-lg shadow-purple-600/30 active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Tamamla & Çıkış</span>
                </button>
              )}

              {isCompetitiveUnlocked && (
                <button
                  type="button"
                  onClick={onProceedToArena}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">1v1 Arenaya Geç</span>
                </button>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DailyMiniGameModal;
