export default class ColumnChart {
    chartHeight = 50;

    constructor({
        data = [],
        label = '',
        value = NaN,
        link = null,
        formatHeading = data => `${data}`,
    } = {}) {
        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.formatHeading = formatHeading;

        this.render();
    }

    getTemplate() {
        if (!this.label && !this.value && !this.link && this.data.length === 0) {
            return `
            <div class="column-chart_loading">                
            </div>`;
        }
        const result = `
          <div class="wrapper">             
                <h1 class="column-chart__title">Total ${this.label} ${this.link ? `<a src=${this.link} class="column-chart__link">View all</a>` : ''}</h1>    
                <div class="column-chart__container">
                    <h2 class="column-chart__header">${(this.formatHeading) ? (this.formatHeading(this.value)) : (this.value)}</h2>
                    <div class="column-chart__chart">${this.getColumnsTemplate(this.data)}</div>             
                </div>
          </div>
        `;
        return result;
    }

    getColumnsTemplate(data) {
        return this.getColumnProps(data)
            .map((item) => `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`)
            .join('');
    }

    render() {
        const element = document.createElement("div"); // (*)

        element.innerHTML = this.getTemplate();

        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;
    }

    update(newData) {
        this.data = newData;
        this.element.querySelector('.column-chart__chart').innerHTML = this.getColumnsTemplate(newData);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    getColumnProps(data) { // copied from tests
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;

        return data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }
}
