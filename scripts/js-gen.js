/* js-gen.js — generates JavaScript for all 30 calculators */
'use strict';

// ── Shared helpers used in all JS files ──
const sharedHeader = `/* Auto-generated calculator logic */
(function () {
  'use strict';
  function showResult(elId, label, value, detail) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = '<div class="result-label">' + label + '</div>' +
      '<div class="result-value">' + value + '</div>' +
      (detail ? '<div class="result-detail">' + detail + '</div>' : '');
  }
  function clearResult(elId) { var el = document.getElementById(elId); if (el) el.innerHTML = ''; }
  function err(elId, msg) { CalcUtils.showError(document.getElementById(elId), msg); }
  function clrErr(elId) { CalcUtils.clearError(document.getElementById(elId)); }
`;

const sharedFooter = `\n})();\n`;

// ── 1. Scientific Calculator ──
const scientific = `/* scientific.js */
(function () {
  'use strict';
  var expression = '', result = '0', mode = 'DEG', memory = 0, history = [], justEvaluated = false;
  var exprEl = document.getElementById('sciExpr');
  var resultEl = document.getElementById('sciResult');
  var modeEl = document.getElementById('sciModeIndicator');
  var historyEl = document.getElementById('sciHistory');
  var errorEl = document.getElementById('sciError');
  var keypadEl = document.getElementById('sciKeypad');

  function updateDisplay() {
    exprEl.textContent = expression || '\\u00A0';
    resultEl.textContent = result;
    modeEl.textContent = mode + ' | M: ' + (Math.abs(memory) < 1e12 ? memory : memory.toExponential(4));
  }
  function showError(m) { errorEl.textContent = m; }
  function clearError() { errorEl.textContent = ''; }

  var keys = [
    ['DEG/RAD','mode','fn'],['(',')','op'],['C','clear','clear'],['⌫','back','op'],
    ['sin','sin','fn'],['cos','cos','fn'],['tan','tan','fn'],['π','pi','fn'],['e','euler','fn'],
    ['sin⁻¹','asin','fn'],['cos⁻¹','acos','fn'],['tan⁻¹','atan','fn'],['x²','sq','fn'],['√','sqrt','fn'],
    ['log','log','fn'],['ln','ln','fn'],['xʸ','pow','fn'],['n!','fact','fn'],['1/x','recip','fn'],
    ['7','7',''],['8','8',''],['9','9',''],['÷','/','op'],['M+','mplus','fn'],
    ['4','4',''],['5','5',''],['6','6',''],['×','*','op'],['M−','mminus','fn'],
    ['1','1',''],['2','2',''],['3','3',''],['−','-','op'],['MR','mr','fn'],
    ['0','0',''],['.','.',''],['EXP','E','fn'],['+','+','op'],['MC','mc','fn'],
    ['=','equals','eq wide']
  ];

  keys.forEach(function(k) {
    var btn = document.createElement('button');
    btn.className = 'sci-key ' + (k[2]||'');
    btn.textContent = k[0];
    btn.setAttribute('data-action', k[1]);
    btn.addEventListener('click', function() { handleKey(k[1], k[0]); });
    keypadEl.appendChild(btn);
  });

  function handleKey(action, label) {
    clearError();
    if (justEvaluated && /[0-9.]/.test(action)) { expression = ''; result = '0'; justEvaluated = false; }
    else if (justEvaluated && ['sin','cos','tan','log','ln','sqrt','sq','fact','recip','asin','acos','atan','equals'].indexOf(action) < 0) { justEvaluated = false; }
    else if (justEvaluated) { expression = result; justEvaluated = false; }

    switch(action) {
      case 'clear': expression=''; result='0'; break;
      case 'back': expression=expression.slice(0,-1); break;
      case 'mode': mode = mode==='DEG'?'RAD':'DEG'; break;
      case 'pi': expression+='π'; break;
      case 'euler': expression+='e'; break;
      case 'sin': expression+='sin('; break;
      case 'cos': expression+='cos('; break;
      case 'tan': expression+='tan('; break;
      case 'asin': expression+='asin('; break;
      case 'acos': expression+='acos('; break;
      case 'atan': expression+='atan('; break;
      case 'log': expression+='log('; break;
      case 'ln': expression+='ln('; break;
      case 'sqrt': expression+='sqrt('; break;
      case 'sq': expression+='^2'; break;
      case 'pow': expression+='^'; break;
      case 'fact': expression+='!'; break;
      case 'recip': expression='1/('+expression+')'; break;
      case 'mplus': evaluate(); memory += parseFloat(result)||0; break;
      case 'mminus': evaluate(); memory -= parseFloat(result)||0; break;
      case 'mr': expression += String(memory); break;
      case 'mc': memory=0; break;
      case 'equals': evaluate(); return;
      default: expression += label;
    }
    updateDisplay();
  }

  function evaluate() {
    if (!expression.trim()) return;
    try {
      var expr = expression;
      expr = expr.replace(/π/g,'(Math.PI)');
      expr = expr.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g,'(Math.E)');
      expr = expr.replace(/(\\d+\\.?\\d*|\\))\\s*!/g, function(m,base) {
        var n = parseFloat(base);
        if (n < 0 || n !== Math.floor(n)) throw new Error('Factorial requires non-negative integer.');
        if (n > 170) return 'Infinity';
        var f = 1; for (var i = 2; i <= n; i++) f *= i; return String(f);
      });
      if (mode === 'DEG') {
        expr = expr.replace(/sin\\(/g,'Math.sin((').replace(/\\)\\)/g,')*Math.PI/180))');
        expr = expr.replace(/cos\\(/g,'Math.cos((').replace(/\\)\\)/g,')*Math.PI/180))');
        expr = expr.replace(/tan\\(/g,'Math.tan((').replace(/\\)\\)/g,')*Math.PI/180))');
      } else {
        expr = expr.replace(/sin\\(/g,'Math.sin(').replace(/cos\\(/g,'Math.cos(').replace(/tan\\(/g,'Math.tan(');
      }
      expr = expr.replace(/asin\\(/g, mode==='DEG'?'Math.asin(':'Math.asin(');
      expr = expr.replace(/acos\\(/g, mode==='DEG'?'Math.acos(':'Math.acos(');
      expr = expr.replace(/atan\\(/g, mode==='DEG'?'Math.atan(':'Math.atan(');
      expr = expr.replace(/log\\(/g,'Math.log10(').replace(/ln\\(/g,'Math.log(').replace(/sqrt\\(/g,'Math.sqrt(');
      expr = expr.replace(/\\^/g,'**');
      var val = Function('"use strict";return (' + expr + ')')();
      if (typeof val !== 'number' || isNaN(val)) throw new Error('Invalid expression.');
      result = parseFloat(val.toPrecision(12)).toString();
      if (mode === 'DEG') {
        // Convert inverse trig results to degrees
      }
      history.unshift({expr: expression, result: result});
      if (history.length > 20) history.pop();
      renderHistory();
      justEvaluated = true;
    } catch(e) { showError('Error: ' + (e.message||'Invalid expression.')); result = 'Error'; }
    updateDisplay();
  }

  function renderHistory() {
    historyEl.innerHTML = history.map(function(h,i) {
      return '<div class="sci-history-item" data-idx="'+i+'">'+CalcUtils.esc(h.expr)+' = <span class="res">'+CalcUtils.esc(h.result)+'</span></div>';
    }).join('');
    historyEl.querySelectorAll('.sci-history-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        expression = history[idx].result; justEvaluated = true; updateDisplay();
      });
    });
  }

  document.addEventListener('keydown', function(e) {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    var key = e.key;
    if (/[0-9.+\\-*/()^]/.test(key)) { e.preventDefault(); handleKey(key, key); }
    else if (key === 'Enter' || key === '=') { e.preventDefault(); handleKey('equals','='); }
    else if (key === 'Escape') { e.preventDefault(); handleKey('clear','C'); }
    else if (key === 'Backspace') { e.preventDefault(); handleKey('back','⌫'); }
  });
  updateDisplay();
})();`;

// ── 2. Percentage Calculator ──
const percentage = sharedHeader + `
  document.getElementById('pctOfBtn').addEventListener('click', function() {
    clrErr('pctOfError');
    var p = CalcUtils.num(document.getElementById('pctOfPct').value);
    var y = CalcUtils.num(document.getElementById('pctOfVal').value);
    if (p === null || y === null) { err('pctOfError', 'Please enter both the percentage and the value.'); clearResult('pctOfResult'); return; }
    var r = (p/100)*y;
    showResult('pctOfResult', p+'% of '+y, CalcUtils.fmt(r), '<div><strong>Formula:</strong> ('+p+' / 100) × '+y+' = '+CalcUtils.fmt(r)+'</div>');
  });
  document.getElementById('pctOfReset').addEventListener('click', function() { document.getElementById('pctOfPct').value=''; document.getElementById('pctOfVal').value=''; clearResult('pctOfResult'); clrErr('pctOfError'); });

  document.getElementById('pctIsBtn').addEventListener('click', function() {
    clrErr('pctIsError');
    var x = CalcUtils.num(document.getElementById('pctIsX').value);
    var y = CalcUtils.num(document.getElementById('pctIsY').value);
    if (x === null || y === null) { err('pctIsError', 'Please enter both values.'); clearResult('pctIsResult'); return; }
    if (y === 0) { err('pctIsError', 'Cannot divide by zero.'); clearResult('pctIsResult'); return; }
    var r = (x/y)*100;
    showResult('pctIsResult', x+' is what % of '+y, CalcUtils.fmt(r)+'%', '<div><strong>Formula:</strong> ('+x+' / '+y+') × 100 = '+CalcUtils.fmt(r)+'%</div>');
  });
  document.getElementById('pctIsReset').addEventListener('click', function() { document.getElementById('pctIsX').value=''; document.getElementById('pctIsY').value=''; clearResult('pctIsResult'); clrErr('pctIsError'); });

  document.getElementById('pctIncBtn').addEventListener('click', function() {
    clrErr('pctIncError');
    var o = CalcUtils.num(document.getElementById('pctIncOld').value);
    var n = CalcUtils.num(document.getElementById('pctIncNew').value);
    if (o === null || n === null) { err('pctIncError', 'Please enter both values.'); clearResult('pctIncResult'); return; }
    if (o === 0) { err('pctIncError', 'Original value cannot be zero.'); clearResult('pctIncResult'); return; }
    var r = ((n-o)/Math.abs(o))*100;
    showResult('pctIncResult', 'Percentage '+(r>=0?'increase':'decrease'), CalcUtils.fmt(Math.abs(r))+'%', '<div><strong>Formula:</strong> (('+n+' − '+o+') / |'+o+'|) × 100 = '+CalcUtils.fmt(r)+'%</div>');
  });
  document.getElementById('pctIncReset').addEventListener('click', function() { document.getElementById('pctIncOld').value=''; document.getElementById('pctIncNew').value=''; clearResult('pctIncResult'); clrErr('pctIncError'); });

  document.getElementById('pctDecBtn').addEventListener('click', function() {
    clrErr('pctDecError');
    var o = CalcUtils.num(document.getElementById('pctDecOld').value);
    var n = CalcUtils.num(document.getElementById('pctDecNew').value);
    if (o === null || n === null) { err('pctDecError', 'Please enter both values.'); clearResult('pctDecResult'); return; }
    if (o === 0) { err('pctDecError', 'Original value cannot be zero.'); clearResult('pctDecResult'); return; }
    var r = ((o-n)/Math.abs(o))*100;
    showResult('pctDecResult', 'Percentage decrease', CalcUtils.fmt(r)+'%', '<div><strong>Formula:</strong> (('+o+' − '+n+') / |'+o+'|) × 100 = '+CalcUtils.fmt(r)+'%</div>');
  });
  document.getElementById('pctDecReset').addEventListener('click', function() { document.getElementById('pctDecOld').value=''; document.getElementById('pctDecNew').value=''; clearResult('pctDecResult'); clrErr('pctDecError'); });

  document.getElementById('pctDiffBtn').addEventListener('click', function() {
    clrErr('pctDiffError');
    var a = CalcUtils.num(document.getElementById('pctDiffA').value);
    var b = CalcUtils.num(document.getElementById('pctDiffB').value);
    if (a === null || b === null) { err('pctDiffError', 'Please enter both values.'); clearResult('pctDiffResult'); return; }
    var avg = (a+b)/2;
    if (avg === 0) { err('pctDiffError', 'Average is zero — undefined.'); clearResult('pctDiffResult'); return; }
    var r = (Math.abs(a-b)/Math.abs(avg))*100;
    showResult('pctDiffResult', 'Percentage difference', CalcUtils.fmt(r)+'%', '<div><strong>Formula:</strong> |'+a+' − '+b+'| / |('+a+' + '+b+')/2| × 100 = '+CalcUtils.fmt(r)+'%</div>');
  });
  document.getElementById('pctDiffReset').addEventListener('click', function() { document.getElementById('pctDiffA').value=''; document.getElementById('pctDiffB').value=''; clearResult('pctDiffResult'); clrErr('pctDiffError'); });

  document.getElementById('pctOrigBtn').addEventListener('click', function() {
    clrErr('pctOrigError');
    var f = CalcUtils.num(document.getElementById('pctOrigFinal').value);
    var p = CalcUtils.num(document.getElementById('pctOrigPct').value);
    var t = document.getElementById('pctOrigType').value;
    if (f === null || p === null) { err('pctOrigError', 'Please enter both values.'); clearResult('pctOrigResult'); return; }
    var d = t==='increase'?(1+p/100):(1-p/100);
    if (d === 0) { err('pctOrigError', 'Invalid percentage.'); clearResult('pctOrigResult'); return; }
    var r = f/d;
    showResult('pctOrigResult', 'Original value', CalcUtils.fmt(r), '<div><strong>Formula:</strong> '+f+' / (1 '+(t==='increase'?'+':'−')+' '+p+'/100) = '+CalcUtils.fmt(r)+'</div>');
  });
  document.getElementById('pctOrigReset').addEventListener('click', function() { document.getElementById('pctOrigFinal').value=''; document.getElementById('pctOrigPct').value=''; clearResult('pctOrigResult'); clrErr('pctOrigError'); });
` + sharedFooter;

