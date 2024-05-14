import { Model } from './base/Model';
import { IProduct,IOrder,IOrderForm,
         FormErrors,IAppState,IContactsForm} from '../types';

export type CatalogChangeEvent = {
  catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
  basket: IProduct[] = [];
  catalog: IProduct[];
  loading: boolean;
  order: IOrder = {
    phone: '',
    address: '',
    email: '',
    payment: null,
    items: [],
    total: 0,
  };
  
  preview: string | null;
  formErrors: FormErrors = {};

  //возвращает суммарную стоимость товаров в корзине
  getTotal(): number {
    const total = this.basket.reduce((acc, item) => acc + item.price, 0);
    return total;
  }

  //устанавливает каталог товаров
  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  //устанавливает превью для товара
  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  //возвращает список товаров
  getProduct(): IProduct[] {
    return this.catalog;
  }

  //устанавливает поля формы заказа
  setOrderField(field: keyof IOrderForm, value: string) {
    if (field === 'payment' && (value === 'card' || value === 'cash')) {
      this.order[field] = value;
    } else if (field !== 'payment') {
      this.order[field] = value;
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  //устанавливает поля формы контактов 
  setContactsField(field: keyof IContactsForm, value: string) { 
    this.order[field] = value; 
    if (this.validateContacts()) { 
      this.events.emit('order:ready', this.order); 
    } 
  } 
 
  //валидация формы заказа 
  validateOrder() { 
    const errors: typeof this.formErrors = {}; 
 
    if (this.order.payment === null) { 
      errors.payment = 'Необходимо указать способ оплаты'; 
    } 
    if (!this.order.address) { 
      errors.address = 'Необходимо указать адрес'; 
    } 
    this.formErrors = errors; 
    this.events.emit('formErrors:change', this.formErrors); 
    return Object.keys(errors).length === 0; 
  } 
 
  //валидация формы контактных данных 
  validateContacts() { 
    const errors: typeof this.formErrors = {}; 
    if (!this.order.email) { 
      errors.email = 'Необходимо указать email'; 
    } 
    if (!this.order.phone) { 
      errors.phone = 'Необходимо указать телефон'; 
    } 
    this.formErrors = errors; 
    this.events.emit('formErrors:change', this.formErrors); 
    return Object.keys(errors).length === 0; 
  } 
 
  //добавление товаров в корзину 
  addToBasket(item: IProduct) { 
		this.basket.push(item);
    this.emitChanges('basket:update');   
  } 

  // Удаление товаров из корзины
  removeFromBasket(item: IProduct) {
    this.basket = this.basket.filter((it) => it != item);
    this.emitChanges('basket:update');
  }

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			items: [],
			total: 0,
			payment: 'card',
			address: '',
		};

		this.emitChanges('order:changed', this.order);
		this.emitChanges('payment:changed', this.order);
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
		this.emitChanges('basket:update', this.basket);
	}
} 
