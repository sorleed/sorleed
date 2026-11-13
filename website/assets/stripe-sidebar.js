
// Mobile Drawer & Header Hamburger Setup
function setupMobileNavigation() {
  const header = document.querySelector('.docs-header');
  const sidebar = document.querySelector('.docs-sidebar');
  if (!header || !sidebar) return;

  // 1. Create hamburger button if not present
  let toggleBtn = header.querySelector('.docs-header__mobile-toggle');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'docs-header__mobile-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

    const headerLeft = header.querySelector('.docs-header__left');
    if (headerLeft) {
      headerLeft.prepend(toggleBtn);
    }
  }

  // 2. Create backdrop overlay if not present
  let backdrop = document.querySelector('.docs-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'docs-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', isOpen);
    backdrop.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function syncToggleVisibility() {
    if (window.innerWidth <= 900) {
      toggleBtn.style.display = 'inline-flex';
    } else {
      toggleBtn.style.display = 'none';
      if (sidebar.classList.contains('is-open')) {
        toggleMenu(false);
      }
    }
  }

  syncToggleVisibility();
  window.addEventListener('resize', syncToggleVisibility);

  toggleBtn.addEventListener('click', () => toggleMenu());
  backdrop.addEventListener('click', () => toggleMenu(false));

  // Close drawer when a navigation link is clicked on mobile
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.sidebar-link')) {
      if (window.innerWidth <= 900) {
        toggleMenu(false);
      }
    }
  });
}

