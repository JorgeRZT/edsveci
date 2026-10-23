import { createOptimizedPicture } from '../../scripts/aem.js';
import createSlider from '../../scripts/slider.js';

const LINK_CARD_VARIANTS = ['overlay', 'portrait', 'destination', 'cruise'];

function unbutton(a) {
  a.classList.remove('button', 'primary', 'secondary');
  a.parentElement?.classList.remove('button-container');
}

function decorateBody(body, block) {
  [...body.children].forEach((el) => {
    const text = el.textContent.trim();
    if (el.tagName === 'P' && el.querySelector('picture') && !text) {
      el.className = 'cards-card-logo';
    } else if (el.tagName === 'P' && el.children.length === 1 && el.firstElementChild.tagName === 'EM'
      && text === el.firstElementChild.textContent.trim()) {
      el.className = 'cards-card-tag';
    } else if (el.tagName === 'P' && /^desde\b/i.test(text) && el.querySelector('strong')) {
      el.className = 'cards-card-price';
      const label = el.firstChild;
      if (label?.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.className = 'cards-card-price-label';
        span.textContent = label.textContent.trim();
        label.replaceWith(span);
      }
    } else if (el.tagName === 'UL') {
      el.classList.add('cards-card-list');
    }
  });

  // price (and CTA) share a footer row
  if (block.classList.contains('product') || block.classList.contains('cruise')) {
    const price = body.querySelector('.cards-card-price');
    const cta = body.querySelector('.button-container');
    if (price || cta) {
      const footer = document.createElement('div');
      footer.className = 'cards-card-footer';
      const prev = price?.previousElementSibling;
      if (prev && prev.tagName === 'P' && !prev.className) {
        prev.classList.add('cards-card-meta');
        footer.append(prev);
      }
      if (price) footer.append(price);
      if (cta) footer.append(cta);
      body.append(footer);
    }
  }
}

export default function decorate(block) {
  const isLinkCard = LINK_CARD_VARIANTS.some((v) => block.classList.contains(v));

  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.className = 'cards-list';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else if (div.querySelector('.icon') && !div.textContent.trim()) div.className = 'cards-card-icon';
      else {
        div.className = 'cards-card-body';
        decorateBody(div, block);
      }
    });

    if (isLinkCard) {
      const links = [...li.querySelectorAll('.cards-card-body a')];
      links.forEach(unbutton);
      // stretch the primary link over the whole card
      const primary = links[links.length - 1];
      if (primary) {
        primary.classList.add('cards-card-link');
        li.classList.add('cards-card-linked');
      }
    }
    ul.append(li);
  });

  // replace images with optimized versions
  ul.querySelectorAll('picture > img').forEach((img) => {
    const width = img.closest('.cards-card-logo') ? '200' : '750';
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });

  block.replaceChildren(ul);

  if (block.classList.contains('slider')) {
    const heading = block.closest('.section')?.querySelector('h2');
    createSlider(ul, { label: heading ? heading.textContent.trim() : 'Carrusel' });
  }
}
