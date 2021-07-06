'use strict';

// ==================  Choosing user location  ================== //

const headerCityButton = document.querySelector('.header__city-button');

// If the key in 'lomoda-location' is not equal null or undefined,
// display the data of this key on the headerCityButton. 
// Else display 'Ваш город?'.
headerCityButton.textContent = localStorage.key('lomoda-location') ?
  localStorage.getItem('lomoda-location') : 'Ваш город?';

headerCityButton.addEventListener('click', () => {

  const city = prompt('Укажите ваш город', '');
  // If the value of 'city' is not null or undefined, 
  // assign this value to the variable. Else assign 'Ваш город?'.
  headerCityButton.textContent = city ? city : 'Ваш город?';

  localStorage.setItem('lomoda-location', city);
})

// ===============  End of Choosing user location  =============== //



// =========  Blocked and unblocked scroll of the page  ========= //

const disableScroll = () => {
  // Calculating the scroll width.
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  // Creating a new property inside the document body in which
  // writing the position of scrolling (window.scrollY).
  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
  position: fixed;
  /* Stopping of jumping content on height */
  top: ${-window.scrollY}px;
  left: 0;
  width: 100%;
  height: 100vh;
  /* Hiding the overflow. */
  overflow: hidden;
  /* Stopping of jumping content when the scroll line became hidden. */
  padding-right: ${widthScroll}px;
  `;
};

const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dbScrollY
  });
};

// ======  End of Blocked and unblocked scroll of the page  ====== //



// =======================  Modal window  ======================= //

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
};

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll();
};

// Open modal by clicking on the cart icon.
subheaderCart.addEventListener('click', cartModalOpen);

// Closing modal by clicking on cross or overlay area.
cartOverlay.addEventListener('click', event => {
  const target = event.target;

  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose();
  }
});

// Closing modal by clicking on Esc key.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (cartOverlay.matches('.cart-overlay-open')) {
      cartModalClose()
    }
  }
});

// =======================  End of Modal window  ======================= //
