(function () {
  const socket = io();

  const urlParams = new URLSearchParams(window.location.search);
  const windowNum = urlParams.get('window') || '1';
  const defaultPlayerId = urlParams.get('player') || (windowNum === '2' ? 'p3' : 'p2');

  let appState = {
    players: [],
    weeklyBrackets: [],
    tournaments: [],
    matchHistory: [],
    questionBankStats: { totalQuestions: 0 },
    queueSnapshot: [],
    pairDiagnostics: [],
  };

  let currentPlayerId = defaultPlayerId;
  let selectedMode = 'ranked';
  let selectedExam = 'TYT';
  let activeDuel = null;
  let mySelectedOption = null;
  let localTimerInterval = null;

  // DOM Elements
  const windowBadge = document.getElementById('windowBadge');
  const activePlayerSelect = document.getElementById('activePlayerSelect');
  const activePlayerStats = document.getElementById('activePlayerStats');
  const openSecondWindowBtn = document.getElementById('openSecondWindowBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  const questionBankBadge = document.getElementById('questionBankBadge');
  const tournamentSelectRow = document.getElementById('tournamentSelectRow');
  const queueTournamentSelect = document.getElementById('queueTournamentSelect');
  const activeFormulaPreview = document.getElementById('activeFormulaPreview');
  const queueErrorBox = document.getElementById('queueErrorBox');
  const joinQueueBtn = document.getElementById('joinQueueBtn');
  const leaveQueueBtn = document.getElementById('leaveQueueBtn');
  const fastForwardQueueBtn = document.getElementById('fastForwardQueueBtn');

  const duelArenaCard = document.getElementById('duelArenaCard');
  const duelPlayerABox = document.getElementById('duelPlayerABox');
  const duelPlayerBBox = document.getElementById('duelPlayerBBox');
  const duelRoundPill = document.getElementById('duelRoundPill');
  const duelTimerDisplay = document.getElementById('duelTimerDisplay');
  const duelDifficultyDist = document.getElementById('duelDifficultyDist');
  const duelTimerBar = document.getElementById('duelTimerBar');
  const questionCanvas = document.getElementById('questionCanvas');
  const optionsGrid = document.getElementById('optionsGrid');
  const roundResultBanner = document.getElementById('roundResultBanner');
  const matchSummaryCard = document.getElementById('matchSummaryCard');

  const queueListContainer = document.getElementById('queueListContainer');
  const pairDiagnosticsContainer = document.getElementById('pairDiagnosticsContainer');

  const quickEloInput = document.getElementById('quickEloInput');
  const quickStreakInput = document.getElementById('quickStreakInput');
  const applyQuickEditBtn = document.getElementById('applyQuickEditBtn');

  const weeklyActivityBox = document.getElementById('weeklyActivityBox');
  const claimWeeklyRewardBtn = document.getElementById('claimWeeklyRewardBtn');
  const simulate15MatchesBtn = document.getElementById('simulate15MatchesBtn');
  const weeklyClaimFeedback = document.getElementById('weeklyClaimFeedback');
  const bracketsTableBody = document.getElementById('bracketsTableBody');
  const walletSummaryBox = document.getElementById('walletSummaryBox');
  const coinsToConvertInput = document.getElementById('coinsToConvertInput');
  const convertCoinsBtn = document.getElementById('convertCoinsBtn');
  const convertFeedback = document.getElementById('convertFeedback');
  const couponsList = document.getElementById('couponsList');
  const tournamentsContainer = document.getElementById('tournamentsContainer');

  windowBadge.textContent = `Pencere ${windowNum} • Bağımsız Oyuncu Oturumu`;
  document.title = `[Pencere ${windowNum}] İşler 1v1 Düello & Momentum`;

  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach((s) => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Open 2nd window for side-by-side testing
  openSecondWindowBtn.addEventListener('click', () => {
    const otherPlayer = currentPlayerId === 'p2' ? 'p3' : 'p2';
    const nextWin = windowNum === '1' ? '2' : '1';
    window.open(
      `${window.location.pathname}?window=${nextWin}&player=${otherPlayer}`,
      `isler_window_${nextWin}`,
      'width=1100,height=850,left=120,top=80'
    );
  });

  resetDemoBtn.addEventListener('click', async () => {
    await fetch('/api/demo/reset', { method: 'POST' });
    activeDuel = null;
    duelArenaCard.classList.add('hidden');
    matchSummaryCard.classList.add('hidden');
  });

  // Mode & Exam segmented controls
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;
      tournamentSelectRow.classList.toggle('hidden', selectedMode !== 'tournament');
    });
  });

  document.querySelectorAll('[data-exam]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-exam]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedExam = btn.dataset.exam;
    });
  });

  activePlayerSelect.addEventListener('change', () => {
    currentPlayerId = activePlayerSelect.value;
    socket.emit('player:select', { playerId: currentPlayerId });
    renderAll();
  });

  function getSelectedSubjects() {
    const checked = Array.from(document.querySelectorAll('.subject-chips input:checked')).map((el) => el.value);
    return checked.length > 0 ? checked : ['matematik'];
  }

  joinQueueBtn.addEventListener('click', () => {
    queueErrorBox.classList.add('hidden');
    matchSummaryCard.classList.add('hidden');
    socket.emit('queue:join', {
      playerId: currentPlayerId,
      examType: selectedExam,
      subjects: getSelectedSubjects(),
      mode: selectedMode,
      tournamentId: selectedMode === 'tournament' ? queueTournamentSelect.value : null,
    });
  });

  leaveQueueBtn.addEventListener('click', () => {
    socket.emit('queue:leave', { playerId: currentPlayerId });
  });

  fastForwardQueueBtn.addEventListener('click', () => {
    socket.emit('queue:fastForward', { bonusSeconds: 5 });
  });

  applyQuickEditBtn.addEventListener('click', async () => {
    await fetch('/api/demo/update-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: currentPlayerId,
        elo: Number(quickEloInput.value),
        streak: Number(quickStreakInput.value),
      }),
    });
  });

  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const p = btn.dataset.preset;
      const values =
        p === 'smurf'
          ? { elo: 1200, streak: 5 }
          : p === 'high'
          ? { elo: 1620, streak: 2 }
          : { elo: 1300, streak: -4 };
      quickEloInput.value = values.elo;
      quickStreakInput.value = values.streak;
      await fetch('/api/demo/update-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: currentPlayerId, ...values }),
      });
    });
  });

  // Economy actions
  claimWeeklyRewardBtn.addEventListener('click', async () => {
    const res = await fetch('/api/economy/claim-weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: currentPlayerId }),
    });
    const data = await res.json();
    weeklyClaimFeedback.style.color = data.ok ? '#34d399' : '#f87171';
    weeklyClaimFeedback.textContent = data.ok
      ? `✅ Tebrikler! ${data.tierName} diliminden +${data.coinsAwarded} Coin hesabınıza eklendi.`
      : `⚠️ ${data.reason}`;
  });

  simulate15MatchesBtn.addEventListener('click', async () => {
    await fetch('/api/economy/simulate-15-matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: currentPlayerId }),
    });
    weeklyClaimFeedback.style.color = '#38bdf8';
    weeklyClaimFeedback.textContent = 'ℹ️ Haftalık maç sayısı 15/15 olarak güncellendi. Artık haftalık ödülü talep edebilirsiniz!';
  });

  convertCoinsBtn.addEventListener('click', async () => {
    const res = await fetch('/api/economy/convert-coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: currentPlayerId,
        coins: Number(coinsToConvertInput.value),
      }),
    });
    const data = await res.json();
    convertFeedback.style.color = data.ok ? '#34d399' : '#f87171';
    convertFeedback.textContent = data.ok
      ? `🎉 +${data.islerPointsAdded} İşler Sadakat Puanı kazanıldı! Kupon Kodunuz: ${data.couponCode}`
      : `⚠️ ${data.reason}`;
  });

  function getCurrentPlayer() {
    return appState.players.find((p) => p.id === currentPlayerId) || appState.players[0] || null;
  }

  function renderTopBarAndPlayer() {
    const p = getCurrentPlayer();
    if (!p) return;

    activePlayerSelect.innerHTML = appState.players
      .map(
        (item) =>
          `<option value="${item.id}" ${item.id === p.id ? 'selected' : ''}>${item.name} — R:${item.elo} | S:${item.streak >= 0 ? '+' + item.streak : item.streak} | MMR:${item.effectiveMmr}</option>`
      )
      .join('');

    const streakColor = p.streak >= 3 ? '#34d399' : p.streak <= -3 ? '#f87171' : '#cbd5e1';
    activePlayerStats.innerHTML = `
      <span class="stat-pill">ELO: <strong>${p.elo}</strong></span>
      <span class="stat-pill" style="color:${streakColor}">Seri (S): <strong>${p.streak >= 0 ? '+' + p.streak : p.streak}</strong></span>
      <span class="stat-pill" style="color:#c084fc">Efektif MMR: <strong>${p.effectiveMmr}</strong></span>
      <span class="stat-pill" style="color:#facc15">🪙 ${p.coins} Coin</span>
      <span class="stat-pill" style="color:#34d399">📚 ${p.islerPoints} İşler Puanı</span>
    `;

    const offset = Math.round((p.effectiveMmr - p.elo) * 100) / 100;
    activeFormulaPreview.innerHTML = `
      <div><strong>Seçili Oyuncu Momentum Hesabı:</strong></div>
      <div style="margin-top:4px;color:#cbd5e1">
        <code>MMR_eff = ${p.elo} + sgn(${p.streak}) × 35 × max(0, |${p.streak}| - 2)^1.2 = <strong>${p.effectiveMmr}</strong></code>
        (${offset >= 0 ? '+' + offset : offset} Momentum Etkisi)
      </div>
    `;

    if (document.activeElement !== quickEloInput && document.activeElement !== quickStreakInput) {
      quickEloInput.value = p.elo;
      quickStreakInput.value = p.streak;
    }

    if (appState.questionBankStats) {
      questionBankBadge.textContent = `${appState.questionBankStats.totalQuestions} Soru Hazır (TYT & AYT)`;
    }

    const inQueue = appState.queueSnapshot.some((q) => q.playerId === p.id);
    joinQueueBtn.classList.toggle('hidden', inQueue);
    leaveQueueBtn.classList.toggle('hidden', !inQueue);
  }

  function renderQueueInspector() {
    if (!appState.queueSnapshot || appState.queueSnapshot.length === 0) {
      queueListContainer.innerHTML = `<div class="queue-item" style="color:#94a3b8">Şu an kuyrukta bekleyen oyuncu yok. İki pencereden "Eşleştir"e basarak canlı eşleşmeyi izleyebilirsiniz.</div>`;
    } else {
      queueListContainer.innerHTML = appState.queueSnapshot
        .map((q) => {
          const wait = q.waitSeconds || 0;
          const stage =
            wait <= 5
              ? '0–5sn (±50 MMR, ±1 Seri, ±100 ELO)'
              : wait <= 15
              ? '5–15sn (±100 MMR, ±3 Seri, ±175 ELO)'
              : '15–30sn (±175 MMR, Seri Serbest, ±250 ELO Sert Sınır)';
          return `
            <div class="queue-item">
              <div style="display:flex;justify-content:space-between;font-weight:700">
                <span>${q.name} (${q.examType} - ${q.subjects.join(', ')})</span>
                <span style="color:#facc15">⏱️ ${wait.toFixed(1)} sn / 30 sn</span>
              </div>
              <div style="margin-top:4px;color:#cbd5e1">
                Gerçek ELO: <strong>${q.elo}</strong> | Seri: <strong>${q.streak >= 0 ? '+' + q.streak : q.streak}</strong> | <span style="color:#c084fc">MMR_eff: <strong>${q.effectiveMmr}</strong></span>
              </div>
              <div style="margin-top:4px;font-size:12px;color:#38bdf8">Aktif Pencere: ${stage}</div>
            </div>
          `;
        })
        .join('');
    }

    if (!appState.pairDiagnostics || appState.pairDiagnostics.length === 0) {
      pairDiagnosticsContainer.innerHTML = `<div class="diag-item" style="color:#94a3b8">Kuyrukta en az 2 oyuncu olduğunda ikili MMR, ELO ve Cooldown analizi burada görünür.</div>`;
    } else {
      pairDiagnosticsContainer.innerHTML = appState.pairDiagnostics
        .map(
          (d) => `
          <div class="diag-item" style="border-color:${d.compatible ? '#10b981' : '#f59e0b'}">
            <div style="font-weight:700">${d.playerAName} ⚡ ${d.playerBName}</div>
            <div style="margin-top:4px;color:${d.compatible ? '#34d399' : '#fbbf24'}">${d.reason}</div>
            ${
              d.realEloDiff !== undefined
                ? `<div style="margin-top:4px;font-size:12px;color:#94a3b8">ΔMMR_eff: ${d.mmrDiff} | ΔGerçek ELO: ${d.realEloDiff} | ΔSeri: ${d.streakDiff} | Son 24s Maç: ${d.pairwiseCount || 0}/2</div>`
                : ''
            }
          </div>
        `
        )
        .join('');
    }
  }

  function renderDuelArena() {
    if (!activeDuel || activeDuel.status !== 'IN_PROGRESS') {
      duelArenaCard.classList.add('hidden');
      return;
    }

    duelArenaCard.classList.remove('hidden');
    const q = activeDuel.currentQuestion;
    const isParticipant =
      activeDuel.playerA.id === currentPlayerId || activeDuel.playerB.id === currentPlayerId;

    duelRoundPill.textContent = `SORU ${activeDuel.currentQuestionIndex + 1} / ${activeDuel.totalQuestions}`;
    if (activeDuel.diagnostics && activeDuel.diagnostics.difficultyDistribution) {
      const dist = activeDuel.diagnostics.difficultyDistribution;
      duelDifficultyDist.textContent = `Ort. ELO: ${activeDuel.diagnostics.averageElo} (Dağılım: ${dist.EASY}K / ${dist.MEDIUM}O / ${dist.HARD}Z)`;
    }

    duelPlayerABox.innerHTML = `
      <div style="font-weight:700;color:#38bdf8">${activeDuel.playerA.name}</div>
      <div style="font-size:12px;color:#cbd5e1">ELO: ${activeDuel.playerA.elo} | MMR: ${activeDuel.playerA.effectiveMmr}</div>
      <div style="margin-top:6px;font-size:16px;font-weight:800">Puan: ${activeDuel.playerA.totalScore} (${activeDuel.playerA.correctCount} Doğru)</div>
      <div style="font-size:12px;color:${activeDuel.playerA.hasAnsweredCurrent ? '#34d399' : '#facc15'}">
        ${activeDuel.playerA.hasAnsweredCurrent ? '✔ Cevapladı' : '⏳ Çözüyor...'}
      </div>
    `;

    duelPlayerBBox.innerHTML = `
      <div style="font-weight:700;color:#c084fc">${activeDuel.playerB.name}</div>
      <div style="font-size:12px;color:#cbd5e1">ELO: ${activeDuel.playerB.elo} | MMR: ${activeDuel.playerB.effectiveMmr}</div>
      <div style="margin-top:6px;font-size:16px;font-weight:800">Puan: ${activeDuel.playerB.totalScore} (${activeDuel.playerB.correctCount} Doğru)</div>
      <div style="font-size:12px;color:${activeDuel.playerB.hasAnsweredCurrent ? '#34d399' : '#facc15'}">
        ${activeDuel.playerB.hasAnsweredCurrent ? '✔ Cevapladı' : '⏳ Çözüyor...'}
      </div>
    `;

    if (q && window.CanvasQuestionRenderer) {
      window.CanvasQuestionRenderer.renderQuestionOnCanvas(
        questionCanvas,
        q,
        activeDuel.currentQuestionIndex,
        activeDuel.totalQuestions
      );

      const myHasAnswered =
        (activeDuel.playerA.id === currentPlayerId && activeDuel.playerA.hasAnsweredCurrent) ||
        (activeDuel.playerB.id === currentPlayerId && activeDuel.playerB.hasAnsweredCurrent);

      const letters = ['A', 'B', 'C', 'D', 'E'];
      optionsGrid.innerHTML = q.options
        .map((optText, idx) => {
          const cleanOpt = window.CanvasQuestionRenderer.formatLatexToReadable(optText);
          const isSelected = mySelectedOption === idx;
          return `
            <button class="option-btn ${isSelected ? 'selected' : ''}" data-opt="${idx}" ${
            !isParticipant || myHasAnswered ? 'disabled' : ''
          }>
              <span class="opt-letter">${letters[idx] || idx + 1}</span>
              <span>${cleanOpt}</span>
            </button>
          `;
        })
        .join('');

      optionsGrid.querySelectorAll('.option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.opt);
          mySelectedOption = idx;
          socket.emit('duel:answer', {
            matchId: activeDuel.matchId,
            playerId: currentPlayerId,
            questionIndex: activeDuel.currentQuestionIndex,
            selectedOptionIndex: idx,
          });
          renderDuelArena();
        });
      });
    }
  }

  function startDuelCountdown() {
    if (localTimerInterval) clearInterval(localTimerInterval);
    localTimerInterval = setInterval(() => {
      if (!activeDuel || activeDuel.status !== 'IN_PROGRESS') return;
      const elapsed = Date.now() - activeDuel.questionStartedAt;
      const total = activeDuel.durationMs || 60000;
      const remaining = Math.max(0, total - elapsed);
      const sec = Math.ceil(remaining / 1000);
      duelTimerDisplay.textContent = `${sec}s`;
      duelTimerBar.style.width = `${(remaining / total) * 100}%`;
    }, 200);
  }

  function renderMatchSummary(summary) {
    matchSummaryCard.classList.remove('hidden');
    const u = summary.eloUpdate;
    matchSummaryCard.innerHTML = `
      <div class="card-header">
        <h2>🏁 Düello Tamamlandı — Kazanan: ${summary.winnerName}</h2>
        <span class="badge badge-success">${summary.examType} • ${summary.commonSubjects.join(', ').toUpperCase()}</span>
      </div>
      ${
        summary.tieBreakerUsed
          ? `<div class="round-banner" style="margin-bottom:12px">⚡ İki oyuncu da eşit doğru sayısı yaptı; <strong>Doğruluk + Çözüm Hızı (Tie-Breaker)</strong> puanlaması kazananı belirledi!</div>`
          : ''
      }
      ${
        u.antiFarmingApplied
          ? `<div class="round-banner" style="margin-bottom:12px;border-color:#f59e0b;background:rgba(245,158,11,0.15)">🛡️ <strong>Anti-Farming Koruması Devrede:</strong> Gerçek ELO farkı 250 puanı aştığı için yüksek ELO'lu oyuncunun kazancı sönümlendi!</div>`
          : ''
      }
      <div class="form-row">
        <div class="queue-item">
          <div style="font-weight:700;color:#38bdf8">${summary.playerA.name}</div>
          <div>Toplam Puan: <strong>${summary.playerA.totalScore}</strong> (${summary.playerA.correctCount}/5 Doğru)</div>
          <div>Gerçek ELO: ${summary.playerA.elo} → <strong>${summary.playerA.newElo}</strong> (${summary.playerA.deltaElo >= 0 ? '+' + summary.playerA.deltaElo : summary.playerA.deltaElo})</div>
          <div>Yeni Seri (S): <strong>${summary.playerA.newStreak >= 0 ? '+' + summary.playerA.newStreak : summary.playerA.newStreak}</strong> | Yeni MMR_eff: <strong>${summary.playerA.newEffectiveMmr}</strong></div>
          <div style="color:#facc15">Kazanılan Ödül: +${summary.coinsAwardedA} Coin</div>
        </div>
        <div class="queue-item">
          <div style="font-weight:700;color:#c084fc">${summary.playerB.name}</div>
          <div>Toplam Puan: <strong>${summary.playerB.totalScore}</strong> (${summary.playerB.correctCount}/5 Doğru)</div>
          <div>Gerçek ELO: ${summary.playerB.elo} → <strong>${summary.playerB.newElo}</strong> (${summary.playerB.deltaElo >= 0 ? '+' + summary.playerB.deltaElo : summary.playerB.deltaElo})</div>
          <div>Yeni Seri (S): <strong>${summary.playerB.newStreak >= 0 ? '+' + summary.playerB.newStreak : summary.playerB.newStreak}</strong> | Yeni MMR_eff: <strong>${summary.playerB.newEffectiveMmr}</strong></div>
          <div style="color:#facc15">Kazanılan Ödül: +${summary.coinsAwardedB} Coin</div>
        </div>
      </div>
    `;
  }

  function renderEconomyTab() {
    const p = getCurrentPlayer();
    if (!p) return;

    const progressPct = Math.min(100, Math.round((p.weeklyMatchesPlayed / 15) * 100));
    weeklyActivityBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:6px">
        <span>${p.name} — Haftalık Aktiflik Durumu</span>
        <span style="color:${p.weeklyMatchesPlayed >= 15 ? '#34d399' : '#facc15'}">${p.weeklyMatchesPlayed} / 15 Maç</span>
      </div>
      <div class="timer-bar-track" style="margin-bottom:8px">
        <div class="timer-bar-fill" style="width:${progressPct}%"></div>
      </div>
      <div style="font-size:13px;color:#cbd5e1">
        Mevcut Liginiz: <strong style="color:${p.bracket.badgeColor}">${p.bracket.tierName} (${p.elo} ELO)</strong> → Haftalık Ödül Hakkı: <strong>${p.bracket.weeklyCoins} Coin</strong>
        ${p.weeklyRewardClaimed ? '<span class="badge badge-success" style="margin-left:8px">Bu Hafta Alındı</span>' : ''}
      </div>
    `;

    bracketsTableBody.innerHTML = (appState.weeklyBrackets || [])
      .map(
        (b) => `
        <tr style="${p.bracket && p.bracket.tierName === b.tierName ? 'background:rgba(56,189,248,0.12);font-weight:700' : ''}">
          <td style="color:${b.badgeColor}">${b.tierName}</td>
          <td>${b.maxElo === null || b.maxElo > 9000 ? `${b.minElo}+ ELO` : `${Math.floor(b.minElo)} – ${Math.floor(b.maxElo)} ELO`}</td>
          <td>🪙 ${b.weeklyCoins} Coin / Hafta</td>
        </tr>
      `
      )
      .join('');

    walletSummaryBox.innerHTML = `
      <div style="display:flex;justify-content:space-around;text-align:center">
        <div>
          <div style="font-size:12px;color:#94a3b8">Mevcut Coin Bakiyesi</div>
          <div style="font-size:24px;font-weight:800;color:#facc15">🪙 ${p.coins}</div>
        </div>
        <div>
          <div style="font-size:12px;color:#94a3b8">İşler Sadakat Puanı</div>
          <div style="font-size:24px;font-weight:800;color:#34d399">📚 ${p.islerPoints} Puan (${p.islerPoints} TL İndirim)</div>
        </div>
      </div>
    `;

    if (!p.coupons || p.coupons.length === 0) {
      couponsList.innerHTML = `<div class="muted-text">Henüz oluşturulmuş indirim kuponunuz yok. Coin dönüştürdüğünüzde kupon kodunuz burada listelenir.</div>`;
    } else {
      couponsList.innerHTML = p.coupons
        .map(
          (c) => `
          <div class="coupon-card">
            <div>
              <strong>Kupon Kodu: <code>${c.code}</code></strong>
              <div style="font-size:12px;color:#cbd5e1">İşler Kitabevi alışverişlerinde ${c.discountTl} TL indirim sağlar</div>
            </div>
            <span class="badge badge-success">Aktif</span>
          </div>
        `
        )
        .join('');
    }
  }

  function renderTournamentsTab() {
    queueTournamentSelect.innerHTML = (appState.tournaments || [])
      .map((t) => `<option value="${t.id}">${t.title} (${t.examType})</option>`)
      .join('');

    tournamentsContainer.innerHTML = (appState.tournaments || [])
      .map((t) => {
        const isJoined = t.participants.some((part) => part.playerId === currentPlayerId);
        return `
          <div class="queue-item" style="padding:16px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <h3 style="font-size:16px">${t.title}</h3>
              <span class="badge badge-info">${t.examType}</span>
            </div>
            <p style="font-size:12px;color:#facc15;margin-bottom:12px">🏆 Ödül Havuzu: ${t.prizePoolDesc}</p>
            <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
              <button class="btn btn-primary btn-xs join-tour-btn" data-id="${t.id}">
                ${isJoined ? '✔ Turnuvaya Kayıtlısınız' : '➕ Turnuvaya Katıl'}
              </button>
              <button class="btn btn-accent btn-xs match-tour-btn" data-id="${t.id}" data-exam="${t.examType}">
                ⚔️ Turnuva Eşleşmesine Gir
              </button>
              <button class="btn btn-secondary btn-xs dist-tour-btn" data-id="${t.id}">
                🎁 Haftalık Turnuva Ödüllerini Dağıt
              </button>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Oyuncu</th>
                  <th>G / M</th>
                  <th>Turnuva Puanı</th>
                </tr>
              </thead>
              <tbody>
                ${t.participants
                  .map(
                    (part, idx) => `
                    <tr style="${part.playerId === currentPlayerId ? 'background:rgba(56,189,248,0.12);font-weight:700' : ''}">
                      <td>#${idx + 1}</td>
                      <td>${part.name}</td>
                      <td>${part.wins}G / ${part.losses}M</td>
                      <td><strong>${part.points} Puan</strong></td>
                    </tr>
                  `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      })
      .join('');

    tournamentsContainer.querySelectorAll('.join-tour-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await fetch('/api/tournaments/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tournamentId: btn.dataset.id, playerId: currentPlayerId }),
        });
      });
    });

    tournamentsContainer.querySelectorAll('.match-tour-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedMode = 'tournament';
        selectedExam = btn.dataset.exam;
        document.querySelector('[data-tab="duelTab"]').click();
        socket.emit('queue:join', {
          playerId: currentPlayerId,
          examType: selectedExam,
          subjects: getSelectedSubjects(),
          mode: 'tournament',
          tournamentId: btn.dataset.id,
        });
      });
    });

    tournamentsContainer.querySelectorAll('.dist-tour-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await fetch('/api/tournaments/distribute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tournamentId: btn.dataset.id }),
        });
      });
    });
  }

  function renderAll() {
    renderTopBarAndPlayer();
    renderQueueInspector();
    renderDuelArena();
    renderEconomyTab();
    renderTournamentsTab();
  }

  // Socket events
  socket.on('state:update', (state) => {
    appState = state;
    renderAll();
  });

  socket.on('queue:tick', ({ queueSnapshot, pairDiagnostics }) => {
    appState.queueSnapshot = queueSnapshot;
    appState.pairDiagnostics = pairDiagnostics;
    renderQueueInspector();
  });

  socket.on('queue:error', ({ message }) => {
    queueErrorBox.textContent = message;
    queueErrorBox.classList.remove('hidden');
  });

  socket.on('duel:started', (pubState) => {
    if (pubState.playerA.id !== currentPlayerId && pubState.playerB.id !== currentPlayerId) return;
    activeDuel = pubState;
    mySelectedOption = null;
    roundResultBanner.classList.add('hidden');
    matchSummaryCard.classList.add('hidden');
    renderDuelArena();
    startDuelCountdown();
  });

  socket.on('duel:state', (pubState) => {
    if (!activeDuel || pubState.matchId !== activeDuel.matchId) return;
    activeDuel = pubState;
    renderDuelArena();
  });

  socket.on('duel:roundResult', ({ matchId, roundResult, publicState }) => {
    if (!activeDuel || matchId !== activeDuel.matchId) return;
    activeDuel = publicState;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    roundResultBanner.classList.remove('hidden');
    roundResultBanner.innerHTML = `
      ✔ Doğru Şık: <strong>${letters[roundResult.correctOptionIndex]}</strong> &nbsp;|&nbsp;
      ${activeDuel.playerA.name}: <strong>+${roundResult.answerA.score} Puan</strong> &nbsp;|&nbsp;
      ${activeDuel.playerB.name}: <strong>+${roundResult.answerB.score} Puan</strong> — Sıradaki soru yükleniyor...
    `;
    optionsGrid.querySelectorAll('.option-btn').forEach((btn) => {
      const idx = Number(btn.dataset.opt);
      if (idx === roundResult.correctOptionIndex) btn.classList.add('correct');
      else if (idx === mySelectedOption) btn.classList.add('wrong');
    });
  });

  socket.on('duel:question', (pubState) => {
    if (!activeDuel || pubState.matchId !== activeDuel.matchId) return;
    activeDuel = pubState;
    mySelectedOption = null;
    roundResultBanner.classList.add('hidden');
    renderDuelArena();
    startDuelCountdown();
  });

  socket.on('duel:finished', (summary) => {
    if (summary.playerA.id !== currentPlayerId && summary.playerB.id !== currentPlayerId) return;
    if (localTimerInterval) clearInterval(localTimerInterval);
    activeDuel = null;
    duelArenaCard.classList.add('hidden');
    renderMatchSummary(summary);
  });

  socket.emit('player:select', { playerId: currentPlayerId });
})();
