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
  team: ''
};

function reportTest(testName, testFn) {
  try {
    counterTotal += 1;
    process.stdout.write(c.yellow(testName + ': '));
    testFn();
    console.info(c.green('OK'));
    counterSuccess += 1;
  } catch(e) {
    counterFailure += 1;
    console.error(c.red('FAILED'));
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
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {}),
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      name: []
    }),
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      missingProperty: []
    }),
    [null, dummyModel]
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
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [v.required]
    }),
    [{team: ["team must be present"]}, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [v.required, "A custom message"],
    }),
    [{team: ["A custom message"]}, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [v.required],
      petList: [v.required]
    }),
    [{team: ["team must be present"],
      petList: ["petList must be present"]}, dummyModel]
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
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      name: [v.email]
    }),
    [{name: ["name is not a valid email address"]}, dummyModel]
  );

  assert.deepEqual(
    b.validate({}, {
      email: [v.email]
    }),
    [{email: ["email is not a valid email address"]}, {}]
  );
});



//
// Tests result
//
console.log('Total: ' + counterTotal);
console.log('Passed: ' + counterSuccess);
console.log('Failed: ' + counterFailure);
