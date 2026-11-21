/**
 * AETHERIA PHARMACY - MAIN JAVASCRIPT SYSTEM
 * Pure Vanilla JavaScript (ES6+) - Accessible, Fast, Zero Dependencies
 * Supports UN SDG 3: Good Health and Well-Being
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initMedicineCatalog();
  initGalleryLightbox();
  initContactFormValidation();
  initReflectionSafetyChecks();
});

/* ==========================================================================
   1. Mobile Navigation & Active Glow
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link highlighter based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. Medicine Catalog (Search, Filter, Dynamic Render)
   ========================================================================== */
const MEDICINE_DATA = [
  {
    id: 'paracetamol',
    name: 'Paracetamol (500mg)',
    category: 'Pain & Fever',
    commonUse: 'Relief of mild-to-moderate pain, headaches, muscle aches, and reduction of high fever.',
    price: 32,
    unit: 'strip of 10 tablets',
    available: true,
    safetyNote: 'Follow the label; do not exceed the recommended dose. Avoid combining with other paracetamol products to protect liver health.',
    details: 'Paracetamol is an analgesic and antipyretic. Do not exceed 4,000 mg in 24 hours. Safe for most adults when taken within approved limits.'
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen (400mg)',
    category: 'Pain & Fever',
    commonUse: 'Non-steroidal anti-inflammatory for joint aches, dental pain, menstrual cramps, and swelling.',
    price: 48,
    unit: 'strip of 10 tablets',
    available: true,
    safetyNote: 'Take with or immediately after food or milk to prevent stomach discomfort. Avoid if you have active stomach ulcers or severe renal issues.',
    details: 'NSAID that blocks prostaglandins. Always take with meals and water. Consult a physician before use if you have asthma or cardiovascular conditions.'
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine (10mg)',
    category: 'Allergy',
    commonUse: 'Antihistamine relief for allergic rhinitis, seasonal hay fever, runny nose, sneezing, and skin hives.',
    price: 38,
    unit: 'strip of 10 tablets',
    available: true,
    safetyNote: 'May cause drowsiness in some individuals. Exercise caution when driving or operating machinery.',
    details: 'Second-generation antihistamine offering 24-hour relief from airborne allergens and urticaria with minimal anticholinergic side effects.'
  },
  {
    id: 'fexofenadine',
    name: 'Fexofenadine (120mg)',
    category: 'Allergy',
    commonUse: 'Non-sedating antihistamine for seasonal allergic rhinitis, watery eyes, and allergic itchiness.',
    price: 95,
    unit: 'strip of 10 tablets',
    available: true,
    safetyNote: 'Take with plain water; avoid fruit juices (such as grapefruit, orange, or apple) 2 hours before or after, as they reduce absorption.',
    details: 'Non-drowsy formulation favored during daytime work and study sessions. Does not readily cross the blood-brain barrier.'
  },
  {
    id: 'ors',
    name: 'Oral Rehydration Salts (ORS)',
    category: 'Digestive',
    commonUse: 'Replenishing vital fluids, electrolytes, and preventing dehydration during acute diarrhea or vomiting.',
    price: 22,
    unit: 'sachet for 1 Litre solution',
    available: true,
    safetyNote: 'Mix strictly with clean drinking water as per packet directions. Discard any unused reconstituted solution after 24 hours.',
    details: 'WHO-standard balanced formula of glucose, sodium chloride, potassium chloride, and trisodium citrate for rapid cellular rehydration.'
  },
  {
    id: 'antacid-tablets',
    name: 'Antacid Chewable Tablets',
    category: 'Digestive',
    commonUse: 'Fast neutralisation of excess gastric acid for heartburn, acid reflux, and sour indigestion.',
    price: 42,
    unit: 'pack of 12 chewables',
    available: true,
    safetyNote: 'Use as advised on the pack. Chew tablets thoroughly before swallowing. Do not use continuously for more than 14 days without medical advice.',
    details: 'Contains aluminum hydroxide, magnesium hydroxide, and simethicone to neutralize gastric stomach acid and reduce gas bloat.'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole (20mg)',
    category: 'Digestive',
    commonUse: 'Proton pump inhibitor (PPI) for reducing stomach acid production in persistent heartburn and GERD.',
    price: 68,
    unit: 'strip of 10 capsules',
    available: false, // Out of Stock demo
    safetyNote: 'Take 30 to 60 minutes before morning breakfast with a full glass of water. Swallow whole without crushing or chewing.',
    details: 'Currently experiencing temporary supply-chain replenishment. Re-stock expected within 48 hours. Consult our pharmacist for suitable alternatives.'
  },
  {
    id: 'mefenamic',
    name: 'Mefenamic Acid (250mg)',
    category: 'Pain & Fever',
    commonUse: 'Targeted relief for acute inflammatory pain, menstrual cramps (dysmenorrhea), and vascular headaches.',
    price: 54,
    unit: 'strip of 10 tablets',
    available: false, // Out of Stock demo
    safetyNote: 'Short-term use only (maximum 7 days). Take with meals to protect the gastric mucosa.',
    details: 'Currently on batch quality quarantine. Our consultation desk can guide you toward authorized equivalent pain relievers.'
  }
];

