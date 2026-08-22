#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'public', 'pages');
const JS_DIR = path.join(ROOT, 'public', 'js');

fs.mkdirSync(PAGES_DIR, { recursive: true });
fs.mkdirSync(JS_DIR, { recursive: true });

// ── Calculator definitions ──
const calcs = [
  { slug:'scientific-calculator', name:'Scientific Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'🧮',
    title:'Scientific Calculator — Free Online Calc with Trig, Logs & Memory | CalcVerse',
    desc:'Free online scientific calculator with trigonometric functions, logarithms, powers, roots, factorial, constants, DEG/RAD modes, memory and calculation history.',
    jsFile:'scientific.js', jsType:'scientific' },
  { slug:'percentage-calculator', name:'Percentage Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'％',
    title:'Percentage Calculator — Percent Of, Increase, Decrease & Difference | CalcVerse',
    desc:'Calculate percentages with ease: find X% of Y, what percentage X is of Y, percentage increase, decrease, difference and original value from a percentage change.',
    jsFile:'percentage.js', jsType:'percentage' },
  { slug:'fraction-calculator', name:'Fraction Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'½',
    title:'Fraction Calculator — Add, Subtract, Multiply & Divide Fractions | CalcVerse',
    desc:'Free fraction calculator for adding, subtracting, multiplying and dividing fractions, mixed numbers and improper fractions with simplification and decimal conversion.',
    jsFile:'fraction.js', jsType:'fraction' },
  { slug:'quadratic-equation-calculator', name:'Quadratic Equation Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'x²',
    title:'Quadratic Equation Calculator — Solve ax² + bx + c = 0 | CalcVerse',
    desc:'Solve quadratic equations ax² + bx + c = 0 using the quadratic formula. Get real roots, repeated roots or complex roots with full step-by-step working and discriminant analysis.',
    jsFile:'quadratic.js', jsType:'quadratic' },
  { slug:'algebra-calculator', name:'Algebra Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'𝑥',
    title:'Algebra Calculator — Solve Linear & Quadratic Equations Step by Step | CalcVerse',
    desc:'Free algebra calculator for solving linear equations, quadratic equations and simplifying expressions with full step-by-step solutions.',
    jsFile:'algebra.js', jsType:'algebra' },
  { slug:'matrix-calculator', name:'Matrix Calculator', cat:'Advanced Math', catAnchor:'cat-advanced', icon:'⊞',
    title:'Matrix Calculator — Add, Multiply, Determinant & Inverse | CalcVerse',
    desc:'Free online matrix calculator for addition, subtraction, multiplication, transpose, determinant and inverse of 2×2 and 3×3 matrices with step-by-step working.',
    jsFile:'matrix.js', jsType:'matrix' },
  { slug:'statistics-calculator', name:'Statistics Calculator', cat:'Statistics & Probability', catAnchor:'cat-stats', icon:'📊',
    title:'Statistics Calculator — Mean, Median, Mode, Variance & SD | CalcVerse',
    desc:'Free statistics calculator for datasets: count, sum, mean, median, mode, range, variance, standard deviation, minimum and maximum. Population and sample statistics.',
    jsFile:'statistics.js', jsType:'statistics' },
  { slug:'probability-calculator', name:'Probability Calculator', cat:'Statistics & Probability', catAnchor:'cat-stats', icon:'🎲',
    title:'Probability Calculator — Basic, Conditional & Independent Events | CalcVerse',
    desc:'Calculate basic probability, complement, independent events, conditional probability, combinations and permutations with clear explanations.',
    jsFile:'probability.js', jsType:'probability' },
  { slug:'standard-deviation-calculator', name:'Standard Deviation Calculator', cat:'Statistics & Probability', catAnchor:'cat-stats', icon:'σ',
    title:'Standard Deviation Calculator — Population & Sample SD | CalcVerse',
    desc:'Calculate population and sample standard deviation, mean and variance from any dataset. Explains Bessel correction and the n vs n-1 denominator difference.',
    jsFile:'standard-deviation.js', jsType:'stddev' },
  { slug:'mean-median-mode-calculator', name:'Mean, Median & Mode Calculator', cat:'Statistics & Probability', catAnchor:'cat-stats', icon:'x̄',
    title:'Mean, Median & Mode Calculator — Central Tendency | CalcVerse',
    desc:'Calculate mean, median, mode and range from any dataset. Handles multiple modes and explains each measure of central tendency.',
    jsFile:'mean-median-mode.js', jsType:'mmm' },
  { slug:'geometry-calculator', name:'Geometry Calculator', cat:'Geometry', catAnchor:'cat-geometry', icon:'△',
    title:'Geometry Calculator — Area & Perimeter of 2D Shapes | CalcVerse',
    desc:'Free geometry calculator for area and perimeter of rectangles, squares, triangles, circles, parallelograms and trapezoids with formulas and explanations.',
    jsFile:'geometry.js', jsType:'geometry' },
  { slug:'triangle-calculator', name:'Triangle Calculator', cat:'Geometry', catAnchor:'cat-geometry', icon:'△',
    title:'Triangle Calculator — Sides, Angles, Area & Pythagorean Theorem | CalcVerse',
    desc:'Calculate triangle sides, angles, area and perimeter. Supports the Pythagorean theorem, law of cosines and law of sines for right and general triangles.',
    jsFile:'triangle.js', jsType:'triangle' },
  { slug:'circle-calculator', name:'Circle Calculator', cat:'Geometry', catAnchor:'cat-geometry', icon:'◯',
    title:'Circle Calculator — Radius, Diameter, Circumference & Area | CalcVerse',
    desc:'Calculate the radius, diameter, circumference and area of a circle. Enter one value and get all the others using C = 2πr and A = πr².',
    jsFile:'circle.js', jsType:'circle' },
  { slug:'area-calculator', name:'Area Calculator', cat:'Geometry', catAnchor:'cat-geometry', icon:'▭',
    title:'Area Calculator — Area of Square, Rectangle, Triangle, Circle & More | CalcVerse',
    desc:'Free area calculator for square, rectangle, triangle, circle, trapezoid and parallelogram. Shows formulas and step-by-step working for each shape.',
    jsFile:'area.js', jsType:'area' },
  { slug:'volume-calculator', name:'Volume Calculator', cat:'Geometry', catAnchor:'cat-geometry', icon:'⬢',
    title:'Volume Calculator — Cube, Cylinder, Cone, Sphere & Prism | CalcVerse',
    desc:'Calculate the volume of cubes, cuboids, cylinders, cones, spheres and prisms. Shows formulas, units and step-by-step examples for each 3D shape.',
    jsFile:'volume.js', jsType:'volume' },
  { slug:'unit-converter', name:'Unit Converter', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'↔',
    title:'Unit Converter — Length, Mass, Temperature, Speed & More | CalcVerse',
    desc:'Free online unit converter for length, area, volume, mass, temperature, speed, time and digital storage. Accurate conversion factors for all common units.',
    jsFile:'unit-converter.js', jsType:'converter' },
  { slug:'age-calculator', name:'Age Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'🎂',
    title:'Age Calculator — Exact Age in Years, Months & Days | CalcVerse',
    desc:'Calculate exact age in years, months and days from a date of birth. Handles leap years correctly and shows total days lived and next birthday.',
    jsFile:'age.js', jsType:'age' },
  { slug:'date-difference-calculator', name:'Date Difference Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'📅',
    title:'Date Difference Calculator — Years, Months & Days Between Dates | CalcVerse',
    desc:'Calculate the difference between two dates in years, months, days and total days. Explains calendar arithmetic vs simple day subtraction.',
    jsFile:'date-difference.js', jsType:'datediff' },
  { slug:'time-calculator', name:'Time Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'⏱',
    title:'Time Calculator — Add, Subtract & Convert Hours, Minutes, Seconds | CalcVerse',
    desc:'Add and subtract time durations, convert between hours/minutes/seconds and decimal hours. Supports time duration calculations.',
    jsFile:'time.js', jsType:'time' },
  { slug:'speed-distance-time-calculator', name:'Speed, Distance & Time Calculator', cat:'Physics & Science', catAnchor:'cat-physics', icon:'⚡',
    title:'Speed, Distance & Time Calculator — Solve Motion Problems | CalcVerse',
    desc:'Calculate speed, distance or time using Speed = Distance / Time. Supports mph, km/h, m/s, miles, km, metres, hours, minutes and seconds.',
    jsFile:'speed-distance-time.js', jsType:'sdt' },
  { slug:'bmi-calculator', name:'BMI Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'⚖',
    title:'BMI Calculator — Body Mass Index from Height & Weight | CalcVerse',
    desc:'Calculate Body Mass Index (BMI) from height and weight in metric or imperial units. Shows BMI categories and explains that BMI is a screening index, not a medical diagnosis.',
    jsFile:'bmi.js', jsType:'bmi' },
  { slug:'compound-interest-calculator', name:'Compound Interest Calculator', cat:'Finance', catAnchor:'cat-finance', icon:'📈',
    title:'Compound Interest Calculator — Investment Growth | CalcVerse',
    desc:'Calculate compound interest with configurable compounding frequency. Shows final amount, total interest and the compounding effect over time.',
    jsFile:'compound-interest.js', jsType:'compound' },
  { slug:'simple-interest-calculator', name:'Simple Interest Calculator', cat:'Finance', catAnchor:'cat-finance', icon:'💰',
    title:'Simple Interest Calculator — I = PRT | CalcVerse',
    desc:'Calculate simple interest using I = PRT. Find interest, final amount, principal, rate or time with clear step-by-step working.',
    jsFile:'simple-interest.js', jsType:'simple' },
  { slug:'loan-payment-calculator', name:'Loan Payment Calculator', cat:'Finance', catAnchor:'cat-finance', icon:'🏦',
    title:'Loan Payment Calculator — Monthly Payment & Amortization | CalcVerse',
    desc:'Calculate monthly loan payments using the amortization formula. Shows total payments, total interest and a full amortization schedule.',
    jsFile:'loan.js', jsType:'loan' },
  { slug:'gpa-calculator', name:'GPA Calculator', cat:'Everyday & Date', catAnchor:'cat-everyday', icon:'🎓',
    title:'GPA Calculator — Weighted GPA from Courses & Credit Hours | CalcVerse',
    desc:'Calculate weighted GPA from course grades and credit hours. Supports the common 4.0 grading scale and explains that institutions may use different GPA policies.',
    jsFile:'gpa.js', jsType:'gpa' },
  { slug:'permutation-combination-calculator', name:'Permutation & Combination Calculator', cat:'Advanced Math', catAnchor:'cat-advanced', icon:'nCr',
    title:'Permutation & Combination Calculator — nPr & nCr | CalcVerse',
    desc:'Calculate permutations (nPr) and combinations (nCr). Explains the difference between arrangements where order matters and selections where it does not.',
    jsFile:'permutation-combination.js', jsType:'permcomb' },
  { slug:'factorial-calculator', name:'Factorial Calculator', cat:'Advanced Math', catAnchor:'cat-advanced', icon:'n!',
    title:'Factorial Calculator — Calculate n! for Any Non-Negative Integer | CalcVerse',
    desc:'Calculate n! = n × (n−1) × … × 1. Handles 0! = 1 correctly and supports large numbers. Explains factorial role in combinatorics and probability.',
    jsFile:'factorial.js', jsType:'factorial' },
  { slug:'exponent-power-calculator', name:'Exponent & Power Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'aᵇ',
    title:'Exponent & Power Calculator — a^b with Negative & Fractional Exponents | CalcVerse',
    desc:'Calculate a^b including positive, negative and fractional exponents and roots. Explains exponent laws with formulas and step-by-step examples.',
    jsFile:'exponent.js', jsType:'exponent' },
  { slug:'logarithm-calculator', name:'Logarithm Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'log',
    title:'Logarithm Calculator — log10, Natural Log & Arbitrary Base | CalcVerse',
    desc:'Calculate log base 10, natural logarithm (ln) and arbitrary base logarithms. Explains logarithmic scales like pH, Richter and decibels.',
    jsFile:'logarithm.js', jsType:'logarithm' },
  { slug:'trigonometry-calculator', name:'Trigonometry Calculator', cat:'Math & Algebra', catAnchor:'cat-math', icon:'sin',
    title:'Trigonometry Calculator — sin, cos, tan & Inverse Trig | CalcVerse',
    desc:'Calculate sin, cos, tan and inverse trigonometric functions in degrees or radians. Explains the unit circle and trigonometric identities.',
    jsFile:'trigonometry.js', jsType:'trig' },
];

// ── Shared HTML fragments ──
const headerHTML = (active) => `<header class="site-header">
    <div class="header-inner">
      <a href="/" class="logo"><span class="logo-icon">∑</span> CalcVerse</a>
      <nav class="main-nav" id="mainNav">
        <a href="/">Home</a>
        <a href="/#all-calculators">Calculators</a>
        <a href="/#categories">Categories</a>
        <a href="/#about">About</a>
      </nav>
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="searchInput" placeholder="Search calculators…" autocomplete="off" aria-label="Search calculators" />
          <div class="search-results" id="searchResults"></div>
        </div>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
          <svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <svg class="sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </button>
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>`;

const footerHTML = `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo"><span class="logo-icon">∑</span> CalcVerse</a>
          <p>Thirty free, fast and accurate online calculators with clear explanations, worked examples and history.</p>
        </div>
        <div class="footer-col">
          <h4>Math</h4>
          <ul>
            <li><a href="/pages/scientific-calculator.html">Scientific</a></li>
            <li><a href="/pages/fraction-calculator.html">Fractions</a></li>
            <li><a href="/pages/quadratic-equation-calculator.html">Quadratic</a></li>
            <li><a href="/pages/trigonometry-calculator.html">Trigonometry</a></li>
            <li><a href="/pages/logarithm-calculator.html">Logarithms</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Finance</h4>
          <ul>
            <li><a href="/pages/compound-interest-calculator.html">Compound Interest</a></li>
            <li><a href="/pages/simple-interest-calculator.html">Simple Interest</a></li>
            <li><a href="/pages/loan-payment-calculator.html">Loan Payment</a></li>
            <li><a href="/pages/bmi-calculator.html">BMI</a></li>
            <li><a href="/pages/gpa-calculator.html">GPA</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Everyday</h4>
          <ul>
            <li><a href="/pages/percentage-calculator.html">Percentage</a></li>
            <li><a href="/pages/age-calculator.html">Age</a></li>
            <li><a href="/pages/date-difference-calculator.html">Date Difference</a></li>
            <li><a href="/pages/time-calculator.html">Time</a></li>
            <li><a href="/pages/unit-converter.html">Unit Converter</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 CalcVerse. Free for everyone.</span>
        <span>Built with HTML, CSS and vanilla JavaScript.</span>
      </div>
    </div>
  </footer>`;

const headHTML = (c) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${c.title}</title>
  <meta name="description" content="${c.desc}" />
  <link rel="canonical" href="https://calcverse.app/pages/${c.slug}.html" />
  <meta property="og:title" content="${c.name} — CalcVerse" />
  <meta property="og:description" content="${c.desc}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
</head>`;

// ── Related calculators mapping ──
const relatedMap = {
  'scientific-calculator': ['trigonometry-calculator','logarithm-calculator','exponent-power-calculator','factorial-calculator','percentage-calculator'],
  'percentage-calculator': ['scientific-calculator','compound-interest-calculator','simple-interest-calculator','fraction-calculator','statistics-calculator'],
  'fraction-calculator': ['percentage-calculator','scientific-calculator','quadratic-equation-calculator','algebra-calculator','probability-calculator'],
  'quadratic-equation-calculator': ['algebra-calculator','scientific-calculator','fraction-calculator','exponent-power-calculator','trigonometry-calculator'],
  'algebra-calculator': ['quadratic-equation-calculator','scientific-calculator','fraction-calculator','matrix-calculator','exponent-power-calculator'],
  'matrix-calculator': ['algebra-calculator','quadratic-equation-calculator','permutation-combination-calculator','statistics-calculator','scientific-calculator'],
  'statistics-calculator': ['standard-deviation-calculator','mean-median-mode-calculator','probability-calculator','scientific-calculator','permutation-combination-calculator'],
  'probability-calculator': ['statistics-calculator','permutation-combination-calculator','factorial-calculator','standard-deviation-calculator','mean-median-mode-calculator'],
  'standard-deviation-calculator': ['statistics-calculator','mean-median-mode-calculator','probability-calculator','scientific-calculator','permutation-combination-calculator'],
  'mean-median-mode-calculator': ['statistics-calculator','standard-deviation-calculator','probability-calculator','scientific-calculator','percentage-calculator'],
  'geometry-calculator': ['triangle-calculator','circle-calculator','area-calculator','volume-calculator','scientific-calculator'],
  'triangle-calculator': ['geometry-calculator','circle-calculator','area-calculator','trigonometry-calculator','volume-calculator'],
  'circle-calculator': ['geometry-calculator','triangle-calculator','area-calculator','volume-calculator','scientific-calculator'],
  'area-calculator': ['geometry-calculator','triangle-calculator','circle-calculator','volume-calculator','scientific-calculator'],
  'volume-calculator': ['geometry-calculator','area-calculator','triangle-calculator','circle-calculator','unit-converter'],
  'unit-converter': ['speed-distance-time-calculator','age-calculator','date-difference-calculator','time-calculator','percentage-calculator'],
  'age-calculator': ['date-difference-calculator','time-calculator','unit-converter','percentage-calculator','bmi-calculator'],
  'date-difference-calculator': ['age-calculator','time-calculator','unit-converter','percentage-calculator','speed-distance-time-calculator'],
  'time-calculator': ['speed-distance-time-calculator','age-calculator','date-difference-calculator','unit-converter','percentage-calculator'],
  'speed-distance-time-calculator': ['unit-converter','time-calculator','date-difference-calculator','scientific-calculator','percentage-calculator'],
  'bmi-calculator': ['percentage-calculator','age-calculator','compound-interest-calculator','unit-converter','statistics-calculator'],
  'compound-interest-calculator': ['simple-interest-calculator','loan-payment-calculator','percentage-calculator','scientific-calculator','bmi-calculator'],
  'simple-interest-calculator': ['compound-interest-calculator','loan-payment-calculator','percentage-calculator','scientific-calculator','bmi-calculator'],
  'loan-payment-calculator': ['compound-interest-calculator','simple-interest-calculator','percentage-calculator','scientific-calculator','bmi-calculator'],
  'gpa-calculator': ['percentage-calculator','statistics-calculator','mean-median-mode-calculator','scientific-calculator','bmi-calculator'],
  'permutation-combination-calculator': ['factorial-calculator','probability-calculator','statistics-calculator','matrix-calculator','scientific-calculator'],
  'factorial-calculator': ['permutation-combination-calculator','probability-calculator','scientific-calculator','exponent-power-calculator','statistics-calculator'],
  'exponent-power-calculator': ['logarithm-calculator','scientific-calculator','trigonometry-calculator','quadratic-equation-calculator','factorial-calculator'],
  'logarithm-calculator': ['exponent-power-calculator','scientific-calculator','trigonometry-calculator','statistics-calculator','compound-interest-calculator'],
  'trigonometry-calculator': ['scientific-calculator','logarithm-calculator','exponent-power-calculator','triangle-calculator','geometry-calculator'],
};

function relatedHTML(slug) {
  const related = relatedMap[slug] || [];
  const items = related.map(r => {
    const c = calcs.find(x => x.slug === r);
    if (!c) return '';
    return `<a href="/pages/${c.slug}.html" class="related-card"><span class="icon">${c.icon}</span><span class="name">${c.name}</span></a>`;
  }).join('\n          ');
  return `<div class="related-grid">
          ${items}
        </div>`;
}

// ── Generate each page ──
function genPage(c, content) {
  return `${headHTML(c)}
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  ${headerHTML()}
  <main id="main" class="page">
    <div class="content-container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span class="sep">›</span>
        <a href="/#${c.catAnchor}">${c.cat}</a><span class="sep">›</span>
        <span>${c.name}</span>
      </nav>
      <div class="page-header">
        <h1>${c.name}</h1>
        <p class="lead">${content.lead}</p>
      </div>
${content.calc}
${content.sections}
      <section class="content-section">
        <h2>Related Calculators</h2>
        ${relatedHTML(c.slug)}
      </section>
    </div>
  </main>
  ${footerHTML}
  <script src="/js/main.js"></script>
  <script src="/js/${c.jsFile}"></script>
</body>
</html>`;
}

// ── FAQ helper ──
function faqHTML(items) {
  return items.map(q => `        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">${q.q} <span class="chevron">▾</span></button>
          <div class="faq-answer"><div class="faq-answer-inner">${q.a}</div></div>
        </div>`).join('\n');
}

// ── Formula box helper ──
function formulaBox(formula, legend) {
  let html = `      <div class="formula-box">\n        <div class="formula">${formula}</div>\n      </div>`;
  if (legend) {
    html += `\n      <div class="formula-legend">\n${legend.map(l => `        <span>${l}</span>`).join('\n')}\n      </div>`;
  }
  return html;
}

// ── Example box helper ──
function exampleBox(title, steps) {
  return `      <div class="example-box">
        <h4>${title}</h4>
${steps.map((s, i) => `        <div class="example-step"><strong>${s[0]}</strong> ${s[1]}</div>`).join('\n')}
      </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT GENERATORS — each returns { lead, calc, sections }
// ═══════════════════════════════════════════════════════════════════════════

const contentGen = {};

