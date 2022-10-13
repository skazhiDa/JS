(() => {
  document.addEventListener('DOMContentLoaded', () => {
    let countOpenCards = 0;
    let countGuessedCards = 0;
    let prevOpenCard;
    let actualOpenCard;
    let timerId;

    // мешаем элементы массива, из которого будут браться значения карточек
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // функция для удаления предыдущих игровых полей
    function clearGameField() {
      document.getElementById('game-field').innerText = '';
    }

    // прячем всплывающее окно
    function clearModal() {
      const clear = document.querySelector('.game-field__congrats');
      clear.classList.remove('animate__animated', 'animate__hinge');
      const temper = document.querySelector('.game-field__congrats');
      temper.style.transform = 'translateY(-200%)';
    }

    // показать всплывающее окно
    function showModalCongrats() {
      const temper = document.querySelector('.game-field__congrats');
      temper.style.transform = 'translateY(0%)';
    }

    function showModalTimeOut() {
      const temper = document.querySelector('.game-field__time-out');
      temper.style.transform = 'translateY(0%)';
    }

    function createModalCongrats() {
      const congrats = document.createElement('div');
      congrats.classList.add('game-field__congrats');
      congrats.innerText = 'hoorey!!\nyou won!\nclick me to start a new game\n＼(￣▽￣)／';
      congrats.addEventListener('click', () => {
        congrats.classList.add('animate__animated', 'animate__hinge');
        clearGameField();
        setTimeout(clearModal, 3000);
      });
      document.querySelector('body').append(congrats);
    }

    function createModalTimeOut() {
      const congrats = document.createElement('div');
      congrats.classList.add('game-field__time-out');
      congrats.innerText = 'rats!!\ntime\'s up!\nclick me to start a new game\n(」°ロ°)」';
      congrats.addEventListener('click', () => {
        congrats.classList.add('animate__animated', 'animate__hinge');
        clearGameField();
        setTimeout(clearModal, 3000);
      });
      document.querySelector('body').append(congrats);
    }

    function stopTimer() {
      clearInterval(timerId);
    }

    function timer() {
      const time = document.getElementById('timer__value');
      time.textContent = `${time.textContent - 1}`;
      if (time.textContent === '0') {
        stopTimer();
        showModalTimeOut();
        time.textContent = '60';
      }
    }

    function createGameField(size) {
      stopTimer();
      document.getElementById('timer__value').textContent = '60';

      timerId = setInterval(timer, 1000);

      const gameField = document.getElementById('game-field');
      clearGameField(); // очистим место перед созданием нового поля

      const cardArray = [];
      let number = 1;
      for (let counter = 0; counter < (size * size); counter += 2) {
        cardArray[counter] = number;
        cardArray[counter + 1] = number;
        number++;
      }
      shuffle(cardArray);

      for (let countCard = 0; countCard < (size * size); countCard++) {
        // создаем карточку
        const cardWrap = document.createElement('div');
        const card = document.createElement('div');
        const cardBack = document.createElement('div');
        cardBack.classList.add('cardBack');
        cardWrap.classList.add('cardWrap');
        card.classList.add('card');

        // присваиваем ей номер
        cardBack.textContent = `${cardArray[countCard]}`;

        // от количества карточек зависит какую ширину получит каждая
        switch (size) {
          case '2':
            cardWrap.style.width = '35%';
            cardWrap.style.paddingTop = '35%';
            break;
          case '4':
            cardWrap.style.width = '21%';
            cardWrap.style.paddingTop = '21%';
            break;
          case '6':
            cardWrap.style.width = '16.6%';
            cardWrap.style.paddingTop = '16.6%';
            break;
          case '8':
            cardWrap.style.width = '12.5%';
            cardWrap.style.paddingTop = '12.5%';
            break;
          case '10':
            cardWrap.style.width = '10%';
            cardWrap.style.paddingTop = '10%';
            break;
          default:
            // eslint-disable-next-line no-console
            console.log('error with switch statement');
        }

        cardWrap.append(card);
        cardWrap.append(cardBack);
        gameField.append(cardWrap);

        // добавляем карточке интерактив
        // eslint-disable-next-line no-loop-func
        cardWrap.addEventListener('click', () => {
          card.style.transform = 'perspective(600px) rotateY(-180deg)';
          cardBack.style.transform = 'perspective(600px) rotateY(0deg)';

          countOpenCards++;
          console.log(countOpenCards);
          if (cardWrap !== actualOpenCard) {
            prevOpenCard = actualOpenCard;
            actualOpenCard = cardWrap;
          }

          if (prevOpenCard) {
            if ((countOpenCards === 2)
              && (actualOpenCard.children[1].textContent
              === prevOpenCard.children[1].textContent)
              && (!prevOpenCard.classList.contains('guessed'))
              && (!actualOpenCard.classList.contains('guessed'))) {
              countOpenCards = 0;
              prevOpenCard.classList.add('guessed');
              actualOpenCard.classList.add('guessed');
              countGuessedCards += 2;
              prevOpenCard = null;
              actualOpenCard = null;
            }
            if (countGuessedCards === cardArray.length) {
              showModalCongrats();
              stopTimer();
              countGuessedCards = 0;
            }
          }
          if (countOpenCards === 3) {
            for (let i = 0; i < gameField.children.length; i++) {
              const cardFromArr = gameField.children[i];
              if (!cardFromArr.classList.contains('guessed')) {
                cardFromArr.children[0].style.transform = 'perspective(600px) rotateY(0deg)';
                cardFromArr.children[1].style.transform = 'perspective(600px) rotateY(180deg)';
              }
            }
            countOpenCards = 0;
            prevOpenCard = null;
            actualOpenCard = null;
          }
        });
      }
    }

    document.getElementById('radio-button').addEventListener('click', () => {
      let size = 4;
      document.querySelectorAll('.radio__point').forEach((elem) => {
        if (elem.checked === true) size = elem.value;
      });
      createGameField(size);
    });
    createModalCongrats();
    createModalTimeOut();
  });
})();
