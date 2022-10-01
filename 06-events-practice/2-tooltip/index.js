class Tooltip {
  static instance;

  controller = new AbortController();  
  offset = [10, 10];

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', (event) => this.over(event), this.controller.signal);
  }

  over(event) {
    let targetElement = event.target;
    while (targetElement) { // на случай вложенных тегов ищем родителя с dataset.tooltip
      if (targetElement.dataset.tooltip) break;
      targetElement = targetElement.parentElement;
    }
    if (!targetElement) return;
    document.addEventListener('pointermove', (event) => this.move(event), this.controller.signal);
    document.addEventListener('pointerout', (event) => this.out(event), this.controller.signal);
    this.render(targetElement.dataset.tooltip);
  }

  move(event) {
    this.element.style.position = "absolute";
    this.element.style.left = event.clientX + this.offset[0] + 'px';
    this.element.style.top = event.clientY + this.offset[1] + 'px';
  }

  out(event) {
    this.remove();
  }

  render(text) {
    this.element = document.createElement("div"); // (*)
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
