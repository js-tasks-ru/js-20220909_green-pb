class Tooltip {
  offset = [10, 10];

  static instance;

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;
  }

  initialize() {
    document.querySelectorAll('[data-tooltip]')
      .forEach((element) => {
        element.addEventListener('mousemove', (event) => this.move(event));
        element.addEventListener('pointerover', (event) => this.over(event));
        element.addEventListener('pointerout', (event) => this.out(event));
      })
  }

  move(event) {
    this.element.style.position = "absolute";
    this.element.style.left = event.clientX + this.offset[0] + 'px';
    this.element.style.top = event.clientY + this.offset[1] + 'px';
  }

  over(event) {
    if (event.tooltipIsShown) return; // если уже показали, иначе при всплытии отработает еще раз
    this.render(event.target.dataset.tooltip);
    event.tooltipIsShown = true; // сработаем только на таргете, при всплытии уже не будем работать
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
  }
}

export default Tooltip;
