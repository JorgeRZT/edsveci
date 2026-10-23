import { createOptimizedPicture } from '../../scripts/aem.js';
import createSlider from '../../scripts/slider.js';

export default function decorate(block) {
  const list = document.createElement('ul');
  const text = document.createElement('div');
  text.className = 'gallery-text';

  [...block.children].forEach((row) => {
    const img = row.querySelector('picture img');
    if (img && !row.textContent.trim()) {
      const li = document.createElement('li');
      li.append(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 600px)', width: '1200' }, { width: '750' }]));
      list.append(li);
    } else {
      text.append(...(row.firstElementChild || row).childNodes);
    }
  });

  const media = document.createElement('div');
  media.className = 'gallery-media';
  media.append(list);
  block.replaceChildren(text, media);
  const heading = text.querySelector('h2, h3');
  createSlider(list, { label: heading ? heading.textContent.trim() : 'Galería' });
}
