document.addEventListener('DOMContentLoaded', () => {
  // Custom cursor + global illumination
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorIllum = document.querySelector('.cursor-illum');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;
  let illX = mouseX;
  let illY = mouseY;

  let dotScale = 1;
  let ringScale = 1;

  // Update raw mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Smooth cursor + illumination animation loop
  const animateCursor = () => {
    // interpolation factors
    const dotSpeed = 0.45;
    const ringSpeed = 0.18;
    const illSpeed = 0.14;

    dotX += (mouseX - dotX) * dotSpeed;
    dotY += (mouseY - dotY) * dotSpeed;

    ringX += (mouseX - ringX) * ringSpeed;
    ringY += (mouseY - ringY) * ringSpeed;

    illX += (mouseX - illX) * illSpeed;
    illY += (mouseY - illY) * illSpeed;

    // apply transforms with scale
    cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px) scale(${dotScale})`;
    cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${ringScale})`;

    // update illumination CSS variables (pixel values)
    if (cursorIllum) {
      cursorIllum.style.setProperty('--cursor-x', `${Math.round(illX)}px`);
      cursorIllum.style.setProperty('--cursor-y', `${Math.round(illY)}px`);
    }

    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // interactive elements cause a boost in both cursor and illumination
  const interactiveElements = document.querySelectorAll('a, button, [role="button"], .card, .service-icon');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dotScale = 1.6;
      ringScale = 1.45;
      if (cursorIllum) cursorIllum.classList.add('boost');
      cursorRing.style.borderColor = 'rgba(0,224,184,0.72)';
      cursorRing.style.boxShadow = '0 0 28px rgba(0,224,184,0.45)';
    });

    el.addEventListener('mouseleave', () => {
      dotScale = 1;
      ringScale = 1;
      if (cursorIllum) cursorIllum.classList.remove('boost');
      cursorRing.style.borderColor = 'rgba(0,224,184,0.4)';
      cursorRing.style.boxShadow = '0 0 15px rgba(0,224,184,0.2)';
    });
  });

  // hide cursor when leaving the window for aesthetics
  document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
    if (cursorIllum) cursorIllum.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
    if (cursorIllum) cursorIllum.style.opacity = '1';
  });

  // Keep card local mouse highlight (unchanged) but ensure it still works
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Add intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    observer.observe(card);
  });
});