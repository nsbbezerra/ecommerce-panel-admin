export default function formatCurrency(
  value: string | number,
  dollarSign?: "withSign" | "withoutSign"
) {
  if (!dollarSign || dollarSign === "withSign") {
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  } else if (dollarSign === "withoutSign") {
    return Number(value).toLocaleString("pt-br", { minimumFractionDigits: 2 });
  }
}
