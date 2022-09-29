export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTemplate() {
    const result = `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeadersBody()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getColumnsBody()}
        </div>
      </div>
    `;
    return result;
  }

  getHeadersBody() {
    const result = this.headerConfig.map((columnHeader) => `  
      <div class="sortable-table__cell" data-id="title" data-sortable="${columnHeader.sortable}" ${this.getDataOrderAttributeTemplate(columnHeader.sortOrder)}>
        <span>${columnHeader.title}</span>
        ${columnHeader.sortable
        ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>'
        : ''}
      </div>
      `)
      .join('');
    return result;
  }

  getDataOrderAttributeTemplate(sortOrder) {
    if (!sortOrder) return '';
    return `data-order="${sortOrder}"`;
  }

  getColumnsBody() {
    return this.data.map((dataElement) => this.getRowBody(dataElement)).join('');
  }

  getRowBody(dataElement) {
    return `
    <a href="/products/${dataElement.id}" class="sortable-table__row">
      ${this.headerConfig.map((columnHeader) => this.getCellBody(dataElement, columnHeader)).join('')}
    </a>
    `;
  }

  getCellBody(dataElement, columnHeader) {
    if (columnHeader.template) {
      return columnHeader.template(dataElement);
    }
    else {
      return `<div class="sortable-table__cell">${dataElement[columnHeader.id]}</div>`;
    }
  }

  sort(fieldValue, orderValue = 'asc') {
    if (orderValue !== 'asc' && orderValue !== 'desc') throw ('orderValue incorrect value: ' + orderValue);
    let columnIndex = this.headerConfig.findIndex((columnHeader) => columnHeader.id === fieldValue);
    if (columnIndex == -1) return;

    const columnHeader = this.headerConfig[columnIndex];
    columnHeader.sortOrder = orderValue;

    this.data.sort((dataElementA, dataElementB) => {
      const a = dataElementA[fieldValue];
      const b = dataElementB[fieldValue];
      if (columnHeader.sortType === 'number') {
        return ((orderValue === 'desc') ? -1 : 1)  // reverse order if 'desc'
          * a - b;
      }
      else if (columnHeader.sortType === 'string') {
        return ((orderValue === 'desc') ? -1 : 1)  // reverse order if 'desc'
          * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
      }
      else throw ('unknown sortType in headerConfig');
    })



    this.element.innerHTML = this.getTemplate();
  }

  render() {
    this.element = document.createElement("div");
    this.element.setAttribute("data-element", "productsContainer");
    this.element.setAttribute("class", "products-list__container");
    this.element.innerHTML = this.getTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  get subElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }
}

