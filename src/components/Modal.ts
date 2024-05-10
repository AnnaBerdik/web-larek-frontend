import { Component } from './base/Component';
import { ensureElement } from './../utils/utils';
import { IEvents } from './base/events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLDivElement;
    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
    
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLDivElement>('.modal__content', container);
    
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
      }

    //контент в модальном окне
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
      }

    //открытие модального окна
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    //событие открытия заказа
    order() {
        this.events.emit('order:open');
    }

    //событие открытия контактов
    orderContacts() {
        this.events.emit('orderContacts:open');
    }

    //закрытие модального окна
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    //вернуть корневой DOM-элемент
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}