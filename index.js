const container = document.querySelector('.container');
const title = document.querySelector('.title');
const cardsContainer = document.querySelector('.cards__container');
const newGameBtn = document.querySelector('.btn');
const timerDisplay = document.querySelector('.timer');
const modalWindow = document.querySelector('.modal');
const modalLabel = document.querySelector('.modal__label');
const modalInput = document.querySelector('.modal__input');
const modalBtn = document.querySelector('.modal__btn');
const overlay = document.querySelector('.overlay');

let cardsArray = [];
let cards;
let timer;
let time;

// Создание карт, количество которых задается пользователем
const createCards = function(n) {
  const displayCards = function(n) {
    for (let i = 1; i <= n ** 2; i++) {
      const cardMarkup = `
        <button class="card">
          <div class="card__side card__side--front"></div>
          <div class="card__side card__side--back"></div>
        </button>
      `;
      cardsContainer.insertAdjacentHTML('beforeend', cardMarkup);
    }

    // Варьируем ширину контейнера в зависисмости от количества карточек
    cardsContainer.style.width = `${85 * n}px`;

    // Создание нового массива пар чисел от 1 до n
    for (let i = 1; i <= n ** 2 / 2; i++) {
      cardsArray.push(i, i);
    }
  }
  if (n % 2 === 0 && n > 0 && n <= 8) {
    displayCards(n);
  } else {
    displayCards(4);
  }
}

// Перемешивание всех чисел в массиве
const shuffle = function(arr) {
  for(let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

// Присваивание чисел карточкам
const assignNumbers = function() {
  cards = document.querySelectorAll('.card');

  cards.forEach((card, i) => {
    card.classList.remove('flipped');
    card.classList.remove('matched');

    card.querySelector('.card__side--back').textContent = cardsArray[i];
  });
}

// Запуск таймера
const startTimer = function(time) {
  const tick = function() {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    timerDisplay.textContent = `${min} : ${sec}`;

    if (time === 0) {
      init();
      clearInterval(timer);
      newGameBtn.classList.remove('hidden');
    }

    time--;
  }
  tick();

  const timerInterval = setInterval(tick, 1000);
  return timerInterval;
}

// Начало/рестарт игры
const init = function() {
  // Показываем/убираем окно ввода данных
  modalWindow.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
  newGameBtn.classList.add('hidden');

  // Убираем все имеющиеся карточки с экрана
  cardsContainer.innerHTML = '';

  // Очищаем массив с числами, если в нём уже что-то есть
  if (cardsArray.length) cardsArray = [];

  createCards(+modalInput.value);
  shuffle(cardsArray);
  assignNumbers();

  if (timer) clearInterval(timer);

  if (+modalInput.value === 2) timer = startTimer(5);
  else if (+modalInput.value === 6) timer = startTimer(180);
  else if (+modalInput.value === 8) timer = startTimer(240);
  else timer = startTimer(60);
}

// Открытие карт при нажатии
const revealNumber = function(card) {
  card.classList.add('flipped');
  checkMatch();
}

// Проверка карт на совпадение
const checkMatch = function() {
  let flippedCards = document.querySelectorAll('.flipped');

  if (flippedCards.length > 1) {
    if (flippedCards[0].innerText === flippedCards[1].innerText) {
      flippedCards.forEach(card => {
        card.classList.add('matched');
        card.classList.remove('flipped');
      });
    } else {
      cards.forEach(card => {
        card.classList.add('unactive');
      });

      setTimeout(() => {
        cards.forEach(card => {
          card.classList.remove('unactive');
        });
        flippedCards.forEach(card => {
          card.classList.remove('flipped');
        });
      }, 1000);
    }
  }
}

// Конец игры
const checkGameover = function() {
  const matchedCards = document.querySelectorAll('.matched');
  if (matchedCards.length === cardsArray.length) {
    newGameBtn.classList.remove('hidden');
    clearInterval(timer);
  }
}

cardsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.card');
  if (!clicked) return;

  revealNumber(clicked);
  checkGameover();
});

newGameBtn.addEventListener('click', init);
modalBtn.addEventListener('click', (e) => {
  e.preventDefault();
  init();
});
