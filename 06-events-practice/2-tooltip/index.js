class Tooltip {
  static instance;

  controller = new AbortController();  
  offset = [10, 10];

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', (event) => this.onover(event), this.controller.signal);
  }

  onover(event) {
    const targetElement = event.target.closest('[data-tooltip]');
    if (!targetElement) return;
    document.addEventListener('pointermove', (event) => this.onmove(event), this.controller.signal);
    document.addEventListener('pointerout', (event) => this.onout(event), this.controller.signal);
    this.render(targetElement.dataset.tooltip);
  }

  onmove(event) {
    this.element.style.position = "absolute";
    this.element.style.left = event.clientX + this.offset[0] + 'px';
    this.element.style.top = event.clientY + this.offset[1] + 'px';
  }

  onout(event) {
    this.remove();
  }

  render(text) {
    this.element = document.createElement("div");
    this.element.setAttribute("class", "tooltip");
    this.element.textContent = text;
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.controller.abort();
  }
}

export default Tooltip;
