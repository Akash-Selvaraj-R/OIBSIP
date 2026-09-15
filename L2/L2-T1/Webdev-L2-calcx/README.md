# CALCX — Premium Vanilla JavaScript Calculator

**OASIS INFOBYTE SIP — Web Development & Designing — Level 2 Task 1**

---

## Objective

Build a complete, polished browser-based calculator using only HTML5, CSS3, and Vanilla JavaScript. The project demonstrates modern UI design, clean architecture, and robust calculation logic without relying on `eval()` or external libraries.

---

## Features

- **Basic Operations**: Addition, Subtraction, Multiplication, Division
- **Decimal Support**: Full floating-point number handling
- **Operator Chaining**: Perform sequential calculations (e.g., `5 + 3 × 2`)
- **Repeat Equals**: Pressing `=` repeatedly re-applies the last operation
- **Error Handling**: Graceful "Cannot divide by zero" message
- **Keyboard Support**: Full keyboard input (0-9, +, -, *, /, Enter, Backspace, Escape)
- **Responsive Design**: Works on desktop, laptop, tablet, and mobile
- **Accessibility**: Semantic HTML, ARIA labels, visible focus states, keyboard navigation
- **Premium UI**: Clean, minimal, modern design with subtle depth and strong typography

---

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — CSS Grid layout, custom properties, responsive design
- **Vanilla JavaScript** — No frameworks, no `eval()`, no inline handlers

---

## Project Structure

```
calcx/
├── index.html      # Main HTML structure
├── style.css       # All styling and responsive design
├── script.js       # Calculator engine and event handling
└── README.md       # This file
```

---

## How to Run

1. Open the `calcx/` folder
2. Open `index.html` in any modern web browser
3. Start calculating!

No server or build tools required.

---

## Calculation Logic

The calculator uses a state machine approach with the following core functions:

| Function | Purpose |
|---|---|
| `appendNumber()` | Adds digits to the current input |
| `appendDecimal()` | Adds a decimal point (prevents duplicates) |
| `chooseOperator()` | Handles operator selection and chaining |
| `performCalculation()` | Executes arithmetic without `eval()` |
| `calculate()` | Computes the final result on `=` press |
| `clearCalculator()` | Resets all state |
| `deleteLast()` | Removes the last character (backspace) |
| `handleError()` | Displays user-friendly error messages |
| `updateDisplay()` | Renders expression and result with formatting |

All arithmetic is performed through a `switch` statement inside `performCalculation()`. Floating-point precision is handled using `toPrecision(12)`.

---

## Edge Cases Handled

- Division by zero → shows "Cannot divide by zero"
- Multiple decimal points → prevented
- Leading decimal (`.5`) → accepted and evaluated
- Negative numbers → supported throughout
- Repeated equals → re-applies last operation
- Operator after equals → continues calculation from result
- Backspace on empty input → resets to `0`
- Error state clearing → any input clears the error
- Input length limit → prevents overflow (15 digits)
- Thousands separators → formatted for readability

---

## Screenshot / Demo

> Screenshot placeholder — add an image here after testing

---

## Author

**OASIS INFOBYTE SIP Participant**
