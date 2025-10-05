const viewRandom = document.getElementById('view-random');
const viewPattern = document.getElementById('view-pattern');
const patternInput = document.getElementById('pattern-input');
const modeRadios = document.querySelectorAll('input[name="pwtype"]');
const passwordOutput = document.getElementById('password-output');
const copyButton = document.getElementById('copy-button');
const breachButton = document.getElementById('breach-button');
const safeLevel = document.getElementById('safe-level');
const lengthInput = document.getElementById('len');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const originalText = breachButton.innerHTML;

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// --- UI Helper Functions ---
// show and hide random or pattern view
function show(el) {
    if (el) {
        el.hidden = false;
        el.setAttribute('aria-hidden', 'false');
    }
}
function hide(el) {
    if (el) {
        el.hidden = true;
        el.setAttribute('aria-hidden', 'true');
    }
}

function applyMode(mode) {
    show(mode === 'pattern' ? viewPattern : viewRandom);
    hide(mode === 'pattern' ? viewRandom : viewPattern);
    if (patternInput) {
        patternInput.required = mode === 'pattern';
        if (mode === 'pattern') patternInput.focus();
    }
}

applyMode(document.querySelector('input[name="pwtype"]:checked')?.value || 'random');
modeRadios.forEach(radio => {
    radio.addEventListener('change', e => applyMode(e.target.value));
});

function copyFunction() {
    try {
        navigator.clipboard.writeText(passwordOutput.value);
    } catch (err) {
        console.log("Copy failed: ", err);
        alert("Copy Failed");
    }
    copyButton.classList.add('copy-success');
}

// --- Password Logic Functions ---

function generateRandomPassword() {
    let lengthPass = parseInt(lengthInput.value);
    let chars = "";

    // make sure atleast one checkbox is checked
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
    }
    return password;
}

function updatePasswordStrength(password) {
    const result = zxcvbn(password, []);
    const score = result.score;
    console.log(score);
    console.log(result.guesses);
    let width = '0%';
    let color = '#ccc';
    switch (score) {
        case 0:
            width = '20%';
            color = '#EF4444';
            break;
        case 1:
            width = '40%';
            color = '#f97c16';
            break;
        case 2:
            width = '60%';
            color = '#f5d60b';
            break;
        case 3:
            width = '80%';
            color = '#09a409';
            break;
        case 4:
            width = '100%';
            color = '#066206';
            break;
    }

    safeLevel.style.width = width;
    safeLevel.style.backgroundColor = color;
}

async function sha1 (text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    console.log(data);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
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

async function checkPassword() {
    breachButton.innerText = "Loading...";
    const password = passwordOutput.value;
    if (!password) {
        breachButton.innerText = "Please generate a password first!";
    }
    try {
        // Generate SHA1 hash and split into prefix suffix
        const hash = await sha1(passwordOutput.value);
        const prefix = hash.slice(0,5);
        const suffix = hash.slice(5);
        const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix);
        const data = await response.text()
        const searchPassword = data.split('\n').find(num => num.includes(suffix));
        // If password exists in response, extract count and display to user
        if (searchPassword) {
            const count = searchPassword.split(':')[1];
            breachButton.innerText = "Password was found: " + count + " times, Dont use it!";
            breachButton.classList.remove("breach-button-not-found");
            breachButton.classList.add("breach-button-found");
        } else {
            breachButton.innerText = "Password not found in data breaches!";
            breachButton.classList.remove("breach-button-found");
            breachButton.classList.add("breach-button-not-found");
        }
    }
    catch (err) {
        console.error('Error checking password: ', err)
        breachButton.innerText = "Error fetching Data";
    }
}

