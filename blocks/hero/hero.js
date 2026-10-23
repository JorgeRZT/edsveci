export default function decorate(block) {
  [...block.children].forEach((row) => {
    const isImage = row.querySelector('picture') && !row.textContent.trim();
    row.classList.add(isImage ? 'hero-image' : 'hero-content');
  });
}
