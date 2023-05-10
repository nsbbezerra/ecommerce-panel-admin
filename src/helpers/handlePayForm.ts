export default function handlePayForm(payForm: string): string {
  switch (payForm) {
    case "ticket":
      return "Boleto";
    case "check":
      return "Cheque";
    case "credit_card":
      return "Cartão de Crédito";
    case "trade_note":
      return "Duplicata";
    case "money":
      return "Dinheiro";
    case "pix":
      return "PIX";
    case "debit_card":
      return "Cartão de Débito";
    case "checkout":
      return "Checkout Online";
    default:
      return "Nenhum";
  }
}
