const validateBarcode = (verifiable) => {
  //проверка на пустоту заполнения инпута с ШК
  if (verifiable === "") return false;
  //определяем контрольный разряд
  const control = verifiable.slice(-1);
  //выделяем часть ШК из которой будет высчитываться контрольный разряд
  const trimmed = verifiable.slice(0, -1).split("");
  //расчет контрольного разряда
  const sumOdd =
    trimmed.reduce((sum, item, index) => {
      return index % 2 === 0 ? (sum += +item) : sum;
    }, 0) * 3;
  const sumEven = trimmed.reduce((sum, item, index) => {
    return index % 2 === 1 ? (sum += +item) : sum;
  }, 0);
  /**
   * возвращаем равенство вычисленного разряда и представленного в ШК(+проверка если контрольный разряд  === 0)
   */
  return (sumEven + sumOdd) % 10 === 0
    ? (sumEven + sumOdd) % 10 === +control
    : 10 - ((sumEven + sumOdd) % 10) === +control;
};

export { validateBarcode };
