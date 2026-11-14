import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  Zap,
  BatteryCharging,
  Flashlight,
  AlertTriangle,
  ArrowRight,
  Flame,
  Wrench,
} from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface PhysBalanceGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

/* ============================================================================
 * OYUN 1 VERİLERİ: TORK & DENGE (ŞANTİYE KULE VİNCİ)
 * ============================================================================ */
interface LevelConfig {
  level: number;
  title: string;
  description: string;
  fixedLeft: Record<number, number[]>; // distance (1..4) -> array of masses
  fixedRight: Record<number, number[]>;
  availableWeights: { id: string; mass: number; color: string }[];
  hint: string;
}

const LEVELS: LevelConfig[] = [
  {
    level: 1,
    title: 'Aşama 1/2: Temel Kuvvet Kolu & Tork Dengesi',
    description:
      'Sol kolda 3d uzaklıkta 4 kg kütle bulunuyor (τ_sol = 4 × 3 = 12 birim). Elindeki kütleleri bölmelere yerleştirerek çubuğu yatay dengeye (Στ_sol = Στ_sağ) getir!',
    fixedLeft: { 3: [4] },
    fixedRight: {},
    availableWeights: [
      { id: 'w1-2', mass: 2, color: '#3B82F6' },
      { id: 'w1-3', mass: 3, color: '#10B981' },
      { id: 'w1-5', mass: 5, color: '#F59E0B' },
    ],
    hint: 'İpucu: τ = F · d formülüne göre 12 birimlik torku dengelemek için 3 kg kütleyi 4d bölmesine (3 × 4 = 12) koyabilir veya birden fazla kütleyi birleştirebilirsin!',
  },
  {
    level: 2,
    title: 'Aşama 2/2: Çoklu Kütle & Bileşke Tork Dengesi',
    description:
      'Sol kolda 4d bölmesinde 3 kg (τ=12) ve 1d bölmesinde 2 kg (τ=2) sabit kütle var (Toplam τ_sol = 14 birim). Elindeki kütlelerle sağ kolu (veya her iki kolu) kullanarak net torku sıfırla!',
    fixedLeft: { 4: [3], 1: [2] },
    fixedRight: {},
    availableWeights: [
      { id: 'w2-2', mass: 2, color: '#3B82F6' },
      { id: 'w2-3', mass: 3, color: '#10B981' },
      { id: 'w2-5', mass: 5, color: '#F59E0B' },
    ],
    hint: 'İpucu: Sol tork 14 birim. Örneğin sağ 4d bölmesine 3 kg (3×4=12) ve sağ 1d bölmesine 2 kg (2×1=2) yerleştirirsen 12 + 2 = 14 birim ile tam denge sağlanır!',
  },
];

/* ============================================================================
 * OYUN 2 VERİLERİ: FENER & KOMBİ TAMİRİ (SÜRÜKLE-BIRAK DEVRE & PİL ÖMRÜ)
 * ============================================================================ */
type ConnectionType = 'paralel' | 'seri';
type LedTypeId = 'led-eco' | 'led-std' | 'led-turbo';

interface BatteryItem {
  id: string;
  label: string;
  voltage: number;
}

interface ConnectionRailItem {
  id: ConnectionType;
  name: string;
  badge: string;
  formulaNote: string;
  description: string;
  color: string;
}

interface LedHeadItem {
  id: LedTypeId;
  name: string;
  resistance: number;
  beamColor: string;
  badgeColor: string;
  powerLabel: string;
  description: string;
}

const BATTERIES: BatteryItem[] = [
  { id: 'bat-1', label: '1.5V Özdeş Pil #1', voltage: 1.5 },
  { id: 'bat-2', label: '1.5V Özdeş Pil #2', voltage: 1.5 },
  { id: 'bat-3', label: '1.5V Özdeş Pil #3', voltage: 1.5 },
];

const CONNECTION_RAILS: ConnectionRailItem[] = [
  {
    id: 'paralel',
    name: 'Paralel Bağlantı Rayı',
    badge: 'V_eş = V • I_pil = I / N',
    formulaNote: 'Akımı piller arasında böler, pil ömrünü N kat uzatır',
    description: 'Tüm (+) kutuplar bir kola, (-) kutuplar diğer kola bağlanır.',
    color: '#10B981',
  },
  {
    id: 'seri',
    name: 'Seri Bağlantı Rayı',
    badge: 'V_eş = N·V • I_pil = I',
    formulaNote: 'Gerilimi artırır ama her pilden tam akım çektiği için pilleri hızla tüketir',
    description: 'Piller uç uca (+ kutup - kutba gelecek şekilde) dizilir.',
    color: '#F59E0B',
  },
];

const LED_HEADS: LedHeadItem[] = [
  {
    id: 'led-eco',
    name: 'Tasarruflu Eko-Beyaz LED',
    resistance: 12,
    beamColor: 'rgba(224, 242, 254, 0.85)',
    badgeColor: '#38BDF8',
    powerLabel: '12 Ω • Düşük Akım',
    description: 'Yüksek direnç (12Ω) sayesinde az akım çeker, odaklı ve uzun ömürlü ışık verir.',
  },
  {
    id: 'led-std',
    name: 'Standart Sarı Ampul',
    resistance: 6,
    beamColor: 'rgba(253, 224, 71, 0.78)',
    badgeColor: '#FACC15',
    powerLabel: '6 Ω • Orta Akım',
    description: 'Orta dirençli (6Ω) klasik ampul. Pilleri orta hızda tüketir.',
  },
  {
    id: 'led-turbo',
    name: 'Turbo Halojen Başlık',
    resistance: 2.5,
    beamColor: 'rgba(251, 146, 60, 0.90)',
    badgeColor: '#F97316',
    powerLabel: '2.5 Ω • Aşırı Akım',
    description: 'Düşük direnç (2.5Ω) yüzünden devreden aşırı akım çeker, pili su gibi içer!',
  },
];

const TARGET_REPAIR_MINUTES = 45;
const BATTERY_CAPACITY_FACTOR = 2.5;

interface DragPayload {
  kind: 'battery' | 'rail' | 'led';
  id: string;
}

