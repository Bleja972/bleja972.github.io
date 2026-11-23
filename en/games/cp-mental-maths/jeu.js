'use strict';

const titles = [
  "Add or subtract 1",
  "Add or subtract 2",
  "Doubles",
  "Near doubles",
  "Sums less than 10",
  "Add or subtract 10",
  "Add or subtract 1 or 2",
  "Make 10",
  "Subtract from 10",
  "Double numbers up to 10",
  "Double whole tens",
  "Add by crossing 10",
  "Complete the next ten",
  "Add a number less than 9",
  "Find half of even numbers from 2 to 20",
  "Add or subtract 10",
  "Add or subtract 20, 30, 40, 50, 60, 70, 80 or 90",
  "Mixed calculations",
  "Mixed calculations",
  "Add 9",
  "Subtract from a whole ten",
  "Subtract from a whole ten",
  "Near doubles",
  "Master sums less than 10",
  "Master crossing 10",
  "Master crossing 10",
  "Mixed calculations",
  "Mixed calculations",
  "Mixed calculations",
  "Add or subtract tens from 10 to 90",
  "Know addition facts from 1 to 10",
  "Add a number less than 9",
  "Mixed calculations",
  "Mixed calculations"
];

const byId = id => document.getElementById(id);
const storageKey = 'calculCPscoresEN';
const duration = 180;
const missionSize = 3;
const missionCount = Math.ceil(titles.length / missionSize);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heading = byId('seqHeading');
const missionList = byId('seqList');
const tabs = byId('tabs');
const questionList = byId('questions');
const feedback = byId('feedback');
const hint = byId('hint');
const clock = byId('timer');
const timerBox = byId('timerBox');
const counter = byId('counter');
const progressBar = byId('progressbar');
const verifyButton = byId('verify');
const clearButton = byId('clear');
const nextButton = byId('next');
const retryButton = byId('retry');
const results = byId('results');
const helpButton = byId('help');
const speakButton = byId('speak');
const soundButton = byId('sound');
const keypad = byId('keypad');
const keypadToggle = byId('keypadToggle');

const scores = loadScores();
let challenge = 0;
let fields = [];
let activeField = 0;
let evaluated = false;
let timer = null;
let deadline = null;
let audioContext;
let muted = false;

function loadScores() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
}

function makePool(challengeIndex) {
  const questions = [];

  function add(a, b, op = '+', hole = false) {
    const r = op === '+' ? a + b : a - b;
    if (r < 0 || r > 100) return;
    const text = hole ? `${a} ${op} ? = ${r}` : `${a} ${op} ${b} = ?`;
    questions.push({ a, b, op, r, hole, answer: hole ? b : r, text });
  }

  const n = challengeIndex;
  for (let a = 0; a <= 100; a++) {
    for (let b = 1; b <= 90; b++) {
      if (n === 0 && a >= 1 && a <= 9 && b === 1) {
        add(a, b);
        add(a, b, '−');
      }
      if (n === 1 && a >= 2 && a <= 8 && b === 2) {
        add(a, b);
        add(a, b, '−');
      }
      if (n === 2 && a >= 1 && a <= 5 && a === b) add(a, b);
      if ((n === 3 || n === 22) && a >= 1 && a <= (n === 3 ? 4 : 9) && Math.abs(a - b) === 1) {
        add(a, b);
        if (n === 3) add(a, b, '+', true);
      }
      if ((n === 4 || n === 23) && a >= 1 && a + b < 10) {
        add(a, b);
        if (n === 4) add(a, b, '+', true);
      }
      if (n === 5 && ((a === 10 && b <= 9) || (a <= 9 && b === 10))) add(a, b);
      if (n === 5 && a >= 11 && a <= 19 && b === 10) add(a, b, '−');
      if (n === 6 && a >= 11 && a <= 19 && b <= 2) {
        add(a, b);
        add(a, b, '−');
      }
      if (n === 7 && a >= 1 && a <= 9 && a + b === 10) add(a, b, '+', true);
      if (n === 8 && a === 10 && b <= 9) add(a, b, '−');
      if (n === 9 && a >= 1 && a <= 10 && a === b) add(a, b);
      if (n === 10 && a >= 10 && a <= 50 && a % 10 === 0 && a === b) add(a, b);
      if ([11, 24, 25].includes(n) && a >= 2 && a <= 9 && b <= 9 && a + b > 10) add(a, b);
      if (n === 12 && a >= 11 && a <= 89 && a % 10 > 0 && b === 10 - a % 10) add(a, b, '+', true);
      if ((n === 13 || n === 31) && a >= 11 && a <= 89 && b < 9) add(a, b);
      if (n === 14 && a >= 2 && a <= 20 && a % 2 === 0 && b === a / 2) {
        questions.push({ a, b, op: 'half', r: b, answer: b, text: `Half of ${a} = ?` });
      }
      if (n === 15 && a >= 11 && a <= 99 && b === 10) {
        add(a, b);
        add(a, b, '−');
      }
      if ((n === 16 || n === 29) && a >= 10 && a <= 99 && b % 10 === 0 && b >= (n === 16 ? 20 : 10)) {
        add(a, b);
        add(a, b, '−');
      }
      if (n === 19 && a >= 11 && a <= 90 && b === 9) add(a, b);
      if ((n === 20 || n === 21) && a >= 10 && a <= 90 && a % 10 === 0 && b <= 9) add(a, b, '−');
      if (n === 30 && a >= 1 && a <= 10 && b <= 10) {
        add(a, b);
        add(a, b, '+', true);
      }
      if ([17, 18, 26, 27, 28, 32, 33].includes(n)) {
        if (a >= 1 && a <= 9 && b <= 9) add(a, b);
        if (n !== 26 && a >= 11 && a <= 89 && (b <= 9 || b % 10 === 0)) {
          add(a, b);
          if (b === 1 || b === 2 || b % 10 === 0) add(a, b, '−');
          if (a % 10 && b === 10 - a % 10) add(a, b, '+', true);
        }
      }
    }
  }

  return [...new Map(questions.map(question => [question.text, question])).values()];
}

