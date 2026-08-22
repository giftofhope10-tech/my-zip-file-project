/* percentage.js — Percentage Calculator */
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

  /* X% of Y */
  document.getElementById('pctOfBtn').addEventListener('click', function () {
    clrErr('pctOfError');
    var p = CalcUtils.num(document.getElementById('pctOfPct').value);
    var y = CalcUtils.num(document.getElementById('pctOfVal').value);
    if (p === null || y === null) { err('pctOfError', 'Please enter both the percentage and the value.'); clearResult('pctOfResult'); return; }
    var result = (p / 100) * y;
    showResult('pctOfResult', p + '% of ' + y, CalcUtils.fmt(result),
      '<div><strong>Formula:</strong> (' + p + ' / 100) × ' + y + ' = ' + CalcUtils.fmt(result) + '</div>');
  });
  document.getElementById('pctOfReset').addEventListener('click', function () {
    document.getElementById('pctOfPct').value = ''; document.getElementById('pctOfVal').value = '';
    clearResult('pctOfResult'); clrErr('pctOfError');
  });

  /* X is what % of Y */
  document.getElementById('pctIsBtn').addEventListener('click', function () {
    clrErr('pctIsError');
    var x = CalcUtils.num(document.getElementById('pctIsX').value);
    var y = CalcUtils.num(document.getElementById('pctIsY').value);
    if (x === null || y === null) { err('pctIsError', 'Please enter both values.'); clearResult('pctIsResult'); return; }
    if (y === 0) { err('pctIsError', 'Cannot divide by zero — the second value must not be 0.'); clearResult('pctIsResult'); return; }
    var result = (x / y) * 100;
    showResult('pctIsResult', x + ' is what % of ' + y, CalcUtils.fmt(result) + '%',
      '<div><strong>Formula:</strong> (' + x + ' / ' + y + ') × 100 = ' + CalcUtils.fmt(result) + '%</div>');
  });
  document.getElementById('pctIsReset').addEventListener('click', function () {
    document.getElementById('pctIsX').value = ''; document.getElementById('pctIsY').value = '';
    clearResult('pctIsResult'); clrErr('pctIsError');
  });

  /* % Increase */
  document.getElementById('pctIncBtn').addEventListener('click', function () {
    clrErr('pctIncError');
    var oldV = CalcUtils.num(document.getElementById('pctIncOld').value);
    var newV = CalcUtils.num(document.getElementById('pctIncNew').value);
    if (oldV === null || newV === null) { err('pctIncError', 'Please enter both values.'); clearResult('pctIncResult'); return; }
    if (oldV === 0) { err('pctIncError', 'Original value cannot be zero.'); clearResult('pctIncResult'); return; }
    var result = ((newV - oldV) / Math.abs(oldV)) * 100;
    var label = result >= 0 ? 'increase' : 'decrease';
    showResult('pctIncResult', 'Percentage ' + label, CalcUtils.fmt(Math.abs(result)) + '%',
      '<div><strong>Formula:</strong> ((' + newV + ' − ' + oldV + ') / |' + oldV + '|) × 100 = ' + CalcUtils.fmt(result) + '%</div>' +
      '<div>The value ' + (result >= 0 ? 'increased' : 'decreased') + ' by ' + CalcUtils.fmt(Math.abs(result)) + '%.</div>');
  });
  document.getElementById('pctIncReset').addEventListener('click', function () {
    document.getElementById('pctIncOld').value = ''; document.getElementById('pctIncNew').value = '';
    clearResult('pctIncResult'); clrErr('pctIncError');
  });

  /* % Decrease */
  document.getElementById('pctDecBtn').addEventListener('click', function () {
    clrErr('pctDecError');
    var oldV = CalcUtils.num(document.getElementById('pctDecOld').value);
    var newV = CalcUtils.num(document.getElementById('pctDecNew').value);
    if (oldV === null || newV === null) { err('pctDecError', 'Please enter both values.'); clearResult('pctDecResult'); return; }
    if (oldV === 0) { err('pctDecError', 'Original value cannot be zero.'); clearResult('pctDecResult'); return; }
    var result = ((oldV - newV) / Math.abs(oldV)) * 100;
    showResult('pctDecResult', 'Percentage decrease', CalcUtils.fmt(result) + '%',
      '<div><strong>Formula:</strong> ((' + oldV + ' − ' + newV + ') / |' + oldV + '|) × 100 = ' + CalcUtils.fmt(result) + '%</div>');
  });
  document.getElementById('pctDecReset').addEventListener('click', function () {
    document.getElementById('pctDecOld').value = ''; document.getElementById('pctDecNew').value = '';
    clearResult('pctDecResult'); clrErr('pctDecError');
  });

  /* % Difference */
  document.getElementById('pctDiffBtn').addEventListener('click', function () {
    clrErr('pctDiffError');
    var a = CalcUtils.num(document.getElementById('pctDiffA').value);
    var b = CalcUtils.num(document.getElementById('pctDiffB').value);
    if (a === null || b === null) { err('pctDiffError', 'Please enter both values.'); clearResult('pctDiffResult'); return; }
    var avg = (a + b) / 2;
    if (avg === 0) { err('pctDiffError', 'The average of the two values is zero — percentage difference is undefined.'); clearResult('pctDiffResult'); return; }
    var result = (Math.abs(a - b) / Math.abs(avg)) * 100;
    showResult('pctDiffResult', 'Percentage difference', CalcUtils.fmt(result) + '%',
      '<div><strong>Formula:</strong> |' + a + ' − ' + b + '| / |(' + a + ' + ' + b + ') / 2| × 100 = ' + CalcUtils.fmt(result) + '%</div>');
  });
  document.getElementById('pctDiffReset').addEventListener('click', function () {
    document.getElementById('pctDiffA').value = ''; document.getElementById('pctDiffB').value = '';
    clearResult('pctDiffResult'); clrErr('pctDiffError');
  });

  /* Original Value */
  document.getElementById('pctOrigBtn').addEventListener('click', function () {
    clrErr('pctOrigError');
    var final = CalcUtils.num(document.getElementById('pctOrigFinal').value);
    var pct = CalcUtils.num(document.getElementById('pctOrigPct').value);
    var type = document.getElementById('pctOrigType').value;
    if (final === null || pct === null) { err('pctOrigError', 'Please enter the final value and percentage.'); clearResult('pctOrigResult'); return; }
    var divisor = type === 'increase' ? (1 + pct / 100) : (1 - pct / 100);
    if (divisor === 0) { err('pctOrigError', 'The percentage produces a zero divisor — invalid input.'); clearResult('pctOrigResult'); return; }
    var original = final / divisor;
    showResult('pctOrigResult', 'Original value', CalcUtils.fmt(original),
      '<div><strong>Formula:</strong> ' + final + ' / (1 ' + (type === 'increase' ? '+' : '−') + ' ' + pct + '/100) = ' + CalcUtils.fmt(original) + '</div>' +
      '<div>The original value before a ' + pct + '% ' + type + ' was ' + CalcUtils.fmt(original) + '.</div>');
  });
  document.getElementById('pctOrigReset').addEventListener('click', function () {
    document.getElementById('pctOrigFinal').value = ''; document.getElementById('pctOrigPct').value = '';
    clearResult('pctOrigResult'); clrErr('pctOrigError');
  });
})();
