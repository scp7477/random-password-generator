const viewRandom  = document.getElementById('view-random');
const viewPrefix  = document.getElementById('view-prefix');
const prefixInput = document.getElementById('prefix-input');
const modeRadios  = document.querySelectorAll('input[name="pwtype"]');
const breachText = document.getElementById("breach-text");
const breachButton = document.getElementById("breach-button");

// --- show and hide random or prefix view ---
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
    show(mode === 'prefix' ? viewPrefix : viewRandom);
    hide(mode === 'prefix' ? viewRandom : viewPrefix);
    if (prefixInput) {
        prefixInput.required = mode === 'prefix';
        if (mode === 'prefix') prefixInput.focus();
    }
}

applyMode(document.querySelector('input[name="pwtype"]:checked')?.value || 'random');
modeRadios.forEach(radio => {
    radio.addEventListener('change', e => applyMode(e.target.value));
});

// --- copy functonality ---
function copyFunction() {
    var copyText = document.getElementById("password-output");
    copyText.select();
    copyText.setSelectionRange(0, 100);
    navigator.clipboard.writeText(copyText.value)

    var copyButton = document.getElementById("copy-button");
    copyButton.style.boxShadow = '0px 0px 2px 2px rgba(139, 179, 129, .4';

}
