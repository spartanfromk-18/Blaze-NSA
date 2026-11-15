export function speak(text, onStatus = () => {}) {
  if (!('speechSynthesis' in window)) { onStatus('इस ब्राउज़र में आवाज़ उपलब्ध नहीं है।'); return false; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN'; utterance.rate = 0.9;
  utterance.onstart = () => onStatus('सुनाया जा रहा है…');
  utterance.onend = () => onStatus(''); utterance.onerror = () => onStatus('आवाज़ उपलब्ध नहीं; नीचे लिखा संदेश पढ़ें।');
  window.speechSynthesis.speak(utterance); return true;
}