function makeSeries(index) {
  const pool = makePool(index);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 12);
}

function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function announce(text, result = '') {
  feedback.textContent = text;
  feedback.className = 'feedback';
  if (result) feedback.classList.add(result);
}

function playSound(kind) {
  if (muted) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  const notes = {
    tap: [360],
    good: [490, 740, 988],
    bad: [235, 140],
  };
  try {
    audioContext ||= new Audio();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    notes[kind].forEach((frequency, i) => {
      const start = audioContext.currentTime + i * .086;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = kind === 'bad' ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.001, start);
      gain.gain.exponentialRampToValueAtTime(.045, start + .014);
      gain.gain.exponentialRampToValueAtTime(.001, start + .13);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .14);
    });
  } catch {
    // The activity also works on devices without sound output.
  }
}

function spark(card) {
  if (reduceMotion.matches) return;
  const position = card.getBoundingClientRect();
  if (position.bottom < 0 || position.top > innerHeight) return;
  const fruits = ['🍎','🍊','🍋','🍉','🍇','🍒','🍍','🥝'];
  const colors = ['#00eaff','#ff54cb','#b9ff42','#ffaf37','#a682ff'];
  const count = 9;
  const cx = position.left + position.width / 2;
  const cy = position.top + position.height / 2;
  for (let i=0;i<count;i++) {
    const fruit = document.createElement('span');
    fruit.className = 'pg-fruit';
    fruit.textContent = fruits[(i + Math.floor(Math.random()*fruits.length)) % fruits.length];
    fruit.setAttribute('aria-hidden','true');
    fruit.style.left = cx + 'px';
    fruit.style.top = cy + 'px';
    fruit.style.setProperty('--fruit-glow',colors[i % colors.length]);
    fruit.style.setProperty('--dx',(Math.random()*230-115).toFixed(1)+'px');
    fruit.style.setProperty('--dy',(-65-Math.random()*150).toFixed(1)+'px');
    fruit.style.setProperty('--spin',(Math.random()*140-70).toFixed(0)+'deg');
    document.body.append(fruit);
    setTimeout(()=>fruit.remove(),1300);
  }
}

function renderMenu() {
  for (let i = 0; i < missionCount; i++) {
    const first = i * missionSize;
    const button = element('button', 'seq-btn');
    button.type = 'button';
    button.dataset.challenge = first;
    const caption = element('span', 'seq-title');
    caption.append(element('small', '', 'Mission ' + (i + 1)), titles[first]);
    button.append(element('span', 'seq-num', String(i + 1)), caption);
    missionList.append(button);
  }
}

function selectMission(start, count) {
  for (const button of missionList.children) {
    const selected = Number(button.dataset.challenge) === start;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }

  tabs.replaceChildren();
  for (let i = 0; i < count; i++) {
    const index = start + i;
    const selected = index === challenge;
    const button = element('button', selected ? 'tab active' : 'tab', 'Exercise ' + (i + 1));
    button.type = 'button';
    button.setAttribute('aria-pressed', String(selected));
    button.append(element('small', '', titles[index]));
    button.addEventListener('click', () => loadChallenge(index, true));
    tabs.append(button);
  }
}

