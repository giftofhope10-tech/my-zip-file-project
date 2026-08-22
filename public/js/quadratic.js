/* quadratic.js — Quadratic Equation Calculator */
(function () {
  'use strict';

  document.getElementById('quadBtn').addEventListener('click', function () {
    CalcUtils.clearError(document.getElementById('quadError'));
    var a = CalcUtils.num(document.getElementById('quadA').value);
    var b = CalcUtils.num(document.getElementById('quadB').value);
    var c = CalcUtils.num(document.getElementById('quadC').value);
    var resultEl = document.getElementById('quadResult');

    if (a === null || b === null || c === null) {
      CalcUtils.showError(document.getElementById('quadError'), 'Please enter all three coefficients a, b and c.');
      resultEl.innerHTML = '';
      return;
    }
    if (a === 0) {
      CalcUtils.showError(document.getElementById('quadError'), 'Coefficient a must not be zero — otherwise this is a linear equation, not a quadratic. Use the Algebra Calculator for linear equations.');
      resultEl.innerHTML = '';
      return;
    }

    var discriminant = b * b - 4 * a * c;
    var discFmt = CalcUtils.fmt(discriminant);
    var steps = '<div><strong>Discriminant:</strong> Δ = b² − 4ac = (' + b + ')² − 4(' + a + ')(' + c + ') = ' + discFmt + '</div>';

    var rootsHtml = '';
    if (discrimant > 0) {
      /* Two distinct real roots */
      var sqrtD = Math.sqrt(discriminant);
      var x1 = (-b + sqrtD) / (2 * a);
      var x2 = (-b - sqrtD) / (2 * a);
      steps += '<div><strong>Since Δ > 0:</strong> Two distinct real roots</div>';
      steps += '<div><strong>Apply formula:</strong> x = (−b ± √Δ) / 2a = (' + (-b) + ' ± ' + CalcUtils.fmt(sqrtD) + ') / ' + (2 * a) + '</div>';
      rootsHtml = '<div class="result-value">x₁ = ' + CalcUtils.fmt(x1) + ', &nbsp; x₂ = ' + CalcUtils.fmt(x2) + '</div>';
      steps += '<div><strong>Root 1:</strong> x = (' + (-b) + ' + ' + CalcUtils.fmt(sqrtD) + ') / ' + (2 * a) + ' = ' + CalcUtils.fmt(x1) + '</div>';
      steps += '<div><strong>Root 2:</strong> x = (' + (-b) + ' − ' + CalcUtils.fmt(sqrtD) + ') / ' + (2 * a) + ' = ' + CalcUtils.fmt(x2) + '</div>';
    } else if (discriminant === 0) {
      /* One repeated real root */
      var x = -b / (2 * a);
      steps += '<div><strong>Since Δ = 0:</strong> One repeated real root</div>';
      steps += '<div><strong>Apply formula:</strong> x = −b / 2a = ' + (-b) + ' / ' + (2 * a) + ' = ' + CalcUtils.fmt(x) + '</div>';
      rootsHtml = '<div class="result-value">x = ' + CalcUtils.fmt(x) + ' (repeated root)</div>';
    } else {
      /* Two complex conjugate roots */
      var realPart = -b / (2 * a);
      var imagPart = Math.sqrt(-discriminant) / (2 * a);
      steps += '<div><strong>Since Δ < 0:</strong> Two complex conjugate roots</div>';
      steps += '<div><strong>Apply formula:</strong> x = (−b ± i√|Δ|) / 2a = (' + (-b) + ' ± i·' + CalcUtils.fmt(Math.sqrt(-discriminant)) + ') / ' + (2 * a) + '</div>';
      var realFmt = CalcUtils.fmt(realPart);
      var imagFmt = CalcUtils.fmt(Math.abs(imagPart));
      rootsHtml = '<div class="result-value">x₁ = ' + realFmt + ' + ' + imagFmt + 'i<br>x₂ = ' + realFmt + ' − ' + imagFmt + 'i</div>';
      steps += '<div><strong>Root 1:</strong> x = ' + realFmt + ' + ' + imagFmt + 'i</div>';
      steps += '<div><strong>Root 2:</strong> x = ' + realFmt + ' − ' + imagFmt + 'i</div>';
    }

    var equation = '';
    if (a !== 1) equation += a + 'x²';
    else equation += 'x²';
    if (b !== 0) equation += b < 0 ? ' − ' + Math.abs(b) + 'x' : ' + ' + b + 'x';
    if (c !== 0) equation += c < 0 ? ' − ' + Math.abs(c) : ' + ' + c;
    equation += ' = 0';

    resultEl.innerHTML =
      '<div class="result-label">Equation: ' + equation + '</div>' +
      rootsHtml +
      '<div class="result-detail">' + steps + '</div>';
  });

  document.getElementById('quadReset').addEventListener('click', function () {
    document.getElementById('quadA').value = '';
    document.getElementById('quadB').value = '';
    document.getElementById('quadC').value = '';
    document.getElementById('quadResult').innerHTML = '';
    CalcUtils.clearError(document.getElementById('quadError'));
  });

  /* Allow Enter key to submit */
  ['quadA', 'quadB', 'quadC'].forEach(function (id) {
    document.getElementById(id).addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('quadBtn').click();
    });
  });
})();