// Stripe Docs Collapsible Sidebar Navigation
function renderStripeSidebar(activeId) {
  const sidebar = document.querySelector('.docs-sidebar');
  if (!sidebar) return;

  const isComponentDir = window.location.pathname.includes('/components/');
  const root = isComponentDir ? '../' : '';

  const groups = [
    {
      name: 'Getting Started',
      items: [
        { id: 'docs-home', label: 'Overview', href: root + 'docs#overview' },
        { id: 'cli', label: 'Sorleed CLI', href: root + 'docs#cli' },
        { id: 'tokens', label: 'Design Tokens', href: root + 'docs#tokens' },
        { id: 'accessibility', label: 'Accessibility (AA)', href: root + 'docs#accessibility' },
        { id: 'ai-skill', label: 'AI Agent Skill', href: root + 'docs#ai-skill' }
      ]
    },
    {
      name: 'Component Categories',
      categories: [
        {
          id: 'cat-banking',
          name: 'Banking & Wallets',
          open: ['balance-card', 'account-summary', 'wallet-card', 'currency-exchange', 'bank-selector', 'transfer-receipt'].includes(activeId),
          items: [
            { id: 'balance-card', label: 'BalanceCard', href: root + 'components/balance-card.html' },
            { id: 'account-summary', label: 'AccountSummary', href: root + 'components/account-summary.html' },
            { id: 'wallet-card', label: 'WalletCard', href: root + 'components/wallet-card.html' },
            { id: 'currency-exchange', label: 'CurrencyExchange', href: root + 'components/currency-exchange.html' },
            { id: 'bank-selector', label: 'BankSelector', href: root + 'components/bank-selector.html' },
            { id: 'transfer-receipt', label: 'TransferReceipt', href: root + 'components/transfer-receipt.html' }
          ]
        },
        {
          id: 'cat-accounting',
          name: 'Accounting & Ledgers',
          open: ['invoice-viewer', 'spending-meter', 'journal-entry-ledger', 'tax-summary-card', 'chart-of-accounts-tree', 'expense-receipt-uploader'].includes(activeId),
          items: [
            { id: 'invoice-viewer', label: 'InvoiceViewer', href: root + 'components/invoice-viewer.html' },
            { id: 'spending-meter', label: 'SpendingMeter', href: root + 'components/spending-meter.html' },
            { id: 'journal-entry-ledger', label: 'JournalEntryLedger', href: root + 'components/journal-entry-ledger.html' },
            { id: 'tax-summary-card', label: 'TaxSummaryCard', href: root + 'components/tax-summary-card.html' },
            { id: 'chart-of-accounts-tree', label: 'ChartOfAccountsTree', href: root + 'components/chart-of-accounts-tree.html' },
            { id: 'expense-receipt-uploader', label: 'ExpenseReceiptUploader', href: root + 'components/expense-receipt-uploader.html' }
          ]
        },
        {
          id: 'cat-credit',
          name: 'Credit & Wealth',
          open: ['loan-calculator', 'credit-score-gauge', 'portfolio-summary', 'yield-curve-table', 'asset-allocation'].includes(activeId),
          items: [
            { id: 'loan-calculator', label: 'LoanCalculator', href: root + 'components/loan-calculator.html' },
            { id: 'credit-score-gauge', label: 'CreditScoreGauge', href: root + 'components/credit-score-gauge.html' },
            { id: 'portfolio-summary', label: 'PortfolioSummary', href: root + 'components/portfolio-summary.html' },
            { id: 'yield-curve-table', label: 'YieldCurveTable', href: root + 'components/yield-curve-table.html' },
            { id: 'asset-allocation', label: 'AssetAllocation', href: root + 'components/asset-allocation.html' }
          ]
        },
        {
          id: 'cat-security',
          name: 'Security & Identity',
          open: ['biometric-auth-prompt', 'kyc-doc-uploader', 'direct-debit-mandate', 'pin-input', 'otp'].includes(activeId),
          items: [
            { id: 'biometric-auth-prompt', label: 'BiometricAuthPrompt', href: root + 'components/biometric-auth-prompt.html' },
            { id: 'kyc-doc-uploader', label: 'KycDocUploader', href: root + 'components/kyc-doc-uploader.html' },
            { id: 'direct-debit-mandate', label: 'DirectDebitMandate', href: root + 'components/direct-debit-mandate.html' },
            { id: 'pin-input', label: 'PinInput', href: root + 'components/pin-input.html' },
            { id: 'otp', label: 'OTP', href: root + 'components/otp.html' }
          ]
        },
        {
          id: 'cat-forms',
          name: 'Forms & Core Controls',
          open: ['button', 'input', 'tabs', 'card', 'alert', 'select', 'checkbox', 'switch'].includes(activeId),
          items: [
            { id: 'button', label: 'Button', href: root + 'components/button.html' },
            { id: 'input', label: 'Input', href: root + 'components/input.html' },
            { id: 'tabs', label: 'Tabs', href: root + 'components/tabs.html' },
            { id: 'card', label: 'Card', href: root + 'components/card.html' },
            { id: 'alert', label: 'Alert', href: root + 'components/alert.html' },
            { id: 'select', label: 'Select', href: root + 'components/select.html' },
            { id: 'checkbox', label: 'Checkbox', href: root + 'components/checkbox.html' },
            { id: 'switch', label: 'Switch', href: root + 'components/switch.html' }
          ]
        }
      ]
    }
  ];

  let html = '';

  // 1. Getting Started Group
  html += `<div class="sidebar-group">`;
  html += `<div class="sidebar-group__header">${groups[0].name}</div>`;
  for (const item of groups[0].items) {
    const isActive = item.id === activeId ? 'active' : '';
    const clickHandler = item.href.includes('docs#') ? `onclick="if(window.location.pathname.endsWith('docs')){ switchDocsSection('${item.id === 'docs-home' ? 'overview' : item.id}'); return false; }"` : '';
    html += `<a href="${item.href}" ${clickHandler} data-nav-id="${item.id}" class="sidebar-link ${isActive}">${item.label}</a>`;
  }
  html += `</div>`;

  // 2. Component Category Dropdowns
  html += `<div class="sidebar-group">`;
  html += `<div class="sidebar-group__header">${groups[1].name}</div>`;
  for (const cat of groups[1].categories) {
    const isOpen = cat.open ? 'open' : '';
    html += `
      <details class="sidebar-dropdown" ${isOpen}>
        <summary class="sidebar-dropdown__summary">
          <span>${cat.name}</span>
          <svg class="sidebar-dropdown__arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </summary>
        <div class="sidebar-dropdown__list">
    `;
    for (const item of cat.items) {
      const isActive = item.id === activeId ? 'active' : '';
      html += `<a href="${item.href}" class="sidebar-link ${isActive}">${item.label}</a>`;
    }
    html += `</div></details>`;
  }
  html += `</div>`;

  sidebar.innerHTML = html;
}

