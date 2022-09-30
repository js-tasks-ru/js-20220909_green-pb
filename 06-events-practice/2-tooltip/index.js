class Tooltip {
  offset = [10, 10];

  static instance;

  constructor(){
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;
  }

  initialize() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltips.forEach((element) => {
      element.addEventListener('mousemove', (event) => this.move(event));
      element.addEventListener('pointerover', (event) => this.over(event));
      element.addEventListener('pointerout', (event) => this.out(event));
    })

    // console.log('init', elementsWithTooltips);
  }

  move(event) {
    // console.log('move', event);

    this.element.style.position = "absolute";
    this.element.style.left = event.clientX + this.offset[0] + 'px';
    this.element.style.top = event.clientY + this.offset[1] + 'px';

  }
  over(event) {
    // console.log('over', event.target.dataset.tooltip);

    if (event.tooltipIsShown) return; // если уже показали, иначе при всплытии отработает еще раз
    this.render(event.target.dataset.tooltip);
    event.tooltipIsShown = true; // сработаем только на таргете, при всплытии уже не будем работать
  }
  out(event) {
    // console.log('out', event.target.dataset.tooltip);

    this.remove();
  }


  render(text) {
    // console.log('render', text);

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
