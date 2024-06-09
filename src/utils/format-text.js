export function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
}
