import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function collapseAll(sections, except) {
  sections.querySelectorAll('.nav-drop-toggle[aria-expanded="true"]').forEach((btn) => {
    if (btn !== except) btn.setAttribute('aria-expanded', 'false');
  });
}

function toggleMenu(nav, force) {
  const expanded = force ?? nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflowY = expanded && !isDesktop.matches ? 'hidden' : '';
  if (!expanded) collapseAll(nav.querySelector('.nav-sections'));
}

function isActive(href) {
  try {
    const { pathname } = new URL(href, window.location.href);
    const path = pathname.replace(/\/$/, '');
    return path && (window.location.pathname === path || window.location.pathname.startsWith(`${path}/`));
  } catch (e) {
    return false;
  }
}

function decorateSections(sections) {
  const list = sections.querySelector('ul');
  if (!list) return;
  list.classList.add('nav-menu');
  [...list.children].forEach((li, i) => {
    const link = li.querySelector(':scope > p > a, :scope > a');
    const sub = li.querySelector(':scope > ul');
    if (link) {
      link.classList.remove('button', 'primary', 'secondary');
      const p = link.closest('p');
      if (p) p.replaceWith(link);
      link.classList.add('nav-link');
      if (isActive(link.href)) {
        li.classList.add('nav-active');
        link.setAttribute('aria-current', 'page');
      }
    }
    if (!sub) return;
    li.classList.add('nav-drop');
    sub.classList.add('nav-submenu');
    sub.id = `nav-submenu-${i}`;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-drop-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', sub.id);
    toggle.setAttribute('aria-label', `Submenú ${link ? link.textContent.trim() : ''}`.trim());
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      collapseAll(sections, toggle);
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    sub.before(toggle);
    // desktop: close an open submenu when the pointer leaves it
    li.addEventListener('mouseleave', () => {
      if (isDesktop.matches) toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Principal');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const brand = nav.querySelector('.nav-brand');
  const brandLink = brand?.querySelector('a');
  if (brandLink) {
    brandLink.classList.remove('button', 'primary', 'secondary');
    brandLink.closest('.button-container')?.classList.remove('button-container');
    brandLink.setAttribute('aria-label', 'Viajes El Corte Inglés');
  }

  const sections = nav.querySelector('.nav-sections');
  if (sections) decorateSections(sections);

  const tools = nav.querySelector('.nav-tools');
  tools?.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    a.closest('.button-container')?.classList.remove('button-container');
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Abrir menú">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = sections?.querySelector('.nav-drop-toggle[aria-expanded="true"]');
    if (open) {
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, false);
      hamburger.querySelector('button').focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && sections && !sections.contains(e.target)) collapseAll(sections);
  });
  isDesktop.addEventListener('change', () => toggleMenu(nav, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
