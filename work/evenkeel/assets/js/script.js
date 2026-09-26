  const amtOutEl = document.getElementById('amtOut');
  if (amtOutEl) {
    function updateEstimator(val){
      val = parseInt(val,10);
      document.getElementById('amtOut').textContent = val.toLocaleString();
      const pct = Math.round(45 + (val-10000)/(100000-10000)*20);
      document.getElementById('pctOut').textContent = pct + '%';
      document.getElementById('yearsOut').textContent = val > 60000 ? '4-5 years' : '3-5 years';
    }
    updateEstimator(20000);
  }

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const menuBackdrop = document.getElementById('menuBackdrop');
  if (header && menuToggle && menuBackdrop) {
    function toggleMenu(force){
      const willOpen = typeof force === 'boolean' ? force : !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', willOpen);
      menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      document.body.style.overflow = willOpen ? 'hidden' : '';
    }
    menuToggle.addEventListener('click', () => toggleMenu());
    menuBackdrop.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') toggleMenu(false); });
  }

  /* ---- Funnel: debt amount selection (step 1) ---- */
  const amountList = document.getElementById('amountList');
  const qualifyBtn = document.getElementById('qualifyBtn');
  const wizard = document.getElementById('funnelWizard');
  let selectedAmount = null;
  let selectedBehind = null;

  function goToPanel(panelNum){
    if (!wizard) return;
    wizard.querySelectorAll('.funnel-panel').forEach(p => {
      p.hidden = p.getAttribute('data-panel') !== String(panelNum);
    });
  }

  /* ---- Wizard browser history support ----
     Without this, the browser back button on step 2/3 would navigate away
     from landing.html entirely instead of stepping back within the wizard. */
  if (wizard) {
    // Establish a baseline history entry for step 1 on page load.
    if (!history.state || typeof history.state.wizardStep === 'undefined') {
      history.replaceState({ wizardStep: 1 }, '', window.location.href);
    }

    window.addEventListener('popstate', (e) => {
      const step = (e.state && e.state.wizardStep) ? e.state.wizardStep : 1;
      goToPanel(step);
    });
  }

  function goToPanelWithHistory(panelNum){
    goToPanel(panelNum);
    if (wizard) {
      history.pushState({ wizardStep: panelNum }, '', window.location.href);
    }
  }

  if (amountList && qualifyBtn) {
    const amountBtns = amountList.querySelectorAll('.funnel-amount-btn');
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAmount = btn.getAttribute('data-amount');
        qualifyBtn.disabled = false;
        qualifyBtn.classList.add('enabled');
      });
    });
    qualifyBtn.addEventListener('click', () => {
      if (qualifyBtn.disabled) return;
      goToPanelWithHistory(2);
    });
  }

  /* ---- Funnel: behind on payments (step 2) ---- */
  const behindList = document.getElementById('behindList');
  const nextStepBtn = document.getElementById('nextStepBtn');
  if (behindList && nextStepBtn) {
    const behindBtns = behindList.querySelectorAll('.funnel-option-btn');
    behindBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        behindBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedBehind = btn.getAttribute('data-behind');
        nextStepBtn.disabled = false;
        nextStepBtn.classList.add('enabled');
      });
    });
    nextStepBtn.addEventListener('click', () => {
      if (nextStepBtn.disabled) return;
      goToPanelWithHistory(3);
    });
  }

  /* ---- Funnel: back buttons (any step) ----
     Uses history.back() rather than jumping panels directly, so the in-page
     Back button and the browser's own back button stay in sync with each other. */
  if (wizard) {
    wizard.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        history.back();
      });
    });
  }

  /* ---- Funnel: contact form (step 3) ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(input, message){
      const field = input.closest('.funnel-field');
      field.classList.add('field-error');
      let msg = field.parentElement.querySelector('.funnel-field-error-msg[data-for="' + input.id + '"]');
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'funnel-field-error-msg';
        msg.setAttribute('data-for', input.id);
        field.insertAdjacentElement('afterend', msg);
      }
      msg.textContent = message;
    }
    function clearFieldError(input){
      const field = input.closest('.funnel-field');
      field.classList.remove('field-error');
      const msg = field.parentElement.querySelector('.funnel-field-error-msg[data-for="' + input.id + '"]');
      if (msg) msg.remove();
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');

      [firstName, lastName, phone].forEach(input => {
        if (!input.value.trim()) {
          setFieldError(input, 'This field is required.');
          valid = false;
        } else {
          clearFieldError(input);
        }
      });

      if (!email.value.trim()) {
        setFieldError(email, 'This field is required.');
        valid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        valid = false;
      } else {
        clearFieldError(email);
      }

      if (!valid) return;

      const submission = {
        debtAmount: selectedAmount,
        behindOnPayments: selectedBehind,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        smsConsent: document.getElementById('smsConsent').checked
      };
      // TODO: send `submission` to the real lead-capture endpoint once Chad's team has one.
      console.log('Qualification submission:', submission);

      const params = new URLSearchParams({ name: submission.firstName });
      window.location.href = 'thank-you.html?' + params.toString();
    });
  }

  /* ---- Thank-you page: greet by name if present in URL ---- */
  const thankyouNameEl = document.getElementById('thankyouName');
  if (thankyouNameEl) {
    const urlParams = new URLSearchParams(window.location.search);
    const name = (urlParams.get('name') || '').trim();
    // Basic sanitization: only allow letters, spaces, hyphens, apostrophes to avoid
    // rendering anything unexpected from the URL back into the page.
    const safeName = /^[A-Za-z\s\-']{0,40}$/.test(name) ? name : '';
    thankyouNameEl.textContent = safeName ? ' ' + safeName : '';
  }

  /* ---- Contact page form ---- */
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setContactFieldError(input, message){
      const field = input.closest('.funnel-field');
      field.classList.add('field-error');
      let msg = field.parentElement.querySelector('.funnel-field-error-msg[data-for="' + input.id + '"]');
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'funnel-field-error-msg';
        msg.setAttribute('data-for', input.id);
        field.insertAdjacentElement('afterend', msg);
      }
      msg.textContent = message;
    }
    function clearContactFieldError(input){
      const field = input.closest('.funnel-field');
      field.classList.remove('field-error');
      const msg = field.parentElement.querySelector('.funnel-field-error-msg[data-for="' + input.id + '"]');
      if (msg) msg.remove();
    }

    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('cName');
      const email = document.getElementById('cEmail');
      const subject = document.getElementById('cSubject');
      const message = document.getElementById('cMessage');

      if (!name.value.trim()) {
        setContactFieldError(name, 'This field is required.');
        valid = false;
      } else {
        clearContactFieldError(name);
      }

      if (!email.value.trim()) {
        setContactFieldError(email, 'This field is required.');
        valid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        setContactFieldError(email, 'Enter a valid email address.');
        valid = false;
      } else {
        clearContactFieldError(email);
      }

      if (!subject.value) {
        setContactFieldError(subject, 'Please select one.');
        valid = false;
      } else {
        clearContactFieldError(subject);
      }

      if (!message.value.trim()) {
        setContactFieldError(message, 'This field is required.');
        valid = false;
      } else {
        clearContactFieldError(message);
      }

      if (!valid) return;

      const submission = {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: document.getElementById('cPhone').value.trim(),
        subject: subject.value,
        message: message.value.trim()
      };
      // TODO: send `submission` to the real contact/lead endpoint once Chad's team has one.
      console.log('Contact form submission:', submission);

      mainContactForm.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
      const confirmEl = document.getElementById('contactConfirm');
      if (confirmEl) confirmEl.hidden = false;
    });
  }




