
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {ShoppingList, Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create('Homemade Mac and Cheese', [
  'Ronzoni Macaroni',
  'Sharp Cheddar Cheese',
  'Milk',
  'Butter'
]);

Recipes.create('Morir Soñando', [
  'Evaporated Milk',
  'Orange Juice',
  'Sugar',
  'Crushed Ice'
]);

Recipes.create('Tuna Salad', [
  'Tuna',
  'Eggs',
  'Mayonaise',
  'Relish',
  'Onions'
]);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

app.post('/recipes', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients'];

  for (let i = 0; i < requiredFields.length; i += 1) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);

});

app.listen(process.env.PORT || 1337, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 1337}`);
});
