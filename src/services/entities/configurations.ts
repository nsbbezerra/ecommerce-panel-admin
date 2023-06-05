interface AppProps {
  free_shipping: boolean;
}

interface PaymentOnlineProps {
  gateway: string;
  api_key: string;
}

interface LocalPaymentProps {
  max_installments: number;
  money: boolean;
  pix: boolean;
  credit_card: boolean;
  debit_card: boolean;
  ticket: boolean;
  check: boolean;
  trade_note: boolean;
}

export interface ConfigurationsEntity {
  id?: string;
  app?: AppProps;
  payment_online?: PaymentOnlineProps;
  payment_local?: LocalPaymentProps;
}

export interface ConfigsAlertProps {
  id: string;
  page: string;
  message: string;
}

export interface ConfigsRegionShipping {
  id: string;
  city: string;
  state: string;
}

export interface ConfigsProps {
  alerts: ConfigsAlertProps[];
  regions: ConfigsRegionShipping[];
  dark_mode: boolean;
  shipping_mode: "yes" | "no";
  selected_state: string[];
  country_shipping: "yes" | "no";
}
