import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const multipliedNumber = number * 2;
  const format = multipliedNumber ? numeral(multipliedNumber).format('0.0') : '0.0';

  return format;
}

export function fKibble(number) {
  const thousandFormatted = number ? fNumber(number) : '';
  return `${thousandFormatted} \u24C0ibble Cash`;
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
