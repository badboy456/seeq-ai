import { model, setupError } from './firebase.js';
import './style.css';

const $ = (id) => document.getElementById(id);
const state = { file: null, imageData: null, result: '', language: localStorage.getItem('seeq-language') || 'en' };
const copy = {
  en: {heroCopy:'Point your camera at an object, machine or anything you want to understand.',scanTitle:'Start with a photo',scanSub:'Upload a clear image for better analysis',previewTitle:'Your image appears here',previewSub:'Machines · Objects · Devices · Plants · More',gallery:'Choose image',camera:'Take photo',questionLabel:'What do you want to know? (optional)',privacy:'Your image is sent for AI analysis. Avoid sensitive/private images.',analyze:'Analyze image',try:'Try:',resultTitle:'What SEEQ found',newScan:'New scan +',disclaimerTitle:'Important safety note',disclaimer:'SEEQ AI can make mistakes. It is not a certified technician, doctor or safety inspector. Never open live electrical equipment, bypass safety guards or attempt dangerous repairs based only on AI guidance.'},
  hi: {heroCopy:'किसी वस्तु, मशीन या ऐसी चीज़ की फोटो लें जिसे आप समझना चाहते हैं।',scanTitle:'फोटो से शुरू करें',scanSub:'बेहतर विश्लेषण के लिए साफ़ तस्वीर चुनें',previewTitle:'आपकी तस्वीर यहाँ दिखेगी',previewSub:'मशीन · वस्तुएँ · डिवाइस · पौधे · अन्य',gallery:'फोटो चुनें',camera:'फोटो लें',questionLabel:'आप क्या जानना चाहते हैं? (वैकल्पिक)',privacy:'तस्वीर AI विश्लेषण के लिए भेजी जाएगी। निजी तस्वीरें न भेजें।',analyze:'तस्वीर का विश्लेषण करें',try:'उदाहरण:',resultTitle:'SEEQ ने क्या पाया',newScan:'नई स्कैन +',disclaimerTitle:'ज़रूरी सुरक्षा सूचना',disclaimer:'SEEQ AI से गलती हो सकती है। यह प्रमाणित तकनीशियन या सुरक्षा निरीक्षक नहीं है। केवल AI की सलाह पर बिजली के खुले उपकरण न छुएँ और खतरनाक मरम्मत न करें।'},
  bho: {heroCopy:'कवनो चीज, मशीन भा सामान के फोटो खींचीं आ ओकरा के समझीं।',scanTitle:'फोटो से शुरू करीं',scanSub:'साफ फोटो चुनीं',previewTitle:'राउर फोटो इहाँ देखाई',previewSub:'मशीन · सामान · डिवाइस · पौधा',gallery:'फोटो चुनीं',camera:'फोटो खींचीं',questionLabel:'का जाने के बा? (जरूरी नइखे)',privacy:'फोटो AI जाँच खातिर भेजाई। निजी फोटो मत भेजीं।',analyze:'फोटो के जाँच करीं',try:'पूछीं:',resultTitle:'SEEQ का पवलस',newScan:'नया स्कैन +',disclaimerTitle:'सुरक्षा के जरूरी बात',disclaimer:'AI से गलती हो सकेला। खतरनाक मरम्मत खुद मत करीं। जरूरत पर जानकार मिस्त्री से संपर्क करीं।'},
  mai: {heroCopy:'कोनो वस्तु वा मशीनक फोटो लिअ आ ओकरा बुझू।',scanTitle:'फोटोसँ शुरू करू',scanSub:'स्पष्ट फोटो चुनू',previewTitle:'अहाँक फोटो एतय देखत',previewSub:'मशीन · वस्तु · उपकरण · गाछ',gallery:'फोटो चुनू',camera:'फोटो लिअ',questionLabel:'अहाँ की जनबाक चाहैत छी?',privacy:'फोटो AI जाँच लेल भेजल जाएत। निजी फोटो नहि पठाउ।',analyze:'फोटो जाँचू',try:'पूछू:',resultTitle:'SEEQ की बुझलक',newScan:'नव स्कैन +',disclaimerTitle:'सुरक्षा सूचना',disclaimer:'AI गलती कऽ सकैत अछि। खतरनाक मरम्मत स्वयं नहि करू। विशेषज्ञसँ सलाह लिअ।'},
  bn: {heroCopy:'কোনো বস্তু বা যন্ত্রের ছবি তুলে সেটি বুঝুন।',scanTitle:'ছবি দিয়ে শুরু করুন',scanSub:'পরিষ্কার ছবি বেছে নিন',previewTitle:'আপনার ছবি এখানে দেখা যাবে',previewSub:'যন্ত্র · বস্তু · ডিভাইস · গাছ',gallery:'ছবি বাছুন',camera:'ছবি তুলুন',questionLabel:'আপনি কী জানতে চান?',privacy:'ছবি AI বিশ্লেষণের জন্য পাঠানো হবে। ব্যক্তিগত ছবি দেবেন না।',analyze:'ছবি বিশ্লেষণ করুন',try:'চেষ্টা করুন:',resultTitle:'SEEQ যা বুঝেছে',newScan:'নতুন স্ক্যান +',disclaimerTitle:'নিরাপত্তা সতর্কতা',disclaimer:'AI ভুল করতে পারে। বিপজ্জনক মেরামত নিজে করবেন না; বিশেষজ্ঞের সাহায্য নিন।'},
  ta: {heroCopy:'ஒரு பொருள் அல்லது இயந்திரத்தைப் படம் எடுத்து புரிந்துகொள்ளுங்கள்.',scanTitle:'படத்துடன் தொடங்குங்கள்',scanSub:'தெளிவான படத்தைத் தேர்ந்தெடுக்கவும்',previewTitle:'உங்கள் படம் இங்கே தோன்றும்',previewSub:'இயந்திரம் · பொருட்கள் · செடிகள்',gallery:'படத்தைத் தேர்வு',camera:'படம் எடுக்க',questionLabel:'நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?',privacy:'படம் AI ஆய்வுக்கு அனுப்பப்படும். தனிப்பட்ட படங்களைத் தவிர்க்கவும்.',analyze:'படத்தை ஆய்வு செய்',try:'முயற்சிக்கவும்:',resultTitle:'SEEQ கண்டறிந்தது',newScan:'புதிய ஸ்கேன் +',disclaimerTitle:'பாதுகாப்பு குறிப்பு',disclaimer:'AI தவறு செய்யலாம். ஆபத்தான பழுதுபார்ப்பை நீங்களே செய்ய வேண்டாம்.'},
  te: {heroCopy:'ఏదైనా వస్తువు లేదా యంత్రం ఫోటో తీసి అర్థం చేసుకోండి.',scanTitle:'ఫోటోతో ప్రారంభించండి',scanSub:'స్పష్టమైన చిత్రాన్ని ఎంచుకోండి',previewTitle:'మీ చిత్రం ఇక్కడ కనిపిస్తుంది',previewSub:'యంత్రాలు · వస్తువులు · మొక్కలు',gallery:'చిత్రాన్ని ఎంచుకోండి',camera:'ఫోటో తీయండి',questionLabel:'మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',privacy:'చిత్రం AI విశ్లేషణకు పంపబడుతుంది. వ్యక్తిగత చిత్రాలను పంపవద్దు.',analyze:'చిత్రాన్ని విశ్లేషించండి',try:'ప్రయత్నించండి:',resultTitle:'SEEQ గుర్తించినవి',newScan:'కొత్త స్కాన్ +',disclaimerTitle:'భద్రతా గమనిక',disclaimer:'AI తప్పులు చేయవచ్చు. ప్రమాదకర మరమ్మతులు స్వయంగా చేయవద్దు.'},
  mr: {heroCopy:'एखाद्या वस्तूचा किंवा मशीनचा फोटो काढा आणि समजून घ्या.',scanTitle:'फोटोने सुरुवात करा',scanSub:'स्पष्ट फोटो निवडा',previewTitle:'तुमचा फोटो येथे दिसेल',previewSub:'मशीन · वस्तू · उपकरणे · वनस्पती',gallery:'फोटो निवडा',camera:'फोटो काढा',questionLabel:'तुम्हाला काय जाणून घ्यायचे आहे?',privacy:'फोटो AI विश्लेषणासाठी पाठवला जाईल. खाजगी फोटो पाठवू नका.',analyze:'फोटोचे विश्लेषण करा',try:'प्रयत्न करा:',resultTitle:'SEEQ ला काय आढळले',newScan:'नवीन स्कॅन +',disclaimerTitle:'महत्त्वाची सुरक्षा सूचना',disclaimer:'AI कडून चुका होऊ शकतात. धोकादायक दुरुस्ती स्वतः करू नका.'}
};

