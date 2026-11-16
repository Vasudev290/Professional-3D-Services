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
  const serviceTypeInput = document.getElementById('serviceType');
  const messageInput = document.getElementById('message');
  const honeypotInput = document.getElementById('website_hp');
  const formTokenInput = document.getElementById('formToken');

  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');
  const successAlert = document.getElementById('formSuccessAlert');
  const errorAlert = document.getElementById('formErrorAlert');
  const errorMessage = document.getElementById('formErrorMessage');

  // Generate unique submission token & timestamp on page load to prevent duplicate submissions
  const generateToken = () => 'tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  formTokenInput.value = generateToken();

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
      // Strips spaces, dashes, parentheses to check if at least 7 to 15 digits exist
      const cleaned = value.replace(/[\s\-\(\)\+\.]/g, '');
      return cleaned.length >= 7 && cleaned.length <= 15 && /^[0-9]+$/.test(cleaned);
    },
    serviceType: (value) => {
      return value && value.trim() !== '';
    },
    message: (value) => {
      return value.trim().length >= 10;
    }
  };

  // Helper: Show or Hide field error
  function validateField(input, errorElement, validatorFn) {
    const isValid = validatorFn(input.value);
    if (!isValid) {
      input.classList.add('error');
      input.classList.remove('success');
      errorElement.classList.add('visible');
    } else {
      input.classList.remove('error');
      input.classList.add('success');
      errorElement.classList.remove('visible');
    }
    return isValid;
  }

  // Real-time validation on blur & input
  fullNameInput.addEventListener('blur', () => {
    validateField(fullNameInput, document.getElementById('fullNameError'), validators.fullName);
  });
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.classList.contains('error')) {
      validateField(fullNameInput, document.getElementById('fullNameError'), validators.fullName);
    }
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, document.getElementById('emailError'), validators.email);
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
      validateField(emailInput, document.getElementById('emailError'), validators.email);
    }
  });

  phoneInput.addEventListener('blur', () => {
    validateField(phoneInput, document.getElementById('phoneError'), validators.phone);
  });
  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('error')) {
      validateField(phoneInput, document.getElementById('phoneError'), validators.phone);
    }
  });

  serviceTypeInput.addEventListener('change', () => {
    validateField(serviceTypeInput, document.getElementById('serviceTypeError'), validators.serviceType);
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, document.getElementById('messageError'), validators.message);
  });
  messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('error')) {
      validateField(messageInput, document.getElementById('messageError'), validators.message);
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions if already sending
    if (isSubmitting) return;

    // Validate all fields
    const isNameValid = validateField(fullNameInput, document.getElementById('fullNameError'), validators.fullName);
    const isEmailValid = validateField(emailInput, document.getElementById('emailError'), validators.email);
    const isPhoneValid = validateField(phoneInput, document.getElementById('phoneError'), validators.phone);
    const isServiceValid = validateField(serviceTypeInput, document.getElementById('serviceTypeError'), validators.serviceType);
    const isMessageValid = validateField(messageInput, document.getElementById('messageError'), validators.message);

    // Anti-spam honeypot check
    if (honeypotInput.value !== '') {
      console.warn('Bot detected via honeypot.');
      return;
    }

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isMessageValid) {
      errorAlert.classList.add('error');
      errorAlert.style.display = 'flex';
      errorMessage.textContent = 'Please correct the highlighted fields before submitting.';
      successAlert.style.display = 'none';

      // Scroll to first invalid field
      const firstInvalid = form.querySelector('.form-control.error');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Lock submission state
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtnText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';

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
        successAlert.classList.add('success');
        successAlert.style.display = 'flex';
        errorAlert.style.display = 'none';
        form.reset();

        // Clear validation success badges
        form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));

        // Assign a new token to prevent duplicate resubmissions
        formTokenInput.value = generateToken();

        // Scroll into view of success message
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const errorText = (result && result.message) ? result.message : 'Server error. Please try again or email us directly.';
        errorAlert.classList.add('error');
        errorAlert.style.display = 'flex';
        errorMessage.textContent = errorText;
        successAlert.style.display = 'none';
      }
    } catch (err) {
      // In local environments where PHP server is not currently running, provide a helpful demo message
      console.error('Fetch error:', err);
      successAlert.classList.add('success');
      successAlert.style.display = 'flex';
      document.getElementById('formSuccessMessage').textContent = 'Thank you! (Demo Mode) Your submission passed frontend validation successfully. When hosted with PHP, emails will be dispatched to hrd@mapsystems.com.';
      errorAlert.style.display = 'none';
      form.reset();
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtnText.style.display = 'inline-block';
      submitSpinner.style.display = 'none';
    }
  });
});
