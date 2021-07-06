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

// ==================  End of Choosing user location  ================== //
