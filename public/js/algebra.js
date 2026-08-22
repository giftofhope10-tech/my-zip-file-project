/* algebra.js — Algebra Calculator */
(function () {
  'use strict';

  function showResult(elId, label, value, detail) {
    var el = document.getElementById(elId);
    el.innerHTML = '<div class="result-label">' + label + '</div>' +
      '<div class="result-value">' + value + '</div>' +
      (detail ? '<div class="result-detail">' + detail + '</div>' : '');
  }
  function clearResult(elId) { document.getElementById(elId).innerHTML = ''; }
  function err(elId, msg) { CalcUtils.showError(document.getElementById(elId), msg); }
  function clrErr(elId) { CalcUtils.clearError(document.getElementById(elId)); }

  /* Linear equation: ax + b = c → x = (c - b) / a */
  document.getElementById('linBtn').addEventListener('click', function () {
    clrErr('linError');
    var a = CalcUtils.num(document.getElementById('linA').value);
    var b = CalcUtils.num(document.getElementById('linB').value);
    var c = CalcUtils.num(document.getElementById('linC').value);
    if (a === null || b === null || c === null) { err('linError', 'Please enter all three values.'); clearResult('linResult'); return; }
    var steps = '<div><strong>Original equation:</strong> ' + a + 'x + ' + b + ' = ' + c + '</div>';
    var rhs = c - b;
    steps += '<div><strong>Step 1 — Subtract ' + b + ' from both sides:</strong> ' + a + 'x = ' + c + ' − ' + b + ' = ' + CalcUtils.fmt(rhs) + '</div>';
    if (a === 0) {
      if (rhs === 0) { err('linError', 'a = 0 and c − b = 0: the equation is true for all x (infinitely many solutions).'); }
      else { err('linError', 'a = 0 and c − b ≠ 0: the equation has no solution (contradiction).'); }
      clearResult('linResult');
      return;
    }
    var x = rhs / a;
    steps += '<div><strong>Step 2 — Divide both sides by ' + a + ':</strong> x = ' + CalcUtils.fmt(rhs) + ' / ' + a + ' = ' + CalcUtils.fmt(x) + '</div>';
    showResult('linResult', 'Solution', 'x = ' + CalcUtils.fmt(x), steps);
  });
  document.getElementById('linReset').addEventListener('click', function () {
    ['linA','linB','linC'].forEach(function (id) { document.getElementById(id).value = ''; });
    clearResult('linResult'); clrErr('linError');
  });

  /* Quadratic equation */
  document.getElementById('qaBtn').addEventListener('click', function () {
    clrErr('qaError');
    var a = CalcUtils.num(document.getElementById('qaA').value);
    var b = CalcUtils.num(document.getElementById('qaB').value);
    var c = CalcUtils.num(document.getElementById('qaC').value);
    if (a === null || b === null || c === null) { err('qaError', 'Please enter all three coefficients.'); clearResult('qaResult'); return; }
    if (a === 0) { err('qaError', 'a must not be zero — this is a linear equation. Use the Linear Equation tab.'); clearResult('qaResult'); return; }
    var disc = b * b - 4 * a * c;
    var steps = '<div><strong>Discriminant:</strong> Δ = ' + b + '² − 4(' + a + ')(' + c + ') = ' + CalcUtils.fmt(disc) + '</div>';
    var roots;
    if (disc > 0) {
      var sq = Math.sqrt(disc);
      roots = 'x₁ = ' + CalcUtils.fmt((-b + sq) / (2 * a)) + ', x₂ = ' + CalcUtils.fmt((-b - sq) / (2 * a));
      steps += '<div><strong>Δ > 0:</strong> Two real roots: x = (' + (-b) + ' ± ' + CalcUtils.fmt(sq) + ') / ' + (2 * a) + '</div>';
    } else if (disc === 0) {
      roots = 'x = ' + CalcUtils.fmt(-b / (2 * a)) + ' (repeated)';
      steps += '<div><strong>Δ = 0:</strong> One repeated root: x = ' + (-b) + ' / ' + (2 * a) + '</div>';
    } else {
      var rp = CalcUtils.fmt(-b / (2 * a));
      var ip = CalcUtils.fmt(Math.sqrt(-disc) / (2 * a));
      roots = 'x₁ = ' + rp + ' + ' + ip + 'i, x₂ = ' + rp + ' − ' + ip + 'i';
      steps += '<div><strong>Δ < 0:</strong> Complex conjugate roots: x = ' + rp + ' ± ' + ip + 'i</div>';
    }
    showResult('qaResult', 'Roots', roots, steps);
  });
  document.getElementById('qaReset').addEventListener('click', function () {
    ['qaA','qaB','qaC'].forEach(function (id) { document.getElementById(id).value = ''; });
    clearResult('qaResult'); clrErr('qaError');
  });

  /* Expression evaluator */
  document.getElementById('simpExprBtn').addEventListener('click', function () {
    clrErr('simpExprError');
    var expr = document.getElementById('simpExpr').value.trim();
    if (!expr) { err('simpExprError', 'Please enter an expression.'); clearResult('simpExprResult'); return; }
    /* Sanitize: only allow numbers, operators, parentheses, decimal points, spaces */
    if (!/^[0-9+\-*/().^ ]+$/.test(expr)) { err('simpExprError', 'Expression contains invalid characters. Use only numbers, +, −, ×, ÷, parentheses and exponents (^).'); clearResult('simpExprResult'); return; }
    try {
      var cleaned = expr.replace(/\^/g, '**');
      var val = Function('"use strict"; return (' + cleaned + ')')();
      if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) throw new Error('Invalid expression.');
      showResult('simpExprResult', 'Result', CalcUtils.fmt(val), '<div><strong>Expression:</strong> ' + CalcUtils.esc(expr) + '</div>');
    } catch (e) {
      err('simpExprError', 'Could not evaluate the expression. Please check your syntax.');
      clearResult('simpExprResult');
    }
  });
  document.getElementById('simpExprReset').addEventListener('click', function () {
    document.getElementById('simpExpr').value = '';
    clearResult('simpExprResult'); clrErr('simpExprError');
  });
})();