// ── 3. Fraction Calculator ──
const fraction = `/* fraction.js */
(function() {
  'use strict';
  function parseF(wId,nId,dId) {
    var w = CalcUtils.num(document.getElementById(wId).value)||0;
    var n = CalcUtils.num(document.getElementById(nId).value);
    var d = CalcUtils.num(document.getElementById(dId).value);
    if (n === null || d === null) return null;
    if (d === 0) return {error:'Denominator cannot be zero.'};
    var sign = (d<0?-1:1)*(n<0?-1:1)*(w<0?-1:1);
    n = Math.abs(n); d = Math.abs(d); w = Math.abs(w);
    return {num: sign*(w*d+n), den: d};
  }
  function simplify(num,den) {
    if (den === 0) return null;
    if (num === 0) return {num:0,den:1};
    var sign = (num<0?-1:1)*(den<0?-1:1);
    num = Math.abs(num); den = Math.abs(den);
    var g = CalcUtils.gcd(num,den);
    return {num: sign*(num/g), den: den/g};
  }
  function toMixed(num,den) {
    var sign = num<0?'-':''; num = Math.abs(num); den = Math.abs(den);
    var w = Math.floor(num/den), r = num%den;
    if (r === 0) return sign+w;
    if (w === 0) return sign+r+'/'+den;
    return sign+w+' '+r+'/'+den;
  }
  function fmtRes(num,den) {
    var s = simplify(num,den);
    var str = s.num+'/'+s.den, mixed = toMixed(s.num,s.den), dec = CalcUtils.fmt(s.num/s.den,10);
    var detail = '<div><strong>Simplified:</strong> '+str+'</div>';
    if (mixed !== str) detail += '<div><strong>Mixed:</strong> '+mixed+'</div>';
    detail += '<div><strong>Decimal:</strong> '+dec+'</div>';
    return {value:str, detail:detail};
  }
  function showResult(elId,label,value,detail) {
    var el = document.getElementById(elId);
    el.innerHTML = '<div class="result-label">'+label+'</div><div class="result-value">'+value+'</div>'+(detail?'<div class="result-detail">'+detail+'</div>':'');
  }
  function clearResult(elId) { document.getElementById(elId).innerHTML = ''; }
  function err(elId,msg) { CalcUtils.showError(document.getElementById(elId), msg); }
  function clrErr(elId) { CalcUtils.clearError(document.getElementById(elId)); }

  document.getElementById('fracCalcBtn').addEventListener('click', function() {
    clrErr('fracCalcError');
    var f1 = parseF('frac1Whole','frac1Num','frac1Den');
    var f2 = parseF('frac2Whole','frac2Num','frac2Den');
    if (!f1 || !f2) { err('fracCalcError','Please fill in both fractions.'); clearResult('fracCalcResult'); return; }
    if (f1.error) { err('fracCalcError','First: '+f1.error); clearResult('fracCalcResult'); return; }
    if (f2.error) { err('fracCalcError','Second: '+f2.error); clearResult('fracCalcResult'); return; }
    var op = document.getElementById('fracOp').value, num, den, steps='';
    if (op==='+') { var l=CalcUtils.lcm(f1.den,f2.den); num=f1.num*(l/f1.den)+f2.num*(l/f2.den); den=l; steps='Common denominator: '+l+'. Sum: '+num+'/'+den; }
    else if (op==='-') { l=CalcUtils.lcm(f1.den,f2.den); num=f1.num*(l/f1.den)-f2.num*(l/f2.den); den=l; steps='Common denominator: '+l+'. Difference: '+num+'/'+den; }
    else if (op==='*') { num=f1.num*f2.num; den=f1.den*f2.den; steps='Multiply: ('+f1.num+'×'+f2.num+')/('+f1.den+'×'+f2.den+') = '+num+'/'+den; }
    else if (op==='/') { if(f2.num===0){err('fracCalcError','Cannot divide by zero.');clearResult('fracCalcResult');return;} num=f1.num*f2.den; den=f1.den*f2.num; steps='Invert and multiply: '+num+'/'+den; }
    var res = fmtRes(num,den);
    showResult('fracCalcResult','Result',res.value,'<div><strong>Steps:</strong> '+steps+'</div>'+res.detail);
  });
  document.getElementById('fracCalcReset').addEventListener('click', function() {
    ['frac1Whole','frac1Num','frac1Den','frac2Whole','frac2Num','frac2Den'].forEach(function(id){document.getElementById(id).value='';});
    clearResult('fracCalcResult'); clrErr('fracCalcError');
  });

  document.getElementById('simpBtn').addEventListener('click', function() {
    clrErr('simpError');
    var n = CalcUtils.num(document.getElementById('simpNum').value);
    var d = CalcUtils.num(document.getElementById('simpDen').value);
    if (n===null||d===null) { err('simpError','Enter numerator and denominator.'); clearResult('simpResult'); return; }
    if (d===0) { err('simpError','Denominator cannot be zero.'); clearResult('simpResult'); return; }
    var g = CalcUtils.gcd(Math.abs(n),Math.abs(d));
    var res = fmtRes(n,d);
    showResult('simpResult','Simplified',res.value,'<div><strong>GCD:</strong> '+g+'</div>'+res.detail);
  });
  document.getElementById('simpReset').addEventListener('click', function() { document.getElementById('simpNum').value=''; document.getElementById('simpDen').value=''; clearResult('simpResult'); clrErr('simpError'); });

  document.getElementById('convBtn').addEventListener('click', function() {
    clrErr('convError');
    var input = document.getElementById('convInput').value.trim();
    if (!input) { err('convError','Enter a value.'); clearResult('convResult'); return; }
    var num, den;
    if (input.indexOf('/')>=0) {
      var parts = input.split('/');
      if (parts.length!==2) { err('convError','Use a/b format.'); clearResult('convResult'); return; }
      num = CalcUtils.num(parts[0]); den = CalcUtils.num(parts[1]);
      if (num===null||den===null||den===0) { err('convError','Invalid fraction.'); clearResult('convResult'); return; }
    } else {
      var dec = CalcUtils.num(input);
      if (dec===null) { err('convError','Invalid input.'); clearResult('convResult'); return; }
      var str = input.toString(), decs = str.indexOf('.')>=0 ? str.length-str.indexOf('.')-1 : 0;
      den = Math.pow(10,decs); num = Math.round(dec*den);
    }
    var res = fmtRes(num,den);
    showResult('convResult','Result',res.value,res.detail);
  });
  document.getElementById('convReset').addEventListener('click', function() { document.getElementById('convInput').value=''; clearResult('convResult'); clrErr('convError'); });
})();`;

// ── 4. Quadratic Equation ──
const quadratic = `/* quadratic.js */
(function() {
  'use strict';
  document.getElementById('quadBtn').addEventListener('click', function() {
    CalcUtils.clearError(document.getElementById('quadError'));
    var a = CalcUtils.num(document.getElementById('quadA').value);
    var b = CalcUtils.num(document.getElementById('quadB').value);
    var c = CalcUtils.num(document.getElementById('quadC').value);
    var r = document.getElementById('quadResult');
    if (a===null||b===null||c===null) { CalcUtils.showError(document.getElementById('quadError'),'Enter all three coefficients.'); r.innerHTML=''; return; }
    if (a===0) { CalcUtils.showError(document.getElementById('quadError'),'a must not be zero — use the Algebra Calculator for linear equations.'); r.innerHTML=''; return; }
    var disc = b*b-4*a*c, steps = '<div><strong>Discriminant:</strong> Δ = '+b+'² − 4('+a+')('+c+') = '+CalcUtils.fmt(disc)+'</div>';
    var roots;
    if (disc > 0) {
      var sq = Math.sqrt(disc);
      var x1 = (-b+sq)/(2*a), x2 = (-b-sq)/(2*a);
      steps += '<div><strong>Δ > 0:</strong> Two real roots</div><div>x = ('+(-b)+' ± '+CalcUtils.fmt(sq)+') / '+(2*a)+'</div>';
      roots = 'x₁ = '+CalcUtils.fmt(x1)+', x₂ = '+CalcUtils.fmt(x2);
      steps += '<div><strong>Root 1:</strong> '+CalcUtils.fmt(x1)+'</div><div><strong>Root 2:</strong> '+CalcUtils.fmt(x2)+'</div>';
    } else if (disc === 0) {
      var x = -b/(2*a);
      steps += '<div><strong>Δ = 0:</strong> One repeated root</div>';
      roots = 'x = '+CalcUtils.fmt(x)+' (repeated)';
      steps += '<div>x = '+(-b)+' / '+(2*a)+' = '+CalcUtils.fmt(x)+'</div>';
    } else {
      var rp = CalcUtils.fmt(-b/(2*a)), ip = CalcUtils.fmt(Math.sqrt(-disc)/(2*a));
      steps += '<div><strong>Δ < 0:</strong> Complex conjugate roots</div>';
      roots = 'x₁ = '+rp+' + '+ip+'i, x₂ = '+rp+' − '+ip+'i';
      steps += '<div>x = '+rp+' ± '+ip+'i</div>';
    }
    r.innerHTML = '<div class="result-label">Roots</div><div class="result-value">'+roots+'</div><div class="result-detail">'+steps+'</div>';
  });
  document.getElementById('quadReset').addEventListener('click', function() {
    ['quadA','quadB','quadC'].forEach(function(id){document.getElementById(id).value='';});
    document.getElementById('quadResult').innerHTML='';
    CalcUtils.clearError(document.getElementById('quadError'));
  });
  ['quadA','quadB','quadC'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) { if(e.key==='Enter') document.getElementById('quadBtn').click(); });
  });
})();`;