function showHint(visible) {
  hint.hidden = !visible;
  helpButton.setAttribute('aria-expanded', String(visible));
}

function showKeypad(visible) {
  keypad.hidden = !visible;
  keypadToggle.setAttribute('aria-expanded', String(visible));
}

function addQuestion(question, index) {
  const card = element('div', 'problem');
  const formula = element('div', 'formula');
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = 'off';
  input.maxLength = 3;
  input.setAttribute('aria-label', 'Calculation ' + (index + 1) + ': ' + question.text.replace('?', 'answer'));
  const [before, after] = question.text.split('?');
  formula.append(element('span', 'symbol', before), input);
  if (after) formula.append(element('span', 'symbol', after));

  const note = element('p', 'answer-note');
  card.append(element('span', 'n', String(index + 1)), formula, note);
  questionList.append(card);
  input.addEventListener('focus', () => {
    if (activeField !== index) showHint(false);
    activeField = index;
  });
  input.addEventListener('input', () => onAnswer(input));
  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || evaluated) return;
    event.preventDefault();
    (fields[index + 1]?.input || verifyButton).focus();
  });

  return { question, card, input, note };
}

function loadChallenge(index, focusHeading = false) {
  clearInterval(timer);
  timer = null;
  deadline = null;
  window.speechSynthesis?.cancel();
  challenge = index;
  activeField = 0;
  evaluated = false;

  const start = Math.floor(index / missionSize) * missionSize;
  const count = Math.min(missionSize, titles.length - start);
  const mission = start / missionSize + 1;
  selectMission(start, count);
  const current = index - start + 1;
  heading.textContent = 'Mission ' + mission + ' · ' + titles[index];
  byId('seqSub').textContent = 'Challenge ' + (index + 1) + ' of ' + titles.length;
  byId('seqHud').textContent = mission + ' / ' + missionCount;
  byId('exHud').textContent = current + ' / ' + count;
  clock.textContent = '3:00';
  timerBox.classList.remove('danger');
  results.hidden = true;
  verifyButton.hidden = false;
  clearButton.hidden = false;
  nextButton.hidden = true;
  retryButton.hidden = true;
  byId('assistance').hidden = false;
  showHint(false);
  showKeypad(false);
  announce('');
  questionList.replaceChildren();
  fields = makeSeries(index).map(addQuestion);
  updateCount();
  if (focusHeading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    byId('arena').scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }
}

function updateCount() {
  const answered = fields.filter(field => field.input.value !== '').length;
  counter.textContent = answered + ' / ' + fields.length;
  progressBar.style.width = (answered / fields.length * 100) + '%';
}

function tick() {
  const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  clock.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  timerBox.classList.toggle('danger', seconds <= 15);
  if (!seconds) evaluate(true);
}

function onAnswer(input) {
  if (evaluated) return;
  input.value = input.value.replace(/\D/g, '').slice(0, 3);
  if (deadline === null && input.value) {
    deadline = Date.now() + duration * 1000;
    timer = setInterval(tick, 250);
  }
  updateCount();
  announce('');
}

function evaluate(expired = false) {
  if (evaluated) return;
  if (!expired && fields.every(field => field.input.value === '')) {
    announce('Enter an answer before checking.');
    fields[0].input.focus();
    return;
  }

  evaluated = true;
  clearInterval(timer);
  timer = null;
  let correct = 0;
  for (const { question, card, input, note } of fields) {
    const filled = input.value !== '';
    input.readOnly = true;
    if (filled && Number(input.value) === question.answer) {
      correct++;
      card.classList.add('good');
      spark(card);
    } else {
      card.classList.add(filled ? 'bad' : 'skip');
      note.textContent = 'Correct answer: ' + question.answer;
    }
  }

  const total = fields.length;
  const percent = Math.round(correct / total * 100);
  scores[challenge] = Math.max(Number(scores[challenge]) || 0, percent);
  try {
    localStorage.setItem(storageKey, JSON.stringify(scores));
  } catch {}

  counter.textContent = correct + ' / ' + total;
  progressBar.style.width = percent + '%';
  byId('resultTitle').textContent = expired ? 'Time is up!' : 'Answers checked';
  byId('score').textContent = percent + ' %';
  const resultText = correct + (correct === 1 ? ' correct answer out of ' : ' correct answers out of ') + total;
  byId('best').textContent = resultText + ' · Best score: ' + scores[challenge] + ' %';
  results.hidden = false;
  verifyButton.hidden = true;
  clearButton.hidden = true;
  nextButton.hidden = false;
  nextButton.textContent = challenge + 1 === titles.length
    ? 'First mission'
    : (challenge + 1) % missionSize === 0 ? 'Next mission' : 'Next exercise';
  retryButton.hidden = false;
  byId('assistance').hidden = true;
  showHint(false);
  showKeypad(false);
  announce(resultText + '.', correct === total ? 'success' : 'error');
  playSound(correct === total ? 'good' : 'bad');
  byId('resultTitle').focus({ preventScroll: true });
  results.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}

