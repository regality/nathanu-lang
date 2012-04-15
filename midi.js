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

module.exports = pitchToMIDI;
