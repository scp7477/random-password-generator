document.addEventListener('DOMContentLoaded', () => {
    const viewRandom  = document.getElementById('view-random');
    const viewPrefix  = document.getElementById('view-prefix');
    const prefixInput = document.getElementById('prefix-input');
    const modeRadios  = document.querySelectorAll('input[name="pwtype"]');

    function show(el) {
        if (!el) return;
        el.hidden = false;
        el.inert = false;
        el.setAttribute('aria-hidden', 'false');
    }
    function hide(el) {
        if (!el) return;
        el.hidden = true;
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
    }

    function applyMode(mode) {
        const isPrefix = mode === 'prefix';

        if (isPrefix) {
            show(viewPrefix);
            hide(viewRandom);
            if (prefixInput) {
                prefixInput.required = true;
                queueMicrotask(() => prefixInput.focus());
            }
        } else {
            show(viewRandom);
            hide(viewPrefix);
            if (prefixInput) {
                prefixInput.required = false;
            }
        }
    }

    const initialMode = document.querySelector('input[name="pwtype"]:checked')?.value || 'random';
    console.log(initialMode)
    applyMode(initialMode);

    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value === 'prefix' ? 'prefix' : 'random';
            applyMode(mode);
        });
    });
});