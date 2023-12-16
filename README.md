# tiny-log-http

Simple middleware for logging requests

```
npm i tiny-log-http
```

## Usage

```js
const express = require('express')
const logHTTP = require('tiny-log-http')

const app = express()

app.use(logHTTP())

app.get('/', function (req, res) {
  res.json('Hello World!')
})

app.listen(3000)
```

## API

#### `const middleware = logHTTP([options])`

Available `options`:

```js
{
  enable: true,
  trustProxy: false, // Uses 'x-forwarded-for' header for the IP
  cloudflare: false, // Uses 'cf-ipcountry' header for the country
  ignoreIPs: [],
  ignoreURLs: [],
  headers: false,
  body: false,
  userAgent: true
}
```

## License

MIT
