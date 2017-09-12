# just request

just request it.

## Start

```bash
$ npm i just-request
```

## Usage

### Options

```js
import request from 'just-request';

request({
    url: url,
    method: 'get', // get, post, put, delete
    data: {},
});

// shorthand

request(url); // method default to `get`

// with headers
request({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // `application/x-www-form-urlencoded` by default
        // ...
    },
});
```

### Methods

**`.get(url[, data])`**

```js
request('/api/posts');
// or
request().get('/api/posts')
// with data
request().get('/api/post', { id: 1 }); // it will request on `/api/post?id=1`.
```

**`.post(url[, data])`**

```js
request().post('/api/posts', { content: 'content' })
```

**`.put(url[, data])`**

```js
request().put('/api/posts', { id: 1 })
```

**`.delete(url[, data])`**

```js
request().delete('/api/posts', { id: 1 })
```

### Chain

**`.then(data => {})`**

```js
request().get('/api/posts').then(data => {
    // do something here...
});
```

**`.catch(error => {})`**

```js
request().get('/api/posts').catch(error => {
    // do something here...
});
```
