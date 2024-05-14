import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  //устанавливает счетчик товаров в корзине
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  //выводит карточки товаров внутри каталога
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }
  
  //блокирует скролл (при открытии модальных окон)
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }

  clearCounter () {
    this.counter = 0;
  }
}