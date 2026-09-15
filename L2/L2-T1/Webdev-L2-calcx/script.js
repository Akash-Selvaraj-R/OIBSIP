/* ============================================
   CALCX — Premium Calculator Engine
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  const state = {
    currentInput: '0',
    previousInput: '',
    operator: null,
    shouldResetDisplay: false,
    lastResult: null,
    lastOperator: null,
    lastOperand: null,
    justCalculated: false,
    hasError: false,
  };

  // ---- DOM References ----
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const buttons = document.querySelectorAll('.btn');

  // ---- Display ----
  function updateDisplay() {
    if (state.hasError) {
      expressionEl.textContent = '';
      resultEl.textContent = state.currentInput;
      resultEl.classList.add('error');
      return;
    }

    resultEl.classList.remove('error');

    // Build expression string
    let expr = '';
    if (state.previousInput !== '' && state.operator) {
      expr = formatDisplayNumber(state.previousInput) + ' ' + state.operator;
    }
    expressionEl.textContent = expr;

    // Format result
    resultEl.textContent = formatDisplayNumber(state.currentInput);
  }

  function formatDisplayNumber(numStr) {
    if (numStr === '' || numStr === '-') return numStr || '0';

    // Don't format if user is still typing decimals
    if (numStr.endsWith('.')) {
      return addThousandsSeparators(numStr.slice(0, -1)) + '.';
    }

    const parts = numStr.split('.');
    const intPart = addThousandsSeparators(parts[0]);
    if (parts.length === 2) {
      return intPart + '.' + parts[1];
    }
    return intPart;
  }

  function addThousandsSeparators(intStr) {
    const isNegative = intStr.startsWith('-');
    let digits = isNegative ? intStr.slice(1) : intStr;
    let result = '';
    let count = 0;
    for (let i = digits.length - 1; i >= 0; i--) {
      count++;
      result = digits[i] + result;
      if (count % 3 === 0 && i > 0) {
        result = ',' + result;
      }
    }
    return isNegative ? '-' + result : result;
  }

  // ---- Number Input ----
  function appendNumber(num) {
    if (state.hasError) {
      clearCalculator();
    }

    if (state.shouldResetDisplay) {
      state.currentInput = num;
      state.shouldResetDisplay = false;
    } else {
      if (state.currentInput === '0' && num !== '0') {
        state.currentInput = num;
      } else if (state.currentInput === '0' && num === '0') {
        // Do nothing — prevent leading zeros
        return;
      } else if (state.currentInput === '-0') {
        state.currentInput = '-' + num;
      } else {
        // Limit input length
        if (state.currentInput.replace(/[^0-9]/g, '').length >= 15) return;
        state.currentInput += num;
      }
    }

    state.justCalculated = false;
    updateDisplay();
  }

  // ---- Decimal Input ----
  function appendDecimal() {
    if (state.hasError) {
      clearCalculator();
    }

    if (state.shouldResetDisplay) {
      state.currentInput = '0.';
      state.shouldResetDisplay = false;
      state.justCalculated = false;
      updateDisplay();
      return;
    }

    // Prevent multiple decimal points
    if (state.currentInput.includes('.')) return;

    state.currentInput += '.';
    state.justCalculated = false;
    updateDisplay();
  }

  // ---- Operator ----
  function chooseOperator(op) {
    if (state.hasError) {
      clearCalculator();
    }

    // If equals was just pressed, use the result as the new starting point
    if (state.justCalculated) {
      state.previousInput = state.currentInput;
      state.operator = op;
      state.shouldResetDisplay = true;
      state.justCalculated = false;
      updateDisplay();
      return;
    }

    // If there's already a pending operation, calculate it first (operator chaining)
    if (state.operator && state.previousInput !== '' && !state.shouldResetDisplay) {
      const result = performCalculation(
        parseFloat(state.previousInput),
        parseFloat(state.currentInput),
        state.operator
      );

      if (result === 'ERROR') {
        handleError('Cannot divide by zero');
        return;
      }

      state.previousInput = String(result);
      state.currentInput = String(result);
      updateDisplay();
    } else {
      state.previousInput = state.currentInput;
    }

    state.operator = op;
    state.shouldResetDisplay = true;
    updateDisplay();
  }

  // ---- Calculation Engine ----
  function performCalculation(a, b, op) {
    let result;

    switch (op) {
      case '+':
        result = a + b;
        break;
      case '−':
        result = a - b;
        break;
      case '×':
        result = a * b;
        break;
      case '÷':
        if (b === 0) return 'ERROR';
        result = a / b;
        break;
      default:
        return 'ERROR';
    }

    // Handle floating-point precision
    return parseFloat(result.toPrecision(12));
  }

  // ---- Equals ----
  function calculate() {
    if (state.hasError) {
      clearCalculator();
      return;
    }

    // Repeat last operation if equals pressed repeatedly
    if (state.justCalculated && state.lastOperator && state.lastOperand !== null) {
      const current = parseFloat(state.currentInput);
      const result = performCalculation(current, state.lastOperand, state.lastOperator);

      if (result === 'ERROR') {
        handleError('Cannot divide by zero');
        return;
      }

      state.expression = formatDisplayNumber(String(current)) + ' ' + state.lastOperator + ' ' + formatDisplayNumber(String(state.lastOperand));
      state.currentInput = String(result);
      expressionEl.textContent = state.expression;
      resultEl.textContent = formatDisplayNumber(state.currentInput);
      resultEl.classList.remove('error');
      return;
    }

    // Normal calculation
    if (state.operator && state.previousInput !== '') {
      const a = parseFloat(state.previousInput);
      const b = parseFloat(state.currentInput);

      // Store for repeat
      state.lastOperator = state.operator;
      state.lastOperand = b;

      const result = performCalculation(a, b, state.operator);

      if (result === 'ERROR') {
        handleError('Cannot divide by zero');
        return;
      }

      // Show expression
      const expr = formatDisplayNumber(state.previousInput) + ' ' + state.operator + ' ' + formatDisplayNumber(state.currentInput);
      expressionEl.textContent = expr;

      state.currentInput = String(result);
      state.previousInput = '';
      state.operator = null;
      state.shouldResetDisplay = true;
      state.justCalculated = true;

      resultEl.textContent = formatDisplayNumber(state.currentInput);
      resultEl.classList.remove('error');
    } else if (state.justCalculated && state.lastOperator) {
      // Already handled above
    }
  }

  // ---- Clear ----
  function clearCalculator() {
    state.currentInput = '0';
    state.previousInput = '';
    state.operator = null;
    state.shouldResetDisplay = false;
    state.lastResult = null;
    state.lastOperator = null;
    state.lastOperand = null;
    state.justCalculated = false;
    state.hasError = false;
    state.expression = '';
    updateDisplay();
  }

  // ---- Backspace ----
  function deleteLast() {
    if (state.hasError) {
      clearCalculator();
      return;
    }

    if (state.shouldResetDisplay || state.justCalculated) {
      clearCalculator();
      return;
    }

    if (state.currentInput.length <= 1 || 
        (state.currentInput.length === 2 && state.currentInput.startsWith('-'))) {
      state.currentInput = '0';
    } else {
      state.currentInput = state.currentInput.slice(0, -1);
    }

    updateDisplay();
  }

  // ---- Error Handling ----
  function handleError(message) {
    state.hasError = true;
    state.currentInput = message;
    state.previousInput = '';
    state.operator = null;
    state.shouldResetDisplay = false;
    state.justCalculated = false;
    updateDisplay();
  }

  // ---- Event Listeners: Buttons ----
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      switch (action) {
        case 'number':
          appendNumber(value);
          break;
        case 'decimal':
          appendDecimal();
          break;
        case 'operator':
          chooseOperator(value);
          break;
        case 'equals':
          calculate();
          break;
        case 'clear':
          clearCalculator();
          break;
        case 'backspace':
          deleteLast();
          break;
      }
    });
  });

  // ---- Keyboard Support ----
  document.addEventListener('keydown', function (e) {
    const key = e.key;

    // Prevent default for calculator keys
    if (/^[0-9.+\-*/=%]$/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Delete' || key === 'Escape') {
      e.preventDefault();
    }

    if (/^[0-9]$/.test(key)) {
      appendNumber(key);
    } else if (key === '.') {
      appendDecimal();
    } else if (key === '+') {
      chooseOperator('+');
    } else if (key === '-') {
      chooseOperator('−');
    } else if (key === '*') {
      chooseOperator('×');
    } else if (key === '/') {
      chooseOperator('÷');
    } else if (key === '=' || key === 'Enter') {
      calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clearCalculator();
    } else if (key === 'Backspace') {
      deleteLast();
    } else if (key === 'Delete') {
      clearCalculator();
    }
  });

  // ---- Initial Display ----
  updateDisplay();
})();
