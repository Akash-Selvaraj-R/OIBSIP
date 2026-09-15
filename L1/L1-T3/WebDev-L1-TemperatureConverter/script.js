(function () {
    'use strict';

    // DOM Elements
    const temperatureInput = document.getElementById('temperatureInput');
    const unitSelect = document.getElementById('unitSelect');
    const convertBtn = document.getElementById('convertBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

    // Result display elements
    const resultPlaceholder = resultsSection.querySelector('.result-placeholder');
    const resultDisplay = resultsSection.querySelector('.result-display');
    const resultValue = document.getElementById('resultValue');
    const resultUnit = document.getElementById('resultUnit');
    const resultScale = document.getElementById('resultScale');
    const resultFrom = document.getElementById('resultFrom');
    const resultCelsius = document.getElementById('resultCelsius');
    const resultFahrenheit = document.getElementById('resultFahrenheit');
    const resultKelvin = document.getElementById('resultKelvin');
    const tempMarker = document.getElementById('tempMarker');

    // Unit selector buttons
    const unitOptions = document.querySelectorAll('.unit-selector__option');

    // Absolute zero thresholds
    const ABSOLUTE_ZERO = {
        celsius: -273.15,
        fahrenheit: -459.67,
        kelvin: 0
    };

    // Unit symbols
    const UNIT_SYMBOLS = {
        celsius: '°C',
        fahrenheit: '°F',
        kelvin: 'K'
    };

    // Unit labels
    const UNIT_LABELS = {
        celsius: 'CELSIUS',
        fahrenheit: 'FAHRENHEIT',
        kelvin: 'KELVIN'
    };

    /**
     * Formats a number to a sensible precision.
     */
    function formatTemperature(value) {
        if (Number.isInteger(value)) {
            return value.toString();
        }
        var rounded = Math.round(value * 100) / 100;
        return parseFloat(rounded.toFixed(2)).toString();
    }

    /**
     * Displays an error message.
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
        temperatureInput.classList.add('input--error');
    }

    /**
     * Clears the error message.
     */
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
        temperatureInput.classList.remove('input--error');
    }

    /**
     * Validates the input value.
     */
    function validateInput() {
        var rawValue = temperatureInput.value.trim();

        if (rawValue === '') {
            showError('ENTER A VALID TEMPERATURE.');
            return null;
        }

        var value = parseFloat(rawValue);

        if (isNaN(value)) {
            showError('ENTER A VALID NUMERIC TEMPERATURE.');
            return null;
        }

        return value;
    }

    /**
     * Checks if the temperature is below absolute zero.
     */
    function checkAbsoluteZero(value, unit) {
        var threshold = ABSOLUTE_ZERO[unit];
        if (value < threshold) {
            showError('BELOW ABSOLUTE ZERO. ENTER A PHYSICALLY VALID TEMPERATURE.');
            return false;
        }
        return true;
    }

    /**
     * Converts a temperature value from the given unit to all three units.
     */
    function convertTemperature(value, fromUnit) {
        var celsius;

        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }

        var results = {
            celsius: celsius,
            fahrenheit: (celsius * 9 / 5) + 32,
            kelvin: celsius + 273.15
        };

        return results;
    }

    /**
     * Updates the temperature scale marker position.
     * Maps Celsius value to a 0-100% position on the scale.
     * Scale range: -273.15 to 500°C
     */
    function updateTempMarker(celsiusValue) {
        var minTemp = -273.15;
        var maxTemp = 500;
        var clampedValue = Math.max(minTemp, Math.min(maxTemp, celsiusValue));
        var percentage = ((clampedValue - minTemp) / (maxTemp - minTemp)) * 100;
        tempMarker.style.left = percentage + '%';
    }

    /**
     * Displays the conversion results.
     */
    function displayResults(results, fromUnit, inputValue) {
        // Find the "from" unit result value
        var fromValue = results[fromUnit];

        // Update primary result display (the converted "from" unit)
        // Actually, we show all three. The primary is the one the user input was NOT.
        // We show the most useful conversion: if they input Celsius, show Fahrenheit prominently.
        var targetUnit = fromUnit === 'celsius' ? 'fahrenheit' : (fromUnit === 'kelvin' ? 'fahrenheit' : 'celsius');

        resultValue.textContent = formatTemperature(results[targetUnit]);
        resultUnit.textContent = UNIT_SYMBOLS[targetUnit];
        resultScale.textContent = UNIT_LABELS[targetUnit];
        resultFrom.textContent = 'CONVERTED FROM ' + formatTemperature(inputValue) + ' ' + UNIT_SYMBOLS[fromUnit];

        // Update grid cards
        var celsiusVal = resultCelsius.querySelector('.result-grid__value');
        var fahrenheitVal = resultFahrenheit.querySelector('.result-grid__value');
        var kelvinVal = resultKelvin.querySelector('.result-grid__value');

        celsiusVal.textContent = formatTemperature(results.celsius) + ' °C';
        fahrenheitVal.textContent = formatTemperature(results.fahrenheit) + ' °F';
        kelvinVal.textContent = formatTemperature(results.kelvin) + ' K';

        // Update temperature scale marker (use Celsius value)
        updateTempMarker(results.celsius);

        // Toggle visibility
        resultPlaceholder.style.display = 'none';
        resultDisplay.style.display = 'block';
    }

    /**
     * Resets the converter to its initial state.
     */
    function resetConverter() {
        clearError();
        temperatureInput.value = '';
        unitSelect.value = 'celsius';

        // Reset unit selector visual state
        unitOptions.forEach(function (opt) {
            opt.classList.remove('unit-selector__option--active');
            opt.setAttribute('aria-checked', 'false');
        });
        unitOptions[0].classList.add('unit-selector__option--active');
        unitOptions[0].setAttribute('aria-checked', 'true');

        // Reset results
        resultPlaceholder.style.display = 'block';
        resultDisplay.style.display = 'none';

        // Reset marker
        tempMarker.style.left = '50%';

        temperatureInput.focus();
    }

    /**
     * Main conversion handler.
     */
    function handleConvert() {
        clearError();

        var value = validateInput();
        if (value === null) return;

        var unit = unitSelect.value;

        if (!checkAbsoluteZero(value, unit)) return;

        var results = convertTemperature(value, unit);
        displayResults(results, unit, value);
    }

    /**
     * Handles unit selector clicks.
     */
    function handleUnitSelect(selectedOption) {
        var unit = selectedOption.getAttribute('data-unit');

        // Update visual state
        unitOptions.forEach(function (opt) {
            opt.classList.remove('unit-selector__option--active');
            opt.setAttribute('aria-checked', 'false');
        });
        selectedOption.classList.add('unit-selector__option--active');
        selectedOption.setAttribute('aria-checked', 'true');

        // Sync hidden select
        unitSelect.value = unit;

        // Clear error if visible
        if (errorMessage.classList.contains('visible')) {
            clearError();
        }
    }

    // Event Listeners
    convertBtn.addEventListener('click', handleConvert);

    resetBtn.addEventListener('click', resetConverter);

    temperatureInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConvert();
        }
    });

    temperatureInput.addEventListener('input', function () {
        if (errorMessage.classList.contains('visible')) {
            clearError();
        }
    });

    // Unit selector click handlers
    unitOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            handleUnitSelect(this);
        });

        // Keyboard support for unit selector
        option.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUnitSelect(this);
            }
        });
    });

    // Expose resetConverter for potential future use
    window.therma = {
        reset: resetConverter
    };

})();
