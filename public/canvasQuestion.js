/**
 * Renders question text (including LaTeX $$...$$ expressions) onto an HTML5 Canvas
 * to prevent plain-text DOM scraping / copy-pasting into external AI bots.
 */
(function (global) {
  function formatLatexToReadable(rawText) {
    if (!rawText) return '';
    let s = String(rawText);

    // Strip $$ delimiters while keeping inner math formatted cleanly
    s = s.replace(/\$\$(.*?)\$\$/g, (_, math) => {
      let m = math;
      // Fractions \frac{a}{b} -> (a / b)
      m = m.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
      // Square root \sqrt{x} -> √(x)
      m = m.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
      // Definite integral \int_{a}^{b} -> ∫[a→b]
      m = m.replace(/\\int_\{([^{}]+)\}\^\{([^{}]+)\}/g, '∫[$1→$2]');
      // Limit \lim_{x \to a} -> lim(x→a)
      m = m.replace(/\\lim_\{([^{}]+)\}/g, 'lim($1)');
      m = m.replace(/\\to/g, '→');
      m = m.replace(/\\rightarrow/g, '→');
      // Text blocks \text{...}
      m = m.replace(/\\text\{([^{}]+)\}/g, '$1');
      // Greek & symbols
      m = m
        .replace(/\\pi/g, 'π')
        .replace(/\\Omega/g, 'Ω')
        .replace(/\\omega/g, 'ω')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\\circ/g, '°')
        .replace(/\\cdot/g, '·')
        .replace(/\\times/g, '×')
        .replace(/\\cup/g, '∪')
        .replace(/\\cap/g, '∩')
        .replace(/\\%/g, '%')
        .replace(/\\,/g, ' ');
      // Superscripts
      const supMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 'n': 'ⁿ' };
      m = m.replace(/\^\{([^{}]+)\}/g, (__, exp) =>
        exp
          .split('')
          .map((ch) => supMap[ch] || ch)
          .join('')
      );
      m = m.replace(/\^([0-9n+-])/g, (__, ch) => supMap[ch] || `^${ch}`);

      // Subscripts
      const subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ', 'i': 'ᵢ', 'g': '₉' };
      m = m.replace(/_\{([^{}]+)\}/g, (__, sub) =>
        sub
          .split('')
          .map((ch) => subMap[ch] || ch)
          .join('')
      );
      m = m.replace(/_([0-9nig])/g, (__, ch) => subMap[ch] || `_${ch}`);

      return ` ${m.trim()} `;
    });

    return s.replace(/\s+/g, ' ').trim();
  }

  function wrapLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function renderQuestionOnCanvas(canvas, question, questionIndex, totalQuestions) {
    if (!canvas || !question) return;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 720;
    const cssHeight = 220;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Subtle anti-OCR geometric watermark mesh
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < cssWidth; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 40, cssHeight);
      ctx.stroke();
    }

    // Watermark text
    ctx.fillStyle = 'rgba(248, 250, 252, 0.035)';
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    ctx.fillText('İŞLER AKADEMİ KORUMALI SORU TUVALİ', 24, cssHeight - 18);

    // Top metadata bar
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 13px Inter, system-ui, sans-serif';
    const metaHeader = `SORU ${questionIndex + 1}/${totalQuestions}  •  ${question.examType} ${question.subject.toUpperCase()}  •  ${question.subTopic || 'Genel'}  •  ZORLUK: ${question.difficulty}`;
    ctx.fillText(metaHeader, 24, 34);

    // Question body text
    const readableText = formatLatexToReadable(question.text);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 19px Inter, system-ui, sans-serif';
    const lines = wrapLines(ctx, readableText, cssWidth - 48);

    let y = 76;
    for (const line of lines) {
      ctx.fillText(line, 24, y);
      y += 30;
    }

    // Security badge in bottom right
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillText(`🔒 Anti-Bot Canvas Render (${question.externalId})`, cssWidth - 255, cssHeight - 14);

    ctx.restore();

    // Prevent right-click / drag
    canvas.oncontextmenu = (e) => e.preventDefault();
  }

  global.CanvasQuestionRenderer = {
    formatLatexToReadable,
    renderQuestionOnCanvas,
  };
})(window);
