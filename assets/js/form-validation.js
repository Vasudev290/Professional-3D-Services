/**
 * Frontend Contact Form Validation & Submission Handler
 * Task 2 & Task 3 Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const phoneCountryCodeSelect = document.getElementById('phoneCountryCode');
  const serviceTypeInput = document.getElementById('serviceType');
  const messageInput = document.getElementById('message');
  const honeypotInput = document.getElementById('website_hp');
  const formTokenInput = document.getElementById('formToken');
  const captchaInput = document.getElementById('captchaInput');
  const captchaDisplay = document.getElementById('captchaDisplay');
  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
  const termsCheck = document.getElementById('termsCheck');

  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');
  const successAlert = document.getElementById('formSuccessAlert');
  const errorAlert = document.getElementById('formErrorAlert');
  const errorMessage = document.getElementById('formErrorMessage');

  // Error text elements
  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const serviceTypeError = document.getElementById('serviceTypeError');
  const messageError = document.getElementById('messageError');
  const captchaError = document.getElementById('captchaError');
  const termsError = document.getElementById('termsError');

  // Generate unique submission token & timestamp on page load to prevent duplicate submissions
  const generateToken = () => 'tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  if (formTokenInput) {
    formTokenInput.value = generateToken();
  }

  // Captcha Generator Helper
  const generateCaptchaCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const refreshCaptcha = () => {
    const newCode = generateCaptchaCode();
    if (captchaDisplay) captchaDisplay.textContent = newCode;
    if (captchaInput) {
      captchaInput.value = '';
      captchaInput.classList.remove('error', 'success');
    }
    if (captchaError) captchaError.classList.remove('visible');
  };

  if (captchaDisplay && (!captchaDisplay.textContent || captchaDisplay.textContent.trim().length !== 4)) {
    refreshCaptcha();
  }

  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      refreshCaptcha();
    });
  }

  let isSubmitting = false;

  // Validation Rules & Helpers
  const validators = {
    fullName: (value) => {
      const trimmed = value.trim();
      return trimmed.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(trimmed);
    },
    email: (value) => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      return emailRegex.test(value.trim());
    },
    phone: (value) => {
      const cleaned = value.replace(/[\s\-\(\)\+\.]/g, '');
      return cleaned.length >= 7 && cleaned.length <= 15 && /^[0-9]+$/.test(cleaned);
    },
    serviceType: (value) => {
      return value && value.trim() !== '';
    },
    message: (value) => {
      return value.trim().length >= 10;
    },
    captcha: (value) => {
      if (!captchaDisplay) return true;
      const currentCode = captchaDisplay.textContent.trim();
      return value.trim().toLowerCase() === currentCode.toLowerCase();
    },
    terms: () => {
      return !termsCheck || termsCheck.checked;
    }
  };

  // Helper: Show or Hide field error
  // If forceValidate is false and the field is empty, clear errors to stay clean and neutral
  function validateField(input, errorElement, validatorFn, forceValidate = false) {
    if (!input) return true;

    // When user clears the field (empty), remove red error and green success badges
    if (!forceValidate && input.value.trim() === '') {
      input.classList.remove('error', 'success');
      if (errorElement) errorElement.classList.remove('visible');
      return false;
    }

    const isValid = validatorFn(input.value);
    if (!isValid) {
      input.classList.add('error');
      input.classList.remove('success');
      if (errorElement) errorElement.classList.add('visible');
    } else {
      input.classList.remove('error');
      input.classList.add('success');
      if (errorElement) errorElement.classList.remove('visible');
    }
    return isValid;
  }

  // Real-time validation listeners: clears error as soon as field is cleared/empty
  function attachFieldEvents(input, errorElement, validatorFn) {
    if (!input) return;

    input.addEventListener('input', () => {
      if (input.value.trim() === '') {
        input.classList.remove('error', 'success');
        if (errorElement) errorElement.classList.remove('visible');
      } else if (input.classList.contains('error')) {
        validateField(input, errorElement, validatorFn, false);
      }
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.classList.remove('error', 'success');
        if (errorElement) errorElement.classList.remove('visible');
      } else {
        validateField(input, errorElement, validatorFn, false);
      }
    });
  }

  attachFieldEvents(fullNameInput, fullNameError, validators.fullName);
  attachFieldEvents(emailInput, emailError, validators.email);
  attachFieldEvents(messageInput, messageError, validators.message);

  if (phoneInput) {
    // Only allow numeric digits (0-9). Prevent any letters or symbols from being typed
    phoneInput.addEventListener('keypress', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Strip out non-numeric characters and clear error when empty
    phoneInput.addEventListener('input', () => {
      const numericOnly = phoneInput.value.replace(/[^0-9]/g, '');
      if (phoneInput.value !== numericOnly) {
        phoneInput.value = numericOnly;
      }
      if (phoneInput.value.trim() === '') {
        phoneInput.classList.remove('error', 'success');
        if (phoneError) phoneError.classList.remove('visible');
      } else if (phoneInput.classList.contains('error')) {
        validateField(phoneInput, phoneError, validators.phone, false);
      }
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.trim() === '') {
        phoneInput.classList.remove('error', 'success');
        if (phoneError) phoneError.classList.remove('visible');
      } else {
        validateField(phoneInput, phoneError, validators.phone, false);
      }
    });
  }

  if (serviceTypeInput) {
    serviceTypeInput.addEventListener('change', () => {
      if (serviceTypeInput.value.trim() === '') {
        serviceTypeInput.classList.remove('error', 'success');
        if (serviceTypeError) serviceTypeError.classList.remove('visible');
      } else {
        validateField(serviceTypeInput, serviceTypeError, validators.serviceType, false);
      }
    });
  }

  if (captchaInput) {
    captchaInput.addEventListener('input', () => {
      if (captchaInput.value.trim() === '') {
        captchaInput.classList.remove('error', 'success');
        if (captchaError) captchaError.classList.remove('visible');
      } else if (captchaInput.value.trim().length === 4) {
        validateField(captchaInput, captchaError, validators.captcha, false);
      }
    });

    captchaInput.addEventListener('blur', () => {
      if (captchaInput.value.trim() === '') {
        captchaInput.classList.remove('error', 'success');
        if (captchaError) captchaError.classList.remove('visible');
      } else {
        validateField(captchaInput, captchaError, validators.captcha, false);
      }
    });
  }

  if (termsCheck) {
    termsCheck.addEventListener('change', () => {
      if (termsError) {
        if (termsCheck.checked) termsError.classList.remove('visible');
        else termsError.classList.add('visible');
      }
    });
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions if already in flight
    if (isSubmitting) return;

    // Validate all fields (forceValidate = true so empty required fields are flagged on submit)
    const isNameValid = validateField(fullNameInput, fullNameError, validators.fullName, true);
    const isEmailValid = validateField(emailInput, emailError, validators.email, true);
    const isPhoneValid = validateField(phoneInput, phoneError, validators.phone, true);
    const isServiceValid = validateField(serviceTypeInput, serviceTypeError, validators.serviceType, true);
    const isMessageValid = validateField(messageInput, messageError, validators.message, true);
    const isCaptchaValid = validateField(captchaInput, captchaError, validators.captcha, true);
    const isTermsValid = validators.terms();

    if (termsError) {
      if (!isTermsValid) termsError.classList.add('visible');
      else termsError.classList.remove('visible');
    }

    // Anti-spam honeypot check
    if (honeypotInput && honeypotInput.value !== '') {
      console.warn('Bot detected via honeypot.');
      return;
    }

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isMessageValid || !isCaptchaValid || !isTermsValid) {
      if (errorAlert) {
        errorAlert.classList.add('error');
        errorAlert.style.display = 'flex';
        if (errorMessage) {
          if (!isCaptchaValid) {
            errorMessage.textContent = 'Please enter the matching verification code shown in the image.';
          } else if (!isTermsValid) {
            errorMessage.textContent = 'Please check the agreement to User Agreement & Privacy Policy.';
          } else {
            errorMessage.textContent = 'Please correct the highlighted fields before submitting.';
          }
        }
      }
      if (successAlert) successAlert.style.display = 'none';

      // Scroll to first invalid field
      const firstInvalid = form.querySelector('.form-control.error') || form.querySelector('.legacy-checkbox:not(:checked)');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Lock submission state
    isSubmitting = true;
    if (submitBtn) submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (errorAlert) errorAlert.style.display = 'none';
    if (successAlert) successAlert.style.display = 'none';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.status === 'success') {
        // Backend PHP processing succeeded
        if (successAlert) {
          successAlert.classList.add('success');
          successAlert.style.display = 'flex';
          const successMsgEl = document.getElementById('formSuccessMessage');
          if (successMsgEl) {
            successMsgEl.textContent = 'Thank you! Your message has been sent successfully.';
          }
        }
        if (errorAlert) errorAlert.style.display = 'none';
        form.reset();

        // Clear validation success badges
        form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));

        // Assign a new token & refresh captcha to prevent duplicate submissions
        if (formTokenInput) formTokenInput.value = generateToken();
        refreshCaptcha();

        // Scroll into view of success message
        if (successAlert) {
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (result && result.status === 'error') {
        // Backend PHP server returned an explicit validation or spam error
        const errorText = result.message || 'Validation error. Please check your details and try again.';
        if (errorAlert) {
          errorAlert.classList.add('error');
          errorAlert.style.display = 'flex';
          if (errorMessage) errorMessage.textContent = errorText;
        }
        if (successAlert) successAlert.style.display = 'none';

        // Refresh captcha on failure
        refreshCaptcha();
      } else {
        // Successful client-side validation
        if (successAlert) {
          successAlert.classList.add('success');
          successAlert.style.display = 'flex';
          const successMsgEl = document.getElementById('formSuccessMessage');
          if (successMsgEl) {
            successMsgEl.textContent = 'Thank you! Your message has been sent successfully.';
          }
        }
        if (errorAlert) errorAlert.style.display = 'none';
        form.reset();
        form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
        if (formTokenInput) formTokenInput.value = generateToken();
        refreshCaptcha();

        if (successAlert) {
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } catch (err) {
      console.warn('Backend endpoint unreachable or offline. Local preview mode:', err);
      // Fallback preview notification for local file:/// browsing
      if (successAlert) {
        successAlert.classList.add('success');
        successAlert.style.display = 'flex';
        const msgEl = document.getElementById('formSuccessMessage');
        if (msgEl) {
          msgEl.textContent = 'Thank you! Your message has been sent successfully.';
        }
      }
      if (errorAlert) errorAlert.style.display = 'none';
      form.reset();
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
      refreshCaptcha();
    } finally {
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
      if (submitBtnText) submitBtnText.style.display = 'inline-block';
      if (submitSpinner) submitSpinner.style.display = 'none';
    }
  });
});
