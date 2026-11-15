document.addEventListener('DOMContentLoaded', () => {
  /* --- Toast notifikacija --- */
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;
  function showToast(message, type) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('error');
    if (type === 'error') toast.classList.add('error');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
  }

  /* --- Newsletter prijava (ajax, bez ucitavanja stranice) --- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const emailInput = document.getElementById('newsletterEmail');
    const privacyInput = document.getElementById('newsletterPrivacy');
    const consentRow = document.getElementById('newsletterConsentRow');

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (emailInput.value || '').trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (consentRow) consentRow.classList.remove('invalid');

      if (!emailValid) {
        showToast('Unesite ispravnu e-mail adresu.', 'error');
        emailInput.focus();
        return;
      }
      if (!privacyInput.checked) {
        showToast('Morate prihvatiti politiku privatnosti.', 'error');
        if (consentRow) consentRow.classList.add('invalid');
        return;
      }

      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Slanje...';
      }

      fetch(newsletterForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: `email=${encodeURIComponent(email)}&privacy=${privacyInput.checked ? 'on' : ''}`
      })
        .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
        .then(({ data }) => {
          showToast(data.message || data.error, data.ok ? 'success' : 'error');
          if (data.ok) {
            newsletterForm.reset();
          }
        })
        .catch(() => {
          showToast('Trenutno ne možemo obraditi prijavu. Pokušajte kasnije.', 'error');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
    });
  }

  /* --- Site popup (newsletter-style) --- */
  const sitePopupOverlay = document.getElementById('sitePopupOverlay');
  if (sitePopupOverlay) {
    const sitePopupClose = document.getElementById('sitePopupClose');
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem('boaPopupShown') === '1';
    } catch (e) {
      alreadyShown = false;
    }

    const closeSitePopup = () => {
      sitePopupOverlay.classList.remove('open');
      document.body.classList.remove('drawer-locked');
      try {
        sessionStorage.setItem('boaPopupShown', '1');
      } catch (e) {
        /* privatni mod i sl. - nije kriticno */
      }
    };

    if (!alreadyShown) {
      const delaySeconds = parseFloat(sitePopupOverlay.dataset.delay) || 0;
      const autoCloseSeconds = parseFloat(sitePopupOverlay.dataset.autoClose) || 0;
      setTimeout(() => {
        sitePopupOverlay.classList.add('open');
        document.body.classList.add('drawer-locked');
        if (autoCloseSeconds > 0) {
          setTimeout(closeSitePopup, autoCloseSeconds * 1000);
        }
      }, delaySeconds * 1000);
    }

    if (sitePopupClose) sitePopupClose.addEventListener('click', closeSitePopup);
    sitePopupOverlay.addEventListener('click', (e) => {
      if (e.target === sitePopupOverlay) closeSitePopup();
    });
  }

  /* --- Header scroll shadow --- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile nav drawer (potpuno odvojen element od desktop .main-nav) --- */
  const navToggle = document.getElementById('navToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');
  if (navToggle && mobileNavDrawer) {
    const openNav = () => {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      navToggle.classList.add('active');
      if (navOverlay) navOverlay.classList.add('open');
      document.body.classList.add('drawer-locked');
    };
    const closeNav = () => {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
      navToggle.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('open');
      document.body.classList.remove('drawer-locked');
    };
    navToggle.addEventListener('click', () => {
      if (mobileNavDrawer.classList.contains('open')) closeNav();
      else openNav();
    });
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
    mobileNavDrawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* --- Site search dropdown (live rezultati) --- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchToggle && searchPanel) {
    const openSearch = () => {
      searchPanel.classList.add('open');
      if (searchInput) setTimeout(() => searchInput.focus(), 150);
    };
    const closeSearch = () => {
      searchPanel.classList.remove('open');
    };
    const toggleSearch = () => {
      if (searchPanel.classList.contains('open')) closeSearch();
      else openSearch();
    };

    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSearch();
    });
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    document.addEventListener('click', (e) => {
      if (!searchPanel.classList.contains('open')) return;
      if (searchPanel.contains(e.target) || e.target === searchToggle) return;
      closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });

    if (searchInput && searchResults) {
      const money = (n) => `${Number(n).toFixed(2)} KM`;
      const renderResults = (query, results) => {
        if (!query) {
          searchResults.innerHTML = '';
          return;
        }
        if (query.length < 2) {
          searchResults.innerHTML = '<div class="search-result-hint">Ukucajte bar 2 slova za pretragu...</div>';
          return;
        }
        if (results.length === 0) {
          searchResults.innerHTML = '<div class="search-result-empty">Nema rezultata za "' + query.replace(/</g, '&lt;') + '".</div>';
          return;
        }
        const items = results
          .map(
            (p) => `
              <a href="/kolekcija/${p.slug}" class="search-result-item">
                <img src="${p.image}" alt="">
                <div>
                  <div class="search-result-name">${p.name}</div>
                  <div class="search-result-price">${p.onSale ? `<span class="price-old">${money(p.originalPrice)}</span><span class="price-now">${money(p.price)}</span>` : money(p.price)}</div>
                </div>
              </a>`
          )
          .join('');
        searchResults.innerHTML = `${items}<a href="/kolekcija?pretraga=${encodeURIComponent(query)}" class="search-result-viewall">Pogledajte sve rezultate</a>`;
      };

      let debounceTimer = null;
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 2) {
          renderResults(query, []);
          return;
        }
        debounceTimer = setTimeout(() => {
          fetch(`/api/pretraga?q=${encodeURIComponent(query)}`)
            .then((r) => r.json())
            .then((data) => renderResults(query, data.results || []))
            .catch(() => {});
        }, 250);
      });
    }
  }

  /* --- Product gallery thumbnails + arrows --- */
  const thumbs = document.querySelectorAll('.product-gallery-thumbs img');
  const mainImage = document.querySelector('.product-gallery-main img');
  if (thumbs.length && mainImage) {
    const thumbList = Array.from(thumbs);
    const showImage = (index) => {
      const thumb = thumbList[index];
      if (!thumb) return;
      mainImage.src = thumb.dataset.full || thumb.src;
      thumbList.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    };

    thumbList.forEach((thumb, index) => {
      thumb.addEventListener('click', () => showImage(index));
    });

    const prevBtn = document.querySelector('.gallery-nav-btn.prev');
    const nextBtn = document.querySelector('.gallery-nav-btn.next');
    const step = (delta) => {
      const current = thumbList.findIndex((t) => t.classList.contains('active'));
      const total = thumbList.length;
      const next = (current + delta + total) % total;
      showImage(next);
    };
    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));

    // Izbor boje prebacuje na prvu sliku te boje; boja bez svoje slike vraca na
    // prvu sliku "Sve boje". Klik na sliku neke boje bira tu boju.
    const colorInputs = Array.from(document.querySelectorAll('input[name="color"]'));
    colorInputs.forEach((input) => {
      // click umjesto change: i klik na vec oznacenu boju pokaze njenu sliku.
      input.addEventListener('click', () => {
        let index = thumbList.findIndex((t) => t.dataset.color === input.value);
        if (index === -1) index = thumbList.findIndex((t) => !t.dataset.color);
        if (index !== -1) showImage(index);
      });
    });
    thumbList.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const input = colorInputs.find((i) => i.value === thumb.dataset.color && !i.disabled);
        if (input) input.checked = true;
      });
    });
  }

  /* --- Lightbox za galerije (O nama, BH Fashion Week) --- */
  const galleries = document.querySelectorAll('.story-gallery');
  if (galleries.length) {
    const lightbox = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGallery = [];
    let currentIndex = 0;

    const renderLightboxImage = () => {
      const img = currentGallery[currentIndex];
      if (!img || !lightboxImage) return;
      lightboxImage.src = img.dataset.full || img.src;
      lightboxImage.alt = img.alt || '';
    };

    const openLightbox = (imgs, index) => {
      currentGallery = imgs;
      currentIndex = index;
      renderLightboxImage();
      if (lightbox) lightbox.classList.add('open');
      document.body.classList.add('drawer-locked');
    };

    const closeLightbox = () => {
      if (lightbox) lightbox.classList.remove('open');
      document.body.classList.remove('drawer-locked');
    };

    const stepLightbox = (delta) => {
      if (!currentGallery.length) return;
      currentIndex = (currentIndex + delta + currentGallery.length) % currentGallery.length;
      renderLightboxImage();
    };

    galleries.forEach((gallery) => {
      const imgs = Array.from(gallery.querySelectorAll('img'));
      imgs.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(imgs, index));
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => stepLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => stepLightbox(1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* --- FAQ accordion --- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      faqItems.forEach((other) => other.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- Dugme koje otvara odredjeno FAQ pitanje (npr. Tabela velicina) --- */
  document.querySelectorAll('[data-open-faq]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = document.getElementById(button.dataset.openFaq);
      if (!item) return;
      if (!item.classList.contains('open')) item.querySelector('.faq-question').click();
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* --- Cart drawer --- */
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawerBody = document.getElementById('cartDrawerBody');
  const cartToggle = document.getElementById('cartToggle');
  const drawerClose = document.getElementById('cartDrawerClose');
  const cartBadgeWrap = document.getElementById('cartBadgeWrap');

  function updateBadge(count) {
    if (!cartBadgeWrap) return;
    cartBadgeWrap.innerHTML = count > 0 ? `<span class="cart-badge" id="cartBadge">${count}</span>` : '';
  }

  function renderDrawer(html, count) {
    if (drawerBody) drawerBody.innerHTML = html;
    if (typeof count === 'number') updateBadge(count);
  }

  function openDrawer(skipFetch) {
    if (!drawer || !overlay) return;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-locked');
    if (!skipFetch) fetchDrawer();
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-locked');
  }

  function fetchDrawer() {
    fetch('/korpa/drawer', { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) renderDrawer(data.html, data.count);
      })
      .catch(() => {
        if (drawerBody) drawerBody.innerHTML = '<div class="drawer-empty"><p>Greška pri učitavanju korpe.</p></div>';
      });
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  if (drawerBody) {
    drawerBody.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('.qty-btn');
      const removeBtn = e.target.closest('.drawer-item-remove');

      if (qtyBtn) {
        const stepper = qtyBtn.closest('.qty-stepper');
        const index = stepper.dataset.index;
        const valueEl = stepper.querySelector('.qty-value');
        let qty = parseInt(valueEl.textContent, 10) || 1;
        qty = qtyBtn.dataset.action === 'inc' ? qty + 1 : Math.max(1, qty - 1);
        fetch(`/korpa/${index}?_method=PUT`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: `qty=${qty}`
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.ok) renderDrawer(data.html, data.count);
            if (data.notice) showToast(data.notice, 'error');
          });
      }

      if (removeBtn) {
        const index = removeBtn.dataset.index;
        fetch(`/korpa/${index}?_method=DELETE`, {
          method: 'POST',
          headers: { Accept: 'application/json' }
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.ok) renderDrawer(data.html, data.count);
          });
      }
    });
  }

  /* --- Izbor velicine i boje: prikaz izabranog i provjera prije dodavanja --- */
  const optionGroups = Array.from(document.querySelectorAll('.option-group'));
  const clearOptionError = (group) => {
    group.classList.remove('needs-choice');
    const error = group.querySelector('.option-error');
    if (error) error.hidden = true;
  };
  optionGroups.forEach((group) => {
    const chosen = group.querySelector('.option-chosen');
    group.querySelectorAll('.option-input').forEach((input) => {
      input.addEventListener('change', () => {
        if (chosen) {
          chosen.textContent = input.value;
          chosen.classList.add('is-set');
        }
        clearOptionError(group);
      });
    });
  });
  // Vraca false i oznaci grupe gdje kupac jos nije izabrao (rasprodane se ne racunaju).
  const optionsChosen = () => {
    const missing = optionGroups.filter((group) => {
      const inputs = Array.from(group.querySelectorAll('.option-input'));
      return inputs.some((i) => !i.disabled) && !inputs.some((i) => i.checked);
    });
    missing.forEach((group) => {
      group.classList.add('needs-choice');
      const error = group.querySelector('.option-error');
      if (error) error.hidden = false;
    });
    if (missing.length) missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return missing.length === 0;
  };

  /* --- Add to cart (product page) via AJAX --- */
  const addToCartForm = document.querySelector('form[action="/korpa/dodaj"]');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!optionsChosen()) return;
      const submitBtn = addToCartForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Dodavanje...';
      }
      fetch('/korpa/dodaj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams(new FormData(addToCartForm))
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) {
            renderDrawer(data.html, data.count);
            openDrawer(true);
            if (data.notice) showToast(data.notice, 'error');
          } else if (data.error) {
            showToast(data.error, 'error');
          }
        })
        .catch(() => showToast('Trenutno ne možemo dodati proizvod u korpu. Pokušajte ponovo.', 'error'))
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
    });
  }

  /* --- Lista zelja: cuva se u pregledniku (localStorage), bez prijave --- */
  const WISH_KEY = 'boaWishlist';
  const readWishlist = () => {
    try {
      const ids = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
      return Array.isArray(ids) ? ids.filter((id) => Number.isInteger(id) && id > 0) : [];
    } catch (e) {
      return [];
    }
  };
  const writeWishlist = (ids) => {
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(ids));
    } catch (e) {
      /* privatni rezim preglednika: lista vrijedi samo do zatvaranja stranice */
    }
  };
  const wishBadge = document.getElementById('wishBadge');
  const refreshWishUi = () => {
    const ids = readWishlist();
    document.querySelectorAll('.wish-btn[data-wish]').forEach((btn) => {
      const active = ids.includes(Number(btn.dataset.wish));
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (wishBadge) {
      wishBadge.textContent = ids.length;
      wishBadge.hidden = ids.length === 0;
    }
  };

  const wishlistItems = document.getElementById('wishlistItems');
  const wishlistEmpty = document.getElementById('wishlistEmpty');
  const showWishlistEmpty = () => {
    if (wishlistItems) wishlistItems.innerHTML = '';
    if (wishlistEmpty) wishlistEmpty.hidden = false;
  };
  const loadWishlistPage = () => {
    const ids = readWishlist();
    if (!ids.length) return showWishlistEmpty();
    fetch(`/lista-zelja/proizvodi?ids=${ids.join(',')}`, { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error('lista');
        // Obrisani proizvodi nestaju i iz sacuvane liste.
        writeWishlist(ids.filter((id) => data.ids.includes(id)));
        if (!data.ids.length) return showWishlistEmpty();
        wishlistItems.innerHTML = data.html;
        refreshWishUi();
      })
      .catch(() => {
        wishlistItems.innerHTML = '<p>Trenutno ne možemo učitati listu želja. Pokušajte ponovo.</p>';
      });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wish-btn[data-wish]');
    if (!btn) return;
    e.preventDefault();
    const id = Number(btn.dataset.wish);
    const ids = readWishlist();
    const added = !ids.includes(id);
    writeWishlist(added ? [...ids, id] : ids.filter((x) => x !== id));
    refreshWishUi();
    if (added) {
      btn.classList.remove('pop');
      void btn.offsetWidth;
      btn.classList.add('pop');
    }
    showToast(added ? 'Sačuvano u listu želja.' : 'Uklonjeno iz liste želja.');
    if (!added && wishlistItems) {
      const card = btn.closest('.product-card');
      if (card) card.remove();
      if (!readWishlist().length) showWishlistEmpty();
    }
  });
  // Druga otvorena kartica preglednika je promijenila listu.
  window.addEventListener('storage', (e) => {
    if (e.key === WISH_KEY) refreshWishUi();
  });
  refreshWishUi();
  if (wishlistItems) loadWishlistPage();

  /* --- Dugme "Pisite nam" (Viber / WhatsApp) --- */
  const chatToggle = document.getElementById('chatToggle');
  const chatMenu = document.getElementById('chatMenu');
  const chatFloat = document.getElementById('chatFloat');
  if (chatToggle && chatMenu) {
    const setChatOpen = (open) => {
      chatMenu.hidden = !open;
      chatFloat.classList.toggle('is-open', open);
      chatToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    chatToggle.addEventListener('click', () => setChatOpen(chatMenu.hidden));
    document.addEventListener('click', (e) => {
      if (!chatMenu.hidden && !chatFloat.contains(e.target)) setChatOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !chatMenu.hidden) setChatOpen(false);
    });
  }

  /* --- Pocetna: elementi se pojavljuju dok se skrola --- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.querySelector('.home-hero') && 'IntersectionObserver' in window && !reduceMotion) {
    const mark = (selector, className, stagger) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(className);
        if (stagger) {
          const index = Array.prototype.indexOf.call(el.parentElement.children, el);
          el.style.setProperty('--reveal-delay', `${(index % 4) * stagger}s`);
        }
      });
    };
    mark('.boa-section-head, .home-products-head, .home-measure-text > :not(ol), .home-story-text, .home-banner-inner > *, .home-loyalty, .home-products-more', 'reveal', 0);
    mark('.home-usp-item, .home-category, .home-grid .product-card, .home-steps li', 'reveal', 0.1);
    mark('.home-measure-image, .home-story-image', 'reveal-zoom', 0);
    document.querySelectorAll('.home-banner-inner > *').forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 0.12}s`));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    document.querySelectorAll('.reveal, .reveal-zoom, .home-banner').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.home-banner').forEach((el) => el.classList.add('is-visible'));
  }

  /* --- Pocetna: kartice Kaisevi / Torbe / Novcanici / Dodaci --- */
  const homeTabs = Array.from(document.querySelectorAll('.home-tab'));
  homeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      homeTabs.forEach((other) => {
        const active = other === tab;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-selected', active ? 'true' : 'false');
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
    });
  });

  /* --- Product shelf: scroll arrows --- */
  function updateShelfArrows(shelf) {
    const track = shelf.querySelector('.product-shelf-track');
    const prevBtn = shelf.querySelector('.shelf-scroll-btn.prev');
    const nextBtn = shelf.querySelector('.shelf-scroll-btn.next');
    if (!track) return;
    if (prevBtn) prevBtn.hidden = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  document.querySelectorAll('.product-shelf').forEach((shelf) => {
    const track = shelf.querySelector('.product-shelf-track');
    const prevBtn = shelf.querySelector('.shelf-scroll-btn.prev');
    const nextBtn = shelf.querySelector('.shelf-scroll-btn.next');
    if (!track) return;
    const scrollAmount = () => Math.min(track.clientWidth * 0.8, 600);
    if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    track.addEventListener('scroll', () => updateShelfArrows(shelf), { passive: true });
    updateShelfArrows(shelf);
  });
});