// ── 5. Algebra Calculator ──
const algebra = `/* algebra.js */
(function() {
  'use strict';
  function showResult(elId,label,value,detail) {
    var el = document.getElementById(elId);
    el.innerHTML = '<div class="result-label">'+label+'</div><div class="result-value">'+value+'</div>'+(detail?'<div class="result-detail">'+detail+'</div>':'');
  }
  function clearResult(elId) { document.getElementById(elId).innerHTML = ''; }
  function err(elId,msg) { CalcUtils.showError(document.getElementById(elId), msg); }
  function clrErr(elId) { CalcUtils.clearError(document.getElementById(elId)); }

  document.getElementById('linBtn').addEventListener('click', function() {
    clrErr('linError');
    var a=CalcUtils.num(document.getElementById('linA').value), b=CalcUtils.num(document.getElementById('linB').value), c=CalcUtils.num(document.getElementById('linC').value);
    if (a===null||b===null||c===null) { err('linError','Enter all values.'); clearResult('linResult'); return; }
    var rhs=c-b, steps='<div><strong>Equation:</strong> '+a+'x + '+b+' = '+c+'</div><div><strong>Step 1:</strong> Subtract '+b+': '+a+'x = '+CalcUtils.fmt(rhs)+'</div>';
    if (a===0) { if(rhs===0) err('linError','Infinitely many solutions (0x = 0).'); else err('linError','No solution (contradiction).'); clearResult('linResult'); return; }
    var x=rhs/a;
    steps += '<div><strong>Step 2:</strong> Divide by '+a+': x = '+CalcUtils.fmt(rhs)+' / '+a+' = '+CalcUtils.fmt(x)+'</div>';
    showResult('linResult','Solution','x = '+CalcUtils.fmt(x),steps);
  });
  document.getElementById('linReset').addEventListener('click', function() { ['linA','linB','linC'].forEach(function(id){document.getElementById(id).value='';}); clearResult('linResult'); clrErr('linError'); });

  document.getElementById('qaBtn').addEventListener('click', function() {
    clrErr('qaError');
    var a=CalcUtils.num(document.getElementById('qaA').value), b=CalcUtils.num(document.getElementById('qaB').value), c=CalcUtils.num(document.getElementById('qaC').value);
    if (a===null||b===null||c===null) { err('qaError','Enter all coefficients.'); clearResult('qaResult'); return; }
    if (a===0) { err('qaError','a must not be zero. Use the Linear tab.'); clearResult('qaResult'); return; }
    var disc=b*b-4*a*c, steps='<div><strong>Discriminant:</strong> Δ = '+CalcUtils.fmt(disc)+'</div>', roots;
    if (disc>0) { var sq=Math.sqrt(disc); roots='x₁='+CalcUtils.fmt((-b+sq)/(2*a))+', x₂='+CalcUtils.fmt((-b-sq)/(2*a)); steps+='<div>Two real roots: ('+(-b)+' ± '+CalcUtils.fmt(sq)+') / '+(2*a)+'</div>'; }
    else if (disc===0) { roots='x = '+CalcUtils.fmt(-b/(2*a))+' (repeated)'; steps+='<div>One repeated root: '+(-b)+' / '+(2*a)+'</div>'; }
    else { var rp=CalcUtils.fmt(-b/(2*a)), ip=CalcUtils.fmt(Math.sqrt(-disc)/(2*a)); roots='x₁='+rp+'+'+ip+'i, x₂='+rp+'−'+ip+'i'; steps+='<div>Complex roots: '+rp+' ± '+ip+'i</div>'; }
    showResult('qaResult','Roots',roots,steps);
  });
  document.getElementById('qaReset').addEventListener('click', function() { ['qaA','qaB','qaC'].forEach(function(id){document.getElementById(id).value='';}); clearResult('qaResult'); clrErr('qaError'); });

  document.getElementById('simpExprBtn').addEventListener('click', function() {
    clrErr('simpExprError');
    var expr = document.getElementById('simpExpr').value.trim();
    if (!expr) { err('simpExprError','Enter an expression.'); clearResult('simpExprResult'); return; }
    if (!/^[0-9+\\-*/().^ ]+$/.test(expr)) { err('simpExprError','Invalid characters. Use numbers, +, -, *, /, (), ^.'); clearResult('simpExprResult'); return; }
    try {
      var cleaned = expr.replace(/\\^/g,'**');
      var val = Function('"use strict";return ('+cleaned+')')();
      if (typeof val!=='number'||isNaN(val)||!isFinite(val)) throw new Error('Invalid.');
      showResult('simpExprResult','Result',CalcUtils.fmt(val),'<div><strong>Expression:</strong> '+CalcUtils.esc(expr)+'</div>');
    } catch(e) { err('simpExprError','Could not evaluate. Check syntax.'); clearResult('simpExprResult'); }
  });
  document.getElementById('simpExprReset').addEventListener('click', function() { document.getElementById('simpExpr').value=''; clearResult('simpExprResult'); clrErr('simpExprError'); });
})();`;

// ── 6. Matrix Calculator ──
const matrix = `/* matrix.js */
(function() {
  'use strict';
  var matA = {rows:2, cols:2, data:[]}, matB = {rows:2, cols:2, data:[]};
  var currentOp = 'mat-add';

  function buildMatrix(containerId, mat, prefix) {
    var c = document.getElementById(containerId);
    c.innerHTML = '';
    var grid = document.createElement('div');
    grid.style.display = 'inline-grid';
    grid.style.gridTemplateColumns = 'repeat(' + mat.cols + ', auto)';
    grid.style.gap = '4px';
    for (var i = 0; i < mat.rows; i++) {
      for (var j = 0; j < mat.cols; j++) {
        var inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'matrix-cell';
        inp.id = prefix + '_' + i + '_' + j;
        inp.step = 'any';
        inp.value = mat.data[i] && mat.data[i][j] !== undefined ? mat.data[i][j] : '';
        grid.appendChild(inp);
      }
    }
    c.appendChild(grid);
  }

  function readMatrix(prefix, rows, cols) {
    var data = [];
    for (var i = 0; i < rows; i++) {
      data[i] = [];
      for (var j = 0; j < cols; j++) {
        var el = document.getElementById(prefix + '_' + i + '_' + j);
        var v = CalcUtils.num(el ? el.value : '');
        if (v === null) return null;
        data[i][j] = v;
      }
    }
    return data;
  }

  function formatMatrix(data) {
    if (!data) return 'Invalid';
    var rows = data.length, cols = data[0].length;
    var html = '<div style="display:inline-grid;grid-template-columns:repeat('+cols+',auto);gap:4px;font-family:var(--font-mono);">';
    for (var i = 0; i < rows; i++) for (var j = 0; j < cols; j++) html += '<div style="text-align:center;padding:4px 8px;">'+CalcUtils.fmt(data[i][j])+'</div>';
    html += '</div>';
    return html;
  }

  function det2(d) { return d[0][0]*d[1][1] - d[0][1]*d[1][0]; }
  function det3(d) {
    return d[0][0]*(d[1][1]*d[2][2]-d[1][2]*d[2][1]) - d[0][1]*(d[1][0]*d[2][2]-d[1][2]*d[2][0]) + d[0][2]*(d[1][0]*d[2][1]-d[1][1]*d[2][0]);
  }
  function transpose(d) {
    var r=d.length, c=d[0].length, t=[];
    for (var i=0;i<c;i++){t[i]=[];for(var j=0;j<r;j++)t[i][j]=d[j][i];}
    return t;
  }
  function multiply(a,b) {
    var ar=a.length, ac=a[0].length, bc=b[0].length, r=[];
    for (var i=0;i<ar;i++){r[i]=[];for(var j=0;j<bc;j++){var s=0;for(var k=0;k<ac;k++)s+=a[i][k]*b[k][j];r[i][j]=s;}}
    return r;
  }
  function inverse2x2(d) {
    var det = det2(d);
    if (det === 0) return null;
    return [[d[1][1]/det, -d[0][1]/det], [-d[1][0]/det, d[0][0]/det]];
  }
  function inverse3x3(d) {
    var det = det3(d);
    if (det === 0) return null;
    var inv = [];
    for (var i=0;i<3;i++){inv[i]=[];for(var j=0;j<3;j++){
      var co = d[(i+1)%3][(j+1)%3]*d[(i+2)%3][(j+2)%3] - d[(i+1)%3][(j+2)%3]*d[(i+2)%3][(j+1)%3];
      inv[i][j] = ((i+j)%2===0?1:-1) * co / det;
    }}
    return transpose(inv);
  }

  document.querySelectorAll('.calc-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      if (tab.closest('.calc-card')) {
        var op = tab.getAttribute('data-tab');
        currentOp = op;
        var bSection = document.getElementById('matBSection');
        if (['mat-trans','mat-det','mat-inv'].indexOf(op) >= 0) bSection.style.display = 'none';
        else bSection.style.display = 'block';
      }
    });
  });

  document.getElementById('matABuild').addEventListener('click', function() {
    matA.rows = parseInt(document.getElementById('matARows').value);
    matA.cols = parseInt(document.getElementById('matACols').value);
    buildMatrix('matAContainer', matA, 'a');
  });
  document.getElementById('matBBuild').addEventListener('click', function() {
    matB.rows = parseInt(document.getElementById('matBRows').value);
    matB.cols = parseInt(document.getElementById('matBCols').value);
    buildMatrix('matBContainer', matB, 'b');
  });
  document.getElementById('matCalcBtn').addEventListener('click', function() {
    CalcUtils.clearError(document.getElementById('matError'));
    var r = document.getElementById('matResult');
    var aData = readMatrix('a', matA.rows, matA.cols);
    var bData = null;
    if (['mat-add','mat-sub','mat-mul'].indexOf(currentOp) >= 0) bData = readMatrix('b', matB.rows, matB.cols);
    if (aData === null) { CalcUtils.showError(document.getElementById('matError'),'Fill in all Matrix A cells.'); r.innerHTML=''; return; }
    if (bData === null && ['mat-add','mat-sub','mat-mul'].indexOf(currentOp) >= 0) { CalcUtils.showError(document.getElementById('matError'),'Fill in all Matrix B cells.'); r.innerHTML=''; return; }

    var result, label = '';
    try {
      if (currentOp === 'mat-add') {
        if (matA.rows !== matB.rows || matA.cols !== matB.cols) throw new Error('Matrices must have the same dimensions for addition.');
        result = []; for (var i=0;i<matA.rows;i++){result[i]=[];for(var j=0;j<matA.cols;j++)result[i][j]=aData[i][j]+bData[i][j];}
        label = 'A + B';
      } else if (currentOp === 'mat-sub') {
        if (matA.rows !== matB.rows || matA.cols !== matB.cols) throw new Error('Matrices must have the same dimensions for subtraction.');
        result = []; for (i=0;i<matA.rows;i++){result[i]=[];for(j=0;j<matA.cols;j++)result[i][j]=aData[i][j]-bData[i][j];}
        label = 'A − B';
      } else if (currentOp === 'mat-mul') {
        if (matA.cols !== matB.rows) throw new Error('Columns of A must equal rows of B for multiplication.');
        result = multiply(aData, bData); label = 'A × B';
      } else if (currentOp === 'mat-trans') {
        result = transpose(aData); label = 'Aᵀ';
      } else if (currentOp === 'mat-det') {
        if (matA.rows !== matA.cols) throw new Error('Determinant requires a square matrix.');
        var det = matA.rows === 2 ? det2(aData) : det3(aData);
        r.innerHTML = '<div class="result-label">Determinant</div><div class="result-value">'+CalcUtils.fmt(det)+'</div>';
        return;
      } else if (currentOp === 'mat-inv') {
        if (matA.rows !== matA.cols) throw new Error('Inverse requires a square matrix.');
        var det = matA.rows === 2 ? det2(aData) : det3(aData);
        if (det === 0) throw new Error('Matrix is singular (determinant = 0). No inverse exists.');
        result = matA.rows === 2 ? inverse2x2(aData) : inverse3x3(aData);
        label = 'A⁻¹';
      }
      r.innerHTML = '<div class="result-label">'+label+'</div><div class="result-value">'+formatMatrix(result)+'</div>';
    } catch(e) {
      CalcUtils.showError(document.getElementById('matError'), e.message);
      r.innerHTML = '';
    }
  });
  document.getElementById('matReset').addEventListener('click', function() {
    document.getElementById('matResult').innerHTML = '';
    CalcUtils.clearError(document.getElementById('matError'));
  });
  buildMatrix('matAContainer', matA, 'a');
  buildMatrix('matBContainer', matB, 'b');
})();`;

// ── 7. Statistics Calculator ──
const statistics = sharedHeader + `
  document.getElementById('statBtn').addEventListener('click', function() {
    clrErr('statError');
    var data = CalcUtils.dataset(document.getElementById('statData').value);
    if (data.length === 0) { err('statError','Enter at least one number.'); clearResult('statResult'); return; }
    var type = document.getElementById('statType').value;
    var n = data.length, sum = data.reduce(function(a,b){return a+b;},0);
    var mean = sum/n;
    var sorted = data.slice().sort(function(a,b){return a-b;});
    var min = sorted[0], max = sorted[n-1], range = max-min;
    var median = n%2===0 ? (sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)];
    var freq = {}, maxFreq = 0, modes = [];
    data.forEach(function(v){ freq[v]=(freq[v]||0)+1; if(freq[v]>maxFreq) maxFreq=freq[v]; });
    for (var k in freq) if (freq[k]===maxFreq) modes.push(parseFloat(k));
    var modeStr = maxFreq===1 ? 'No mode (all unique)' : modes.length===1 ? CalcUtils.fmt(modes[0]) : modes.map(CalcUtils.fmt).join(', ');
    var sqSum = data.reduce(function(a,b){return a+Math.pow(b-mean,2);},0);
    var variance = type==='population' ? sqSum/n : sqSum/(n-1);
    var sd = Math.sqrt(variance);
    var html = '<table class="stats-table"><tr><th>Statistic</th><th>Value</th></tr>';
    html += '<tr><td>Count</td><td>'+n+'</td></tr>';
    html += '<tr><td>Sum</td><td>'+CalcUtils.fmt(sum)+'</td></tr>';
    html += '<tr><td>Mean</td><td>'+CalcUtils.fmt(mean)+'</td></tr>';
    html += '<tr><td>Median</td><td>'+CalcUtils.fmt(median)+'</td></tr>';
    html += '<tr><td>Mode</td><td>'+modeStr+'</td></tr>';
    html += '<tr><td>Range</td><td>'+CalcUtils.fmt(range)+'</td></tr>';
    html += '<tr><td>Minimum</td><td>'+CalcUtils.fmt(min)+'</td></tr>';
    html += '<tr><td>Maximum</td><td>'+CalcUtils.fmt(max)+'</td></tr>';
    html += '<tr><td>Variance ('+type+')</td><td>'+CalcUtils.fmt(variance)+'</td></tr>';
    html += '<tr><td>Std Deviation ('+type+')</td><td>'+CalcUtils.fmt(sd)+'</td></tr>';
    html += '</table>';
    showResult('statResult','Statistics ('+type+')','', html);
  });
  document.getElementById('statReset').addEventListener('click', function() {
    document.getElementById('statData').value=''; clearResult('statResult'); clrErr('statError');
  });
` + sharedFooter;

