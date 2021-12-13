const loader = `
<svg class="animate-spin h-32 w-32 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
`;

const createNode = () => {
  const div = document.createElement('div');
  div.setAttribute('data-name', 'mr-loading-image');
  div.className = 'mr-loader';
  const svgLoader = new DOMParser().parseFromString(loader, 'application/xml');
  div.appendChild(
    div.ownerDocument.importNode(svgLoader.documentElement, true),
  );
  return div;
};

export default {
  mounted(el: HTMLElement, binding: { value: boolean }): void {
    if (binding.value && el.parentElement) {
      el.parentElement.style.position = 'relative';
      const loaderNode = createNode();
      el.parentElement.appendChild(loaderNode);
    }
  },
  updated(el: HTMLElement, binding: { value: boolean }): void {
    const child = el.parentElement?.querySelector('[data-name=mr-loading-image]');
    if (binding.value && !child && el.parentElement) {
      el.style.position = 'relative';
      const loaderNode = createNode();
      el.parentElement.appendChild(loaderNode);
      return;
    }
    if (!binding.value && child && el.parentElement) {
      el.parentElement.style.position = '';
      el.parentElement.removeChild(child);
    }
  },
};
