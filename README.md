# instant-api

API module for [Express](http://expressjs.com) apps.

## Features

- Basic Authentication
- CORS Middleware
- Winston Logging
- Routing (versioned and unversioned)

## Example

Sample usage:

```javascript
const express = require('express');
const InstantAPI = require('instant-express-api');

const app = express();
// const config = ...
const instant = InstantAPI(config);

app.use(instant.auth());
app.use(instant.cors());
app.logger = instant.logging();
app.use(instant.routes());
```

## Configuration

Some features require a configuration object. Options should be passed in on initialisation as a json object. I recommend using something like [config](https://www.npmjs.com/package/config) to access your configuration settings, but you could equally implement something simpler.

### Example

```json
"auth": {
    "method": "basic",
    "users": {
        "craig": "pa55w0rd",
        "admin": "supersecret",
    }
},
"logging": {
    "error": {
        "filename": "error.log"
    },
    "combined": {
        "filename": "combined.log"
    }
},
"routes": {
    "path": "api/routes"
},
```

## Authentication

### Basic

Utilises [Express Basic Auth](https://www.npmjs.com/package/express-basic-auth).

#### Options

`method`: String authentication type, "basic"
`users`: Data dictionary of username:password key value pairs

Sample usage:

```json
"auth": {
    "method": "basic",
    "users": {
        "craig": "pa55w0rd",
        "admin": "supersecret",
    }
}
```

## CORS

Utilises [CORS](https://www.npmjs.com/package/cors). Sample usage:

```javascript
app.use(instant.cors());
```

## Logging

Utilises [Winston](https://www.npmjs.com/package/winston)

#### Options

`error`: Data dictionary of error options, namely `filename` for storing errors
`combined`: Data dictionary of combined options, namely `filename` for storing all debug

Sample usage:

```json
"error": {
    "filename": "error.log"
},
"combined": {
    "filename": "combined.log"
}
```

## Routes

Autoconfigure API routes. Can handle versioned API routes and non-versioned. For example, let's assume you have a routes file that looks like this:

```js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ testing: 123 });
});

module.exports = router;
```

We might store this file in `/api/routes` or `/api/v1.0/routes`.

#### Options

`path`: String location of API routes directory
`base`: Strong location of base API directory (only required when utilising versioned routes)

Sample usage:

```json
"routes": {
    "path": "api/routes"
},
```

Or, if we are using versioned routes:

```json
"routes": {
    "base": "api",
    "path": "routes"
},
```

## Running Tests

**Please note:** tests haven't yet been implemented (https://auth0.com/blog/developing-npm-packages/).

To run the tests, clone the repository and install the dependencies:

```bash
git clone https://github.com/JSJInvestments/instant-api.git
cd instant-api && npm i
npm run test
```

## License

[MIT](LICENSE)

## Roadmap

- Firebase authentication

## Author's Note

Thanks goes to [Instant Feedback](https://instantfeedback.com.au) for allowing this package to be published.
