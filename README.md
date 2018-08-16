# instant-api

API module for [Express](http://expressjs.com) apps.

## Features

- Basic Authentication
- CORS Middleware
- Winston Logging
- Routing (versioned and unversioned)
- Actions, Controller and FirestoreRepository classes

## Example

Sample usage:

```javascript
const express = require('express');
const InstantAPI = require('instant-express-api');

const app = express();
// const config = ...
const instant = InstantAPI.initialize(config);

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

Autoconfigure API routes. Can be used for versioned and non-versioned API routes (for example where route files are stored in `/api/routes` or `/api/v1.0/routes`). This would assume that we have a routes file that looks something like this:

```js
// test.js, which can be accessed from GET /api/test or GET /api/v1.0/test, depending on your folder structure
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ testing: 123 });
});

module.exports = router;
```

#### Options

`path`: String location of API routes directory, e.g `routes`

`base`: String location of base API directory (only required when utilising versioned routes, e.g. `api`). **Note:** you can have multiple version directories, all of which will be searched and routes added.

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

## Classes

Sample usage:

```js
// routes/clients.js
const express = require('express');
const actions = require('../actions/clients');

const router = express.Router();

router.post('/', actions.create);
router.post('/:id', actions.create);
router.get('/', actions.find);
router.get('/:id', actions.findById);
router.put('/:id', actions.update);
router.delete('/:id', actions.delete);

module.exports = router;
```

```js
// api/actions/clients.js
const Actions = require('instant-express-api').Actions;
const controller = require('../controllers/clients');

class Clients extends Actions {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  // Custom methods here...
}

module.exports = new Clients(controller);
```

```js
// api/controllers/clients.js
const Controller = require('instant-express-api').Controller;
const repository = require('../repositories/clients');

class Clients extends Controller {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  // Custom methods here...
}

module.exports = new Clients(repository);
```

```js
// api/repositories/clients.js
const FirestoreRepository = require('instant-express-api').FirestoreRepository;
const firebase = require('..'); // Your firestore initialisation script

class Clients extends FirestoreRepository {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  // Custom methods here...
}

module.exports = new Clients(firebase.db, 'clients');
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
