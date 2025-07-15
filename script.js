const seatContainer = document.getElementById("seatContainer");

const BASE_PRICE = 3000;
const EXTENSION_PRICE = 1000;
const EXTENSION_INTERVAL = 30 * 60 * 1000; // 30分

const seats = [];

for (let i = 1; i <= 10; i++) {
  const seat = {
    id: i,
    isActive: false,
    startTime: null,
    timerInterval: null,
    additional: 0,
    elapsed: 0,
    price: 0
  };
  seats.push(seat);
  createSeatElement(seat);
}

function createSeatElement(seat) {
  const div = document.createElement("div");
  div.className = "seat";
  div.id = `seat-${seat.id}`;

  div.innerHTML = `
    <h3>席 ${seat.id}</h3>
    <p>時間: <span id="time-${seat.id}">00:00:00</span></p>
    <p>料金: ¥<span id="price-${seat.id}">0</span></p>
    <button class="btn-timer" onclick="startTimer(${seat.id})">開始</button>
    <button class="btn-drink" onclick="addDrink(${seat.id})">ドリンク追加 (¥1000)</button>
    <button class="btn-reset" onclick="resetSeat(${seat.id})">会計</button>
  `;

  seatContainer.appendChild(div);
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function startTimer(id) {
  const seat = seats.find(s => s.id === id);
  if (seat.isActive) return;

  seat.isActive = true;
  seat.startTime = Date.now() - seat.elapsed;

  seat.timerInterval = setInterval(() => {
    seat.elapsed = Date.now() - seat.startTime;
    updateDisplay(seat);
  }, 1000);
}

function addDrink(id) {
  const seat = seats.find(s => s.id === id);
  seat.additional += 1000;
  updateDisplay(seat);
}

function resetSeat(id) {
  const seat = seats.find(s => s.id === id);
  seat.isActive = false;
  clearInterval(seat.timerInterval);
  seat.startTime = null;
  seat.elapsed = 0;
  seat.additional = 0;
  seat.price = 0;
  updateDisplay(seat);
}

function updateDisplay(seat) {
  const timeEl = document.getElementById(`time-${seat.id}`);
  const priceEl = document.getElementById(`price-${seat.id}`);

  timeEl.textContent = formatTime(seat.elapsed);

  const extensions = Math.max(0, Math.floor((seat.elapsed - 60 * 60 * 1000) / EXTENSION_INTERVAL));
  const extensionFee = extensions * EXTENSION_PRICE;
  const base = seat.elapsed > 0 ? BASE_PRICE : 0;
  seat.price = base + extensionFee + seat.additional;

  priceEl.textContent = seat.price;
}
