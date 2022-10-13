(() => {
  document.addEventListener('DOMContentLoaded', () => {
    class Modal {
      constructor(options) {
        const defaultOptions = {
          isOpen: () => {},
          isClose: () => {},
        };
        this.options = Object.assign(defaultOptions, options);
        this.modal = document.querySelector('.modal-table');
        this.speed = false;
        this.animation = false;
        this.isOpen = false;
        this.modalContainer = false;
        this.previousActiveElement = false;
        this.fixBlocks = document.querySelectorAll('.fix-block');
        this.focusElements = [
          'a[href]',
          'input',
          'button',
          'select',
          'textarea',
          '[tabindex]',
        ];
        this.events();
      }

      events() {
        if (this.modal) {
          document.addEventListener('click', (e) => {
            const clickedElement = e.target.closest('[data-path]');
            if (clickedElement) {
              const target = clickedElement.dataset.path;
              const { animation } = clickedElement.dataset;
              const { speed } = clickedElement.dataset;
              this.animation = animation || 'fade';
              // eslint-disable-next-line radix
              this.speed = speed ? parseInt(speed) : 300;
              this.modalContainer = document.querySelector(`[data-target="${target}"]`);
              this.open();
              return;
            }

            if (e.target.closest('.modal-close-table')) {
              this.close();
            }
          });

          window.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
              if (this.isOpen) {
                this.close();
              }
            }

            if (e.keyCode === 9 && this.isOpen) {
              this.focusCatch(e);
            }
          });

          this.modal.addEventListener('click', (e) => {
            if (!e.target.classList.contains('modal__container-table') && !e.target.closest('.modal__container-table') && this.isOpen) {
              this.close();
            }
          });
        }
      }

      open() {
        this.previousActiveElement = document.activeElement;

        this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        this.modal.classList.add('is-open');
        this.disableScroll();

        this.modalContainer.classList.add('modal-open-table');
        this.modalContainer.classList.add(this.animation);

        setTimeout(() => {
          this.options.isOpen(this);
          this.modalContainer.classList.add('animate-open');
          this.isOpen = true;
          this.focusTrap();
        }, this.speed);
      }

      close() {
        if (this.modalContainer) {
          this.modalContainer.classList.remove('animate-open');
          this.modalContainer.classList.remove(this.animation);
          this.modal.classList.remove('is-open');
          this.modalContainer.classList.remove('modal-open-table');

          this.enableScroll();
          this.options.isClose(this);
          this.isOpen = false;
          this.focusTrap();
        }
      }

      focusCatch(e) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
          focusArray[focusArray.length - 1].focus();
          e.preventDefault();
        }

        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
          focusArray[0].focus();
          e.preventDefault();
        }
      }

      focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        if (this.isOpen) {
          focusable[0].focus();
        } else {
          this.previousActiveElement.focus();
        }
      }

      disableScroll() {
        const pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = `${-pagePosition}px`;
      }

      enableScroll() {
        const pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
      }

      lockPadding() {
        const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
        this.fixBlocks.forEach((el) => {
          el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
      }

      unlockPadding() {
        this.fixBlocks.forEach((el) => {
          el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
      }
    }

    // eslint-disable-next-line no-unused-vars
    const modal = new Modal({});
  });
})();
