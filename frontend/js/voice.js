// keep existing imports/engine…

let _onInterimCb = null;
let _onFinalCb   = null;

export function onInterimTranscript(text, cb) {
  _onInterimCb = cb;
  if (cb) cb(text);
}
export function onFinalTranscript(text, cb) {
  _onFinalCb = cb;
  if (cb) cb(text);
}

/* Example wire-up inside your recognition handlers:
recognition.onresult = (e) => {
  let interim = '';
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const res = e.results[i];
    if (res.isFinal) {
      const txt = res[0].transcript.trim();
      _onFinalCb && _onFinalCb(txt);
      // … your existing send(txt)
    } else {
      interim += res[0].transcript;
    }
  }
  if (interim) _onInterimCb && _onInterimCb(interim);
};
recognition.onend = () => { _onInterimCb && _onInterimCb(''); };
*/
