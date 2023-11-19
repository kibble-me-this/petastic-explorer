import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function format_seconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining_seconds = seconds % 60;

  const minute_str = minutes === 1 ? 'minute' : 'minutes';
  const second_str = remaining_seconds === 1 ? 'second' : 'seconds';

  if (minutes > 0 && remaining_seconds > 0) {
    return `${minutes} ${minute_str} ${remaining_seconds} ${second_str}`;
  }
  if (minutes > 0) {
    return `${minutes} ${minute_str}`;
  }
  
  return `${remaining_seconds} ${second_str}`;
}

