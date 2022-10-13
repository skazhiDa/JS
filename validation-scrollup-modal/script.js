(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('open-modal-btn');
    const modal = document.getElementById(openModalBtn.dataset.target);
    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
    document.querySelector('.modal-dialog').addEventListener('click', (event) => {
      // eslint-disable-next-line no-underscore-dangle
      event._clickWithinModal = true;
    });
    modal.addEventListener('click', (event) => {
      // eslint-disable-next-line no-underscore-dangle
      if (event._clickWithinModal) return;
      modal.style.display = 'none';
    });

    const input = document.querySelectorAll('.input');
    const expectedStr = /^[а-яА-я- ]*$/;

    function testInput(string) {
      return expectedStr.test(string);
    }

    function filterInput(string) {
      for (let i = 0; i < string.length; i++) {
        if (!expectedStr.test(string[i])) string[i] = '';
      }
      const extraPartSides = /^(--?)+|(--?)+$/gm;
      const extraPartMiddle1 = /-{2,}/g;
      const extraPartMiddle2 = / {2,}/g;
      return string
        .trim()
        .replace(extraPartSides, '')
        .replace(extraPartMiddle1, '-')
        .replace(extraPartMiddle2, ' ');
    }

    input.forEach((elem) => {
      elem.addEventListener('keypress', (event) => {
        if (!testInput(elem.value + event.key)) event.preventDefault();
      });
      elem.addEventListener('blur', () => {
        elem.value = filterInput(elem.value);
      });
    });

    document
      .getElementById('form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const text = document.createElement('p');
        input.forEach((elem) => {
          text.textContent += `${elem.value} `;
          elem.value = '';
        });
        document.querySelector('.section-input').append(text);
      });

    const scrollBtn = document.getElementById('scroll-up');
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
      } else { scrollBtn.style.display = 'none'; }
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
