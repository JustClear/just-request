import { querify, setHeaders, hasContentType, toJSON, getURL } from './common';

export default function request(options) {
    if (typeof options === 'string') {
        options = {};
        options.url = arguments[0];
    }
    options = options || {};
    options.data = options.data || {};
    options.method = options.method || 'get';

    const methods = ['get', 'post', 'put', 'delete'];

    if (options.url) return connect(options);

    return methods.reduce((request, method) => {
        request[method] = (url, data = {}) => connect(Object.assign(options, {
            method,
            url,
            data,
        }));
        return request;
    }, {
        then: () => {
            console.log('use request().methodName() to specify request method');
            return Object.assign({
                catch: () => {},
            });
        },
    });
}

function connect(options) {
    const xhr = new XMLHttpRequest();
    const promifyMethods = ['then', 'catch'];
    const promify = promifyMethods.reduce((promise, method) => {
        promise[method] = callback => {
            promise[method] = callback;
            return promise;
        };
        return promise;
    }, {});

    xhr.open(options.method, getURL(options), true);
    xhr.withCredentials = options.hasOwnProperty('withCredentials');
    setHeaders(xhr, options.headers);
    xhr.addEventListener('readystatechange', ready(xhr, promify), false);
    xhr.send(querify(options.data));
    promify.abort = () => xhr.abort();

    return promify;
}

function ready(xhr, promify) {
    return function handleReady() {
        if (xhr.readyState === xhr.DONE) {
            xhr.removeEventListener('readystatechange', handleReady, false);
            const done = xhr.status >= 200 && xhr.status < 300 ? 'then' : 'catch';
            promify[done].call(promify, toJSON(xhr.responseText));
        }
    };
}
