import { Component } from './base/Component';
import { EventEmitter } from './base/Events';
import { ensureElement, createElement } from '../utils/utils';
import { IProduct } from '../types';

interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLUListElement;
	protected _total: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this._list = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this.setDisabled(this._button, true);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			items.forEach((item, index) => {
				const numbering = item.querySelector('.basket__item-index');
				numbering.textContent = `${index + 1}`;
			});
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// блокирует кнопку оформления заказа, в зависимости от наличия товаров в корзине
	set selected(items: IProduct[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	//итоговая стоимость товаров
	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}

	toggleButton(isDisabled: boolean) {
		this._button.disabled = isDisabled;
	}
}
