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



// =======================  Modal window  ======================= //

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
}

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
}

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', event => {
  const target = event.target;

  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose();
  }
})

// =======================  End of Modal window  ======================= //