function setLanguage(lang) {
  state.language = lang; localStorage.setItem('seeq-language', lang);
  const words = copy[lang] || copy.en;
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (words[key]) el.textContent = words[key]; });
  $('question').placeholder = lang === 'hi' ? 'जैसे: यह मशीन क्या है और इसमें आवाज़ क्यों आ रही है?' : 'e.g. What is this machine and why is it making noise?';
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 3200); }
function setStatus(message, kind='info') { $('status').innerHTML = `<div class="status-card ${kind}">${escapeHtml(message)}</div>`; }
function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Please select an image file.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Image is too large. Choose an image under 12 MB.');
  const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
  const img = new Image(); img.src = dataUrl; await img.decode();
  const scale = Math.min(1, 1400 / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  const jpeg = canvas.toDataURL('image/jpeg', 0.82);
  return { data: jpeg.split(',')[1], mimeType: 'image/jpeg', preview: jpeg };
}

function languageInstruction(lang) {
  const names = {en:'English',hi:'Hindi',bho:'Bhojpuri',mai:'Maithili',bn:'Bengali',ta:'Tamil',te:'Telugu',mr:'Marathi'};
  return `Write the entire answer in ${names[lang] || 'English'}. Use simple, natural language suitable for an Indian user. Keep technical terms in English with short explanations when helpful.`;
}

