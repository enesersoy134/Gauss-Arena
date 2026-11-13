const { calculateQuestionScore, calculateMatchEloUpdate, calculateEffectiveMMR } = require('./eloMomentum');

function round2(val) {
  return Math.round(val * 100) / 100;
}

class DuelSession {
  constructor({
    matchId,
    playerA,
    playerB,
    questions,
    commonSubjects = ['matematik'],
    examType = 'TYT',
    mode = 'ranked',
    tournamentId = null,
    diagnostics = null,
    startedAt = Date.now(),
  }) {
    this.matchId = String(matchId);
    this.playerA = {
      id: String(playerA.id || playerA.playerId),
      name: playerA.name,
      avatarUrl: playerA.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + encodeURIComponent(playerA.name || 'P1'),
      elo: Number(playerA.elo) || 1200,
      streak: Number(playerA.streak) || 0,
      effectiveMmr: calculateEffectiveMMR(playerA.elo, playerA.streak),
      isGhost: Boolean(playerA.isGhost),
    };
    this.playerB = {
      id: String(playerB.id || playerB.playerId),
      name: playerB.name,
      avatarUrl: playerB.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + encodeURIComponent(playerB.name || 'P2'),
      elo: Number(playerB.elo) || 1200,
      streak: Number(playerB.streak) || 0,
      effectiveMmr: calculateEffectiveMMR(playerB.elo, playerB.streak),
      isGhost: Boolean(playerB.isGhost),
    };
    this.questions = questions || [];
    this.commonSubjects = commonSubjects;
    this.examType = examType;
    this.mode = mode;
    this.tournamentId = tournamentId;
    this.diagnostics = diagnostics;

    this.currentQuestionIndex = 0;
    this.questionStartedAt = startedAt;
    this.status = 'IN_PROGRESS'; // IN_PROGRESS | COMPLETED
    this.roundHistory = [];
    this.currentAnswers = new Map(); // playerId -> { selectedOptionIndex, answeredAt, remainingMs, isCorrect, score }
    this.finalSummary = null;
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }

  getCurrentPublicState(now = Date.now()) {
    const q = this.getCurrentQuestion();
    const durationMs = q ? (q.durationMs || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds ? q.interactiveQuestion.timeLimitSeconds * 1000 : 20000)) : 20000;
    const elapsedMs = Math.max(0, now - this.questionStartedAt);
    const remainingMs = Math.max(0, durationMs - elapsedMs);

