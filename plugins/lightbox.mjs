// MyST plugin + anywidget that turns figures and images on a page into a
// clickable lightbox gallery via GLightbox (loaded from a CDN at runtime).

let pathMod;
try { pathMod = await import('node:path'); } catch {}
const PLUGIN_PATH = new URL(import.meta.url).pathname;

const GLIGHTBOX_VERSION = '3.3.0';
const GLIGHTBOX_CSS = `https://cdn.jsdelivr.net/npm/glightbox@${GLIGHTBOX_VERSION}/dist/css/glightbox.min.css`;
const GLIGHTBOX_ESM = `https://cdn.jsdelivr.net/npm/glightbox@${GLIGHTBOX_VERSION}/+esm`;
const LINK_CLASS = 'myst-lightbox-link';

async function render({ el }) {
  el.style.display = 'none';

  if (!document.querySelector(`link[href="${GLIGHTBOX_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GLIGHTBOX_CSS;
    document.head.appendChild(link);
  }

  // Scope to the article body so theme chrome (logos, icons) is excluded.
  const content = document.querySelector('article.article, main') || document.body;
  content.querySelectorAll('img').forEach((img) => {
    if (img.closest('a[href]')) return;
    const caption = img.closest('figure')?.querySelector('figcaption')?.innerHTML?.trim() || '';
    const anchor = document.createElement('a');
    anchor.href = img.src;
    anchor.className = LINK_CLASS;
    anchor.style.cursor = 'zoom-in';
    if (img.alt) anchor.dataset.title = img.alt;
    if (caption) anchor.dataset.description = caption;
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  });

  const { default: GLightbox } = await import(GLIGHTBOX_ESM);
  GLightbox({ selector: `.${LINK_CLASS}`, loop: true, zoomable: true });
}

const injectWidgetTransform = {
  name: 'lightbox-inject-widget',
  doc: 'Injects a hidden anywidget that turns figures and images into a lightbox gallery.',
  stage: 'document',
  plugin: (_, utils) => (tree, file) => {
    const hasImages =
      utils.selectAll('image', tree).length > 0 ||
      utils.selectAll('container[kind="figure"]', tree).length > 0;
    if (!hasImages) return;
    // Wrap in a `block` because thebe execution seems to assume that everything
    // is a block-level item
    tree.children.push({
      type: 'block',
      children: [
        {
          type: 'anywidget',
          esm: pathMod.relative(pathMod.dirname(file.path), PLUGIN_PATH),
          model: {},
          id: crypto.randomUUID(),
        },
      ],
    });
  },
};

export default {
  name: 'Lightbox',
  transforms: [injectWidgetTransform],
  render,
};