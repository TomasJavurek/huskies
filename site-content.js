// Keep the original HTML as a fallback if content cannot be loaded.
fetch('content/site.json').then(response => {
  if (!response.ok) throw new Error('Content unavailable');
  return response.json();
}).then(content => {
  document.querySelectorAll('[data-edit-group][data-edit-key]').forEach(element => {
    const value = content[element.dataset.editGroup]?.[element.dataset.editKey];
    if (typeof value === 'string') element.textContent = value;
  });
  // Keep clickable contact destinations aligned with the displayed contact details.
  const emailLink = document.querySelector('#kontakt a[href^="mailto:"]');
  const phoneLink = document.querySelector('#kontakt a[href^="tel:"]');
  const email = emailLink?.textContent.trim();
  const phone = phoneLink?.textContent.trim();
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      const subject = link.getAttribute('href').split('?')[1];
      link.href = `mailto:${email}${subject ? '?' + subject : ''}`;
      if (link !== emailLink && link.textContent.includes('@')) link.textContent = email;
    });
  }
  if (phone && /^[+0-9 ()-]+$/.test(phone)) {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.href = `tel:${phone.replace(/[ ()-]/g, '')}`;
      if (link !== phoneLink) link.textContent = phone;
    });
  }
  const pictures = content.obrazky;
  if (!pictures) return;
  const imagePath = value => typeof value === 'string' && /^(?:\/images\/|\/logo-huskies\.png$|\/hero-huskies\.jpg$)/.test(value) ? value : null;
  const logo = imagePath(pictures.logo), hero = imagePath(pictures.uvod), coach = imagePath(pictures.treneri);
  if (logo) document.querySelector('.nav .logo img').src = logo;
  if (hero) document.querySelector('.hero-photo').style.backgroundImage = `url(${JSON.stringify(hero)})`;
  if (coach) document.querySelector('.club-photo').src = coach;
  if (Array.isArray(pictures.galeria)) {
    const gallery = document.querySelector('.gallery');
    const images = pictures.galeria.flatMap(item => {
      const src = imagePath(item.obrazok);
      if (!src) return [];
      const img = document.createElement('img');
      img.src = src; img.alt = item.popis || ''; img.loading = 'lazy';
      return [img];
    });
    gallery.replaceChildren(...images);
  }
}).catch(error => console.warn('Nepodarilo sa načítať obsah stránky:', error));
