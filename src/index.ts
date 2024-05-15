import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ShopAPI } from './components/ShopAPI';
import { EventEmitter } from './components/base/Events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { FieldsInput,
		 IContactsForm,
		 IProduct,
		 IOrderForm,
		 PaymentMethods} from './types';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { Success } from './components/Success';
import { Order } from './components/Order';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const orderContacts = new Order(cloneTemplate(contactsTemplate), events);

// Получем продукты с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

//Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть товары в корзине
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on('basket:clear', () => {
	appData.clearBasket();
	appData.clearOrder();
	page.clearCounter();
});

//Отправлена форма заказа
events.on('order:submit', () => {
	events.emit('orderContacts:open');
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				},
				result.total
			);
			events.emit('basket:clear');

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on(
	'formErrors:change',
	(errors: Partial<IOrderForm & IContactsForm>) => {
		const { email, phone, address, payment } = errors;
		orderContacts.valid = !email && !phone;
		orderContacts.errors = Object.values({ phone, email })
			.filter((i) => !!i)
			.join('; ');
		order.valid = !address && !payment;
		order.errors = Object.values({ address, payment })
			.filter((i) => !!i)
			.join('; ');
	}
);

//способ оплаты
events.on('payment:change', (value: { name: PaymentMethods }) => {
	const { name } = value;
	appData.setOrderField('payment', name);
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof FieldsInput; value: string }) => {
		if (data.field === 'address') {
			appData.setOrderField(data.field, data.value);
		} else {
			appData.setContactsField(data.field, data.value);
		}
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// открыть форму с контактами
events.on('orderContacts:open', () => {
	modal.render({
		content: orderContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть продукт
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const existingElement = appData.basket.find(
			(product) => item.id === product.id
		);
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (existingElement) {
					events.emit('basket:open');
				} else {
					appData.addToBasket(item);
					const totalPrice = appData.getTotal();
					const eventData = { totalPrice: totalPrice, unit: 'синапсов' };
					events.emit('basket:totalChanged', eventData);
					page.counter = appData.basket.length;
					modal.close();
				}
			},
		});
		card.inBasket = !!existingElement;
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				description: item.description,
				price: item.price,
			}),
		});
	};
	showItem(item);
});

events.on('basket:update', () => {
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', { itemId: item.id });
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
		});
	});

	appData.order.items = appData.basket.map(({ id }) => id);
	appData.order.total = appData.basket.reduce(
		(acc, { price }) => price + acc,
		0
	);
	basket.selected = appData.basket;
});

events.on('basket:remove', (item: IProduct) => {
	const index = appData.basket.findIndex((prod) => prod.id === item.id);
	appData.removeFromBasket(item);
	appData.basket.splice(index, 1);
	events.emit('basket:update');
	page.counter = appData.basket.length;
});

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

//разблокируем прокрутку страницы
events.on('modal:close', () => {
	page.locked = false;
});
