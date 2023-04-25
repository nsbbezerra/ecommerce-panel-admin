const calcDiscount = (
  price: number,
  discount: number,
  mode?: "withSign" | "noSign" | "onlyNumber"
): string | number => {
  let calculate = price * ((100 - discount) / 100);
  switch (mode) {
    case "noSign":
      return Number(calculate.toFixed(2)).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      });

    case "withSign":
      return Number(calculate.toFixed(2)).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });

    case "onlyNumber":
      return calculate;

    default:
      return Number(calculate.toFixed(2)).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
  }
};

export default calcDiscount;
