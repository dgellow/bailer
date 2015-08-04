[![Build Status](https://travis-ci.org/dgellow/bailer.svg?branch=master)](https://travis-ci.org/dgellow/bailer)

# bailer

A small validation library. Inspired by [leonardoborges's bouncer](https://github.com/leonardoborges/bouncer) for Clojure.

## Setup

```
npm install bailer
```

## Usage

At the moment, the only built-in validators are `bailer.validations.required` and `bailer.validations.email` (It's a v0.0.2 btw). But you can create your own (see [here](#custom-validators)).

```js
var b = require('bailer'),
    v = b.validations;

// Define a dummy object.
var person = {name: "John", age: 20,
              corporation: '',
              email: "john.doe@example.org"};

// Check if it matches the schema.
b.validate(person, {
  name: [v.required],
  age: [v.required],
  email: [v.email]
});

// Every validations passed.
// Result:
// [null, {name: "John",
//         age: 20,
//         corporation: '',
//         email: "john.doe@example.org"}]
//

```

### Errors

```js
b.validate(person, {
  name: [b.required],
  corporation: [b.required],
  firstname: [b.required]
});

// Uh-oh. The person object object doesn't have a truthy corporation
// (it is empty) or firstname (it is undefined).
// Result:
// [
//  {
//    corporation: ["corporation must be present"],
//    firstname: ["firstname must be present"]
//  }, {
//    name: "John",
//    age: 20,
//    corporation: '',
//    email: "john.doe@example.org"
//  }
// ]
```


You can use a custom message.

```
b.validate(person, {
  corporation: [b.required, "What! You don't work for a corporation?!"]
});
// which results in:
// [
//   {
//     corporation: ["What! You don't work for a corporation?!"]
//  }, {
//    name: "John",
//    age: 20,
//    corporation: '',
//    email: "john.doe@example.org"
//  }
// ]
```

## Custom validators

A custom validator is a `function` with this signature:

```js
function customValidator(obj, attributeName) {
  // Do your stuff here
  // ...
  var correctResult = obj[attributeName].length > 3;

  // If the provided value is valid, return null.
  // Otherwise, return a description.
  return correctResult ? null : "".concat(attributename, " should contains at least 3 elements");
}
```
