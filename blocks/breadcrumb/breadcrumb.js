export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Migas de pan');
  const ol = document.createElement('ol');
  block.querySelectorAll('li').forEach((item) => {
    const li = document.createElement('li');
    li.append(...item.childNodes);
    ol.append(li);
  });
  const last = ol.lastElementChild;
  if (last && !last.querySelector('a')) {
    const span = document.createElement('span');
    span.setAttribute('aria-current', 'page');
    span.append(...last.childNodes);
    last.append(span);
  }
  nav.append(ol);
  block.replaceChildren(nav);
}
