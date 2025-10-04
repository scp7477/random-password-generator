const generateButton = document.querySelector('.generate-button');
const passwordOutput = document.getElementById('password-output');
const safeLevel = document.getElementById('safe-level');
const lengthInput = document.getElementById('len');
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById('symbols');
const originalText = breachButton.innerHTML;
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';



function generateRandomPassword() {
    let lengthPass = parseInt(lengthInput.value);
    let chars = "";

    if (uppercaseCheckbox.checked === false &&
        lowercaseCheckbox.checked === false &&
        numbersCheckbox.checked === false &&
        symbolsCheckbox.checked === false) {
        uppercaseCheckbox.checked = true;
    }

    if (uppercaseCheckbox.checked) chars += UPPERCASE;
    if (lowercaseCheckbox.checked) chars += LOWERCASE;
    if (numbersCheckbox.checked) chars += NUMBERS;
    if (symbolsCheckbox.checked) chars += SYMBOLS;

    let password = "";
    for (let i= 0; i < lengthPass; i++) {
        let charIndex = Math.floor(Math.random() * chars.length)
        password += chars[charIndex];
    }
    return password;
}

function generatePatternPassword(pattern) {
    let lengthPattern = pattern.length;
    let password = "";

    for (let i = 0; i < lengthPattern; i++) {
        let patternChar = pattern[i];

        if (patternChar === 'U') {
            password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]
        }
        else if (patternChar === 'L') {
            password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]
        }
        else if (patternChar === 'N') {
            password += NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
        }
        else if (patternChar === 'S') {
            password += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        }
        else if (patternChar === "'") {
            password += pattern[i+1];
            i += 2;
        }
        // What if user writes 'AB' oder 'ABC'?
    }
    return password;
}

function updatePasswordStrength(password) {
    if (password.length <= 3) {
        safeLevel.style.width = '0%'
    }
    if (password.length >= 4) {
        safeLevel.style.width = '25%'
        safeLevel.style.backgroundColor = '#ec9393'
    }
    if (password.length >= 7) {
        safeLevel.style.width = '50%'
        safeLevel.style.backgroundColor = '#ffcc00'
    }
    if (password.length >= 9) {
        safeLevel.style.width = '75%'
        safeLevel.style.backgroundColor = '#09a409'
    }    if (password.length >= 12) {
        safeLevel.style.width = '100%'
        safeLevel.style.backgroundColor = '#066206'
    }
}

function displayPassword() {
    let passType = document.querySelector('input[name="pwtype"]:checked')?.value;
    let password = ''

    if (passType === 'random') {
        password = generateRandomPassword()
    }
    else if (passType === 'pattern') {
        let pattern = document.getElementById("pattern-input").value;
        password = generatePatternPassword(pattern);
    }

    passwordOutput.value = password;
    updatePasswordStrength(password);

    copyButton.classList.remove('copy-success');
    breachButton.innerHTML = originalText;
    breachButton.classList.remove("breach-button-found");
    breachButton.classList.remove("breach-button-not-found");
}