// ── 8. Probability Calculator ──
const probability = sharedHeader + `
  document.getElementById('pbBtn').addEventListener('click', function() {
    clrErr('pbError');
    var f=CalcUtils.num(document.getElementById('pbFav').value), t=CalcUtils.num(document.getElementById('pbTotal').value);
    if(f===null||t===null){err('pbError','Enter both values.');clearResult('pbResult');return;}
    if(t<=0){err('pbError','Total must be positive.');clearResult('pbResult');return;}
    if(f<0||f>t){err('pbError','Favourable must be between 0 and total.');clearResult('pbResult');return;}
    var p=f/t;
    showResult('pbResult','P(A)',CalcUtils.fmt(p,6)+' ('+CalcUtils.fmt(p*100,4)+'%)','<div><strong>Formula:</strong> '+f+' / '+t+' = '+CalcUtils.fmt(p,6)+'</div>');
  });
  document.getElementById('pbReset').addEventListener('click',function(){document.getElementById('pbFav').value='';document.getElementById('pbTotal').value='';clearResult('pbResult');clrErr('pbError');});

  document.getElementById('pcBtn').addEventListener('click', function() {
    clrErr('pcError');
    var p=CalcUtils.num(document.getElementById('pcP').value);
    if(p===null){err('pcError','Enter P(A).');clearResult('pcResult');return;}
    if(p<0||p>1){err('pcError','Probability must be between 0 and 1.');clearResult('pcResult');return;}
    showResult('pcResult',"P(A')",CalcUtils.fmt(1-p,6),'<div><strong>Formula:</strong> 1 − '+p+' = '+CalcUtils.fmt(1-p,6)+'</div>');
  });
  document.getElementById('pcReset').addEventListener('click',function(){document.getElementById('pcP').value='';clearResult('pcResult');clrErr('pcError');});

  document.getElementById('piBtn').addEventListener('click', function() {
    clrErr('piError');
    var a=CalcUtils.num(document.getElementById('piA').value),b=CalcUtils.num(document.getElementById('piB').value);
    if(a===null||b===null){err('piError','Enter both values.');clearResult('piResult');return;}
    if(a<0||a>1||b<0||b>1){err('piError','Probabilities must be 0-1.');clearResult('piResult');return;}
    showResult('piResult','P(A ∩ B)',CalcUtils.fmt(a*b,6),'<div><strong>Formula:</strong> '+a+' × '+b+' = '+CalcUtils.fmt(a*b,6)+'</div>');
  });
  document.getElementById('piReset').addEventListener('click',function(){document.getElementById('piA').value='';document.getElementById('piB').value='';clearResult('piResult');clrErr('piError');});

  document.getElementById('pcondBtn').addEventListener('click', function() {
    clrErr('pcondError');
    var ab=CalcUtils.num(document.getElementById('pcondAB').value),b=CalcUtils.num(document.getElementById('pcondB').value);
    if(ab===null||b===null){err('pcondError','Enter both values.');clearResult('pcondResult');return;}
    if(b<=0||b>1){err('pcondError','P(B) must be > 0 and ≤ 1.');clearResult('pcondResult');return;}
    if(ab<0||ab>b){err('pcondError','P(A∩B) must be 0 to P(B).');clearResult('pcondResult');return;}
    showResult('pcondResult','P(A|B)',CalcUtils.fmt(ab/b,6),'<div><strong>Formula:</strong> '+ab+' / '+b+' = '+CalcUtils.fmt(ab/b,6)+'</div>');
  });
  document.getElementById('pcondReset').addEventListener('click',function(){document.getElementById('pcondAB').value='';document.getElementById('pcondB').value='';clearResult('pcondResult');clrErr('pcondError');});

  document.getElementById('pcombBtn').addEventListener('click', function() {
    clrErr('pcombError');
    var n=CalcUtils.num(document.getElementById('pcombN').value),r=CalcUtils.num(document.getElementById('pcombR').value);
    if(n===null||r===null){err('pcombError','Enter n and r.');clearResult('pcombResult');return;}
    if(n<0||r<0||r>n||n!==Math.floor(n)||r!==Math.floor(r)){err('pcombError','n and r must be non-negative integers with r ≤ n.');clearResult('pcombResult');return;}
    var c=CalcUtils.nCr(n,r);
    showResult('pcombResult',n+'C'+r,c.toLocaleString(),'<div><strong>Formula:</strong> '+n+'! / ('+r+'! × '+(n-r)+'!) = '+c.toLocaleString()+'</div>');
  });
  document.getElementById('pcombReset').addEventListener('click',function(){document.getElementById('pcombN').value='';document.getElementById('pcombR').value='';clearResult('pcombResult');clrErr('pcombError');});

  document.getElementById('ppermBtn').addEventListener('click', function() {
    clrErr('ppermError');
    var n=CalcUtils.num(document.getElementById('ppermN').value),r=CalcUtils.num(document.getElementById('ppermR').value);
    if(n===null||r===null){err('ppermError','Enter n and r.');clearResult('ppermResult');return;}
    if(n<0||r<0||r>n||n!==Math.floor(n)||r!==Math.floor(r)){err('ppermError','n and r must be non-negative integers with r ≤ n.');clearResult('ppermResult');return;}
    var p=CalcUtils.nPr(n,r);
    showResult('ppermResult',n+'P'+r,p.toLocaleString(),'<div><strong>Formula:</strong> '+n+'! / '+(n-r)+'! = '+p.toLocaleString()+'</div>');
  });
  document.getElementById('ppermReset').addEventListener('click',function(){document.getElementById('ppermN').value='';document.getElementById('ppermR').value='';clearResult('ppermResult');clrErr('ppermError');});
` + sharedFooter;

// ── 9. Standard Deviation ──
const stddev = sharedHeader + `
  document.getElementById('sdBtn').addEventListener('click', function() {
    clrErr('sdError');
    var data = CalcUtils.dataset(document.getElementById('sdData').value);
    if (data.length < 2) { err('sdError','Enter at least 2 numbers.'); clearResult('sdResult'); return; }
    var n=data.length, sum=data.reduce(function(a,b){return a+b;},0), mean=sum/n;
    var sqSum=data.reduce(function(a,b){return a+Math.pow(b-mean,2);},0);
    var popVar=sqSum/n, sampVar=sqSum/(n-1);
    var popSd=Math.sqrt(popVar), sampSd=Math.sqrt(sampVar);
    var html='<table class="stats-table"><tr><th>Measure</th><th>Value</th></tr>';
    html+='<tr><td>Count</td><td>'+n+'</td></tr>';
    html+='<tr><td>Mean</td><td>'+CalcUtils.fmt(mean)+'</td></tr>';
    html+='<tr><td>Population Variance (σ²)</td><td>'+CalcUtils.fmt(popVar)+'</td></tr>';
    html+='<tr><td>Sample Variance (s²)</td><td>'+CalcUtils.fmt(sampVar)+'</td></tr>';
    html+='<tr><td>Population SD (σ)</td><td>'+CalcUtils.fmt(popSd)+'</td></tr>';
    html+='<tr><td>Sample SD (s)</td><td>'+CalcUtils.fmt(sampSd)+'</td></tr>';
    html+='</table>';
    showResult('sdResult','Standard Deviation','',html);
  });
  document.getElementById('sdReset').addEventListener('click',function(){document.getElementById('sdData').value='';clearResult('sdResult');clrErr('sdError');});
` + sharedFooter;

// ── 10. Mean, Median, Mode ──
const mmm = sharedHeader + `
  document.getElementById('mmmBtn').addEventListener('click', function() {
    clrErr('mmmError');
    var data = CalcUtils.dataset(document.getElementById('mmmData').value);
    if (data.length === 0) { err('mmmError','Enter at least one number.'); clearResult('mmmResult'); return; }
    var n=data.length, sum=data.reduce(function(a,b){return a+b;},0), mean=sum/n;
    var sorted=data.slice().sort(function(a,b){return a-b;});
    var min=sorted[0], max=sorted[n-1], range=max-min;
    var median=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)];
    var freq={},maxFreq=0,modes=[];
    data.forEach(function(v){freq[v]=(freq[v]||0)+1;if(freq[v]>maxFreq)maxFreq=freq[v];});
    for(var k in freq) if(freq[k]===maxFreq) modes.push(parseFloat(k));
    var modeStr=maxFreq===1?'No mode (all unique)':modes.length===1?CalcUtils.fmt(modes[0]):modes.map(CalcUtils.fmt).join(', ')+' (multimodal)';
    var html='<table class="stats-table"><tr><th>Measure</th><th>Value</th></tr>';
    html+='<tr><td>Mean</td><td>'+CalcUtils.fmt(mean)+'</td></tr>';
    html+='<tr><td>Median</td><td>'+CalcUtils.fmt(median)+'</td></tr>';
    html+='<tr><td>Mode</td><td>'+modeStr+'</td></tr>';
    html+='<tr><td>Range</td><td>'+CalcUtils.fmt(range)+'</td></tr>';
    html+='</table>';
    showResult('mmmResult','Central Tendency','',html);
  });
  document.getElementById('mmmReset').addEventListener('click',function(){document.getElementById('mmmData').value='';clearResult('mmmResult');clrErr('mmmError');});
` + sharedFooter;

// ── 11. Geometry Calculator ──
const geometry = `/* geometry.js */
(function(){
  'use strict';
  var shapeEl=document.getElementById('geoShape');
  var inputsEl=document.getElementById('geoInputs');
  function showInputs() {
    var s=shapeEl.value, html='';
    if(s==='rectangle') html='<div class="form-row"><div class="form-group"><label class="form-label">Length</label><input type="number" class="form-control" id="geo_l" step="any" /></div><div class="form-group"><label class="form-label">Width</label><input type="number" class="form-control" id="geo_w" step="any" /></div></div>';
    else if(s==='square') html='<div class="form-group"><label class="form-label">Side</label><input type="number" class="form-control" id="geo_s" step="any" /></div>';
    else if(s==='triangle') html='<div class="form-row"><div class="form-group"><label class="form-label">Base</label><input type="number" class="form-control" id="geo_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="geo_h" step="any" /></div></div>';
    else if(s==='circle') html='<div class="form-group"><label class="form-label">Radius</label><input type="number" class="form-control" id="geo_r" step="any" /></div>';
    else if(s==='parallelogram') html='<div class="form-row"><div class="form-group"><label class="form-label">Base</label><input type="number" class="form-control" id="geo_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="geo_h" step="any" /></div></div>';
    else if(s==='trapezoid') html='<div class="form-row-3"><div class="form-group"><label class="form-label">Side a</label><input type="number" class="form-control" id="geo_a" step="any" /></div><div class="form-group"><label class="form-label">Side b</label><input type="number" class="form-control" id="geo_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="geo_h" step="any" /></div></div>';
    inputsEl.innerHTML=html;
  }
  shapeEl.addEventListener('change', showInputs);
  showInputs();
  document.getElementById('geoBtn').addEventListener('click', function() {
    CalcUtils.clearError(document.getElementById('geoError'));
    var s=shapeEl.value, area, perim, formula='';
    function v(id){return CalcUtils.num(document.getElementById(id).value);}
    if(s==='rectangle'){var l=v('geo_l'),w=v('geo_w');if(l===null||w===null){CalcUtils.showError(document.getElementById('geoError'),'Enter both dimensions.');document.getElementById('geoResult').innerHTML='';return;}area=l*w;perim=2*(l+w);formula='A = '+l+' × '+w+', P = 2('+l+' + '+w+')';}
    else if(s==='square'){var si=v('geo_s');if(si===null){CalcUtils.showError(document.getElementById('geoError'),'Enter the side.');document.getElementById('geoResult').innerHTML='';return;}area=si*si;perim=4*si;formula='A = '+si+'², P = 4 × '+si;}
    else if(s==='triangle'){var b=v('geo_b'),h=v('geo_h');if(b===null||h===null){CalcUtils.showError(document.getElementById('geoError'),'Enter base and height.');document.getElementById('geoResult').innerHTML='';return;}area=0.5*b*h;formula='A = ½ × '+b+' × '+h;}
    else if(s==='circle'){var r=v('geo_r');if(r===null){CalcUtils.showError(document.getElementById('geoError'),'Enter the radius.');document.getElementById('geoResult').innerHTML='';return;}area=Math.PI*r*r;perim=2*Math.PI*r;formula='A = π × '+r+'², C = 2π × '+r;}
    else if(s==='parallelogram'){var b=v('geo_b'),h=v('geo_h');if(b===null||h===null){CalcUtils.showError(document.getElementById('geoError'),'Enter base and height.');document.getElementById('geoResult').innerHTML='';return;}area=b*h;formula='A = '+b+' × '+h;}
    else if(s==='trapezoid'){var a=v('geo_a'),b=v('geo_b'),h=v('geo_h');if(a===null||b===null||h===null){CalcUtils.showError(document.getElementById('geoError'),'Enter all three values.');document.getElementById('geoResult').innerHTML='';return;}area=0.5*(a+b)*h;formula='A = ½('+a+' + '+b+') × '+h;}
    var html='<div class="result-label">Result</div>';
    html+='<div class="result-value">Area = '+CalcUtils.fmt(area)+'</div>';
    if(perim!==undefined) html+='<div class="result-detail"><div><strong>Perimeter:</strong> '+CalcUtils.fmt(perim)+'</div><div><strong>Formula:</strong> '+formula+'</div></div>';
    else html+='<div class="result-detail"><div><strong>Formula:</strong> '+formula+'</div></div>';
    document.getElementById('geoResult').innerHTML=html;
  });
  document.getElementById('geoReset').addEventListener('click',function(){inputsEl.innerHTML='';document.getElementById('geoResult').innerHTML='';CalcUtils.clearError(document.getElementById('geoError'));showInputs();});
})();`;

