(function () {
    'use strict';

    // DOM Elements
    const temperatureInput = document.getElementById('temperatureInput');
    const unitSelect = document.getElementById('unitSelect');
    const convertBtn = document.getElementById('convertBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

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
        celsius: 'Celsius',
        fahrenheit: 'Fahrenheit',
        kelvin: 'Kelvin'
    };

    /**
     * Formats a number to a sensible precision.
     * Avoids floating-point artifacts like 77.00000000000001.
     */
    function formatTemperature(value) {
        if (Number.isInteger(value)) {
            return value.toString();
        }
        // Round to 2 decimal places, then remove trailing zeros
        const rounded = Math.round(value * 100) / 100;
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
     * Returns the parsed number or null if invalid.
     */
    function validateInput() {
        const rawValue = temperatureInput.value.trim();

        if (rawValue === '') {
            showError('Please enter a temperature value.');
            return null;
        }

        const value = parseFloat(rawValue);

        if (isNaN(value)) {
            showError('Please enter a valid numeric temperature.');
            return null;
        }

        return value;
    }

    /**
     * Checks if the temperature is below absolute zero.
     */
    function checkAbsoluteZero(value, unit) {
        const threshold = ABSOLUTE_ZERO[unit];
        if (value < threshold) {
            showError('That temperature is below absolute zero. Please enter a physically valid temperature.');
            return false;
        }
        return true;
    }

    /**
     * Converts a temperature value from the given unit to all three units.
     */
    function convertTemperature(value, fromUnit) {
        let celsius;

        // Convert input to Celsius first
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

        // Derive all three values
        const results = {
            celsius: celsius,
            fahrenheit: (celsius * 9 / 5) + 32,
            kelvin: celsius + 273.15
        };

        return results;
    }

    /**
     * Displays the conversion results.
     */
    function displayResults(results) {
        const html = `
            <div class="converter__results-grid">
                <div class="result-card">
                    <div class="result-card__unit">Celsius</div>
                    <div class="result-card__value">${formatTemperature(results.celsius)} °C</div>
                </div>
                <div class="result-card">
                    <div class="result-card__unit">Fahrenheit</div>
                    <div class="result-card__value">${formatTemperature(results.fahrenheit)} °F</div>
                </div>
                <div class="result-card">
                    <div class="result-card__unit">Kelvin</div>
                    <div class="result-card__value">${formatTemperature(results.kelvin)} K</div>
                </div>
            </div>
        `;
        resultsSection.innerHTML = html;
    }

    /**
     * Resets the converter to its initial state.
     */
    function resetConverter() {
        clearError();
        temperatureInput.value = '';
        unitSelect.value = 'celsius';
        resultsSection.innerHTML = '<p class="converter__placeholder">Enter a temperature to see the conversion.</p>';
        temperatureInput.focus();
    }

    /**
     * Main conversion handler.
     */
    function handleConvert() {
        clearError();

        const value = validateInput();
        if (value === null) return;

        const unit = unitSelect.value;

        if (!checkAbsoluteZero(value, unit)) return;

        const results = convertTemperature(value, unit);
        displayResults(results);
    }

    // Event Listeners
    convertBtn.addEventListener('click', handleConvert);

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

    // Expose resetConverter for potential future use
    window.therma = {
        reset: resetConverter
    };

})();
