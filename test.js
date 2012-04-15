var fs = require('fs')
  , assert = require('assert')
  , colors = require('colors')
  , compile = require('./compiler');

function pass(msg) {
  console.log(msg.green);
}

function fail(msg) {
  console.log(msg.red.bold.inverse);
}

function errorz(msg) {
  console.log(msg.red);
}

var files = fs.readdirSync(__dirname + '/tests');
files.sort(function(a,b) {
  return parseInt(a) - parseInt(b);
});

for (var i = 0; i < files.length; i += 1) {
  if (files[i].match(/\.in\./)) {
    files[i] = {
      input: files[i],
      output: files[i + 1]
    };
  } else {
    files[i] = {
      output: files[i],
      input: files[i + 1]
    };
  }
  files.splice(i + 1, 1);
};

var re = /^(\d+).(in|out).(\w+)$/;
var passCount = 0;
files.forEach(function(test) {
  var m = test.input.match(re);
  var num = m[1];
  var inputType = m[3];
  var outputType = test.output.match(re)[3];
  var name = "number " + num;
  var method = "compile";

  var input = fs.readFileSync(__dirname + "/tests/" + test.input);
  var output = fs.readFileSync(__dirname + "/tests/" + test.output);
  if (inputType === 'json') {
    input = JSON.parse(input);
    name = input.name || name;
    method = input.method || method;
    input = input.input || input;
  }
  if (outputType === 'json') {
    output = JSON.parse(output);
  }

  try {
    assert.deepEqual(
      compile[method](input),
      output
    );
    pass("Passed test " + name + ".");
    ++passCount;
  } catch (e) {
    fail("Failed test " + name + ".");
    errorz(e.message);
    errorz(e.stack);
  }
});

console.log();
console.log("====================");
if (passCount == files.length) {
  pass("All " + files.length + " tests passed!");
} else {
  errorz("Passed " + passCount + "/" + files.length + " tests.");
}
