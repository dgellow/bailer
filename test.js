/*global require, process*/

var assert = require('assert'),
    c = require('colors/safe'),
    b = require('./index');

var counterTotal = 0,
    counterSuccess = 0,
    counterFailure = 0;

var dummyModel = {
  firstname: 'John',
  lastname: 'Doe',
  age: 23,
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
});

reportTest("`required` validations", function () {
  assert.deepEqual(
    b.validate(dummyModel, {
      firstname: [b.required],
      age: [b.required]
    }),
    [null, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [b.required]
    }),
    [{team: ["team must be present"]}, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [b.required, "A custom message"],
    }),
    [{team: ["A custom message"]}, dummyModel]
  );

  assert.deepEqual(
    b.validate(dummyModel, {
      team: [b.required],
      petList: [b.required]
    }),
    [{team: ["team must be present"],
      petList: ["petList must be present"]}, dummyModel]
  );
});

console.log('Total: ' + counterTotal);
console.log('Passed: ' + counterSuccess);
console.log('Failed: ' + counterFailure);
