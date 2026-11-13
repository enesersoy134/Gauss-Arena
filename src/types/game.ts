/**
 * 🎮 İşler Hackathon '26 - Oyun & Soru Veri Tipleri
 * Kaynak: soru_tasarimlari/soru_tipleri.md & sahsi/tasarim_dili.md
 */

export type SubjectType = 'fizik' | 'kimya' | 'biyoloji' | 'matematik';
export type DifficultyLevel = 'kolay' | 'orta' | 'zor';

export type QuestionType =
  // 6 Ana Evrensel Fonksiyon:
  | 'universal_choice'
  | 'ordering_and_formula'
  | 'pair_matching'
  | 'swipe_grouping'
  | 'numpad_closest'
  | 'multi_select_bubble'
  // Değerlendirilen / Ek 8 Soru Tipi:
  | 'stepper_balance'
  | 'spot_the_bug'
  | 'progressive_clues'
  | 'target_combination'
  | 'chain_conversion'
  | 'matrix_toggle'
  | 'slider'
  | 'hotspot';

/**
 * Oyuncu Bilgi Modeli
 */
export interface PlayerInfo {
  id: string;
  name: string;
  elo: number;
  avatarUrl: string;
  streak: number;
}

/**
 * Karşılaşma Raunt Sonucu
 */
export interface RoundResult {
  questionId: string;
  player1Correct: boolean;
  player1Points: number;
  player1TimeMs: number;
  player2Correct: boolean;
  player2Points: number;
  player2TimeMs: number;
}

/**
 * Maç Ayarları Modeli
 */
export interface MatchSettings {
  matchId: string;
  questionsPerMatch: number;
  intermissionCountdownSec: number;
  eloWinDelta: number;
  eloLossDelta: number;
}

/**
 * Ortak Temel Soru Modeli
 */
export interface BaseQuestion<T = unknown> {
  id: string;
  subject: SubjectType;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  timeLimitSeconds: number;
  points: number;
  prompt: string;           // Oyuncuya gösterilecek ana soru metni / yönerge
  explanation?: string;     // Soru çözümü sonrası gösterilecek kısa açıklama
  payload: T;               // Soru tipine özel veri
}

/* =========================================================================
 * 1. UNIVERSAL CHOICE (Evrensel Seçim: test, true_false, comparison, odd_one_out)
 * ========================================================================= */
export type UniversalChoiceVariant = 'test' | 'true_false' | 'comparison' | 'odd_one_out';

export interface ComparisonPair {
  left: string;   // Sol kutudaki ifade / formül
  right: string;  // Sağ kutudaki ifade / formül
}

export interface UniversalChoicePayload {
  variant: UniversalChoiceVariant;
  optionCount: number;                  // 2, 3, 4, 6
  options: string[];                    // Buton metinleri
  comparisonItems?: ComparisonPair;     // Sadece variant === 'comparison' ise
  correctIndex: number;                 // 0-tabanlı doğru seçenek index'i
  shuffleOptions?: boolean;
}

export interface UniversalChoiceQuestion extends BaseQuestion<UniversalChoicePayload> {
  type: 'universal_choice';
}

/* =========================================================================
 * 2. ORDERING AND FORMULA (Sıralama ve Formül İnşası)
 * ========================================================================= */
export type OrderingMode = 'sequence' | 'formula_builder';

export interface OrderingAndFormulaPayload {
  mode: OrderingMode;
  directionLabel?: string;      // Örn: "İlk Evreden -> Son Evreye"
  template?: string;            // Örn: "[ ? ] = [ ? ] × [ ? ]"
  items: string[];              // Dağıtılacak blok / kapsül havuzu
  correctOrder: string[];       // Doğru dizilmiş eleman listesi
}

export interface OrderingAndFormulaQuestion extends BaseQuestion<OrderingAndFormulaPayload> {
  type: 'ordering_and_formula';
}

/* =========================================================================
 * 3. PAIR MATCHING (İkili Eşleştirme)
 * ========================================================================= */
export interface MatchingPair {
  pairId: string;
  leftText: string;
  rightText: string;
}

export interface PairMatchingPayload {
  leftColumnTitle?: string;
  rightColumnTitle?: string;
  pairs: MatchingPair[];
}

export interface PairMatchingQuestion extends BaseQuestion<PairMatchingPayload> {
  type: 'pair_matching';
}

/* =========================================================================
 * 4. SWIPE GROUPING (Kaydırarak Gruplama - Tinder Tarzı)
 * ========================================================================= */
export interface SwipeCategory {
  id: 'left' | 'right';
  label: string;          // Örn: "⬅️ Skaler Büyüklük"
  colorHex?: string;
}

export interface SwipeCardItem {
  id: string;
  text: string;
  correctCategory: 'left' | 'right';
}

export interface SwipeGroupingPayload {
  leftCategory: SwipeCategory;
  rightCategory: SwipeCategory;
  cards: SwipeCardItem[];
}

export interface SwipeGroupingQuestion extends BaseQuestion<SwipeGroupingPayload> {
  type: 'swipe_grouping';
}

/* =========================================================================
 * 5. NUMPAD CLOSEST (Sayısal Tahmin / Kasa Şifresi)
 * ========================================================================= */
export interface NumpadClosestPayload {
  correctAnswer: number;
  unit?: string;
  tolerance?: number;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  min?: number;
  max?: number;
}

export interface PlayerNumpadSubmission {
  playerId: string;
  answer: number;
  timeMs: number;
}

