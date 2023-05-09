export default function havePayFormInstallments(payForm: string): boolean {
  switch (payForm) {
    case "ticket":
      return true;
    case "check":
      return true;
    case "credit_card":
      return true;
    case "trade_note":
      return true;
    case "money":
      return false;
    case "pix":
      return false;
    case "debit_card":
      return false;
    default:
      return false;
  }
}