// Comprehensive interactive state controller for playground panels
window.updateComponentState = function(state) {
  const stage = document.querySelector('.playground-stage');
  if (!stage) return;

  // Clear previous state classes
  stage.classList.remove('state--default', 'state--active', 'state--hover', 'state--focus', 'state--error', 'state--disabled', 'state--authenticating', 'state--success');
  stage.classList.add('state--' + state);

  const isError = state === 'error';
  const isDisabled = state === 'disabled';
  const isFocus = state === 'focus';
  const isActive = state === 'active';

  // 1. Inputs, Buttons, Form elements disabled toggle
  const formElements = stage.querySelectorAll('input, button:not(.ctrl-select), select:not(.ctrl-select), textarea');
  formElements.forEach(el => {
    if (el.closest('.playground-panel')) return;
    if (isDisabled) {
      el.setAttribute('disabled', 'true');
    } else {
      el.removeAttribute('disabled');
    }
  });

  // 2. OTP component state handling
  const otp = stage.querySelector('.fc-otp');
  if (otp) {
    const cells = otp.querySelectorAll('.fc-otp__cell');
    const helper = otp.querySelector('.fc-otp__message');
    if (isError) {
      cells.forEach(c => c.setAttribute('aria-invalid', 'true'));
      if (helper) {
        helper.textContent = 'Invalid verification code. Please check and try again.';
        helper.className = 'fc-otp__message fc-otp__message--error';
        helper.style.display = 'block';
      }
    } else {
      cells.forEach(c => c.removeAttribute('aria-invalid'));
      if (helper) {
        helper.textContent = '';
        helper.className = 'fc-otp__message';
        helper.style.display = 'none';
      }
    }
    if (isFocus && cells[0]) {
      cells[0].focus();
    }
  }

  // 3. PinInput component state handling
  const pinInput = stage.querySelector('.fc-pin-input');
  if (pinInput) {
    const pinCells = pinInput.querySelectorAll('.fc-pin-input__cell');
    if (isError) {
      pinInput.classList.add('fc-pin-input--error');
    } else {
      pinInput.classList.remove('fc-pin-input--error');
    }
    if (isFocus && pinCells[0]) {
      pinCells[0].focus();
    }
  }

  // 4. Biometric Auth Prompt state handling
  const bioPrompt = stage.querySelector('.fc-biometric-prompt');
  if (bioPrompt) {
    const iconWrapper = bioPrompt.querySelector('.fc-biometric-prompt__icon-wrapper');
    const actionBtn = bioPrompt.querySelector('#bio-action-btn');
    const desc = bioPrompt.querySelector('.fc-biometric-prompt__desc');
    const svgIcon = bioPrompt.querySelector('#bio-svg-icon');

    if (iconWrapper) {
      iconWrapper.className = 'fc-biometric-prompt__icon-wrapper';
      if (state === 'authenticating') iconWrapper.classList.add('fc-biometric-prompt__icon-wrapper--authenticating');
      if (state === 'success') iconWrapper.classList.add('fc-biometric-prompt__icon-wrapper--success');
      if (state === 'error') iconWrapper.classList.add('fc-biometric-prompt__icon-wrapper--error');
    }

    if (state === 'success') {
      if (desc) desc.textContent = 'Biometric authentication successful! Transfer authorized.';
      if (actionBtn) {
        actionBtn.style.display = 'none';
      }
      if (svgIcon) {
        svgIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        svgIcon.setAttribute('stroke', '#10B981');
      }
    } else if (state === 'error') {
      if (desc) desc.textContent = 'Biometric verification failed. Please try again or use your passcode.';
      if (actionBtn) {
        actionBtn.style.display = 'block';
        actionBtn.textContent = 'Retry Biometrics';
      }
      if (svgIcon) {
        svgIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>';
        svgIcon.setAttribute('stroke', '#EF4444');
      }
    } else if (state === 'authenticating') {
      if (desc) desc.textContent = 'Scanning Face ID... Please hold steady.';
      if (actionBtn) {
        actionBtn.style.display = 'block';
        actionBtn.textContent = 'Authenticating...';
      }
    } else {
      // Default / hover / focus / disabled
      if (desc) desc.textContent = 'Confirm with biometric verification to authorize this wire transfer';
      if (actionBtn) {
        actionBtn.style.display = 'block';
        actionBtn.textContent = 'Scan Face ID';
      }
      if (svgIcon) {
        svgIcon.innerHTML = '<path d="M9 3H5a2 2 0 0 0-2 2v4m18-6h-4a2 2 0 0 0-2 2v4m-12 10H5a2 2 0 0 1-2-2v-4m18 6h-4a2 2 0 0 1-2-2v-4"></path><circle cx="9" cy="10" r="1" fill="currentColor"></circle><circle cx="15" cy="10" r="1" fill="currentColor"></circle><path d="M10 15c.5.8 1.4 1.2 2 1.2s1.5-.4 2-1.2"></path>';
        svgIcon.setAttribute('stroke', 'currentColor');
      }
    }
  }

  // 5. Standard input / control focus or active styling
  const firstInput = stage.querySelector('.fc-input__field, .fc-currency__field, .fc-password-input__field, .fc-phone-input__field, .fc-cvv__field, .fc-date-picker__field, .fc-textarea__field, .fc-select__field, input:not([type="hidden"]), select, textarea');
  if ((isFocus || isActive) && firstInput && !isDisabled) {
    firstInput.focus({ preventScroll: true });
  }
};

