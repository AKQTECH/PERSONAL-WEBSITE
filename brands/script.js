const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const pressPlay = document.querySelector('.press-play');
let pressPlayTimer = 0;

if (pressPlay) {
  pressPlay.addEventListener('click', (event) => {
    const href = pressPlay.getAttribute('href');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!href || reducedMotion) return;

    event.preventDefault();
    window.clearTimeout(pressPlayTimer);
    pressPlay.classList.remove('is-launching');
    void pressPlay.offsetWidth;
    pressPlay.classList.add('is-launching');

    pressPlayTimer = window.setTimeout(() => {
      pressPlay.classList.remove('is-launching');
      window.location.href = href;
    }, 520);
  });
}

const jumpToPageTarget = (target) => {
  const targetElement = document.querySelector(target);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!targetElement) {
    window.location.href = target;
    return;
  }

  targetElement.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  if (window.history && window.history.pushState) window.history.pushState(null, '', target);
};

const nextStepCards = document.querySelectorAll('.one-steps li');

if (nextStepCards.length) {
  const nextStepList = nextStepCards[0].closest('.one-steps');

  const clearActiveStep = () => {
    nextStepList.classList.remove('has-active');
    nextStepCards.forEach((card) => {
      card.classList.remove('is-active');
      card.setAttribute('aria-expanded', 'false');
    });
  };

  nextStepCards.forEach((card) => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('is-active');
      const jumpTarget = card.dataset.jumpTarget;
      clearActiveStep();

      if (!wasActive) {
        nextStepList.classList.add('has-active');
        card.classList.add('is-active');
        card.setAttribute('aria-expanded', 'true');
      }

      if (jumpTarget) window.setTimeout(() => jumpToPageTarget(jumpTarget), 140);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }

      if (event.key === 'Escape') {
        clearActiveStep();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.one-steps')) clearActiveStep();
  });
}

const fadeButton = document.querySelector('.fade-paper');
let fadeTimer = 0;

if (fadeButton) {
  fadeButton.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fadeButton.setAttribute('aria-pressed', 'true');

    if (reducedMotion) {
      fadeButton.setAttribute('aria-pressed', 'false');
      return;
    }

    window.clearTimeout(fadeTimer);
    document.body.classList.remove('tv-shutdown');
    void document.body.offsetWidth;
    document.body.classList.add('tv-shutdown');

    fadeTimer = window.setTimeout(() => {
      document.body.classList.remove('tv-shutdown');
      fadeButton.setAttribute('aria-pressed', 'false');
      fadeButton.focus({ preventScroll: true });
    }, 1450);
  });
}
