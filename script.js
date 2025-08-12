const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const chordTypes = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  "7": [0, 4, 7, 10],
};

function getMidiNotes(rootNote, type) {
  const root = semitones[rootNote];
  const intervals = chordTypes[type];
  return intervals.map(i => 60 + ((root + i) % 12)); // Middle C = 60
}

function sendMidi(notes) {
  if (!navigator.requestMIDIAccess) return;
  navigator.requestMIDIAccess().then(access => {
    const outputs = [...access.outputs.values()];
    if (outputs.length === 0) return;
    const output = outputs[0];
    notes.forEach(note => {
      output.send([0x90, note, 100]); // Note on
      setTimeout(() => output.send([0x80, note, 0]), 500); // Note off after 500ms
    });
  });
}

document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    const key = document.getElementById("key").value;
    const quality = document.getElementById("quality").value;
    const degree = parseInt(button.dataset.degree);
    const transpose = [0, 2, 4, 5, 7, 9, 11][degree - 1];
    const root = (semitones[key] + transpose) % 12;
    const intervals = chordTypes[quality];
    const notes = intervals.map(i => 60 + ((root + i) % 12));
    sendMidi(notes);
  });
});
