/*global require, process*/

var assert = require('assert'),
    c = require('colors/safe'),
    b = require('./index'),
    v = b.validations;

var counterTotal = 0,
    counterSuccess = 0,
    counterFailure = 0;

var dummyModel = {
  firstname: 'John',
  lastname: 'Doe',
  age: 23,
  email: 'john.doe@example.org',
  messages: [{dest: 'Leo', val: 'Hello'},
             {dest: 'Clotild', val: 'Wanna eat something?'},
             {dest: 'Alphonse', val: '!'}],
  pet: {name: 'hollycat', age: 3},
  team: '',
  friends: 0,
  account: null
};

function reportTest(testName, testFn) {
  try {
    counterTotal += 1;
    process.stdout.write(c.yellow(testName + ': '));
    testFn();
    console.info(c.green('OK'));
    counterSuccess += 1;
  } catch(e) {
    var match = e.stack.match(/at.+test.js:(\d+):(\d+)/),
        line = match[1],
        char = match[2];
    counterFailure += 1;
    console.error(c.red('FAILED') +' ' + c.blue(line + ':' + char));
    console.error(c.red(e.message));
    console.error(c.grey(e.stack));
  }
}

//
// b.validate
//
reportTest("`validate` without rules", function () {
  assert.deepEqual(
    b.validate(dummyModel),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {}),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      name: []
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      missingProperty: []
    }),
    null
  );
});



//
// v.required
//
reportTest("`required` validations", function () {
  assert.deepEqual(
    b.validate(dummyModel, {
      firstname: [v.required],
      age: [v.required]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [v.required]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      friends: [v.required]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      account: [v.required]
    }),
    {account: ["account must be present"]}
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [v.required],
      friends: [v.required],
      account: [v.required],
      petList: [v.required]
    }),
    {account: ["account must be present"],
     petList: ["petList must be present"]}
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      petList: [v.required, "A custom message"],
    }),
    {petList: ["A custom message"]}
  );
});



//
// v.email
//
reportTest("`email` validations", function() {
  assert.deepEqual(
    b.validate(dummyModel, {
      email: [v.email]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      name: [v.email]
    }),
    {name: ["name is not a valid email address"]}
  );

  assert.deepEqual(
    b.validate({}, {
      email: [v.email]
    }),
    {email: ["email is not a valid email address"]}
  );
});



//
// v.number
//
reportTest("`number` validations", function() {
  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.number]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      lastname: [v.number]
    }),
    {lastname: ["lastname must be a number"]}
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.number],
      friends: [v.number],
      lastname: [v.number],
      messages: [v.number]
    }),
    {lastname: ["lastname must be a number"],
     messages: ["messages must be a number"]}
  );
});



//
// v.string
//
reportTest("`string` validations", function() {
  assert.deepEqual(
    b.validate(dummyModel, {
      lastname: [v.string]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.string]
    }),
    {age: ["age must be a string"]}
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.string],
      friends: [v.string],
      lastname: [v.string],
      messages: [v.string]
    }),
    {age: ["age must be a string"],
     friends: ["friends must be a string"],
     messages: ["messages must be a string"]}
  );
});



//
// v.object
//
reportTest("`object` validations", function() {
  assert.deepEqual(
    b.validate(dummyModel, {
      messages: [v.object],
      pet: [v.object]
    }),
    null
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.object]
    }),
    {age: ["age must be a object"]}
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      age: [v.object],
      friends: [v.object],
      lastname: [v.object],
      messages: [v.object],
      pet: [v.object]
    }),
    {age: ["age must be a object"],
     friends: ["friends must be a object"],
     lastname: ["lastname must be a object"]}
  );
});



//
// Tests result
//
console.log('Total: ' + counterTotal);
console.log('Passed: ' + counterSuccess);
console.log('Failed: ' + counterFailure);
