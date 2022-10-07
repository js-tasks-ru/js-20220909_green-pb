import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    subElements;
    url;

    chartHeight = 50;

    constructor({
        url = '',
        range = {
            from: new Date(),
            to: new Date(),
        },
        label = '',
        link = '',
        formatHeading = data => data,
    } = {}) {
        this.url = new URL(url, BACKEND_URL);
        this.range = range;
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;

        this.render();
        this.update(this.range.from, this.range.to);
    }

    getTemplate() {
        return `
                <div class="column-chart_loading" style="--chart-height: ${this.chartHeight}">           
                    <div class="column-chart__title">
                        Total ${this.label} 
                        ${this.link
                            ? `<a src=${this.link} class="column-chart__link">View all</a>`
                            : ''}
                    </div>    
                    <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header">                           
                        </div>
                        <div data-element="body" class="column-chart__chart">                            
                        </div>             
                    </div>
                </div>            
        `;
    }

    getColumnsTemplate(data) {
        return this.getColumnProps(data)
            .map((item) => `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`)
            .join('');
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    async update(from, to) {
        this.element.classList.add('column-chart_loading');

        await this.loadData(from, to);

        if (!this.data) return this.data;
        
        const values = Object.values(this.data);
        if (values.length === 0) return this.data;

        this.value = values.reduce( (sum, element) => sum += element, 0);
        this.subElements.header.innerHTML = this.formatHeading(this.value);
        this.subElements.body.innerHTML = this.getColumnsTemplate(values);        
        this.element.classList.remove('column-chart_loading');
        return this.data;
    }

    async loadData(from, to){
        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());
        this.data = await fetchJson(this.url);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    getColumnProps(data) { // copied from tests
        if (!data) return [];

        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;

        return data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
      }
}
