export function toJSON(string) {
    try {
        return JSON.parse(string);
    } catch (e) {
        return string;
    }
}

export function querify(object) {
    if (typeof object === 'string') return object;
    return Object.keys(object).reduce((prev, current) => (prev ? `${prev}&` : ``) + encodeURIComponent(current) + '=' + encodeURIComponent(object[current]), '');
}

export function setHeaders(xhr, headers) {
    headers = headers || {};

    if (!hasContentType(headers)) headers['Content-Type'] = 'application/x-www-form-urlencoded';

    Object.keys(headers).map(name => headers[name] && xhr.setRequestHeader(name, headers[name]));
}

export function hasContentType(headers) {
    return Object.keys(headers).some(name => name.toLowerCase() === 'content-type');
}

export function getURL(options) {
    if (options.method.toLowerCase() !== 'get' || !options.data) return options.url;

    const queryString = querify(options.data);
    const separator = options.url.indexOf('?') > -1 ? '&' : '?';

    return options.url + separator + queryString;
}
