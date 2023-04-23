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
