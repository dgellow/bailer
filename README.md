# bailer

A small validation library. Inspired by [leonardoborges's bouncer](https://github.com/leonardoborges/bouncer) for Clojure.

## Setup

```
npm install bailer
```

## Usage

At the moment, the only available validator is `required` (It's a v0.0.1 btw).

```js
var b = require('bailer');

var person = {name: "John", age: 20, corporation: ''};

b.validate(person, {
  name: [b.required],
  age: [b.required]
});

// Every validations passed.
// Result:
// [null, {name: "John", age: 20, corporation: ''}]
//



b.validate(person, {
  name: [b.required],
  corporation: [b.required],
  firstname: [b.required]
});

// Uh-oh. The person object object doesn't have a truthy corporation
// (it is empty) or firstname (it is undefined).
// Result:
// [{
//   corporation: ["corporation must be present"],
//   firstname: ["firstname must be present"]
//  }, {name: "John", age: 20, corporation: ''}]



// You can pass a custom message
b.validate(person, {
  corporation: [b.required, "What! You don't work for a corporation?!"]
});
// which results in:
// [{
//   corporation: ["What! You don't work for a corporation?!"]
//  }, {name: "John", age: 20, corporation: ''}]
```
