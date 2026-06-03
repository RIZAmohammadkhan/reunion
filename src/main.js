import './styles.css';

const targetDate = new Date('2036-06-15T00:00:00Z');
const startOverlay = document.getElementById('start-overlay');

let audioCtx;
let audioInitialized = false;

function initApp() {
  if (audioInitialized) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  audioInitialized = true;
  startOverlay.classList.add('is-open');
  document.body.classList.add('app-loaded');

  window.setTimeout(() => {
    startOverlay.hidden = true;
  }, 1200);

  playTick();
}

function playTick() {
  if (!audioInitialized || !audioCtx) return;

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, time);
  osc.frequency.exponentialRampToValueAtTime(10, time + 0.05);

  gainNode.gain.setValueAtTime(0.5, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.start(time);
  osc.stop(time + 0.05);
}

function pad(n, width) {
  return String(Math.floor(n)).padStart(width, '0');
}

function setCountdownToZero() {
  document.querySelectorAll('.countdown-num').forEach((el) => {
    el.textContent = '00';
  });
}

function tick() {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    setCountdownToZero();
    return;
  }

  let years = targetDate.getUTCFullYear() - now.getUTCFullYear();
  let months = targetDate.getUTCMonth() - now.getUTCMonth();
  let days = targetDate.getUTCDate() - now.getUTCDate();
  let hours = targetDate.getUTCHours() - now.getUTCHours();
  let mins = targetDate.getUTCMinutes() - now.getUTCMinutes();
  let secs = targetDate.getUTCSeconds() - now.getUTCSeconds();

  if (secs < 0) {
    secs += 60;
    mins--;
  }
  if (mins < 0) {
    mins += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const daysInCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
    days += daysInCurrentMonth;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const elSecs = document.getElementById('cd-secs');
  const oldSecs = elSecs.textContent;
  const newSecs = pad(secs, 2);

  if (oldSecs !== newSecs) {
    elSecs.textContent = newSecs;
    elSecs.classList.remove('tick');
    void elSecs.offsetWidth;
    elSecs.classList.add('tick');
    playTick();
  }

  document.getElementById('cd-years').textContent = pad(years, 2);
  document.getElementById('cd-months').textContent = pad(months, 2);
  document.getElementById('cd-days').textContent = pad(days, 2);
  document.getElementById('cd-hours').textContent = pad(hours, 2);
  document.getElementById('cd-mins').textContent = pad(mins, 2);
}

document.addEventListener('click', initApp, { once: true });
document.addEventListener('touchstart', initApp, { once: true });

tick();
window.setInterval(tick, 100);
