const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const tear = document.createElement('img');
  tear.className = 'hero-tear';
  tear.alt = '';
  tear.setAttribute('aria-hidden', 'true');
  carousel.append(tear);
  tear.addEventListener('animationend', () => carousel.classList.remove('signal-slip'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let photos = [...document.querySelectorAll('.gallery img')].map(img => ({obrazok: img.getAttribute('src'), popis: img.alt}));
  let current = 0;
  let active = 0;
  let rotationTimer;

  const validPhotos = items => items.filter(item => item && typeof item.obrazok === 'string' && /^(?:\/images\/|images\/)/.test(item.obrazok));
  photos = validPhotos(photos);

  function scheduleRotation() {
    clearTimeout(rotationTimer);
    if (!reducedMotion.matches && photos.length > 1) rotationTimer = setTimeout(rotate, 5000);
  }

  function show(index, attempts = 0) {
    if (attempts >= photos.length) return;
    const photo = photos[index];
    const preload = new Image();
    preload.onload = () => {
      if (reducedMotion.matches) return;
      const next = 1 - active;
      slides[next].src = photo.obrazok;
      slides[next].alt = photo.popis || 'Fotografia z klubu huSKIes';
      slides[next].setAttribute('aria-hidden', 'false');
      slides[active].setAttribute('aria-hidden', 'true');
      slides[next].classList.add('is-active');
      slides[active].classList.remove('is-active');
      tear.src = photo.obrazok;
      carousel.classList.add('signal-slip');
      active = next;
      current = index;
      scheduleRotation();
    };
    preload.onerror = () => show((index + 1) % photos.length, attempts + 1);
    preload.src = photo.obrazok;
  }

  function rotate() {
    show((current + 1) % photos.length);
  }

  function resetPhotos(items) {
    const list = validPhotos(items);
    if (!list.length) return;
    photos = list;
    current = 0;
    slides[active].src = photos[0].obrazok;
    slides[active].alt = photos[0].popis || 'Fotografia z klubu huSKIes';
    scheduleRotation();
  }

  // Load the CMS data directly; the carousel continues with the HTML images if it is unavailable.
  fetch('content/site.json').then(response => {
    if (!response.ok) throw new Error('Gallery data unavailable');
    return response.json();
  }).then(content => resetPhotos(content.obrazky?.galeria || [])).catch(() => {});
  document.addEventListener('huskies:gallery', event => resetPhotos(event.detail || []));
  reducedMotion.addEventListener('change', () => {
    carousel.classList.remove('signal-slip');
    scheduleRotation();
  });
  scheduleRotation();
}
