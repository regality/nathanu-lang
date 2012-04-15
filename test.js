var fs = require('fs')
  , assert = require('assert')
  , colors = require('colors')
  , compile = require('./compiler');

function pass(msg) {
  console.log(msg.green);
}

function info(msg) {
  console.log(msg.blue);
}

function fail(msg) {
  console.log(msg.red.bold.inverse);
}

function errorz(msg) {
  console.log(msg.red);
}

var files = fs.readdirSync(__dirname + '/tests/inputs');

var re = /^(.+)\.(.+)\.(\w+)$/;
var passCount = 0;
files.forEach(function(test) {
  var m = test.match(re);
  var name = m[1];
  var method = m[2];
  var type = m[3];

  var input = fs.readFileSync(__dirname + "/tests/inputs/" + test);
  var output = fs.readFileSync(__dirname + "/tests/outputs/" + name + "." + type);
  if (type === 'json') {
    input = JSON.parse(input);
    output = JSON.parse(output);
  }
  name = name.replace(/-/g, " ");

  try {
    var actual = compile[method](input);
    assert.deepEqual(actual, output);
    pass("Passed test " + name + ".");
    ++passCount;
  } catch (e) {
    fail("Failed test " + name + ".");
    info("expected: " + JSON.stringify(output));
    info("actual:   " + JSON.stringify(actual));
    if (e.message) {
      errorz(e.message);
      errorz(e.stack);
    }
  }
});

info("====================");
if (passCount == files.length) {
  pass("All " + files.length + " tests passed!");
} else {
  errorz("Passed " + passCount + "/" + files.length + " tests.");
}
