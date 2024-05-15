import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLParagraphElement;

	constructor(
		protected container: HTMLElement,
		actions: ISuccessActions,
		total: number
	) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);

		this.setText(this._total, `${total} синапсов`);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
}
