var assert = require('assert')
  , pitchToMIDI = require('./midi');

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