// ── 1. Scientific Calculator ──
contentGen.scientific = {
  lead: 'A full-featured scientific calculator in your browser — trigonometric functions, logarithms, powers, roots, factorial, constants π and e, degree/radian modes, parentheses, memory and a running history of your calculations.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">🧮</span> Scientific Calculator</div>
        <div class="sci-calc">
          <div class="sci-display" id="sciDisplay">
            <div class="mode-indicator" id="sciModeIndicator">DEG | M: 0</div>
            <div class="expr" id="sciExpr">&nbsp;</div>
            <div class="result" id="sciResult">0</div>
          </div>
          <div class="sci-keypad" id="sciKeypad"></div>
          <div class="sci-history" id="sciHistory"></div>
        </div>
        <div class="error-msg" id="sciError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is a Scientific Calculator?</h2>
        <p>A scientific calculator handles operations beyond basic arithmetic — trigonometric functions (sine, cosine, tangent and their inverses), logarithms (base 10 and natural), exponentials, powers and roots, factorials, constants such as π and e, and the use of parentheses to control the order of operations. Unlike a basic four-function calculator, a scientific calculator understands mathematical precedence and lets you build up complex expressions before evaluating them.</p>
        <p>This online scientific calculator runs entirely in your browser using JavaScript. It evaluates expressions with the same operator precedence you would use on paper, supports both degree and radian modes for trigonometric functions, and keeps a history of your previous calculations so you can review or reuse them.</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>When you press the equals button, the calculator takes the expression you have built up and evaluates it in several stages:</p>
        <ol>
          <li><strong>Tokenising</strong> — the expression string is broken into numbers, operators, function names and parentheses.</li>
          <li><strong>Substitution</strong> — function names like <code>sin</code>, <code>cos</code>, <code>log</code> and <code>ln</code> are replaced with their JavaScript equivalents, adjusted for the current angle mode (degrees or radians).</li>
          <li><strong>Constant insertion</strong> — the symbols π and e are replaced with their numeric values.</li>
          <li><strong>Evaluation</strong> — the cleaned expression is evaluated using JavaScript's arithmetic engine, which respects standard operator precedence.</li>
          <li><strong>Formatting</strong> — the result is rounded to avoid floating-point artefacts and displayed.</li>
        </ol>
        <p>Memory functions (M+, M−, MR, MC) let you store a value, add to or subtract from it, recall it, and clear it. The mode indicator shows whether the calculator is in degree or radian mode and the current memory value.</p>
      </section>
      <section class="content-section">
        <h2>Key Functions and Formulas</h2>
        ${formulaBox('sin(x), cos(x), tan(x) — trigonometric functions')}
        ${formulaBox('sin⁻¹(x), cos⁻¹(x), tan⁻¹(x) — inverse trigonometric functions')}
        ${formulaBox('log(x) = log₁₀(x), &nbsp; ln(x) = logₑ(x)')}
        ${formulaBox('n! = n × (n−1) × (n−2) × … × 1')}
        ${formulaBox('π ≈ 3.141592653589793, &nbsp; e ≈ 2.718281828459045', [
          '<code>π</code> — ratio of circumference to diameter',
          '<code>e</code> — base of natural logarithms',
          '<code>DEG</code> — degree mode',
          '<code>RAD</code> — radian mode'
        ])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Trigonometric calculation in degrees', [
          ['Input:', 'sin(30) + cos(60), in DEG mode'],
          ['Substitution:', 'sin(30°) = 0.5, cos(60°) = 0.5'],
          ['Calculation:', '0.5 + 0.5 = 1.0'],
          ['Result:', '1']
        ])}
        ${exampleBox('Example 2: Using logarithms and powers', [
          ['Input:', 'log(1000) + 2^5'],
          ['Substitution:', 'log₁₀(1000) = 3, 2⁵ = 32'],
          ['Calculation:', '3 + 32 = 35'],
          ['Result:', '35']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Scientific Calculators</h2>
        <p>The history of scientific calculators stretches from mechanical adding machines to the pocket-sized electronic devices of the 1970s and on to the software calculators that run on every smartphone today.</p>
        <p>The earliest mechanical calculator was built by Blaise Pascal in 1642 — the Pascaline, which could add and subtract. Gottfried Wilhelm Leibniz improved on this in 1673 with his Stepped Reckoner, which could also multiply and divide. These machines were large, expensive and limited to arithmetic.</p>
        <p>The first true scientific calculator was the Hewlett-Packard HP-35, introduced in 1972. It was the first handheld calculator capable of trigonometric and logarithmic functions, and it replaced the slide rule for an entire generation of engineers. It used Reverse Polish Notation (RPN), a system that eliminated the need for parentheses by placing operators after their operands.</p>
        <p>Throughout the 1970s and 1980s, scientific calculators became smaller, cheaper and more capable. Texas Instruments introduced the TI-30 series in 1976, making scientific calculation affordable for students. Graphing calculators appeared in the late 1980s, led by Casio's fx-7000G (1985). Today, software calculators on computers and phones can match or exceed the functionality of any hardware scientific calculator.</p>
      </section>
      <section class="content-section">
        <h2>Where Scientific Calculators Are Used</h2>
        <ul>
          <li><strong>Education:</strong> Secondary school and university mathematics, physics, chemistry and engineering courses.</li>
          <li><strong>Engineering:</strong> Circuit design, structural analysis, signal processing and control systems.</li>
          <li><strong>Physics:</strong> Wave calculations, quantum mechanics formulas and kinematic equations.</li>
          <li><strong>Finance:</strong> Bond yield calculations, exponential growth models and logarithmic transformations.</li>
          <li><strong>Everyday problem-solving:</strong> Any calculation involving powers, roots, trigonometry or logarithms.</li>
        </ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul>
          <li>Handles complex expressions with proper operator precedence.</li>
          <li>Supports both degree and radian angle modes for flexibility.</li>
          <li>Memory functions allow intermediate results to be stored and reused.</li>
          <li>Calculation history lets you review and reuse previous results.</li>
          <li>Constants π and e are built in, avoiding manual entry of long decimal values.</li>
        </ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul>
          <li>Floating-point arithmetic can produce tiny rounding errors in edge cases (e.g., sin(π) returning a very small number instead of exactly zero).</li>
          <li>Factorial is limited to non-negative integers and very large values will overflow to Infinity.</li>
          <li>The calculator does not support symbolic algebra — it evaluates numerically, not symbolically.</li>
          <li>Inverse trigonometric functions return principal values only.</li>
        </ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'How do I switch between degrees and radians?', a:'Press the DEG/RAD toggle button. The mode indicator at the top of the display will show which mode is active. Trigonometric functions interpret their input according to the current mode, and inverse trigonometric functions return results in the current mode.'},
          {q:'What is the difference between log and ln?', a:'The <code>log</code> button computes the base-10 logarithm (log₁₀), which is the common logarithm used in science for pH, decibels and the Richter scale. The <code>ln</code> button computes the natural logarithm (logₑ), which uses Euler\'s number e ≈ 2.71828 as the base and appears throughout calculus and continuous growth models.'},
          {q:'How do the memory functions work?', a:'M+ adds the current result to memory, M− subtracts it, MR recalls the stored value into the display, and MC clears memory to zero. The mode indicator shows the current memory value so you always know what is stored.'},
          {q:'Why does sin(180) not equal exactly zero in degree mode?', a:'JavaScript uses floating-point arithmetic, which cannot represent π exactly. When the calculator converts 180 degrees to radians and computes the sine, a tiny rounding error can produce a result like 1.22 × 10⁻¹⁶ instead of exactly zero. This is a normal feature of floating-point computation, not a bug.'},
          {q:'Can I use parentheses in my expressions?', a:'Yes. Parentheses are fully supported and follow standard mathematical precedence. You can nest them as deeply as you need. For example, <code>(2 + 3) × (4 − 1)</code> evaluates to 15, not 5, because the parenthesised groups are evaluated first.'},
          {q:'Is there a keyboard shortcut for the equals button?', a:'Yes — pressing the Enter key on your keyboard triggers the equals function, the Escape key clears the display, and the Backspace key removes the last character. Number keys and operator keys also work directly from your keyboard.'}
        ])}
      </section>`
};

// ── 2. Percentage Calculator ──
contentGen.percentage = {
  lead: 'Work out any percentage problem in seconds — find a percentage of a number, calculate increases and decreases, compare two values with percentage difference, or reverse-engineer the original value from a percentage change.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">％</span> Percentage Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="pct-of">X% of Y</button>
          <button class="calc-tab" data-tab="pct-is">X is what % of Y</button>
          <button class="calc-tab" data-tab="pct-inc">% Increase</button>
          <button class="calc-tab" data-tab="pct-dec">% Decrease</button>
          <button class="calc-tab" data-tab="pct-diff">% Difference</button>
          <button class="calc-tab" data-tab="pct-orig">Original Value</button>
        </div>
        <div class="calc-tab-panel active" id="pct-of">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctOfPct">Percentage</label><input type="number" class="form-control" id="pctOfPct" placeholder="e.g. 15" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctOfVal">Of value</label><input type="number" class="form-control" id="pctOfVal" placeholder="e.g. 200" step="any" /></div>
            <div class="form-group"><button class="btn btn-primary" id="pctOfBtn">Calculate</button> <button class="btn btn-ghost" id="pctOfReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctOfResult"></div>
          <div class="error-msg" id="pctOfError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="pct-is">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctIsX">Value X</label><input type="number" class="form-control" id="pctIsX" placeholder="e.g. 30" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctIsY">Of value Y</label><input type="number" class="form-control" id="pctIsY" placeholder="e.g. 150" step="any" /></div>
            <div class="form-group"><button class="btn btn-primary" id="pctIsBtn">Calculate</button> <button class="btn btn-ghost" id="pctIsReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctIsResult"></div>
          <div class="error-msg" id="pctIsError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="pct-inc">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctIncOld">Original value</label><input type="number" class="form-control" id="pctIncOld" placeholder="e.g. 80" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctIncNew">New value</label><input type="number" class="form-control" id="pctIncNew" placeholder="e.g. 100" step="any" /></div>
            <div class="form-group"><button class="btn btn-primary" id="pctIncBtn">Calculate</button> <button class="btn btn-ghost" id="pctIncReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctIncResult"></div>
          <div class="error-msg" id="pctIncError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="pct-dec">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctDecOld">Original value</label><input type="number" class="form-control" id="pctDecOld" placeholder="e.g. 100" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctDecNew">New value</label><input type="number" class="form-control" id="pctDecNew" placeholder="e.g. 80" step="any" /></div>
            <div class="form-group"><button class="btn btn-primary" id="pctDecBtn">Calculate</button> <button class="btn btn-ghost" id="pctDecReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctDecResult"></div>
          <div class="error-msg" id="pctDecError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="pct-diff">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctDiffA">Value A</label><input type="number" class="form-control" id="pctDiffA" placeholder="e.g. 40" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctDiffB">Value B</label><input type="number" class="form-control" id="pctDiffB" placeholder="e.g. 60" step="any" /></div>
            <div class="form-group"><button class="btn btn-primary" id="pctDiffBtn">Calculate</button> <button class="btn btn-ghost" id="pctDiffReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctDiffResult"></div>
          <div class="error-msg" id="pctDiffError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="pct-orig">
          <div class="form-inline">
            <div class="form-group"><label class="form-label" for="pctOrigFinal">Final value</label><input type="number" class="form-control" id="pctOrigFinal" placeholder="e.g. 120" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctOrigPct">Percentage change</label><input type="number" class="form-control" id="pctOrigPct" placeholder="e.g. 20" step="any" /></div>
            <div class="form-group"><label class="form-label" for="pctOrigType">Change type</label><select class="form-control" id="pctOrigType"><option value="increase">Increase</option><option value="decrease">Decrease</option></select></div>
            <div class="form-group"><button class="btn btn-primary" id="pctOrigBtn">Calculate</button> <button class="btn btn-ghost" id="pctOrigReset">Clear</button></div>
          </div>
          <div class="result-area" id="pctOrigResult"></div>
          <div class="error-msg" id="pctOrigError" role="alert"></div>
        </div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is a Percentage?</h2>
        <p>A percentage expresses a number as a fraction of 100. The word comes from the Latin <em>per centum</em>, meaning "by the hundred." When you say "15 per cent," you are saying 15 out of every 100 — or 15/100, which equals 0.15. Percentages provide a standardised way to compare proportions, changes and rates without being tied to any particular base unit.</p>
        <p>Percentages are used everywhere: discounts in shops, interest rates on loans, tax rates, exam scores, survey results, battery levels and data dashboards. Understanding how to calculate them — and how they can mislead — is one of the most practically useful mathematical skills in everyday life.</p>
      </section>
      <section class="content-section">
        <h2>How the Percentage Calculator Works</h2>
        <p>Each tab handles a different percentage problem. The calculator validates inputs, selects the appropriate formula, substitutes your values, performs the arithmetic and displays the result with a breakdown of the working.</p>
      </section>
      <section class="content-section">
        <h2>Percentage Formulas</h2>
        ${formulaBox('X% of Y = (X / 100) × Y')}
        ${formulaBox('X is what % of Y = (X / Y) × 100')}
        ${formulaBox('% Increase = ((New − Original) / Original) × 100')}
        ${formulaBox('% Decrease = ((Original − New) / Original) × 100')}
        ${formulaBox('% Difference = |A − B| / ((A + B) / 2) × 100')}
        ${formulaBox('Original = Final / (1 ± P/100)', [
          '<code>X, Y</code> — input values',
          '<code>P</code> — percentage',
          '<code>|A−B|</code> — absolute difference'
        ])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Finding 15% of 200', [
          ['Input:', 'Percentage = 15, Value = 200'],
          ['Formula:', '(15 / 100) × 200'],
          ['Substitution:', '0.15 × 200'],
          ['Result:', '30']
        ])}
        ${exampleBox('Example 2: Percentage increase from 80 to 100', [
          ['Input:', 'Original = 80, New = 100'],
          ['Formula:', '((100 − 80) / 80) × 100'],
          ['Substitution:', '(20 / 80) × 100'],
          ['Result:', '25% increase']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Percentage Calculations</h2>
        <p>The concept of expressing quantities as parts of a hundred dates back to ancient Rome, where taxes were often calculated as fractions of 100 (the <em>centesima</em>, or "hundredth part"). The Arabic mathematical tradition further developed proportional reasoning during the medieval period.</p>
        <p>The familiar percent sign "%" evolved gradually from an abbreviation for the Italian <em>per cento</em> — "per hundred" — in the 15th century. Merchants and scribes wrote "p 100" or "p cento," and over time the abbreviation was contracted. By the 17th century, the modern "%" symbol, formed by the two zeros of "cento" separated by a slash, had become standard in European commercial documents.</p>
        <p>Percentages became essential with the growth of banking, trade and taxation in Renaissance Italy and the Low Countries. Double-entry bookkeeping, described by Luca Pacioli in 1494, relied heavily on proportional calculations. The industrial revolution and the rise of statistics in the 19th century made percentages a universal language for data communication.</p>
      </section>
      <section class="content-section">
        <h2>Where Percentages Are Used</h2>
        <ul>
          <li><strong>Shopping:</strong> Discounts, sales tax, tips and price comparisons.</li>
          <li><strong>Finance:</strong> Interest rates, investment returns, loan APRs and inflation.</li>
          <li><strong>Education:</strong> Exam scores, grade boundaries and pass rates.</li>
          <li><strong>Statistics:</strong> Survey results, polling margins and demographic breakdowns.</li>
          <li><strong>Business:</strong> Profit margins, growth rates, market share and KPIs.</li>
        </ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Provides a standardised scale for comparison regardless of the original units.</li><li>Intuitive — most people understand "20% off" more readily than "0.2 reduction."</li><li>Essential for financial literacy and everyday consumer decisions.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Percentages can be misleading without context — a "100% increase" means doubling, not multiplying by 100.</li><li>Percentage change is not symmetric: increasing from 50 to 100 is a 100% increase, but decreasing from 100 to 50 is only a 50% decrease.</li><li>Percentage difference uses the average as a base, which can produce unexpected results when the two values are very different in magnitude.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What is the difference between percentage increase and percentage difference?', a:'Percentage increase compares a new value to a specific original value — it has a clear "before" and "after." Percentage difference compares two values without a defined starting point, using their average as the base. Use percentage increase when you know which value came first; use percentage difference when neither is the "original."'},
          {q:'How do I find the original price before a percentage increase?', a:'Use the "Original Value" tab. Enter the final price and the percentage increase, and the calculator divides by (1 + P/100) to recover the original. For example, if a price is £120 after a 20% increase, the original was 120 / 1.2 = £100.'},
          {q:'Why does a 50% increase followed by a 50% decrease not return to the original?', a:'Because each percentage change applies to a different base. Starting at 100, a 50% increase gives 150. A 50% decrease from 150 gives 75, not 100. The decrease is 50% of 150 (which is 75), not 50% of the original 100.'},
          {q:'Can percentages be greater than 100%?', a:'Yes. A percentage greater than 100% means the part exceeds the whole. For example, if revenue grows from £1m to £2.5m, that is a 150% increase — the new revenue is 250% of the original.'},
          {q:'What does "percentage points" mean?', a:'Percentage points measure the arithmetic difference between two percentages. If an interest rate rises from 3% to 5%, that is a 2 percentage point increase, but a 66.7% relative increase (the 2-point rise divided by the original 3%).'}
        ])}
      </section>`
};

// ── 3. Fraction Calculator ──
contentGen.fraction = {
  lead: 'Add, subtract, multiply and divide fractions and mixed numbers with full step-by-step working. The calculator finds common denominators, simplifies results and converts between fractions, mixed numbers and decimals.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">½</span> Fraction Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="frac-calc">Calculate</button>
          <button class="calc-tab" data-tab="frac-simplify">Simplify</button>
          <button class="calc-tab" data-tab="frac-convert">Convert</button>
        </div>
        <div class="calc-tab-panel active" id="frac-calc">
          <div class="form-row">
            <div class="form-group"><label class="form-label" for="frac1Whole">First — whole (optional)</label><input type="number" class="form-control" id="frac1Whole" placeholder="0" step="1" /></div>
            <div class="form-group"><label class="form-label" for="frac1Num">Numerator</label><input type="number" class="form-control" id="frac1Num" placeholder="e.g. 3" step="any" /></div>
            <div class="form-group"><label class="form-label" for="frac1Den">Denominator</label><input type="number" class="form-control" id="frac1Den" placeholder="e.g. 4" step="any" /></div>
          </div>
          <div class="form-group"><label class="form-label" for="fracOp">Operation</label><select class="form-control" id="fracOp"><option value="+">Add (+)</option><option value="-">Subtract (−)</option><option value="*">Multiply (×)</option><option value="/">Divide (÷)</option></select></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label" for="frac2Whole">Second — whole (optional)</label><input type="number" class="form-control" id="frac2Whole" placeholder="0" step="1" /></div>
            <div class="form-group"><label class="form-label" for="frac2Num">Numerator</label><input type="number" class="form-control" id="frac2Num" placeholder="e.g. 1" step="any" /></div>
            <div class="form-group"><label class="form-label" for="frac2Den">Denominator</label><input type="number" class="form-control" id="frac2Den" placeholder="e.g. 2" step="any" /></div>
          </div>
          <div class="form-inline"><button class="btn btn-primary" id="fracCalcBtn">Calculate</button><button class="btn btn-ghost" id="fracCalcReset">Clear</button></div>
          <div class="result-area" id="fracCalcResult"></div>
          <div class="error-msg" id="fracCalcError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="frac-simplify">
          <div class="form-row">
            <div class="form-group"><label class="form-label" for="simpNum">Numerator</label><input type="number" class="form-control" id="simpNum" placeholder="e.g. 12" step="any" /></div>
            <div class="form-group"><label class="form-label" for="simpDen">Denominator</label><input type="number" class="form-control" id="simpDen" placeholder="e.g. 18" step="any" /></div>
          </div>
          <div class="form-inline"><button class="btn btn-primary" id="simpBtn">Simplify</button><button class="btn btn-ghost" id="simpReset">Clear</button></div>
          <div class="result-area" id="simpResult"></div>
          <div class="error-msg" id="simpError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="frac-convert">
          <div class="form-group"><label class="form-label" for="convInput">Enter a decimal or fraction (e.g. 3.75 or 7/4)</label><input type="text" class="form-control" id="convInput" placeholder="e.g. 3.75 or 7/4" /></div>
          <div class="form-inline"><button class="btn btn-primary" id="convBtn">Convert</button><button class="btn btn-ghost" id="convReset">Clear</button></div>
          <div class="result-area" id="convResult"></div>
          <div class="error-msg" id="convError" role="alert"></div>
        </div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is a Fraction?</h2>
        <p>A fraction represents a part of a whole. It consists of a numerator (the top number, which says how many parts you have) and a denominator (the bottom number, which says how many equal parts the whole is divided into). For example, <strong>3/4</strong> means three out of four equal parts.</p>
        <p>A <strong>proper fraction</strong> has a numerator smaller than its denominator (like 3/4). An <strong>improper fraction</strong> has a numerator larger than or equal to its denominator (like 7/4). A <strong>mixed number</strong> combines a whole number and a proper fraction (like 1¾, which equals 7/4). Every improper fraction can be written as a mixed number and vice versa.</p>
      </section>
      <section class="content-section">
        <h2>How the Fraction Calculator Works</h2>
        <p>When you enter two fractions and choose an operation, the calculator parses each input (converting mixed numbers to improper fractions if needed), validates denominators, performs the operation (finding a common denominator for addition and subtraction, or applying the multiply-across or invert-and-multiply rule for multiplication and division), simplifies the result by dividing by the GCD, and displays the result as a simplified fraction, mixed number and decimal.</p>
      </section>
      <section class="content-section">
        <h2>Fraction Formulas</h2>
        ${formulaBox('a/b + c/d = (a×d + c×b) / (b×d)')}
        ${formulaBox('a/b − c/d = (a×d − c×b) / (b×d)')}
        ${formulaBox('a/b × c/d = (a×c) / (b×d)')}
        ${formulaBox('a/b ÷ c/d = (a×d) / (b×c)', ['<code>a, c</code> — numerators', '<code>b, d</code> — denominators'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Adding 3/4 + 1/2', [
          ['Input:', '3/4 + 1/2'],
          ['Common denominator:', 'LCM(4, 2) = 4'],
          ['Convert:', '3/4 stays as 3/4; 1/2 becomes 2/4'],
          ['Add:', '(3 + 2) / 4 = 5/4'],
          ['Simplify:', '5/4 = 1¼ (mixed number) = 1.25 (decimal)']
        ])}
        ${exampleBox('Example 2: Multiplying 2/3 × 3/5', [
          ['Input:', '2/3 × 3/5'],
          ['Multiply numerators:', '2 × 3 = 6'],
          ['Multiply denominators:', '3 × 5 = 15'],
          ['Result:', '6/15'],
          ['Simplify:', 'GCD(6, 15) = 3, so 6/15 = 2/5 = 0.4']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Fractions</h2>
        <p>Fractions are among the oldest mathematical concepts. The ancient Egyptians used <strong>unit fractions</strong> — fractions with a numerator of 1 — as early as 1800 BCE. The Rhind Mathematical Papyrus, dating to around 1550 BCE, contains tables for expressing fractions like 2/5 as sums of unit fractions (1/3 + 1/15). This system was practical for division of grain and land but cumbersome for general calculation.</p>
        <p>The Babylonians took a different approach, using a sexagesimal (base-60) system that naturally represented fractions with denominators of 60, 3600 and so on. This is why we still divide hours into 60 minutes and minutes into 60 seconds.</p>
        <p>The modern notation of a horizontal bar separating numerator and denominator was introduced by the Indian mathematician Brahmagupta in the 7th century and transmitted to Europe through Arabic mathematical texts. Fibonacci's <em>Liber Abaci</em> (1202) helped popularise the Hindu-Arabic numeral system, including fractions, in Europe. The word "fraction" comes from the Latin <em>frangere</em>, meaning "to break."</p>
      </section>
      <section class="content-section">
        <h2>Where Fractions Are Used</h2>
        <ul><li><strong>Cooking:</strong> Recipes use fractional measurements (½ cup, ¼ teaspoon) that often need scaling.</li><li><strong>Carpentry and construction:</strong> Measurements in inches are naturally fractional (3/8", 1/16").</li><li><strong>Music:</strong> Time signatures (3/4, 6/8) and note durations are fractional.</li><li><strong>Finance:</strong> Stock prices were historically quoted in fractions.</li><li><strong>Education:</strong> Fractions are foundational for algebra, ratios, probability and proportional reasoning.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Fractions give exact answers, unlike decimals which may need rounding.</li><li>They are natural for expressing ratios and proportions.</li><li>Working with fractions builds number sense and algebraic reasoning.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Calculations with fractions can produce large intermediate numbers before simplification.</li><li>Not all fractions convert neatly to decimals (e.g., 1/3 = 0.333…).</li><li>Comparing fractions requires finding a common denominator or cross-multiplying.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'How do I add fractions with different denominators?', a:'You need a common denominator first. Find the least common multiple (LCM) of the two denominators. Convert each fraction so its denominator equals the LCM, then add the numerators and keep the denominator the same. For example, 1/3 + 1/4: the LCM of 3 and 4 is 12, so 4/12 + 3/12 = 7/12.'},
          {q:'Why do we flip the second fraction when dividing?', a:'Dividing by a fraction is the same as multiplying by its reciprocal. This works because division is the inverse of multiplication: a/b ÷ c/d = a/b × d/c. The reciprocal (flipping) converts the division into a multiplication, which is simpler to compute.'},
          {q:'What is a mixed number and when should I use one?', a:'A mixed number combines a whole number and a proper fraction, like 2⅓. It is useful for everyday measurements where you want to express quantities intuitively (2⅓ cups of flour is easier to visualise than 7/3 cups). In mathematical calculations, improper fractions (7/3) are usually easier to work with.'},
          {q:'How does the calculator simplify fractions?', a:'After performing the operation, the calculator finds the greatest common divisor (GCD) of the numerator and denominator using the Euclidean algorithm, then divides both by that GCD. For example, 6/15: GCD(6, 15) = 3, so the simplified form is 2/5.'},
          {q:'Can I enter negative fractions?', a:'Yes. Enter a negative sign in the numerator or denominator field. The calculator handles negative fractions correctly and follows the standard sign rules: a negative times a positive is negative, and a negative times a negative is positive.'},
          {q:'Why can\'t the denominator be zero?', a:'Division by zero is undefined in mathematics. A fraction with denominator zero would mean dividing something into zero equal parts, which is not a meaningful operation. The calculator will display an error message if you enter zero as a denominator.'}
        ])}
      </section>`
};

// ── 4. Quadratic Equation Calculator ──
contentGen.quadratic = {
  lead: 'Solve any quadratic equation of the form ax² + bx + c = 0 in seconds. The calculator applies the quadratic formula, analyses the discriminant to determine the nature of the roots, and shows every step of the working — whether the answer is two real roots, one repeated root, or a pair of complex conjugate roots.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">x²</span> Solve ax² + bx + c = 0</div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label" for="quadA">Coefficient a</label><input type="number" class="form-control" id="quadA" placeholder="e.g. 1" step="any" /></div>
          <div class="form-group"><label class="form-label" for="quadB">Coefficient b</label><input type="number" class="form-control" id="quadB" placeholder="e.g. -5" step="any" /></div>
          <div class="form-group"><label class="form-label" for="quadC">Coefficient c</label><input type="number" class="form-control" id="quadC" placeholder="e.g. 6" step="any" /></div>
        </div>
        <div class="form-inline"><button class="btn btn-primary" id="quadBtn">Solve</button><button class="btn btn-ghost" id="quadReset">Clear</button></div>
        <div class="result-area" id="quadResult"></div>
        <div class="error-msg" id="quadError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is a Quadratic Equation?</h2>
        <p>A quadratic equation is a second-degree polynomial equation in one variable, written in the standard form <strong>ax² + bx + c = 0</strong>, where <em>a</em>, <em>b</em> and <em>c</em> are real numbers and <em>a ≠ 0</em>. The highest power of the variable is 2, which is what makes it "quadratic" (from the Latin <em>quadratus</em>, meaning "square").</p>
        <p>The solutions to a quadratic equation are called <strong>roots</strong>. A quadratic equation always has exactly two roots (counting multiplicity), which can be two distinct real numbers, one repeated real number, or a pair of complex conjugate numbers. The nature of the roots is determined by the <strong>discriminant</strong>, Δ = b² − 4ac.</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>The calculator validates that all three coefficients are valid numbers and that <em>a</em> is not zero, computes the discriminant Δ = b² − 4ac to determine the nature of the roots, applies the quadratic formula x = (−b ± √Δ) / (2a), classifies the result based on the sign of Δ, and displays the full substitution and calculation step by step.</p>
      </section>
      <section class="content-section">
        <h2>The Quadratic Formula</h2>
        ${formulaBox('x = (−b ± √(b² − 4ac)) / 2a')}
        ${formulaBox('Δ = b² − 4ac', [
          '<code>a</code> — coefficient of x² (must not be 0)',
          '<code>b</code> — coefficient of x',
          '<code>c</code> — constant term',
          '<code>Δ</code> — discriminant'
        ])}
        <p>The sign of the discriminant tells us everything about the roots before we even compute them:</p>
        <ul>
          <li><strong>Δ > 0:</strong> Two distinct real roots. The parabola crosses the x-axis at two points.</li>
          <li><strong>Δ = 0:</strong> One repeated real root. The parabola touches the x-axis at exactly one point (its vertex).</li>
          <li><strong>Δ < 0:</strong> Two complex conjugate roots. The parabola does not cross the x-axis.</li>
        </ul>
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Two real roots — x² − 5x + 6 = 0', [
          ['Input:', 'a = 1, b = −5, c = 6'],
          ['Discriminant:', 'Δ = (−5)² − 4(1)(6) = 25 − 24 = 1'],
          ['Since Δ > 0:', 'Two distinct real roots'],
          ['Apply formula:', 'x = (5 ± √1) / 2 = (5 ± 1) / 2'],
          ['Root 1:', 'x = (5 + 1) / 2 = 3'],
          ['Root 2:', 'x = (5 − 1) / 2 = 2']
        ])}
        ${exampleBox('Example 2: Complex roots — x² + 2x + 5 = 0', [
          ['Input:', 'a = 1, b = 2, c = 5'],
          ['Discriminant:', 'Δ = 2² − 4(1)(5) = 4 − 20 = −16'],
          ['Since Δ < 0:', 'Two complex conjugate roots'],
          ['Apply formula:', 'x = (−2 ± √(−16)) / 2 = (−2 ± 4i) / 2'],
          ['Root 1:', 'x = −1 + 2i'],
          ['Root 2:', 'x = −1 − 2i']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Quadratic Equations</h2>
        <p>The study of quadratic equations spans thousands of years. The earliest known solutions date to ancient Babylon (around 2000 BCE), where clay tablets show methods for solving problems equivalent to quadratic equations. Babylonian mathematicians used a geometric approach, completing the square literally — by rearranging shapes.</p>
        <p>The Greek mathematician Euclid described a geometric method for solving quadratics in his <em>Elements</em> (around 300 BCE). The Indian mathematician Brahmagupta (628 CE) was the first to give an explicit general formula for solving quadratic equations, recognising that <em>a</em> could be negative and that two roots might exist.</p>
        <p>The word "algebra" itself comes from the title of a book by the Persian mathematician al-Khwarizmi, <em>Al-Kitab al-mukhtasar fi hisab al-jabr wa'l-muqabala</em> (c. 820 CE). Al-Khwarizmi's methods for solving quadratic equations were systematic and complete, covering all cases with positive roots. His work was translated into Latin in the 12th century and became the foundation of European algebra.</p>
        <p>The modern quadratic formula, which works for all cases including negative and complex roots, was made possible by the acceptance of negative numbers and complex numbers in the 16th and 17th centuries. The Italian mathematician Girolamo Cardano published methods for solving cubic and quartic equations in 1545, which implicitly required understanding complex roots of quadratics.</p>
      </section>
      <section class="content-section">
        <h2>Where Quadratic Equations Are Used</h2>
        <ul><li><strong>Physics:</strong> Projectile motion — the height of a thrown object follows a quadratic equation in time.</li><li><strong>Engineering:</strong> Beam deflection, antenna design and signal processing.</li><li><strong>Economics:</strong> Profit optimisation, where revenue and cost functions intersect quadratically.</li><li><strong>Computer graphics:</strong> Ray tracing and intersection calculations with curved surfaces.</li><li><strong>Finance:</strong> Break-even analysis and quadratic models for option pricing.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>The quadratic formula always works — it handles every case, including complex roots.</li><li>The discriminant tells you the nature of the roots before computing them.</li><li>Quadratic models fit many real-world phenomena that have a single maximum or minimum.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Only applies to second-degree equations. Cubic, quartic and higher equations require different methods.</li><li>Floating-point arithmetic can introduce small rounding errors in the discriminant, especially when Δ is near zero.</li><li>The quadratic formula can suffer from catastrophic cancellation when subtracting two nearly equal numbers.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What happens when the discriminant is zero?', a:'When Δ = 0, the equation has exactly one real root (a repeated root). The quadratic formula gives x = −b / (2a) because the ±√0 term vanishes. Geometrically, the parabola touches the x-axis at its vertex but does not cross it.'},
          {q:'What are complex roots and what do they mean?', a:'When the discriminant is negative, the square root of a negative number introduces the imaginary unit i (where i² = −1). The two roots are complex conjugates: x = (−b ± i√|Δ|) / (2a). Geometrically, this means the parabola does not cross the x-axis. Complex roots are important in engineering, signal processing and control theory.'},
          {q:'Why can\'t a be zero in a quadratic equation?', a:'If a = 0, the equation becomes bx + c = 0, which is linear, not quadratic. The quadratic formula divides by 2a, which would be division by zero. Use the Algebra Calculator for linear equations instead.'},
          {q:'Can I solve quadratics by factoring instead?', a:'Yes, when the roots are rational numbers, factoring is often faster. For example, x² − 5x + 6 = (x − 3)(x − 2), giving roots 3 and 2. However, factoring does not work for all quadratics, while the quadratic formula always works.'},
          {q:'What is completing the square?', a:'Completing the square is an algebraic technique that rewrites ax² + bx + c in the form a(x + d)² + e, which reveals the vertex of the parabola and can be used to derive the quadratic formula. It was originally a geometric method used by ancient mathematicians.'},
          {q:'How do I find the vertex of the parabola?', a:'The vertex of the parabola y = ax² + bx + c is at x = −b / (2a). The y-coordinate is found by substituting this x-value back into the equation. The vertex is the maximum (if a < 0) or minimum (if a > 0) point of the parabola.'}
        ])}
      </section>`
};

