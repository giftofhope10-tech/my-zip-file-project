/* scientific.js — Scientific Calculator */
(function () {
  'use strict';

  let expression = '';
  let result = '0';
  let mode = 'DEG';
  let memory = 0;
  let history = [];
  let justEvaluated = false;

  const exprEl = document.getElementById('sciExpr');
  const resultEl = document.getElementById('sciResult');
  const modeEl = document.getElementById('sciModeIndicator');
  const historyEl = document.getElementById('sciHistory');
  const errorEl = document.getElementById('sciError');
  const keypadEl = document.getElementById('sciKeypad');

  function updateDisplay() {
    exprEl.textContent = expression || '\u00A0';
    resultEl.textContent = result;
    modeEl.textContent = mode + ' | M: ' + (Math.abs(memory) < 1e12 ? memory : memory.toExponential(4));
  }

  function showError(msg) {
    errorEl.textContent = msg;
  }
  function clearError() {
    errorEl.textContent = '';
  }

  /* Key layout: [label, value, class] */
  const keys = [
    ['DEG/RAD', 'mode', 'fn'], ['(', '(', 'op'], [')', ')', 'op'], ['C', 'clear', 'clear'], ['⌫', 'back', 'op'],
    ['sin', 'sin', 'fn'], ['cos', 'cos', 'fn'], ['tan', 'tan', 'fn'], ['π', 'pi', 'fn'], ['e', 'euler', 'fn'],
    ['sin⁻¹', 'asin', 'fn'], ['cos⁻¹', 'acos', 'fn'], ['tan⁻¹', 'atan', 'fn'], ['x²', 'sq', 'fn'], ['√', 'sqrt', 'fn'],
    ['log', 'log', 'fn'], ['ln', 'ln', 'fn'], ['xʸ', 'pow', 'fn'], ['n!', 'fact', 'fn'], ['1/x', 'recip', 'fn'],
    ['7', '7', ''], ['8', '8', ''], ['9', '9', ''], ['÷', '/', 'op'], ['M+', 'mplus', 'fn'],
    ['4', '4', ''], ['5', '5', ''], ['6', '6', ''], ['×', '*', 'op'], ['M−', 'mminus', 'fn'],
    ['1', '1', ''], ['2', '2', ''], ['3', '3', ''], ['−', '-', 'op'], ['MR', 'mr', 'fn'],
    ['0', '0', ''], ['.', '.', ''], ['EXP', 'E', 'fn'], ['+', '+', 'op'], ['MC', 'mc', 'fn'],
    ['=', 'equals', 'eq wide'],
  ];

  keys.forEach(function (k) {
    const btn = document.createElement('button');
    btn.className = 'sci-key ' + (k[2] || '');
    btn.textContent = k[0];
    btn.setAttribute('data-action', k[1]);
    btn.setAttribute('aria-label', k[0]);
    btn.addEventListener('click', function () { handleKey(k[1], k[0]); });
    keypadEl.appendChild(btn);
  });

  function handleKey(action, label) {
    clearError();
    if (justEvaluated && /[0-9.]/.test(action)) {
      expression = '';
      result = '0';
      justEvaluated = false;
    } else if (justEvaluated && (action === 'equals' || ['sin','cos','tan','log','ln','sqrt','sq','fact','recip','asin','acos','atan'].indexOf(action) >= 0)) {
      expression = result;
      justEvaluated = false;
    } else {
      justEvaluated = false;
    }

    switch (action) {
      case 'clear':
        expression = '';
        result = '0';
        break;
      case 'back':
        expression = expression.slice(0, -1);
        break;
      case 'mode':
        mode = mode === 'DEG' ? 'RAD' : 'DEG';
        break;
      case 'pi':
        expression += 'π';
        break;
      case 'euler':
        expression += 'e';
        break;
      case 'sin': expression += 'sin('; break;
      case 'cos': expression += 'cos('; break;
      case 'tan': expression += 'tan('; break;
      case 'asin': expression += 'asin('; break;
      case 'acos': expression += 'acos('; break;
      case 'atan': expression += 'atan('; break;
      case 'log': expression += 'log('; break;
      case 'ln': expression += 'ln('; break;
      case 'sqrt': expression += 'sqrt('; break;
      case 'sq': expression += '^2'; break;
      case 'pow': expression += '^'; break;
      case 'fact': expression += '!'; break;
      case 'recip': expression = '1/(' + expression + ')'; break;
      case 'mplus':
        evaluate();
        memory += parseFloat(result) || 0;
        break;
      case 'mminus':
        evaluate();
        memory -= parseFloat(result) || 0;
        break;
      case 'mr':
        expression += (Math.abs(memory) < 1e12 ? String(memory) : memory.toExponential(6));
        break;
      case 'mc':
        memory = 0;
        break;
      case 'equals':
        evaluate();
        return;
      default:
        expression += label;
    }
    updateDisplay();
  }

  function evaluate() {
    if (!expression.trim()) return;
    try {
      let expr = expression;

      /* Replace symbols */
      expr = expr.replace(/π/g, '(Math.PI)');
      expr = expr.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, '(Math.E)');

      /* Factorial: handle n! */
      expr = expr.replace(/(\d+\.?\d*|\))\s*!/g, function (match, base) {
        const n = parseFloat(base);
        if (n < 0 || n !== Math.floor(n)) throw new Error('Factorial requires a non-negative integer.');
        if (n > 170) return 'Infinity';
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return String(f);
      });

      /* Trig functions with DEG/RAD */
      if (mode === 'DEG') {
        expr = expr.replace(/sin\(/g, 'sinD(');
        expr = expr.replace(/cos\(/g, 'cosD(');
        expr = expr.replace(/tan\(/g, 'tanD(');
        expr = expr.replace(/asin\(/g, 'asinD(');
        expr = expr.replace(/acos\(/g, 'acosD(');
        expr = expr.replace(/atan\(/g, 'atanD(');
      }

      /* Replace function names */
      expr = expr.replace(/sinD\(/g, 'Math.sin(($1)*Math.PI/180)'.replace('$1',''));
      expr = expr.replace(/sin\(/g, 'Math.sin(');
      expr = expr.replace(/cosD\(/g, 'Math.cos(');
      expr = expr.replace(/cos\(/g, 'Math.cos(');
      expr = expr.replace(/tanD\(/g, 'Math.tan(');
      expr = expr.replace(/tan\(/g, 'Math.tan(');

      /* Inverse trig — convert result to degrees if in DEG mode */
      expr = expr.replace(/asinD\(/g, mode === 'DEG' ? 'asinDeg(' : 'Math.asin(');
      expr = expr.replace(/asin\(/g, 'Math.asin(');
      expr = expr.replace(/acosD\(/g, mode === 'DEG' ? 'acosDeg(' : 'Math.acos(');
      expr = expr.replace(/acos\(/g, 'Math.acos(');
      expr = expr.replace(/atanD\(/g, mode === 'DEG' ? 'atanDeg(' : 'Math.atan(');
      expr = expr.replace(/atan\(/g, 'Math.atan(');

      /* Logarithms */
      expr = expr.replace(/log\(/g, 'Math.log10(');
      expr = expr.replace(/ln\(/g, 'Math.log(');

      /* Square root */
      expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');

      /* Power: a^b -> Math.pow(a,b) — handle simple cases */
      expr = expr.replace(/\^/g, '**');

      /* Scientific notation E */
      expr = expr.replace(/(?<![a-zA-Z])E(?![a-zA-Z])/g, 'e');

      /* Define degree-mode inverse trig helpers */
      var sinDeg = function (x) { return Math.sin(x * Math.PI / 180); };
      var cosDeg = function (x) { return Math.cos(x * Math.PI / 180); };
      var tanDeg = function (x) { return Math.tan(x * Math.PI / 180); };
      var asinDeg = function (x) { return Math.asin(x) * 180 / Math.PI; };
      var acosDeg = function (x) { return Math.acos(x) * 180 / Math.PI; };
      var atanDeg = function (x) { return Math.atan(x) * 180 / Math.PI; };

      /* Evaluate */
      var fn = new Function('sinDeg', 'cosDeg', 'tanDeg', 'asinDeg', 'acosDeg', 'atanDeg', 'return ' + expr);
      var val = fn(sinDeg, cosDeg, tanDeg, asinDeg, acosDeg, atanDeg);

      if (typeof val !== 'number' || isNaN(val)) throw new Error('Invalid expression.');
      if (!isFinite(val)) { result = val > 0 ? '∞' : '-∞'; }
      else {
        result = parseFloat(val.toPrecision(12)).toString();
      }

      /* Add to history */
      history.unshift({ expr: expression, result: result });
      if (history.length > 20) history.pop();
      renderHistory();

      justEvaluated = true;
    } catch (e) {
      showError('Error: ' + (e.message || 'Invalid expression.'));
      result = 'Error';
    }
    updateDisplay();
  }

  function renderHistory() {
    historyEl.innerHTML = history.map(function (h, i) {
      return '<div class="sci-history-item" data-idx="' + i + '">' +
        CalcUtils.esc(h.expr) + ' = <span class="res">' + CalcUtils.esc(h.result) + '</span></div>';
    }).join('');
    historyEl.querySelectorAll('.sci-history-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-idx'));
        expression = history[idx].result;
        justEvaluated = true;
        updateDisplay();
      });
    });
  }

  /* Keyboard support */
  document.addEventListener('keydown', function (e) {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    var key = e.key;
    if (/[0-9.+\-*/()^]/.test(key)) {
      e.preventDefault();
      handleKey(key, key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleKey('equals', '=');
    } else if (key === 'Escape') {
      e.preventDefault();
      handleKey('clear', 'C');
    } else if (key === 'Backspace') {
      e.preventDefault();
      handleKey('back', '⌫');
    }
  });

  updateDisplay();
})();