// ── 12. Triangle Calculator ──
const triangle = `/* triangle.js */
(function(){
  'use strict';
  function showResult(elId,label,value,detail){var el=document.getElementById(elId);el.innerHTML='<div class="result-label">'+label+'</div><div class="result-value">'+value+'</div>'+(detail?'<div class="result-detail">'+detail+'</div>':'');}
  function clearResult(elId){document.getElementById(elId).innerHTML='';}
  function err(elId,msg){CalcUtils.showError(document.getElementById(elId),msg);}
  function clrErr(elId){CalcUtils.clearError(document.getElementById(elId));}

  document.getElementById('rtBtn').addEventListener('click',function(){
    clrErr('rtError');
    var a=CalcUtils.num(document.getElementById('rtA').value),b=CalcUtils.num(document.getElementById('rtB').value),c=CalcUtils.num(document.getElementById('rtC').value);
    var provided=[a,b,c].filter(function(v){return v!==null;}).length;
    if(provided<2){err('rtError','Enter at least 2 sides.');clearResult('rtResult');return;}
    var result,steps='';
    if(c===null&&a!==null&&b!==null){c=Math.sqrt(a*a+b*b);steps='c = √('+a+'² + '+b+'²) = √'+(a*a+b*b)+' = '+CalcUtils.fmt(c);}
    else if(a===null&&b!==null&&c!==null){a=Math.sqrt(c*c-b*b);steps='a = √('+c+'² − '+b+'²) = √'+(c*c-b*b)+' = '+CalcUtils.fmt(a);}
    else if(b===null&&a!==null&&c!==null){b=Math.sqrt(c*c-a*a);steps='b = √('+c+'² − '+a+'²) = √'+(c*c-a*a)+' = '+CalcUtils.fmt(b);}
    else {steps='All sides provided. Check: '+a+'² + '+b+'² = '+(a*a+b*b)+' vs c² = '+(c*c)+' → '+(Math.abs(a*a+b*b-c*c)<1e-9?'Valid right triangle':'Not a right triangle');}
    var area=0.5*a*b;
    showResult('rtResult','Result','a='+CalcUtils.fmt(a)+', b='+CalcUtils.fmt(b)+', c='+CalcUtils.fmt(c),'<div>'+steps+'</div><div><strong>Area:</strong> '+CalcUtils.fmt(area)+'</div>');
  });
  document.getElementById('rtReset').addEventListener('click',function(){['rtA','rtB','rtC'].forEach(function(id){document.getElementById(id).value='';});clearResult('rtResult');clrErr('rtError');});

  document.getElementById('taBtn').addEventListener('click',function(){
    clrErr('taError');
    var b=CalcUtils.num(document.getElementById('taBase').value),h=CalcUtils.num(document.getElementById('taHeight').value);
    if(b===null||h===null){err('taError','Enter base and height.');clearResult('taResult');return;}
    showResult('taResult','Area',CalcUtils.fmt(0.5*b*h),'<div><strong>Formula:</strong> ½ × '+b+' × '+h+' = '+CalcUtils.fmt(0.5*b*h)+'</div>');
  });
  document.getElementById('taReset').addEventListener('click',function(){document.getElementById('taBase').value='';document.getElementById('taHeight').value='';clearResult('taResult');clrErr('taError');});

  document.getElementById('ptBtn').addEventListener('click',function(){
    clrErr('ptError');
    var a=CalcUtils.num(document.getElementById('ptA').value),b=CalcUtils.num(document.getElementById('ptB').value);
    if(a===null||b===null){err('ptError','Enter both legs.');clearResult('ptResult');return;}
    var c=Math.sqrt(a*a+b*b);
    showResult('ptResult','Hypotenuse',CalcUtils.fmt(c),'<div><strong>Formula:</strong> c = √('+a+'² + '+b+'²) = √'+(a*a+b*b)+' = '+CalcUtils.fmt(c)+'</div>');
  });
  document.getElementById('ptReset').addEventListener('click',function(){document.getElementById('ptA').value='';document.getElementById('ptB').value='';clearResult('ptResult');clrErr('ptError');});
})();`;

// ── 13. Circle Calculator ──
const circle = `/* circle.js */
(function(){
  'use strict';
  document.getElementById('cirBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('cirError'));
    var val=CalcUtils.num(document.getElementById('cirInput').value);
    var type=document.getElementById('cirType').value;
    if(val===null){CalcUtils.showError(document.getElementById('cirError'),'Enter a value.');document.getElementById('cirResult').innerHTML='';return;}
    if(val<=0){CalcUtils.showError(document.getElementById('cirError'),'Value must be positive.');document.getElementById('cirResult').innerHTML='';return;}
    var r,d,c,a;
    if(type==='radius'){r=val;d=2*r;c=2*Math.PI*r;a=Math.PI*r*r;}
    else if(type==='diameter'){d=val;r=d/2;c=Math.PI*d;a=Math.PI*r*r;}
    else if(type==='circumference'){c=val;r=c/(2*Math.PI);d=2*r;a=Math.PI*r*r;}
    else if(type==='area'){a=val;r=Math.sqrt(a/Math.PI);d=2*r;c=2*Math.PI*r;}
    var html='<div class="result-label">Circle Properties</div>';
    html+='<div class="result-value">r = '+CalcUtils.fmt(r)+'</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Radius:</strong> '+CalcUtils.fmt(r)+'</div>';
    html+='<div><strong>Diameter:</strong> '+CalcUtils.fmt(d)+'</div>';
    html+='<div><strong>Circumference:</strong> '+CalcUtils.fmt(c)+'</div>';
    html+='<div><strong>Area:</strong> '+CalcUtils.fmt(a)+'</div>';
    html+='</div>';
    document.getElementById('cirResult').innerHTML=html;
  });
  document.getElementById('cirReset').addEventListener('click',function(){document.getElementById('cirInput').value='';document.getElementById('cirResult').innerHTML='';CalcUtils.clearError(document.getElementById('cirError'));});
})();`;

// ── 14. Area Calculator ──
const area = `/* area.js */
(function(){
  'use strict';
  var shapeEl=document.getElementById('areaShape');
  var inputsEl=document.getElementById('areaInputs');
  function showInputs(){
    var s=shapeEl.value,html='';
    if(s==='square')html='<div class="form-group"><label class="form-label">Side</label><input type="number" class="form-control" id="area_s" step="any" /></div>';
    else if(s==='rectangle')html='<div class="form-row"><div class="form-group"><label class="form-label">Length</label><input type="number" class="form-control" id="area_l" step="any" /></div><div class="form-group"><label class="form-label">Width</label><input type="number" class="form-control" id="area_w" step="any" /></div></div>';
    else if(s==='triangle')html='<div class="form-row"><div class="form-group"><label class="form-label">Base</label><input type="number" class="form-control" id="area_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="area_h" step="any" /></div></div>';
    else if(s==='circle')html='<div class="form-group"><label class="form-label">Radius</label><input type="number" class="form-control" id="area_r" step="any" /></div>';
    else if(s==='trapezoid')html='<div class="form-row-3"><div class="form-group"><label class="form-label">Side a</label><input type="number" class="form-control" id="area_a" step="any" /></div><div class="form-group"><label class="form-label">Side b</label><input type="number" class="form-control" id="area_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="area_h" step="any" /></div></div>';
    else if(s==='parallelogram')html='<div class="form-row"><div class="form-group"><label class="form-label">Base</label><input type="number" class="form-control" id="area_b" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="area_h" step="any" /></div></div>';
    inputsEl.innerHTML=html;
  }
  shapeEl.addEventListener('change',showInputs);showInputs();
  document.getElementById('areaBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('areaError'));
    var s=shapeEl.value,a,formula='';
    function v(id){return CalcUtils.num(document.getElementById(id).value);}
    if(s==='square'){var si=v('area_s');if(si===null){CalcUtils.showError(document.getElementById('areaError'),'Enter the side.');document.getElementById('areaResult').innerHTML='';return;}a=si*si;formula='A = '+si+'² = '+CalcUtils.fmt(a);}
    else if(s==='rectangle'){var l=v('area_l'),w=v('area_w');if(l===null||w===null){CalcUtils.showError(document.getElementById('areaError'),'Enter both dimensions.');document.getElementById('areaResult').innerHTML='';return;}a=l*w;formula='A = '+l+' × '+w+' = '+CalcUtils.fmt(a);}
    else if(s==='triangle'){var b=v('area_b'),h=v('area_h');if(b===null||h===null){CalcUtils.showError(document.getElementById('areaError'),'Enter base and height.');document.getElementById('areaResult').innerHTML='';return;}a=0.5*b*h;formula='A = ½ × '+b+' × '+h+' = '+CalcUtils.fmt(a);}
    else if(s==='circle'){var r=v('area_r');if(r===null){CalcUtils.showError(document.getElementById('areaError'),'Enter the radius.');document.getElementById('areaResult').innerHTML='';return;}a=Math.PI*r*r;formula='A = π × '+r+'² = '+CalcUtils.fmt(a);}
    else if(s==='trapezoid'){var a1=v('area_a'),b1=v('area_b'),h1=v('area_h');if(a1===null||b1===null||h1===null){CalcUtils.showError(document.getElementById('areaError'),'Enter all values.');document.getElementById('areaResult').innerHTML='';return;}a=0.5*(a1+b1)*h1;formula='A = ½('+a1+' + '+b1+') × '+h1+' = '+CalcUtils.fmt(a);}
    else if(s==='parallelogram'){var b2=v('area_b'),h2=v('area_h');if(b2===null||h2===null){CalcUtils.showError(document.getElementById('areaError'),'Enter base and height.');document.getElementById('areaResult').innerHTML='';return;}a=b2*h2;formula='A = '+b2+' × '+h2+' = '+CalcUtils.fmt(a);}
    document.getElementById('areaResult').innerHTML='<div class="result-label">Area</div><div class="result-value">'+CalcUtils.fmt(a)+'</div><div class="result-detail"><div><strong>Formula:</strong> '+formula+'</div></div>';
  });
  document.getElementById('areaReset').addEventListener('click',function(){inputsEl.innerHTML='';document.getElementById('areaResult').innerHTML='';CalcUtils.clearError(document.getElementById('areaError'));showInputs();});
})();`;

