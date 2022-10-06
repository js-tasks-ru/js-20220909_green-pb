import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  constructor(headerConfig = [],
    {
      url = '',
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: 'asc'
      },
      isSortLocally = false,
      step = 20,
      start = 1,
      end = start + step,
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.abortController = new AbortController();
    
    window.addEventListener('scroll', this.onWindowScroll, this.abortController);

    this.render();
    this.loadData().then(() => this.render());
  }

  onWindowScroll(event){
    console.log(event);
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
      <div class="sortable-table__cell" data-id="${columnHeader.id}" 
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
    if (!this.data) return '';
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

    if (orderValue !== 'asc' && orderValue !== 'desc') throw ('orderValue incorrect value: ' + orderValue);
    let columnIndex = this.headerConfig.findIndex((columnHeader) => columnHeader.id === fieldId);
    if (columnIndex === -1) return;

    const columnHeader = this.headerConfig[columnIndex];
    columnHeader.sortOrder = orderValue;

    if (this.isSortLocally) {
      this.sortOnClient(fieldId, orderValue);
    } else {
      this.sortOnServer(fieldId, orderValue);
    }
  }

  sortOnClient(fieldId, orderValue = 'asc') {   

    this.data.sort((dataElementA, dataElementB) => {
      const a = dataElementA[fieldId];
      const b = dataElementB[fieldId];
      if (columnHeader.sortType === 'number') {
        return ((orderValue === 'desc') ? -1 : 1)  // reverse order if 'desc'
          * b - a;
      }
      else if (columnHeader.sortType === 'string') {
        return ((orderValue === 'desc') ? -1 : 1)  // reverse order if 'desc'
          * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
      }
      else throw ('unknown sortType in headerConfig');
    })

    this.render();
  }

  sortOnServer(fieldId, orderValue = 'asc') {
    console.log('sortOnServer',fieldId, orderValue)
    this.sorted = {
      id: fieldId,
      order: orderValue,
    },
    this.loadData().then(() => this.render());
  }

  render() {
    console.log('render',this.data);
    
    if (!this.element) {
      this.element = document.createElement("div");
      this.element.setAttribute("data-element", "productsContainer");
      this.element.setAttribute("class", "products-list__container");
    }
// console.log(this.getTemplate())
    this.element.innerHTML = this.getTemplate();
    this.attachEventListeners();
  }

  async loadData() {
    console.log('loadData');
    this.url.searchParams.set('_start', this.start);
    this.url.searchParams.set('_end', this.end);
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order',  this.sorted.order);
    this.data = await fetchJson(this.url);
  }

  attachEventListeners() {
    this.element.querySelectorAll('[data-element="header"]')
      .forEach((element) => {
        element.addEventListener('pointerdown', (event) => this.headerPointerdown(event));
      })
  }

  headerPointerdown(event) {
    const element = event.target.closest('[data-sortable="true"]');
    if (!element) return;
    const fieldId = element.dataset.id;

    for (let columnHeader of this.headerConfig) {
      if (columnHeader.id === fieldId) {
        let orderValue;
        if (!columnHeader.sortOrder) orderValue = 'asc';
        else if (columnHeader.sortOrder === 'asc') orderValue = 'desc';
        else if (columnHeader.sortOrder === 'desc') orderValue = 'asc';
        this.sort(fieldId, orderValue);
      }
      else {
        columnHeader.sortOrder = null;
      }
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    abortController.abort();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
}

