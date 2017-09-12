(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('request', factory) :
	(global.request = factory());
}(this, (function () { 'use strict';

function toJSON(string) {
    try {
        return JSON.parse(string);
    } catch (e) {
        return string;
    }
}

function querify(object) {
    if (typeof object === 'string') return object;
    return Object.keys(object).reduce(function (prev, current) {
        return (prev ? prev + '&' : '') + encodeURIComponent(current) + '=' + encodeURIComponent(object[current]);
    }, '');
}

function setHeaders(xhr, headers) {
    headers = headers || {};

    if (!hasContentType(headers)) headers['Content-Type'] = 'application/x-www-form-urlencoded';

    Object.keys(headers).map(function (name) {
        return headers[name] && xhr.setRequestHeader(name, headers[name]);
    });
}

function hasContentType(headers) {
    return Object.keys(headers).some(function (name) {
        return name.toLowerCase() === 'content-type';
    });
}

function getURL(options) {
    if (options.method.toLowerCase() !== 'get' || !options.data) return options.url;

    var queryString = querify(options.data);
    var separator = options.url.indexOf('?') > -1 ? '&' : '?';

    return options.url + separator + queryString;
}

function request(options) {
    if (typeof options === 'string') {
        options = {};
        options.url = arguments[0];
    }
    options = options || {};
    options.data = options.data || {};
    options.method = options.method || 'get';

    var methods = ['get', 'post', 'put', 'delete'];

    if (options.url) return connect(options);

    return methods.reduce(function (request, method) {
        request[method] = function (url) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return connect(Object.assign(options, {
                method: method,
                url: url,
                data: data
            }));
        };
        return request;
    }, {
        then: function then() {
            console.log('use request().methodName() to specify request method');
            return Object.assign({
                catch: function _catch() {}
            });
        }
    });
}

function connect(options) {
    var xhr = new XMLHttpRequest();
    var promifyMethods = ['then', 'catch'];
    var promify = promifyMethods.reduce(function (promise, method) {
        promise[method] = function (callback) {
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
    promify.abort = function () {
        return xhr.abort();
    };

    return promify;
}

function ready(xhr, promify) {
    return function handleReady() {
        if (xhr.readyState === xhr.DONE) {
            xhr.removeEventListener('readystatechange', handleReady, false);
            var done = xhr.status >= 200 && xhr.status < 300 ? 'then' : 'catch';
            promify[done].call(promify, toJSON(xhr.responseText));
        }
    };
}

return request;

})));
//# sourceMappingURL=just-request.js.map
