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

Проект построен с учетом MVP подхода.

### Слой данных (Model)
Модель данных предназначена для работы с бизнес-логикой приложения.

#### Слой реализован с помощью следующих классов:

- Класс, который реализуют основную работу с данными приложения:
работа с товарами добавленными в корзину, получение товаров, установка полей формы и валидация форм

### Слой отображения (View) 

Слой отображения необходим для отрисовки интерфейса, с помощью которого пользователь будет взаимодействовать с приложеним.

#### Слой реализован с помощью следующих классов:

- Класс для отрисовки карточки товара
- Класс для работы с корзиной товаров
- Класс для работы с модальными окнами
- Класс, реализующий форму
- Класс для управления данными внутри формы заказа
- Класс, отрисовывающий главную страницу
- Класс успешного оформления заказа

### Слой представления (Presenter)

Cлой позволяет получать информацию из API приложения.

#### Слой реализован с помощью следующих классов:

- Класс, реализующий возможность обращения к API приложения