function initMedicineCatalog() {
  const gridContainer = document.getElementById('medicinesCardsGrid');
  const searchInput = document.getElementById('medicineSearchInput');
  const filterButtons = document.querySelectorAll('.category-filter-buttons .filter-btn');
  const emptyState = document.getElementById('medicineEmptyState');

  if (!gridContainer || !searchInput) return;

  let currentCategory = 'All';
  let searchQuery = '';
  let debounceTimer = null;

  function renderCards() {
    const query = searchQuery.trim().toLowerCase();
    const filtered = MEDICINE_DATA.filter(med => {
      const matchesCategory = currentCategory === 'All' || med.category.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch = query === '' || 
        med.name.toLowerCase().includes(query) || 
        med.commonUse.toLowerCase().includes(query) ||
        med.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // High performance batch DOM update with DocumentFragment
    const fragment = document.createDocumentFragment();

    filtered.forEach(med => {
      const card = document.createElement('article');
      card.className = 'medicine-card specular-card mirror-reflect';
      card.setAttribute('data-id', med.id);

      const statusClass = med.available ? 'available' : 'out-of-stock';
      const statusText = med.available ? 'Available' : 'Out of Stock';

      card.innerHTML = `
        <div>
          <div class="med-header">
            <h3 class="med-name">${escapeHTML(med.name)}</h3>
            <span class="med-category-pill">${escapeHTML(med.category)}</span>
          </div>
          <div class="med-use-block">
            <p class="med-use-label">Common Use</p>
            <p class="med-use-text">${escapeHTML(med.commonUse)}</p>
          </div>
        </div>
        <div>
          <div class="med-footer">
            <div class="med-price-box">
              <span class="med-price">₹${med.price}</span>
              <span class="med-price-unit">/ ${escapeHTML(med.unit)}</span>
            </div>
            <span class="status-pill ${statusClass}">${statusText}</span>
          </div>
          <button type="button" class="btn btn-glass btn-view-med" style="width: 100%; margin-top: 1rem; padding: 0.6rem; font-size: 0.85rem;" data-id="${med.id}">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Educational Notes
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    gridContainer.innerHTML = '';
    gridContainer.appendChild(fragment);

    // Attach click events for educational notes modal
    gridContainer.querySelectorAll('.btn-view-med').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openMedicineDetailModal(id);
      });
    });
  }

  // Debounced search input handler with requestAnimationFrame
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      window.requestAnimationFrame(() => {
        searchQuery = e.target.value;
        renderCards();
      });
    }, 60);
  });

  // Category filter handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      window.requestAnimationFrame(renderCards);
    });
  });

  // Initial render
  renderCards();
}

/* ==========================================================================
   2.1 Educational Detail Modal for Medicine
   ========================================================================== */
function openMedicineDetailModal(medId) {
  const med = MEDICINE_DATA.find(m => m.id === medId);
  if (!med) return;

  let modal = document.getElementById('medicineDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'medicineDetailModal';
    modal.className = 'lightbox-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lightbox-dialog" style="max-width: 620px;">
      <button type="button" class="lightbox-close" id="closeMedModalBtn" aria-label="Close dialog">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <div class="med-header" style="margin-bottom: 1.25rem;">
        <h3 style="font-size: 2rem; color: var(--text-primary-ice);">${escapeHTML(med.name)}</h3>
        <span class="med-category-pill" style="font-size: 0.85rem; padding: 0.35rem 0.8rem;">${escapeHTML(med.category)}</span>
      </div>
      <div class="disclaimer-banner" style="margin-bottom: 1.5rem; padding: 0.85rem 1.1rem;">
        <svg class="disclaimer-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="disclaimer-text" style="font-size: 0.86rem;">
          <strong>Educational Reference Only:</strong> Not a prescription or dosage recommendation. Consult a registered pharmacist or physician for specific medical conditions.
        </p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-mint-chrome); letter-spacing: 0.08em; margin-bottom: 0.3rem;">Primary Indication & Purpose</h4>
          <p style="color: var(--text-primary-ice); font-size: 1rem;">${escapeHTML(med.commonUse)}</p>
        </div>
        <div>
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: #fcd34d; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Critical Safety & Handling Advisory</h4>
          <p style="color: #fef3c7; font-size: 0.95rem; font-style: italic;">${escapeHTML(med.safetyNote)}</p>
        </div>
        <div>
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary-sage); letter-spacing: 0.08em; margin-bottom: 0.3rem;">Pharmacological Overview</h4>
          <p style="color: var(--text-secondary-sage); font-size: 0.95rem;">${escapeHTML(med.details)}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted-dark); text-transform: uppercase;">Standard Reference Cost:</span>
            <span style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary-ice); margin-left: 0.5rem;">₹${med.price}</span>
            <span style="font-size: 0.82rem; color: var(--text-secondary-sage);"> (${escapeHTML(med.unit)})</span>
          </div>
          <span class="status-pill ${med.available ? 'available' : 'out-of-stock'}">
            ${med.available ? 'In Stock for Educational Review' : 'Out of Stock'}
          </span>
        </div>
      </div>
      <div style="text-align: right;">
        <button type="button" class="btn btn-primary" id="btnAcknowledgeMed" style="padding: 0.7rem 1.4rem;">Got It</button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  const closeBtn = modal.querySelector('#closeMedModalBtn');
  const ackBtn = modal.querySelector('#btnAcknowledgeMed');

  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  ackBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const onKey = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKey);
    }
  };
  document.addEventListener('keydown', onKey);
}

/* ==========================================================================
   3. Gallery Lightbox Viewer
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-frame-card');
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('#lightboxImageContainer');
  const lightboxTitle = lightbox.querySelector('#lightboxTitle');
  const lightboxDesc = lightbox.querySelector('#lightboxDesc');
  const closeBtn = lightbox.querySelector('#closeLightboxBtn');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const media = item.querySelector('.gallery-media-wrapper').innerHTML;
      const title = item.querySelector('.gallery-caption-title')?.textContent || '';
      const desc = item.querySelector('.gallery-caption-desc')?.textContent || '';

      if (lightboxImg) lightboxImg.innerHTML = media;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   4. Contact Form Strict Validation & Confirmation Modal
   ========================================================================== */
function initContactFormValidation() {
  const form = document.getElementById('pharmacyContactForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const inquiryTypeSelect = document.getElementById('inquiryType');
  const messageInput = document.getElementById('messageText');
  const confirmModal = document.getElementById('contactConfirmationModal');
  const successBanner = document.getElementById('contactSuccessBanner');

  // Regex patterns
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_DIGITS_ONLY_REGEX = /^\d{10}$/;

  // Helper: show or clear error state
  function setError(input, errorElementId, message) {
    const errorEl = document.getElementById(errorElementId);
    input.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(input, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    input.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  // Real-time phone sanitization: only allow digits to be typed
  phoneInput.addEventListener('input', (e) => {
    // strip out any non-numeric character immediately
    const clean = e.target.value.replace(/\D/g, '');
    e.target.value = clean.slice(0, 10); // cap at 10 digits
    if (e.target.value.length === 10) {
      clearError(phoneInput, 'phoneError');
    }
  });

  // Clear errors on field focus/input
  fullNameInput.addEventListener('input', () => clearError(fullNameInput, 'nameError'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'emailError'));
  inquiryTypeSelect.addEventListener('change', () => clearError(inquiryTypeSelect, 'inquiryError'));
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) {
      clearError(messageInput, 'messageError');
    }
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Full Name validation (non-empty, minimum 2 characters)
    const nameVal = fullNameInput.value.trim();
    if (!nameVal) {
      setError(fullNameInput, 'nameError', 'Please enter your full name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      setError(fullNameInput, 'nameError', 'Full name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(fullNameInput, 'nameError');
    }

    // 2. Email validation (RFC regex format)
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setError(emailInput, 'emailError', 'Please enter your email address.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailVal)) {
      setError(emailInput, 'emailError', 'Please provide a valid email format (e.g., student@university.edu).');
      isValid = false;
    } else {
      clearError(emailInput, 'emailError');
    }

    // 3. Phone validation (Strictly 10 numeric digits, no letters or wrong lengths)
    const phoneVal = phoneInput.value.trim();
    if (!phoneVal) {
      setError(phoneInput, 'phoneError', 'Please enter your 10-digit mobile number.');
      isValid = false;
    } else if (!PHONE_DIGITS_ONLY_REGEX.test(phoneVal)) {
      setError(phoneInput, 'phoneError', 'Phone number must be exactly 10 numeric digits (e.g., 9876543210). Letters, symbols, or incorrect lengths are prohibited.');
      isValid = false;
    } else {
      clearError(phoneInput, 'phoneError');
    }

    // 4. Inquiry Type validation
    const inquiryVal = inquiryTypeSelect.value;
    if (!inquiryVal) {
      setError(inquiryTypeSelect, 'inquiryError', 'Please choose an inquiry classification.');
      isValid = false;
    } else {
      clearError(inquiryTypeSelect, 'inquiryError');
    }

    // 5. Message validation (minimum 10 characters)
    const messageVal = messageInput.value.trim();
    if (!messageVal) {
      setError(messageInput, 'messageError', 'Please provide your inquiry message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      setError(messageInput, 'messageError', `Message must be at least 10 characters long (currently ${messageVal.length}).`);
      isValid = false;
    } else {
      clearError(messageInput, 'messageError');
    }

    if (!isValid) {
      // Focus on first invalid input
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Prompt user confirmation before submission
    openConfirmationModal({
      name: nameVal,
      email: emailVal,
      phone: phoneVal,
      inquiry: inquiryTypeSelect.options[inquiryTypeSelect.selectedIndex].text,
      message: messageVal
    });
  });

  function openConfirmationModal(data) {
    if (!confirmModal) return;

    // Populate review fields
    document.getElementById('modalReviewName').textContent = data.name;
    document.getElementById('modalReviewEmail').textContent = data.email;
    document.getElementById('modalReviewPhone').textContent = data.phone;
    document.getElementById('modalReviewInquiry').textContent = data.inquiry;
    document.getElementById('modalReviewMessage').textContent = data.message;

    confirmModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const cancelBtn = document.getElementById('btnCancelSubmission');
    const confirmBtn = document.getElementById('btnConfirmSubmission');

    function closeConfirm() {
      confirmModal.classList.remove('active');
      document.body.style.overflow = '';
      cancelBtn.removeEventListener('click', closeConfirm);
      confirmBtn.removeEventListener('click', executeSubmit);
    }

    function executeSubmit() {
      closeConfirm();

      // Simulate instantaneous clean static submission
      form.reset();

      if (successBanner) {
        // Generate random inquiry ref ID
        const refId = 'APH-' + Math.floor(100000 + Math.random() * 900000);
        const refSpan = document.getElementById('submissionRefId');
        if (refSpan) refSpan.textContent = refId;

        successBanner.classList.add('visible');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    cancelBtn.addEventListener('click', closeConfirm);
    confirmBtn.addEventListener('click', executeSubmit);
  }
}

/* ==========================================================================
   5. Reflection Safety Checks & Responsive Viewport Safeguard
   ========================================================================== */
function initReflectionSafetyChecks() {
  // Ensure that no horizontal scrolling happens due to reflections
  const checkWidth = () => {
    if (document.body.scrollWidth > window.innerWidth) {
      document.body.style.overflowX = 'hidden';
    }
  };
  window.addEventListener('resize', checkWidth);
  checkWidth();
}

/* ==========================================================================
   Utility Helpers
   ========================================================================== */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
