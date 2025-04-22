/* eslint-disable no-useless-escape */

export function amountToWords(amountInDigits, currency = null) {
  if (!amountInDigits) return '';

  const th = ['', 'thousand', 'million', 'billion', 'trillion'];
  const dg = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];
  const tn = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tw = [
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  const currencyMap = {
    USD: { major: ['dollar', 'dollars'], minor: ['cent', 'cents'] },
    BDT: { major: ['taka', 'taka'], minor: ['poisha', 'poisha'] },
    EUR: { major: ['euro', 'euros'], minor: ['cent', 'cents'] },
    INR: { major: ['rupee', 'rupees'], minor: ['paise', 'paise'] },
  };

  function toWords(s) {
    s = s.toString().replace(/[\, ]/g, '');
    if (isNaN(s)) return 'not a number';
    let x = s.indexOf('.');
    if (x === -1) x = s.length;
    if (x > 15) return 'too big';
    const n = s.split('');
    let str = '';
    let sk = 0;
    for (let i = 0; i < x; i++) {
      if ((x - i) % 3 === 2) {
        if (n[i] === '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        } else if (n[i] !== '0') {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      } else if (n[i] !== '0') {
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 === 0) str += 'hundred ';
        sk = 1;
      }
      if ((x - i) % 3 === 1) {
        if (sk) str += th[Math.floor((x - i - 1) / 3)] + ' ';
        sk = 0;
      }
    }
    return str.trim().replace(/\s+/g, ' ');
  }

  function decimalToWords(decimal) {
    return decimal
      .split('')
      .map((d) => dg[d])
      .join(' ');
  }
  const [whole, decimal = '00'] = Number(amountInDigits).toFixed(2).split('.');
  const wholeNumber = Number(whole);
  const decimalNumber = Number(decimal);
  if (!currency) {
    // Default: use "point"
    const words = toWords(whole);
    const pointPart = decimalToWords(decimal);
    const result = `${words} point ${pointPart}`;
    return result.charAt(0).toUpperCase() + result.slice(1) + '.';
  }

  const { major, minor } = currencyMap[currency] || {
    major: ['unit', 'units'],
    minor: ['subunit', 'subunits'],
  };
  const majorWord = toWords(whole);
  const minorWord = toWords(decimal);

  const majorForm = wholeNumber === 1 ? major[0] : major[1];
  const minorForm = decimalNumber === 1 ? minor[0] : minor[1];

  const result = `${majorWord} ${majorForm} and ${minorWord} ${minorForm}`;
  return result.charAt(0).toUpperCase() + result.slice(1) + '.';
}
