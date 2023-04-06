const calcDiscount = (price: number, discount: number) => {
  let calculate = price * ((100 - discount) / 100);
  return Number(calculate.toFixed(2)).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

export default calcDiscount;