// ── 15. Volume Calculator ──
const volume = `/* volume.js */
(function(){
  'use strict';
  var shapeEl=document.getElementById('volShape');
  var inputsEl=document.getElementById('volInputs');
  function showInputs(){
    var s=shapeEl.value,html='';
    if(s==='cube')html='<div class="form-group"><label class="form-label">Side</label><input type="number" class="form-control" id="vol_s" step="any" /></div>';
    else if(s==='cuboid')html='<div class="form-row-3"><div class="form-group"><label class="form-label">Length</label><input type="number" class="form-control" id="vol_l" step="any" /></div><div class="form-group"><label class="form-label">Width</label><input type="number" class="form-control" id="vol_w" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="vol_h" step="any" /></div></div>';
    else if(s==='cylinder')html='<div class="form-row"><div class="form-group"><label class="form-label">Radius</label><input type="number" class="form-control" id="vol_r" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="vol_h" step="any" /></div></div>';
    else if(s==='cone')html='<div class="form-row"><div class="form-group"><label class="form-label">Radius</label><input type="number" class="form-control" id="vol_r" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="vol_h" step="any" /></div></div>';
    else if(s==='sphere')html='<div class="form-group"><label class="form-label">Radius</label><input type="number" class="form-control" id="vol_r" step="any" /></div>';
    else if(s==='prism')html='<div class="form-row"><div class="form-group"><label class="form-label">Base area</label><input type="number" class="form-control" id="vol_a" step="any" /></div><div class="form-group"><label class="form-label">Height</label><input type="number" class="form-control" id="vol_h" step="any" /></div></div>';
    inputsEl.innerHTML=html;
  }
  shapeEl.addEventListener('change',showInputs);showInputs();
  document.getElementById('volBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('volError'));
    var s=shapeEl.value,v,formula='';
    function v2(id){return CalcUtils.num(document.getElementById(id).value);}
    if(s==='cube'){var si=v2('vol_s');if(si===null){CalcUtils.showError(document.getElementById('volError'),'Enter the side.');document.getElementById('volResult').innerHTML='';return;}v=si*si*si;formula='V = '+si+'³ = '+CalcUtils.fmt(v);}
    else if(s==='cuboid'){var l=v2('vol_l'),w=v2('vol_w'),h=v2('vol_h');if(l===null||w===null||h===null){CalcUtils.showError(document.getElementById('volError'),'Enter all dimensions.');document.getElementById('volResult').innerHTML='';return;}v=l*w*h;formula='V = '+l+' × '+w+' × '+h+' = '+CalcUtils.fmt(v);}
    else if(s==='cylinder'){var r=v2('vol_r'),h=v2('vol_h');if(r===null||h===null){CalcUtils.showError(document.getElementById('volError'),'Enter radius and height.');document.getElementById('volResult').innerHTML='';return;}v=Math.PI*r*r*h;formula='V = π × '+r+'² × '+h+' = '+CalcUtils.fmt(v);}
    else if(s==='cone'){var r=v2('vol_r'),h=v2('vol_h');if(r===null||h===null){CalcUtils.showError(document.getElementById('volError'),'Enter radius and height.');document.getElementById('volResult').innerHTML='';return;}v=(1/3)*Math.PI*r*r*h;formula='V = ⅓π × '+r+'² × '+h+' = '+CalcUtils.fmt(v);}
    else if(s==='sphere'){var r=v2('vol_r');if(r===null){CalcUtils.showError(document.getElementById('volError'),'Enter the radius.');document.getElementById('volResult').innerHTML='';return;}v=(4/3)*Math.PI*r*r*r;formula='V = 4/3 π × '+r+'³ = '+CalcUtils.fmt(v);}
    else if(s==='prism'){var a=v2('vol_a'),h=v2('vol_h');if(a===null||h===null){CalcUtils.showError(document.getElementById('volError'),'Enter base area and height.');document.getElementById('volResult').innerHTML='';return;}v=a*h;formula='V = '+a+' × '+h+' = '+CalcUtils.fmt(v);}
    document.getElementById('volResult').innerHTML='<div class="result-label">Volume</div><div class="result-value">'+CalcUtils.fmt(v)+'</div><div class="result-detail"><div><strong>Formula:</strong> '+formula+'</div></div>';
  });
  document.getElementById('volReset').addEventListener('click',function(){inputsEl.innerHTML='';document.getElementById('volResult').innerHTML='';CalcUtils.clearError(document.getElementById('volError'));showInputs();});
})();`;

// ── 16. Unit Converter ──
const converter = `/* unit-converter.js */
(function(){
  'use strict';
  var units = {
    length: {mm:0.001,cm:0.01,m:1,km:1000,inch:0.0254,ft:0.3048,yard:0.9144,mile:1609.344,nautical_mile:1852},
    area: {sq_mm:0.000001,sq_cm:0.0001,sq_m:1,sq_km:1000000,sq_inch:0.00064516,sq_ft:0.092903,sq_yard:0.836127,acre:4046.86,hectare:10000},
    volume: {ml:0.001,litre:1,cubic_m:1000,cubic_cm:0.001,cubic_inch:0.0163871,cubic_ft:28.3168,gallon_us:3.78541,gallon_uk:4.54609},
    mass: {mg:0.000001,g:0.001,kg:1,tonne:1000,ounce:0.0283495,pound:0.453592,stone:6.35029},
    speed: {m_s:1,km_h:0.277778,mph:0.44704,knot:0.514444},
    time: {ms:0.001,s:1,min:60,hour:3600,day:86400,week:604800,year:31536000},
    digital: {byte:1,kb:1024,mb:1048576,gb:1073741824,tb:1.099511627776e12,pb:1.125899906842624e15}
  };
  var catEl=document.getElementById('ucCategory');
  var fromEl=document.getElementById('ucFrom');
  var toEl=document.getElementById('ucTo');
  function populateUnits(){
    var cat=catEl.value;
    fromEl.innerHTML='';toEl.innerHTML='';
    if(cat==='temperature'){
      fromEl.innerHTML='<option value="celsius">Celsius (°C)</option><option value="fahrenheit">Fahrenheit (°F)</option><option value="kelvin">Kelvin (K)</option>';
      toEl.innerHTML=fromEl.innerHTML;
    } else {
      var u=units[cat]||{};
      for(var k in u){fromEl.innerHTML+='<option value="'+k+'">'+k+'</option>';toEl.innerHTML+='<option value="'+k+'">'+k+'</option>';}
      if(toEl.options.length>1)toEl.selectedIndex=1;
    }
  }
  catEl.addEventListener('change',populateUnits);populateUnits();
  document.getElementById('ucBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('ucError'));
    var val=CalcUtils.num(document.getElementById('ucValue').value);
    if(val===null){CalcUtils.showError(document.getElementById('ucError'),'Enter a value.');document.getElementById('ucResult').innerHTML='';return;}
    var cat=catEl.value,from=fromEl.value,to=toEl.value,result;
    if(cat==='temperature'){
      var c;
      if(from==='celsius')c=val;
      else if(from==='fahrenheit')c=(val-32)*5/9;
      else c=val-273.15;
      if(to==='celsius')result=c;
      else if(to==='fahrenheit')result=c*9/5+32;
      else result=c+273.15;
    } else {
      var f=units[cat][from],t=units[cat][to];
      result=val*f/t;
    }
    document.getElementById('ucResult').innerHTML='<div class="result-label">Result</div><div class="result-value">'+CalcUtils.fmt(result)+' '+to+'</div><div class="result-detail"><div><strong>'+val+' '+from+' = '+CalcUtils.fmt(result)+' '+to+'</div></div>';
  });
  document.getElementById('ucReset').addEventListener('click',function(){document.getElementById('ucValue').value='';document.getElementById('ucResult').innerHTML='';CalcUtils.clearError(document.getElementById('ucError'));});
})();`;

// ── 17. Age Calculator ──
const age = `/* age.js */
(function(){
  'use strict';
  document.getElementById('ageBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('ageError'));
    var dobStr=document.getElementById('ageDOB').value;
    var targetStr=document.getElementById('ageTarget').value;
    if(!dobStr){CalcUtils.showError(document.getElementById('ageError'),'Enter your date of birth.');document.getElementById('ageResult').innerHTML='';return;}
    var dob=new Date(dobStr);
    var target=targetStr?new Date(targetStr):new Date();
    if(dob>target){CalcUtils.showError(document.getElementById('ageError'),'Date of birth must be before the target date.');document.getElementById('ageResult').innerHTML='';return;}
    var years=target.getFullYear()-dob.getFullYear();
    var months=target.getMonth()-dob.getMonth();
    var days=target.getDate()-dob.getDate();
    if(days<0){months--;var prevMonth=new Date(target.getFullYear(),target.getMonth(),0);days+=prevMonth.getDate();}
    if(months<0){years--;months+=12;}
    var totalDays=Math.floor((target-dob)/(1000*60*60*24));
    var nextBday=new Date(target.getFullYear(),dob.getMonth(),dob.getDate());
    if(nextBday<target)nextBday.setFullYear(target.getFullYear()+1);
    var daysToBday=Math.ceil((nextBday-target)/(1000*60*60*24));
    var html='<div class="result-label">Your Age</div>';
    html+='<div class="result-value">'+years+' years, '+months+' months, '+days+' days</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Total days lived:</strong> '+totalDays.toLocaleString()+'</div>';
    html+='<div><strong>Next birthday:</strong> '+nextBday.toDateString()+' ('+daysToBday+' days)</div>';
    html+='</div>';
    document.getElementById('ageResult').innerHTML=html;
  });
  document.getElementById('ageReset').addEventListener('click',function(){document.getElementById('ageDOB').value='';document.getElementById('ageTarget').value='';document.getElementById('ageResult').innerHTML='';CalcUtils.clearError(document.getElementById('ageError'));});
  if(!document.getElementById('ageTarget').value)document.getElementById('ageTarget').valueAsDate=new Date();
})();`;

// ── 18. Date Difference ──
const datediff = `/* date-difference.js */
(function(){
  'use strict';
  document.getElementById('ddBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('ddError'));
    var sStr=document.getElementById('ddStart').value,eStr=document.getElementById('ddEnd').value;
    if(!sStr||!eStr){CalcUtils.showError(document.getElementById('ddError'),'Enter both dates.');document.getElementById('ddResult').innerHTML='';return;}
    var start=new Date(sStr),end=new Date(eStr);
    if(end<=start){CalcUtils.showError(document.getElementById('ddError'),'End date must be after start date.');document.getElementById('ddResult').innerHTML='';return;}
    var years=end.getFullYear()-start.getFullYear();
    var months=end.getMonth()-start.getMonth();
    var days=end.getDate()-start.getDate();
    if(days<0){months--;var prev=new Date(end.getFullYear(),end.getMonth(),0);days+=prev.getDate();}
    if(months<0){years--;months+=12;}
    var totalDays=Math.floor((end-start)/(1000*60*60*24));
    var html='<div class="result-label">Date Difference</div>';
    html+='<div class="result-value">'+years+' years, '+months+' months, '+days+' days</div>';
    html+='<div class="result-detail"><div><strong>Total days:</strong> '+totalDays.toLocaleString()+'</div></div>';
    document.getElementById('ddResult').innerHTML=html;
  });
  document.getElementById('ddReset').addEventListener('click',function(){document.getElementById('ddStart').value='';document.getElementById('ddEnd').value='';document.getElementById('ddResult').innerHTML='';CalcUtils.clearError(document.getElementById('ddError'));});
})();`;

// ── 19. Time Calculator ──
const time = `/* time.js */
(function(){
  'use strict';
  function toSec(h,m,s){return (h||0)*3600+(m||0)*60+(s||0);}
  function fromSec(sec){
    var h=Math.floor(Math.abs(sec)/3600),m=Math.floor((Math.abs(sec)%3600)/60),s=Math.abs(sec)%60;
    return (sec<0?'-':'')+h+'h '+m+'m '+s+'s';
  }
  function showResult(elId,label,value,detail){var el=document.getElementById(elId);el.innerHTML='<div class="result-label">'+label+'</div><div class="result-value">'+value+'</div>'+(detail?'<div class="result-detail">'+detail+'</div>':'');}
  function clearResult(elId){document.getElementById(elId).innerHTML='';}
  function err(elId,msg){CalcUtils.showError(document.getElementById(elId),msg);}
  function clrErr(elId){CalcUtils.clearError(document.getElementById(elId));}
  function n(id){return CalcUtils.num(document.getElementById(id).value)||0;}

  document.getElementById('taBtn').addEventListener('click',function(){
    clrErr('taError');
    var s1=toSec(n('taH1'),n('taM1'),n('taS1')),s2=toSec(n('taH2'),n('taM2'),n('taS2'));
    var total=s1+s2;
    showResult('taResult','Sum',fromSec(total),'<div><strong>Total seconds:</strong> '+total+'</div>');
  });
  document.getElementById('taReset').addEventListener('click',function(){['taH1','taM1','taS1','taH2','taM2','taS2'].forEach(function(id){document.getElementById(id).value='';});clearResult('taResult');clrErr('taError');});

  document.getElementById('tsBtn').addEventListener('click',function(){
    clrErr('tsError');
    var s1=toSec(n('tsH1'),n('tsM1'),n('tsS1')),s2=toSec(n('tsH2'),n('tsM2'),n('tsS2'));
    var total=s1-s2;
    showResult('tsResult','Difference',fromSec(total),'<div><strong>Total seconds:</strong> '+total+'</div>');
  });
  document.getElementById('tsReset').addEventListener('click',function(){['tsH1','tsM1','tsS1','tsH2','tsM2','tsS2'].forEach(function(id){document.getElementById(id).value='';});clearResult('tsResult');clrErr('tsError');});

  document.getElementById('tcBtn').addEventListener('click',function(){
    clrErr('tcError');
    var val=CalcUtils.num(document.getElementById('tcVal').value);
    var from=document.getElementById('tcFrom').value;
    if(val===null){err('tcError','Enter a value.');clearResult('tcResult');return;}
    var sec;
    if(from==='hours')sec=val*3600;
    else if(from==='minutes')sec=val*60;
    else if(from==='seconds')sec=val;
    else if(from==='dechours')sec=val*3600;
    var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.round(sec%60);
    var dec=sec/3600;
    showResult('tcResult','Converted',h+'h '+m+'m '+s+'s','<div><strong>Hours:</strong> '+CalcUtils.fmt(sec/3600)+'</div><div><strong>Minutes:</strong> '+CalcUtils.fmt(sec/60)+'</div><div><strong>Seconds:</strong> '+CalcUtils.fmt(sec)+'</div><div><strong>Decimal hours:</strong> '+CalcUtils.fmt(dec)+'</div>');
  });
  document.getElementById('tcReset').addEventListener('click',function(){document.getElementById('tcVal').value='';clearResult('tcResult');clrErr('tcError');});
})();`;

