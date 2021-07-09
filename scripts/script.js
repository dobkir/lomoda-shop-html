'use strict';

// ==================  Choosing user location  ================== //

const headerCityButton = document.querySelector('.header__city-button');

// Define the location: #women, #men, or #kids. Without hash (#).
let hash = location.hash.substring(1);

// If the key in 'lomoda-location' is not equal null or undefined,
// display the data of this key on the headerCityButton. 
// Else display 'Ваш город?'.
headerCityButton.textContent = localStorage.getItem('lomoda-location') ?
  localStorage.getItem('lomoda-location') : 'Ваш город?';

headerCityButton.addEventListener('click', () => {

  const city = prompt('Укажите ваш город', '').trim();
  // If the value of 'city' is not null or undefined, 
  // assign this value to the variable. Else assign 'Ваш город?'.
  headerCityButton.textContent = city ? city : 'Ваш город?';
  localStorage.setItem('lomoda-location', city);
})

// ===============  End of Choosing user location  =============== //



// =========  Blocked and unblocked scroll of the page  ========= //

const disableScroll = () => {
  // The Scroll should not recalculate the width.
  if (document.disableScroll) return;
  // Calculating the scroll width.
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  // When function disabledScroll() is active, parameter disabledScroll is true.
  document.disabledScroll = true;

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
  // When function disabledScroll() is active, parameter disabledScroll is false.
  document.disabledScroll = true;

  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dbScrollY
  });
};

// ======  End of Blocked and unblocked scroll of the page  ====== //




// =======================  Product cart  ======================= //

// Getting data from an array of objects
const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];

// Storing data in an array of objects in local storage
const setLocalStorage = data => localStorage.setItem('cart-lomoda', JSON.stringify(data));

// Writting on the variable the list of goods
const cartListGoods = document.querySelector('.cart__list-goods');

// Writting on the variable the total cost
const cartTotalCost = document.querySelector('.cart__total-cost');

