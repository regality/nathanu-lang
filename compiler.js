// dammit all to hell I wish nathan would have told me to save that code
var assert = require('assert');

function compile(mus, notes) {
  if (!notes) {
    notes = [];
    setStartTimes(mus);
  }
  if (mus.tag === "repeat") {
    for (var i = 0; i < mus.count; ++i) {
      compile(mus.section, notes);
    }
  } else if (mus.tag === 'seq' || mus.tag == 'par') {
    compile(mus.left, notes);
    compile(mus.right, notes);
  } else {
    notes.push(mus);
  }
  return notes;
}

function compileT(mus) {
  var notes = compile(mus).map(function(v) {
    if (v.pitch) v.pitch = pitchToMIDI(v.pitch);
    return v;
  });
  return notes;
}

function pitchToMIDI(pitch) {
  var l = pitch[0].toLowerCase();
  switch (l) {
    case 'c': l = 0; break;
    case 'd': l = 2; break;
    case 'e': l = 4; break;
    case 'f': l = 5; break;
    case 'g': l = 7; break;
    case 'a': l = 9; break;
    case 'b': l = 11; break;
    default: l = 0;
  }
  var octave = pitch[1];
  var midi = 12 + 12 * octave + l;
  return midi;
}

function setStartTimes(mus, offset) {
  offset = offset || 0;
  if (mus.tag === 'par') {
    return Math.max(
      setStartTimes(mus.left, offset),
      setStartTimes(mus.right, offset)
    );
  } else if (mus.tag === 'seq') {
    offset += setStartTimes(mus.left, offset);
    return setStartTimes(mus.right, offset);
  } else {
    mus.start = offset;
    return mus.dur;
  }
}

module.exports = {
  compile: compile,
  compileT: compileT,
  pitchToMIDI: pitchToMIDI
};