// ── 20. Speed, Distance & Time ──
const sdt = `/* speed-distance-time.js */
(function(){
  'use strict';
  var solveEl=document.getElementById('sdtSolve');
  var inputsEl=document.getElementById('sdtInputs');
  function showInputs(){
    var s=solveEl.value,html='';
    if(s==='speed'){
      html='<div class="form-row-3"><div class="form-group"><label class="form-label">Distance</label><input type="number" class="form-control" id="sdt_d" step="any" /></div><div class="form-group"><label class="form-label">Distance unit</label><select class="form-control" id="sdt_du"><option value="1">metres</option><option value="1000">kilometres</option><option value="1609.344">miles</option></select></div><div class="form-group"><label class="form-label">Time</label><input type="number" class="form-control" id="sdt_t" step="any" /></div></div>';
      html+='<div class="form-row-3"><div class="form-group"><label class="form-label">Time unit</label><select class="form-control" id="sdt_tu"><option value="1">seconds</option><option value="60">minutes</option><option value="3600">hours</option></select></div><div class="form-group"><label class="form-label">Speed unit</label><select class="form-control" id="sdt_su"><option value="1">m/s</option><option value="0.277778">km/h</option><option value="0.44704">mph</option></select></div></div>';
    } else if(s==='distance'){
      html='<div class="form-row-3"><div class="form-group"><label class="form-label">Speed</label><input type="number" class="form-control" id="sdt_s" step="any" /></div><div class="form-group"><label class="form-label">Speed unit</label><select class="form-control" id="sdt_su"><option value="1">m/s</option><option value="0.277778">km/h</option><option value="0.44704">mph</option></select></div><div class="form-group"><label class="form-label">Time</label><input type="number" class="form-control" id="sdt_t" step="any" /></div></div>';
      html+='<div class="form-row-3"><div class="form-group"><label class="form-label">Time unit</label><select class="form-control" id="sdt_tu"><option value="1">seconds</option><option value="60">minutes</option><option value="3600">hours</option></select></div><div class="form-group"><label class="form-label">Distance unit</label><select class="form-control" id="sdt_du"><option value="1">metres</option><option value="1000">kilometres</option><option value="1609.344">miles</option></select></div></div>';
    } else {
      html='<div class="form-row-3"><div class="form-group"><label class="form-label">Distance</label><input type="number" class="form-control" id="sdt_d" step="any" /></div><div class="form-group"><label class="form-label">Distance unit</label><select class="form-control" id="sdt_du"><option value="1">metres</option><option value="1000">kilometres</option><option value="1609.344">miles</option></select></div><div class="form-group"><label class="form-label">Speed</label><input type="number" class="form-control" id="sdt_s" step="any" /></div></div>';
      html+='<div class="form-row-3"><div class="form-group"><label class="form-label">Speed unit</label><select class="form-control" id="sdt_su"><option value="1">m/s</option><option value="0.277778">km/h</option><option value="0.44704">mph</option></select></div><div class="form-group"><label class="form-label">Time unit</label><select class="form-control" id="sdt_tu"><option value="1">seconds</option><option value="60">minutes</option><option value="3600">hours</option></select></div></div>';
    }
    inputsEl.innerHTML=html;
  }
  solveEl.addEventListener('change',showInputs);showInputs();
  document.getElementById('sdtBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('sdtError'));
    var s=solveEl.value;
    function v(id){return CalcUtils.num(document.getElementById(id).value);}
    function u(id){return parseFloat(document.getElementById(id).value);}
    if(s==='speed'){
      var d=v('sdt_d'),t=v('sdt_t');
      if(d===null||t===null||t===0){CalcUtils.showError(document.getElementById('sdtError'),'Enter distance and time (time must be > 0).');document.getElementById('sdtResult').innerHTML='';return;}
      var dM=d*u('sdt_du'),tS=t*u('sdt_tu'),speedMS=dM/tS;
      var speedOut=speedMS/u('sdt_su');
      document.getElementById('sdtResult').innerHTML='<div class="result-label">Speed</div><div class="result-value">'+CalcUtils.fmt(speedOut)+'</div><div class="result-detail"><div><strong>Formula:</strong> Speed = Distance / Time</div></div>';
    } else if(s==='distance'){
      var sp=v('sdt_s'),t2=v('sdt_t');
      if(sp===null||t2===null){CalcUtils.showError(document.getElementById('sdtError'),'Enter speed and time.');document.getElementById('sdtResult').innerHTML='';return;}
      var spMS=sp*u('sdt_su'),tS2=t2*u('sdt_tu'),dM2=spMS*tS2;
      var dOut=dM2/u('sdt_du');
      document.getElementById('sdtResult').innerHTML='<div class="result-label">Distance</div><div class="result-value">'+CalcUtils.fmt(dOut)+'</div><div class="result-detail"><div><strong>Formula:</strong> Distance = Speed × Time</div></div>';
    } else {
      var d3=v('sdt_d'),sp3=v('sdt_s');
      if(d3===null||sp3===null||sp3===0){CalcUtils.showError(document.getElementById('sdtError'),'Enter distance and speed (speed must be > 0).');document.getElementById('sdtResult').innerHTML='';return;}
      var dM3=d3*u('sdt_du'),spMS3=sp3*u('sdt_su'),tS3=dM3/spMS3;
      var tOut=tS3/u('sdt_tu');
      document.getElementById('sdtResult').innerHTML='<div class="result-label">Time</div><div class="result-value">'+CalcUtils.fmt(tOut)+'</div><div class="result-detail"><div><strong>Formula:</strong> Time = Distance / Speed</div></div>';
    }
  });
  document.getElementById('sdtReset').addEventListener('click',function(){inputsEl.innerHTML='';document.getElementById('sdtResult').innerHTML='';CalcUtils.clearError(document.getElementById('sdtError'));showInputs();});
})();`;

// ── 21. BMI Calculator ──
const bmi = `/* bmi.js */
(function(){
  'use strict';
  var unitEl=document.getElementById('bmiUnit');
  var metricInputs=document.getElementById('bmiMetricInputs');
  var imperialInputs=document.getElementById('bmiImperialInputs');
  unitEl.addEventListener('change',function(){
    if(unitEl.value==='metric'){metricInputs.style.display='';imperialInputs.style.display='none';}
    else{metricInputs.style.display='none';imperialInputs.style.display='';}
  });
  document.getElementById('bmiBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('bmiError'));
    var bmiVal,category;
    if(unitEl.value==='metric'){
      var kg=CalcUtils.num(document.getElementById('bmiWeightKg').value);
      var cm=CalcUtils.num(document.getElementById('bmiHeightCm').value);
      if(kg===null||cm===null){CalcUtils.showError(document.getElementById('bmiError'),'Enter weight and height.');document.getElementById('bmiResult').innerHTML='';return;}
      var m=cm/100;
      bmiVal=kg/(m*m);
    } else {
      var lb=CalcUtils.num(document.getElementById('bmiWeightLb').value);
      var inch=CalcUtils.num(document.getElementById('bmiHeightIn').value);
      if(lb===null||inch===null){CalcUtils.showError(document.getElementById('bmiError'),'Enter weight and height.');document.getElementById('bmiResult').innerHTML='';return;}
      bmiVal=703*lb/(inch*inch);
    }
    if(bmiVal<18.5)category='Underweight';
    else if(bmiVal<25)category='Normal weight';
    else if(bmiVal<30)category='Overweight';
    else category='Obese';
    var color=bmiVal<18.5?'var(--warning,500)':bmiVal<25?'var(--success,500)':bmiVal<30?'var(--warning,500)':'var(--error-500)';
    var html='<div class="result-label">Your BMI</div>';
    html+='<div class="result-value">'+CalcUtils.fmt(bmiVal,1)+'</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Category:</strong> '+category+'</div>';
    html+='<div style="margin-top:8px;font-size:0.85rem;color:var(--text-faint);">BMI is a screening index, not a medical diagnosis. Consult a healthcare professional for individual assessment.</div>';
    html+='</div>';
    document.getElementById('bmiResult').innerHTML=html;
  });
  document.getElementById('bmiReset').addEventListener('click',function(){['bmiWeightKg','bmiHeightCm','bmiWeightLb','bmiHeightIn'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('bmiResult').innerHTML='';CalcUtils.clearError(document.getElementById('bmiError'));});
})();`;

// ── 22. Compound Interest ──
const compound = `/* compound-interest.js */
(function(){
  'use strict';
  document.getElementById('ciBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('ciError'));
    var P=CalcUtils.num(document.getElementById('ciP').value);
    var r=CalcUtils.num(document.getElementById('ciR').value);
    var t=CalcUtils.num(document.getElementById('ciT').value);
    var n=parseInt(document.getElementById('ciN').value);
    if(P===null||r===null||t===null){CalcUtils.showError(document.getElementById('ciError'),'Enter principal, rate and time.');document.getElementById('ciResult').innerHTML='';return;}
    var rDec=r/100;
    var A=P*Math.pow(1+rDec/n,n*t);
    var interest=A-P;
    var ear=Math.pow(1+rDec/n,n)-1;
    var html='<div class="result-label">Compound Interest Result</div>';
    html+='<div class="result-value">£'+CalcUtils.fmt(A,2)+'</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Principal:</strong> £'+CalcUtils.fmt(P,2)+'</div>';
    html+='<div><strong>Total interest:</strong> £'+CalcUtils.fmt(interest,2)+'</div>';
    html+='<div><strong>Effective annual rate:</strong> '+CalcUtils.fmt(ear*100,4)+'%</div>';
    html+='<div><strong>Formula:</strong> A = '+P+'(1 + '+rDec+'/'+n+')^('+n+'×'+t+')</div>';
    html+='</div>';
    document.getElementById('ciResult').innerHTML=html;
  });
  document.getElementById('ciReset').addEventListener('click',function(){['ciP','ciR','ciT'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('ciResult').innerHTML='';CalcUtils.clearError(document.getElementById('ciError'));});
})();`;

// ── 23. Simple Interest ──
const simple = `/* simple-interest.js */
(function(){
  'use strict';
  document.getElementById('siBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('siError'));
    var P=CalcUtils.num(document.getElementById('siP').value);
    var R=CalcUtils.num(document.getElementById('siR').value);
    var T=CalcUtils.num(document.getElementById('siT').value);
    if(P===null||R===null||T===null){CalcUtils.showError(document.getElementById('siError'),'Enter principal, rate and time.');document.getElementById('siResult').innerHTML='';return;}
    var I=P*(R/100)*T;
    var A=P+I;
    var html='<div class="result-label">Simple Interest Result</div>';
    html+='<div class="result-value">£'+CalcUtils.fmt(A,2)+'</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Interest:</strong> £'+CalcUtils.fmt(I,2)+'</div>';
    html+='<div><strong>Principal:</strong> £'+CalcUtils.fmt(P,2)+'</div>';
    html+='<div><strong>Formula:</strong> I = '+P+' × '+(R/100)+' × '+T+' = '+CalcUtils.fmt(I,2)+'</div>';
    html+='</div>';
    document.getElementById('siResult').innerHTML=html;
  });
  document.getElementById('siReset').addEventListener('click',function(){['siP','siR','siT'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('siResult').innerHTML='';CalcUtils.clearError(document.getElementById('siError'));});
})();`;

// ── 24. Loan Payment ──
const loan = `/* loan.js */
(function(){
  'use strict';
  document.getElementById('lnBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('lnError'));
    var P=CalcUtils.num(document.getElementById('lnP').value);
    var R=CalcUtils.num(document.getElementById('lnR').value);
    var T=CalcUtils.num(document.getElementById('lnT').value);
    if(P===null||R===null||T===null){CalcUtils.showError(document.getElementById('lnError'),'Enter loan amount, rate and term.');document.getElementById('lnResult').innerHTML='';return;}
    var r=R/100/12;
    var n=T*12;
    var M;
    if(r===0)M=P/n;
    else M=P*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    var total=M*n;
    var totalInterest=total-P;
    var html='<div class="result-label">Loan Payment</div>';
    html+='<div class="result-value">£'+CalcUtils.fmt(M,2)+'/month</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>Monthly payment:</strong> £'+CalcUtils.fmt(M,2)+'</div>';
    html+='<div><strong>Total paid:</strong> £'+CalcUtils.fmt(total,2)+'</div>';
    html+='<div><strong>Total interest:</strong> £'+CalcUtils.fmt(totalInterest,2)+'</div>';
    html+='</div>';
    // Amortization summary
    html+='<div style="margin-top:1rem;"><strong>Amortization Summary</strong></div>';
    html+='<div class="amort-table-wrap"><table class="amort-table"><thead><tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Balance</th></tr></thead><tbody>';
    var balance=P,totP=0,totI=0;
    for(var yr=1;yr<=Math.min(T,30);yr++){
      var yrP=0,yrI=0;
      for(var m=0;m<12&&balance>0;m++){
        var interest=balance*r;
        var principal=M-interest;
        if(principal>balance)principal=balance;
        balance-=principal;
        yrP+=principal;yrI+=interest;
      }
      totP+=yrP;totI+=yrI;
      html+='<tr><td>'+yr+'</td><td>£'+CalcUtils.fmt(yrP,0)+'</td><td>£'+CalcUtils.fmt(yrI,0)+'</td><td>£'+CalcUtils.fmt(Math.max(0,balance),0)+'</td></tr>';
    }
    html+='</tbody></table></div>';
    document.getElementById('lnResult').innerHTML=html;
  });
  document.getElementById('lnReset').addEventListener('click',function(){['lnP','lnR','lnT'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('lnResult').innerHTML='';CalcUtils.clearError(document.getElementById('lnError'));});
})();`;

