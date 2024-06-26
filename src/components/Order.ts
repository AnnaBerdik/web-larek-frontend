import { Form } from './Form';
import { IOrder } from '../types';
import { IEvents } from './base/Events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrder> {
	protected _buttons: HTMLButtonElement[];

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selected = button.name;
			});
		});
	}

	//устанавливает адрес доставки
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	//устанавливает номер телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	//устанавливает электронную почту
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	//устанавливает способ оплаты
	set selected(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
		this.events.emit('payment:change', { name });
	}
}
