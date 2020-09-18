import { createEffect, createEvent, sample, createStore, forward } from "effector";
//import { $destinationIndex } from "./../Registration/model";

//запрос последней накладной, получение порядкового номера
const fetchWaybillNumberFx = createEffect("f", {
  handler: () => {
    return "1234567";
  },
});

//определение номера месяца (порядковый номер начиная с 01.01.2000, диапазон от 01 до 99)
const numMonth = (dateNow) => {
  let year = dateNow.getFullYear();
  let month = dateNow.getMonth();
  let monthCount = (year - 2000) * 12 + month;
  const pv = ~~(monthCount / 99);
  return monthCount - pv * 99 + 1 < 10 ? `0${monthCount - pv * 99 + 1}` : monthCount - pv * 99 + 1;
};

//вычисление контрольного разряда (ртм 0008 кажется)
const controlDigit = (str) => {
  const sumOdd =
    str.split("").reduce((sum, item, index) => {
      return index % 2 === 0 ? (sum += +item) : sum;
    }, 0) * 3;
  const sumEven = str.split("").reduce((sum, item, index) => {
    return index % 2 === 1 ? (sum += +item) : sum;
  }, 0);
  return (sumOdd + sumEven) % 10 === 0 ? 0 : 10 - ((sumOdd + sumEven) % 10);
};

//barcode f104 generator
export const generate = createEvent("g");
forward({
  from: generate,
  to: fetchWaybillNumberFx,
});
//const $num = createStore("").on(fetchWaybillNumberFx.doneData, (_, p) => p);
const $index = createStore("170000");
export const $f104Barcode = createStore("");

sample({
  source: $index,
  clock: fetchWaybillNumberFx.doneData,
  fn: (index, number) => {
    let barcode = index + numMonth(new Date()) + number;
    return barcode + controlDigit(barcode);
  },
  target: $f104Barcode,
});

//$f104Barcode.watch((s) => console.log(s));

//пеервод цифр в строки
export const digToText = (dig) => {
  const words = {
    m3: [
      ["тысяча", "тысячи", "тысяч"],
      ["миллион", "миллиона", "миллионов"],
      ["миллиард", "миллиарда", "миллиардов"],
    ],
    m2: ["сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"],
    m1: ["десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"],
    m0: ["один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять"],
    f0: ["одна", "две"],
    l0: [
      "дестять",
      "одиннадцать",
      "двенадцать",
      "тринадцать",
      "четырнадцать",
      "пятнадцать",
      "шестнадцать",
      "семнадцать",
      "восемнадцать",
      "девятнадцать",
    ],
  };

  const dim = (dig, power, words) => {
    let result = "";
    var pow = Math.floor(dig / Math.pow(10, power)) % Math.pow(10, 3);
    if (!pow) return result;
    var n2 = Math.floor(pow / 100);
    var n1 = Math.floor((pow % Math.pow(10, 2)) / 10);
    var n0 = Math.floor(pow % 10);
    var s1 = n1 > 0 ? " " : "";
    var s0 = n0 > 0 ? " " : "";
    var get_n = function () {
      switch (power) {
        case 0:
        case 6:
        case 9:
          result += s0 + words.m0[n0 - 1];
          break;
        case 3:
          if (n0 < 3) {
            result += s0 + words.f0[n0 - 1];
          } else {
            result += s0 + words.m0[n0 - 1];
          }
          break;
        default:
          break;
      }
    };
    if (n2 > 0) {
      result += words.m2[n2 - 1];
    }
    if (n1 > 0) {
      if (n1 > 1) {
        result += s1 + words.m1[n1 - 1];
        if (n0 > 0) get_n();
      } else {
        result += s1 + words.l0[n0];
      }
    } else {
      if (n0 > 0) get_n();
    }
    if (power) {
      var d = (power - 3) / 3;
      if (d === 0 && n0 + n1 * 10 >= 11 && n0 + n1 * 10 <= 14) {
        result += " " + words.m3[0][2];
      } else if (n0 === 1) {
        result += " " + words.m3[d][0];
      } else if (n0 >= 2 && n0 <= 4) {
        result += " " + words.m3[d][1];
      } else if (n0 === 0 || (n0 >= 5 && n0 <= 9)) {
        result += " " + words.m3[d][2];
      }
    }
    return result;
  };
  if (dig === 0) return "ноль";
  let result = "";
  for (var i = 9; i > -1; i -= 3) {
    result += dim(dig, i, words) + " ";
  }
  return result.replace(/[\s]{2,}/gi, " ").trim();
};
