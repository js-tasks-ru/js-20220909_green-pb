export default class NotificationMessage {
    static listOfDisplayingMessages = [];

    constructor(
        message = 'empty',
        {
            duration = 2000,
            type = 'success',
        } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
    }

    getTemplate() {        
        const result = `
        <div class="${this.type}">    
            <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
                <div class="timer"></div>
                    <div class="inner-wrapper">
                        <div class="notification-header">${this.type}</div>
                            <div class="notification-body">
                                ${this.message}
                            </div>
                    </div>
                </div>
            </div>             
        </div>
        `;
        return result;
    }

    render() {
        const element = document.createElement("div"); // (*)

        element.innerHTML = this.getTemplate();

        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;
    }

    show(targetElement = document.body) {
        while (NotificationMessage.listOfDisplayingMessages.length) {
            NotificationMessage.listOfDisplayingMessages.pop().remove();
        }        
        NotificationMessage.listOfDisplayingMessages.push(this);        
        targetElement.append(this.element);
        setTimeout(() => this.remove(), this.duration); // стрелочная функция для сохранения контекста
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }
}