// ── 5. Algebra Calculator ──
contentGen.algebra = {
  lead: 'Solve linear equations, quadratic equations and simplify basic algebraic expressions with clear, step-by-step working. The calculator isolates the unknown variable, showing each algebraic manipulation so you can follow exactly how the solution is reached.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">𝑥</span> Algebra Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="alg-linear">Linear Equation</button>
          <button class="calc-tab" data-tab="alg-quad">Quadratic Equation</button>
          <button class="calc-tab" data-tab="alg-simplify">Evaluate Expression</button>
        </div>
        <div class="calc-tab-panel active" id="alg-linear">
          <p class="form-hint" style="margin-bottom: 1rem;">Solve an equation of the form <strong>ax + b = c</strong> for x.</p>
          <div class="form-row-3">
            <div class="form-group"><label class="form-label" for="linA">Coefficient of x (a)</label><input type="number" class="form-control" id="linA" placeholder="e.g. 3" step="any" /></div>
            <div class="form-group"><label class="form-label" for="linB">Constant added (b)</label><input type="number" class="form-control" id="linB" placeholder="e.g. 7" step="any" /></div>
            <div class="form-group"><label class="form-label" for="linC">Right-hand side (c)</label><input type="number" class="form-control" id="linC" placeholder="e.g. 22" step="any" /></div>
          </div>
          <div class="form-inline"><button class="btn btn-primary" id="linBtn">Solve</button><button class="btn btn-ghost" id="linReset">Clear</button></div>
          <div class="result-area" id="linResult"></div>
          <div class="error-msg" id="linError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="alg-quad">
          <p class="form-hint" style="margin-bottom: 1rem;">Solve <strong>ax² + bx + c = 0</strong> using the quadratic formula.</p>
          <div class="form-row-3">
            <div class="form-group"><label class="form-label" for="qaA">Coefficient a</label><input type="number" class="form-control" id="qaA" placeholder="e.g. 1" step="any" /></div>
            <div class="form-group"><label class="form-label" for="qaB">Coefficient b</label><input type="number" class="form-control" id="qaB" placeholder="e.g. -5" step="any" /></div>
            <div class="form-group"><label class="form-label" for="qaC">Coefficient c</label><input type="number" class="form-control" id="qaC" placeholder="e.g. 6" step="any" /></div>
          </div>
          <div class="form-inline"><button class="btn btn-primary" id="qaBtn">Solve</button><button class="btn btn-ghost" id="qaReset">Clear</button></div>
          <div class="result-area" id="qaResult"></div>
          <div class="error-msg" id="qaError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="alg-simplify">
          <p class="form-hint" style="margin-bottom: 1rem;">Evaluate a numeric expression using standard order of operations (PEMDAS).</p>
          <div class="form-group"><label class="form-label" for="simpExpr">Expression</label><input type="text" class="form-control" id="simpExpr" placeholder="e.g. 2*(3+4)^2 - 10/2" /></div>
          <div class="form-inline"><button class="btn btn-primary" id="simpExprBtn">Evaluate</button><button class="btn btn-ghost" id="simpExprReset">Clear</button></div>
          <div class="result-area" id="simpExprResult"></div>
          <div class="error-msg" id="simpExprError" role="alert"></div>
        </div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is Algebra?</h2>
        <p>Algebra is the branch of mathematics in which letters and symbols represent numbers and quantities in equations and formulas. Instead of working with known numbers alone, algebra lets you manipulate unknown quantities — typically represented by letters like <em>x</em>, <em>y</em> or <em>z</em> — to find their values. The core skill of algebra is <strong>solving equations</strong>: using balanced operations to isolate the unknown on one side of the equals sign.</p>
        <p>A <strong>linear equation</strong> is one where the highest power of the variable is 1 (e.g., 3x + 7 = 22). A <strong>quadratic equation</strong> has a variable raised to the power 2 (e.g., x² − 5x + 6 = 0). Linear equations have exactly one solution; quadratic equations have two (which may be real, repeated or complex).</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>For linear equations of the form <strong>ax + b = c</strong>, the calculator subtracts b from both sides (ax = c − b), then divides by a (x = (c − b) / a). If a = 0, it reports that the equation has no unique solution. For quadratic equations, it uses the standard quadratic formula and discriminant. The expression evaluator applies standard order of operations — parentheses first, then exponents, then multiplication and division, then addition and subtraction.</p>
      </section>
      <section class="content-section">
        <h2>Algebraic Formulas</h2>
        ${formulaBox('Linear: ax + b = c → x = (c − b) / a')}
        ${formulaBox('Quadratic: x = (−b ± √(b² − 4ac)) / 2a')}
        ${formulaBox('Distributive: a(b + c) = ab + ac')}
        ${formulaBox('FOIL: (a + b)(c + d) = ac + ad + bc + bd', ['<code>a, b, c</code> — known coefficients', '<code>x</code> — unknown variable'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Solving 3x + 7 = 22', [
          ['Input:', 'a = 3, b = 7, c = 22'],
          ['Step 1:', 'Subtract 7 from both sides: 3x = 22 − 7 = 15'],
          ['Step 2:', 'Divide both sides by 3: x = 15 / 3'],
          ['Result:', 'x = 5']
        ])}
        ${exampleBox('Example 2: Evaluating 2(3 + 4)² − 10 / 2', [
          ['Parentheses:', '(3 + 4) = 7'],
          ['Exponent:', '7² = 49'],
          ['Multiply:', '2 × 49 = 98'],
          ['Divide:', '10 / 2 = 5'],
          ['Subtract:', '98 − 5 = 93']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Algebra</h2>
        <p>The word "algebra" comes from the Arabic <em>al-jabr</em>, a term used in the title of a book written around 820 CE by the Persian mathematician <strong>Muhammad ibn Musa al-Khwarizmi</em>: <em>Al-Kitab al-mukhtasar fi hisab al-jabr wa'l-muqabala</em> ("The Compendious Book on Calculation by Completion and Balancing"). Al-Khwarizmi's work systematically presented methods for solving linear and quadratic equations. The terms <em>al-jabr</em> ("completion" — moving subtracted terms to the other side) and <em>al-muqabala</em> ("balancing" — subtracting the same quantity from both sides) describe two fundamental operations of algebra.</p>
        <p>Al-Khwarizmi's name was Latinised as "Algoritmi," which is the origin of the English word <strong>algorithm</strong>. His book was translated into Latin in the 12th century and became the primary algebra textbook in European universities for centuries.</p>
        <p>Before al-Khwarizmi, Greek mathematicians like Diophantus (c. 250 CE) had worked with equations, and Indian mathematicians like Brahmagupta (628 CE) had developed rules for solving quadratics. The use of letters for unknown quantities was pioneered by François Viète in the late 16th century, and the convention of using x for the unknown was popularised by René Descartes in his <em>La Géométrie</em> (1637).</p>
      </section>
      <section class="content-section">
        <h2>Where Algebra Is Used</h2>
        <ul><li><strong>Education:</strong> Foundation for all higher mathematics, physics and engineering.</li><li><strong>Computer science:</strong> Algorithm design, complexity analysis and cryptography.</li><li><strong>Economics:</strong> Supply and demand models, equilibrium calculations and optimisation.</li><li><strong>Engineering:</strong> Circuit analysis, structural calculations and control systems.</li><li><strong>Everyday life:</strong> Budgeting, unit pricing and any "find the unknown" problem.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Algebra provides a general framework for solving problems with unknown quantities.</li><li>Once an equation is set up, the solution process is mechanical and can be automated.</li><li>Algebraic manipulation skills transfer to calculus, physics and computer science.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>This calculator handles linear and quadratic equations; higher-degree polynomials require different methods.</li><li>The expression evaluator works with numbers, not symbolic variables — it cannot simplify <code>2x + 3x</code> to <code>5x</code>.</li><li>Simultaneous equations (systems with multiple variables) require matrix methods or substitution.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What is the difference between an expression and an equation?', a:'An expression is a combination of numbers and variables without an equals sign, like 2x + 3. An equation includes an equals sign and states that two expressions are equal, like 2x + 3 = 11. Expressions can be evaluated or simplified; equations can be solved for the unknown.'},
          {q:'Why do we do the same operation to both sides of an equation?', a:'An equation is a balance — the two sides are equal. If you add, subtract, multiply or divide both sides by the same amount, the balance is preserved and the equation remains true. This principle is the foundation of all equation solving.'},
          {q:'What does a = 0 mean in a linear equation?', a:'If a = 0, the equation becomes 0x + b = c, which means b = c. If b and c are actually equal, the equation is true for any x (infinitely many solutions). If b and c are not equal, there is no solution.'},
          {q:'What is PEMDAS and why does it matter?', a:'PEMDAS stands for Parentheses, Exponents, Multiplication, Division, Addition, Subtraction — the order in which operations should be performed. Without a standard order, an expression like 2 + 3 × 4 could be interpreted as either 20 or 14. PEMDAS ensures everyone gets the same answer: 14.'},
          {q:'Can this calculator solve systems of equations?', a:'Not directly — this calculator handles one equation at a time. For systems of linear equations with multiple variables, the Matrix Calculator can solve them using matrix inversion.'},
          {q:'How is algebra different from arithmetic?', a:'Arithmetic works with specific numbers. Algebra generalises this by introducing variables (letters representing unknown or changing quantities) and the rules for manipulating them. Algebra lets you express general relationships and solve for unknowns.'}
        ])}
      </section>`
};

// ── 6. Matrix Calculator ──
contentGen.matrix = {
  lead: 'Perform matrix operations including addition, subtraction, multiplication, transpose, determinant and inverse. Enter matrices of up to 3×3 with individual cell input, and the calculator shows each operation with clear results and explanations of the rules involved.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">⊞</span> Matrix Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="mat-add">A + B</button>
          <button class="calc-tab" data-tab="mat-sub">A − B</button>
          <button class="calc-tab" data-tab="mat-mul">A × B</button>
          <button class="calc-tab" data-tab="mat-trans">Transpose</button>
          <button class="calc-tab" data-tab="mat-det">Determinant</button>
          <button class="calc-tab" data-tab="mat-inv">Inverse</button>
        </div>
        <div id="matASection">
          <h4 style="margin-bottom: 0.5rem;">Matrix A</h4>
          <div class="form-inline" style="margin-bottom: 1rem;">
            <div class="form-group"><label class="form-label" for="matARows">Rows</label><select class="form-control" id="matARows"><option value="2">2</option><option value="3">3</option></select></div>
            <div class="form-group"><label class="form-label" for="matACols">Columns</label><select class="form-control" id="matACols"><option value="2">2</option><option value="3">3</option></select></div>
            <div class="form-group"><button class="btn btn-outline btn-sm" id="matABuild">Set dimensions</button></div>
          </div>
          <div id="matAContainer"></div>
        </div>
        <div id="matBSection" style="margin-top: 1.5rem;">
          <h4 style="margin-bottom: 0.5rem;">Matrix B</h4>
          <div class="form-inline" style="margin-bottom: 1rem;">
            <div class="form-group"><label class="form-label" for="matBRows">Rows</label><select class="form-control" id="matBRows"><option value="2">2</option><option value="3">3</option></select></div>
            <div class="form-group"><label class="form-label" for="matBCols">Columns</label><select class="form-control" id="matBCols"><option value="2">2</option><option value="3">3</option></select></div>
            <div class="form-group"><button class="btn btn-outline btn-sm" id="matBBuild">Set dimensions</button></div>
          </div>
          <div id="matBContainer"></div>
        </div>
        <div style="margin-top: 1.5rem;"><button class="btn btn-primary" id="matCalcBtn">Calculate</button><button class="btn btn-ghost" id="matReset">Clear</button></div>
        <div class="result-area" id="matResult"></div>
        <div class="error-msg" id="matError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is a Matrix?</h2>
        <p>A matrix is a rectangular array of numbers arranged in rows and columns. A matrix with <em>m</em> rows and <em>n</em> columns is called an <em>m × n</em> matrix. Each number in the matrix is called an <strong>element</strong> or <strong>entry</strong>, identified by its row and column position. Matrices are the central object of <strong>linear algebra</strong> and are used to represent systems of linear equations, linear transformations, data in statistics, networks in graph theory, and quantum states in physics.</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>The calculator builds two matrices from your cell inputs, validates their dimensions for the selected operation, then computes the result. Addition and subtraction are element-by-element (both matrices must have the same dimensions). Multiplication requires the number of columns in A to equal the number of rows in B. Transpose swaps rows with columns. Determinant and inverse are only defined for square matrices.</p>
      </section>
      <section class="content-section">
        <h2>Matrix Formulas and Rules</h2>
        ${formulaBox('A + B: (A+B)ᵢⱼ = aᵢⱼ + bᵢⱼ (same dimensions required)')}
        ${formulaBox('(A×B)ᵢⱼ = Σ(aᵢₖ × bₖⱼ) for k = 1 to n')}
        ${formulaBox('det(2×2) = ad − bc')}
        ${formulaBox('A⁻¹ = (1/det(A)) × adj(A)', ['<code>A, B</code> — matrices', '<code>det</code> — determinant', '<code>adj</code> — adjugate (transpose of cofactor matrix)'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Matrix addition', [
          ['Matrix A:', '[1, 2; 3, 4]'],
          ['Matrix B:', '[5, 6; 7, 8]'],
          ['Rule:', 'Add corresponding elements.'],
          ['Result:', '[1+5, 2+6; 3+7, 4+8] = [6, 8; 10, 12]']
        ])}
        ${exampleBox('Example 2: 2×2 determinant', [
          ['Matrix:', '[4, 7; 2, 6]'],
          ['Formula:', 'det = ad − bc = (4)(6) − (7)(2)'],
          ['Calculation:', '24 − 14 = 10'],
          ['Result:', 'det = 10']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Matrix Theory</h2>
        <p>Matrices were introduced as a formal mathematical object in the 19th century, though the ideas behind them are much older. Ancient Chinese mathematicians solved systems of linear equations using methods equivalent to Gaussian elimination as early as the Han dynasty, as recorded in the <em>Nine Chapters on the Mathematical Art</em>.</p>
        <p>The modern theory of matrices was developed independently by the British mathematicians <strong>Arthur Cayley</strong> and <strong>James Joseph Sylvester</strong> in the 1850s. Cayley's 1858 <em>A Memoir on the Theory of Matrices</em> established matrix algebra as a distinct branch of mathematics, defining matrix multiplication, the identity matrix, and the inverse. Sylvester coined the term "matrix" (from the Latin for "womb"), because he saw matrices as objects from which determinants could be "born."</p>
        <p>The determinant, a scalar value derived from a square matrix, was studied earlier — by the Japanese mathematician Seki Takakazu in 1683 and the German mathematician Gottfried Leibniz in 1693, both independently.</p>
      </section>
      <section class="content-section">
        <h2>Where Matrices Are Used</h2>
        <ul><li><strong>Computer graphics:</strong> 3D transformations — rotation, scaling, translation — are all matrix operations.</li><li><strong>Machine learning:</strong> Neural networks are essentially chains of matrix multiplications.</li><li><strong>Physics:</strong> Quantum mechanics uses matrices to represent observables and state transformations.</li><li><strong>Economics:</strong> Input-output models and linear programming.</li><li><strong>Engineering:</strong> Structural analysis, circuit theory and control systems all rely on matrix equations.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Matrices compactly represent and manipulate large systems of equations.</li><li>Matrix operations are highly parallelisable, making them ideal for GPU computation.</li><li>The determinant and inverse provide essential information about solvability and stability.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Matrix multiplication is not commutative: A × B ≠ B × A in general.</li><li>Not all matrices have inverses — only square matrices with non-zero determinant do.</li><li>Large matrices can be computationally expensive, especially for determinant and inverse.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What is the difference between matrix multiplication and element-wise multiplication?', a:'Matrix multiplication (A×B) combines rows of A with columns of B to produce a new matrix. Element-wise multiplication (the Hadamard product) multiplies corresponding entries: (A∘B)ᵢⱼ = aᵢⱼ × bᵢⱼ. Matrix multiplication is the standard operation in linear algebra.'},
          {q:'Why must the number of columns in A equal the number of rows in B for multiplication?', a:'Each element of the product is computed by taking the dot product of a row of A with a column of B. A row of A has as many elements as A has columns, and a column of B has as many elements as B has rows. For the dot product to be defined, these must be equal.'},
          {q:'What does it mean if the determinant is zero?', a:'A determinant of zero means the matrix is singular — it does not have an inverse. Geometrically, the transformation it represents collapses space into a lower dimension. In equation solving, a zero determinant means the system either has no solution or infinitely many solutions.'},
          {q:'How is the inverse of a matrix calculated?', a:'For a 2×2 matrix [a, b; c, d], the inverse is (1/det) × [d, −b; −c, a]. For larger matrices, the inverse is (1/det) × adjugate, where the adjugate is the transpose of the cofactor matrix.'},
          {q:'Is matrix multiplication commutative?', a:'No. In general, A × B ≠ B × A. The order matters because each row of the left matrix is paired with each column of the right matrix.'},
          {q:'What is the transpose of a matrix?', a:'The transpose flips a matrix over its diagonal, switching rows with columns. The element at position (i, j) moves to position (j, i). A 2×3 matrix becomes a 3×2 matrix when transposed.'}
        ])}
      </section>`
};

