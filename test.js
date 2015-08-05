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
// Tests result
//
console.log('Total: ' + counterTotal);
console.log('Passed: ' + counterSuccess);
console.log('Failed: ' + counterFailure);