async function analyze() {
  if (!state.imageData) return toast('Choose or take a photo first.');
  if (!model) { setStatus(`AI is not connected yet. ${setupError || 'Complete Firebase setup first.'}`, 'error'); return; }
  $('analyzeBtn').disabled = true; $('analyzeBtn').innerHTML = '<span class="spinner"></span> Analyzing…';
  $('resultSection').hidden = true; setStatus('SEEQ is examining the image. This can take a few seconds…');
  const question = $('question').value.trim() || 'Identify this and explain what it is, what it does, and what I should know about it.';
  const prompt = `You are SEEQ AI, a cautious visual understanding assistant for users in India. ${languageInstruction(state.language)}\n\nAnalyze the attached image and answer the user's question: "${question}".\n\nReturn a clear, structured answer with these headings: 1) What I can see 2) Likely identification 3) How it works / what it is used for 4) Visible condition or possible issue (only if visible) 5) Safe next steps 6) What I cannot confirm.\n\nRules: Distinguish visible facts from guesses. Never invent a brand, model, exact fault, price, or specification. If uncertain, say so and ask for a label/model number or another angle. Give a confidence level (Low/Medium/High) with one sentence explaining why. For electrical, vehicle, gas, chemical, medical, structural, high-pressure or industrial hazards, do not give risky repair instructions; advise switching off/isolation only if safe and contacting a qualified professional. Do not claim to diagnose medical conditions. If image is unclear or contains multiple objects, ask a clarifying question. Keep the response practical and concise.`;
  try {
    const result = await model.generateContent([prompt, { type: 'inlineData', inlineData: { data: state.imageData.data, mimeType: state.imageData.mimeType } }]);
    state.result = result.response.text() || 'SEEQ could not produce a readable answer. Try another image.';
    $('resultContent').innerHTML = formatAnswer(state.result);
    $('resultSection').hidden = false; $('status').innerHTML = ''; $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error(error); setStatus(friendlyError(error), 'error');
  } finally { $('analyzeBtn').disabled = false; $('analyzeBtn').innerHTML = `<span>${escapeHtml((copy[state.language] || copy.en).analyze)}</span><span>↗</span>`; }
}

function friendlyError(error) {
  const msg = error?.message || 'Unknown error';
  if (/app.?check|403|permission/i.test(msg)) return 'SEEQ could not pass Firebase App Check. Check your Firebase App Check setup and registered debug token.';
  if (/quota|429|resource.?exhausted/i.test(msg)) return 'The free AI request limit may have been reached. Wait and try again later; check your provider quota.';
  if (/network|fetch/i.test(msg)) return 'Network error. Check your internet connection and try again.';
  return `Analysis failed: ${msg}`;
}

