// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let justCalculated = false; // ✅ instead of isNewCalculation

// ✅ Initialize calculator on page load
window.onload = function () {
  display.value = '0';
};

function isOperator(value) {
  return ['+', '-', '*', '/'].includes(value);
}

function appendToDisplay(value) {
  if (justCalculated && !isOperator(value)) {
    // start fresh if number pressed after =
    currentInput = '';
    previousInput = '';
    operator = '';
    justCalculated = false;
  }

  if (isOperator(value)) {
    if (currentInput === '' && value === '-') {
      currentInput += value; // negative numbers
    } else if (currentInput !== '') {
      if (previousInput !== '' && operator !== '') {
        calculate();
      }
      operator = value;
      previousInput = currentInput;
      currentInput = '';
      justCalculated = false;
    }
  } else {
    // ✅ Prevent multiple decimals
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
    justCalculated = false;
  }

  updateDisplay();
}

function updateDisplay() {
  if (currentInput === '') {
    display.value = previousInput || '0';
  } else {
    display.value = currentInput;
  }
}

function clearDisplay() {
  currentInput = '';
  operator = '';
  previousInput = '';
  justCalculated = false;
  display.value = '0';
}

function calculate() {
  if (previousInput === '' || currentInput === '' || operator === '') {
    return;
  }

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        alert("❌ Division by zero!");
        clearDisplay();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // ✅ Round to avoid floating-point issues
  result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;

  currentInput = result.toString();
  previousInput = currentInput; // ✅ allow chaining
  operator = '';
  justCalculated = true; // mark as calculated
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
      currentInput = '0';
    }
    updateDisplay();
  }
}

// ✅ Memory Functions with Overflow Protection
function memoryStore() {
  let val = parseFloat(currentInput || display.value);
  if (isNaN(val)) return;

  if (val > Number.MAX_SAFE_INTEGER) {
    memory = Number.MAX_SAFE_INTEGER;
    alert("⚠️ Memory overflow! Value capped.");
  } else if (val < Number.MIN_SAFE_INTEGER) {
    memory = Number.MIN_SAFE_INTEGER;
    alert("⚠️ Memory underflow! Value capped.");
  } else {
    memory = val;
  }
}

function memoryRecall() {
  currentInput = memory.toString();
  justCalculated = false;
  updateDisplay();
}

function memoryClear() {
  memory = 0;
}

function memoryAdd() {
  let valueToAdd = 0;

  if (currentInput !== '') {
    valueToAdd = parseFloat(currentInput);
  } else {
    valueToAdd = parseFloat(display.value);
  }

  if (isNaN(valueToAdd)) return;

  memory += valueToAdd;

  // ✅ Clamp memory
  if (memory > Number.MAX_SAFE_INTEGER) {
    memory = Number.MAX_SAFE_INTEGER;
    alert("⚠️ Memory overflow! Value capped at MAX_SAFE_INTEGER.");
  } else if (memory < Number.MIN_SAFE_INTEGER) {
    memory = Number.MIN_SAFE_INTEGER;
    alert("⚠️ Memory underflow! Value capped at MIN_SAFE_INTEGER.");
  }
}
