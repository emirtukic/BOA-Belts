document.addEventListener('DOMContentLoaded', () => {
  /* --- Mobile admin sidebar toggle --- */
  const navToggle = document.getElementById('adminNavToggle');
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminSidebarOverlay');
  const closeBtn = document.getElementById('adminSidebarClose');
  if (navToggle && sidebar) {
    const openSidebar = () => {
      sidebar.classList.add('open');
      navToggle.classList.add('open');
      navToggle.style.display = 'none';
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
      sidebar.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.style.display = '';
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSidebar));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });
  }

  /* --- Boje proizvoda kao oznake --- */
  const colorTags = document.querySelector('.color-tags');
  if (colorTags) {
    const source = colorTags.querySelector('#colors');
    const palette = JSON.parse(colorTags.dataset.palette || '[]');
    const swatchFor = (name) => {
      const words = name.toLowerCase().split(/[^a-zčćđšž]+/).filter(Boolean);
      for (const word of words) {
        const match = palette.find((entry) => entry.stems.some((stem) => word.startsWith(stem)));
        if (match) return match.hex;
      }
      return null;
    };
    const makeSwatch = (name) => {
      const swatch = document.createElement('span');
      const hex = swatchFor(name);
      swatch.className = hex ? 'color-swatch' : 'color-swatch is-unknown';
      if (hex) swatch.style.setProperty('--swatch', hex);
      return swatch;
    };
    let colors = source.value.split(',').map((c) => c.trim()).filter(Boolean);
    const hexInput = colorTags.querySelector('input[name="colorHex"]');
    let hexMap = {};
    try {
      hexMap = JSON.parse(hexInput.value || '{}') || {};
    } catch (e) {
      hexMap = {};
    }
    // Kruzic oznake je birač boje: pocinje od izabrane ili prepoznate nijanse.
    const makePicker = (name) => {
      const picker = document.createElement('input');
      picker.type = 'color';
      picker.className = 'color-tag-picker';
      picker.value = hexMap[name] || swatchFor(name) || '#9b9790';
      picker.title = 'Izaberi tačnu nijansu';
      picker.setAttribute('aria-label', `Nijansa boje ${name}`);
      picker.addEventListener('input', () => {
        hexMap[name] = picker.value;
        hexInput.value = JSON.stringify(hexMap);
      });
      return picker;
    };

    source.type = 'hidden';
    source.removeAttribute('id');
    const list = document.createElement('div');
    list.className = 'color-tag-list';
    const entry = document.createElement('input');
    entry.type = 'text';
    entry.id = 'colors';
    entry.className = 'color-tag-entry';
    entry.placeholder = 'Upiši boju i pritisni Enter';
    const suggestions = document.createElement('div');
    suggestions.className = 'color-suggestions';
    colorTags.append(list, entry, suggestions);

    const has = (name) => colors.some((c) => c.toLowerCase() === name.toLowerCase());
    const render = () => {
      source.value = colors.join(', ');
      Object.keys(hexMap).forEach((name) => {
        if (!colors.includes(name)) delete hexMap[name];
      });
      hexInput.value = JSON.stringify(hexMap);
      list.innerHTML = '';
      colors.forEach((name, index) => {
        const tag = document.createElement('span');
        tag.className = 'color-tag';
        tag.append(makePicker(name), document.createTextNode(name));
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'color-tag-remove';
        remove.setAttribute('aria-label', `Ukloni boju ${name}`);
        remove.textContent = '×';
        remove.addEventListener('click', () => {
          colors.splice(index, 1);
          changed();
        });
        tag.append(remove);
        list.append(tag);
      });
      list.hidden = colors.length === 0;
      suggestions.innerHTML = '';
      palette.filter((p) => !has(p.name)).forEach((p) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'color-suggestion';
        button.append(makeSwatch(p.name), document.createTextNode(p.name));
        button.addEventListener('click', () => {
          colors.push(p.name);
          changed();
        });
        suggestions.append(button);
      });
    };
    // Javlja ostatku forme (izbor boje kod slika) da su se boje promijenile.
    const changed = () => {
      render();
      source.dispatchEvent(new Event('input'));
    };
    const addFromEntry = () => {
      const added = entry.value.split(',').map((c) => c.trim()).filter((c) => c && !has(c));
      entry.value = '';
      if (added.length) {
        colors.push(...added);
        changed();
      }
    };
    entry.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addFromEntry();
      } else if (e.key === 'Backspace' && !entry.value && colors.length) {
        colors.pop();
        changed();
      }
    });
    entry.addEventListener('blur', addFromEntry);
    render();
  }

  const colorsInput = document.querySelector('input[name="colors"]');
  const colorSelects = document.querySelectorAll('.image-color-select');
  if (colorsInput && colorSelects.length) {
    const refreshColorOptions = () => {
      const colors = colorsInput.value.split(',').map((c) => c.trim()).filter(Boolean);
      colorSelects.forEach((select) => {
        // Pamti zadnji izbor admina, da kucanje u polju Boje ne izgubi boju slike.
        const current = select.dataset.selected;
        select.innerHTML = '';
        select.add(new Option('Sve boje', ''));
        colors.forEach((color) => select.add(new Option(color, color)));
        select.value = colors.includes(current) ? current : '';
      });
    };
    colorSelects.forEach((select) => {
      select.addEventListener('change', () => {
        select.dataset.selected = select.value;
      });
    });
    colorsInput.addEventListener('input', refreshColorOptions);
  }

  /* --- Tooltip za stupce u statistici (mis i tastatura) --- */
  const tooltip = document.getElementById('chartTooltip');
  if (tooltip) {
    const valueEl = tooltip.querySelector('strong');
    const labelEl = tooltip.querySelector('span');
    const place = (x, y) => {
      const width = tooltip.offsetWidth;
      const left = Math.min(Math.max(8, x - width / 2), window.innerWidth - width - 8);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(8, y - tooltip.offsetHeight - 12)}px`;
    };
    const show = (slot, x, y) => {
      valueEl.textContent = slot.dataset.tipValue;
      labelEl.textContent = slot.dataset.tipLabel;
      tooltip.hidden = false;
      place(x, y);
    };
    const hide = () => {
      tooltip.hidden = true;
    };
    document.querySelectorAll('.col-chart-slot').forEach((slot) => {
      slot.addEventListener('pointermove', (e) => show(slot, e.clientX, e.clientY));
      slot.addEventListener('pointerleave', hide);
      slot.addEventListener('focus', () => {
        const rect = slot.getBoundingClientRect();
        show(slot, rect.left + rect.width / 2, rect.top);
      });
      slot.addEventListener('blur', hide);
    });
    window.addEventListener('scroll', hide, { passive: true });
  }

  document.querySelectorAll('.image-upload-dropzone input[type="file"]').forEach((input) => {
    const labelEl = input.closest('.image-upload-dropzone').querySelector('.dropzone-label');
    if (!labelEl) return;
    const defaultText = labelEl.textContent;
    input.addEventListener('change', () => {
      if (input.files.length === 0) {
        labelEl.textContent = defaultText;
      } else if (input.files.length === 1) {
        labelEl.textContent = input.files[0].name;
      } else {
        labelEl.textContent = `${input.files.length} slika izabrano`;
      }
    });
  });
});