function formatAnswer(text) {
  const lines = escapeHtml(text).split('\n'); let html = ''; let inList = false;
  for (const raw of lines) {
    const line = raw.trim(); if (!line) { if (inList) { html += '</ul>'; inList = false; } continue; }
    const heading = line.match(/^#{1,4}\s*(.+)$/) || line.match(/^\*\*(.+?)\*\*:?$/);
    if (heading) { if (inList) { html += '</ul>'; inList = false; } html += `<h3>${heading[1].replace(/\*\*/g,'')}</h3>`; }
    else if (/^[-*•]\s+/.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${line.replace(/^[-*•]\s+/, '').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</li>`; }
    else { if (inList) { html += '</ul>'; inList = false; } html += `<p>${line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</p>`; }
  }
  if (inList) html += '</ul>'; return html;
}

function handleFile(file) {
  if (!file) return;
  compressImage(file).then(data => { state.file = file; state.imageData = data; $('preview').src = data.preview; $('preview').hidden = false; $('previewWrap').classList.add('has-image'); $('analyzeBtn').disabled = false; $('status').innerHTML = ''; }).catch(err => toast(err.message));
}
function saveHistory() {
  if (!state.result) return;
  const items = JSON.parse(localStorage.getItem('seeq-history') || '[]');
  items.unshift({ id: Date.now(), title: state.file?.name || 'Visual analysis', result: state.result, date: new Date().toLocaleString(), image: state.imageData?.preview || '' });
  localStorage.setItem('seeq-history', JSON.stringify(items.slice(0, 20))); toast('Saved on this device.');
}
function showHistory() {
  const items = JSON.parse(localStorage.getItem('seeq-history') || '[]');
  $('historyList').innerHTML = items.length ? items.map(item => `<button class="history-item" data-id="${item.id}"><span class="history-thumb">${item.image ? `<img src="${item.image}" alt="">` : '◉'}</span><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.date)}</small></span><span>›</span></button>`).join('') : '<p class="empty-history">No saved scans yet.</p>';
  $('historyPanel').hidden = false;
  $('historyList').querySelectorAll('.history-item').forEach(btn => btn.addEventListener('click', () => { const item = items.find(x => x.id === Number(btn.dataset.id)); if (item) { state.result = item.result; $('resultContent').innerHTML = formatAnswer(item.result); $('resultSection').hidden = false; $('historyPanel').hidden = true; $('resultSection').scrollIntoView({behavior:'smooth'}); } }));
}

$('language').value = state.language; setLanguage(state.language); $('language').addEventListener('change', e => setLanguage(e.target.value));
$('imageInput').addEventListener('change', e => handleFile(e.target.files[0])); $('cameraInput').addEventListener('change', e => handleFile(e.target.files[0]));
$('analyzeBtn').addEventListener('click', analyze); $('newScanBtn').addEventListener('click', () => { state.file = null; state.imageData = null; state.result = ''; $('imageInput').value = ''; $('cameraInput').value = ''; $('preview').hidden = true; $('previewWrap').classList.remove('has-image'); $('resultSection').hidden = true; $('analyzeBtn').disabled = true; $('question').value = ''; window.scrollTo({top:0,behavior:'smooth'}); });
$('voiceBtn').addEventListener('click', () => { const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SpeechRecognition) return toast('Voice input is not supported in this browser. Try Chrome on Android.'); const rec = new SpeechRecognition(); rec.lang = ({hi:'hi-IN',bho:'hi-IN',mai:'hi-IN',bn:'bn-IN',ta:'ta-IN',te:'te-IN',mr:'mr-IN',en:'en-IN'})[state.language] || 'en-IN'; rec.onresult = e => { $('question').value = e.results[0][0].transcript; }; rec.onerror = () => toast('Could not hear that. Please try again.'); rec.start(); });
$('copyBtn').addEventListener('click', async () => { try { await navigator.clipboard.writeText(state.result); toast('Copied.'); } catch { toast('Copy is not available in this browser.'); } });
$('speakBtn').addEventListener('click', () => { if (!('speechSynthesis' in window)) return toast('Text-to-speech is not supported.'); speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(state.result); utterance.lang = ({hi:'hi-IN',bho:'hi-IN',mai:'hi-IN',bn:'bn-IN',ta:'ta-IN',te:'te-IN',mr:'mr-IN',en:'en-IN'})[state.language] || 'en-IN'; speechSynthesis.speak(utterance); });
$('saveBtn').addEventListener('click', saveHistory); $('historyBtn').addEventListener('click', showHistory); $('closeHistory').addEventListener('click', () => $('historyPanel').hidden = true); $('clearHistory').addEventListener('click', () => { localStorage.removeItem('seeq-history'); showHistory(); });
document.querySelectorAll('.chip').forEach(btn => btn.addEventListener('click', () => { $('question').value = btn.dataset.prompt; $('question').focus(); }));
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(console.warn));