export interface NumpadEvaluationResult {
  winnerPlayerId: string | 'draw';
  playerADiff: number;
  playerBDiff: number;
  reason: 'closer_answer' | 'faster_speed' | 'exact_tie';
}

export interface NumpadClosestQuestion extends BaseQuestion<NumpadClosestPayload> {
  type: 'numpad_closest';
}

/* =========================================================================
 * 6. MULTI SELECT BUBBLE (Baloncuk Avı / Çoklu Seçim)
 * ========================================================================= */
export interface BubbleItem {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultiSelectBubblePayload {
  instruction: string;
  items: BubbleItem[];
  minRequiredCorrect?: number;
}

export interface MultiSelectBubbleQuestion extends BaseQuestion<MultiSelectBubblePayload> {
  type: 'multi_select_bubble';
}

/* =========================================================================
 * 7. STEPPER BALANCE (Katsayı Artır / Azalt)
 * ========================================================================= */
export interface StepperSlot {
  id: string;
  label?: string;
  initialValue: number;
  correctValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface StepperBalancePayload {
  equationTemplate: string;
  targetDescription?: string;
  slots: StepperSlot[];
}

export interface StepperBalanceQuestion extends BaseQuestion<StepperBalancePayload> {
  type: 'stepper_balance';
}

/* =========================================================================
 * 8. SPOT THE BUG (Hatalı Parçayı Bul)
 * ========================================================================= */
export interface BugBlockItem {
  id: string;
  blockText: string;
  isBug: boolean;
  feedbackNote?: string;
}

export interface SpotTheBugPayload {
  contextPrompt?: string;
  displayLayout: 'horizontal_formula' | 'vertical_steps';
  blocks: BugBlockItem[];
}

export interface SpotTheBugQuestion extends BaseQuestion<SpotTheBugPayload> {
  type: 'spot_the_bug';
}

/* =========================================================================
 * 9. PROGRESSIVE CLUES (Aşamalı İpucu / Ben Kimim?)
 * ========================================================================= */
export interface ProgressiveClueItem {
  stage: number;
  secondsToReveal: number;
  clueText: string;
  pointsReward: number;
}

export interface ProgressiveCluesPayload {
  clues: ProgressiveClueItem[];
  options: string[];
  correctIndex: number;
  revealIntervalSeconds?: number;
}

export interface ProgressiveCluesQuestion extends BaseQuestion<ProgressiveCluesPayload> {
  type: 'progressive_clues';
}

/* =========================================================================
 * 10. TARGET COMBINATION (Hedef Kombinasyon)
 * ========================================================================= */
export interface CombinationOptionItem {
  id: string;
  label: string;
  detailHint?: string;
}

export interface TargetCombinationPayload {
  targetBadge: string;
  ruleHint: string;
  options: CombinationOptionItem[];
  correctPairIds: [string, string];
}

export interface TargetCombinationQuestion extends BaseQuestion<TargetCombinationPayload> {
  type: 'target_combination';
}

/* =========================================================================
 * 11. CHAIN CONVERSION (Zincirleme Dönüşüm)
 * ========================================================================= */
export interface ChainStepItem {
  stepNumber: number;
  arrowLabel: string;
  correctValue: string;
}

export interface ChainConversionPayload {
  startEntity: string;
  steps: ChainStepItem[];
  poolOptions: string[];
}

export interface ChainConversionQuestion extends BaseQuestion<ChainConversionPayload> {
  type: 'chain_conversion';
}

/* =========================================================================
 * 12. MATRIX TOGGLE (Özellik Matrisi / Şalter Tablosu)
 * ========================================================================= */
export interface MatrixRowItem {
  id: string;
  title: string;
}

export interface MatrixColItem {
  id: string;
  title: string;
}

export interface MatrixCellValidation {
  rowId: string;
  colId: string;
  expectedBool: boolean;
}

export interface MatrixTogglePayload {
  tablePrompt: string;
  rows: MatrixRowItem[];
  columns: MatrixColItem[];
  answers: MatrixCellValidation[];
}

export interface MatrixToggleQuestion extends BaseQuestion<MatrixTogglePayload> {
  type: 'matrix_toggle';
}

/* =========================================================================
 * 13. SLIDER (Parametre Ayarlama)
 * ========================================================================= */
export interface SliderPayload {
  min: number;
  max: number;
  step: number;
  initialValue: number;
  unit: string;
  targetValue: number;
  tolerance: number;
  visualSimulationType?: string;
}

export interface SliderQuestion extends BaseQuestion<SliderPayload> {
  type: 'slider';
}

/* =========================================================================
 * 14. HOTSPOT (Görsel Hedefe Tıklama)
 * ========================================================================= */
export interface HotspotRegion {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
}

export interface HotspotPayload {
  imageUrl: string;
  imageAlt: string;
  regions: HotspotRegion[];
  correctRegionId: string;
}

export interface HotspotQuestion extends BaseQuestion<HotspotPayload> {
  type: 'hotspot';
}

/* =========================================================================
 * TÜM SORULARI KAPSAYAN ANA QUESTION UNION TİPİ
 * ========================================================================= */
export type Question =
  | UniversalChoiceQuestion
  | OrderingAndFormulaQuestion
  | PairMatchingQuestion
  | SwipeGroupingQuestion
  | NumpadClosestQuestion
  | MultiSelectBubbleQuestion
  | StepperBalanceQuestion
  | SpotTheBugQuestion
  | ProgressiveCluesQuestion
  | TargetCombinationQuestion
  | ChainConversionQuestion
  | MatrixToggleQuestion
  | SliderQuestion
  | HotspotQuestion;