// Interactive wire-up for all playground controls (Tree disclosure, Expense Switch, Eye Privacy, State Dropdown)
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNavigation();
  // A. State Select listener
  const stateSelects = document.querySelectorAll('.ctrl-select');
  stateSelects.forEach(sel => {
    const parentGroup = sel.closest('.playground-ctrl-group');
    if (parentGroup && parentGroup.textContent.toLowerCase().includes('state')) {
      sel.addEventListener('change', (e) => {
        window.updateComponentState(e.target.value);
      });
    }
  });

  // F. WalletCard Interactive 3D Flip (Click & Keyboard Enter/Space)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.fc-wallet-card');
    if (!card) return;
    card.classList.toggle('fc-wallet-card--flipped');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.fc-wallet-card');
      if (card) {
        e.preventDefault();
        card.classList.toggle('fc-wallet-card--flipped');
      }
    }
  });

  // B. Universal Eye Privacy Toggle (PortfolioSummary, AccountSummary, BalanceCard, etc.)
  document.addEventListener('click', (e) => {
    const eyeBtn = e.target.closest('.fc-portfolio-summary__privacy-toggle, .fc-account-summary__privacy-toggle, [aria-label*="portfolio value" i], [aria-label*="balance" i], [aria-label*="Hide" i], [aria-label*="Show" i]');
    if (!eyeBtn) return;

    // Check current state
    const currentAria = eyeBtn.getAttribute('aria-pressed');
    const isPressed = currentAria === 'true';
    const nextHidden = !isPressed;
    eyeBtn.setAttribute('aria-pressed', String(nextHidden));
    eyeBtn.setAttribute('aria-label', nextHidden ? 'Show portfolio value' : 'Hide portfolio value');

    // Clean inline SVG icons: open eye vs closed eye with diagonal slash
    const openEyeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const closedEyeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="23" x2="23" y2="1"/></svg>';

    eyeBtn.innerHTML = nextHidden ? closedEyeSvg : openEyeSvg;

    // Mask / unmask values in card container
    const card = eyeBtn.closest('.fc-portfolio-summary, .fc-account-summary, .fc-balance-card, .fc-preview-container') || eyeBtn.parentElement.parentElement;
    if (card) {
      // Find all value elements
      const targetEls = card.querySelectorAll('[data-raw-val], .fc-portfolio-summary__total, .fc-portfolio-summary__stat-value, .fc-account-summary__balance, .fc-balance-card__amount');
      targetEls.forEach(el => {
        if (!el.getAttribute('data-raw-val')) {
          el.setAttribute('data-raw-val', el.textContent.trim());
        }
        if (nextHidden) {
          el.textContent = '••••••••';
        } else {
          el.textContent = el.getAttribute('data-raw-val');
        }
      });
    }
  });

  // E. Universal Copy Button Feedback
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.fc-account-summary__copy-btn, .copy-icon-btn, [data-copy-target]');
    if (!copyBtn) return;

    let textToCopy = '';
    const fieldRow = copyBtn.closest('.fc-account-summary__field-value-row');
    if (fieldRow) {
      const valEl = fieldRow.querySelector('.fc-account-summary__field-value');
      if (valEl) textToCopy = valEl.textContent.trim();
    } else if (copyBtn.getAttribute('data-copy-value')) {
      textToCopy = copyBtn.getAttribute('data-copy-value');
    } else {
      textToCopy = copyBtn.textContent.trim();
    }

    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }

    // Visual feedback on button
    const origHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span style="color:#10B981; font-weight:700;">Copied!</span>';
    copyBtn.style.pointerEvents = 'none';
    setTimeout(() => {
      copyBtn.innerHTML = origHtml;
      copyBtn.style.pointerEvents = '';
    }, 1500);
  });

  // C. ChartOfAccountsTree dropdown / collapse nodes
  document.addEventListener('click', (e) => {
    const treeItem = e.target.closest('[data-node-toggle]');
    if (!treeItem) return;

    const targetGroupId = treeItem.getAttribute('data-node-toggle');
    const groupEl = document.getElementById(targetGroupId);
    if (!groupEl) return;

    const isExpanded = treeItem.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !isExpanded;
    treeItem.setAttribute('aria-expanded', String(nextExpanded));

    groupEl.style.display = nextExpanded ? 'block' : 'none';

    const arrow = treeItem.querySelector('.fc-tree-arrow');
    if (arrow) {
      arrow.style.transform = nextExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
    }
  });

  // D. ExpenseReceiptUploader reimbursable switch toggle
  document.addEventListener('click', (e) => {
    const sw = e.target.closest('#receipt-reimbursable-switch, .fc-switch');
    if (!sw) return;

    const isChecked = sw.getAttribute('aria-checked') === 'true';
    const nextChecked = !isChecked;
    sw.setAttribute('aria-checked', String(nextChecked));
    if (nextChecked) {
      sw.classList.add('fc-switch--checked');
    } else {
      sw.classList.remove('fc-switch--checked');
    }
  });

  // G. Accordion toggle
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.fc-accordion__trigger');
    if (!trigger) return;
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
  });

  // H. PasswordInput visibility toggle
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.fc-password-input__toggle');
    if (!toggle) return;
    const wrap = toggle.closest('.fc-password-input');
    const input = wrap ? wrap.querySelector('.fc-password-input__field') : null;
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(isPassword));
    toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    toggle.textContent = isPassword ? 'Hide password' : 'Show password';
  });

  // I. Tabs switching
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.fc-tabs__trigger');
    if (!tab) return;
    const tabsRoot = tab.closest('.fc-tabs');
    if (!tabsRoot) return;
    tabsRoot.querySelectorAll('.fc-tabs__trigger').forEach(t => {
      t.classList.remove('fc-tabs__trigger--active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tabsRoot.querySelectorAll('.fc-tabs__content').forEach(p => { p.hidden = true; });
    tab.classList.add('fc-tabs__trigger--active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    const panelId = tab.getAttribute('aria-controls');
    const panel = panelId ? tabsRoot.querySelector('#' + panelId) : null;
    if (panel) panel.hidden = false;
  });

  // J. Pagination page selection
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fc-pagination__btn');
    if (!btn || btn.disabled) return;
    const nav = btn.closest('.fc-pagination');
    if (!nav) return;
    const pageBtns = Array.from(nav.querySelectorAll('.fc-pagination__btn')).filter(b => /^\d+$/.test(b.textContent.trim()));
    if (!pageBtns.length) return;
    const currentIdx = pageBtns.findIndex(b => b.classList.contains('fc-pagination__btn--active'));
    let nextIdx = currentIdx;
    if (btn.classList.contains('fc-pagination__btn--prev')) {
      nextIdx = Math.max(0, currentIdx - 1);
    } else if (btn.classList.contains('fc-pagination__btn--next')) {
      nextIdx = Math.min(pageBtns.length - 1, currentIdx + 1);
    } else if (/^\d+$/.test(btn.textContent.trim())) {
      nextIdx = pageBtns.indexOf(btn);
    }
    if (nextIdx >= 0 && nextIdx < pageBtns.length) {
      pageBtns.forEach(b => {
        b.classList.remove('fc-pagination__btn--active');
        b.removeAttribute('aria-current');
      });
      pageBtns[nextIdx].classList.add('fc-pagination__btn--active');
      pageBtns[nextIdx].setAttribute('aria-current', 'page');
    }
  });

  // K. BankSelector search & selection
  document.querySelectorAll('.fc-bank-selector').forEach(selector => {
    const searchInput = selector.querySelector('.fc-bank-selector__search-input');
    const items = Array.from(selector.querySelectorAll('.fc-bank-selector__item'));
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        items.forEach(item => {
          const li = item.closest('li') || item;
          li.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }
    selector.addEventListener('click', (e) => {
      const item = e.target.closest('.fc-bank-selector__item');
      if (!item) return;
      items.forEach(i => {
        i.classList.remove('fc-bank-selector__item--selected');
        i.setAttribute('aria-selected', 'false');
      });
      item.classList.add('fc-bank-selector__item--selected');
      item.setAttribute('aria-selected', 'true');
    });
  });

  // L. CurrencyExchange live conversion & swap
  document.querySelectorAll('.fc-currency-exchange').forEach(fx => {
    const inputs = fx.querySelectorAll('.fc-currency-exchange__input');
    const selects = fx.querySelectorAll('.fc-currency-exchange__currency-select');
    const swapBtn = fx.querySelector('.fc-currency-exchange__swap-button');
    const ticker = fx.querySelector('.fc-currency-exchange__rate-ticker span:last-child');
    if (inputs.length < 2 || selects.length < 2) return;

    const usdRates = { USD: 1, EUR: 0.9225, GBP: 0.785, NGN: 1580, CAD: 1.38, GHS: 15.2, KES: 129.5 };
    selects[0].value = fx.getAttribute('fromCurrency') || 'USD';
    selects[1].value = fx.getAttribute('toCurrency') || 'EUR';
    inputs[0].value = fx.getAttribute('fromAmount') || '5000.00';

    function recalc(fromReceive = false) {
      const fromCur = selects[0].value;
      const toCur = selects[1].value;
      const rate = (usdRates[toCur] || 1) / (usdRates[fromCur] || 1);
      if (ticker) ticker.textContent = `1 ${fromCur} = ${rate.toFixed(4)} ${toCur}`;
      if (fromReceive) {
        const val = parseFloat(inputs[1].value.replace(/,/g, '')) || 0;
        inputs[0].value = (val / rate).toFixed(2);
      } else {
        const val = parseFloat(inputs[0].value.replace(/,/g, '')) || 0;
        inputs[1].value = (val * rate).toFixed(2);
      }
    }

    inputs[0].addEventListener('input', () => recalc(false));
    inputs[1].addEventListener('input', () => recalc(true));
    selects[0].addEventListener('change', () => recalc(false));
    selects[1].addEventListener('change', () => recalc(false));
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const tmp = selects[0].value;
        selects[0].value = selects[1].value;
        selects[1].value = tmp;
        recalc(false);
      });
    }
    recalc(false);
  });

  // M. LoanCalculator live EMI sliders
  document.querySelectorAll('.fc-loan-calculator').forEach(calc => {
    const sliders = calc.querySelectorAll('.fc-loan-calculator__slider');
    const values = calc.querySelectorAll('.fc-loan-calculator__value');
    const emiEl = calc.querySelector('.fc-loan-calculator__emi-amount');
    const stats = calc.querySelectorAll('.fc-loan-calculator__stats-grid strong');
    if (sliders.length < 2) return;

    function updateLoan() {
      const P = parseFloat(sliders[0].value) || 10000;
      const n = parseInt(sliders[1].value, 10) || 24;
      const r = 0.12 / 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalRepay = emi * n;
      const totalInterest = totalRepay - P;

      if (values[0]) values[0].textContent = `USD ${Math.round(P).toLocaleString()}`;
      if (values[1]) values[1].textContent = `${n} Months (${(n / 12).toFixed(1).replace(/\.0$/, '')} yrs)`;
      if (emiEl) emiEl.textContent = `USD ${Math.round(emi).toLocaleString()}/mo`;
      if (stats[0]) stats[0].textContent = `USD ${Math.round(totalInterest).toLocaleString()}`;
      if (stats[1]) stats[1].textContent = `USD ${Math.round(totalRepay).toLocaleString()}`;
    }

    sliders[0].addEventListener('input', updateLoan);
    sliders[1].addEventListener('input', updateLoan);
    updateLoan();
  });

  // N. SplitBillCalculator live tip & total calculation
  document.querySelectorAll('.fc-split-bill').forEach(bill => {
    const amountInput = bill.querySelector('.fc-currency__field');
    const tipBtns = Array.from(bill.querySelectorAll('.fc-split-bill__tip-btn'));
    const heroAmount = bill.querySelector('.fc-split-bill__hero-amount');
    const shareEls = bill.querySelectorAll('.fc-split-bill__participant-share');
    const tipHeading = Array.from(bill.querySelectorAll('span')).find(s => s.textContent.includes('Add Tip'));
    const participantsCount = shareEls.length || 3;
    let tipPct = 15;

    function updateSplit() {
      const total = parseFloat(amountInput ? amountInput.value.replace(/,/g, '') : 120) || 0;
      const perPerson = (total * (1 + tipPct / 100)) / participantsCount;
      const formatted = `USD ${perPerson.toFixed(2)}`;
      if (heroAmount) heroAmount.textContent = formatted;
      shareEls.forEach(el => { el.textContent = formatted; });
      if (tipHeading) tipHeading.textContent = `Add Tip (${tipPct}%)`;
    }

    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tipBtns.forEach(b => {
          b.classList.remove('fc-split-bill__tip-btn--selected');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('fc-split-bill__tip-btn--selected');
        btn.setAttribute('aria-checked', 'true');
        const m = btn.textContent.match(/(\d+)/);
        tipPct = m ? parseInt(m[1], 10) : 0;
        updateSplit();
      });
    });

    if (amountInput) {
      amountInput.addEventListener('input', updateSplit);
    }
  });

  // O. BiometricAuthPrompt Scan Face ID button
  const bioActionBtn = document.getElementById('bio-action-btn');
  if (bioActionBtn) {
    bioActionBtn.addEventListener('click', () => {
      const stateSelect = document.querySelector('.playground-panel .ctrl-select');
      window.updateComponentState('authenticating');
      if (stateSelect) stateSelect.value = 'authenticating';
      setTimeout(() => {
        window.updateComponentState('success');
        if (stateSelect) stateSelect.value = 'success';
      }, 900);
    });
  }
});
