/* fraction.js — Fraction Calculator */
(function () {
  'use strict';

  function parseFraction(wholeId, numId, denId) {
    var w = CalcUtils.num(document.getElementById(wholeId).value) || 0;
    var n = CalcUtils.num(document.getElementById(numId).value);
    var d = CalcUtils.num(document.getElementById(denId).value);
    if (n === null || d === null) return null;
    if (d === 0) return { error: 'Denominator cannot be zero.' };
    /* Convert mixed number to improper fraction */
    var sign = (d < 0 ? -1 : 1) * (n < 0 ? -1 : 1) * (w < 0 ? -1 : 1);
    n = Math.abs(n); d = Math.abs(d); w = Math.abs(w);
    var numerator = sign * (w * d + n);
    return { num: numerator, den: d };
  }

  function simplify(num, den) {
    if (den === 0) return null;
    if (num === 0) return { num: 0, den: 1 };
    var sign = (num < 0 ? -1 : 1) * (den < 0 ? -1 : 1);
    num = Math.abs(num); den = Math.abs(den);
    var g = CalcUtils.gcd(num, den);
    return { num: sign * (num / g), den: den / g };
  }

  function toMixed(num, den) {
    var sign = num < 0 ? '-' : '';
    num = Math.abs(num); den = Math.abs(den);
    var whole = Math.floor(num / den);
    var remainder = num % den;
    if (remainder === 0) return sign + whole;
    if (whole === 0) return sign + remainder + '/' + den;
    return sign + whole + ' ' + remainder + '/' + den;
  }

  function toDecimal(num, den) {
    return CalcUtils.fmt(num / den, 10);
  }

  function formatResult(num, den) {
    var s = simplify(num, den);
    var str = s.num + '/' + s.den;
    var mixed = toMixed(s.num, s.den);
    var dec = toDecimal(s.num, s.den);
    var detail = '<div><strong>Simplified:</strong> ' + str + '</div>';
    if (mixed !== str) detail += '<div><strong>Mixed number:</strong> ' + mixed + '</div>';
    detail += '<div><strong>Decimal:</strong> ' + dec + '</div>';
    return { value: str, detail: detail, mixed: mixed, dec: dec, simpNum: s.num, simpDen: s.den };
  }

  function showResult(elId, label, value, detail) {
    var el = document.getElementById(elId);
    el.innerHTML = '<div class="result-label">' + label + '</div>' +
      '<div class="result-value">' + value + '</div>' +
      (detail ? '<div class="result-detail">' + detail + '</div>' : '');
  }
  function clearResult(elId) { document.getElementById(elId).innerHTML = ''; }
  function err(elId, msg) { CalcUtils.showError(document.getElementById(elId), msg); }
  function clrErr(elId) { CalcUtils.clearError(document.getElementById(elId)); }

  /* Main calculation */
  document.getElementById('fracCalcBtn').addEventListener('click', function () {
    clrErr('fracCalcError');
    var f1 = parseFraction('frac1Whole', 'frac1Num', 'frac1Den');
    var f2 = parseFraction('frac2Whole', 'frac2Num', 'frac2Den');
    if (f1 === null || f2 === null) { err('fracCalcError', 'Please fill in numerators and denominators for both fractions.'); clearResult('fracCalcResult'); return; }
    if (f1.error) { err('fracCalcError', 'First fraction: ' + f1.error); clearResult('fracCalcResult'); return; }
    if (f2.error) { err('fracCalcError', 'Second fraction: ' + f2.error); clearResult('fracCalcResult'); return; }
    var op = document.getElementById('fracOp').value;
    var num, den, steps = '';
    switch (op) {
      case '+':
        var lcm = CalcUtils.lcm(f1.den, f2.den);
        num = f1.num * (lcm / f1.den) + f2.num * (lcm / f2.den);
        den = lcm;
        steps = 'Common denominator: ' + lcm + '. ' +
          f1.num + '/' + f1.den + ' = ' + (f1.num * (lcm / f1.den)) + '/' + lcm + ', ' +
          f2.num + '/' + f2.den + ' = ' + (f2.num * (lcm / f2.den)) + '/' + lcm + '. ' +
          'Sum: (' + (f1.num * (lcm / f1.den)) + ' + ' + (f2.num * (lcm / f2.den)) + ') / ' + lcm + ' = ' + num + '/' + den;
        break;
      case '-':
        lcm = CalcUtils.lcm(f1.den, f2.den);
        num = f1.num * (lcm / f1.den) - f2.num * (lcm / f2.den);
        den = lcm;
        steps = 'Common denominator: ' + lcm + '. ' +
          f1.num + '/' + f1.den + ' = ' + (f1.num * (lcm / f1.den)) + '/' + lcm + ', ' +
          f2.num + '/' + f2.den + ' = ' + (f2.num * (lcm / f2.den)) + '/' + lcm + '. ' +
          'Difference: (' + (f1.num * (lcm / f1.den)) + ' − ' + (f2.num * (lcm / f2.den)) + ') / ' + lcm + ' = ' + num + '/' + den;
        break;
      case '*':
        num = f1.num * f2.num;
        den = f1.den * f2.den;
        steps = 'Multiply: (' + f1.num + ' × ' + f2.num + ') / (' + f1.den + ' × ' + f2.den + ') = ' + num + '/' + den;
        break;
      case '/':
        if (f2.num === 0) { err('fracCalcError', 'Cannot divide by zero — the second fraction has a numerator of zero.'); clearResult('fracCalcResult'); return; }
        num = f1.num * f2.den;
        den = f1.den * f2.num;
        steps = 'Invert and multiply: (' + f1.num + ' × ' + f2.den + ') / (' + f1.den + ' × ' + f2.num + ') = ' + num + '/' + den;
        break;
    }
    var res = formatResult(num, den);
    showResult('fracCalcResult', 'Result', res.value, '<div><strong>Steps:</strong> ' + steps + '</div>' + res.detail);
  });
  document.getElementById('fracCalcReset').addEventListener('click', function () {
    ['frac1Whole','frac1Num','frac1Den','frac2Whole','frac2Num','frac2Den'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
    clearResult('fracCalcResult'); clrErr('fracCalcError');
  });

  /* Simplify */
  document.getElementById('simpBtn').addEventListener('click', function () {
    clrErr('simpError');
    var n = CalcUtils.num(document.getElementById('simpNum').value);
    var d = CalcUtils.num(document.getElementById('simpDen').value);
    if (n === null || d === null) { err('simpError', 'Please enter both a numerator and a denominator.'); clearResult('simpResult'); return; }
    if (d === 0) { err('simpError', 'Denominator cannot be zero.'); clearResult('simpResult'); return; }
    var g = CalcUtils.gcd(Math.abs(n), Math.abs(d));
    var res = formatResult(n, d);
    showResult('simpResult', 'Simplified Fraction', res.value, '<div><strong>GCD:</strong> ' + g + '</div>' + res.detail);
  });
  document.getElementById('simpReset').addEventListener('click', function () {
    document.getElementById('simpNum').value = ''; document.getElementById('simpDen').value = '';
    clearResult('simpResult'); clrErr('simpError');
  });

  /* Convert */
  document.getElementById('convBtn').addEventListener('click', function () {
    clrErr('convError');
    var input = document.getElementById('convInput').value.trim();
    if (!input) { err('convError', 'Please enter a decimal or fraction.'); clearResult('convResult'); return; }
    var num, den;
    if (input.indexOf('/') >= 0) {
      var parts = input.split('/');
      if (parts.length !== 2) { err('convError', 'Invalid fraction format. Use a/b.'); clearResult('convResult'); return; }
      num = CalcUtils.num(parts[0]); den = CalcUtils.num(parts[1]);
      if (num === null || den === null) { err('convError', 'Invalid fraction.'); clearResult('convResult'); return; }
      if (den === 0) { err('convError', 'Denominator cannot be zero.'); clearResult('convResult'); return; }
    } else {
      var dec = CalcUtils.num(input);
      if (dec === null) { err('convError', 'Please enter a valid number or fraction.'); clearResult('convResult'); return; }
      /* Convert decimal to fraction */
      var str = input.toString();
      var decimals = str.indexOf('.') >= 0 ? str.length - str.indexOf('.') - 1 : 0;
      den = Math.pow(10, decimals);
      num = Math.round(dec * den);
    }
    var res = formatResult(num, den);
    showResult('convResult', 'Conversion Result', res.value, res.detail);
  });
  document.getElementById('convReset').addEventListener('click', function () {
    document.getElementById('convInput').value = '';
    clearResult('convResult'); clrErr('convError');
  });
})();
