// Editor stranica u adminu: blokovi se drze u nizu "blocks", prikazuju kao
// kartice, a prije slanja forme upisuju u skriveno polje kao JSON.
(function () {
  const dataEl = document.getElementById('pbData');
  const form = document.getElementById('pageForm');
  if (!dataEl || !form) return;

  const data = JSON.parse(dataEl.textContent);
  const blocks = Array.isArray(data.blocks) ? data.blocks : [];
  const products = data.products || [];
  const categories = data.categories || [];
  const TYPES = data.types || {};
  const list = document.getElementById('blocksList');
  const input = document.getElementById('blocksInput');

  const DEFAULTS = {
    text: () => ({ type: 'text', heading: '', body: '', align: 'left' }),
    image: () => ({ type: 'image', src: '', alt: '', caption: '', size: 'wide' }),
    gallery: () => ({ type: 'gallery', heading: '', images: [] }),
    video: () => ({ type: 'video', source: 'youtube', url: '', src: '', caption: '' }),
    products: () => ({ type: 'products', heading: '', mode: 'pick', productIds: [], category: '', limit: 8 }),
    banner: () => ({ type: 'banner', image: '', eyebrow: '', heading: '', text: '', cta_text: '', cta_link: '' }),
    imageText: () => ({ type: 'imageText', image: '', eyebrow: '', heading: '', text: '', cta_text: '', cta_link: '', side: 'left' })
  };

  const RICH_HELP =
    'Prazan red = novi pasus. "## Naslov" = podnaslov. Red koji počinje sa "- " = stavka liste. **tekst** = podebljano. [tekst](/adresa) = link.';

  function sync() {
    input.value = JSON.stringify(blocks);
  }

  /* --- Pomocne funkcije za pravljenje polja --- */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach((c) => c && node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }

  function row(label, field, help, full = true) {
    return el('div', { class: 'form-row' + (full ? ' full' : '') }, [
      el('label', { text: label }),
      field,
      help ? el('small', { text: help }) : null
    ]);
  }

  function textInput(block, key, placeholder) {
    return el('input', {
      type: 'text',
      value: block[key] || '',
      placeholder: placeholder || '',
      oninput: (e) => {
        block[key] = e.target.value;
        sync();
      }
    });
  }

  function textArea(block, key, rows, placeholder) {
    const ta = el('textarea', {
      rows: rows || 4,
      placeholder: placeholder || '',
      oninput: (e) => {
        block[key] = e.target.value;
        sync();
      }
    });
    ta.value = block[key] || '';
    return ta;
  }

  function select(block, key, options, onChange) {
    const s = el(
      'select',
      {
        onchange: (e) => {
          block[key] = e.target.value;
          sync();
          if (onChange) onChange();
        }
      },
      options.map(([value, label]) => el('option', { value, text: label, selected: String(block[key]) === String(value) }))
    );
    return s;
  }

  function showError(msg) {
    window.alert(msg || 'Upload nije uspio. Pokušaj ponovo.');
  }

  async function uploadFile(file, kind) {
    const fd = new FormData();
    fd.append(kind === 'video' ? 'video' : 'image', file);
    const res = await fetch(kind === 'video' ? '/admin/stranice/video' : '/admin/stranice/slika', {
      method: 'POST',
      body: fd,
      credentials: 'same-origin'
    });
    let json = {};
    try {
      json = await res.json();
    } catch {
      json = {};
    }
    if (!res.ok || !json.src) throw new Error(json.error || 'Upload nije uspio.');
    return json.src;
  }

  // Jedna slika (blok Slika, Velika slika, Slika i tekst).
  function imagePicker(block, key) {
    const wrap = el('div', { class: 'pb-image-picker' });
    const draw = () => {
      wrap.innerHTML = '';
      if (block[key]) {
        wrap.appendChild(el('img', { src: block[key], alt: '' }));
        wrap.appendChild(
          el('button', {
            type: 'button',
            class: 'btn btn-outline btn-small',
            text: 'Ukloni sliku',
            onclick: () => {
              block[key] = '';
              sync();
              draw();
            }
          })
        );
      }
      const file = el('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', hidden: true });
      const label = el('label', { class: 'image-upload-dropzone pb-dropzone' }, [
        file,
        el('span', { class: 'dropzone-label', text: block[key] ? 'Zamijeni sliku' : 'Klikni i izaberi sliku' })
      ]);
      file.addEventListener('change', async () => {
        if (!file.files[0]) return;
        label.classList.add('is-loading');
        label.querySelector('.dropzone-label').textContent = 'Šaljem sliku...';
        try {
          block[key] = await uploadFile(file.files[0], 'image');
          sync();
        } catch (err) {
          showError(err.message);
        }
        draw();
      });
      wrap.appendChild(label);
    };
    draw();
    return wrap;
  }

  // Vise slika (Galerija).
  function galleryPicker(block) {
    const wrap = el('div', { class: 'pb-gallery-picker' });
    const draw = () => {
      wrap.innerHTML = '';
      const grid = el('div', { class: 'pb-thumbs' });
      block.images.forEach((src, i) => {
        grid.appendChild(
          el('div', { class: 'pb-thumb' }, [
            el('img', { src, alt: '' }),
            el('div', { class: 'pb-thumb-tools' }, [
              el('button', { type: 'button', title: 'Lijevo', text: '←', onclick: () => move(block.images, i, -1, draw) }),
              el('button', { type: 'button', title: 'Desno', text: '→', onclick: () => move(block.images, i, 1, draw) }),
              el('button', {
                type: 'button',
                title: 'Ukloni',
                text: '×',
                onclick: () => {
                  block.images.splice(i, 1);
                  sync();
                  draw();
                }
              })
            ])
          ])
        );
      });
      wrap.appendChild(grid);
      const file = el('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, hidden: true });
      const label = el('label', { class: 'image-upload-dropzone pb-dropzone' }, [
        file,
        el('span', { class: 'dropzone-label', text: 'Klikni i dodaj slike (možeš izabrati više odjednom)' })
      ]);
      file.addEventListener('change', async () => {
        const files = Array.from(file.files);
        for (let i = 0; i < files.length; i++) {
          label.querySelector('.dropzone-label').textContent = `Šaljem sliku ${i + 1} od ${files.length}...`;
          try {
            block.images.push(await uploadFile(files[i], 'image'));
            sync();
          } catch (err) {
            showError(err.message);
            break;
          }
        }
        draw();
      });
      wrap.appendChild(label);
    };
    draw();
    return wrap;
  }

  function videoPicker(block) {
    const wrap = el('div', { class: 'pb-video-picker' });
    const draw = () => {
      wrap.innerHTML = '';
      if (block.src) {
        wrap.appendChild(el('video', { src: block.src, controls: true, preload: 'metadata' }));
      }
      const file = el('input', { type: 'file', accept: 'video/mp4,video/webm', hidden: true });
      const label = el('label', { class: 'image-upload-dropzone pb-dropzone' }, [
        file,
        el('span', { class: 'dropzone-label', text: block.src ? 'Zamijeni video' : 'Klikni i izaberi video (MP4 ili WEBM, do 150 MB)' })
      ]);
      file.addEventListener('change', async () => {
        if (!file.files[0]) return;
        label.querySelector('.dropzone-label').textContent = 'Šaljem video, ovo može potrajati...';
        try {
          block.src = await uploadFile(file.files[0], 'video');
          sync();
        } catch (err) {
          showError(err.message);
        }
        draw();
      });
      wrap.appendChild(label);
    };
    draw();
    return wrap;
  }

  // Izbor proizvoda: pretraga + kvacice; redoslijed je redoslijed oznacavanja.
  function productPicker(block) {
    const wrap = el('div', { class: 'pb-products-picker' });
    const chosen = el('div', { class: 'pb-chosen' });
    const search = el('input', { type: 'search', placeholder: 'Traži proizvod po nazivu...' });
    const results = el('div', { class: 'pb-product-list' });

    const drawChosen = () => {
      chosen.innerHTML = '';
      if (!block.productIds.length) {
        chosen.appendChild(el('p', { class: 'admin-hint', text: 'Još nisi izabrao proizvode. Označi ih u listi ispod.' }));
        return;
      }
      block.productIds.forEach((id, i) => {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        chosen.appendChild(
          el('div', { class: 'pb-chosen-item' }, [
            el('img', { src: p.image, alt: '' }),
            el('span', { text: p.name + (p.available ? '' : ' (nije na stanju, ne prikazuje se)') }),
            el('button', { type: 'button', text: '←', title: 'Ranije', onclick: () => move(block.productIds, i, -1, drawAll) }),
            el('button', { type: 'button', text: '→', title: 'Kasnije', onclick: () => move(block.productIds, i, 1, drawAll) }),
            el('button', {
              type: 'button',
              text: '×',
              title: 'Ukloni',
              onclick: () => {
                block.productIds.splice(i, 1);
                sync();
                drawAll();
              }
            })
          ])
        );
      });
    };

    const drawResults = () => {
      results.innerHTML = '';
      const q = search.value.trim().toLowerCase();
      products
        .filter((p) => !q || p.name.toLowerCase().includes(q))
        .forEach((p) => {
          const cb = el('input', {
            type: 'checkbox',
            checked: block.productIds.includes(p.id),
            onchange: (e) => {
              if (e.target.checked) block.productIds.push(p.id);
              else block.productIds = block.productIds.filter((id) => id !== p.id);
              sync();
              drawChosen();
            }
          });
          results.appendChild(el('label', { class: 'pb-product-option' }, [cb, el('img', { src: p.image, alt: '' }), el('span', { text: p.name })]));
        });
    };

    const drawAll = () => {
      drawChosen();
      drawResults();
    };
    search.addEventListener('input', drawResults);
    wrap.append(chosen, search, results);
    drawAll();
    return wrap;
  }

  function move(arr, i, delta, redraw) {
    const j = i + delta;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    sync();
    redraw();
  }

  /* --- Polja za svaku vrstu bloka --- */
  function fieldsFor(block, redrawBlock) {
    switch (block.type) {
      case 'text':
        return [
          row('Naslov (nije obavezno)', textInput(block, 'heading')),
          row('Tekst', textArea(block, 'body', 8), RICH_HELP),
          row('Poravnanje', select(block, 'align', [['left', 'Lijevo'], ['center', 'Po sredini']]))
        ];
      case 'image':
        return [
          row('Slika', imagePicker(block, 'src')),
          row('Veličina', select(block, 'size', [['normal', 'Uska (kao tekst)'], ['wide', 'Široka'], ['full', 'Preko cijelog ekrana']])),
          row('Opis ispod slike (nije obavezno)', textInput(block, 'caption')),
          row('Opis slike za Google i slijepe osobe (nije obavezno)', textInput(block, 'alt'))
        ];
      case 'gallery':
        return [row('Naslov (nije obavezno)', textInput(block, 'heading')), row('Slike', galleryPicker(block), 'Slike se slažu u kolone i zadržavaju svoj oblik. Klikom se otvaraju preko cijelog ekrana.')];
      case 'video':
        return [
          row('Odakle je video', select(block, 'source', [['youtube', 'YouTube link'], ['file', 'Moj video fajl']], redrawBlock)),
          block.source === 'youtube'
            ? row('YouTube link', textInput(block, 'url', 'https://www.youtube.com/watch?v=...'), 'Kopiraj link videa sa YouTubea.')
            : row('Video fajl', videoPicker(block)),
          row('Opis ispod videa (nije obavezno)', textInput(block, 'caption'))
        ];
      case 'products':
        return [
          row('Naslov (nije obavezno)', textInput(block, 'heading', 'npr. Izdvojeno za vas')),
          row('Koji proizvodi', select(block, 'mode', [['pick', 'Biram sam proizvode'], ['category', 'Svi iz jedne kategorije']], redrawBlock)),
          block.mode === 'category'
            ? el('div', { class: 'admin-form-grid' }, [
                row('Kategorija', select(block, 'category', [['', 'Svi proizvodi'], ...categories.map((c) => [c.slug, c.name])]), null, false),
                row('Koliko najviše', (() => {
                  const n = el('input', { type: 'number', min: 1, max: 48, value: block.limit, oninput: (e) => { block.limit = parseInt(e.target.value, 10) || 8; sync(); } });
                  return n;
                })(), null, false)
              ])
            : row('Proizvodi', productPicker(block), 'Prikazuju se redom kojim su ovdje. Proizvodi koji nisu na stanju se ne prikazuju.')
        ];
      case 'banner':
        return [
          row('Slika (najbolje položena)', imagePicker(block, 'image')),
          row('Nadnaslov (nije obavezno)', textInput(block, 'eyebrow')),
          row('Naslov', textInput(block, 'heading')),
          row('Tekst (nije obavezno)', textArea(block, 'text', 3)),
          el('div', { class: 'admin-form-grid' }, [
            row('Tekst dugmeta', textInput(block, 'cta_text', 'npr. Pogledaj kolekciju'), null, false),
            row('Dugme vodi na', textInput(block, 'cta_link', '/kolekcija'), null, false)
          ])
        ];
      case 'imageText':
        return [
          row('Slika', imagePicker(block, 'image')),
          row('Slika je', select(block, 'side', [['left', 'Lijevo, tekst desno'], ['right', 'Desno, tekst lijevo']])),
          row('Nadnaslov (nije obavezno)', textInput(block, 'eyebrow')),
          row('Naslov', textInput(block, 'heading')),
          row('Tekst', textArea(block, 'text', 6), RICH_HELP),
          el('div', { class: 'admin-form-grid' }, [
            row('Tekst dugmeta (nije obavezno)', textInput(block, 'cta_text'), null, false),
            row('Dugme vodi na', textInput(block, 'cta_link', '/kolekcija'), null, false)
          ])
        ];
      default:
        return [];
    }
  }

  function render() {
    list.innerHTML = '';
    if (!blocks.length) {
      list.appendChild(el('p', { class: 'pb-empty', text: 'Stranica nema blokova. Dodaj prvi blok dugmetom ispod.' }));
    }
    blocks.forEach((block, i) => {
      const body = el('div', { class: 'pb-block-body' });
      const fill = () => {
        body.innerHTML = '';
        fieldsFor(block, fill).forEach((f) => body.appendChild(f));
      };
      fill();
      const card = el('div', { class: 'pb-block-card', 'data-type': block.type }, [
        el('div', { class: 'pb-block-head' }, [
          el('span', { class: 'pb-block-num', text: String(i + 1) }),
          el('strong', { text: TYPES[block.type] || block.type }),
          el('div', { class: 'pb-block-tools' }, [
            el('button', { type: 'button', class: 'btn btn-outline btn-small', title: 'Pomjeri gore', text: '↑', disabled: i === 0, onclick: () => move(blocks, i, -1, render) }),
            el('button', { type: 'button', class: 'btn btn-outline btn-small', title: 'Pomjeri dolje', text: '↓', disabled: i === blocks.length - 1, onclick: () => move(blocks, i, 1, render) }),
            el('button', {
              type: 'button',
              class: 'btn btn-danger btn-small',
              title: 'Obriši blok',
              text: 'Obriši',
              onclick: () => {
                if (!window.confirm('Obrisati ovaj blok?')) return;
                blocks.splice(i, 1);
                sync();
                render();
              }
            })
          ])
        ]),
        body
      ]);
      list.appendChild(card);
    });
    sync();
  }

  document.querySelectorAll('[data-add-block]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const make = DEFAULTS[btn.dataset.addBlock];
      if (!make) return;
      blocks.push(make());
      render();
      const cards = list.querySelectorAll('.pb-block-card');
      const last = cards[cards.length - 1];
      if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Adresa se sama popunjava iz naslova dok je admin ne promijeni rucno.
  const MAP = { č: 'c', ć: 'c', đ: 'dj', š: 's', ž: 'z', Č: 'c', Ć: 'c', Đ: 'dj', Š: 's', Ž: 'z' };
  const slugify = (s) =>
    s
      .split('')
      .map((ch) => MAP[ch] || ch)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  const title = document.getElementById('title');
  const slug = document.getElementById('slug');
  if (title && slug) {
    title.addEventListener('input', () => {
      if (!slug.dataset.touched) slug.value = slugify(title.value);
    });
    slug.addEventListener('input', () => {
      slug.dataset.touched = '1';
    });
    slug.addEventListener('blur', () => {
      slug.value = slugify(slug.value);
    });
  }

  // Naziv i redoslijed u meniju imaju smisla samo kad je meni izabran.
  const menu = document.getElementById('menu');
  const toggleMenuExtra = () => {
    document.querySelectorAll('.pb-menu-extra').forEach((r) => {
      r.hidden = menu.value === 'none';
    });
  };
  if (menu) {
    menu.addEventListener('change', toggleMenuExtra);
    toggleMenuExtra();
  }

  // Upozorenje ako admin napusti stranicu sa nesacuvanim izmjenama.
  let saved = input.value;
  let submitting = false;
  form.addEventListener('submit', (e) => {
    sync();
    const isPreview = e.submitter && e.submitter.getAttribute('formaction');
    if (!isPreview) submitting = true;
  });
  window.addEventListener('beforeunload', (e) => {
    if (!submitting && input.value !== saved) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  render();
  saved = input.value;
})();
