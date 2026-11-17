const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const imageElements = [...carousel.querySelectorAll('.hero-slide')];
  let photos = [];
  let current = 0;
  let activeElement = 0;
  let rotationTimer;
  let flickerTimer;

  function show(index) {
    const incoming = 1 - activeElement;
    const photo = photos[index];
    const image = imageElements[incoming];
    const preload = new Image();
    preload.onload = () => {
      image.src = photo.obrazok;
      image.alt = photo.popis || 'Fotografia z klubu huSKIes';
      image.setAttribute('aria-hidden', 'false');
      imageElements[activeElement].setAttribute('aria-hidden', 'true');
      image.classList.add('is-active');
      imageElements[activeElement].classList.remove('is-active');
      activeElement = incoming;
      current = index;
      rotationTimer = setTimeout(rotate, 4000);
    };
    preload.onerror = () => { rotationTimer = setTimeout(rotate, 4000); };
    preload.src = photo.obrazok;
  }

  function rotate() {
    if (!reducedMotion.matches && photos.length > 1) show((current + 1) % photos.length);
  }

  function flicker() {
    if (reducedMotion.matches) return;
    carousel.classList.add('signal-loss');
    setTimeout(() => carousel.classList.remove('signal-loss'), 85);
    flickerTimer = setTimeout(flicker, 9000 + Math.random() * 9000);
  }

  document.addEventListener('huskies:gallery', event => {
    photos = (event.detail || []).filter(item => typeof item.obrazok === 'string' && item.obrazok.startsWith('/images/'));
    clearTimeout(rotationTimer);
    clearTimeout(flickerTimer);
    if (!photos.length) return;
    current = 0;
    imageElements[activeElement].src = photos[0].obrazok;
    imageElements[activeElement].alt = photos[0].popis || 'Fotografia z klubu huSKIes';
    if (!reducedMotion.matches && photos.length > 1) rotationTimer = setTimeout(rotate, 4000);
    if (!reducedMotion.matches) flickerTimer = setTimeout(flicker, 7000 + Math.random() * 5000);
  });
}
