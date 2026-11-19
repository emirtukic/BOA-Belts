// Provjera formi bez engleskih oblacica preglednika ("Please fill out this field"):
// poruka na bosanskom stoji ispod polja, u stilu sajta. Vazi za sve forme na sajtu
// i u adminu. Forma sa atributom novalidate u HTML-u ima svoju provjeru i ne dira se.
(function () {
  const handled = new WeakSet();

  function rangeText(field) {
    const unit = field.dataset.unit ? ` ${field.dataset.unit}` : '';
    const { min, max } = field;
    if (min !== '' && max !== '') return `Upišite broj od ${min} do ${max}${unit}.`;
    if (min !== '') return `Najmanja vrijednost je ${min}${unit}.`;
    return `Najveća vrijednost je ${max}${unit}.`;
  }

  function message(field) {
    const v = field.validity;
    if (field.dataset.errorMessage && !v.valid) return field.dataset.errorMessage;
    if (v.valueMissing) {
      if (field.type === 'checkbox') return 'Označite ovo polje da biste nastavili.';
      if (field.type === 'radio' || field.tagName === 'SELECT') return 'Izaberite jednu od ponuđenih opcija.';
      if (field.type === 'file') return 'Izaberite fajl.';
      return 'Ovo polje je obavezno.';
    }
    if (v.typeMismatch) {
      if (field.type === 'email') return 'Upišite ispravnu e-mail adresu, npr. ime@gmail.com.';
      if (field.type === 'url') return 'Upišite ispravnu web adresu.';
      return 'Provjerite upisanu vrijednost.';
    }
    if (v.badInput) return 'Upišite broj.';
    if (v.rangeUnderflow || v.rangeOverflow) return rangeText(field);
    if (v.stepMismatch) return field.step === '1' || field.step === '' ? 'Upišite cijeli broj, bez decimala.' : 'Upišite ispravan broj.';
    if (v.tooShort) return `Upišite najmanje ${field.minLength} znakova (sada ${field.value.length}).`;
    if (v.tooLong) return `Najviše ${field.maxLength} znakova.`;
    if (v.patternMismatch) return field.title || 'Provjerite format upisane vrijednosti.';
    return field.validationMessage || 'Provjerite ovo polje.';
  }

  // Poruka ide na kraj reda forme; za radio dugmad jedna poruka za cijelu grupu.
  function anchorFor(field) {
    if (field.type === 'radio') {
      const group = field.closest('.form-row, .pill-options, fieldset');
      if (group) return { parent: group, after: null };
    }
    const row = field.closest('.form-row, .form-group, .checkbox-row');
    if (row) return { parent: row, after: null };
    const label = field.closest('label');
    const ref = label || field;
    return { parent: ref.parentNode, after: ref };
  }

  function errorKey(field) {
    return field.type === 'radio' && field.name ? `radio:${field.name}` : null;
  }

  function clearError(field) {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    const { parent } = anchorFor(field);
    const key = errorKey(field);
    parent.querySelectorAll(':scope > .field-error').forEach((el) => {
      if (el.dataset.for === (key || field.id) || el.id === field.dataset.errorId) el.remove();
    });
    if (field.dataset.errorId) {
      const old = document.getElementById(field.dataset.errorId);
      if (old) old.remove();
      delete field.dataset.errorId;
    }
  }

  let counter = 0;
  function showError(field) {
    clearError(field);
    const msg = document.createElement('p');
    msg.className = 'field-error';
    msg.id = `field-error-${++counter}`;
    msg.setAttribute('role', 'alert');
    msg.dataset.for = errorKey(field) || field.id || '';
    msg.textContent = message(field);
    const { parent, after } = anchorFor(field);
    if (after) after.insertAdjacentElement('afterend', msg);
    else parent.appendChild(msg);
    field.dataset.errorId = msg.id;
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', msg.id);
  }

  // Provjeri cijelu formu; vrati true ako je sve ispravno.
  function validate(form) {
    let first = null;
    const seenRadio = new Set();
    Array.from(form.elements).forEach((field) => {
      if (!field.willValidate) return;
      if (field.type === 'radio') {
        if (seenRadio.has(field.name)) return;
        seenRadio.add(field.name);
      }
      if (field.checkValidity()) {
        clearError(field);
      } else {
        showError(field);
        if (!first) first = field;
      }
    });
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function attach(form) {
    if (handled.has(form) || form.hasAttribute('novalidate')) return;
    handled.add(form);
    form.noValidate = true;
    // Poruka nestaje cim kupac ispravi polje.
    const recheck = (e) => {
      const field = e.target;
      if (!field.willValidate || !field.dataset.errorId) return;
      if (field.type === 'radio') {
        const group = form.querySelectorAll(`input[type=radio][name="${CSS.escape(field.name)}"]`);
        if (Array.from(group).some((r) => r.checked)) group.forEach(clearError);
        return;
      }
      if (field.checkValidity()) clearError(field);
      else if (e.type === 'change') showError(field);
    };
    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);
  }

  // Provjera ide prije ostalih submit funkcija (npr. dodavanje u korpu), da se
  // neispravna forma ne posalje.
  document.addEventListener(
    'submit',
    (e) => {
      const form = e.target;
      if (!handled.has(form)) return;
      if (e.submitter && e.submitter.formNoValidate) return;
      if (!validate(form)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );

  function init() {
    document.querySelectorAll('form').forEach(attach);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.boaValidateForm = validate;
})();