// ── 7. Statistics Calculator ──
contentGen.statistics = {
  lead: 'Enter any dataset and get a complete set of descriptive statistics: count, sum, mean, median, mode, range, variance, standard deviation, minimum and maximum — with clear distinction between population and sample calculations.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">📊</span> Statistics Calculator</div>
        <div class="form-group"><label class="form-label" for="statData">Enter your dataset (numbers separated by commas, spaces or new lines)</label><textarea class="dataset-input" id="statData" placeholder="e.g. 5, 10, 15, 20, 25"></textarea></div>
        <div class="form-group"><label class="form-label" for="statType">Data type</label><select class="form-control" id="statType"><option value="sample">Sample</option><option value="population">Population</option></select></div>
        <div class="form-inline"><button class="btn btn-primary" id="statBtn">Calculate</button><button class="btn btn-ghost" id="statReset">Clear</button></div>
        <div class="result-area" id="statResult"></div>
        <div class="error-msg" id="statError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Are Descriptive Statistics?</h2>
        <p>Descriptive statistics summarise a dataset using numerical measures. They tell you where the data is centred (mean, median, mode), how spread out it is (range, variance, standard deviation), and where its boundaries lie (minimum, maximum). Unlike inferential statistics, which use sample data to draw conclusions about a larger population, descriptive statistics simply describe the data you have.</p>
        <p>This calculator distinguishes between <strong>population</strong> and <strong>sample</strong> statistics. When your data represents an entire population, variance and standard deviation divide by <em>n</em>. When your data is a sample drawn from a larger population, they divide by <em>n − 1</em> (Bessel's correction) to give an unbiased estimate of the population parameters.</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>The calculator parses your input into a list of numbers, validates that at least one number was entered, then computes each statistic in sequence: the mean by summing and dividing by the count, the median by sorting and finding the middle value, the mode by counting frequencies, the variance by averaging squared deviations, and the standard deviation as the square root of the variance.</p>
      </section>
      <section class="content-section">
        <h2>Statistical Formulas</h2>
        ${formulaBox('Mean (x̄) = Σx / n')}
        ${formulaBox('Median = middle value (or average of two middle values)')}
        ${formulaBox('Population Variance (σ²) = Σ(x − x̄)² / n')}
        ${formulaBox('Sample Variance (s²) = Σ(x − x̄)² / (n − 1)')}
        ${formulaBox('Standard Deviation = √Variance', ['<code>Σ</code> — sum of all values', '<code>n</code> — number of values', '<code>x̄</code> — mean'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Mean of 5, 10, 15, 20, 25', [
          ['Input:', '5, 10, 15, 20, 25'],
          ['Sum:', '5 + 10 + 15 + 20 + 25 = 75'],
          ['Count:', 'n = 5'],
          ['Mean:', '75 / 5 = 15']
        ])}
        ${exampleBox('Example 2: Sample standard deviation of 2, 4, 4, 4, 5, 5, 7, 9', [
          ['Mean:', 'x̄ = 40 / 8 = 5'],
          ['Deviations:', '(2−5)² + (4−5)² + ... + (9−5)² = 9+1+1+1+0+0+4+16 = 32'],
          ['Sample variance:', 's² = 32 / (8−1) = 32/7 ≈ 4.571'],
          ['Sample SD:', 's = √4.571 ≈ 2.14']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Statistics</h2>
        <p>The word "statistics" comes from the Latin <em>statisticum collegium</em> ("state council") and originally referred to data collected about the state — population counts, tax records, trade figures. The systematic study of statistics as a mathematical discipline began in the 17th century with the work of John Graunt, who analysed mortality rolls in London in 1662.</p>
        <p>The modern foundations of statistics were laid in the late 19th and early 20th centuries. <strong>Karl Pearson</strong> (1857–1936) developed the correlation coefficient, the chi-squared test and the method of moments. <strong>Ronald Fisher</strong> (1890–1962) is widely considered the father of modern statistics — he introduced maximum likelihood estimation, analysis of variance (ANOVA), and the concept of experimental design. His 1925 book <em>Statistical Methods for Research Workers</em> became one of the most influential statistics texts ever written.</p>
        <p>The distinction between population and sample statistics, and the use of <em>n − 1</em> for sample variance (Bessel's correction), was formalised in this period. Friedrich Bessel described the correction in the early 19th century in the context of astronomical observations.</p>
      </section>
      <section class="content-section">
        <h2>Where Statistics Are Used</h2>
        <ul><li><strong>Science:</strong> Experimental data analysis and hypothesis testing.</li><li><strong>Business:</strong> Market research, quality control and performance metrics.</li><li><strong>Healthcare:</strong> Clinical trials, epidemiology and public health studies.</li><li><strong>Finance:</strong> Risk assessment, portfolio analysis and volatility measurement.</li><li><strong>Sports:</strong> Player performance analysis and team strategy.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Descriptive statistics provide a compact summary of large datasets.</li><li>Mean and standard deviation together describe the centre and spread of data.</li><li>Population and sample modes ensure correct analysis whether you have all data or just a sample.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>The mean is sensitive to outliers — a single extreme value can shift it significantly.</li><li>Standard deviation assumes a roughly symmetric distribution; it can be misleading for highly skewed data.</li><li>Descriptive statistics describe the data but do not support inferences about a larger population.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What is the difference between population and sample standard deviation?', a:'Population standard deviation divides by n and is used when your data includes every member of the population. Sample standard deviation divides by n−1 (Bessel\'s correction) and is used when your data is a sample from a larger population. The correction makes the sample standard deviation an unbiased estimator of the population standard deviation.'},
          {q:'Why use n−1 instead of n for sample variance?', a:'When you calculate variance from a sample, the sample mean is already biased toward the sample itself. Dividing by n−1 instead of n corrects for this bias, because the deviations from the sample mean are on average slightly smaller than deviations from the true population mean. This correction is called Bessel\'s correction.'},
          {q:'What is the mode when all values are different?', a:'If every value in the dataset appears exactly once, there is no mode — or equivalently, every value is a mode. The calculator will report "No mode (all values unique)" in this case.'},
          {q:'How is the median calculated with an even number of values?', a:'When the dataset has an even number of values, the median is the average of the two middle values after sorting. For example, the median of [1, 2, 3, 4] is (2 + 3) / 2 = 2.5.'},
          {q:'What does standard deviation tell me?', a:'Standard deviation measures how spread out the data is from the mean. A small standard deviation means the values are clustered tightly around the mean. A large standard deviation means the values are spread out over a wider range. In a normal distribution, about 68% of values fall within one standard deviation of the mean.'}
        ])}
      </section>`
};

// ── 8. Probability Calculator ──
contentGen.probability = {
  lead: 'Calculate basic probability, complement, independent events, conditional probability, combinations and permutations. Each mode explains the underlying formula and shows the step-by-step working.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">🎲</span> Probability Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="prob-basic">Basic</button>
          <button class="calc-tab" data-tab="prob-comp">Complement</button>
          <button class="calc-tab" data-tab="prob-indep">Independent</button>
          <button class="calc-tab" data-tab="prob-cond">Conditional</button>
          <button class="calc-tab" data-tab="prob-comb">Combinations</button>
          <button class="calc-tab" data-tab="prob-perm">Permutations</button>
        </div>
        <div class="calc-tab-panel active" id="prob-basic">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="pbFav">Favourable outcomes</label><input type="number" class="form-control" id="pbFav" placeholder="e.g. 3" step="1" /></div><div class="form-group"><label class="form-label" for="pbTotal">Total outcomes</label><input type="number" class="form-control" id="pbTotal" placeholder="e.g. 6" step="1" /></div><div class="form-group"><button class="btn btn-primary" id="pbBtn">Calculate</button><button class="btn btn-ghost" id="pbReset">Clear</button></div></div>
          <div class="result-area" id="pbResult"></div><div class="error-msg" id="pbError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="prob-comp">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="pcP">P(A) — probability of event A</label><input type="number" class="form-control" id="pcP" placeholder="e.g. 0.3" step="any" /></div><div class="form-group"><button class="btn btn-primary" id="pcBtn">Calculate</button><button class="btn btn-ghost" id="pcReset">Clear</button></div></div>
          <div class="result-area" id="pcResult"></div><div class="error-msg" id="pcError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="prob-indep">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="piA">P(A)</label><input type="number" class="form-control" id="piA" placeholder="e.g. 0.5" step="any" /></div><div class="form-group"><label class="form-label" for="piB">P(B)</label><input type="number" class="form-control" id="piB" placeholder="e.g. 0.4" step="any" /></div><div class="form-group"><button class="btn btn-primary" id="piBtn">Calculate</button><button class="btn btn-ghost" id="piReset">Clear</button></div></div>
          <div class="result-area" id="piResult"></div><div class="error-msg" id="piError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="prob-cond">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="pcondAB">P(A ∩ B)</label><input type="number" class="form-control" id="pcondAB" placeholder="e.g. 0.12" step="any" /></div><div class="form-group"><label class="form-label" for="pcondB">P(B)</label><input type="number" class="form-control" id="pcondB" placeholder="e.g. 0.4" step="any" /></div><div class="form-group"><button class="btn btn-primary" id="pcondBtn">Calculate</button><button class="btn btn-ghost" id="pcondReset">Clear</button></div></div>
          <div class="result-area" id="pcondResult"></div><div class="error-msg" id="pcondError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="prob-comb">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="pcombN">n (total items)</label><input type="number" class="form-control" id="pcombN" placeholder="e.g. 5" step="1" /></div><div class="form-group"><label class="form-label" for="pcombR">r (chosen)</label><input type="number" class="form-control" id="pcombR" placeholder="e.g. 2" step="1" /></div><div class="form-group"><button class="btn btn-primary" id="pcombBtn">Calculate</button><button class="btn btn-ghost" id="pcombReset">Clear</button></div></div>
          <div class="result-area" id="pcombResult"></div><div class="error-msg" id="pcombError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="prob-perm">
          <div class="form-inline"><div class="form-group"><label class="form-label" for="ppermN">n (total items)</label><input type="number" class="form-control" id="ppermN" placeholder="e.g. 5" step="1" /></div><div class="form-group"><label class="form-label" for="ppermR">r (arranged)</label><input type="number" class="form-control" id="ppermR" placeholder="e.g. 2" step="1" /></div><div class="form-group"><button class="btn btn-primary" id="ppermBtn">Calculate</button><button class="btn btn-ghost" id="ppermReset">Clear</button></div></div>
          <div class="result-area" id="ppermResult"></div><div class="error-msg" id="ppermError" role="alert"></div>
        </div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is Probability?</h2>
        <p>Probability measures the likelihood of an event occurring, expressed as a number between 0 and 1. A probability of 0 means the event is impossible; a probability of 1 means it is certain. A probability of 0.5 means the event is equally likely to occur or not occur. The foundation of probability theory is the idea that, for a random experiment with a finite set of equally likely outcomes, the probability of an event is the number of favourable outcomes divided by the total number of possible outcomes.</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>Each tab handles a different probability calculation. The basic tab computes P(A) = favourable / total. The complement tab computes P(A') = 1 − P(A). The independent events tab computes P(A ∩ B) = P(A) × P(B). The conditional tab computes P(A|B) = P(A ∩ B) / P(B). The combinations and permutations tabs compute nCr and nPr using factorial-based formulas.</p>
      </section>
      <section class="content-section">
        <h2>Probability Formulas</h2>
        ${formulaBox('P(A) = Favourable / Total')}
        ${formulaBox('P(A\') = 1 − P(A)')}
        ${formulaBox('P(A ∩ B) = P(A) × P(B) (independent events)')}
        ${formulaBox('P(A|B) = P(A ∩ B) / P(B) (conditional)')}
        ${formulaBox('nCr = n! / (r!(n−r)!)')}
        ${formulaBox('nPr = n! / (n−r)!', ['<code>P(A)</code> — probability of event A', '<code>P(A\')</code> — complement', '<code>n, r</code> — items and selections'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Rolling a die — probability of a 4', [
          ['Input:', 'Favourable = 1 (only one face shows 4), Total = 6'],
          ['Formula:', 'P(4) = 1 / 6'],
          ['Result:', 'P(4) ≈ 0.1667 or 16.67%']
        ])}
        ${exampleBox('Example 2: Conditional probability', [
          ['Input:', 'P(A ∩ B) = 0.12, P(B) = 0.4'],
          ['Formula:', 'P(A|B) = P(A ∩ B) / P(B)'],
          ['Substitution:', 'P(A|B) = 0.12 / 0.4'],
          ['Result:', 'P(A|B) = 0.3 or 30%']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Probability Theory</h2>
        <p>The mathematical theory of probability was born in 1654 from a famous correspondence between <strong>Blaise Pascal</strong> and <strong>Pierre de Fermat</strong>. They were discussing a gambling problem about how to divide the stakes of an interrupted dice game. Their exchange established the fundamental principles of probability and is generally regarded as the origin of probability as a mathematical discipline.</p>
        <p>Before Pascal and Fermat, Gerolamo Cardano had written about probability in the 16th century in his <em>Liber de Ludo Aleae</em> ("Book on Games of Chance"), but his work was not published until 1663, after his death. Cardano was the first to define probability as a ratio of favourable to total outcomes.</p>
        <p>In 1657, Christiaan Huygens published <em>De Ratiociniis in Ludo Aleae</em>, the first printed book on probability. Jacob Bernoulli's <em>Ars Conjectandi</em> (1713) introduced the law of large numbers. Abraham de Moivre derived the normal distribution in 1733. Pierre-Simon Laplace synthesised the field in his 1812 <em>Théorie Analytique des Probabilités</em>, applying probability to scientific problems beyond gambling.</p>
      </section>
      <section class="content-section">
        <h2>Where Probability Is Used</h2>
        <ul><li><strong>Statistics:</strong> Hypothesis testing, confidence intervals and p-values.</li><li><strong>Finance:</strong> Risk models, insurance pricing and portfolio theory.</li><li><strong>Science:</strong> Quantum mechanics, genetics and experimental design.</li><li><strong>Machine learning:</strong> Bayesian inference and probabilistic models.</li><li><strong>Everyday life:</strong> Weather forecasts, lottery odds and game strategy.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Probability provides a rigorous framework for reasoning about uncertainty.</li><li>It underpins statistical inference and hypothesis testing.</li><li>Combinatorial methods (permutations, combinations) enable exact counting of outcomes.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Classical probability assumes equally likely outcomes, which is not always the case in real-world scenarios.</li><li>Conditional probability can be counterintuitive (as illustrated by the Monty Hall problem).</li><li>Independent-event formulas do not apply when events are correlated.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'What is the difference between independent and conditional probability?', a:'Independent events do not affect each other: P(A ∩ B) = P(A) × P(B). Conditional probability measures the likelihood of A given that B has already occurred: P(A|B) = P(A ∩ B) / P(B). If A and B are independent, then P(A|B) = P(A), meaning knowing B occurred does not change the probability of A.'},
          {q:'What is the complement of a probability?', a:'The complement P(A\') = 1 − P(A) represents the probability that event A does NOT occur. For example, if the probability of rain is 0.3, the probability of no rain is 1 − 0.3 = 0.7.'},
          {q:'How are combinations different from permutations?', a:'Combinations (nCr) count selections where order does not matter. Permutations (nPr) count arrangements where order does matter. For example, choosing 2 people from 5 is a combination (10 ways); arranging 2 people from 5 in order is a permutation (20 ways).'},
          {q:'Can a probability be greater than 1?', a:'No. A probability is always between 0 and 1 (or 0% and 100%). A probability of 0 means the event is impossible; 1 means it is certain. If your calculation gives a probability outside this range, there is an error in the setup.'},
          {q:'What is the multiplication rule for independent events?', a:'If two events A and B are independent, the probability that both occur is P(A ∩ B) = P(A) × P(B). For example, if the probability of heads on a coin is 0.5 and the probability of a 6 on a die is 1/6, the probability of both is 0.5 × (1/6) = 1/12.'}
        ])}
      </section>`
};

// ── 9. Standard Deviation Calculator ──
contentGen.stddev = {
  lead: 'Calculate population and sample standard deviation, mean and variance from any dataset. The calculator explains why the denominator differs between population and sample formulas and shows the full working.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">σ</span> Standard Deviation Calculator</div>
        <div class="form-group"><label class="form-label" for="sdData">Enter your dataset (numbers separated by commas, spaces or new lines)</label><textarea class="dataset-input" id="sdData" placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9"></textarea></div>
        <div class="form-inline"><button class="btn btn-primary" id="sdBtn">Calculate</button><button class="btn btn-ghost" id="sdReset">Clear</button></div>
        <div class="result-area" id="sdResult"></div>
        <div class="error-msg" id="sdError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>What Is Standard Deviation?</h2>
        <p>Standard deviation measures how spread out a dataset is from its mean. It is the square root of the variance, which is the average of the squared deviations from the mean. A small standard deviation means the data points are close to the mean; a large standard deviation means they are spread over a wide range.</p>
        <p>Standard deviation is one of the most important measures in statistics because, together with the mean, it provides a compact description of a distribution. In a normal distribution, approximately 68% of values fall within one standard deviation of the mean, 95% within two, and 99.7% within three — a rule known as the <strong>empirical rule</strong> or the 68-95-99.7 rule.</p>
      </section>
      <section class="content-section">
        <h2>Population vs Sample Standard Deviation</h2>
        <p>The key difference is the denominator: population standard deviation divides by <em>n</em>, while sample standard deviation divides by <em>n − 1</em>. This correction, called <strong>Bessel's correction</strong>, makes the sample standard deviation an unbiased estimator of the population standard deviation. When your data is the entire population, use the population formula. When your data is a sample from a larger population, use the sample formula.</p>
        <p>The reason for the correction is that when you compute deviations from the sample mean, those deviations are on average slightly smaller than deviations from the true population mean (because the sample mean is fitted to the sample). Dividing by n−1 compensates for this.</p>
      </section>
      <section class="content-section">
        <h2>Standard Deviation Formulas</h2>
        ${formulaBox('Population: σ = √(Σ(x − μ)² / n)')}
        ${formulaBox('Sample: s = √(Σ(x − x̄)² / (n − 1))')}
        ${formulaBox('Variance = σ² or s²', ['<code>σ</code> — population SD', '<code>s</code> — sample SD', '<code>μ</code> — population mean', '<code>x̄</code> — sample mean', '<code>n</code> — count'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Population SD of 4, 8, 6, 5, 7', [
          ['Mean:', 'μ = (4+8+6+5+7) / 5 = 30/5 = 6'],
          ['Deviations:', '(4−6)² + (8−6)² + (6−6)² + (5−6)² + (7−6)² = 4+4+0+1+1 = 10'],
          ['Variance:', 'σ² = 10 / 5 = 2'],
          ['SD:', 'σ = √2 ≈ 1.41']
        ])}
        ${exampleBox('Example 2: Sample SD of the same data', [
          ['Mean:', 'x̄ = 6 (same)'],
          ['Deviations:', 'Σ(x−x̄)² = 10 (same)'],
          ['Sample variance:', 's² = 10 / (5−1) = 10/4 = 2.5'],
          ['Sample SD:', 's = √2.5 ≈ 1.58']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Standard Deviation</h2>
        <p>The concept of standard deviation was introduced by <strong>Carl Friedrich Gauss</strong> (1777–1855) in the context of his work on the normal distribution and least-squares estimation. Gauss used what we now call the population standard deviation to measure the precision of astronomical observations. The normal distribution is sometimes called the "Gaussian distribution" in his honour.</p>
        <p>The term "standard deviation" was coined by <strong>Karl Pearson</strong> in 1894, replacing earlier terms like "mean error" and "error of mean square." Pearson established the notation σ (sigma) for standard deviation, which remains standard today.</p>
        <p>Bessel's correction — using n−1 instead of n for the sample variance — was described by Friedrich Bessel in the early 19th century in the context of astronomical measurement errors. The correction ensures that when you compute the standard deviation from a sample, the result is an unbiased estimate of the true population standard deviation.</p>
      </section>
      <section class="content-section">
        <h2>Where Standard Deviation Is Used</h2>
        <ul><li><strong>Finance:</strong> Volatility of investment returns and risk assessment.</li><li><strong>Quality control:</strong> Manufacturing tolerances and process variation.</li><li><strong>Science:</strong> Measurement uncertainty and experimental error.</li><li><strong>Education:</strong> Test score distributions and grading curves.</li><li><strong>Weather:</strong> Climate variability and temperature ranges.</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Standard deviation is in the same units as the original data, making it easy to interpret.</li><li>Together with the mean, it provides a complete description of a normal distribution.</li><li>The empirical rule (68-95-99.7) gives a quick way to understand data spread.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Standard deviation is sensitive to outliers — a single extreme value can inflate it significantly.</li><li>It assumes the data is roughly symmetric; for skewed distributions, it can be misleading.</li><li>For small samples, the sample standard deviation can be a noisy estimate of the population value.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'When should I use population vs sample standard deviation?', a:'Use population standard deviation (dividing by n) when your dataset includes every member of the population you are describing. Use sample standard deviation (dividing by n−1) when your data is a sample drawn from a larger population and you want to estimate the population standard deviation. In most real-world analyses, you are working with samples, so the sample formula is more common.'},
          {q:'What is Bessel\'s correction?', a:'Bessel\'s correction is the practice of dividing by n−1 instead of n when computing sample variance. It corrects for the fact that deviations from the sample mean are on average smaller than deviations from the true population mean. The correction makes the sample variance an unbiased estimator of the population variance.'},
          {q:'What is the empirical rule?', a:'The empirical rule (or 68-95-99.7 rule) states that for a normal distribution: about 68% of values fall within one standard deviation of the mean, 95% within two, and 99.7% within three. This gives a quick way to assess whether a value is typical or unusual.'},
          {q:'Why is standard deviation the square root of variance?', a:'Variance is measured in squared units (e.g., square dollars, square metres), which are hard to interpret. Taking the square root brings it back to the original units, making standard deviation directly comparable to the mean and the data itself.'},
          {q:'Can standard deviation be negative?', a:'No. Standard deviation is the square root of variance, and the square root of a non-negative number is always non-negative. A standard deviation of zero means all values are identical (no spread).'}
        ])}
      </section>`
};

// ── 10. Mean, Median & Mode Calculator ──
contentGen.mmm = {
  lead: 'Enter any dataset and instantly calculate the mean, median, mode and range. The calculator handles datasets with multiple modes and explains what each measure of central tendency tells you about your data.',
  calc: `      <div class="calc-card">
        <div class="calc-title"><span class="icon">x̄</span> Mean, Median &amp; Mode Calculator</div>
        <div class="form-group"><label class="form-label" for="mmmData">Enter your dataset (numbers separated by commas, spaces or new lines)</label><textarea class="dataset-input" id="mmmData" placeholder="e.g. 3, 5, 5, 7, 9, 11, 11"></textarea></div>
        <div class="form-inline"><button class="btn btn-primary" id="mmmBtn">Calculate</button><button class="btn btn-ghost" id="mmmReset">Clear</button></div>
        <div class="result-area" id="mmmResult"></div>
        <div class="error-msg" id="mmmError" role="alert"></div>
      </div>`,
  sections: `
      <section class="content-section">
        <h2>Measures of Central Tendency</h2>
        <p>The <strong>mean</strong> is the arithmetic average — the sum of all values divided by the count. The <strong>median</strong> is the middle value when the data is sorted; with an even number of values, it is the average of the two middle values. The <strong>mode</strong> is the value that appears most frequently; a dataset can have one mode, multiple modes (bimodal, trimodal), or no mode if all values appear equally often.</p>
        <p>Each measure tells you something different. The mean is influenced by every value and is sensitive to outliers. The median is resistant to outliers and is often better for skewed data (like income distributions). The mode is the only measure that works for categorical data (like eye colour or car brand).</p>
      </section>
      <section class="content-section">
        <h2>How the Calculator Works</h2>
        <p>The calculator parses your input into a list of numbers, sorts them, then computes: the mean by summing and dividing by the count, the median by finding the middle value (or the average of the two middle values for even-length datasets), the mode by counting the frequency of each value and finding the highest frequency, and the range as the difference between the maximum and minimum values.</p>
      </section>
      <section class="content-section">
        <h2>Formulas</h2>
        ${formulaBox('Mean (x̄) = Σx / n')}
        ${formulaBox('Median = middle value (sorted) or average of two middle values')}
        ${formulaBox('Mode = most frequent value(s)')}
        ${formulaBox('Range = Maximum − Minimum', ['<code>Σx</code> — sum of all values', '<code>n</code> — number of values'])}
      </section>
      <section class="content-section">
        <h2>Step-by-Step Examples</h2>
        ${exampleBox('Example 1: Mean, median and mode of 3, 5, 5, 7, 9', [
          ['Sorted:', '3, 5, 5, 7, 9'],
          ['Mean:', '(3+5+5+7+9) / 5 = 29/5 = 5.8'],
          ['Median:', 'Middle value = 5 (3rd of 5)'],
          ['Mode:', '5 (appears twice, more than any other)'],
          ['Range:', '9 − 3 = 6']
        ])}
        ${exampleBox('Example 2: Bimodal dataset 1, 2, 2, 3, 3, 4', [
          ['Sorted:', '1, 2, 2, 3, 3, 4'],
          ['Mean:', '(1+2+2+3+3+4) / 6 = 15/6 = 2.5'],
          ['Median:', '(2+3) / 2 = 2.5 (average of 3rd and 4th values)'],
          ['Mode:', '2 and 3 (both appear twice — bimodal)'],
          ['Range:', '4 − 1 = 3']
        ])}
      </section>
      <section class="content-section">
        <h2>History of Central Tendency</h2>
        <p>The concept of an average has been used since antiquity. Ancient astronomers used the mean to reduce observational errors — averaging multiple measurements of the same quantity to get a more reliable estimate. The Greek astronomer Hipparchus (c. 150 BCE) used what we now call the median to estimate the precession of the equinoxes.</p>
        <p>The formal study of central tendency as part of statistics developed in the 17th and 18th centuries. The mean was formalised by Christiaan Huygens in 1657 and by Jacob Bernoulli in <em>Ars Conjectandi</em> (1713). The concept of the median was introduced by Francis Galton in the 19th century, who found it useful for describing skewed biological data where the mean was misleading.</p>
        <p>The mode, though the simplest concept, was the last to be formally named — the term was introduced by Karl Pearson in the 1890s. Pearson distinguished between the mean, median and mode as three different ways of describing the "centre" of a distribution, noting that they coincide for symmetric distributions but diverge for skewed ones.</p>
      </section>
      <section class="content-section">
        <h2>Where Central Tendency Is Used</h2>
        <ul><li><strong>Demographics:</strong> Median household income is the standard measure because it resists the influence of billionaires.</li><li><strong>Education:</strong> Mean and median test scores; mode for the most common grade.</li><li><strong>Real estate:</strong> Median house prices, because the mean is distorted by a few luxury properties.</li><li><strong>Manufacturing:</strong> Mean dimensions for quality control.</li><li><strong>Surveys:</strong> Modal response for categorical data like "favourite brand."</li></ul>
      </section>
      <section class="content-section">
        <h3>Advantages</h3>
        <ul><li>Mean: uses all data and is mathematically convenient for further analysis.</li><li>Median: resistant to outliers and ideal for skewed distributions.</li><li>Mode: the only measure that works for categorical (non-numeric) data.</li></ul>
      </section>
      <section class="content-section">
        <h3>Limitations</h3>
        <ul><li>Mean: highly sensitive to outliers — a single extreme value can distort it.</li><li>Median: ignores the magnitude of individual values, only using their rank.</li><li>Mode: may not exist (all values unique) or may not be unique (multiple modes); less useful for continuous data.</li></ul>
      </section>
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${faqHTML([
          {q:'Which measure should I use — mean, median or mode?', a:'It depends on your data. For symmetric distributions without outliers, the mean is best because it uses all the data. For skewed data or data with outliers (like income), the median is more representative. For categorical data (like survey responses), the mode is the only option.'},
          {q:'Can a dataset have more than one mode?', a:'Yes. If two values tie for the highest frequency, the dataset is bimodal. If three values tie, it is trimodal. The calculator detects and reports all modes. If every value appears exactly once, there is no mode.'},
          {q:'Why is the median sometimes different from the mean?', a:'When the data is symmetric, mean and median are equal. When the data is skewed, they diverge. In a right-skewed distribution (like income), the mean is higher than the median because a few large values pull it up. In a left-skewed distribution, the mean is lower.'},
          {q:'How is the median calculated with an even number of values?', a:'The median is the average of the two middle values after sorting. For example, the median of [1, 2, 3, 4] is (2 + 3) / 2 = 2.5. This ensures the median is always a single value.'},
          {q:'What does the range tell me?', a:'The range (maximum minus minimum) gives a simple measure of spread. It tells you the total span of the data but is sensitive to outliers and does not describe how the data is distributed within that span. For a more robust spread measure, use standard deviation.'}
        ])}
      </section>`
};

// ── 11-30: Generic content generators for remaining calculators ──
// These use a simpler template with unique content per calculator

const remainingContent = {
  'geometry-calculator': {
    lead: 'Calculate the area and perimeter of common 2D shapes — rectangles, squares, triangles, circles, parallelograms and trapezoids — with formulas and step-by-step working for each.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">△</span> Geometry Calculator</div>
        <div class="form-group"><label class="form-label" for="geoShape">Shape</label><select class="form-control" id="geoShape"><option value="rectangle">Rectangle</option><option value="square">Square</option><option value="triangle">Triangle</option><option value="circle">Circle</option><option value="parallelogram">Parallelogram</option><option value="trapezoid">Trapezoid</option></select></div>
        <div id="geoInputs"></div>
        <div class="form-inline"><button class="btn btn-primary" id="geoBtn">Calculate</button><button class="btn btn-ghost" id="geoReset">Clear</button></div>
        <div class="result-area" id="geoResult"></div>
        <div class="error-msg" id="geoError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Geometry?', p:'Geometry is the branch of mathematics that deals with shapes, sizes, angles and properties of space. It encompasses both 2D shapes (area, perimeter) and 3D shapes (volume, surface area). The word comes from the Greek <em>geo</em> (earth) and <em>metron</em> (measurement) — geometry was originally the science of land measurement.'},
      {h:'How the Calculator Works', p:'Select a shape from the dropdown, enter the required dimensions, and the calculator applies the appropriate area and perimeter formulas. Each result shows the formula used, the substitution and the final answer.'},
      {h:'Area and Perimeter Formulas', formulas:[
        ['Rectangle: A = l × w, P = 2(l + w)', '<code>l</code> — length, <code>w</code> — width'],
        ['Square: A = s², P = 4s', '<code>s</code> — side length'],
        ['Triangle: A = ½ × b × h, P = a + b + c', '<code>b</code> — base, <code>h</code> — height'],
        ['Circle: A = πr², C = 2πr', '<code>r</code> — radius'],
        ['Parallelogram: A = b × h, P = 2(a + b)', '<code>b</code> — base, <code>h</code> — height'],
        ['Trapezoid: A = ½(a + b) × h', '<code>a, b</code> — parallel sides, <code>h</code> — height']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Rectangle 10 × 6', [['Input:','length = 10, width = 6'],['Area:','10 × 6 = 60'],['Perimeter:','2(10 + 6) = 32']]],
        ['Circle r = 5', [['Input:','radius = 5'],['Area:','π × 5² = 25π ≈ 78.54'],['Circumference:','2π × 5 = 10π ≈ 31.42']]]
      ]},
      {h:'History of Geometry', p:'Geometry originated in ancient Egypt and Mesopotamia as a practical tool for surveying land after Nile floods and for constructing monuments. The Greek mathematician Euclid (c. 300 BCE) systematised the field in his <em>Elements</em>, which defined geometry axiomatically and remained the standard textbook for over 2000 years. Archimedes extended geometry to include areas and volumes of curved shapes. The development of analytic geometry by Descartes and Fermat in the 17th century connected geometry to algebra, enabling the calculation of areas and perimeters using formulas rather than constructions.'},
      {h:'Where Geometry Is Used', list:['Architecture and building design','Land surveying and property measurement','Computer graphics and game design','Engineering and manufacturing','Art and design']},
      {h:'Advantages', list:['Formulas give exact results for ideal shapes','Quick to compute once dimensions are known','Foundation for calculus and physics']},
      {h:'Limitations', list:['Real-world objects are rarely perfect geometric shapes','Formulas assume exact measurements; real measurements have tolerances','Curved shapes may require calculus for precise area calculation']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between area and perimeter?', a:'Area measures the space inside a shape (in square units), while perimeter measures the distance around the outside (in linear units). A 10×10 square has area 100 and perimeter 40. A 1×100 rectangle has area 100 but perimeter 202 — same area, very different perimeter.'},
        {q:'How do I find the area of a triangle?', a:'Use A = ½ × base × height. The base is any side, and the height is the perpendicular distance from the base to the opposite vertex. For a right triangle, the two legs serve as base and height.'},
        {q:'What is π and why is it used in circle formulas?', a:'π (pi) is the ratio of a circle\'s circumference to its diameter, approximately 3.14159. It appears in every circle formula because it is the fundamental constant that relates a circle\'s linear dimensions to its area.'},
        {q:'Can I calculate the area of any polygon?', a:'Yes, by dividing it into triangles and summing their areas. For regular polygons (equal sides and angles), there are direct formulas. The calculator here handles the most common shapes; for irregular polygons, the shoelace formula can be used.'},
        {q:'What units should I use?', a:'Use any consistent units. If dimensions are in metres, area will be in square metres and perimeter in metres. If dimensions are in inches, area will be in square inches. The key is to use the same unit for all dimensions.'}
      ]}
    ]
  },
  'triangle-calculator': {
    lead: 'Calculate triangle sides, angles, area and perimeter. Supports the Pythagorean theorem for right triangles and the law of cosines and law of sines for general triangles.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">△</span> Triangle Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="tri-right">Right Triangle</button>
          <button class="calc-tab" data-tab="tri-area">Area</button>
          <button class="calc-tab" data-tab="tri-pyth">Pythagorean</button>
        </div>
        <div class="calc-tab-panel active" id="tri-right">
          <div class="form-row-3"><div class="form-group"><label class="form-label" for="rtA">Side a</label><input type="number" class="form-control" id="rtA" placeholder="e.g. 3" step="any" /></div><div class="form-group"><label class="form-label" for="rtB">Side b</label><input type="number" class="form-control" id="rtB" placeholder="e.g. 4" step="any" /></div><div class="form-group"><label class="form-label" for="rtC">Side c (hypotenuse)</label><input type="number" class="form-control" id="rtC" placeholder="auto" step="any" /></div></div>
          <div class="form-inline"><button class="btn btn-primary" id="rtBtn">Calculate</button><button class="btn btn-ghost" id="rtReset">Clear</button></div>
          <div class="result-area" id="rtResult"></div><div class="error-msg" id="rtError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="tri-area">
          <div class="form-row"><div class="form-group"><label class="form-label" for="taBase">Base</label><input type="number" class="form-control" id="taBase" placeholder="e.g. 10" step="any" /></div><div class="form-group"><label class="form-label" for="taHeight">Height</label><input type="number" class="form-control" id="taHeight" placeholder="e.g. 6" step="any" /></div></div>
          <div class="form-inline"><button class="btn btn-primary" id="taBtn">Calculate</button><button class="btn btn-ghost" id="taReset">Clear</button></div>
          <div class="result-area" id="taResult"></div><div class="error-msg" id="taError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="tri-pyth">
          <div class="form-row"><div class="form-group"><label class="form-label" for="ptA">Leg a</label><input type="number" class="form-control" id="ptA" placeholder="e.g. 3" step="any" /></div><div class="form-group"><label class="form-label" for="ptB">Leg b</label><input type="number" class="form-control" id="ptB" placeholder="e.g. 4" step="any" /></div></div>
          <div class="form-inline"><button class="btn btn-primary" id="ptBtn">Find Hypotenuse</button><button class="btn btn-ghost" id="ptReset">Clear</button></div>
          <div class="result-area" id="ptResult"></div><div class="error-msg" id="ptError" role="alert"></div>
        </div>
      </div>`,
    sections: [
      {h:'What Is a Triangle?', p:'A triangle is a polygon with three sides and three angles. The sum of the interior angles is always 180 degrees. Triangles are classified by their sides (equilateral, isosceles, scalene) and by their angles (acute, right, obtuse). A right triangle has one 90-degree angle and satisfies the Pythagorean theorem: a² + b² = c².'},
      {h:'How the Calculator Works', p:'The right triangle tab finds the missing side using the Pythagorean theorem. The area tab computes A = ½ × base × height. The Pythagorean tab takes two legs and finds the hypotenuse. All inputs are validated for positive values.'},
      {h:'Triangle Formulas', formulas:[
        ['Pythagorean: a² + b² = c²', '<code>a, b</code> — legs, <code>c</code> — hypotenuse'],
        ['Area: A = ½ × b × h', '<code>b</code> — base, <code>h</code> — height'],
        ['Perimeter: P = a + b + c', '<code>a, b, c</code> — side lengths'],
        ['Law of Cosines: c² = a² + b² − 2ab·cos(C)', 'for non-right triangles']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Right triangle with legs 3 and 4', [['Input:','a = 3, b = 4'],['Formula:','c² = 3² + 4² = 9 + 16 = 25'],['Hypotenuse:','c = √25 = 5'],['Area:','½ × 3 × 4 = 6']]],
        ['Triangle area with base 10 and height 6', [['Input:','base = 10, height = 6'],['Formula:','A = ½ × 10 × 6'],['Result:','A = 30']]
      ]]},
      {h:'History of Triangles', p:'The study of triangles dates to ancient Babylon and Egypt, where right-triangle relationships were used in construction and surveying. The Pythagorean theorem is named after the Greek mathematician Pythagoras (c. 570–495 BCE), though the relationship was known earlier in Babylonian and Indian mathematics. The theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. The law of cosines, which generalises the Pythagorean theorem to non-right triangles, was known to Euclid and was formalised by al-Kashi in the 15th century.'},
      {h:'Where Triangles Are Used', list:['Construction and architecture (trusses, roof angles)','Navigation and GPS triangulation','Computer graphics (mesh rendering)','Surveying and land measurement','Engineering (structural analysis)']},
      {h:'Advantages', list:['The Pythagorean theorem provides exact solutions for right triangles','Triangle formulas are simple and fast to compute','Triangles are the building blocks of all polygon shapes']},
      {h:'Limitations', list:['The Pythagorean theorem only applies to right triangles','For general triangles, the law of cosines or sines is needed','Real-world measurements have tolerances that affect accuracy']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the Pythagorean theorem?', a:'In a right triangle, a² + b² = c², where a and b are the two legs and c is the hypotenuse (the side opposite the right angle). This lets you find any missing side if you know the other two.'},
        {q:'How do I find the area of a triangle without the height?', a:'If you know all three sides, use Heron\'s formula: A = √(s(s−a)(s−b)(s−c)), where s = (a+b+c)/2 is the semi-perimeter. This calculator uses the simpler base × height formula, but Heron\'s formula is an alternative.'},
        {q:'What is a right triangle?', a:'A right triangle has one angle equal to exactly 90 degrees. The side opposite the right angle is called the hypotenuse, and it is always the longest side. The Pythagorean theorem only applies to right triangles.'},
        {q:'Can the hypotenuse be shorter than a leg?', a:'No. The hypotenuse is always the longest side of a right triangle. This follows from the Pythagorean theorem: c² = a² + b², so c is always greater than both a and b (assuming positive values).'},
        {q:'What is the law of cosines?', a:'The law of cosines generalises the Pythagorean theorem to any triangle: c² = a² + b² − 2ab·cos(C), where C is the angle opposite side c. When C = 90°, cos(90°) = 0, and the formula reduces to a² + b² = c² — the Pythagorean theorem.'}
      ]}
    ]
  },
  'circle-calculator': {
    lead: 'Calculate the radius, diameter, circumference and area of a circle. Enter any one value and the calculator finds all the others using C = 2πr and A = πr².',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">◯</span> Circle Calculator</div>
        <div class="form-group"><label class="form-label" for="cirInput">Enter one value</label><input type="number" class="form-control" id="cirInput" placeholder="e.g. 5" step="any" /></div>
        <div class="form-group"><label class="form-label" for="cirType">This value is the</label><select class="form-control" id="cirType"><option value="radius">Radius</option><option value="diameter">Diameter</option><option value="circumference">Circumference</option><option value="area">Area</option></select></div>
        <div class="form-inline"><button class="btn btn-primary" id="cirBtn">Calculate</button><button class="btn btn-ghost" id="cirReset">Clear</button></div>
        <div class="result-area" id="cirResult"></div><div class="error-msg" id="cirError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is a Circle?', p:'A circle is the set of all points in a plane that are at a fixed distance (the radius) from a central point. The distance across the circle through the centre is the diameter (twice the radius). The distance around the circle is the circumference. The space enclosed is the area.'},
      {h:'How the Calculator Works', p:'Enter any one of the four circle properties (radius, diameter, circumference or area), and the calculator derives the other three using the relationships r = d/2, C = 2πr, and A = πr². All results are displayed with the formulas used.'},
      {h:'Circle Formulas', formulas:[
        ['Diameter: d = 2r', '<code>r</code> — radius'],
        ['Circumference: C = 2πr = πd', '<code>d</code> — diameter'],
        ['Area: A = πr² = π(d/2)²', '<code>π</code> ≈ 3.14159265']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Circle with radius 5', [['Input:','radius = 5'],['Diameter:','2 × 5 = 10'],['Circumference:','2π × 5 ≈ 31.42'],['Area:','π × 25 ≈ 78.54']]],
        ['Circle with circumference 12', [['Input:','circumference = 12'],['Radius:','12 / (2π) ≈ 1.91'],['Diameter:','12 / π ≈ 3.82'],['Area:','π × 1.91² ≈ 11.46']]]
      ]},
      {h:'History of π and Circle Measurement', p:'The ratio of a circle\'s circumference to its diameter, denoted π, has fascinated mathematicians for millennia. The ancient Babylonians approximated π as 3.125 around 2000 BCE, while the Egyptian Rhind Papyrus (c. 1650 BCE) gives π ≈ 3.16. Archimedes (c. 250 BCE) used inscribed and circumscribed polygons to show that π is between 3.1408 and 3.1429 — the first rigorous calculation. The Chinese mathematician Zu Chongzhi (5th century CE) computed π to seven decimal places (3.1415926), a record that stood for 800 years. Ludolph van Ceulen spent much of his life computing π to 35 decimal places in the late 16th century. Today, computers have calculated π to trillions of digits.'},
      {h:'Where Circle Calculations Are Used', list:['Engineering (pipes, wheels, gears)','Architecture (domes, arches)','Physics (circular motion, orbits)','Manufacturing (lathes, drills)','Everyday life (pizza sizes, round tables)']},
      {h:'Advantages', list:['Circle formulas are exact and universally applicable','Knowing one property determines all others','π is a well-known constant available in all programming languages']},
      {h:'Limitations', list:['π is irrational, so all calculations are approximations','Real circles have imperfect shapes due to manufacturing tolerances','Formulas assume a perfect circle; real-world shapes may deviate']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is π and why is it irrational?', a:'π (pi) is the ratio of a circle\'s circumference to its diameter. It is irrational, meaning it cannot be expressed as a simple fraction and its decimal representation never terminates or repeats. The approximation 22/7 is commonly used but is not exact.'},
        {q:'How are circumference and area different?', a:'Circumference (C = 2πr) is the distance around the circle — a linear measurement. Area (A = πr²) is the space enclosed — a square measurement. Doubling the radius doubles the circumference but quadruples the area.'},
        {q:'Can I find the radius from the area?', a:'Yes. Since A = πr², rearranging gives r = √(A/π). For example, if the area is 78.54, then r = √(78.54/π) ≈ √25 = 5.'},
        {q:'Why is π used in circle formulas?', a:'π is the fundamental constant that relates a circle\'s linear dimensions to its area. It appears because a circle is defined by constant curvature, and π captures the mathematical relationship between that curvature and the enclosed space.'},
        {q:'What is the difference between radius and diameter?', a:'The radius is the distance from the centre to the edge. The diameter is the full distance across the circle through the centre, so diameter = 2 × radius. Both are used in circle formulas, but radius is more fundamental.'}
      ]}
    ]
  },
  'area-calculator': {
    lead: 'Calculate the area of squares, rectangles, triangles, circles, trapezoids and parallelograms with formulas and step-by-step working for each shape.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">▭</span> Area Calculator</div>
        <div class="form-group"><label class="form-label" for="areaShape">Shape</label><select class="form-control" id="areaShape"><option value="square">Square</option><option value="rectangle">Rectangle</option><option value="triangle">Triangle</option><option value="circle">Circle</option><option value="trapezoid">Trapezoid</option><option value="parallelogram">Parallelogram</option></select></div>
        <div id="areaInputs"></div>
        <div class="form-inline"><button class="btn btn-primary" id="areaBtn">Calculate</button><button class="btn btn-ghost" id="areaReset">Clear</button></div>
        <div class="result-area" id="areaResult"></div><div class="error-msg" id="areaError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Area?', p:'Area measures the two-dimensional space enclosed by a shape. It is measured in square units — square metres, square feet, square centimetres, etc. Area is fundamental to fields from construction (how much flooring to buy) to agriculture (how much land is available) to physics (surface area affects heat transfer).'},
      {h:'How the Calculator Works', p:'Select a shape, enter the required dimensions, and the calculator applies the appropriate area formula. The result shows the formula, the substitution and the final answer.'},
      {h:'Area Formulas', formulas:[
        ['Square: A = s²', '<code>s</code> — side length'],
        ['Rectangle: A = l × w', '<code>l</code> — length, <code>w</code> — width'],
        ['Triangle: A = ½ × b × h', '<code>b</code> — base, <code>h</code> — height'],
        ['Circle: A = πr²', '<code>r</code> — radius'],
        ['Trapezoid: A = ½(a + b) × h', '<code>a, b</code> — parallel sides'],
        ['Parallelogram: A = b × h', '<code>b</code> — base, <code>h</code> — height']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Square with side 7', [['Input:','side = 7'],['Formula:','A = 7² = 49'],['Result:','49 square units']]],
        ['Circle with radius 3', [['Input:','radius = 3'],['Formula:','A = π × 3² = 9π'],['Result:','≈ 28.27 square units']]]
      ]},
      {h:'History of Area Measurement', p:'The calculation of area is one of the oldest mathematical pursuits. Ancient Egyptians (c. 2000 BCE) computed areas of fields for tax purposes after the annual Nile flood. The Moscow Mathematical Papyrus contains the earliest known calculation of the area of a hemisphere. Mesopotamian mathematicians computed areas of rectangles, triangles and trapezoids. Greek geometers, particularly Euclid and Archimedes, developed rigorous methods for computing areas of curved shapes, laying the groundwork for integral calculus.'},
      {h:'Where Area Calculations Are Used', list:['Construction (flooring, paint, roofing)','Agriculture (field sizes, crop yields)','Real estate (property area)','Manufacturing (material requirements)','Physics (surface area for heat transfer)']},
      {h:'Advantages', list:['Area formulas are exact for ideal shapes','Quick to compute once dimensions are known','Essential for material estimation and cost calculation']},
      {h:'Limitations', list:['Real shapes are rarely perfect geometric forms','Curved shapes require calculus for precise area','All measurements have tolerances that propagate through calculations']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What units should area be in?', a:'Area is always in square units. If your dimensions are in metres, the area is in square metres. If in feet, the area is in square feet. Always use the same unit for all dimensions.'},
        {q:'How do I calculate the area of an irregular shape?', a:'Break it into simpler shapes (rectangles, triangles, circles), calculate each area separately, and add them together. For truly irregular shapes, numerical methods like the shoelace formula or integration are used.'},
        {q:'What is the area of a circle?', a:'A = πr², where r is the radius. If you know the diameter instead, use A = π(d/2)². For example, a circle with radius 5 has area π × 25 ≈ 78.54 square units.'},
        {q:'How is triangle area different from rectangle area?', a:'A triangle is half of a rectangle with the same base and height: A = ½ × base × height. A rectangle with base 10 and height 6 has area 60; a triangle with the same base and height has area 30.'},
        {q:'What is the difference between area and perimeter?', a:'Area measures the space inside a shape (square units), while perimeter measures the distance around it (linear units). A 10×10 square has area 100 and perimeter 40.'}
      ]}
    ]
  },
  'volume-calculator': {
    lead: 'Calculate the volume of cubes, cuboids, cylinders, cones, spheres and prisms with formulas, units and step-by-step examples for each 3D shape.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">⬢</span> Volume Calculator</div>
        <div class="form-group"><label class="form-label" for="volShape">Shape</label><select class="form-control" id="volShape"><option value="cube">Cube</option><option value="cuboid">Cuboid</option><option value="cylinder">Cylinder</option><option value="cone">Cone</option><option value="sphere">Sphere</option><option value="prism">Prism</option></select></div>
        <div id="volInputs"></div>
        <div class="form-inline"><button class="btn btn-primary" id="volBtn">Calculate</button><button class="btn btn-ghost" id="volReset">Clear</button></div>
        <div class="result-area" id="volResult"></div><div class="error-msg" id="volError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Volume?', p:'Volume measures the three-dimensional space occupied by a solid object. It is measured in cubic units — cubic metres, cubic centimetres, litres, gallons, etc. Volume is essential for engineering (tank capacity), manufacturing (material volume), physics (displacement) and everyday tasks (how much water a container holds).'},
      {h:'How the Calculator Works', p:'Select a 3D shape, enter the required dimensions, and the calculator applies the appropriate volume formula. The result shows the formula, substitution and final answer with units.'},
      {h:'Volume Formulas', formulas:[
        ['Cube: V = s³', '<code>s</code> — side length'],
        ['Cuboid: V = l × w × h', '<code>l, w, h</code> — length, width, height'],
        ['Cylinder: V = πr²h', '<code>r</code> — radius, <code>h</code> — height'],
        ['Cone: V = ⅓πr²h', '<code>r</code> — base radius, <code>h</code> — height'],
        ['Sphere: V = 4/3 πr³', '<code>r</code> — radius'],
        ['Prism: V = A × h', '<code>A</code> — base area, <code>h</code> — height']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Cube with side 4', [['Input:','side = 4'],['Formula:','V = 4³ = 64'],['Result:','64 cubic units']]],
        ['Cylinder r=3, h=10', [['Input:','radius = 3, height = 10'],['Formula:','V = π × 3² × 10 = 90π'],['Result:','≈ 282.74 cubic units']]]
      ]},
      {h:'History of Volume Calculation', p:'The calculation of volume has ancient origins. Archimedes (c. 250 BCE) discovered the volume of a sphere using the method of exhaustion, proving that V = 4/3 πr³. He was so proud of this result that he asked for a sphere inscribed in a cylinder to be carved on his tombstone. The story of Archimedes shouting "Eureka!" in the bath is about volume — he realised that the volume of water displaced by an object equals the object\'s volume, providing a way to measure the volume of irregular shapes.'},
      {h:'Where Volume Calculations Are Used', list:['Engineering (tank and container capacity)','Manufacturing (material volume and casting)','Construction (concrete volume)','Physics (displacement and buoyancy)','Cooking (recipe scaling and container sizes)']},
      {h:'Advantages', list:['Volume formulas are exact for ideal shapes','Essential for capacity planning and material estimation','Foundation for density and buoyancy calculations']},
      {h:'Limitations', list:['Real objects are rarely perfect geometric shapes','Curved shapes require calculus for precise volume','All measurements have tolerances that affect accuracy']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What units should volume be in?', a:'Volume is in cubic units. If dimensions are in metres, volume is in cubic metres. If in centimetres, volume is in cubic centimetres (1 cm³ = 1 millilitre). Always use consistent units for all dimensions.'},
        {q:'How is the volume of a sphere derived?', a:'Archimedes proved that the volume of a sphere is 4/3 πr³ by showing that a sphere fits exactly between a cylinder and a cone of the same radius and height. This was one of his proudest achievements.'},
        {q:'What is the difference between volume and capacity?', a:'Volume is the space an object occupies; capacity is the space a container can hold. For a solid object, they are the same. For a hollow container, capacity is the internal volume. A 1-litre bottle has a capacity of 1000 cm³ but a larger total volume because of the glass walls.'},
        {q:'How do I convert between volume units?', a:'Use the Unit Converter for this. Key conversions: 1 m³ = 1000 litres, 1 litre = 1000 cm³, 1 US gallon = 3.785 litres, 1 UK gallon = 4.546 litres.'},
        {q:'Why is a cone one-third of a cylinder?', a:'A cone with the same base and height as a cylinder has exactly one-third the volume. This can be proven using calculus (integration) or, as Archimedes did, using the method of exhaustion. V(cone) = ⅓πr²h, V(cylinder) = πr²h.'}
      ]}
    ]
  },
  'unit-converter': {
    lead: 'Convert between units of length, area, volume, mass, temperature, speed, time and digital storage with accurate conversion factors.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">↔</span> Unit Converter</div>
        <div class="form-group"><label class="form-label" for="ucCategory">Category</label><select class="form-control" id="ucCategory"><option value="length">Length</option><option value="area">Area</option><option value="volume">Volume</option><option value="mass">Mass</option><option value="temperature">Temperature</option><option value="speed">Speed</option><option value="time">Time</option><option value="digital">Digital Storage</option></select></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label" for="ucValue">Value</label><input type="number" class="form-control" id="ucValue" placeholder="e.g. 100" step="any" /></div>
          <div class="form-group"><label class="form-label" for="ucFrom">From</label><select class="form-control" id="ucFrom"></select></div>
          <div class="form-group"><label class="form-label" for="ucTo">To</label><select class="form-control" id="ucTo"></select></div>
        </div>
        <div class="form-inline"><button class="btn btn-primary" id="ucBtn">Convert</button><button class="btn btn-ghost" id="ucReset">Clear</button></div>
        <div class="result-area" id="ucResult"></div><div class="error-msg" id="ucError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Unit Conversion?', p:'Unit conversion is the process of transforming a measurement from one unit to another. For example, converting 5 kilometres to metres (5 km = 5000 m) or 100°F to Celsius (37.8°C). Accurate conversion requires knowing the exact relationship between units. Most conversions use a multiplication factor; temperature requires a formula because the zero points differ.'},
      {h:'How the Calculator Works', p:'Select a category (length, mass, temperature, etc.), enter a value, choose the source and target units, and the calculator applies the correct conversion. For most categories, this is a simple multiplication by a conversion factor. For temperature, it uses the appropriate formula (e.g., °C = (°F − 32) × 5/9).'},
      {h:'Conversion Formulas', formulas:[
        ['General: Value × Factor = Converted Value', 'most categories'],
        ['°C = (°F − 32) × 5/9', 'temperature'],
        ['°F = (°C × 9/5) + 32', 'temperature'],
        ['K = °C + 273.15', 'temperature']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Convert 5 km to miles', [['Input:','5 km'],['Factor:','1 km = 0.621371 miles'],['Calculation:','5 × 0.621371'],['Result:','≈ 3.107 miles']]],
        ['Convert 100°F to °C', [['Input:','100°F'],['Formula:','°C = (100 − 32) × 5/9'],['Calculation:','68 × 5/9'],['Result:','≈ 37.78°C']]
      ]]},
      {h:'History of Measurement Standardisation', p:'Throughout history, units of measurement varied by region and trade. The metric system was developed during the French Revolution (1795) to create a universal, decimal-based system. The metre was originally defined as one ten-millionth of the distance from the equator to the North Pole. The International System of Units (SI) was established in 1960 and is now the standard for science and most countries. The United States, Liberia and Myanmar remain the only countries not fully converted to metric.'},
      {h:'Where Unit Conversion Is Used', list:['International trade and shipping','Science and engineering','Travel (currency, distance, temperature)','Cooking (recipe conversions)','Construction (metric vs imperial)']},
      {h:'Advantages', list:['Conversion factors are exact and well-defined','The metric system is decimal-based, making conversions simple','Online converters eliminate the need to memorise factors']},
      {h:'Limitations', list:['Some conversions are approximate (e.g., 1 mile = 5280 feet exactly, but 1 km = 0.621371... miles approximately)','Temperature requires a formula, not a simple factor','Different countries use different definitions (e.g., US vs UK gallon)']},
      {h:'Frequently Asked Questions', faq:[
        {q:'Why is temperature conversion different from other conversions?', a:'Most units differ by a simple multiplication factor. Temperature scales (Celsius, Fahrenheit, Kelvin) have different zero points, so you need a formula that includes both a multiplication and an addition/subtraction. For example, °C = (°F − 32) × 5/9.'},
        {q:'What is the difference between metric and imperial units?', a:'Metric units (metre, kilogram, litre) are decimal-based and used by most of the world. Imperial units (foot, pound, gallon) are used mainly in the US and a few other countries. The UK uses a mix of both. The metric system is simpler for calculations because conversions are powers of 10.'},
        {q:'How accurate are the conversion factors?', a:'The factors used in this calculator are exact where possible (e.g., 1 inch = 2.54 cm exactly) and high-precision where the conversion is irrational (e.g., 1 km = 0.621371192 miles). For most practical purposes, the precision is more than sufficient.'},
        {q:'What is a light-year and how do I convert it?', a:'A light-year is the distance light travels in one year, approximately 9.461 × 10¹² km. It is used in astronomy, not everyday measurement. This calculator focuses on common engineering and everyday units.'},
        {q:'How do I convert between digital storage units?', a:'Digital storage uses binary prefixes: 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB, etc. Some systems use decimal prefixes (1 KB = 1000 bytes). The calculator uses the binary convention (1024) which is standard for computer memory.'}
      ]}
    ]
  },
  'age-calculator': {
    lead: 'Calculate exact age in years, months and days from a date of birth. Handles leap years correctly and shows total days lived and next birthday.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">🎂</span> Age Calculator</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label" for="ageDOB">Date of birth</label><input type="date" class="form-control" id="ageDOB" /></div>
          <div class="form-group"><label class="form-label" for="ageTarget">Age at date</label><input type="date" class="form-control" id="ageTarget" /></div>
        </div>
        <div class="form-inline"><button class="btn btn-primary" id="ageBtn">Calculate</button><button class="btn btn-ghost" id="ageReset">Clear</button></div>
        <div class="result-area" id="ageResult"></div><div class="error-msg" id="ageError" role="alert"></div>
      </div>`,
    sections: [
      {h:'How Age Calculation Works', p:'Age calculation is not simply subtracting the birth year from the current year. It must account for whether the birthday has occurred yet this year, and handle months and days correctly. Leap years add another layer of complexity — February 29th birthdays only occur every four years (with exceptions for century years not divisible by 400).'},
      {h:'How the Calculator Works', p:'The calculator parses the date of birth and the target date, validates that the birth date is not in the future, then computes the difference in years, months and days by comparing the calendar dates. It also calculates total days lived (accounting for leap years) and the date of the next birthday.'},
      {h:'Calendar and Leap Year Rules', formulas:[
        ['Leap year: divisible by 4 and (not by 100 or divisible by 400)', 'Gregorian calendar rule'],
        ['February has 28 days (29 in leap years)', ''],
        ['Total days = sum of days in each year from birth to target', 'accounts for leap years']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Age from 1990-06-15 to 2026-08-22', [['DOB:','15 June 1990'],['Target:','22 August 2026'],['Years:','2026 − 1990 = 36'],['Months:','August − June = 2'],['Days:','22 − 15 = 7'],['Result:','36 years, 2 months, 7 days']]],
        ['Leap year birthday 2000-02-29 to 2026-08-22', [['DOB:','29 February 2000 (leap year)'],['Target:','22 August 2026'],['Years:','26'],['Months:','5'],['Days:','24'],['Note:','Birthday is celebrated on Feb 28 or Mar 1 in non-leap years']]]
      ]]},
      {h:'History of Calendar Systems', p:'The calendar we use today is the Gregorian calendar, introduced by Pope Gregory XIII in 1582 to correct the Julian calendar\'s drift. The Julian calendar, established by Julius Caesar in 46 BCE, added a leap year every four years without exception, causing it to drift by about 1 day every 128 years. By 1582, the spring equinox had shifted by 10 days from its traditional date. The Gregorian reform skipped 10 days (October 4 was followed by October 15) and modified the leap year rule: century years are not leap years unless divisible by 400 (so 2000 was a leap year, but 1900 was not).'},
      {h:'Where Age Calculation Is Used', list:['Legal documents and identity verification','Insurance and pension calculations','School enrolment and age eligibility','Medical records and dosage calculations','Birthday planning and celebrations']},
      {h:'Advantages', list:['Handles leap years and month-length variations correctly','Provides both calendar age (years, months, days) and total days','Works for any date range, past or future']},
      {h:'Limitations', list:['Accuracy depends on correct date input','Leap-second adjustments are not included (negligible for most purposes)','Different cultures may count age differently (e.g., East Asian age counting)']},
      {h:'Frequently Asked Questions', faq:[
        {q:'How does the calculator handle leap year birthdays?', a:'If someone is born on February 29th, their birthday only occurs in leap years. In non-leap years, the calculator counts the day as February 28th (or March 1st, depending on convention). The next birthday calculation accounts for this by finding the next February 29th or using February 28th as a substitute.'},
        {q:'Why is the total days count not just years × 365?', a:'Because leap years have 366 days. Over 36 years, there are typically 8 or 9 leap years, adding 8-9 extra days. The calculator counts the actual days in each year, including leap days, to give the exact total.'},
        {q:'What is the difference between calendar age and total days?', a:'Calendar age (years, months, days) is how we normally express age — it follows the calendar. Total days is the raw count of days elapsed, which is useful for scientific calculations but not intuitive for everyday use. A 36-year-old has lived approximately 13,150 days.'},
        {q:'How accurate is the age calculation?', a:'The calculation is accurate to the day, accounting for varying month lengths and leap years. It does not account for time zones or leap seconds, which are negligible for age purposes. The result matches what you would calculate by hand using a calendar.'},
        {q:'Can I calculate age for a future date?', a:'Yes. The "age at" date can be set to any future date, and the calculator will compute the age as of that date. This is useful for planning — for example, calculating how old someone will be on a specific future event date.'}
      ]}
    ]
  },
  'date-difference-calculator': {
    lead: 'Calculate the difference between two dates in years, months, days and total days. Explains how calendar differences differ from simple day subtraction.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">📅</span> Date Difference Calculator</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label" for="ddStart">Start date</label><input type="date" class="form-control" id="ddStart" /></div>
          <div class="form-group"><label class="form-label" for="ddEnd">End date</label><input type="date" class="form-control" id="ddEnd" /></div>
        </div>
        <div class="form-inline"><button class="btn btn-primary" id="ddBtn">Calculate</button><button class="btn btn-ghost" id="ddReset">Clear</button></div>
        <div class="result-area" id="ddResult"></div><div class="error-msg" id="ddError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Date Difference?', p:'Date difference measures the time between two calendar dates. Unlike simple day subtraction, calendar difference accounts for the varying lengths of months (28-31 days) and leap years. The result is expressed in years, months and days — the way people naturally think about time intervals — plus a total day count for technical use.'},
      {h:'How the Calculator Works', p:'The calculator parses both dates, validates that the end date is after the start date, then computes the difference by comparing year, month and day components. It also calculates the total number of days between the two dates, accounting for leap years in between.'},
      {h:'Date Difference vs Day Count', formulas:[
        ['Calendar difference: years, months, days', 'human-readable'],
        ['Total days = end date − start date', 'raw count'],
        ['Example: Jan 15 to Mar 20 = 2 months, 5 days', 'but 64 total days']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['From 2024-01-15 to 2026-03-20', [['Start:','15 January 2024'],['End:','20 March 2026'],['Years:','2'],['Months:','2'],['Days:','5'],['Total days:','800 (including 1 leap day)']]],
        ['From 2025-06-01 to 2025-12-31', [['Start:','1 June 2025'],['End:','31 December 2025'],['Years:','0'],['Months:','6'],['Days:','30'],['Total days:','213']]
      ]]},
      {h:'History of Calendar Arithmetic', p:'Calculating the difference between dates has been important since ancient times for determining contract periods, religious festivals and agricultural cycles. The challenge is that months have different lengths (28-31 days) and leap years add an extra day. The Julian day count, introduced by Joseph Scaliger in 1583, provides a continuous day numbering system that avoids these complications by assigning a unique number to each day. Modern programming languages use similar systems internally (e.g., Unix timestamps count seconds since 1 January 1970).'},
      {h:'Where Date Difference Is Used', list:['Project planning and scheduling','Contract and lease duration calculation','Age and eligibility verification','Financial interest calculations','Event planning and countdowns']},
      {h:'Advantages', list:['Accounts for varying month lengths and leap years','Provides both human-readable (years, months, days) and technical (total days) results','Works for any date range']},
      {h:'Limitations', list:['Does not account for time zones or daylight saving time changes','Calendar difference can vary depending on how months are counted (e.g., Jan 31 to Feb 28 is 28 days or "1 month" depending on convention)','Historical dates before 1582 may use the Julian calendar, not Gregorian']},
      {h:'Frequently Asked Questions', faq:[
        {q:'Why is the calendar difference different from total days divided by 365?', a:'Because months have different lengths (28-31 days) and leap years add an extra day. The calendar difference (years, months, days) follows human calendar logic, while total days is a raw count. For example, "1 month" from January 15 is 31 days (to February 15), but "1 month" from February 15 is 28 days (to March 15 in a non-leap year).'},
        {q:'How are leap years handled?', a:'The calculator detects leap years between the two dates and includes the extra February 29th in the total day count. A leap year occurs every 4 years, except century years not divisible by 400. So 2000 was a leap year, but 1900 was not.'},
        {q:'Can I calculate the difference between dates in different years?', a:'Yes. The calculator works for any date range, whether the dates are in the same year or decades apart. It computes full years, remaining months and remaining days.'},
        {q:'What happens if the end date is before the start date?', a:'The calculator will show an error message, as the end date must be after the start date. If you need the absolute difference regardless of order, simply swap the dates.'},
        {q:'Does the calculator account for time zones?', a:'No. The calculator works with calendar dates only, not times. For most purposes (age, contract duration, project planning), this is sufficient. Time zone differences only matter when you need hour-level precision.'}
      ]}
    ]
  },
  'time-calculator': {
    lead: 'Add and subtract time durations, convert between hours/minutes/seconds and decimal hours, and calculate time intervals.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">⏱</span> Time Calculator</div>
        <div class="calc-tabs">
          <button class="calc-tab active" data-tab="time-add">Add Time</button>
          <button class="calc-tab" data-tab="time-sub">Subtract Time</button>
          <button class="calc-tab" data-tab="time-conv">Convert</button>
        </div>
        <div class="calc-tab-panel active" id="time-add">
          <div class="form-row-3"><div class="form-group"><label class="form-label" for="taH1">Hours</label><input type="number" class="form-control" id="taH1" placeholder="e.g. 2" step="any" /></div><div class="form-group"><label class="form-label" for="taM1">Minutes</label><input type="number" class="form-control" id="taM1" placeholder="e.g. 30" step="any" /></div><div class="form-group"><label class="form-label" for="taS1">Seconds</label><input type="number" class="form-control" id="taS1" placeholder="e.g. 45" step="any" /></div></div>
          <div class="form-row-3"><div class="form-group"><label class="form-label" for="taH2">+ Hours</label><input type="number" class="form-control" id="taH2" placeholder="e.g. 1" step="any" /></div><div class="form-group"><label class="form-label" for="taM2">Minutes</label><input type="number" class="form-control" id="taM2" placeholder="e.g. 45" step="any" /></div><div class="form-group"><label class="form-label" for="taS2">Seconds</label><input type="number" class="form-control" id="taS2" placeholder="e.g. 15" step="any" /></div></div>
          <div class="form-inline"><button class="btn btn-primary" id="taBtn">Add</button><button class="btn btn-ghost" id="taReset">Clear</button></div>
          <div class="result-area" id="taResult"></div><div class="error-msg" id="taError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="time-sub">
          <div class="form-row-3"><div class="form-group"><label class="form-label" for="tsH1">Hours</label><input type="number" class="form-control" id="tsH1" placeholder="e.g. 5" step="any" /></div><div class="form-group"><label class="form-label" for="tsM1">Minutes</label><input type="number" class="form-control" id="tsM1" placeholder="e.g. 30" step="any" /></div><div class="form-group"><label class="form-label" for="tsS1">Seconds</label><input type="number" class="form-control" id="tsS1" placeholder="e.g. 0" step="any" /></div></div>
          <div class="form-row-3"><div class="form-group"><label class="form-label" for="tsH2">− Hours</label><input type="number" class="form-control" id="tsH2" placeholder="e.g. 2" step="any" /></div><div class="form-group"><label class="form-label" for="tsM2">Minutes</label><input type="number" class="form-control" id="tsM2" placeholder="e.g. 15" step="any" /></div><div class="form-group"><label class="form-label" for="tsS2">Seconds</label><input type="number" class="form-control" id="tsS2" placeholder="e.g. 30" step="any" /></div></div>
          <div class="form-inline"><button class="btn btn-primary" id="tsBtn">Subtract</button><button class="btn btn-ghost" id="tsReset">Clear</button></div>
          <div class="result-area" id="tsResult"></div><div class="error-msg" id="tsError" role="alert"></div>
        </div>
        <div class="calc-tab-panel" id="time-conv">
          <div class="form-group"><label class="form-label" for="tcVal">Value</label><input type="number" class="form-control" id="tcVal" placeholder="e.g. 2.5" step="any" /></div>
          <div class="form-group"><label class="form-label" for="tcFrom">From</label><select class="form-control" id="tcFrom"><option value="hours">Hours</option><option value="minutes">Minutes</option><option value="seconds">Seconds</option><option value="dechours">Decimal Hours</option></select></div>
          <div class="form-inline"><button class="btn btn-primary" id="tcBtn">Convert</button><button class="btn btn-ghost" id="tcReset">Clear</button></div>
          <div class="result-area" id="tcResult"></div><div class="error-msg" id="tcError" role="alert"></div>
        </div>
      </div>`,
    sections: [
      {h:'What Is Time Calculation?', p:'Time calculation involves adding, subtracting and converting time durations expressed in hours, minutes and seconds. Unlike decimal numbers, time uses a sexagesimal (base-60) system: 60 seconds make a minute, 60 minutes make an hour. This means you cannot simply add or subtract hours, minutes and seconds as if they were decimal numbers — you must handle carry-over between units.'},
      {h:'How the Calculator Works', p:'For addition and subtraction, the calculator converts both time values to total seconds, performs the arithmetic, then converts back to hours, minutes and seconds. This avoids the complexity of manual carry-over. The conversion tab converts between hours, minutes, seconds and decimal hours (e.g., 2.5 hours = 2 hours 30 minutes).'},
      {h:'Time Conversion Formulas', formulas:[
        ['1 hour = 60 minutes = 3600 seconds', ''],
        ['Decimal hours → H:MM:SS', 'e.g., 2.5 = 2h 30m'],
        ['H:MM:SS → Decimal hours', 'e.g., 2h 30m = 2.5']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Add 2h 30m 45s + 1h 45m 15s', [['Convert to seconds:','9045 + 6315 = 15360 seconds'],['Convert back:','15360 / 3600 = 4 hours, 0 minutes, 0 seconds'],['Result:','4:00:00']]],
        ['Convert 2.5 decimal hours', [['Input:','2.5 hours'],['Hours:','2'],['Minutes:','0.5 × 60 = 30'],['Result:','2 hours 30 minutes']]
      ]]},
      {h:'History of Time Measurement', p:'The sexagesimal (base-60) system for time originated with the Sumerians around 2000 BCE and was adopted by the Babylonians. The choice of 60 was likely because it is divisible by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30, making it practical for dividing time into equal parts. The division of the day into 24 hours comes from the Egyptians, who used 12 hours of daylight and 12 hours of night. Mechanical clocks appeared in Europe in the 13th century, and the pendulum clock (invented by Christiaan Huygens in 1656) dramatically improved accuracy. Today, the SI second is defined by the caesium atom: exactly 9,192,631,770 oscillations of the caesium-133 atom.'},
      {h:'Where Time Calculation Is Used', list:['Payroll and timesheet calculations','Project tracking and billing','Sports timing and race results','Cooking and baking timers','Travel planning and time zones']},
      {h:'Advantages', list:['Converting to total seconds avoids carry-over errors','Decimal hours are convenient for payroll (e.g., 7.5 hours worked)','Works with any time duration, not just clock times']},
      {h:'Limitations', list:['Does not handle time zones or daylight saving time','Does not compute across calendar dates (use the Date Difference Calculator for that)','Decimal hours lose precision for very small time intervals']},
      {h:'Frequently Asked Questions', faq:[
        {q:'Why does time use base 60 instead of base 10?', a:'The sexagesimal system was inherited from the Babylonians, who used base 60 for mathematics and astronomy. The number 60 is highly composite — divisible by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30 — which makes it practical for dividing time into equal portions. We still use it for time, angles and geographic coordinates.'},
        {q:'What are decimal hours and why are they useful?', a:'Decimal hours express time as a decimal number (e.g., 2.5 hours instead of 2 hours 30 minutes). They are useful for payroll and billing because you can multiply an hourly rate by decimal hours directly: £15/hour × 7.5 hours = £112.50. Converting back to H:MM:SS gives 7 hours 30 minutes.'},
        {q:'How do I add times that cross midnight?', a:'This calculator works with durations, not clock times. If you need to add a duration to a clock time and cross midnight (e.g., 11pm + 3 hours = 2am), use the Speed, Distance & Time Calculator or a date-time calculation tool.'},
        {q:'Can I subtract a longer time from a shorter one?', a:'Yes. The calculator will produce a negative result if the second time is longer than the first. The result is shown as a negative duration, which may be useful for finding how much time is remaining or over budget.'},
        {q:'How precise are the calculations?', a:'The calculator works with whole seconds. Sub-second precision (milliseconds) is not supported, as it is rarely needed for practical time calculations. For scientific timing, use a dedicated high-precision timer.'}
      ]}
    ]
  },
  'speed-distance-time-calculator': {
    lead: 'Solve for speed, distance or time using Speed = Distance / Time, Distance = Speed × Time, and Time = Distance / Speed. Supports multiple units for speed, distance and time.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">⚡</span> Speed, Distance &amp; Time Calculator</div>
        <div class="form-group"><label class="form-label" for="sdtSolve">Solve for</label><select class="form-control" id="sdtSolve"><option value="speed">Speed</option><option value="distance">Distance</option><option value="time">Time</option></select></div>
        <div id="sdtInputs"></div>
        <div class="form-inline"><button class="btn btn-primary" id="sdtBtn">Calculate</button><button class="btn btn-ghost" id="sdtReset">Clear</button></div>
        <div class="result-area" id="sdtResult"></div><div class="error-msg" id="sdtError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is the Speed-Distance-Time Relationship?', p:'The fundamental relationship between speed, distance and time is: Speed = Distance / Time. This can be rearranged to find any one quantity if the other two are known: Distance = Speed × Time, and Time = Distance / Speed. These formulas are the basis of kinematics — the study of motion.'},
      {h:'How the Calculator Works', p:'Select which variable to solve for, enter the other two values with their units, and the calculator applies the appropriate formula. It converts units internally to ensure consistent calculations, then displays the result in the chosen unit.'},
      {h:'Speed, Distance & Time Formulas', formulas:[
        ['Speed = Distance / Time', 'find speed'],
        ['Distance = Speed × Time', 'find distance'],
        ['Time = Distance / Speed', 'find time'],
        ['Units: m/s, km/h, mph for speed; m, km, miles for distance; s, min, h for time', '']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Find speed: 150 km in 2 hours', [['Input:','distance = 150 km, time = 2 hours'],['Formula:','speed = 150 / 2'],['Result:','75 km/h']]],
        ['Find time: 300 miles at 60 mph', [['Input:','distance = 300 miles, speed = 60 mph'],['Formula:','time = 300 / 60'],['Result:','5 hours']]
      ]]},
      {h:'History of Speed Measurement', p:'The study of motion began with Galileo Galilei in the late 16th century. Galileo was the first to study motion quantitatively, using inclined planes to slow down falling objects and measure their speed. He discovered that distance travelled is proportional to the square of time for constant acceleration. Isaac Newton formalised these ideas in his laws of motion (1687), establishing the relationship between force, mass and acceleration. The concept of speed as distance per unit time became fundamental to physics and engineering.'},
      {h:'Where Speed Calculations Are Used', list:['Transportation and travel planning','Physics and engineering','Sports and athletics','Navigation and GPS','Manufacturing (production rates)']},
      {h:'Advantages', list:['The speed-distance-time formula is simple and universal','Supports multiple units for flexibility','Applicable to any constant-speed scenario']},
      {h:'Limitations', list:['Assumes constant speed — does not account for acceleration or deceleration','Real-world speeds vary due to traffic, terrain and conditions','Does not handle relativistic speeds (near light speed)']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between speed and velocity?', a:'Speed is a scalar quantity — it only has magnitude (e.g., 60 km/h). Velocity is a vector — it has both magnitude and direction (e.g., 60 km/h north). The speed-distance-time formula works for speed; velocity requires vector mathematics.'},
        {q:'How do I convert between km/h and mph?', a:'1 km/h = 0.621371 mph, and 1 mph = 1.60934 km/h. The calculator handles this conversion internally when you select different units for speed. For example, 100 km/h ≈ 62.14 mph.'},
        {q:'Does this calculator account for acceleration?', a:'No. This calculator assumes constant speed. If the speed is changing (acceleration or deceleration), you need the equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as. These are covered in physics courses.'},
        {q:'Can I use this for average speed?', a:'Yes. If you know the total distance and total time, the calculator gives the average speed. For example, if a 300 km journey takes 4 hours including stops, the average speed is 300/4 = 75 km/h, even though the instantaneous speed varied.'},
        {q:'What units are supported?', a:'Speed: m/s, km/h, mph. Distance: metres, kilometres, miles. Time: seconds, minutes, hours. The calculator converts between units automatically to ensure the result is in the unit you select.'}
      ]}
    ]
  },
  'bmi-calculator': {
    lead: 'Calculate Body Mass Index (BMI) from height and weight in metric or imperial units. Shows BMI categories and explains that BMI is a screening index, not a medical diagnosis.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">⚖</span> BMI Calculator</div>
        <div class="form-group"><label class="form-label" for="bmiUnit">Units</label><select class="form-control" id="bmiUnit"><option value="metric">Metric (kg, cm)</option><option value="imperial">Imperial (lb, in)</option></select></div>
        <div class="form-row" id="bmiMetricInputs">
          <div class="form-group"><label class="form-label" for="bmiWeightKg">Weight (kg)</label><input type="number" class="form-control" id="bmiWeightKg" placeholder="e.g. 70" step="any" /></div>
          <div class="form-group"><label class="form-label" for="bmiHeightCm">Height (cm)</label><input type="number" class="form-control" id="bmiHeightCm" placeholder="e.g. 175" step="any" /></div>
        </div>
        <div class="form-row" id="bmiImperialInputs" style="display:none;">
          <div class="form-group"><label class="form-label" for="bmiWeightLb">Weight (lb)</label><input type="number" class="form-control" id="bmiWeightLb" placeholder="e.g. 154" step="any" /></div>
          <div class="form-group"><label class="form-label" for="bmiHeightIn">Height (inches)</label><input type="number" class="form-control" id="bmiHeightIn" placeholder="e.g. 69" step="any" /></div>
        </div>
        <div class="form-inline"><button class="btn btn-primary" id="bmiBtn">Calculate</button><button class="btn btn-ghost" id="bmiReset">Clear</button></div>
        <div class="result-area" id="bmiResult"></div><div class="error-msg" id="bmiError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is BMI?', p:'Body Mass Index (BMI) is a number calculated from a person\'s height and weight. It provides a simple screening measure to classify whether a person\'s weight is in a healthy range relative to their height. BMI is widely used by health organisations, including the World Health Organization (WHO), as a population-level screening tool.'},
      {h:'How the Calculator Works', p:'The calculator uses the standard BMI formula: BMI = weight(kg) / height(m)². For imperial units, it converts pounds to kilograms and inches to metres before applying the formula. The result is classified into standard WHO categories: underweight (<18.5), normal (18.5–24.9), overweight (25–29.9), and obese (≥30).'},
      {h:'BMI Formula and Categories', formulas:[
        ['BMI = weight(kg) / height(m)²', 'metric formula'],
        ['BMI = 703 × weight(lb) / height(in)²', 'imperial formula'],
        ['Underweight: < 18.5', ''],
        ['Normal: 18.5 – 24.9', ''],
        ['Overweight: 25.0 – 29.9', ''],
        ['Obese: ≥ 30.0', '']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['Metric: 70 kg, 175 cm', [['Input:','weight = 70 kg, height = 1.75 m'],['Formula:','70 / 1.75² = 70 / 3.0625'],['Result:','BMI ≈ 22.86 (Normal)']]],
        ['Imperial: 154 lb, 69 in', [['Input:','weight = 154 lb, height = 69 in'],['Formula:','703 × 154 / 69² = 108262 / 4761'],['Result:','BMI ≈ 22.74 (Normal)']]
      ]]},
      {h:'History of BMI', p:'The BMI formula was developed by the Belgian mathematician <strong>Adolphe Quetelet</strong> in the 1830s as part of his work on "social physics" — the study of average human characteristics. Quetelet called it the "body mass index" and intended it as a statistical tool for describing populations, not for diagnosing individuals. The modern name "Body Mass Index" was coined by the physiologist <strong>Ancel Keys</strong> in a 1972 paper, where he argued it was the best simple proxy for body fat percentage. The WHO adopted BMI as a standard screening tool in the 1980s. It is important to note that BMI does not measure body fat directly — it is a height-weight ratio, and its limitations are well documented.'},
      {h:'Where BMI Is Used', list:['Health screening at population level','Insurance risk assessment','Research studies on obesity trends','Personal health tracking','Clinical guidelines (with other assessments)']},
      {h:'Advantages', list:['Simple to calculate — only requires height and weight','Inexpensive and non-invasive','Useful for population-level health statistics','Standardised categories enable international comparison']},
      {h:'Limitations', list:['Does not distinguish between muscle and fat — muscular athletes may be classified as overweight','Does not account for body fat distribution (visceral fat is more harmful than subcutaneous fat)','May not be appropriate for all ethnic groups, children, the elderly, or pregnant women','BMI is a screening index, NOT a medical diagnosis — consult a healthcare professional for individual assessment']},
      {h:'Frequently Asked Questions', faq:[
        {q:'Is BMI a medical diagnosis?', a:'No. BMI is a screening index, not a diagnostic tool. It cannot measure body fat, muscle mass, or overall health. A person with a high BMI may be perfectly healthy if the weight is from muscle rather than fat. Always consult a healthcare professional for individual health assessment.'},
        {q:'Why might BMI be inaccurate for athletes?', a:'Muscle is denser than fat, so a muscular person may have a high BMI despite having low body fat. A bodybuilder with 10% body fat might be classified as "obese" by BMI. For athletes, body fat percentage or waist-to-hip ratio are more informative measures.'},
        {q:'What BMI range is considered healthy?', a:'The WHO defines normal BMI as 18.5–24.9. However, "healthy" varies by individual — factors like muscle mass, body composition, age, and ethnicity matter. Some researchers suggest that the normal range should be adjusted for different populations.'},
        {q:'Can BMI be used for children?', a:'BMI for children is calculated the same way but interpreted differently — it is compared to age- and sex-specific percentile charts, not fixed categories. A child\'s BMI percentile shows how they compare to other children of the same age and sex.'},
        {q:'Who invented BMI?', a:'The formula was developed by Adolphe Quetelet, a Belgian mathematician, in the 1830s. He was studying average human characteristics and developed the index as a statistical tool. The term "Body Mass Index" was coined by Ancel Keys in 1972. Neither intended it for individual medical diagnosis.'}
      ]}
    ]
  },
  'compound-interest-calculator': {
    lead: 'Calculate compound interest with configurable compounding frequency. See how investments grow over time, with the final amount, total interest and the compounding effect.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">📈</span> Compound Interest Calculator</div>
        <div class="form-row-3"><div class="form-group"><label class="form-label" for="ciP">Principal (£)</label><input type="number" class="form-control" id="ciP" placeholder="e.g. 10000" step="any" /></div><div class="form-group"><label class="form-label" for="ciR">Annual rate (%)</label><input type="number" class="form-control" id="ciR" placeholder="e.g. 5" step="any" /></div><div class="form-group"><label class="form-label" for="ciT">Time (years)</label><input type="number" class="form-control" id="ciT" placeholder="e.g. 10" step="any" /></div></div>
        <div class="form-group"><label class="form-label" for="ciN">Compounding frequency</label><select class="form-control" id="ciN"><option value="1">Annually</option><option value="2">Semi-annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></div>
        <div class="form-inline"><button class="btn btn-primary" id="ciBtn">Calculate</button><button class="btn btn-ghost" id="ciReset">Clear</button></div>
        <div class="result-area" id="ciResult"></div><div class="error-msg" id="ciError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Compound Interest?', p:'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which only earns interest on the principal, compound interest earns "interest on interest," causing wealth to grow exponentially over time. Albert Einstein is often (apocryphally) quoted as calling compound interest "the eighth wonder of the world."'},
      {h:'How the Calculator Works', p:'The calculator applies the compound interest formula A = P(1 + r/n)^(nt), where P is the principal, r is the annual interest rate, n is the compounding frequency (how many times per year interest is compounded), and t is the time in years. It displays the final amount, total interest earned and the effective annual rate.'},
      {h:'Compound Interest Formula', formulas:[
        ['A = P(1 + r/n)^(nt)', ''],
        ['Total Interest = A − P', ''],
        ['Effective Annual Rate = (1 + r/n)^n − 1', '']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['£10,000 at 5% for 10 years, compounded annually', [['Input:','P = 10000, r = 0.05, n = 1, t = 10'],['Formula:','10000 × (1 + 0.05/1)^(1×10)'],['Calculation:','10000 × 1.05^10 = 10000 × 1.6289'],['Result:','A ≈ £16,288.95, Interest ≈ £6,288.95']]],
        ['£5,000 at 6% for 5 years, compounded monthly', [['Input:','P = 5000, r = 0.06, n = 12, t = 5'],['Formula:','5000 × (1 + 0.06/12)^(12×5)'],['Calculation:','5000 × (1.005)^60 = 5000 × 1.3489'],['Result:','A ≈ £6,744.25, Interest ≈ £1,744.25']]
      ]]},
      {h:'History of Compound Interest', p:'The concept of compound interest is ancient. It was discussed in the mathematical texts of medieval mathematicians and appears in <strong>Richard Witt</strong>\'s <em>Arithmeticall Questions</em> (1613), considered the first comprehensive treatise on compound interest. The mathematical understanding of exponential growth — which compound interest exemplifies — was deepened by Jacob Bernoulli\'s work on the constant e (1683) and Euler\'s development of exponential functions. The modern financial industry relies on compound interest for mortgages, savings accounts, bonds and investment growth models.'},
      {h:'Where Compound Interest Is Used', list:['Savings accounts and certificates of deposit','Investment portfolios and retirement planning','Mortgages and loans with compounding','Bond pricing and yield calculations','Financial modelling and forecasting']},
      {h:'Advantages', list:['Exponential growth means even small rate differences compound significantly over time','More frequent compounding yields higher returns (with diminishing returns)','Illustrates the power of long-term investing']},
      {h:'Limitations', list:['Assumes constant interest rate — real rates fluctuate','Does not account for inflation, taxes or fees','Very high compounding frequencies converge to continuous compounding (the mathematical limit)']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between simple and compound interest?', a:'Simple interest only earns interest on the principal: I = PRT. Compound interest earns interest on both principal and accumulated interest: A = P(1 + r/n)^(nt). Over long periods, compound interest produces dramatically higher returns because the interest itself earns interest.'},
        {q:'How does compounding frequency affect the result?', a:'More frequent compounding yields a higher final amount because interest is added to the principal more often, allowing it to earn interest sooner. However, the effect diminishes: the difference between monthly and daily compounding is much smaller than between annual and monthly compounding.'},
        {q:'What is continuous compounding?', a:'As compounding frequency approaches infinity, the formula becomes A = Pe^(rt), where e is Euler\'s number (≈ 2.71828). This is the mathematical limit of compounding and gives the maximum possible return for a given rate. The difference between daily and continuous compounding is negligible for practical purposes.'},
        {q:'Does this calculator account for inflation?', a:'No. The calculator shows nominal growth. To find the real (inflation-adjusted) return, subtract the inflation rate from the interest rate. For example, at 5% interest and 2% inflation, the real return is approximately 3%.'},
        {q:'How do taxes affect compound interest?', a:'Interest earnings are typically taxed as income, which reduces the effective compounding rate. If you pay 20% tax on interest, a 5% nominal rate becomes a 4% after-tax rate. Tax-advantaged accounts (like ISAs in the UK or 401(k)s in the US) allow tax-free compounding, which significantly increases long-term returns.'}
      ]}
    ]
  },
  'simple-interest-calculator': {
    lead: 'Calculate simple interest using I = PRT. Find the interest, final amount, principal, rate or time with clear step-by-step working.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">💰</span> Simple Interest Calculator</div>
        <div class="form-row-3"><div class="form-group"><label class="form-label" for="siP">Principal (£)</label><input type="number" class="form-control" id="siP" placeholder="e.g. 5000" step="any" /></div><div class="form-group"><label class="form-label" for="siR">Annual rate (%)</label><input type="number" class="form-control" id="siR" placeholder="e.g. 4" step="any" /></div><div class="form-group"><label class="form-label" for="siT">Time (years)</label><input type="number" class="form-control" id="siT" placeholder="e.g. 3" step="any" /></div></div>
        <div class="form-inline"><button class="btn btn-primary" id="siBtn">Calculate</button><button class="btn btn-ghost" id="siReset">Clear</button></div>
        <div class="result-area" id="siResult"></div><div class="error-msg" id="siError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Simple Interest?', p:'Simple interest is interest calculated only on the original principal. Unlike compound interest, it does not earn interest on previously accumulated interest. The formula is straightforward: I = PRT, where P is the principal, R is the annual interest rate (as a decimal), and T is the time in years. The total amount to repay is A = P + I = P(1 + RT).'},
      {h:'How the Calculator Works', p:'Enter the principal, annual interest rate and time in years. The calculator computes the interest (I = PRT), the final amount (A = P + I), and displays the step-by-step working.'},
      {h:'Simple Interest Formula', formulas:[
        ['I = P × R × T', 'interest only'],
        ['A = P + I = P(1 + RT)', 'total amount'],
        ['<code>P</code> — principal', '<code>R</code> — annual rate (decimal)', '<code>T</code> — time in years', '<code>I</code> — interest', '<code>A</code> — final amount']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['£5,000 at 4% for 3 years', [['Input:','P = 5000, R = 0.04, T = 3'],['Formula:','I = 5000 × 0.04 × 3'],['Calculation:','5000 × 0.12 = 600'],['Interest:','£600'],['Total:','£5,600']]],
        ['£10,000 at 3.5% for 5 years', [['Input:','P = 10000, R = 0.035, T = 5'],['Formula:','I = 10000 × 0.035 × 5'],['Calculation:','10000 × 0.175 = 1750'],['Interest:','£1,750'],['Total:','£11,750']]
      ]]},
      {h:'History of Interest Calculation', p:'The concept of charging interest on loans is ancient. Babylonian clay tablets from around 2000 BCE record loans with interest rates, typically 20% for silver loans and 33% for grain loans. The practice of charging interest was controversial in many ancient societies — Aristotle condemned it as unnatural, and medieval Christian, Islamic and Jewish scholars all debated its morality. The mathematical formula I = PRT was used implicitly by merchants and bankers for centuries before being formally stated. The distinction between simple and compound interest became important in the Renaissance with the rise of banking in Italy and the Low Countries.'},
      {h:'Where Simple Interest Is Used', list:['Short-term personal loans','Car loans (some types)','Treasury bills and short-term bonds','Legal judgments (prejudgment interest)','Basic financial literacy education']},
      {h:'Advantages', list:['Simple to calculate and understand','Interest does not compound — predictable linear growth','Suitable for short-term loans where compounding is negligible']},
      {h:'Limitations', list:['Does not account for compounding — underestimates growth for long periods','Most real-world savings and investments use compound interest','Not suitable for long-term financial planning']},
      {h:'Frequently Asked Questions', faq:[
        {q:'When is simple interest used instead of compound interest?', a:'Simple interest is typically used for short-term loans (less than one year), some car loans, and certain types of bonds. For savings accounts, mortgages and long-term investments, compound interest is standard because it reflects the reality that interest, once earned, can be reinvested.'},
        {q:'How is simple interest different from compound interest?', a:'Simple interest only earns interest on the principal: I = PRT. Compound interest earns interest on both the principal and accumulated interest: A = P(1+r/n)^(nt). For a one-year period with annual compounding, they give the same result. The difference grows over time.'},
        {q:'Can I calculate the rate if I know the interest, principal and time?', a:'Yes. Rearrange I = PRT to get R = I / (PT). For example, if you earn £600 interest on £5000 over 3 years, the rate is 600 / (5000 × 3) = 0.04 = 4% per year.'},
        {q:'What if the time is in months instead of years?', a:'Convert months to years by dividing by 12. For example, 6 months = 0.5 years. Then use I = PRT as normal. The calculator expects time in years, so enter 0.5 for 6 months.'},
        {q:'Is simple interest ever better than compound interest?', a:'For borrowers, yes — simple interest results in less total interest than compound interest for the same rate and period. This is why some lenders use simple interest: it makes loans cheaper for the borrower. For savers and investors, compound interest is always better.'}
      ]}
    ]
  },
  'loan-payment-calculator': {
    lead: 'Calculate monthly loan payments using the standard amortization formula. Shows the monthly payment, total payments, total interest and a full amortization schedule.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">🏦</span> Loan Payment Calculator</div>
        <div class="form-row-3"><div class="form-group"><label class="form-label" for="lnP">Loan amount (£)</label><input type="number" class="form-control" id="lnP" placeholder="e.g. 200000" step="any" /></div><div class="form-group"><label class="form-label" for="lnR">Annual rate (%)</label><input type="number" class="form-control" id="lnR" placeholder="e.g. 5" step="any" /></div><div class="form-group"><label class="form-label" for="lnT">Term (years)</label><input type="number" class="form-control" id="lnT" placeholder="e.g. 30" step="any" /></div></div>
        <div class="form-inline"><button class="btn btn-primary" id="lnBtn">Calculate</button><button class="btn btn-ghost" id="lnReset">Clear</button></div>
        <div class="result-area" id="lnResult"></div><div class="error-msg" id="lnError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Loan Amortization?', p:'Amortization is the process of paying off a loan through regular, equal payments over a fixed period. Each payment covers both the interest accrued and a portion of the principal. Early in the loan, most of each payment goes to interest; later, most goes to principal. The standard amortization formula calculates the fixed monthly payment that will exactly pay off the loan by the end of the term.'},
      {h:'How the Calculator Works', p:'The calculator applies the amortization formula M = P[r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual rate / 12), and n is the number of payments (years × 12). It then generates an amortization schedule showing how each payment is split between interest and principal.'},
      {h:'Loan Payment Formula', formulas:[
        ['M = P × [r(1+r)^n] / [(1+r)^n − 1]', ''],
        ['Total Paid = M × n', ''],
        ['Total Interest = (M × n) − P', '']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['£200,000 at 5% for 30 years', [['Input:','P = 200000, r = 0.05/12 = 0.004167, n = 360'],['Formula:','200000 × [0.004167 × 1.004167^360] / [1.004167^360 − 1]'],['Calculation:','200000 × 0.005368 / 3.487'],['Monthly payment:','≈ £1,073.64'],['Total paid:','£386,510'],['Total interest:','£186,510']]],
        ['£50,000 at 6% for 5 years', [['Input:','P = 50000, r = 0.06/12 = 0.005, n = 60'],['Formula:','50000 × [0.005 × 1.005^60] / [1.005^60 − 1]'],['Monthly payment:','≈ £966.64'],['Total paid:','£57,998'],['Total interest:','£7,998']]
      ]]},
      {h:'History of Amortization', p:'The concept of amortized loans — where a fixed payment covers both interest and principal — developed alongside modern banking. Before the 20th century, most loans were interest-only, with the principal due as a lump sum at the end. The amortized mortgage became standard in the United States after the Federal Housing Administration (FHA) popularised the 30-year fixed-rate amortizing mortgage in the 1930s. This made homeownership accessible to millions by spreading repayment over decades with predictable monthly payments.'},
      {h:'Where Loan Calculations Are Used', list:['Mortgages and home loans','Car and vehicle financing','Personal and consolidation loans','Student loans','Business and commercial loans']},
      {h:'Advantages', list:['Fixed monthly payments make budgeting predictable','Amortization ensures the loan is fully paid off by the end of the term','The schedule shows exactly how much interest vs principal is paid each month']},
      {h:'Limitations', list:['Assumes a fixed interest rate — variable-rate loans (ARMs) change over time','Does not account for extra payments, fees or insurance','Real loans may have origination fees, closing costs and other charges not included in the principal']},
      {h:'Frequently Asked Questions', faq:[
        {q:'How is the monthly interest rate calculated?', a:'The monthly rate is the annual rate divided by 12. For example, a 6% annual rate gives a 0.5% monthly rate (0.06/12 = 0.005). This is standard for most consumer loans and mortgages.'},
        {q:'What happens if I make extra payments?', a:'Extra payments reduce the principal faster, which reduces the total interest and shortens the loan term. This calculator does not simulate extra payments, but the effect is significant: even small additional monthly payments can save thousands in interest over a 30-year mortgage.'},
        {q:'What is the difference between APR and interest rate?', a:'The interest rate is the cost of borrowing the principal. The APR (Annual Percentage Rate) includes the interest rate plus fees and other costs, giving a more complete picture of the loan\'s true cost. APR is always higher than or equal to the interest rate.'},
        {q:'How much of my early payments go to interest?', a:'In the early years of a loan, most of each payment goes to interest. For a 30-year mortgage at 5%, the first payment might be 83% interest and only 17% principal. Over time, this ratio reverses — by the final years, almost the entire payment goes to principal.'},
        {q:'Can I use this for a variable-rate loan?', a:'This calculator assumes a fixed rate. For variable-rate loans (like adjustable-rate mortgages), the payment changes when the rate changes. You would need to recalculate at each rate adjustment, which this calculator does not handle.'}
      ]}
    ]
  },
  'gpa-calculator': {
    lead: 'Calculate weighted GPA from course grades and credit hours. Supports the common 4.0 grading scale and allows adding or removing courses dynamically.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">🎓</span> GPA Calculator</div>
        <div id="gpaRows"></div>
        <div class="form-inline" style="margin-bottom: 1rem;"><button class="btn btn-outline btn-sm" id="gpaAddRow">+ Add Course</button></div>
        <div class="form-inline"><button class="btn btn-primary" id="gpaBtn">Calculate GPA</button><button class="btn btn-ghost" id="gpaReset">Clear All</button></div>
        <div class="result-area" id="gpaResult"></div><div class="error-msg" id="gpaError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is GPA?', p:'Grade Point Average (GPA) is a standardised way of measuring academic performance. Each course is assigned a grade point value (e.g., A = 4.0, B = 3.0), and the GPA is the weighted average of these grade points, weighted by the credit hours of each course. A GPA of 4.0 represents straight A\'s; a GPA of 2.0 represents a C average.'},
      {h:'How the Calculator Works', p:'Enter each course name (optional), select a letter grade, and enter the credit hours. The calculator multiplies each grade point by its credit hours, sums these products, and divides by the total credit hours to get the weighted GPA. You can add as many courses as needed.'},
      {h:'GPA Grading Scale', formulas:[
        ['A = 4.0, A− = 3.7', ''],
        ['B+ = 3.3, B = 3.0, B− = 2.7', ''],
        ['C+ = 2.3, C = 2.0, C− = 1.7', ''],
        ['D = 1.0, F = 0.0', ''],
        ['GPA = Σ(grade point × credit hours) / Σ(credit hours)', 'weighted average']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['GPA with 3 courses', [['Course 1:','A (4.0) × 3 credits = 12.0'],['Course 2:','B (3.0) × 4 credits = 12.0'],['Course 3:','C (2.0) × 3 credits = 6.0'],['Total points:','12 + 12 + 6 = 30.0'],['Total credits:','3 + 4 + 3 = 10'],['GPA:','30 / 10 = 3.0']]],
        ['GPA with 4 courses', [['Course 1:','A (4.0) × 3 = 12.0'],['Course 2:','A− (3.7) × 3 = 11.1'],['Course 3:','B+ (3.3) × 4 = 13.2'],['Course 4:','B (3.0) × 2 = 6.0'],['Total:','42.3 / 12 = 3.53']]
      ]]},
      {h:'History of GPA and Academic Grading', p:'The practice of assigning grades to academic work has roots in the Cambridge University system of the 18th century, where numerical scales were used to rank students. The letter-grade system (A, B, C, D, F) was popularised in the United States in the late 19th century. The 4.0 GPA scale became standard in American universities in the mid-20th century. <strong>William Farish</strong>, a tutor at Cambridge University, is sometimes credited with developing the concept of grading as a way to assess students systematically, though the historical evidence is debated. Different countries use different scales: the UK uses class divisions (First, Upper Second, etc.), India uses percentages, and Germany uses a 1-5 scale (where 1 is the highest).'},
      {h:'Where GPA Is Used', list:['University admissions and transfers','Scholarship and academic award eligibility','Graduate school applications','Academic probation and progress tracking','International education comparisons']},
      {h:'Advantages', list:['Provides a single number to summarise academic performance','Weighted by credit hours, so harder courses count more','Standardised scale enables comparison across institutions']},
      {h:'Limitations', list:['Different institutions use different scales (4.0, 5.0, percentage, etc.) — always check your institution\'s policy','Does not account for course difficulty beyond credit hours','A single number cannot capture the full picture of a student\'s abilities']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What grading scale does this calculator use?', a:'The calculator uses the standard 4.0 scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D = 1.0, F = 0.0. Some institutions use slightly different values (e.g., A+ = 4.3 or no A−). Always check your institution\'s specific grading policy.'},
        {q:'How are credit hours used in the calculation?', a:'Credit hours weight each grade: a 4-credit course counts twice as much as a 2-credit course. The GPA is the weighted average: Σ(grade point × credit hours) / Σ(credit hours). This ensures that a B in a 4-credit course has more impact than a B in a 2-credit course.'},
        {q:'What is a good GPA?', a:'On the 4.0 scale, a GPA of 3.0 (B average) is generally considered satisfactory. A GPA of 3.5 or above is typically required for honours programs and competitive graduate schools. A perfect 4.0 represents all A grades. However, what counts as "good" depends on the institution and program.'},
        {q:'Can I calculate GPA for a single semester?', a:'Yes. Enter only the courses from that semester. To calculate cumulative GPA, enter all courses from all semesters. The calculator works the same way — it just depends on which courses you include.'},
        {q:'How do I handle courses with different grading systems?', a:'If your institution uses a different scale (e.g., percentage grades or a 5.0 scale), you need to convert each grade to the 4.0 scale first. Some institutions provide conversion tables. This calculator is designed for the standard 4.0 scale used by most US institutions.'}
      ]}
    ]
  },
  'permutation-combination-calculator': {
    lead: 'Calculate permutations (nPr) and combinations (nCr). Explains the difference between arrangements where order matters and selections where it does not.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">nCr</span> Permutation &amp; Combination Calculator</div>
        <div class="form-row"><div class="form-group"><label class="form-label" for="pcN">n (total items)</label><input type="number" class="form-control" id="pcN" placeholder="e.g. 8" step="1" min="0" /></div><div class="form-group"><label class="form-label" for="pcR">r (selected)</label><input type="number" class="form-control" id="pcR" placeholder="e.g. 3" step="1" min="0" /></div></div>
        <div class="form-inline"><button class="btn btn-primary" id="pcBtn">Calculate</button><button class="btn btn-ghost" id="pcReset">Clear</button></div>
        <div class="result-area" id="pcResult"></div><div class="error-msg" id="pcError" role="alert"></div>
      </div>`,
    sections: [
      {h:'Permutations vs Combinations', p:'A <strong>permutation</strong> is an arrangement of items where order matters. A <strong>combination</strong> is a selection of items where order does not matter. For example, choosing 3 people from 8 for a committee is a combination (the committee is the same regardless of order). Arranging 3 people from 8 in a line is a permutation (ABC is different from BAC).'},
      {h:'How the Calculator Works', p:'Enter n (total items) and r (items selected). The calculator computes nPr = n!/(n−r)! and nCr = n!/(r!(n−r)!) using factorial arithmetic, then displays both results with the formulas and step-by-step working.'},
      {h:'Permutation and Combination Formulas', formulas:[
        ['nPr = n! / (n − r)!', 'order matters'],
        ['nCr = n! / (r! × (n − r)!)', 'order does not matter'],
        ['nCr = nPr / r!', 'relationship between them']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['8P3 — arranging 3 from 8', [['Input:','n = 8, r = 3'],['Formula:','8! / (8−3)! = 8! / 5!'],['Calculation:','8 × 7 × 6 = 336'],['Result:','336 permutations']]],
        ['8C3 — choosing 3 from 8', [['Input:','n = 8, r = 3'],['Formula:','8! / (3! × 5!)'],['Calculation:','336 / 6 = 56'],['Result:','56 combinations']]
      ]]},
      {h:'History of Combinatorics', p:'The study of permutations and combinations has roots in ancient mathematics. The Indian mathematician <strong>Pingala</strong> (c. 200 BCE) described binary combinations in the context of Sanskrit poetry meters. <strong>Bhaskara II</strong> (12th century) gave rules for calculating permutations and combinations. In the Islamic world, al-Khalil (8th century) and later mathematicians studied combinatorics for cryptography and linguistics. Pascal\'s triangle, which gives binomial coefficients (equivalent to nCr), was known to Chinese mathematicians in the 13th century and to Pascal in the 17th century. The modern notation nPr and nCr was standardised in the 19th and 20th centuries.'},
      {h:'Where Permutations and Combinations Are Used', list:['Probability and statistics','Password and PIN security analysis','Scheduling and operations research','Game theory and decision analysis','Genetics and DNA sequence analysis']},
      {h:'Advantages', list:['Exact counting of arrangements and selections','Foundation of probability theory','Pascal\'s triangle provides a quick visual reference for nCr']},
      {h:'Limitations', list:['Factorials grow extremely fast — n! exceeds JavaScript\'s number limit for n > 170','Assumes all items are distinct — repeated items require multinomial formulas','Large n and r can produce astronomically large numbers']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between nPr and nCr?', a:'nPr counts arrangements where order matters (e.g.,排列ing people in a line). nCr counts selections where order does not matter (e.g., choosing people for a committee). nCr is always less than or equal to nPr because there are fewer ways to choose than to arrange.'},
        {q:'When do I use permutations vs combinations?', a:'Use permutations when the order of selection matters (e.g., race rankings, password arrangements, seating orders). Use combinations when order does not matter (e.g., choosing a team, selecting lottery numbers, picking items from a menu).'},
        {q:'Why is nCr = nPr / r!?', a:'Because for each combination of r items, there are r! ways to arrange them. So the number of permutations is r! times the number of combinations. Dividing nPr by r! gives nCr.'},
        {q:'What happens when r = 0?', a:'nP0 = 1 and nC0 = 1. There is exactly one way to arrange or choose zero items — by doing nothing. This is consistent with 0! = 1.'},
        {q:'Can n or r be negative?', a:'No. Both n and r must be non-negative integers, and r must not exceed n. The calculator will show an error if you enter invalid values.'}
      ]}
    ]
  },
  'factorial-calculator': {
    lead: 'Calculate n! = n × (n−1) × … × 1 for any non-negative integer. Handles 0! = 1 correctly and supports large numbers using BigInt.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">n!</span> Factorial Calculator</div>
        <div class="form-group"><label class="form-label" for="facN">Enter a non-negative integer n</label><input type="number" class="form-control" id="facN" placeholder="e.g. 10" step="1" min="0" /></div>
        <div class="form-inline"><button class="btn btn-primary" id="facBtn">Calculate</button><button class="btn btn-ghost" id="facReset">Clear</button></div>
        <div class="result-area" id="facResult"></div><div class="error-msg" id="facError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is a Factorial?', p:'The factorial of a non-negative integer n, written n!, is the product of all positive integers from 1 to n. So n! = n × (n−1) × (n−2) × … × 2 × 1. By definition, 0! = 1. Factorials grow extremely fast: 10! = 3,628,800, 20! ≈ 2.43 × 10¹⁸, and 100! has 158 digits. Factorials are central to combinatorics, probability and series expansions.'},
      {h:'How the Calculator Works', p:'Enter a non-negative integer and the calculator computes its factorial. For n ≤ 170, it uses standard JavaScript numbers. For larger values, it uses BigInt to handle arbitrarily large results. It also displays the expanded multiplication for small n.'},
      {h:'Factorial Formula', formulas:[
        ['n! = n × (n−1) × (n−2) × … × 2 × 1', 'for n ≥ 1'],
        ['0! = 1', 'by definition'],
        ['n! = n × (n−1)!', 'recursive definition']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['5!', [['Expansion:','5 × 4 × 3 × 2 × 1'],['Calculation:','120'],['Result:','5! = 120']]],
        ['10!', [['Expansion:','10 × 9 × 8 × 7 × 6 × 5 × 4 × 3 × 2 × 1'],['Result:','10! = 3,628,800']]]
      ]]},
      {h:'History of Factorial Notation', p:'The concept of factorial has been used since ancient times in combinatorial calculations, but the notation n! was introduced by the French mathematician <strong>Christian Kramp</strong> in 1808. Earlier notations included Π(n) and various other symbols. The property 0! = 1 was established for consistency with the combinatorial interpretation: there is exactly one way to arrange zero objects (the empty arrangement). Factorials appear in the binomial theorem, Taylor series, the Poisson distribution and countless other mathematical contexts.'},
      {h:'Where Factorials Are Used', list:['Combinatorics (permutations, combinations)','Probability (Poisson, binomial distributions)','Series expansions (Taylor, Maclaurin series)','Algebra (binomial theorem)','Statistics (gamma function, a continuous extension of factorial)']},
      {h:'Advantages', list:['Exact computation for any non-negative integer','BigInt handles arbitrarily large results','Foundation for combinatorics and probability']},
      {h:'Limitations', list:['Only defined for non-negative integers (the gamma function extends it to real/complex numbers)','Factorials grow so fast that even BigInt results become impractical for very large n','No simple closed-form expression exists for n!']},
      {h:'Frequently Asked Questions', faq:[
        {q:'Why is 0! equal to 1?', a:'By definition, 0! = 1. This is consistent with the combinatorial interpretation: there is exactly one way to arrange zero objects (the empty arrangement). It also makes the recursive formula n! = n × (n−1)! work for n = 1 (1! = 1 × 0! = 1 × 1 = 1).'},
        {q:'How large can n be?', a:'For standard JavaScript numbers, n can be up to 170 (170! ≈ 7.26 × 10³⁰⁶, near the limit of floating-point). For larger n, the calculator uses BigInt, which can handle arbitrarily large integers — but the results become extremely long (100! has 158 digits).'},
        {q:'What is the gamma function?', a:'The gamma function Γ(z) extends the factorial to real and complex numbers: Γ(n) = (n−1)! for positive integers n. It is defined by an integral and allows factorials of non-integer values, which is important in calculus and statistics.'},
        {q:'How are factorials used in probability?', a:'Factorials appear in the formulas for permutations (nPr = n!/(n−r)!), combinations (nCr = n!/(r!(n−r)!)), and the binomial distribution. They count the number of ways to arrange or select items, which is the foundation of probability theory.'},
        {q:'Can I calculate factorials of negative numbers?', a:'No. The factorial is only defined for non-negative integers. The gamma function can be evaluated at negative non-integer values, but it has poles (undefined values) at negative integers. The calculator will show an error for negative input.'}
      ]}
    ]
  },
  'exponent-power-calculator': {
    lead: 'Calculate a^b including positive, negative and fractional exponents and roots. Explains exponent laws with formulas and step-by-step examples.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">aᵇ</span> Exponent &amp; Power Calculator</div>
        <div class="form-row"><div class="form-group"><label class="form-label" for="expBase">Base (a)</label><input type="number" class="form-control" id="expBase" placeholder="e.g. 2" step="any" /></div><div class="form-group"><label class="form-label" for="expExp">Exponent (b)</label><input type="number" class="form-control" id="expExp" placeholder="e.g. 10" step="any" /></div></div>
        <div class="form-inline"><button class="btn btn-primary" id="expBtn">Calculate</button><button class="btn btn-ghost" id="expReset">Clear</button></div>
        <div class="result-area" id="expResult"></div><div class="error-msg" id="expError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Are Exponents and Powers?', p:'An exponent (or power) represents repeated multiplication. The expression a^b means "a multiplied by itself b times." For example, 2³ = 2 × 2 × 2 = 8. The base (a) is the number being multiplied, and the exponent (b) tells how many times to multiply it. Exponents extend to negative powers (a⁻ⁿ = 1/aⁿ), fractional powers (a^(1/2) = √a, the square root), and zero (a⁰ = 1 for any a ≠ 0).'},
      {h:'How the Calculator Works', p:'Enter a base and an exponent. The calculator computes a^b using JavaScript\'s Math.pow() function, which handles positive, negative, zero and fractional exponents. It validates inputs and displays the result with the formula shown.'},
      {h:'Exponent Laws', formulas:[
        ['a^m × a^n = a^(m+n)', 'product of powers'],
        ['a^m / a^n = a^(m−n)', 'quotient of powers'],
        ['(a^m)^n = a^(m×n)', 'power of a power'],
        ['a^0 = 1 (for a ≠ 0)', 'zero exponent'],
        ['a^(-n) = 1 / a^n', 'negative exponent'],
        ['a^(1/n) = ⁿ√a', 'fractional exponent (root)']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['2¹⁰ (powers of 2)', [['Input:','base = 2, exponent = 10'],['Calculation:','2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2'],['Result:','1024']]],
        ['9^0.5 (square root as exponent)', [['Input:','base = 9, exponent = 0.5'],['Formula:','9^(1/2) = √9'],['Result:','3']]
      ]]},
      {h:'History of Exponent Notation', p:'The modern superscript notation for exponents was introduced by <strong>René Descartes</strong> in his <em>La Géométrie</em> (1637), where he wrote x², x³, etc. Before Descartes, <strong>Nicolas Chuquet</strong> (1484) used a form of exponent notation in his manuscript <em>Triparty en la science des nombres</em>, writing 12³ as "12³." The concept of powers was known to ancient Greek mathematicians — Euclid described powers geometrically — and to Islamic mathematicians like al-Karaji (c. 1000 CE), who proved the binomial theorem for integer exponents. The extension to negative and fractional exponents was developed by John Wallis and Isaac Newton in the 17th century, leading to the general theory of exponential functions.'},
      {h:'Where Exponents Are Used', list:['Compound interest and exponential growth','Physics (inverse square laws, radioactive decay)','Computer science (binary, algorithmic complexity)','Biology (population growth models)','Finance (continuous compounding, e^rt)']},
      {h:'Advantages', list:['Handles positive, negative, zero and fractional exponents','Fractional exponents provide a unified way to compute roots','Exponent laws simplify complex algebraic expressions']},
      {h:'Limitations', list:['0^0 is mathematically undefined (the calculator returns 1 by convention, but this is debated)','Negative bases with fractional exponents may produce complex results','Very large exponents can overflow to Infinity']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What does a negative exponent mean?', a:'A negative exponent means "one over the positive power." So a^(-n) = 1 / a^n. For example, 2^(-3) = 1 / 2³ = 1/8 = 0.125. Negative exponents represent reciprocals.'},
        {q:'What is a fractional exponent?', a:'A fractional exponent represents a root. a^(1/n) = ⁿ√a (the nth root of a). For example, 8^(1/3) = ∛8 = 2. More generally, a^(m/n) = (ⁿ√a)^m. So 9^(3/2) = (√9)³ = 3³ = 27.'},
        {q:'Why is anything to the power of 0 equal to 1?', a:'By the quotient rule: a^m / a^m = a^(m−m) = a^0. But a^m / a^m = 1 (anything divided by itself is 1). So a^0 = 1. This holds for any a ≠ 0. The case 0^0 is undefined because it leads to a contradiction.'},
        {q:'What is the difference between a power and a root?', a:'A power (a^n) is repeated multiplication: a × a × … × a (n times). A root (√a) is the inverse operation — it asks "what number, multiplied by itself n times, gives a?" Fractional exponents connect the two: a^(1/n) = ⁿ√a.'},
        {q:'How does the calculator handle very large exponents?', a:'For very large exponents (e.g., 2^1000), the result may overflow to Infinity because JavaScript numbers have a maximum value of about 1.8 × 10³⁰⁸. For exact large-integer results, use the Factorial Calculator or a BigInt-based tool.'}
      ]}
    ]
  },
  'logarithm-calculator': {
    lead: 'Calculate log base 10, natural logarithm (ln) and arbitrary base logarithms. Explains logarithmic scales like pH, Richter and decibels.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">log</span> Logarithm Calculator</div>
        <div class="form-group"><label class="form-label" for="logType">Logarithm type</label><select class="form-control" id="logType"><option value="log10">log₁₀ (common log)</option><option value="ln">ln (natural log)</option><option value="custom">Custom base</option></select></div>
        <div class="form-row" id="logCustomBase" style="display:none;"><div class="form-group"><label class="form-label" for="logBase">Base (b)</label><input type="number" class="form-control" id="logBase" placeholder="e.g. 2" step="any" /></div></div>
        <div class="form-group"><label class="form-label" for="logX">Value (x)</label><input type="number" class="form-control" id="logX" placeholder="e.g. 1000" step="any" /></div>
        <div class="form-inline"><button class="btn btn-primary" id="logBtn">Calculate</button><button class="btn btn-ghost" id="logReset">Clear</button></div>
        <div class="result-area" id="logResult"></div><div class="error-msg" id="logError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is a Logarithm?', p:'A logarithm is the inverse of exponentiation. If b^y = x, then log_b(x) = y — the logarithm asks "what power do I raise b to, to get x?" For example, log₁₀(1000) = 3 because 10³ = 1000. The natural logarithm (ln) uses base e (≈ 2.71828) and appears throughout calculus and continuous growth models.'},
      {h:'How the Calculator Works', p:'Select the logarithm type (log₁₀, ln or custom base), enter the value, and the calculator computes the result. For custom bases, it uses the change-of-base formula: log_b(x) = ln(x) / ln(b). It validates that the value is positive and the base is positive and not 1.'},
      {h:'Logarithm Formulas', formulas:[
        ['log_b(x) = y means b^y = x', 'definition'],
        ['log_b(x) = ln(x) / ln(b)', 'change of base'],
        ['log₁₀(x) = ln(x) / ln(10)', 'common log'],
        ['log(xy) = log(x) + log(y)', 'product rule'],
        ['log(x^n) = n × log(x)', 'power rule']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['log₁₀(1000)', [['Input:','x = 1000, base = 10'],['Question:','10^? = 1000?'],['Answer:','10³ = 1000, so log₁₀(1000) = 3']]],
        ['ln(e²)', [['Input:','x = e² ≈ 7.389, base = e'],['Question:','e^? = e²?'],['Answer:','ln(e²) = 2']]]
      ]]},
      {h:'History of Logarithms', p:'Logarithms were invented by the Scottish mathematician <strong>John Napier</strong>, who published his work in 1614 in <em>Mirifici Logarithmorum Canonis Descriptio</em>. Napier\'s goal was to simplify astronomical calculations by converting multiplication into addition — a task that took years of manual computation before calculators existed. <strong>Henry Briggs</strong> visited Napier in 1615 and proposed the base-10 (common) logarithm, which he published in 1624. Independently, the Swiss clockmaker <strong>Joost Bürgi</strong> developed a similar system, published in 1620. The slide rule, based on logarithmic scales, became the essential calculation tool for scientists and engineers for over 300 years until electronic calculators replaced it in the 1970s.'},
      {h:'Where Logarithms Are Used', list:['pH scale (acidity): pH = -log₁₀[H⁺]','Richter scale (earthquakes): logarithmic','Decibels (sound): dB = 10 × log₁₀(intensity ratio)','Finance: continuous compounding and exponential models','Computer science: binary logarithms, algorithmic complexity (log n)']},
      {h:'Advantages', list:['Converts multiplication into addition, simplifying complex calculations','Logarithmic scales compress huge ranges into manageable numbers','Foundation of calculus (derivative of e^x is e^x, derivative of ln(x) is 1/x)']},
      {h:'Limitations', list:['Logarithms are only defined for positive values — log of zero or negative numbers is undefined (in real numbers)','Base 1 is invalid because 1^y = 1 for all y, so no unique logarithm exists','Results are often irrational (e.g., log₁₀(2) = 0.30103...) requiring rounding']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between log and ln?', a:'log (without a base) usually means log₁₀ (base 10, the common logarithm). ln means logₑ (base e ≈ 2.718, the natural logarithm). log₁₀ is used in scales like pH and decibels; ln is used in calculus and continuous growth models.'},
        {q:'How do I calculate a logarithm with an arbitrary base?', a:'Use the change-of-base formula: log_b(x) = ln(x) / ln(b). For example, log₂(8) = ln(8) / ln(2) = 2.079 / 0.693 = 3. The calculator does this automatically when you select "Custom base."'},
        {q:'Why can\'t I take the log of a negative number?', a:'In real numbers, logarithms are only defined for positive values. This is because b^y is always positive for positive b, so there is no y such that b^y = a negative number. In complex numbers, logarithms of negative numbers do exist but produce complex results.'},
        {q:'What is a logarithmic scale?', a:'A logarithmic scale represents equal ratios as equal distances. Each step multiplies by a constant factor rather than adding. The Richter scale is logarithmic: a magnitude 6 earthquake is 10 times more powerful than magnitude 5, not 1 unit more. This compresses enormous ranges into manageable numbers.'},
        {q:'How did logarithms help before calculators?', a:'Before electronic calculators, multiplying large numbers was extremely tedious. Logarithms convert multiplication into addition: a × b = 10^(log(a) + log(b)). You look up log(a) and log(b) in a table, add them, then look up the antilog. Slide rules work on the same principle, using physical logarithmic scales.'}
      ]}
    ]
  },
  'trigonometry-calculator': {
    lead: 'Calculate sin, cos, tan and inverse trigonometric functions in degrees or radians. Explains the unit circle and trigonometric identities.',
    calcHTML: `<div class="calc-card">
        <div class="calc-title"><span class="icon">sin</span> Trigonometry Calculator</div>
        <div class="form-group"><label class="form-label" for="trigMode">Angle mode</label><select class="form-control" id="trigMode"><option value="deg">Degrees</option><option value="rad">Radians</option></select></div>
        <div class="form-group"><label class="form-label" for="trigFunc">Function</label><select class="form-control" id="trigFunc"><option value="sin">sin</option><option value="cos">cos</option><option value="tan">tan</option><option value="asin">arcsin</option><option value="acos">arccos</option><option value="atan">arctan</option></select></div>
        <div class="form-group"><label class="form-label" for="trigVal">Value</label><input type="number" class="form-control" id="trigVal" placeholder="e.g. 30" step="any" /></div>
        <div class="form-inline"><button class="btn btn-primary" id="trigBtn">Calculate</button><button class="btn btn-ghost" id="trigReset">Clear</button></div>
        <div class="result-area" id="trigResult"></div><div class="error-msg" id="trigError" role="alert"></div>
      </div>`,
    sections: [
      {h:'What Is Trigonometry?', p:'Trigonometry is the study of the relationships between the angles and sides of triangles, particularly right triangles. The three fundamental functions — sine (sin), cosine (cos) and tangent (tan) — relate an angle to ratios of sides in a right triangle. In a right triangle with angle θ: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. These functions extend beyond triangles to describe periodic phenomena like waves, oscillations and circular motion.'},
      {h:'The Unit Circle', p:'The unit circle is a circle of radius 1 centred at the origin. For any angle θ, the point on the unit circle at that angle has coordinates (cos θ, sin θ). This provides a way to define trigonometric functions for any angle, not just those between 0° and 90°. The tangent is sin/cos. The unit circle also reveals the periodic nature of trig functions: sin and cos repeat every 360° (or 2π radians).'},
      {h:'How the Calculator Works', p:'Select the angle mode (degrees or radians), choose a function (sin, cos, tan or their inverses), enter a value, and the calculator computes the result. For inverse functions, it returns the result in the selected mode. It validates inputs — for example, arcsin and arccos require inputs between -1 and 1.'},
      {h:'Trigonometric Formulas and Identities', formulas:[
        ['sin(θ) = opposite / hypotenuse', 'right triangle'],
        ['cos(θ) = adjacent / hypotenuse', 'right triangle'],
        ['tan(θ) = sin(θ) / cos(θ) = opposite / adjacent', 'right triangle'],
        ['sin²(θ) + cos²(θ) = 1', 'Pythagorean identity'],
        ['sin(A+B) = sin(A)cos(B) + cos(A)sin(B)', 'angle addition'],
        ['π radians = 180°', 'conversion']
      ]},
      {h:'Step-by-Step Examples', examples:[
        ['sin(30°)', [['Input:','30 degrees'],['On unit circle:','30° → (cos 30°, sin 30°) = (0.866, 0.5)'],['Result:','sin(30°) = 0.5']]],
        ['arctan(1)', [['Input:','1 (ratio of opposite/adjacent)'],['Question:','tan(?) = 1?'],['Answer:','tan(45°) = 1, so arctan(1) = 45° or π/4 radians']]
      ]]},
      {h:'History of Trigonometry', p:'Trigonometry originated in the study of astronomy and navigation. The Greek astronomer <strong>Hipparchus</strong> (c. 150 BCE) is considered the founder of trigonometry — he compiled the first known trigonometric table for use in astronomy. <strong>Ptolemy</strong> expanded this in his <em>Almagest</em> (c. 150 CE), which remained the authoritative astronomical text for over 1000 years. The Indian mathematician <strong>Aryabhata</strong> (5th century CE) defined the sine function as we know it today. Islamic mathematicians, particularly al-Battani and Abu\'l-Wafa, extended trigonometry with new functions and tables. In Europe, trigonometry was developed further by Regiomontanus (15th century) and became essential for navigation during the Age of Exploration. The unit circle definition, which generalises trig functions beyond right triangles, was formalised by Euler in the 18th century.'},
      {h:'Where Trigonometry Is Used', list:['Navigation and GPS','Computer graphics (rotations, 3D rendering)','Physics (waves, oscillations, circular motion)','Engineering (structural analysis, electrical signals)','Music (sound waves and harmonics)']},
      {h:'Advantages', list:['Describes periodic phenomena naturally','Connects geometry to algebra through the unit circle','Essential for calculus, physics and engineering']},
      {h:'Limitations', list:['tan(90°) is undefined (division by zero as cos(90°) = 0)','Inverse trig functions return principal values only (e.g., arcsin returns values in [-90°, 90°])','Floating-point arithmetic can cause small errors (e.g., sin(180°) ≈ 1.2 × 10⁻¹⁶ instead of 0)']},
      {h:'Frequently Asked Questions', faq:[
        {q:'What is the difference between degrees and radians?', a:'Degrees divide a full circle into 360 units; radians measure the arc length on a unit circle (a full circle = 2π ≈ 6.283 radians). Radians are the natural unit for calculus because the derivative of sin(x) is cos(x) only when x is in radians. 180° = π radians.'},
        {q:'What is the unit circle?', a:'The unit circle is a circle of radius 1. For any angle θ, the point on the circle at that angle has coordinates (cos θ, sin θ). This lets us define sin and cos for any angle, not just those in a right triangle, and reveals their periodic nature.'},
        {q:'Why is tan(90°) undefined?', a:'tan(θ) = sin(θ)/cos(θ). At 90°, cos(90°) = 0, so tan(90°) = 1/0, which is undefined. Geometrically, as the angle approaches 90°, the opposite side grows without bound while the adjacent side shrinks to zero.'},
        {q:'What are inverse trigonometric functions?', a:'Inverse trig functions "undo" the trig functions: arcsin(y) returns the angle whose sine is y. They are also written sin⁻¹, cos⁻¹, tan⁻¹. Each returns a principal value: arcsin in [-90°, 90°], arccos in [0°, 180°], arctan in [-90°, 90°].'},
        {q:'What is the Pythagorean identity?', a:'sin²(θ) + cos²(θ) = 1. This follows directly from the unit circle: the point (cos θ, sin θ) is on a circle of radius 1, so by the Pythagorean theorem, cos²θ + sin²θ = 1² = 1. This identity is the foundation of many other trig identities.'}
      ]}
    ]
  }
};

// ── Generate remaining content (11-30) ──
for (const slug in remainingContent) {
  const rc = remainingContent[slug];
  const calc = calcs.find(c => c.slug === slug);
  if (!calc) continue;

  let sectionsHTML = '';
  for (const sec of rc.sections) {
    if (sec.h) sectionsHTML += `\n      <section class="content-section">\n        <h2>${sec.h}</h2>`;
    if (sec.p) sectionsHTML += `\n        <p>${sec.p}</p>`;
    if (sec.formulas) {
      for (const f of sec.formulas) {
        if (f[0].startsWith('<')) {
          // legend items
          sectionsHTML += `\n        <div class="formula-legend">\n`;
          // This is the legend — but we already output it differently
          // Actually, let's handle this differently
          continue;
        }
        sectionsHTML += `\n        <div class="formula-box"><div class="formula">${f[0]}</div></div>`;
      }
      // Output legend if last entries are legend items
      const legendItems = sec.formulas.filter(f => f[0].startsWith('<'));
      if (legendItems.length > 0) {
        sectionsHTML += `\n        <div class="formula-legend">\n${legendItems.map(l => `          <span>${l[0]}</span>`).join('\n')}\n        </div>`;
      }
    }
    if (sec.examples) {
      for (const ex of sec.examples) {
        sectionsHTML += `\n        <div class="example-box">\n          <h4>${ex[0]}</h4>`;
        for (const step of ex[1]) {
          sectionsHTML += `\n          <div class="example-step"><strong>${step[0]}</strong> ${step[1]}</div>`;
        }
        sectionsHTML += `\n        </div>`;
      }
    }
    if (sec.list) {
      sectionsHTML += `\n        <ul>\n${sec.list.map(l => `          <li>${l}</li>`).join('\n')}\n        </ul>`;
    }
    if (sec.faq) {
      sectionsHTML += `\n      </section>\n      <section class="faq-section">\n        <h2>${sec.h}</h2>`;
      for (const q of sec.faq) {
        sectionsHTML += `\n        <div class="faq-item">\n          <button class="faq-question" aria-expanded="false">${q.q} <span class="chevron">▾</span></button>\n          <div class="faq-answer"><div class="faq-answer-inner">${q.a}</div></div>\n        </div>`;
      }
    }
    sectionsHTML += `\n      </section>`;
  }

  contentGen[calc.jsType] = {
    lead: rc.lead,
    calc: rc.calcHTML,
    sections: sectionsHTML
  };
}

// ── Generate all HTML pages ──
let count = 0;
for (const c of calcs) {
  const content = contentGen[c.jsType];
  if (!content) { console.error('No content for:', c.slug); continue; }
  const html = genPage(c, content);
  fs.writeFileSync(path.join(PAGES_DIR, c.slug + '.html'), html);
  count++;
}
console.log(`Generated ${count} HTML pages`);

// ── Generate all JS files ──
// We'll create a comprehensive JS file for each calculator type
const jsGenerators = require('./js-gen.js');
let jsCount = 0;
for (const c of calcs) {
  const js = jsGenerators[c.jsType];
  if (!js) { console.error('No JS for:', c.slug, c.jsType); continue; }
  fs.writeFileSync(path.join(JS_DIR, c.jsFile), js);
  jsCount++;
}
console.log(`Generated ${jsCount} JS files`);
console.log('Done!');
