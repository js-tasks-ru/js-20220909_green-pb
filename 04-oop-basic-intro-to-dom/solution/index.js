export default class ColumnChart {
    chartHeight = 50;

    constructor(params) {
        this.params = params;

        this.render();
        this.initEventListeners();
    }

    getTemplate() {
        const p = this.params;
        if (!p) {
            return `
            <div class="column-chart_loading">                
            </div>`;
        }
        const result = `
          <div class="wrapper">             
                <h1 class="column-chart__title">Total ${p.label} ${this.getLinkTemplate(p.link)}</h1>    
                <div class="column-chart__container">
                    <h2 class="column-chart__header">${(p.formatHeading) ? (p.formatHeading(p.value)) : (p.value)}</h2>
                    <div class="column-chart__chart">${this.getColumnsTemplate(p.data)}</div>             
                </div>
          </div>
        `;
        return result;
    }

    getColumnsTemplate(data) {
        if (!data || data.length == 0) return '';
        return this.getColumnProps(data)
            .map((item) => `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`)
            .join('');
    }

    getLinkTemplate(link) {
        if (!link) return '';
        return `<a src=${link} class="column-chart__link">View all</a>`;
    }

    render() {
        const element = document.createElement("div"); // (*)

        element.innerHTML = this.getTemplate();

        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;
    }

    update(newData) {
        this.params.data = newData;
        // TODO RERENDER?
    }

    initEventListeners() {
        // NOTE: в данном методе добавляем обработчики событий, если они есть
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
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
