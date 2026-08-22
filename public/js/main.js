/* ==========================================================================
   CalcVerse — main.js
   Shared: navigation, search, dark mode, FAQ accordion, utility helpers
   ========================================================================== */

/* ---- Calculator registry (used by search + homepage) ---- */
const CALCULATORS = [
  { slug: 'scientific-calculator', name: 'Scientific Calculator', category: 'General', icon: '🧮', desc: 'Full scientific calculator with trig, logs, powers, memory and history.' },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', category: 'Everyday', icon: '％', desc: 'Calculate percentages, increases, decreases and differences.' },
  { slug: 'fraction-calculator', name: 'Fraction Calculator', category: 'Math', icon: '½', desc: 'Add, subtract, multiply and divide fractions and mixed numbers.' },
  { slug: 'quadratic-equation-calculator', name: 'Quadratic Equation Calculator', category: 'Math', icon: 'x²', desc: 'Solve ax² + bx + c = 0 with real and complex roots.' },
  { slug: 'algebra-calculator', name: 'Algebra Calculator', category: 'Math', icon: '𝑥', desc: 'Simplify and solve linear and quadratic equations step by step.' },
  { slug: 'matrix-calculator', name: 'Matrix Calculator', category: 'Advanced', icon: '⊞', desc: 'Add, subtract, multiply, transpose, determinant and inverse.' },
  { slug: 'statistics-calculator', name: 'Statistics Calculator', category: 'Statistics', icon: '📊', desc: 'Mean, median, mode, variance, range and standard deviation.' },
  { slug: 'probability-calculator', name: 'Probability Calculator', category: 'Statistics', icon: '🎲', desc: 'Basic, conditional and independent-event probability.' },
  { slug: 'standard-deviation-calculator', name: 'Standard Deviation Calculator', category: 'Statistics', icon: 'σ', desc: 'Population and sample standard deviation from a dataset.' },
  { slug: 'mean-median-mode-calculator', name: 'Mean, Median & Mode Calculator', category: 'Statistics', icon: 'x̄', desc: 'Calculate mean, median, mode and range of a dataset.' },
  { slug: 'geometry-calculator', name: 'Geometry Calculator', category: 'Geometry', icon: '△', desc: 'Area and perimeter for common 2D shapes.' },
  { slug: 'triangle-calculator', name: 'Triangle Calculator', category: 'Geometry', icon: '△', desc: 'Sides, angles, area and the Pythagorean theorem.' },
  { slug: 'circle-calculator', name: 'Circle Calculator', category: 'Geometry', icon: '◯', desc: 'Radius, diameter, circumference and area of a circle.' },
  { slug: 'area-calculator', name: 'Area Calculator', category: 'Geometry', icon: '▭', desc: 'Area of square, rectangle, triangle, circle and more.' },
  { slug: 'volume-calculator', name: 'Volume Calculator', category: 'Geometry', icon: '⬢', desc: 'Volume of cube, cylinder, cone, sphere and prism.' },
  { slug: 'unit-converter', name: 'Unit Converter', category: 'Everyday', icon: '↔', desc: 'Convert length, area, mass, temperature, speed and more.' },
  { slug: 'age-calculator', name: 'Age Calculator', category: 'Date & Time', icon: '🎂', desc: 'Exact age in years, months and days from a birth date.' },
  { slug: 'date-difference-calculator', name: 'Date Difference Calculator', category: 'Date & Time', icon: '📅', desc: 'Years, months and days between two dates.' },
  { slug: 'time-calculator', name: 'Time Calculator', category: 'Date & Time', icon: '⏱', desc: 'Add, subtract and convert hours, minutes and seconds.' },
  { slug: 'speed-distance-time-calculator', name: 'Speed, Distance & Time Calculator', category: 'Physics', icon: '⚡', desc: 'Solve for speed, distance or time with unit options.' },
  { slug: 'bmi-calculator', name: 'BMI Calculator', category: 'Health', icon: '⚖', desc: 'Body Mass Index from height and weight.' },
  { slug: 'compound-interest-calculator', name: 'Compound Interest Calculator', category: 'Finance', icon: '📈', desc: 'Compound interest with configurable compounding frequency.' },
  { slug: 'simple-interest-calculator', name: 'Simple Interest Calculator', category: 'Finance', icon: '💰', desc: 'Simple interest using I = PRT.' },
  { slug: 'loan-payment-calculator', name: 'Loan Payment Calculator', category: 'Finance', icon: '🏦', desc: 'Monthly loan payment with amortization schedule.' },
  { slug: 'gpa-calculator', name: 'GPA Calculator', category: 'Education', icon: '🎓', desc: 'Weighted GPA from course grades and credit hours.' },
  { slug: 'permutation-combination-calculator', name: 'Permutation & Combination Calculator', category: 'Advanced', icon: 'nCr', desc: 'Permutations (nPr) and combinations (nCr).' },
  { slug: 'factorial-calculator', name: 'Factorial Calculator', category: 'Advanced', icon: 'n!', desc: 'Calculate n! for any non-negative integer.' },
  { slug: 'exponent-power-calculator', name: 'Exponent & Power Calculator', category: 'Math', icon: 'aᵇ', desc: 'Calculate a^b including negative and fractional exponents.' },
  { slug: 'logarithm-calculator', name: 'Logarithm Calculator', category: 'Math', icon: 'log', desc: 'log base 10, natural log and arbitrary base logarithms.' },
  { slug: 'trigonometry-calculator', name: 'Trigonometry Calculator', category: 'Math', icon: 'sin', desc: 'sin, cos, tan and inverse trig in degrees or radians.' },
];