    return {
      matchId: this.matchId,
      status: this.status,
      mode: this.mode,
      tournamentId: this.tournamentId,
      examType: this.examType,
      commonSubjects: this.commonSubjects,
      diagnostics: this.diagnostics,
      playerA: {
        ...this.playerA,
        totalScore: this.getPlayerTotalScore(this.playerA.id),
        correctCount: this.getPlayerCorrectCount(this.playerA.id),
        hasAnsweredCurrent: this.currentAnswers.has(this.playerA.id),
      },
      playerB: {
        ...this.playerB,
        totalScore: this.getPlayerTotalScore(this.playerB.id),
        correctCount: this.getPlayerCorrectCount(this.playerB.id),
        hasAnsweredCurrent: this.currentAnswers.has(this.playerB.id),
      },
      currentQuestionIndex: this.currentQuestionIndex,
      totalQuestions: this.questions.length,
      questionStartedAt: this.questionStartedAt,
      durationMs,
      remainingMs,
      currentQuestion: q
        ? {
            externalId: q.externalId,
            examType: q.examType,
            subject: q.subject,
            difficulty: q.difficulty,
            subTopic: q.subTopic,
            text: q.text,
            imageUrl: q.imageUrl,
            options: q.options,
            durationMs,
            interactiveQuestion: q.interactiveQuestion || null,
            explanation: q.explanation || (q.interactiveQuestion && q.interactiveQuestion.explanation) || null,
          }
        : null,
      roundHistory: this.roundHistory,
    };
  }

  getPlayerTotalScore(playerId) {
    const id = String(playerId);
    const histSum = this.roundHistory.reduce((acc, r) => {
      if (id === this.playerA.id) return acc + r.answerA.score;
      if (id === this.playerB.id) return acc + r.answerB.score;
      return acc;
    }, 0);
    const curr = this.currentAnswers.get(id);
    return Math.round(histSum + (curr ? curr.score : 0));
  }

  getPlayerCorrectCount(playerId) {
    const id = String(playerId);
    const histCount = this.roundHistory.reduce((acc, r) => {
      if (id === this.playerA.id) return acc + (r.answerA.isCorrect ? 1 : 0);
      if (id === this.playerB.id) return acc + (r.answerB.isCorrect ? 1 : 0);
      return acc;
    }, 0);
    const curr = this.currentAnswers.get(id);
    return histCount + (curr && curr.isCorrect ? 1 : 0);
  }

  submitAnswer(playerId, questionIndex, answerInput, now = Date.now()) {
    const id = String(playerId);
    if (this.status !== 'IN_PROGRESS') {
      return { accepted: false, reason: 'Düello tamamlandı' };
    }
    if (Number(questionIndex) !== this.currentQuestionIndex) {
      return { accepted: false, reason: 'Geçersiz soru indeksi' };
    }
    if (id !== this.playerA.id && id !== this.playerB.id) {
      return { accepted: false, reason: 'Oyuncu bu düelloda değil' };
    }
    if (this.currentAnswers.has(id)) {
      return { accepted: false, reason: 'Bu soru için zaten cevap gönderildi' };
    }

    const q = this.getCurrentQuestion();
    const durationMs = q.durationMs || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds ? q.interactiveQuestion.timeLimitSeconds * 1000 : 20000);
    const elapsedMs = Math.max(0, now - this.questionStartedAt);
    const remainingMs = Math.max(0, Math.min(durationMs, durationMs - elapsedMs));

    let optIdx = -1;
    let isCorrect = false;
    let accuracy = 0;
    let score = 0;

    if (typeof answerInput === 'object' && answerInput !== null) {
      if (answerInput.skipped) {
        isCorrect = false;
        accuracy = 0;
        optIdx = -1;
        score = 0;
      } else {
        const qType = q.type || q.interactiveQuestion?.type;
        const allowsPartial = ['matrix_toggle', 'pair_matching', 'swipe_grouping'].includes(qType);
        isCorrect = Boolean(answerInput.isCorrect);
        const rawAcc = typeof answerInput.accuracy === 'number'
          ? Math.max(0, Math.min(1, answerInput.accuracy))
          : (isCorrect ? 1 : 0);
        accuracy = isCorrect ? 1 : (allowsPartial ? rawAcc : 0);
        optIdx = answerInput.selectedOptionIndex !== undefined && answerInput.selectedOptionIndex !== null
          ? Number(answerInput.selectedOptionIndex)
          : -1;
        const baseScore = calculateQuestionScore(isCorrect || accuracy > 0, remainingMs, durationMs);
        score = Math.round(baseScore * (isCorrect ? 1 : accuracy));
      }
    } else {
      optIdx = answerInput === null || answerInput === undefined ? -1 : Number(answerInput);
      isCorrect = optIdx >= 0 && q.correctOptionIndex !== undefined && q.correctOptionIndex >= 0 && optIdx === q.correctOptionIndex;
      accuracy = isCorrect ? 1 : 0;
      score = calculateQuestionScore(isCorrect, remainingMs, durationMs);
    }

    this.currentAnswers.set(id, {
      selectedOptionIndex: optIdx,
      answeredAt: now,
      remainingMs: Math.round(remainingMs),
      isCorrect,
      accuracy,
      score,
      answerInput: typeof answerInput === 'object' ? answerInput : null,
    });

    const bothAnswered = this.currentAnswers.has(this.playerA.id) && this.currentAnswers.has(this.playerB.id);
    let roundResult = null;
    if (bothAnswered) {
      roundResult = this.buildCurrentRoundResult();
    }

    return {
      accepted: true,
      bothAnswered,
      roundResult,
    };
  }

  forceQuestionTimeout(now = Date.now()) {
    const q = this.getCurrentQuestion();
    const durationMs = q ? (q.durationMs || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds ? q.interactiveQuestion.timeLimitSeconds * 1000 : 20000)) : 20000;
    if (!this.currentAnswers.has(this.playerA.id)) {
      this.submitAnswer(this.playerA.id, this.currentQuestionIndex, { isCorrect: false, accuracy: 0, skipped: true }, this.questionStartedAt + durationMs);
    }
    if (!this.currentAnswers.has(this.playerB.id)) {
      this.submitAnswer(this.playerB.id, this.currentQuestionIndex, { isCorrect: false, accuracy: 0, skipped: true }, this.questionStartedAt + durationMs);
    }
    return {
      roundResult: this.buildCurrentRoundResult(),
    };
  }

  buildCurrentRoundResult() {
    const q = this.getCurrentQuestion();
    const ansA = this.currentAnswers.get(this.playerA.id) || {
      selectedOptionIndex: -1,
      remainingMs: 0,
      isCorrect: false,
      score: 0,
    };
    const ansB = this.currentAnswers.get(this.playerB.id) || {
      selectedOptionIndex: -1,
      remainingMs: 0,
      isCorrect: false,
      score: 0,
    };

    return {
      questionIndex: this.currentQuestionIndex,
      externalId: q.externalId,
      difficulty: q.difficulty,
      subject: q.subject,
      subTopic: q.subTopic || (q.interactiveQuestion && q.interactiveQuestion.topic) || q.subject,
      text: q.text || (q.interactiveQuestion && q.interactiveQuestion.prompt) || '',
      correctOptionIndex: q.correctOptionIndex,
      durationMs: q.durationMs || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds ? q.interactiveQuestion.timeLimitSeconds * 1000 : 20000),
      timeLimitSeconds: q.timeLimitSeconds || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds ? q.interactiveQuestion.timeLimitSeconds : 20),
      interactiveQuestion: q.interactiveQuestion || null,
      explanation: q.explanation || (q.interactiveQuestion && q.interactiveQuestion.explanation) || null,
      answerA: ansA,
      answerB: ansB,
    };
  }

  advanceToNextQuestion(now = Date.now()) {
    if (this.status === 'COMPLETED') {
      return { finished: true, finalSummary: this.finalSummary };
    }

    const roundResult = this.buildCurrentRoundResult();
    this.roundHistory.push(roundResult);
    this.currentAnswers.clear();

    if (this.currentQuestionIndex + 1 < this.questions.length) {
      this.currentQuestionIndex += 1;
      this.questionStartedAt = now;
      return {
        finished: false,
        currentQuestionIndex: this.currentQuestionIndex,
      };
    }

    this.status = 'COMPLETED';
    this.finalSummary = this.computeFinalSummary(now);
    return {
      finished: true,
      finalSummary: this.finalSummary,
    };
  }

  computeFinalSummary(now = Date.now()) {
    const totalScoreA = this.getPlayerTotalScore(this.playerA.id);
    const totalScoreB = this.getPlayerTotalScore(this.playerB.id);
    const correctCountA = this.getPlayerCorrectCount(this.playerA.id);
    const correctCountB = this.getPlayerCorrectCount(this.playerB.id);

    let outcomeA = 'draw';
    let winnerId = null;
    let winnerName = 'Berabere';

    if (totalScoreA > totalScoreB) {
      outcomeA = 'win';
      winnerId = this.playerA.id;
      winnerName = this.playerA.name;
    } else if (totalScoreB > totalScoreA) {
      outcomeA = 'loss';
      winnerId = this.playerB.id;
      winnerName = this.playerB.name;
    }

    const eloUpdate = calculateMatchEloUpdate(this.playerA, this.playerB, outcomeA);
    const baseWinCoins = this.mode === 'tournament' ? 25 : 15;
    const coinsAwardedA = outcomeA === 'win' ? baseWinCoins : outcomeA === 'draw' ? 5 : 0;
    const coinsAwardedB = outcomeA === 'loss' ? baseWinCoins : outcomeA === 'draw' ? 5 : 0;

    return {
      matchId: this.matchId,
      completedAt: new Date(now).toISOString(),
      mode: this.mode,
      tournamentId: this.tournamentId,
      examType: this.examType,
      commonSubjects: this.commonSubjects,
      winnerId,
      winnerName,
      tieBreakerUsed: correctCountA === correctCountB && totalScoreA !== totalScoreB,
      playerA: {
        ...this.playerA,
        totalScore: totalScoreA,
        correctCount: correctCountA,
        newElo: eloUpdate.newEloA,
        deltaElo: eloUpdate.deltaA,
        newStreak: eloUpdate.newStreakA,
        newEffectiveMmr: calculateEffectiveMMR(eloUpdate.newEloA, eloUpdate.newStreakA),
      },
      playerB: {
        ...this.playerB,
        totalScore: totalScoreB,
        correctCount: correctCountB,
        newElo: eloUpdate.newEloB,
        deltaElo: eloUpdate.deltaB,
        newStreak: eloUpdate.newStreakB,
        newEffectiveMmr: calculateEffectiveMMR(eloUpdate.newEloB, eloUpdate.newStreakB),
      },
      eloUpdate,
      coinsAwardedA,
      coinsAwardedB,
      roundHistory: this.roundHistory,
    };
  }
}

module.exports = {
  DuelSession,
};
