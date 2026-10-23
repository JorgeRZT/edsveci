import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = {
  pinterest: 'Pinterest',
  facebook: 'Facebook',
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

function decorateLinks(footer) {
  footer.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    a.parentElement?.classList.remove('button-container');
    const icon = a.querySelector('.icon');
    if (icon && !a.textContent.trim()) {
      const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.slice(5) || '';
      if (SOCIAL[name]) {
        a.setAttribute('aria-label', `Viajes El Corte Inglés en ${SOCIAL[name]}`);
        a.closest('ul')?.classList.add('footer-social');
      } else if (name.startsWith('veci-logo')) {
        a.setAttribute('aria-label', 'Viajes El Corte Inglés');
        a.classList.add('footer-logo');
      }
    }
  });
}

function decorateCountries(footer) {
  const heading = [...footer.querySelectorAll('h3')].find((h) => /internacional/i.test(h.textContent));
  const list = heading?.nextElementSibling;
  if (!list || list.tagName !== 'UL') return;
  const details = document.createElement('details');
  details.className = 'footer-countries';
  const summary = document.createElement('summary');
  summary.textContent = list.querySelector('li')?.textContent.trim() || 'España';
  summary.setAttribute('aria-label', `País: ${summary.textContent}`);
  list.before(details);
  details.append(summary, list);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['top', 'main', 'bottom'];
  [...footer.children].forEach((section, i) => {
    if (classes[i]) section.classList.add(`footer-${classes[i]}`);
  });

  decorateLinks(footer);
  decorateCountries(footer);
  block.append(footer);
}