/* ---- Dark mode ---- */
(function initTheme() {
  const stored = localStorage.getItem('calcverse-theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('calcverse-theme', next);
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  /* ---- Mobile menu ---- */
  const menuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  }

  /* ---- Search ---- */
  initSearch('searchInput', 'searchResults');
  initSearch('heroSearchInput', 'heroSearchResults');

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ---- Tabs ---- */
  document.querySelectorAll('.calc-tabs').forEach(tabBar => {
    tabBar.querySelectorAll('.calc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const group = tab.closest('.calc-card') || document;
        group.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
        group.querySelectorAll('.calc-tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = group.querySelector('#' + tab.getAttribute('data-tab'));
        if (panel) panel.classList.add('active');
      });
    });
  });
});

/* ---- Search implementation ---- */
function initSearch(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { results.classList.remove('open'); return; }
    const matches = CALCULATORS.filter(c =>
      c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      results.innerHTML = '<div class="search-no-results">No calculators found.</div>';
    } else {
      results.innerHTML = matches.map(c =>
        `<a class="search-result-item" href="${pagePrefix()}${c.slug}.html">
          <span class="cat-icon">${c.icon}</span>
          <span><span class="res-name">${c.name}</span><br><span class="res-cat">${c.category}</span></span>
        </a>`
      ).join('');
    }
    results.classList.add('open');
  });

  input.addEventListener('focus', () => { if (input.value.trim().length > 0) results.classList.add('open'); });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('open');
    }
  });
}

function pagePrefix() {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '' : 'pages/';
}

/* ---- Utility functions (shared across calculators) ---- */
const CalcUtils = {
  /* Parse a number from input, return null if invalid/empty */
  num(val) {
    if (val === '' || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  },

  /* Parse a dataset from comma/space/newline separated string */
  dataset(str) {
    if (!str || !str.trim()) return [];
    return str.split(/[,\s\n\t]+/).map(Number).filter(n => !isNaN(n));
  },

  /* Format a number for display */
  fmt(n, decimals = 6) {
    if (!isFinite(n)) return n > 0 ? '∞' : (n < 0 ? '-∞' : 'NaN');
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
    const rounded = parseFloat(n.toFixed(decimals));
    return rounded.toString();
  },

  /* Show error message */
  showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'flex';
  },

  /* Clear error */
  clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
  },

  /* GCD for fractions */
  gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
  },

  /* LCM */
  lcm(a, b) { return Math.abs(a * b) / CalcUtils.gcd(a, b); },

  /* Factorial (BigInt for large numbers) */
  factorial(n) {
    if (n < 0) return null;
    if (n > 170) return Infinity;
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) result *= i;
    if (n <= 18) return Number(result);
    return result;
  },

  /* Permutations nPr */
  nPr(n, r) {
    if (r < 0 || r > n) return 0;
    let result = 1;
    for (let i = 0; i < r; i++) result *= (n - i);
    return result;
  },

  /* Combinations nCr */
  nCr(n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    let result = 1;
    for (let i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  },

  /* Escape HTML */
  esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

/* Expose globally */
window.CalcUtils = CalcUtils;
window.CALCULATORS = CALCULATORS;