// The action of cart rendering
const renderCart = () => {
  cartListGoods.textContent = '';

  const cartItems = getLocalStorage();

  let totalPrice = 0;

  cartItems.forEach((item, index) => {

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.brand} ${item.name}</td>
      ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
      ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
      <td>${item.cost} &#8381;</td>
      <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
    `;

    totalPrice += item.cost;

    cartListGoods.append(tr);
  });

  cartTotalCost.textContent = totalPrice + ' ₽';
}

const deleteItemCart = id => {
  const cartItems = getLocalStorage();
  const newCartItems = cartItems.filter(item => item.id != id);
  setLocalStorage(newCartItems);
}

cartListGoods.addEventListener('click', event => {
  if (event.target.matches('.btn-delete')) {
    deleteItemCart(event.target.dataset.id);
    renderCart();
  }
});

// =====================  End Product cart  ===================== //



// ================  Modal window (product cart) ================ //

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
  renderCart();
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

// =============  End of Modal window (product cart)  ============= //



// =======================  Database query  ======================= //

// Fetching data from the server.
const getData = async (database) => {
  const data = await fetch(database);

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
  }
}

// The parameter 'prop' is needed for display or data response on goods.html
// or data response on card-good.html
const getGoods = (callback, prop, value) => {
  getData('db.json')
    .then(data => {
      // After data are fetching, started the callback function.
      // The category of an item must be matched with the hash (#women, #men, or #kids).
      if (value) {
        callback(data.filter(item => item[prop] === value))
      } else {
        // For such a case, when needed to get all items from the database.
        callback(data);
      }
    })
    // If data have an error, catch it and display an error message in the modal window.
    .catch(err => {
      throw console.warn(err);
      // alert('Внимание! Если данные не загрузились, попробуйте повторить запрос позже.');
    });
};

// ====================  End of Database query  ==================== //



// =============  Display data response on goods.html  ============= //

try {
  const goodsList = document.querySelector('.goods__list');

  // if it's not goods.html throw an exception
  if (!goodsList) {
    throw 'This is not a goods page!'
  }

  // Changing 'goods__title' when changing the location (#women, #men, or #kids)
  const goodsTitle = document.querySelector('.goods__title');

  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  }

  // The action of the creation of a product card on the page goodst.html
  // Using the destructuring method, we get the element variables from the data.
  // Variables from data items.
  // const { id, preview, cost, brand, name, sizes } = data;
  const createCard = ({ id, preview, cost, brand, name, sizes }) => {

    // The creating of a product card on the page.
    const li = document.createElement('li');

    li.classList.add('goods__item');

    li.innerHTML = `
    <article class="good">
      <a class="good__link-img" href="card-good.html#${id}">
          <img class="good__img" src="goods-image/${preview}" alt="">
      </a>
      <div class="good__description">
          <p class="good__price">${cost} &#8381;</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>

          <!-- Checking whether the data element has a "sizes" property? -->
          ${sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : ''}

          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
      </div>
    </article>
    `;

    return li;
  };

  const renderGoodsList = data => {
    // Clearing the page content before adding fetching data as goods__item.
    goodsList.textContent = '';

    // Iterating over data. Each item from the data array must be appended into goods.html.
    data.forEach(item => {
      const card = createCard(item);
      goodsList.append(card);
    })
  };

  // When location hash has been changed(from #women to #men, for instance), 
  // items must be reloading by hash matches.
  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, 'category', hash);

    // Activating the function, which changed 'goods__title' when changing the location (#women, #men, or #kids)
    changeTitle();
  })

  // Activating the function, which changed 'goods__title' when changing the location (#women, #men, or #kids)
  changeTitle();
  // After data are fetching, started the function renderGoodsList().
  getGoods(renderGoodsList, 'category', hash);

} catch (err) {
  console.warn(err);
}

// ========== End od Display data response on goods.html  ========== //



// =============  Display data response on card-good.html  ============= //

try {
  if (!document.querySelector('.card-good')) {
    throw 'This is not a card-good-page';
  }

  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodBuy = document.querySelector('.card-good__buy');

  const generatedList = data => data.reduce((html, item, index) => html +
    `<li class="card-good__select-item" data-id="${index}">${item}</li>`, '');

  const renderCardGood = ([{ id, brand, name, cost, color, sizes, photo }]) => {

    // Creation of an object for rendering a product cart
    const data = { brand, name, cost, id };

    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;
    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generatedList(color);
    } else {
      cardGoodColor.style.display = 'none';
    }
    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generatedList(sizes);
    } else {
      cardGoodSizes.style.display = 'none';
    }

    if (getLocalStorage().some(item => item.id === id)) {
      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';
    }

    // Sending values to the goods cart
    cardGoodBuy.addEventListener('click', () => {
      if (cardGoodBuy.classList.contains('delete')) {
        deleteItemCart(id);
        cardGoodBuy.classList.remove('delete');
        cardGoodBuy.textContent = 'Добавить в корзину';
        return;
      }

      if (color) data.color = cardGoodColor.textContent;
      if (color) data.size = cardGoodSizes.textContent;

      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';

      // Getting actual data from the local storage
      const cardData = getLocalStorage();
      // Pushing into the gettings data new data.
      cardData.push(data);
      // Setting new data to the local storage
      setLocalStorage(cardData);
    });
  };

  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', event => {
      const target = event.target;

      if (target.closest('.card-good__select')) {
        target.classList.toggle('card-good__select__open');
      }

      if (target.closest('.card-good__select-item')) {
        const cardGoodSelect = item.querySelector('.card-good__select');
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
        cardGoodSelect.classList.remove('card-good__select__open');
      }
    });
  });

  getGoods(renderCardGood, 'id', hash);

} catch (err) {
  console.warn(err);
}

// ==========  End of Display data response on cardgood.html  ========== //