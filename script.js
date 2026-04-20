const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  });
}

const accordionContainers = document.querySelectorAll('[data-accordion]');
accordionContainers.forEach((container) => {
  const triggers = container.querySelectorAll('.accordion-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.parentElement.nextElementSibling;

      triggers.forEach((otherTrigger) => {
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherTrigger.querySelector('span').textContent = '+';
        otherTrigger.parentElement.nextElementSibling.hidden = true;
      });

      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.querySelector('span').textContent = '–';
        panel.hidden = false;
      }
    });
  });
});

const filterToolbar = document.querySelector('[data-filter-toolbar]');
const serviceGrid = document.querySelector('[data-service-grid]');

if (filterToolbar && serviceGrid) {
  const chips = filterToolbar.querySelectorAll('.chip');
  const cards = serviceGrid.querySelectorAll('.service-card');
  const status = filterToolbar.querySelector('.filter-status');

  const updateServices = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const isVisible = filter === 'all' || categories.includes(filter);
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    status.textContent = filter === 'all'
      ? 'Showing all services.'
      : `Showing ${visibleCount} ${filter} service${visibleCount === 1 ? '' : 's'}.`;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });

      chip.classList.add('is-selected');
      chip.setAttribute('aria-pressed', 'true');
      updateServices(chip.dataset.filter);
    });
  });
}

const form = document.getElementById('enquiryForm');
const modal = document.getElementById('successModal');

if (form) {
  const fields = {
    fullName: {
      input: form.querySelector('#fullName'),
      validate: (value) => value.trim().length >= 3,
      message: 'Please enter your full name.'
    },
    email: {
      input: form.querySelector('#email'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address.'
    },
    phone: {
      input: form.querySelector('#phone'),
      validate: (value) => /^[0-9+()\-\s]{8,}$/.test(value.trim()),
      message: 'Please enter a valid phone number.'
    },
    service: {
      input: form.querySelector('#service'),
      validate: (value) => value !== '',
      message: 'Please select a service area.'
    },
    message: {
      input: form.querySelector('#message'),
      validate: (value) => value.trim().length >= 15,
      message: 'Please provide a short message of at least 15 characters.'
    }
  };

  const consent = form.querySelector('#consent');

  const showError = (input, message) => {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.add('has-error');
    const messageBox = field.querySelector('.error-message');
    if (messageBox) messageBox.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = (input) => {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.remove('has-error');
    const messageBox = field.querySelector('.error-message');
    if (messageBox) messageBox.textContent = '';
    input.removeAttribute('aria-invalid');
  };

  const validateField = ({ input, validate, message }) => {
    if (!validate(input.value)) {
      showError(input, message);
      return false;
    }
    clearError(input);
    return true;
  };

  Object.values(fields).forEach(({ input, validate, message }) => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        validateField({ input, validate, message });
      } else {
        clearError(input);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validity = Object.values(fields).map(validateField);
    const consentField = consent.closest('.form-field');

    if (!consent.checked) {
      consentField.classList.add('has-error');
    } else {
      consentField.classList.remove('has-error');
    }

    const firstInvalid = form.querySelector('[aria-invalid="true"], .form-field.has-error input, .form-field.has-error select, .form-field.has-error textarea');

    if (validity.includes(false) || !consent.checked) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    form.reset();
    openModal();
  });
}

const openModal = () => {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  const closeButton = modal.querySelector('.modal-close');
  if (closeButton) closeButton.focus();
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
};

if (modal) {
  modal.querySelectorAll('[data-modal-close]').forEach((trigger) => {
    trigger.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
