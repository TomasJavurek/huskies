(async () => {
  const root = document.getElementById('editor');
  const status = document.getElementById('status');
  const download = document.getElementById('download');
  const read = async url => { const response = await fetch(url); if (!response.ok) throw new Error(`Nepodarilo sa načítať ${url}`); return response; };
  try {
    const [content, config, template] = await Promise.all([
      read('../content/site.json').then(r => r.json()),
      read('../admin/config.yml').then(r => r.json()),
      read('../index.html').then(r => r.text())
    ]);
    const fields = config.collections[0].files[0].fields;
    root.textContent = '';
    const fileToData = file => new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file);
    });
    const box = (parent, title) => { const d = document.createElement('details'); const sum = document.createElement('summary'); sum.textContent = title; d.append(sum); parent.append(d); return d; };
    fields.filter(field => field.name !== 'obrazky').forEach(group => {
      const section = box(root, group.label);
      group.fields.forEach(field => {
        const label = document.createElement('label'); label.textContent = field.label;
        const input = document.createElement(field.widget === 'text' ? 'textarea' : 'input');
        input.value = content[group.name][field.name] || ''; label.append(input); section.append(label);
        input.addEventListener('input', () => { content[group.name][field.name] = input.value; });
      });
    });
    const images = box(root, 'Obrázky a galéria');
    const pictureInput = (parent, labelText, get, set) => {
      const label = document.createElement('label'); label.textContent = labelText;
      const img = document.createElement('img'); img.src = get(); img.alt = 'Aktuálna fotografia';
      const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
      input.addEventListener('change', async () => { if (!input.files[0]) return; try { const value = await fileToData(input.files[0]); set(value); img.src = value; } catch { status.textContent = 'Obrázok sa nepodarilo načítať.'; } });
      parent.append(label, img, input);
    };
    [['logo','Logo'],['uvod','Úvodný obrázok'],['treneri','Fotografia pri tréneroch']].forEach(([key,label]) => pictureInput(images, label, () => content.obrazky[key], value => {content.obrazky[key] = value;}));
    const galleryRoot = document.createElement('div'); images.append(galleryRoot);
    const drawGallery = () => {
      galleryRoot.replaceChildren();
      content.obrazky.galeria.forEach((item, index) => {
        const row = document.createElement('div'); row.className = 'gallery-item'; galleryRoot.append(row);
        pictureInput(row, `Fotografia ${index + 1}`, () => item.obrazok, value => {item.obrazok = value;});
        const label = document.createElement('label'); label.textContent = 'Popis fotografie';
        const input = document.createElement('input'); input.value = item.popis || ''; input.addEventListener('input', () => {item.popis = input.value;}); label.append(input); row.append(label);
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'secondary'; remove.textContent = 'Odobrať fotografiu'; remove.addEventListener('click', () => {content.obrazky.galeria.splice(index, 1); drawGallery();}); row.append(remove);
      });
    };
    drawGallery();
    const add = document.createElement('button'); add.type = 'button'; add.textContent = 'Pridať fotografiu'; add.addEventListener('click', () => {content.obrazky.galeria.push({obrazok:'',popis:''}); drawGallery();}); images.append(add);
    download.disabled = false;
    download.addEventListener('click', async () => {
      download.disabled = true; status.textContent = 'Pripravujem návrh…';
      try {
        if (content.obrazky.galeria.some(item => !item.obrazok)) throw new Error('Vyberte fotografiu pre každú položku galérie alebo prázdnu položku odstráňte.');
        const doc = new DOMParser().parseFromString(template, 'text/html');
        doc.querySelectorAll('[data-edit-group][data-edit-key]').forEach(el => {const value = content[el.dataset.editGroup]?.[el.dataset.editKey]; if (typeof value === 'string') el.textContent = value;});
        const encode = async path => {
          if (path.startsWith('data:image/')) return path;
          const url = new URL(path.replace(/^\//, ''), new URL('../', location.href));
          return fileToData(await read(url.href).then(r => r.blob()));
        };
        const [logo, hero, coach, ...gallery] = await Promise.all([content.obrazky.logo,content.obrazky.uvod,content.obrazky.treneri,...content.obrazky.galeria.map(item => item.obrazok)].map(encode));
        doc.querySelector('.nav .logo img').src = logo; doc.querySelector('.hero-photo').style.backgroundImage = `url(${JSON.stringify(hero)})`; doc.querySelector('.club-photo').src = coach;
        const galleryEl = doc.querySelector('.gallery'); galleryEl.replaceChildren();
        gallery.forEach((src, i) => {const img = doc.createElement('img'); img.src = src; img.alt = content.obrazky.galeria[i].popis || ''; galleryEl.append(img);});
        const email = doc.querySelector('#kontakt a[href^="mailto:"]')?.textContent.trim();
        const phone = doc.querySelector('#kontakt a[href^="tel:"]')?.textContent.trim();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) doc.querySelectorAll('a[href^="mailto:"]').forEach(a => { const subject = a.getAttribute('href').split('?')[1]; a.setAttribute('href', `mailto:${email}${subject ? '?'+subject : ''}`); if (a.closest('footer')) a.textContent = email; });
        if (phone && /^[+0-9 ()-]+$/.test(phone)) doc.querySelectorAll('a[href^="tel:"]').forEach(a => {a.setAttribute('href', `tel:${phone.replace(/[ ()-]/g,'')}`); if (a.closest('footer')) a.textContent = phone;});
        doc.querySelector('script[src="site-content.js"]')?.remove();
        doc.querySelectorAll('a[href="admin/"],a[href="navrh/"]').forEach(a => a.remove());
        const blob = new Blob(['<!doctype html>\n',doc.documentElement.outerHTML], {type:'text/html;charset=utf-8'});
        const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='huskies-navrh.html'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
        status.textContent = 'Návrh je stiahnutý. Otvorte e-mail a priložte súbor huskies-navrh.html.';
      } catch (error) { status.textContent = `Návrh sa nepodarilo pripraviť: ${error.message}`; }
      finally { download.disabled = false; }
    });
  } catch (error) {root.textContent = `Editor sa nepodarilo načítať: ${error.message}`;}
})();
