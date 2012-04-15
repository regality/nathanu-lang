var compile = require('./compile')
  , pitchToMIDI = require('./midi');

function compileMidi(mus) {
  var notes = compile(mus).map(function(v) {
    if (v.pitch) v.pitch = pitchToMIDI(v.pitch);
    return v;
  });
  return notes;
}

module.exports = compileMidi;
