/**
 * 🎵 Gauss Arena - %100 Telifsiz Web Audio Sentezleyici & Sequencer
 * 
 * Jüri ve lisans güvenliği kuralı gereğince hiçbir harici MP3/WAV kullanılmaz;
 * tüm ses efektleri ve fon müzikleri Web Audio API ile gerçek zamanlı olarak
 * saf osilatör dalgaları (sine/triangle) ve filtreler (BiquadFilter) ile üretilir.
 */

type MusicMode = 'none' | 'lobby' | 'battle';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicEnabled: boolean = true;
  private currentMusicMode: MusicMode = 'none';

  // Dinamik Gerilim ve Tempo (Kalan süre azaldıkça artar)
  private tensionLevel: 0 | 1 | 2 = 0; // 0: Normal (132 BPM), 1: Uyarı/Hızlı (156 BPM), 2: Acil/Panik (180 BPM)

  // Müzik Scheduler
  private schedulerIntervalId: any = null;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private musicGainNode: GainNode | null = null;
  private musicFilterNode: BiquadFilterNode | null = null;

  // Dinleyiciler (Mute değişimlerini UI'ya haber vermek için)
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('isler_sound_muted') === 'true';
        this.isMusicEnabled = localStorage.getItem('isler_music_enabled') !== 'false';
      } catch {
        this.isMuted = false;
        this.isMusicEnabled = true;
      }

      // Tarayıcı autoplay kısıtlamasını aşmak için ilk etkileşimde ses motorunu uyandır
      const unlockAudio = () => {
        this.ensureContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.currentMusicMode !== 'none' && !this.schedulerIntervalId) {
          this.startScheduler();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Müzik ana gain & filter zinciri
        this.musicGainNode = this.ctx.createGain();
        this.musicFilterNode = this.ctx.createBiquadFilter();
        this.musicFilterNode.type = 'lowpass';
        this.musicFilterNode.frequency.value = 850; // Yumuşak, kulağı yormayan Lo-Fi tonu

        this.musicGainNode.connect(this.musicFilterNode);
        this.musicFilterNode.connect(this.ctx.destination);
      }
    }
    return this.ctx;
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('isler_sound_muted', String(this.isMuted));
    } catch {}

    if (this.isMuted) {
      this.stopMusic();
    } else {
      if (this.currentMusicMode !== 'none') {
        this.startMusic(this.currentMusicMode);
      }
    }

    this.notify();
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.isMusicEnabled = !this.isMusicEnabled;
    try {
      localStorage.setItem('isler_music_enabled', String(this.isMusicEnabled));
    } catch {}

    if (!this.isMusicEnabled) {
      this.stopMusic();
    } else if (this.currentMusicMode !== 'none') {
      this.startMusic(this.currentMusicMode);
    }

    this.notify();
    return this.isMusicEnabled;
  }

  /* =========================================================================
   * ARKA PLAN MÜZİĞİ SEQUENCER (100% Telifsiz Kodlanmış Polifonik Melodiler)
   * ========================================================================= */

  // Nota Frekansları (Hz)
  private readonly NOTE = {
    E2: 82.41, G2: 98.0, A2: 110.0, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  };

  /**
   * Raunttaki kalan süreye göre müziğin temposunu, ritmini ve gerilimini dinamik olarak ayarlar.
   * - Normal (> 8s): 132 BPM, 1100 Hz filtre, standart yürüyen bas
   * - Uyarı / Orta Gerilim (<= 8s): 156 BPM, 2200 Hz filtre, iki kat hızlı kalp atışı bası ve hi-hat nabzı
   * - Acil / Kritik Gerilim (<= 4s): 180 BPM, 3600 Hz filtre, aralıksız dörtnal bas ve uyarı alarm staccato tonu
   */
  public setRemainingTime(remainingSec: number, totalSec: number = 20) {
    if (this.currentMusicMode !== 'battle') {
      if (this.tensionLevel !== 0) {
        this.resetTension();
      }
      return;
    }

    let nextTension: 0 | 1 | 2 = 0;
    if (remainingSec <= 4 && remainingSec > 0) {
      nextTension = 2; // Kritik Son 4 Saniye: Panik / Acil Durum Alarmı
    } else if (remainingSec <= 8 || (totalSec > 0 && remainingSec / totalSec <= 0.38)) {
      nextTension = 1; // Son 8 Saniye: Yüksek Gerilim & Hızlanma
    } else {
      nextTension = 0; // Normal tempo
    }

    if (nextTension !== this.tensionLevel) {
      this.tensionLevel = nextTension;
      this.updateTensionFilter();
    }
  }

  public resetTension() {
    this.tensionLevel = 0;
    this.updateTensionFilter();
  }

  private updateTensionFilter() {
    if (!this.ctx || !this.musicFilterNode) return;
    try {
      // Kulak dostu Lo-Fi filtre: 850 Hz -> 1100 Hz -> 1350 Hz (Tiz sertlikleri tamamen filtrelenir)
      const targetFreq =
        this.tensionLevel === 2 ? 1350 : this.tensionLevel === 1 ? 1100 : 850;
      this.musicFilterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    } catch {}
  }

  public startMusic(mode: 'lobby' | 'battle') {
    this.stopCelebrationAnthem();
    this.currentMusicMode = mode;
    this.resetTension();
    if (this.isMuted || !this.isMusicEnabled) return;

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Halihazırda çalışıyorsa durdurup yeniden başlat
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = null;
    }

    this.currentStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.startScheduler();
  }

  public stopMusic() {
    this.resetTension();
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = null;
    }
  }

  private startScheduler() {
    if (this.schedulerIntervalId) return;

    // Her 50ms'de bir önümüzdeki 150ms'lik notaları çizelgele (Lookahead)
    this.schedulerIntervalId = setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isMusicEnabled || this.currentMusicMode === 'none') {
        return;
      }

      while (this.nextNoteTime < this.ctx.currentTime + 0.15) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        this.advanceStep();
      }
    }, 45);
  }

  private advanceStep() {
    // Dinamik BPM: Lo-Fi Odaklanma & Hızlanan Düello Ritmi
    let bpm = 108;
    if (this.currentMusicMode === 'battle') {
      if (this.tensionLevel === 2) {
        bpm = 148; // Son 4 saniye: Hızlı, nefes kesen kalp atışı temposu
      } else if (this.tensionLevel === 1) {
        bpm = 130; // Son 8 saniye: Hızlandırılmış akıcı tempo
      } else {
        bpm = 112; // Normal Lo-Fi çalışma & odaklanma temposu
      }
    }
    const stepDuration = 60 / bpm / 4; // 16th note süresi
    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 32;
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.musicGainNode) return;

    if (this.currentMusicMode === 'lobby') {
      // 🌿 LOBBY: 108 BPM, Dinlendirici Lofi / Chill Am7 - Fmaj7 - Cmaj7 - G6 Arpeji
      // Akor Basları (Adım 0, 8, 16, 24)
      if (step === 0) this.playToneAt(this.NOTE.A3, 'triangle', 0.8, 0.035, time);
      if (step === 8) this.playToneAt(this.NOTE.F3, 'triangle', 0.8, 0.035, time);
      if (step === 16) this.playToneAt(this.NOTE.C3, 'triangle', 0.8, 0.035, time);
      if (step === 24) this.playToneAt(this.NOTE.G3, 'triangle', 0.8, 0.035, time);

      // Tatlı Arpej Notaları (Her 2 veya 3 adımda)
      const lobbyMelody: Record<number, number> = {
        2: this.NOTE.C4,
        4: this.NOTE.E4,
        6: this.NOTE.G4,
        10: this.NOTE.A4,
        12: this.NOTE.C5,
        14: this.NOTE.E4,
        18: this.NOTE.G4,
        20: this.NOTE.B4,
        22: this.NOTE.D4,
        26: this.NOTE.B4,
        28: this.NOTE.D5,
        30: this.NOTE.G4,
      };

      if (lobbyMelody[step]) {
        this.playToneAt(lobbyMelody[step], 'sine', 0.25, 0.025, time);
      }
    } else if (this.currentMusicMode === 'battle') {
      // ☕ LO-FI BATTLE: Sıcak Caz Akorları (Am7 - Dm7 - G7 - Cmaj7) & Kalp Atışı Nabzı
      // 1. Yumuşak Caz Akor Basları (Adım 0, 8, 16, 24)
      if (step === 0) this.playToneAt(this.NOTE.A3, 'sine', 0.8, 0.045, time);
      if (step === 8) this.playToneAt(this.NOTE.D3, 'sine', 0.8, 0.045, time);
      if (step === 16) this.playToneAt(this.NOTE.G3, 'sine', 0.8, 0.045, time);
      if (step === 24) this.playToneAt(this.NOTE.C3, 'sine', 0.8, 0.045, time);

      // 2. Tatlı Rhodes / Elektrik Piyano Melodisi (Sıcak üçgen dalga)
      const rhodesMelody: Record<number, number> = {
        2: this.NOTE.C4,
        4: this.NOTE.E4,
        6: this.NOTE.G4,
        10: this.NOTE.F4,
        12: this.NOTE.A4,
        14: this.NOTE.C5,
        18: this.NOTE.B4,
        20: this.NOTE.D5,
        22: this.NOTE.G4,
        26: this.NOTE.E4,
        28: this.NOTE.G4,
        30: this.NOTE.B4,
      };

      if (rhodesMelody[step]) {
        this.playToneAt(rhodesMelody[step], 'triangle', 0.3, 0.032, time);
      }

      // 3. Kalp Atışı Sub-Kick (Kulak tırmalamayan, göğüste hissedilen derin nabız)
      if (this.tensionLevel === 2) {
        // Kritik Son 4s: Her 4 adımda bir hızlı kalp atışı
        if (step % 4 === 0) {
          this.playHeartbeat(time, 0.08);
        }
      } else if (this.tensionLevel === 1) {
        // Son 8s: Çift kalp atışı (lüp-düp lüp-düp)
        if (step % 8 === 0 || step % 8 === 2) {
          this.playHeartbeat(time, 0.065);
        }
      } else {
        // Normal: Sadece ana vuruşlarda yumuşak kalp atışı
        if (step === 0 || step === 16) {
          this.playHeartbeat(time, 0.055);
        }
      }

      // 4. Yumuşak 808 Tık / Fırça Perküsyonu (Sadece gerilim aşamalarında, tizleri filtrelenmiş)
      if (this.tensionLevel >= 1 && step % 2 === 1) {
        this.playSoftHat(time, this.tensionLevel === 2 ? 0.024 : 0.015);
      }
    }
  }

  // Sıcak kalp atışı sub-kick (Düşük frekanslı, kulak tırmalamayan göğüs nabzı)
  private playHeartbeat(time: number, vol = 0.08) {
    if (!this.ctx || !this.musicGainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.09);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

      osc.connect(gain);
      gain.connect(this.musicGainNode);
      osc.start(time);
      osc.stop(time + 0.13);
    } catch {}
  }

  // Kulak tırmalamayan yumuşak fırça / hi-hat (Tizleri filtrelenmiş sıcak perküsyon)
  private playSoftHat(time: number, vol = 0.018) {
    if (!this.ctx || !this.musicGainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, time);
      osc.frequency.exponentialRampToValueAtTime(200, time + 0.03);

      filter.type = 'bandpass';
      filter.frequency.value = 1600; // Kulak tırmalamayan orta frekans
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGainNode);
      osc.start(time);
      osc.stop(time + 0.04);
    } catch {}
  }

  private playToneAt(freq: number, type: OscillatorType, duration: number, gainVal: number, startTime: number) {
    if (!this.ctx || !this.musicGainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Kulak tırmalamayan yumuşak envelope (hafif attack ve yumuşak decay)
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {}
  }

  /* =========================================================================
   * SES EFEKTLERİ (SFX)
   * ========================================================================= */

  /**
   * UI Buton Tık Sesi
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  /**
   * Cevap Kilitleme Sesi (Tahta & Düello)
   */
  public playLock() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Doğru Cevap (Parlak Majör Zafer Arpeji: C5 - E5 - G5 - C6)
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.07;
        const dur = 0.22;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.13, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      } catch {}
    });
  }

  /**
   * Kısmi Doğru Cevap (Çift Nota: D5 - G5)
   */
  public playPartial() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [587.33, 783.99]; // D5, G5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.09;
        const dur = 0.2;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      } catch {}
    });
  }

  /**
   * Yanlış Cevap (Yumuşak Tok Hata Tonu: A3 -> Eb3)
   */
  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(155.56, now + 0.26); // Eb3 (Tritone düşüş)

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  /**
   * Seri (Combo) Yakalandığında Yükselen Enerji
   */
  public playCombo(streak: number = 2) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const baseFreq = 440 * Math.min(1.8, 1 + (streak - 2) * 0.12);
    const now = ctx.currentTime;

    [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.05;
        const dur = 0.2;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      } catch {}
    });
  }

  /**
   * 1v1 Maç Bulundu / VS Intro Fanfarı
   */
  public playMatchFound() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const fanfarNotes = [
      { f: 293.66, d: 0.1 },  // D4
      { f: 369.99, d: 0.1 },  // F#4
      { f: 440.0, d: 0.12 },  // A4
      { f: 587.33, d: 0.35 }, // D5 (uzun)
    ];

    let offset = 0;
    const now = ctx.currentTime;

    fanfarNotes.forEach(({ f, d }) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + offset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + d);
        offset += d * 0.8;
      } catch {}
    });
  }

  /**
   * Sayaç Tiki (Son 5 saniyede acil durum sesi)
   */
  public playTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const freq = isUrgent ? 880 : 540;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(isUrgent ? 0.08 : 0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  /**
   * Zafer & Podyum Şampiyonluk Melodisi (G4, C5, E5, G5, C6)
   */
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const victoryNotes = [
      { f: 392.0, d: 0.12 },  // G4
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.18 }, // G5
      { f: 1046.5, d: 0.6 },  // C6 (uzun zafer)
    ];

    let offset = 0;
    const now = ctx.currentTime;

    victoryNotes.forEach(({ f, d }) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + offset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + d);
        offset += d * 0.75;
      } catch {}
    });

    // Podyum ve zafer için coşkulu kutlama müziği sekansını başlat
    this.startCelebrationAnthem();
  }

  // Zafer Kutlama Marşı (Podyum, Final ve Galibiyetler için)
  private celebrationIntervalId: any = null;
  private celebrationTimeoutId: any = null;

  /**
   * Kısa süreli coşkulu zafer marşı (~4.5 saniye çalıp otomatik biter)
   * @param durationMs - Çalma süresi (varsayılan 4500ms)
   */
  public startCelebrationAnthem(durationMs: number = 4500) {
    this.stopMusic();
    if (this.isMuted || !this.isMusicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.stopCelebrationAnthem();

    // Zafer ritmi: Neşeli Major Arpej (C Major: C5 - E5 - G5 - C6 - B5 - G5 - A5)
    const anthemNotes = [
      523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 880.0, 1046.5,
      659.25, 783.99, 1046.5, 1174.66, 1046.5, 783.99, 880.0, 783.99
    ];

    let step = 0;
    this.celebrationIntervalId = setInterval(() => {
      if (this.isMuted || !this.isMusicEnabled || !this.ctx) return;
      const freq = anthemNotes[step % anthemNotes.length];
      const now = this.ctx.currentTime;

      try {
        // Melodi (Pırıl pırıl pirinç/synth hissi)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);

        // Her 4 adımda bir güçlü sub-kick alkış vuruşu
        if (step % 4 === 0) {
          const kick = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(140, now);
          kick.frequency.exponentialRampToValueAtTime(45, now + 0.16);

          kickGain.gain.setValueAtTime(0.14, now);
          kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          kick.connect(kickGain);
          kickGain.connect(this.ctx.destination);

          kick.start(now);
          kick.stop(now + 0.16);
        }
      } catch {}

      step++;
    }, 165); // ~182 BPM neşeli şampiyonluk ritmi

    // Belirlenen süre sonunda müziği otomatik durdur ve lobi fon müziğine dön
    this.celebrationTimeoutId = setTimeout(() => {
      this.stopCelebrationAnthem();
      this.startMusic('lobby');
    }, durationMs);
  }

  public stopCelebrationAnthem() {
    if (this.celebrationIntervalId) {
      clearInterval(this.celebrationIntervalId);
      this.celebrationIntervalId = null;
    }
    if (this.celebrationTimeoutId) {
      clearTimeout(this.celebrationTimeoutId);
      this.celebrationTimeoutId = null;
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