export const PhysBalanceGame: React.FC<PhysBalanceGameProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // Fizik içindeki 2 mini oyun arasında geçiş ('torque' | 'flashlight')
  const [activePhysGame, setActivePhysGame] = useState<'torque' | 'flashlight'>('torque');
  const [torqueDone, setTorqueDone] = useState<boolean>(false);
  const [flashlightDone, setFlashlightDone] = useState<boolean>(false);

  /* --------------------------------------------------------------------------
   * OYUN 1 STATE & FONKSİYONLARI: TORK & DENGE
   * -------------------------------------------------------------------------- */
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const currentLevel = LEVELS[levelIdx];
  const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
    LEVELS[0].availableWeights[1].id
  );
  const [placements, setPlacements] = useState<
    Record<string, { side: 'left' | 'right'; distance: number }>
  >({});

  const calculateTorques = () => {
    let leftTorque = 0;
    let rightTorque = 0;
    const leftFormulaParts: string[] = [];
    const rightFormulaParts: string[] = [];

    for (let d = 1; d <= 4; d++) {
      const fixedL = currentLevel.fixedLeft[d] || [];
      fixedL.forEach((m) => {
        leftTorque += m * d;
        leftFormulaParts.push(`(${m}kg × ${d}d)`);
      });
      const fixedR = currentLevel.fixedRight[d] || [];
      fixedR.forEach((m) => {
        rightTorque += m * d;
        rightFormulaParts.push(`(${m}kg × ${d}d)`);
      });
    }

    Object.entries(placements).forEach(([wId, pos]) => {
      const wObj = currentLevel.availableWeights.find((w) => w.id === wId);
      if (!wObj) return;
      if (pos.side === 'left') {
        leftTorque += wObj.mass * pos.distance;
        leftFormulaParts.push(`(${wObj.mass}kg × ${pos.distance}d)`);
      } else {
        rightTorque += wObj.mass * pos.distance;
        rightFormulaParts.push(`(${wObj.mass}kg × ${pos.distance}d)`);
      }
    });

    return {
      leftTorque,
      rightTorque,
      netTorque: rightTorque - leftTorque,
      leftFormula: leftFormulaParts.length > 0 ? leftFormulaParts.join(' + ') : '0',
      rightFormula: rightFormulaParts.length > 0 ? rightFormulaParts.join(' + ') : '0',
    };
  };

  const { leftTorque, rightTorque, netTorque, leftFormula, rightFormula } = calculateTorques();
  const isBalanced = leftTorque > 0 && leftTorque === rightTorque;
  const tiltDeg = Math.max(-16, Math.min(16, netTorque * 1.4));
  const placedCount = Object.keys(placements).length;

  const handlePlaceOnSlot = (side: 'left' | 'right', distance: number) => {
    if (!selectedWeightId) return;

    const nextPlacements = {
      ...placements,
      [selectedWeightId]: { side, distance },
    };
    setPlacements(nextPlacements);

    let nextL = 0;
    let nextR = 0;
    for (let d = 1; d <= 4; d++) {
      (currentLevel.fixedLeft[d] || []).forEach((m) => (nextL += m * d));
      (currentLevel.fixedRight[d] || []).forEach((m) => (nextR += m * d));
    }
    Object.entries(nextPlacements).forEach(([wId, pos]) => {
      const wObj = currentLevel.availableWeights.find((w) => w.id === wId);
      if (!wObj) return;
      if (pos.side === 'left') nextL += wObj.mass * pos.distance;
      else nextR += wObj.mass * pos.distance;
    });

    if (nextL > 0 && nextL === nextR) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playClick();
    }

    const nextUnplaced = currentLevel.availableWeights.find(
      (w) => w.id !== selectedWeightId && !nextPlacements[w.id]
    );
    if (nextUnplaced) {
      setSelectedWeightId(nextUnplaced.id);
    }
  };

  const handleRemoveWeight = (wId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlacements((prev) => {
      const copy = { ...prev };
      delete copy[wId];
      return copy;
    });
    setSelectedWeightId(wId);
  };

  const handleTorqueNextOrFinish = () => {
    if (!isBalanced) return;
    if (levelIdx < LEVELS.length - 1) {
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setPlacements({});
      setSelectedWeightId(LEVELS[nextIdx].availableWeights[0].id);
    } else {
      setTorqueDone(true);
      onComplete();
      // 1. oyun bittiğinde oyuncuyu 2. fizik oyununa (Fener & Kombi) geçir
      setActivePhysGame('flashlight');
    }

    const scrollParent = rootRef.current?.closest('.overflow-y-auto');
    if (scrollParent) {
      scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetTorqueLevel = () => {
    setPlacements({});
    setSelectedWeightId(currentLevel.availableWeights[0].id);
  };

  /* --------------------------------------------------------------------------
   * OYUN 2 STATE & FONKSİYONLARI: FENER & KOMBİ TAMİRİ (SÜRÜKLE-BIRAK)
   * -------------------------------------------------------------------------- */
  const [batterySlots, setBatterySlots] = useState<(string | null)[]>([null, null, null]);
  const [installedRail, setInstalledRail] = useState<ConnectionType | null>(null);
  const [installedLed, setInstalledLed] = useState<LedTypeId | null>(null);

  const [activeDrag, setActiveDrag] = useState<DragPayload | null>(null);
  const [selectedPart, setSelectedPart] = useState<DragPayload | null>(null);
  const [dragOverZone, setDragOverZone] = useState<
    'battery-0' | 'battery-1' | 'battery-2' | 'rail' | 'led' | null
  >(null);

  const [testState, setTestState] = useState<'idle' | 'testing' | 'failed_dark' | 'success'>('idle');
  const [simElapsedMinutes, setSimElapsedMinutes] = useState<number>(0);
  const [dadMessage, setDadMessage] = useState<string>(
    'Oğlum/Kızım kombi yine F2 arızası verdi, ev buz kesti! Elimdeki fener yere düşüp dağıldı; şu parçaları sürükleyip feneri EN UZUN SÜRE yanacak şekilde topla da bana ışık tut! İşim en az 45 dakika sürecek, sakın yarı yolda söndürme!'
  );

  const placedBatteries = batterySlots.filter((b): b is string => b !== null);
  const batteryCount = placedBatteries.length;
  const currentLedObj = LED_HEADS.find((l) => l.id === installedLed) || null;
  const currentRailObj = CONNECTION_RAILS.find((r) => r.id === installedRail) || null;

  const calculateCircuitMetrics = () => {
    if (batteryCount === 0 || !installedRail || !currentLedObj) {
      return {
        isReady: false,
        vEq: 0,
        iMain: 0,
        iBattery: 0,
        durationMinutes: 0,
      };
    }

    const vSingle = 1.5;
    const rLed = currentLedObj.resistance;
    const vEq = installedRail === 'seri' ? batteryCount * vSingle : vSingle;
    const iMain = vEq / rLed;
    const iBattery = installedRail === 'seri' ? iMain : iMain / batteryCount;
    const rawMinutes = BATTERY_CAPACITY_FACTOR / iBattery;
    const durationMinutes = Math.round(rawMinutes * 10) / 10;

    return {
      isReady: true,
      vEq: Math.round(vEq * 10) / 10,
      iMain: Math.round(iMain * 1000) / 1000,
      iBattery: Math.round(iBattery * 1000) / 1000,
      durationMinutes,
    };
  };

  const metrics = calculateCircuitMetrics();

  const resetTestIfActive = () => {
    if (testState === 'failed_dark') {
      setTestState('idle');
      setSimElapsedMinutes(0);
    }
  };

  const placeBatteryInSlot = (batteryId: string, targetSlotIdx?: number) => {
    if (testState === 'testing') return;
    resetTestIfActive();

    setBatterySlots((prev) => {
      const next = [...prev];
      const existingIdx = next.indexOf(batteryId);
      if (existingIdx !== -1) {
        next[existingIdx] = null;
      }

      if (typeof targetSlotIdx === 'number') {
        next[targetSlotIdx] = batteryId;
      } else {
        const firstEmpty = next.findIndex((s) => s === null);
        if (firstEmpty !== -1) {
          next[firstEmpty] = batteryId;
        } else {
          next[0] = batteryId;
        }
      }
      return next;
    });
    soundEngine.playClick();
    setSelectedPart(null);
  };

  const removeBatteryFromSlot = (slotIdx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (testState === 'testing') return;
    resetTestIfActive();
    setBatterySlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    soundEngine.playClick();
  };

  const placeRail = (railId: ConnectionType) => {
    if (testState === 'testing') return;
    resetTestIfActive();
    setInstalledRail(railId);
    soundEngine.playClick();
    setSelectedPart(null);
  };

  const placeLed = (ledId: LedTypeId) => {
    if (testState === 'testing') return;
    resetTestIfActive();
    setInstalledLed(ledId);
    soundEngine.playClick();
    setSelectedPart(null);
  };

  const handleDragStart = (e: React.DragEvent, payload: DragPayload) => {
    if (testState === 'testing') return;
    setActiveDrag(payload);
    setSelectedPart(payload);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setActiveDrag(null);
    setDragOverZone(null);
  };

  const handleDropOnBatterySlot = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverZone(null);
    let payload = activeDrag;
    if (!payload) {
      try {
        payload = JSON.parse(e.dataTransfer.getData('text/plain')) as DragPayload;
      } catch {
        payload = null;
      }
    }
    if (payload?.kind === 'battery') {
      placeBatteryInSlot(payload.id, slotIdx);
    }
    setActiveDrag(null);
  };

  const handleDropOnRailSlot = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
    let payload = activeDrag;
    if (!payload) {
      try {
        payload = JSON.parse(e.dataTransfer.getData('text/plain')) as DragPayload;
      } catch {
        payload = null;
      }
    }
    if (payload?.kind === 'rail') {
      placeRail(payload.id as ConnectionType);
    }
    setActiveDrag(null);
  };

  const handleDropOnLedSlot = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
    let payload = activeDrag;
    if (!payload) {
      try {
        payload = JSON.parse(e.dataTransfer.getData('text/plain')) as DragPayload;
      } catch {
        payload = null;
      }
    }
    if (payload?.kind === 'led') {
      placeLed(payload.id as LedTypeId);
    }
    setActiveDrag(null);
  };

  const handleTestFlashlight = () => {
    if (!metrics.isReady) {
      soundEngine.playWrong();
      setDadMessage(
        '😠 Baba: "Oğlum/Kızım fenerin parçaları hâlâ yerde! En az 1 pil, 1 bağlantı rayı (Seri/Paralel) ve 1 LED başlığı fener gövdesine sürükleyip takmadan bu fener nasıl yanacak?!"'
      );
      return;
    }

    setTestState('testing');
    setSimElapsedMinutes(0);
    soundEngine.playClick();
  };

  useEffect(() => {
    if (testState !== 'testing') return;

    const maxSimTarget = Math.min(metrics.durationMinutes, TARGET_REPAIR_MINUTES);
    const stepMinutes = Math.max(0.8, maxSimTarget / 22);

    const timer = setInterval(() => {
      setSimElapsedMinutes((prev) => {
        const next = Math.round((prev + stepMinutes) * 10) / 10;
        if (next >= maxSimTarget) {
          clearInterval(timer);

          if (metrics.durationMinutes >= TARGET_REPAIR_MINUTES) {
            soundEngine.playCorrect();
            setTestState('success');
            setDadMessage(
              `🤩 Baba: "Hah şöyle be! 3 özdeş pili PARALEL bağlayıp (I_pil = I/3) 12Ω Tasarruflu Eko-LED'i takmışsın. Tam 45 dakikada kombinin anakartını ve vanasını onardım, fenerin 60 dakikalık ömrü var, hâlâ ışıl ışıl yanıyor! Aferin benim fizik kurdu evladıma!"`
            );
            if (!flashlightDone) {
              setFlashlightDone(true);
              onComplete();
            }
          } else {
            soundEngine.playWrong();
            setTestState('failed_dark');

            if (installedRail === 'seri') {
              setDadMessage(
                `🤬 Baba: "LA OĞLUM! Stadyum projektörü mü tutuyorsun?! Pilleri SERİ bağlamışsın (V_eş = ${metrics.vEq}V), fener sadece ${metrics.durationMinutes} dakikada zifiri karanlıkta bıraktı! Kombinin sıcak su borusuna elim değdi! Pilleri PARALEL bağla ki akım bölünsün de uzun süre yansın!"`
              );
            } else if (installedLed === 'led-turbo') {
              setDadMessage(
                `😡 Baba: "Evladım karanlıkta kaldım, anahtar elimden düştü! Taktığın Turbo Halojen başlık (2.5Ω) devreden aşırı akım çekiyor, fener ${metrics.durationMinutes} dakikada bitti! Şu 12Ω'luk Tasarruflu Eko-Beyaz LED'i tak da akım azalsın!"`
              );
            } else if (installedLed === 'led-std') {
              setDadMessage(
                `😠 Baba: "Yavrum ${metrics.durationMinutes}. dakikada tam kombinin kartını sıkarken ışık söndü! Pilleri paralel bağlaman güzel ama Standart Sarı Ampul (6Ω) yerine direnci en yüksek olan 12Ω Tasarruflu Eko-LED'i tak ki akım yarıya düşsün!"`
              );
            } else {
              setDadMessage(
                `😤 Baba: "Ah be evladım, fener ${metrics.durationMinutes} dakika dayandı ama tam son vanayı sıkarken söndü! Doğru yoldasın, paralel bağlantı ve Eko-LED harika ama ${batteryCount} pil yetmedi; yerdeki 3 özdeş pilin HEPSİNİ paralel yuvaya sürükle ki akım 3'e bölünsün (60 dk yansın)!"`
              );
            }
          }
          return maxSimTarget;
        }
        return next;
      });
    }, 65);

    return () => clearInterval(timer);
  }, [testState, metrics.durationMinutes, installedRail, installedLed, batteryCount, flashlightDone, onComplete]);

  const handleResetFlashlight = () => {
    setBatterySlots([null, null, null]);
    setInstalledRail(null);
    setInstalledLed(null);
    setTestState('idle');
    setSimElapsedMinutes(0);
    setSelectedPart(null);
    setDadMessage(
      'Fener parçalarını tekrar masaya dizdik! En uzun yanma süresi (60 dk) için 3 özdeş pili, doğru bağlantı rayını ve en az akım çeken LED başlığı sürükleyip feneri topla!'
    );
  };

  const remainingBatteryPct =
    metrics.durationMinutes > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(((metrics.durationMinutes - simElapsedMinutes) / metrics.durationMinutes) * 100)
          )
        )
      : 0;

  const repairProgressPct = Math.min(
    100,
    Math.round((simElapsedMinutes / TARGET_REPAIR_MINUTES) * 100)
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-2.5">
      {/* =====================================================================
       * ÜST FİZİK OYUN SEÇİCİ BAR: 1. TORK & DENGE | 2. FENER & KOMBİ TAMİRİ
       * ===================================================================== */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActivePhysGame('torque')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            activePhysGame === 'torque'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/15'
              : torqueDone
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
              : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">⚖️</span>
            <div className="min-w-0">
              <div className="text-[9px] font-mono uppercase opacity-80">
                1. Fizik Mini Oyunu • Mekaniğin Temeli
              </div>
              <div className="font-poppins font-black text-xs sm:text-sm text-white truncate">
                Tork & Denge (Şantiye Vinci)
              </div>
            </div>
          </div>
          {torqueDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        </button>

        <button
          type="button"
          onClick={() => setActivePhysGame('flashlight')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            activePhysGame === 'flashlight'
              ? 'bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/15'
              : flashlightDone
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
              : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">🔦</span>
            <div className="min-w-0">
              <div className="text-[9px] font-mono uppercase opacity-80">
                2. Fizik Mini Oyunu • Sürükle-Bırak Devre
              </div>
              <div className="font-poppins font-black text-xs sm:text-sm text-white truncate">
                Kombi Tamiri & Fener Montajı
              </div>
            </div>
          </div>
          {flashlightDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        </button>
      </div>

      {/* =====================================================================
       * AKTİF OYUN 1: TORK & DENGE (KULE VİNCİ ŞANTİYESİ)
       * ===================================================================== */}
      {activePhysGame === 'torque' && (
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <div
            className={`rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3 transition-all duration-300 relative overflow-hidden shadow-lg ${
              isBalanced
                ? 'bg-gradient-to-r from-emerald-950/85 via-[#1D0D1F] to-[#120815] border-emerald-400 ring-1 ring-emerald-400/40 shadow-emerald-500/25'
                : placedCount > 0
                ? 'bg-gradient-to-r from-amber-950/85 via-[#1E0E21] to-orange-950/75 border-amber-400 ring-1 ring-amber-400/50 shadow-amber-500/25'
                : 'bg-gradient-to-r from-amber-950/80 via-[#1A0E1C] to-orange-950/70 border-amber-500/80 ring-1 ring-amber-400/40 shadow-amber-500/20'
            }`}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-2xl shadow-md transition-transform duration-300 ${
                      isBalanced
                        ? 'border-emerald-400 bg-emerald-500/25 scale-105 shadow-emerald-500/30'
                        : placedCount > 0
                        ? 'border-amber-400 bg-amber-500/25 animate-pulse'
                        : 'border-amber-500/70 bg-amber-500/20'
                    }`}
                  >
                    {isBalanced
                      ? '😎'
                      : placedCount === 0
                      ? '👷‍♂️'
                      : netTorque > 0
                      ? '😱'
                      : '😰'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-black text-[8px] font-bold text-black items-center justify-center">
                      !
                    </span>
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-poppins font-black text-[10px] tracking-wide uppercase shadow-sm flex items-center gap-1">
                      🚨 ŞANTİYE BRİFİNGİ
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-500/25 px-2 py-0.5 rounded-md border border-amber-400/50">
                      Kadir Usta • Aşama {currentLevel.level}/2
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
                      Formül: <strong className="text-amber-300">τ = F · d</strong>
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium leading-tight">
                    &ldquo;
                    {isBalanced
                      ? `Helal olsun! Sol tork (${leftTorque} N·m) ile sağ tork (${rightTorque} N·m) eşitlendi, vinç dengede!`
                      : placedCount === 0
                      ? levelIdx === 0
                        ? 'Sol kolda 3d uzaklıkta 4 kg yük asılı kaldı (τ_sol = 12 N·m). Sağa karşı ağırlık koy!'
                        : 'Sol kolda iki ayrı yük var (Toplam τ_sol = 14 N·m). Elindeki ağırlıklarla sağ kolu tam 14 N·m yap!'
                      : netTorque < 0
                      ? `Sol kol ağır basıyor (Sol: ${leftTorque} > Sağ: ${rightTorque})! Ağırlığı desteğe daha uzağa (3d/4d) taşı!`
                      : `Fazla oldu! Vinç sağa devrilecek (Sağ: ${rightTorque} > Sol: ${leftTorque})! Ağırlığı desteğe yaklaştır!`}
                    &rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                <div className="bg-black/50 border border-amber-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center sm:items-end justify-center min-w-[150px] shadow-inner">
                  <div className="text-[9px] font-mono uppercase text-amber-300 font-black flex items-center gap-1">
                    <span>🎯 HEDEF TORK</span>
                  </div>
                  <div className="text-[11px] font-mono font-black text-white text-center sm:text-right mt-0.5">
                    {isBalanced ? (
                      <span className="text-emerald-400 font-bold">✓ Tork Dengelendi!</span>
                    ) : (
                      <span className="text-amber-200">Sol {leftTorque} N·m = Sağ ?</span>
                    )}
                  </div>
                  <div className="text-[9px] text-zinc-300 text-center sm:text-right font-mono">
                    Sağ bölmelere ağırlık koy
                  </div>
                </div>

                {isBalanced && (
                  <button
                    onClick={handleTorqueNextOrFinish}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-mono font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/30 animate-pulse transition-all shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {levelIdx < LEVELS.length - 1
                        ? '2. Aşamaya Geç'
                        : 'Fener Oyununa Geç'}
                    </span>
                  </button>
                )}

                <button
                  onClick={handleResetTorqueLevel}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1 transition-all shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Topla</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canlı Tork Karşılaştırma Paneli */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0F0510] border border-orange-500/30 rounded-xl p-2 sm:p-2.5 text-center">
              <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">
                Sol Tork (Στ_sol)
              </div>
              <div className="font-mono font-black text-lg sm:text-xl text-[#F14E13] mt-0.5">
                {leftTorque} <span className="text-[10px] font-normal">N·m</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-400 truncate">{leftFormula}</div>
            </div>

            <div
              className={`border rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-center transition-all ${
                isBalanced
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#0F0510] border-white/10 text-amber-300'
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Net Tork Farkı (Δτ)</div>
              <div className="font-poppins font-black text-xs sm:text-sm mt-0.5">
                {isBalanced ? '✓ TAM DENGE (Δτ = 0)' : `Δτ = ${Math.abs(netTorque)} birim`}
              </div>
              <div className="text-[9px] font-mono opacity-80">
                {netTorque < 0
                  ? '↙ Sol ağır'
                  : netTorque > 0
                  ? '↘ Sağ ağır'
                  : 'Yatay dengede!'}
              </div>
            </div>

            <div className="bg-[#0F0510] border border-blue-500/30 rounded-xl p-2 sm:p-2.5 text-center">
              <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">
                Sağ Tork (Στ_sağ)
              </div>
              <div className="font-mono font-black text-lg sm:text-xl text-blue-400 mt-0.5">
                {rightTorque} <span className="text-[10px] font-normal">N·m</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-400 truncate">{rightFormula}</div>
            </div>
          </div>

          {/* İnteraktif Denge Çubuğu (Tahterevalli) Sahnesi */}
          <div className="bg-gradient-to-b from-[#1E1022] to-[#0F0510] border-2 border-orange-500/35 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[185px] sm:min-h-[210px] relative overflow-hidden">
            <div className="text-[10px] font-mono text-[#B5CBC8] mb-3 text-center">
              Alttan kütle seç, çubuktaki <strong className="text-white">1d, 2d, 3d, 4d</strong>{' '}
              bölmelerine tıkla! (Kaldırmak için kütleye tekrar tıkla)
            </div>

            <div
              className="w-full max-w-2xl transition-transform duration-500 ease-out relative"
              style={{ transform: `rotate(${tiltDeg}deg)` }}
            >
              <div className="grid grid-cols-9 items-end gap-1 sm:gap-2 pb-1.5">
                {[4, 3, 2, 1].map((d) => {
                  const fixedMasses = currentLevel.fixedLeft[d] || [];
                  const playerWeightsHere = Object.entries(placements)
                    .filter(([, pos]) => pos.side === 'left' && pos.distance === d)
                    .map(([wId]) => currentLevel.availableWeights.find((w) => w.id === wId)!)
                    .filter(Boolean);

                  return (
                    <button
                      key={`left-${d}`}
                      onClick={() => handlePlaceOnSlot('left', d)}
                      className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] p-1 rounded-xl border border-dashed border-orange-500/30 hover:border-[#F14E13] hover:bg-[#F14E13]/15 transition-all group"
                    >
                      <div className="flex flex-col gap-1 items-center mb-1">
                        {fixedMasses.map((m, idx) => (
                          <div
                            key={`fix-l-${d}-${idx}`}
                            className="px-1.5 py-0.5 rounded bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[9px] sm:text-[10px] shadow"
                            title="Sabit Kütle"
                          >
                            🔒{m}kg
                          </div>
                        ))}
                        {playerWeightsHere.map((w) => (
                          <div
                            key={w.id}
                            onClick={(e) => handleRemoveWeight(w.id, e)}
                            className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] text-white shadow cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: w.color }}
                            title="Kaldırmak için tıkla"
                          >
                            {w.mass}kg ✕
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-300 group-hover:text-white">
                        {d}d
                      </span>
                    </button>
                  );
                })}

                <div className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] pb-1">
                  <span className="text-[9px] font-mono text-amber-400 font-bold">Destek</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow shadow-amber-400/50 mt-1" />
                </div>

                {[1, 2, 3, 4].map((d) => {
                  const fixedMasses = currentLevel.fixedRight[d] || [];
                  const playerWeightsHere = Object.entries(placements)
                    .filter(([, pos]) => pos.side === 'right' && pos.distance === d)
                    .map(([wId]) => currentLevel.availableWeights.find((w) => w.id === wId)!)
                    .filter(Boolean);

                  return (
                    <button
                      key={`right-${d}`}
                      onClick={() => handlePlaceOnSlot('right', d)}
                      className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] p-1 rounded-xl border border-dashed border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/15 transition-all group"
                    >
                      <div className="flex flex-col gap-1 items-center mb-1">
                        {fixedMasses.map((m, idx) => (
                          <div
                            key={`fix-r-${d}-${idx}`}
                            className="px-1.5 py-0.5 rounded bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[9px] sm:text-[10px] shadow"
                          >
                            🔒{m}kg
                          </div>
                        ))}
                        {playerWeightsHere.map((w) => (
                          <div
                            key={w.id}
                            onClick={(e) => handleRemoveWeight(w.id, e)}
                            className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] text-white shadow cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: w.color }}
                            title="Kaldırmak için tıkla"
                          >
                            {w.mass}kg ✕
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-blue-300 group-hover:text-white">
                        {d}d
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`w-full h-3 rounded-full border transition-colors ${
                  isBalanced
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 border-emerald-300 shadow-md shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-[#F14E13] via-amber-400 to-blue-500 border-white/20'
                }`}
              />
            </div>

            <div className="flex flex-col items-center -mt-0.5">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '16px solid transparent',
                  borderRight: '16px solid transparent',
                  borderBottom: '22px solid #F14E13',
                }}
              />
              <div className="w-20 h-1.5 bg-white/20 rounded-full" />
            </div>
          </div>

          {/* Alt Kütle Seçim Envanteri */}
          <div className="bg-[#0F0510] border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#B5CBC8] mr-1">Kütleler:</span>
              {currentLevel.availableWeights.map((w) => {
                const placedPos = placements[w.id];
                const isSelected = selectedWeightId === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeightId(w.id)}
                    className={`px-2.5 py-1.5 rounded-lg sm:rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'border-white scale-105 shadow-md'
                        : 'border-white/15 opacity-85 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: `${w.color}25`,
                      color: '#fff',
                      borderColor: isSelected ? '#fff' : w.color,
                    }}
                  >
                    <span>🏋️ {w.mass} kg</span>
                    {placedPos ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300">
                        ({placedPos.side === 'left' ? 'Sol' : 'Sağ'} {placedPos.distance}d)
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-300">Boşta</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isBalanced ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleTorqueNextOrFinish}
                  className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {levelIdx < LEVELS.length - 1
                      ? '2. Aşamaya Geç'
                      : '2. Oyuna Geç (Fener & Kombi)'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-[#B5CBC8] flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentLevel.hint}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
       * AKTİF OYUN 2: KOMBİ TAMİRİ & FENER MONTAJI (SÜRÜKLE - BIRAK)
       * ===================================================================== */}
      {activePhysGame === 'flashlight' && (
        <div className="flex flex-col gap-2.5">
          {/* 1. ÜST SAHNE: BABA & KOMBİ TAMİRİ + CANLI FENER IŞIĞI SİMÜLASYONU */}
          <div
            className={`rounded-2xl border-2 p-3 transition-all duration-500 relative overflow-hidden shadow-lg ${
              testState === 'failed_dark'
                ? 'bg-gradient-to-r from-red-950/95 via-[#09040A] to-black border-red-500 ring-1 ring-red-500/50 shadow-red-600/30'
                : testState === 'success'
                ? 'bg-gradient-to-r from-emerald-950/90 via-[#111E1C] to-[#0B1316] border-emerald-400 ring-1 ring-emerald-400/50 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-amber-950/85 via-[#180D1B] to-[#100713] border-amber-500/80 ring-1 ring-amber-400/30'
            }`}
          >
            {(testState === 'testing' || testState === 'success') && currentLedObj && (
              <div
                className="absolute inset-y-0 left-1/4 right-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 80% 50%, ${currentLedObj.beamColor}, transparent 70%)`,
                  opacity: installedRail === 'seri' ? 0.45 : 0.3,
                }}
              />
            )}

            {testState === 'failed_dark' && (
              <div className="absolute inset-0 bg-black/55 pointer-events-none z-0 animate-pulse" />
            )}

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-transform duration-300 ${
                      testState === 'failed_dark'
                        ? 'border-red-500 bg-red-500/25 animate-bounce scale-105'
                        : testState === 'success'
                        ? 'border-emerald-400 bg-emerald-500/25 scale-105'
                        : testState === 'testing'
                        ? 'border-sky-400 bg-sky-500/20'
                        : 'border-amber-400 bg-amber-500/20'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">
                      {testState === 'failed_dark'
                        ? '🤬'
                        : testState === 'success'
                        ? '🤩'
                        : testState === 'testing'
                        ? '🧐'
                        : '👨‍🔧'}
                    </span>
                    <span className="text-[8px] font-mono font-black uppercase tracking-wider mt-1 px-1.5 py-0.2 rounded bg-black/60 text-amber-300">
                      BABAM
                    </span>
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                      testState === 'failed_dark'
                        ? 'bg-red-600 text-white border-red-300'
                        : testState === 'success'
                        ? 'bg-emerald-500 text-black border-emerald-200'
                        : 'bg-amber-400 text-black border-black'
                    }`}
                  >
                    {testState === 'failed_dark'
                      ? 'KIZGIN!'
                      : testState === 'success'
                      ? 'GURURLU'
                      : 'TAMİRDE'}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-poppins font-black text-[10px] uppercase tracking-wide flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      KOMBİ TAMİR KRİZİ
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/40">
                      Hedef Yanma Süresi: En Az {TARGET_REPAIR_MINUTES} dk
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sky-200 bg-sky-500/15 px-2 py-0.5 rounded-md border border-sky-400/30">
                      Üreteçlerin Bağlanması & Pil Ömrü
                    </span>
                  </div>

                  <div
                    className={`rounded-xl p-2.5 border text-xs sm:text-[13px] leading-relaxed font-medium ${
                      testState === 'failed_dark'
                        ? 'bg-red-950/90 border-red-500/70 text-red-100'
                        : testState === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100'
                        : 'bg-black/45 border-white/10 text-zinc-100'
                    }`}
                  >
                    {dadMessage}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-64 shrink-0 bg-[#0D0610]/90 border border-white/15 rounded-xl p-2.5 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Flame
                      className={`w-4 h-4 ${
                        testState === 'success'
                          ? 'text-emerald-400 animate-pulse'
                          : 'text-red-400'
                      }`}
                    />
                    <span className="font-poppins font-bold text-xs text-white">
                      Kombi Anakart & Vana
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      testState === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {testState === 'success' ? '24°C ÇALIŞIYOR' : 'ERR: F2 ARIZASI'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#B5CBC8]">Kombi Tamir Süresi:</span>
                    <span className="text-white font-bold">
                      {simElapsedMinutes} / {TARGET_REPAIR_MINUTES} dk (%{repairProgressPct})
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        testState === 'success'
                          ? 'bg-emerald-400'
                          : testState === 'failed_dark'
                          ? 'bg-red-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${repairProgressPct}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#B5CBC8]">Fener Pil Ömrü:</span>
                    <span
                      className={`font-bold ${
                        metrics.durationMinutes >= TARGET_REPAIR_MINUTES
                          ? 'text-emerald-300'
                          : metrics.isReady
                          ? 'text-amber-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {metrics.isReady
                        ? `Toplam ${metrics.durationMinutes} dk (${
                            testState === 'idle' ? '%100' : `%${remainingBatteryPct}`
                          })`
                        : 'Parçalar Eksik'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        testState === 'failed_dark' ? 'bg-red-500' : 'bg-sky-400'
                      }`}
                      style={{
                        width: `${
                          !metrics.isReady
                            ? 0
                            : testState === 'idle'
                            ? 100
                            : remainingBatteryPct
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ORTA ALAN: PARÇALANMIŞ FENER GÖVDESİ (SÜRÜKLE-BIRAK MONTAJ TEZGÂHI) */}
          <div className="bg-gradient-to-b from-[#1B0E20] to-[#0E0611] border-2 border-amber-500/35 rounded-2xl p-3 sm:p-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-poppins font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <Flashlight className="w-4 h-4 text-amber-400" />
                  <span>PARÇALANMIŞ FENER GÖVDESİ (SÜRÜKLE & BIRAK MONTAJ ALANI)</span>
                </h3>
                <p className="text-[11px] text-[#B5CBC8]">
                  Alttaki tepsiden <strong className="text-white">Pilleri</strong>,{' '}
                  <strong className="text-white">Seri/Paralel Bağlantı Rayını</strong> ve{' '}
                  <strong className="text-white">LED Başlığını</strong> fenerin ilgili yuvalarına
                  sürükleyip bırak!
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetFlashlight}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Feneri Sök</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestFlashlight}
                  disabled={testState === 'testing'}
                  className={`px-3.5 py-1.5 rounded-xl font-poppins font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                    metrics.isReady
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/25 active:scale-95'
                      : 'bg-white/10 text-zinc-400 border border-white/10'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {testState === 'testing'
                      ? 'Işık Tutuluyor...'
                      : '🔦 Feneri Yak & Babama Işık Tut!'}
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              {/* BÖLÜM A: 3 ADET PİL YUVASI */}
              <div className="lg:col-span-5 bg-[#120816] border-2 border-white/15 rounded-2xl p-2.5 flex flex-col justify-between relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    1. ÜRETEÇ (PİL) BÖLMESİ ({batteryCount}/3 Pil)
                  </span>
                  <span className="text-[10px] font-mono text-[#B5CBC8]">
                    Pilleri buraya sürükle
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-auto">
                  {[0, 1, 2].map((slotIdx) => {
                    const batId = batterySlots[slotIdx];
                    const batObj = BATTERIES.find((b) => b.id === batId);
                    const isDragTarget =
                      dragOverZone === `battery-${slotIdx}` ||
                      activeDrag?.kind === 'battery' ||
                      selectedPart?.kind === 'battery';

                    return (
                      <div
                        key={`slot-${slotIdx}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverZone(
                            `battery-${slotIdx}` as 'battery-0' | 'battery-1' | 'battery-2'
                          );
                        }}
                        onDragLeave={() => setDragOverZone(null)}
                        onDrop={(e) => handleDropOnBatterySlot(e, slotIdx)}
                        onClick={() => {
                          if (selectedPart?.kind === 'battery') {
                            placeBatteryInSlot(selectedPart.id, slotIdx);
                          } else if (batObj) {
                            removeBatteryFromSlot(slotIdx);
                          }
                        }}
                        className={`min-h-[82px] rounded-xl border-2 border-dashed p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          batObj
                            ? 'bg-emerald-500/15 border-emerald-400 shadow-inner'
                            : isDragTarget
                            ? 'bg-emerald-500/10 border-emerald-400/80 animate-pulse'
                            : 'bg-black/40 border-white/15 hover:border-white/30'
                        }`}
                      >
                        {batObj ? (
                          <>
                            <div className="flex items-center">
                              <div className="w-2.5 h-4 bg-red-500 rounded-l text-[8px] font-bold text-white flex items-center justify-center">
                                -
                              </div>
                              <div className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-mono font-black text-[10px] border-y border-emerald-300">
                                1.5V
                              </div>
                              <div className="w-2.5 h-4 bg-amber-400 rounded-r text-[8px] font-bold text-black flex items-center justify-center">
                                +
                              </div>
                              <div className="w-1 h-2 bg-amber-300 rounded-r" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-200 mt-1.5">
                              Pil #{slotIdx + 1} Takılı
                            </span>
                            <span className="text-[9px] text-zinc-400 hover:text-red-300">
                              (Çıkarmak için tıkla)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg opacity-45">🔋</span>
                            <span className="text-[10px] font-mono text-[#B5CBC8] mt-1">
                              Pil Yuvası #{slotIdx + 1}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-300/70">
                              Sürükle / Bırak
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BÖLÜM B: SERİ / PARALEL BAĞLANTI RAYI YUVASI */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverZone('rail');
                }}
                onDragLeave={() => setDragOverZone(null)}
                onDrop={handleDropOnRailSlot}
                onClick={() => {
                  if (selectedPart?.kind === 'rail') {
                    placeRail(selectedPart.id as ConnectionType);
                  }
                }}
                className={`lg:col-span-4 rounded-2xl border-2 border-dashed p-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                  currentRailObj
                    ? installedRail === 'paralel'
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-md'
                      : 'bg-amber-950/40 border-amber-400 shadow-md'
                    : dragOverZone === 'rail' ||
                      activeDrag?.kind === 'rail' ||
                      selectedPart?.kind === 'rail'
                    ? 'bg-amber-500/15 border-amber-400 animate-pulse'
                    : 'bg-[#120816] border-white/15 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-amber-300">
                    2. DEVRE BAĞLANTI RAYI
                  </span>
                  {currentRailObj && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInstalledRail(null);
                        resetTestIfActive();
                      }}
                      className="text-[9px] font-mono text-zinc-400 hover:text-red-300"
                    >
                      Değiştir ✕
                    </button>
                  )}
                </div>

                {currentRailObj ? (
                  <div className="my-auto flex flex-col items-center text-center py-1">
                    <div
                      className={`px-2.5 py-1 rounded-lg font-poppins font-black text-xs text-white border ${
                        installedRail === 'paralel'
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                          : 'bg-amber-500/25 border-amber-400 text-amber-200'
                      }`}
                    >
                      {installedRail === 'paralel' ? '🔀 PARALEL BAĞLANTI' : '➡️ SERİ BAĞLANTI'}
                    </div>
                    <div className="text-[10px] font-mono text-white mt-1 font-bold">
                      {currentRailObj.badge}
                    </div>
                    <p className="text-[10px] text-[#B5CBC8] mt-0.5 leading-snug">
                      {currentRailObj.formulaNote}
                    </p>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center justify-center text-center py-3">
                    <span className="text-xl opacity-50">🔌</span>
                    <span className="text-xs font-poppins font-bold text-white mt-1">
                      Bağlantı Rayı Yuvası Boş
                    </span>
                    <span className="text-[10px] font-mono text-amber-300/80 mt-0.5">
                      Alttan &ldquo;Paralel&rdquo; veya &ldquo;Seri&rdquo; rayı buraya sürükle!
                    </span>
                  </div>
                )}
              </div>

              {/* BÖLÜM C: FENER LED BAŞLIĞI YUVASI */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverZone('led');
                }}
                onDragLeave={() => setDragOverZone(null)}
                onDrop={handleDropOnLedSlot}
                onClick={() => {
                  if (selectedPart?.kind === 'led') {
                    placeLed(selectedPart.id as LedTypeId);
                  }
                }}
                className={`lg:col-span-3 rounded-r-3xl rounded-l-xl border-2 border-dashed p-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                  currentLedObj
                    ? 'bg-sky-950/40 border-sky-400 shadow-md'
                    : dragOverZone === 'led' ||
                      activeDrag?.kind === 'led' ||
                      selectedPart?.kind === 'led'
                    ? 'bg-sky-500/15 border-sky-400 animate-pulse'
                    : 'bg-[#120816] border-white/15 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-sky-300">
                    3. LED BAŞLIK YUVASI
                  </span>
                  {currentLedObj && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInstalledLed(null);
                        resetTestIfActive();
                      }}
                      className="text-[9px] font-mono text-zinc-400 hover:text-red-300"
                    >
                      Sök ✕
                    </button>
                  )}
                </div>

                {currentLedObj ? (
                  <div className="my-auto flex flex-col items-center text-center py-1">
                    <div className="text-2xl">💡</div>
                    <div className="font-poppins font-black text-xs text-white mt-0.5">
                      {currentLedObj.name}
                    </div>
                    <span
                      className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/50 border"
                      style={{
                        color: currentLedObj.badgeColor,
                        borderColor: currentLedObj.badgeColor,
                      }}
                    >
                      Direnç: {currentLedObj.powerLabel}
                    </span>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center justify-center text-center py-3">
                    <span className="text-xl opacity-50">🔦</span>
                    <span className="text-xs font-poppins font-bold text-white mt-1">
                      LED Başlık Yuvası
                    </span>
                    <span className="text-[10px] font-mono text-sky-300/80 mt-0.5">
                      Alttan bir LED başlığı buraya sürükle!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CANLI FİZİK ÖLÇÜM ÇUBUĞU */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/50 border border-white/10 rounded-xl p-2">
              <div className="px-2 py-1 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] font-mono text-[#B5CBC8] uppercase">
                  Eşdeğer Gerilim (V_eş)
                </div>
                <div className="font-mono font-black text-sm text-amber-300">
                  {metrics.isReady ? `${metrics.vEq} V` : '—'}
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] font-mono text-[#B5CBC8] uppercase">
                  Anakol Akımı (I = V_eş / R)
                </div>
                <div className="font-mono font-black text-sm text-sky-300">
                  {metrics.isReady ? `${metrics.iMain} A` : '—'}
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] font-mono text-[#B5CBC8] uppercase">
                  Tek Pilden Çekilen Akım (I_pil)
                </div>
                <div className="font-mono font-black text-sm text-purple-300">
                  {metrics.isReady ? `${metrics.iBattery} A` : '—'}
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5 text-center">
                <div className="text-[9px] font-mono text-[#B5CBC8] uppercase">
                  Tahmini Yanma Süresi (t ∝ 1/I_pil)
                </div>
                <div
                  className={`font-mono font-black text-sm ${
                    !metrics.isReady
                      ? 'text-zinc-400'
                      : metrics.durationMinutes >= TARGET_REPAIR_MINUTES
                      ? 'text-emerald-400'
                      : 'text-orange-400'
                  }`}
                >
                  {metrics.isReady ? `${metrics.durationMinutes} Dakika` : 'Parça Bekleniyor'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. ALT TEPSİ: YERE DAĞILMIŞ FENER PARÇALARI (SÜRÜKLE - BIRAK ENVANTERİ) */}
          <div className="bg-[#0F0510] border border-white/15 rounded-2xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-poppins font-bold text-white flex items-center gap-1.5">
                <span>🧰 YERE DAĞILAN FENER PARÇALARI</span>
                <span className="text-[10px] font-mono font-normal text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Parçayı tut ve yukarıdaki fener yuvasına sürükle! (Veya parçaya tıklayıp yuvaya tıkla)
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* GRUP 1: ÖZDEŞ PİLLER */}
              <div className="bg-[#160B19] border border-emerald-500/30 rounded-xl p-2.5 flex flex-col gap-2">
                <div className="text-[11px] font-mono font-bold text-emerald-300 uppercase">
                  🔋 1. Özdeş Piller (1.5V)
                </div>
                <div className="flex flex-col gap-1.5">
                  {BATTERIES.map((bat) => {
                    const isPlaced = batterySlots.includes(bat.id);
                    const isSelected =
                      selectedPart?.kind === 'battery' && selectedPart.id === bat.id;

                    return (
                      <div
                        key={bat.id}
                        draggable={!isPlaced && testState !== 'testing'}
                        onDragStart={(e) =>
                          handleDragStart(e, { kind: 'battery', id: bat.id })
                        }
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          if (isPlaced || testState === 'testing') return;
                          placeBatteryInSlot(bat.id);
                        }}
                        className={`px-2.5 py-2 rounded-xl border font-mono text-xs flex items-center justify-between transition-all ${
                          isPlaced
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400/60 opacity-60 cursor-default'
                            : isSelected
                            ? 'bg-emerald-500/25 border-white text-white scale-[1.02] cursor-grab'
                            : 'bg-black/40 border-emerald-500/40 text-white hover:border-emerald-400 hover:bg-emerald-500/15 cursor-grab active:cursor-grabbing'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>🔋</span>
                          <span className="font-bold">{bat.label}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {isPlaced ? 'Yuvada ✓' : 'Sürükle / Ekle'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRUP 2: BAĞLANTI RAYLARI */}
              <div className="bg-[#160B19] border border-amber-500/30 rounded-xl p-2.5 flex flex-col gap-2">
                <div className="text-[11px] font-mono font-bold text-amber-300 uppercase">
                  🔌 2. Pil Bağlantı Rayları
                </div>
                <div className="flex flex-col gap-2">
                  {CONNECTION_RAILS.map((rail) => {
                    const isInstalled = installedRail === rail.id;
                    const isSelected =
                      selectedPart?.kind === 'rail' && selectedPart.id === rail.id;

                    return (
                      <div
                        key={rail.id}
                        draggable={testState !== 'testing'}
                        onDragStart={(e) =>
                          handleDragStart(e, { kind: 'rail', id: rail.id })
                        }
                        onDragEnd={handleDragEnd}
                        onClick={() => placeRail(rail.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-grab active:cursor-grabbing ${
                          isInstalled
                            ? 'bg-amber-500/25 border-amber-400 text-white shadow-md'
                            : isSelected
                            ? 'bg-amber-500/20 border-white text-white'
                            : 'bg-black/40 border-amber-500/35 text-white hover:border-amber-400 hover:bg-amber-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-poppins font-bold text-xs">{rail.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-amber-300">
                            {isInstalled ? 'Takılı ✓' : 'Sürükle'}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-amber-200 mt-0.5">
                          {rail.badge}
                        </div>
                        <div className="text-[10px] text-[#B5CBC8] mt-0.5 leading-tight">
                          {rail.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRUP 3: FARKLI LED BAŞLIKLARI */}
              <div className="bg-[#160B19] border border-sky-500/30 rounded-xl p-2.5 flex flex-col gap-2">
                <div className="text-[11px] font-mono font-bold text-sky-300 uppercase">
                  💡 3. Farklı LED Başlıkları
                </div>
                <div className="flex flex-col gap-1.5">
                  {LED_HEADS.map((led) => {
                    const isInstalled = installedLed === led.id;
                    const isSelected =
                      selectedPart?.kind === 'led' && selectedPart.id === led.id;

                    return (
                      <div
                        key={led.id}
                        draggable={testState !== 'testing'}
                        onDragStart={(e) =>
                          handleDragStart(e, { kind: 'led', id: led.id })
                        }
                        onDragEnd={handleDragEnd}
                        onClick={() => placeLed(led.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-grab active:cursor-grabbing ${
                          isInstalled
                            ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                            : isSelected
                            ? 'bg-sky-500/20 border-white text-white'
                            : 'bg-black/40 border-sky-500/35 text-white hover:border-sky-400 hover:bg-sky-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-poppins font-bold text-xs">{led.name}</span>
                          <span
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50"
                            style={{ color: led.badgeColor }}
                          >
                            {led.powerLabel}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#B5CBC8] mt-0.5 leading-tight">
                          {led.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="text-[11px] font-mono text-[#B5CBC8] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">TYT Fizik İpucu:</strong> Bir üretecin tükenme
                  süresi üzerinden geçen akımla ters orantılıdır (
                  <strong className="text-emerald-300">Paralel piller</strong> akımı böler,{' '}
                  <strong className="text-sky-300">büyük dirençli LED</strong> akımı azaltır!).
                </span>
              </div>

              {testState === 'success' && onNextSubject && (
                <button
                  type="button"
                  onClick={onNextSubject}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-poppins font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sıradaki Ders ({nextSubjectName || 'İleri'})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysBalanceGame;