// ── 25. GPA Calculator ──
const gpa = `/* gpa.js */
(function(){
  'use strict';
  var grades={'A+':4.0,'A':4.0,'A-':3.7,'B+':3.3,'B':3.0,'B-':2.7,'C+':2.3,'C':2.0,'C-':1.7,'D':1.0,'F':0.0};
  var rowsEl=document.getElementById('gpaRows');
  var rowCount=3;
  function buildRows(){
    var html='';
    for(var i=0;i<rowCount;i++){
      html+='<div class="form-row" style="margin-bottom:0.5rem;" data-row="'+i+'">';
      html+='<div class="form-group" style="flex:2;"><label class="form-label">Course name</label><input type="text" class="form-control" id="gpa_name_'+i+'" placeholder="Course '+(i+1)+'" /></div>';
      html+='<div class="form-group"><label class="form-label">Grade</label><select class="form-control" id="gpa_grade_'+i+'">';
      for(var g in grades)html+='<option value="'+g+'">'+g+'</option>';
      html+='</select></div>';
      html+='<div class="form-group"><label class="form-label">Credits</label><input type="number" class="form-control" id="gpa_credits_'+i+'" placeholder="3" step="any" /></div>';
      html+='</div>';
    }
    rowsEl.innerHTML=html;
  }
  buildRows();
  document.getElementById('gpaAddRow').addEventListener('click',function(){rowCount++;buildRows();});
  document.getElementById('gpaBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('gpaError'));
    var totalPoints=0,totalCredits=0;
    for(var i=0;i<rowCount;i++){
      var credits=CalcUtils.num(document.getElementById('gpa_credits_'+i).value);
      if(credits===null)continue;
      var grade=document.getElementById('gpa_grade_'+i).value;
      totalPoints+=grades[grade]*credits;
      totalCredits+=credits;
    }
    if(totalCredits===0){CalcUtils.showError(document.getElementById('gpaError'),'Enter credit hours for at least one course.');document.getElementById('gpaResult').innerHTML='';return;}
    var gpa=totalPoints/totalCredits;
    document.getElementById('gpaResult').innerHTML='<div class="result-label">Your GPA</div><div class="result-value">'+CalcUtils.fmt(gpa,2)+'</div><div class="result-detail"><div><strong>Total credits:</strong> '+CalcUtils.fmt(totalCredits)+'</div><div><strong>Total grade points:</strong> '+CalcUtils.fmt(totalPoints,2)+'</div></div>';
  });
  document.getElementById('gpaReset').addEventListener('click',function(){rowCount=3;buildRows();document.getElementById('gpaResult').innerHTML='';CalcUtils.clearError(document.getElementById('gpaError'));});
})();`;

// ── 26. Permutation & Combination ──
const permcomb = `/* permutation-combination.js */
(function(){
  'use strict';
  document.getElementById('pcBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('pcError'));
    var n=CalcUtils.num(document.getElementById('pcN').value);
    var r=CalcUtils.num(document.getElementById('pcR').value);
    if(n===null||r===null){CalcUtils.showError(document.getElementById('pcError'),'Enter n and r.');document.getElementById('pcResult').innerHTML='';return;}
    if(n<0||r<0||r>n||n!==Math.floor(n)||r!==Math.floor(r)){CalcUtils.showError(document.getElementById('pcError'),'n and r must be non-negative integers with r ≤ n.');document.getElementById('pcResult').innerHTML='';return;}
    var npr=CalcUtils.nPr(n,r);
    var ncr=CalcUtils.nCr(n,r);
    var html='<div class="result-label">Results</div>';
    html+='<div class="result-value">nPr = '+npr.toLocaleString()+'<br>nCr = '+ncr.toLocaleString()+'</div>';
    html+='<div class="result-detail">';
    html+='<div><strong>nPr = '+n+'! / '+(n-r)+'! = '+npr.toLocaleString()+'</strong> (order matters)</div>';
    html+='<div><strong>nCr = '+n+'! / ('+r+'! × '+(n-r)+'!) = '+ncr.toLocaleString()+'</strong> (order doesn\'t matter)</div>';
    html+='</div>';
    document.getElementById('pcResult').innerHTML=html;
  });
  document.getElementById('pcReset').addEventListener('click',function(){document.getElementById('pcN').value='';document.getElementById('pcR').value='';document.getElementById('pcResult').innerHTML='';CalcUtils.clearError(document.getElementById('pcError'));});
})();`;

// ── 27. Factorial ──
const factorial = `/* factorial.js */
(function(){
  'use strict';
  document.getElementById('facBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('facError'));
    var n=CalcUtils.num(document.getElementById('facN').value);
    if(n===null){CalcUtils.showError(document.getElementById('facError'),'Enter a non-negative integer.');document.getElementById('facResult').innerHTML='';return;}
    if(n<0||n!==Math.floor(n)){CalcUtils.showError(document.getElementById('facError'),'Factorial requires a non-negative integer.');document.getElementById('facResult').innerHTML='';return;}
    var result;
    if(n<=170){
      result=1;
      for(var i=2;i<=n;i++)result*=i;
      var expansion=n<=20?[...Array(n).keys()].map(function(v){return v+1;}).reverse().join(' × '):'';
      var html='<div class="result-label">Result</div><div class="result-value">'+n+'! = '+result.toLocaleString()+'</div>';
      if(expansion)html+='<div class="result-detail"><div><strong>Expansion:</strong> '+expansion+' = '+result.toLocaleString()+'</div></div>';
      document.getElementById('facResult').innerHTML=html;
    } else {
      // BigInt for large numbers
      var bigResult=1n;
      for(var j=2n;j<=BigInt(n);j++)bigResult*=j;
      var str=bigResult.toString();
      var display=str.length>200?str.substring(0,100)+'...('+str.length+' digits)...'+str.substring(str.length-100):str;
      document.getElementById('facResult').innerHTML='<div class="result-label">Result</div><div class="result-value" style="font-size:1rem;">'+n+'! = '+display+'</div>';
    }
  });
  document.getElementById('facReset').addEventListener('click',function(){document.getElementById('facN').value='';document.getElementById('facResult').innerHTML='';CalcUtils.clearError(document.getElementById('facError'));});
})();`;

// ── 28. Exponent & Power ──
const exponent = `/* exponent.js */
(function(){
  'use strict';
  document.getElementById('expBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('expError'));
    var a=CalcUtils.num(document.getElementById('expBase').value);
    var b=CalcUtils.num(document.getElementById('expExp').value);
    if(a===null||b===null){CalcUtils.showError(document.getElementById('expError'),'Enter base and exponent.');document.getElementById('expResult').innerHTML='';return;}
    if(a===0&&b<=0){CalcUtils.showError(document.getElementById('expError'),'0 to a non-positive power is undefined.');document.getElementById('expResult').innerHTML='';return;}
    var result=Math.pow(a,b);
    if(!isFinite(result)){CalcUtils.showError(document.getElementById('expError'),'Result is too large (overflow).');document.getElementById('expResult').innerHTML='';return;}
    document.getElementById('expResult').innerHTML='<div class="result-label">Result</div><div class="result-value">'+CalcUtils.fmt(result)+'</div><div class="result-detail"><div><strong>Formula:</strong> '+a+'^'+b+' = '+CalcUtils.fmt(result)+'</div></div>';
  });
  document.getElementById('expReset').addEventListener('click',function(){document.getElementById('expBase').value='';document.getElementById('expExp').value='';document.getElementById('expResult').innerHTML='';CalcUtils.clearError(document.getElementById('expError'));});
})();`;

// ── 29. Logarithm ──
const logarithm = `/* logarithm.js */
(function(){
  'use strict';
  var typeEl=document.getElementById('logType');
  var customBase=document.getElementById('logCustomBase');
  typeEl.addEventListener('change',function(){customBase.style.display=typeEl.value==='custom'?'':'none';});
  document.getElementById('logBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('logError'));
    var x=CalcUtils.num(document.getElementById('logX').value);
    if(x===null){CalcUtils.showError(document.getElementById('logError'),'Enter a value.');document.getElementById('logResult').innerHTML='';return;}
    if(x<=0){CalcUtils.showError(document.getElementById('logError'),'Value must be positive.');document.getElementById('logResult').innerHTML='';return;}
    var result,label,formula;
    if(typeEl.value==='log10'){result=Math.log10(x);label='log₁₀('+x+')';formula='log₁₀('+x+') = '+CalcUtils.fmt(result,10);}
    else if(typeEl.value==='ln'){result=Math.log(x);label='ln('+x+')';formula='ln('+x+') = '+CalcUtils.fmt(result,10);}
    else{
      var b=CalcUtils.num(document.getElementById('logBase').value);
      if(b===null){CalcUtils.showError(document.getElementById('logError'),'Enter the base.');document.getElementById('logResult').innerHTML='';return;}
      if(b<=0||b===1){CalcUtils.showError(document.getElementById('logError'),'Base must be positive and not 1.');document.getElementById('logResult').innerHTML='';return;}
      result=Math.log(x)/Math.log(b);label='log'+b+'('+x+')';formula='log'+b+'('+x+') = ln('+x+') / ln('+b+') = '+CalcUtils.fmt(result,10);
    }
    document.getElementById('logResult').innerHTML='<div class="result-label">'+label+'</div><div class="result-value">'+CalcUtils.fmt(result,10)+'</div><div class="result-detail"><div><strong>Formula:</strong> '+formula+'</div></div>';
  });
  document.getElementById('logReset').addEventListener('click',function(){document.getElementById('logX').value='';document.getElementById('logBase').value='';document.getElementById('logResult').innerHTML='';CalcUtils.clearError(document.getElementById('logError'));});
})();`;

// ── 30. Trigonometry ──
const trig = `/* trigonometry.js */
(function(){
  'use strict';
  document.getElementById('trigBtn').addEventListener('click',function(){
    CalcUtils.clearError(document.getElementById('trigError'));
    var mode=document.getElementById('trigMode').value;
    var func=document.getElementById('trigFunc').value;
    var val=CalcUtils.num(document.getElementById('trigVal').value);
    if(val===null){CalcUtils.showError(document.getElementById('trigError'),'Enter a value.');document.getElementById('trigResult').innerHTML='';return;}
    var rad=mode==='deg'?val*Math.PI/180:val;
    var result,label;
    if(func==='sin'){result=Math.sin(rad);label='sin('+val+(mode==='deg'?'°':' rad')+')';}
    else if(func==='cos'){result=Math.cos(rad);label='cos('+val+(mode==='deg'?'°':' rad')+')';}
    else if(func==='tan'){result=Math.tan(rad);label='tan('+val+(mode==='deg'?'°':' rad')+')';}
    else if(func==='asin'){if(val<-1||val>1){CalcUtils.showError(document.getElementById('trigError'),'arcsin requires input between -1 and 1.');document.getElementById('trigResult').innerHTML='';return;}result=Math.asin(val);if(mode==='deg')result*=180/Math.PI;label='arcsin('+val+')';}
    else if(func==='acos'){if(val<-1||val>1){CalcUtils.showError(document.getElementById('trigError'),'arccos requires input between -1 and 1.');document.getElementById('trigResult').innerHTML='';return;}result=Math.acos(val);if(mode==='deg')result*=180/Math.PI;label='arccos('+val+')';}
    else if(func==='atan'){result=Math.atan(val);if(mode==='deg')result*=180/Math.PI;label='arctan('+val+')';}
    document.getElementById('trigResult').innerHTML='<div class="result-label">'+label+'</div><div class="result-value">'+CalcUtils.fmt(result,10)+'</div><div class="result-detail"><div><strong>Mode:</strong> '+(mode==='deg'?'Degrees':'Radians')+'</div></div>';
  });
  document.getElementById('trigReset').addEventListener('click',function(){document.getElementById('trigVal').value='';document.getElementById('trigResult').innerHTML='';CalcUtils.clearError(document.getElementById('trigError'));});
})();`

module.exports = {
  scientific,
  percentage,
  fraction,
  quadratic,
  algebra,
  matrix,
  statistics,
  probability,
  stddev,
  mmm,
  geometry,
  triangle,
  circle,
  area,
  volume,
  converter,
  age,
  datediff,
  time,
  sdt,
  bmi,
  compound,
  simple,
  loan,
  gpa,
  permcomb,
  factorial,
  exponent,
  logarithm,
  trig
};
