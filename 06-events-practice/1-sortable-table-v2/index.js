export default class SortableTable {
  constructor(headerConfig = [], {
    data = [],
    sorted = {}
  } = {}, isSortLocally = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();

    this.sort(sorted.id, sorted.order = 'asc');
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
      <div class="sortable-table__cell" data-id="title" 
        data-sortable="${columnHeader.sortable}" 
        ${columnHeader.sortOrder ? `data-order="${columnHeader.sortOrder}"` : ''}>
        <span>${columnHeader.title}</span>
        ${columnHeader.sortable
        ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>'
        : ''}
      </div>
      `)
      .join('');
    return result;
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
    return columnHeader.template
      ? columnHeader.template(dataElement)
      : `<div class="sortable-table__cell">${dataElement[columnHeader.id]}</div>`;

  }

  sort(fieldId, orderValue = 'asc') {
    if (!fieldId || !orderValue) return;
    if (this.isSortLocally) {
      this.sortOnClient(fieldId, orderValue);
    } else {
      this.sortOnServer(fieldId, orderValue);
    }
  }

  sortOnClient(fieldId, orderValue = 'asc') {
    if (orderValue !== 'asc' && orderValue !== 'desc') throw ('orderValue incorrect value: ' + orderValue);
    let columnIndex = this.headerConfig.findIndex((columnHeader) => columnHeader.id === fieldId);
    if (columnIndex === -1) return;

    const columnHeader = this.headerConfig[columnIndex];
    columnHeader.sortOrder = orderValue;

    this.data.sort((dataElementA, dataElementB) => {
      const a = dataElementA[fieldId];
      const b = dataElementB[fieldId];
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

  sortOnServer(fieldId, orderValue = 'asc') {
    throw ('Not implemented');
  }

  render() {
    this.element = document.createElement("div");
    this.element.setAttribute("data-element", "productsContainer");
    this.element.setAttribute("class", "products-list__container");
    this.element.innerHTML = this.getTemplate();
    
    this.element.querySelectorAll('[data-sortable]')
      .forEach((element) => {        
        if (element.dataset.sortable === "true") {
          
          element.onclick = function() {
            console.log('click');
          };
          console.log('attaching to', element,element.onclick);
          console.dir(element);
          
          // element.addEventListener('click', (event) => this.headerPointerdown(event));
        }
      })
  }

  headerPointerdown(event){
    console.log(event);
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

