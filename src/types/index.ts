export interface IProduct {
    id: string;
    title: string;
    description?: string;
    image?: string;
    price: number | null;
    category?: string;
  }
  
  export interface IOrderForm {
    payment: PaymentMethods;
    address: string;
  }
  
  export interface IContactsForm {
    email: string;
    phone: string;
  }
  
  export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
  }
  
  export type PaymentMethods = 'card' | 'cash';
  
  export type FieldsInput = Pick<IOrderForm, 'address'> & IContactsForm;
  
  export interface IOrder extends IOrderForm, IContactsForm {
    items: string[];
    total: number;
  }
  
  export type FormErrors = Partial<Record<keyof IOrder, string>>;
  
  export interface IOrderResult {
    id: string;
    total: number;
  }