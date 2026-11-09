
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
        { id: 'docs-home', label: 'Overview', href: root + 'docs.html#overview' },
        { id: 'cli', label: 'Sorleed CLI', href: root + 'docs.html#cli' },
        { id: 'tokens', label: 'Design Tokens', href: root + 'docs.html#tokens' },
        { id: 'accessibility', label: 'Accessibility (AA)', href: root + 'docs.html#accessibility' },
        { id: 'ai-skill', label: 'AI Agent Skill', href: root + 'docs.html#ai-skill' }
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
    const clickHandler = item.href.includes('docs.html#') ? `onclick="if(window.location.pathname.endsWith('docs.html')){ switchDocsSection('${item.id === 'docs-home' ? 'overview' : item.id}'); return false; }"` : '';
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
  stage.classList.remove('state--default', 'state--hover', 'state--focus', 'state--error', 'state--disabled', 'state--authenticating', 'state--success');
  stage.classList.add('state--' + state);

  const isError = state === 'error';
  const isDisabled = state === 'disabled';
  const isFocus = state === 'focus';
  const isHover = state === 'hover';

  // 1. Inputs, Buttons, Form elements disabled toggle
  const formElements = stage.querySelectorAll('input, button:not(.ctrl-select), select:not(.ctrl-select), textarea');
  formElements.forEach(el => {
    // Skip internal playground controls if any
    if (el.closest('.playground-panel')) return;
    if (isDisabled) {
      el.setAttribute('disabled', 'true');
    } else {
      el.removeAttribute('disabled');
    }
  
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

  // 5. Standard text input focus styling
  const firstInput = stage.querySelector('.fc-input__field, input[type="text"], input[type="password"]');
  if (isFocus && firstInput) {
    firstInput.focus();
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
});
