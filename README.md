# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание данных

### Интерфейс продукта
```
export interface IProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
    }
```
### Интерфейс формы заказа
```
export interface IOrderForm {
    payment: PaymentMethods;
    address: string;
    }
```
### Интерфейс формы c контактной информацией
```
export interface IContactsForm {
    email: string;
    phone: string;
    }
```
### Интерфейс состояния приложения 
```
export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    }
```
### Интерфейс резульатат заказа
```
 export interface IOrderResult {
    id: string;
    total: number;
    } 
```
###  Интерфейс заказа
```
export interface IOrder extends IOrderForm, IContactsForm {
    items: string[];
    total: number;
    }
```
### Тип способа оплаты
```
export type PaymentMethods = 'card' | 'cash';
```
### Тип полей формы
```
export type FieldsInput = Pick<IOrderForm, 'address'> & IContactsForm;
```
### Тип ошибки формы 
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```
## Архитектура приложения

Проект построен с учетом MVP подхода и разделен на слои:
- слой данных, отвечает за хранение и изменение данных
- слой отображения, отвечает за отрисовку интерфейса
- слой комуникации, отвечает за связь отображения и данных

## Слой модели данных

### Абстрактный класс Model

Модель, которая позволяет на своей основе создавать новые модели.

#### Поля класса:

`data: Partial<T>` — данные\
`protected events: IEvents` — события

#### Методы класса::

`emitChanges(event: string, payload?: object)` — сообщает, что модель изменилась\
Принимает параметры:\
`event: string` — событие, которое отслеживают\
`payload?: object` — используемый объект

### Класс AppState

Класс наследуется от абстрактного класса Model, необходим для управления состоянием приложения.

#### Методы класса::

`getTotal(): number` — возвращает суммарную стоимость товаров в корзине\
`setCatalog(items: IProduct[])` — устанавливает каталог товаров\
В качестве параметра `items: IProduct[]` - принимает список товаров\
`setPreview(item: IProduct)` — устанавливает превью для товара\
Принимает параметр:\
`item:  IProduct` — объект продукта\
`getProduct(): IProduct[]` — возвращает список товаров\
`setOrderField(field: keyof IOrderForm, value: string)` — устанавливает поля формы заказа\
Принимает параметры:\
`field: keyof IOrderForm` — поле формы заказа\
`setContactsField(field: keyof IContactsForm, value: string)` — устанавливает поля формы контактов\
Принимает параметры:\
`field: keyof IContactsForm` — поле контактной информации\
`value: string` — значение поля\
`validateOrder()` — валидация формы заказа\
`validateContacts()` — валидация формы контактных данных\
`addToBasket(product: IProduct)` — добавление товаров в корзину\
Принимает параметр:\
`product: IProduct` — товар, добавляемый в корзину

## Слой отображения 

### Абстрактный класс Component

Абстрактный класс, являющийся основой для всех компонентов в проекте. Необходим  для работы с DOM-элементами, содержит основные методы.

#### Поля класса:

`protected readonly container: HTMLElement` — DOM-элемент, в котором будет размещен компонент

#### Методы класса::

`toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключение класса\
`protected setText(element: HTMLElement, value: unknown)` — устанавливает текстовое содержимое\
`setDisabled(element: HTMLElement, state: boolean)` — меняет статус блокировки\
`protected setHidden(element: HTMLElement)` — скрытие элемента\
`protected setVisible(element: HTMLElement)` — показ элемента\
`protected setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает изображение с алтернативным текстом\
`render(data?: Partial<T>): HTMLElement `— возвращает корневой DOM-элемент

### Класс Basket

Класс наследуется от абстрактного класса Component и отвечает за работу с корзиной.

#### Поля класса:

`protected container: HTMLElement` — контейнер корзины\
`protected events: EventEmitter` — брокер событий

#### Методы класса::

`set items(items: HTMLElement[])` — список товаров в корзине\
Принимает параметр:\
`items: HTMLElement[]` — список DOM-элементов\
`set selected(items: IProduct[])` — блокирует кнопку оформления заказа, в зависимости от наличия товаров в корзине.\
Принимает параметр:\
`items: IProduct[]` — список добавленных товаров в корзину\
`set total(value: number)` — итоговая стоимость товаров\
Принимает параметр:\
` total: number` — итоговая сумма заказа

### Класс Card

Класс наследуется от абстрактного класса Component и необходим для создания карточки товара. .

#### Поля класса:

`protected container: HTMLElement` — контейнер карточки товара\
`actions?: ICardActions` — события

#### Методы класса::

`set id(value: string)` — устанавливает id\
`get id(): string` — получает id или пустую строку\
`set title(value: string)` — устанавливает название товара\
`get title(): string` — получает название товара\
`set description(value: string | string[])` — устанавливает описание\
`set image(value: string)` — устанавливает картинку\
`set price(value: string)` — устанавливает цену\
`get price(): string` — получает цену\
`set category(value: string)` — устанавливает категорию\
`get category(): string` — получает категорию\
`set inBasket(value: boolean)` — текст для кнопки в зависимости от наличия в товара корзине

### Класс Form

Класс наследуется от абстрактного класса Component и отвечаюет за работу с формой заказа.

#### Поля класса:

`protected container: HTMLFormElement` — контейнер формы\
`protected events: IEvents` — события

#### Методы класса:

`set valid(value: boolean)` — состояние валидности формы\
`set errors(value: string)` — текст ошибки формы\
`protected onInputChange(field: keyof T, value: string)` — событие изменения поля ввода\
`render(state: Partial<T> & IFormState)` — возвращает корневой DOM-элемент

### Класс Modal

Класс, отвечающий за работу с модальными окнами. Наследуется от абстрактного класса Component.

#### Поля класса:

`protected container: HTMLElement` — контейнер модального окна\
`protected events: IEvents` — события

#### Методы класса::

`set content(value: HTMLElement)` — контент в модальном окне\
`open()` — открытие модального окна\
`order()` — событие открытия заказа\
`orderContacts()` — событие открытия контактов\
`close()` — закрытие модального окна\
`render(data: IModalData): HTMLElement` — вернуть корневой DOM-элемент

### Класс Success

Класс наследуется от абстрактного класса Component и отвечает за отображение успешного оформления заказа.

#### Поля класса:

`protected container: HTMLElement` — контейнер успешного заказа\
`actions: ISuccessActions` — события\
`total: number` — итоговая стоимость товаров

### Класс Order

Класс наследуется от класса Form и необходим для управления данными внутри формы заказа. 

#### Поля класса:

`protected container: HTMLFormElement` — контейнер карточки товара\
`events: IEvents` — события

####  Методы класса:

`set address(value: string)` — устанавливает адрес доставки\
`set phone(value: string)` — устанавливает номер телефона\
`set email(value: string)` — устанавливает электронную почту\
`set selected(name: string)` — устанавливает способ оплаты

### Класс Page

Класс наследуется от абстрактного класса Component и необходим для работы с главной страницей сайта. 

#### Поля класса:

`protected container: HTMLFormElement` — контейнер карточки товара\
`events: IEvents` — события

#### Методы класса::

`set counter(value: number)` — устанавливает счетчик товаров в корзине\
`set catalog(items: HTMLElement[])` — выводит карточки товаров внутри каталога\
`set locked(value: boolean)` — блокирует скролл (при открытии модальных окон)

## Слой коммуникации

### Класс ShopAPI

Класс наследуется от класса Api, расширяет его и используется для работы с API приложения. 

#### Поля класса:

`cdn: string` — ссылка на ресурсы\
`baseUrl: string` — ссылка для доступа к API\
`options?: RequestInit` — параметры запроса

#### Методы класса::

`getProductItem(id: string): Promise<IProduct>` — получает информацию об одном продукте\
Принимает параметр:\
`id: string` — идентификатор продукта\
`getProductList(): Promise<IProduct[]>` — получает список продуктов\
`orderProducts(order: IOrderForm): Promise<IOrderResult>` — оформить заказ\
Принимает параметр:\
`oder:IOrderForm` — форма заказа