function hintFor({ a, b, op, hole, r }) {
  if (op === 'half') return 'Split the number into two equal groups.';
  if (hole) return 'Find what you need to add to ' + a + ' to make ' + r + '.';
  if (a === b && op === '+') return 'For a double, take the same number twice.';
  if (b === 9 && op === '+') return 'Add 10, then subtract 1.';
  if (b % 10 === 0) return 'Use the tens. The ones stay the same.';
  if (op === '−') return 'Start at ' + a + ' and count backwards ' + b + '.';
  if (a % 10 + b > 10 && b < 10) {
    return 'Add ' + (10 - a % 10) + ' to reach the next ten, then add the rest.';
  }
  return 'Start at ' + a + ' and count forwards ' + b + '.';
}

missionList.addEventListener('click', ({ target }) => {
  const button = target.closest('button[data-challenge]');
  if (!button) return;
  playSound('tap');
  loadChallenge(Number(button.dataset.challenge), true);
});
verifyButton.addEventListener('click', () => evaluate());
clearButton.addEventListener('click', () => {
  for (const field of fields) field.input.value = '';
  updateCount();
  announce(deadline === null ? 'Answers cleared.' : 'Answers cleared. The timer keeps running.');
  fields[0].input.focus();
});
nextButton.addEventListener('click', () => loadChallenge((challenge + 1) % titles.length, true));
retryButton.addEventListener('click', () => loadChallenge(challenge, true));
helpButton.addEventListener('click', () => {
  hint.textContent = hintFor(fields[activeField].question);
  showHint(hint.hidden);
});
speakButton.addEventListener('click', () => {
  if (!window.speechSynthesis) {
    announce('Speech is not available on this device.');
    return;
  }
  const { a, b, op, hole, r } = fields[activeField].question;
  let phrase;
  if (op === 'half') phrase = 'What is half of ' + a + '?';
  else if (hole) phrase = a + ' plus what equals ' + r + '?';
  else phrase = a + (op === '+' ? ' plus ' : ' minus ') + b + ' equals what?';
  const words = new SpeechSynthesisUtterance(phrase);
  words.lang = 'en-GB';
  words.rate = .85;
  speechSynthesis.cancel();
  speechSynthesis.speak(words);
});
soundButton.addEventListener('click', () => {
  muted = !muted;
  soundButton.textContent = muted ? '♫ Sound: OFF' : '♫ Sound: ON';
  soundButton.setAttribute('aria-pressed', String(!muted));
  if (!muted) playSound('tap');
});
keypadToggle.addEventListener('click', () => showKeypad(keypad.hidden));
for (const key of ['1', '2', '3', '⌫', '4', '5', '6', 'C', '7', '8', '9', '0']) {
  const button = element('button', 'btn ghost', key);
  button.type = 'button';
  if (key === '⌫') button.setAttribute('aria-label', 'Delete the last digit');
  if (key === 'C') button.setAttribute('aria-label', 'Clear this answer');
  button.addEventListener('click', () => {
    const input = fields[activeField].input;
    if (key === 'C') input.value = '';
    else if (key === '⌫') input.value = input.value.slice(0, -1);
    else if (input.value.length < input.maxLength) input.value += key;
    onAnswer(input);
  });
  keypad.append(button);
}

function animateStars() {
  const canvas = byId('stars');
  const context = canvas.getContext('2d');
  if (!context || reduceMotion.matches) return;
  let stars = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const count = Math.min(95, Math.max(25, Math.floor(innerWidth * innerHeight / 11000)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: .4 + Math.random() * 1.25,
      speed: .15 + Math.random() * .45,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(now) {
    if (reduceMotion.matches) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      star.y += star.speed;
      if (star.y > canvas.height + 3) star.y = -3;
      const alpha = .18 + .35 * (1 + Math.sin(now * .001 + star.phase)) / 2;
      context.fillStyle = `rgba(118,232,255,${alpha})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }
    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
}

renderMenu();
loadChallenge(0);
animateStars();
