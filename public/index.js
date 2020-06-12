/**
 * Name: Justin Clayton
 * 
 * This is the main JavaScript document for the coffee store and contains all
 * the logic to navigate the 'pages' on index.html. It sets all the user
 * interface buttons and navigation and loads the store items from a GET
 * request to app.js. It allows for adding items to the cart and then
 * purchasing by making a POSt request to app.js.
 */
'use strict';
(function() {
  window.addEventListener('load', init);

  // Module global variables
  const ITEM_TYPES = {
    'c': 'coffee',
    'g': 'grinders',
    'b': 'brewers',
    'k': 'kettles',
    'm': 'mugs'
  };
  const MONEY = new Intl.NumberFormat(
    'en-US',
    {style: 'currency', currency: 'USD', minimumFractionDigits: 2}
  );
  let activePage = 'home';
  let currentFilter = 'all';
  let shopItems = {};
  let cartItems = {};
  let subtotal = 0;
  const TAX_RATE = 0.1;

  /** Sets up pages and user interaction links and buttons. */
  function init() {
    qsa('#page-nav a').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        onPageNav(event.currentTarget);
      });
    });
    qsa('.list-group-item').forEach(filterBtn => {
      filterBtn.addEventListener('click', onFilter);
    });
    populateShop();
    setDialogWindow();
  }

  // Event listeners
  /** Add an item to the cart when buy button is clicked. */
  function onBuy() {
    const COLOR_TIMER = 500;
    let item = this.id;
    if (cartItems[item]) {
      cartItems[item]++;
    } else {
      cartItems[item] = 1;
    }
    this.classList.remove('btn-primary');
    this.classList.add('btn-success');
    setTimeout(() => {
      this.classList.remove('btn-success');
      this.classList.add('btn-primary');
    }, COLOR_TIMER);
    id('cart-count').textContent = parseInt(id('cart-count').textContent) + 1;
    buildCartList();
  }

  /** Clear items in the cart. */
  function onClearCart() {
    cartItems = {};
    subtotal = 0;
    id('cart-count').textContent = 0;
    buildCartList();
  }

  /** Close the shopping cart dialog window. */
  function onCloseCheckout() {
    id('cart').removeAttribute('open');
  }

  /** Filter shown items when list is clicked. */
  function onFilter() {
    id(currentFilter).classList.remove('selected');
    currentFilter = this.id;
    id(currentFilter).classList.add('selected');
    let qsaFilter = (this.id === 'all') ? '.card' : `.${this.id}`;
    qsa('.card').forEach(card => {
      card.classList.add('hidden');
    });
    qsa(qsaFilter).forEach(filteredCard => {
      filteredCard.classList.remove('hidden');
    });
  }

  /** Handles opening the cart dialog. */
  function onOpenCart() {
    id('cart').setAttribute('open', "true");
  }

  /** Handles submitting the form for purchasing the items in the cart. */
  function onPay() {
    if (subtotal !== 0) {
      let params = new FormData(id('payment-form'));
      let expYear = parseInt(id('exp-year').value);
      let expMonth = parseInt(id('exp-month').value);
      params.append('total', subtotal * (1 + TAX_RATE));
      if (checkExpiredCard(expYear, expMonth)) {
        onCloseCheckout();
        fetch('/order', {method: 'POST', body: params})
          .then(checkStatus)
          .then(res => res.text())
          .then(handlePostRes)
          .catch(handleError);
      } else {
        let alert = createAlert('danger', 'Card is expired.');
        id('cart').insertBefore(alert, id('payment-form'));
      }
    } else {
      let alert = createAlert('warning', 'Please add items to the cart first.');
      id('cart').insertBefore(alert, id('payment-form'));
    }
  }

  /**
   * Controls which page is displayed to the user.
   * @param {object} link - The link that was clicked.
   */
  function onPageNav(link) {
    id(activePage).classList.remove('active');
    id(`${activePage}-page`).classList.add('hidden');
    link.classList.add('active');
    activePage = link.id;
    id(`${activePage}-page`).classList.remove('hidden');
  }

  // Website Helper Functions
  /**
   * Add all of the items to the card container, update the numbers of item
   * types
   */
  function addShopItems() {
    id('item-container').innerHTML = '';
    let total = 0;
    for (let type in shopItems) {
      let itemType = shopItems[type];
      for (let item in itemType) {
        let count = parseInt(id(`${type}-count`).textContent);
        id(`${type}-count`).textContent = count + 1;
        total++;
        createShopItem(item, type);
      }
    }
    id('all-count').textContent = total;
  }

  /** Build the list of items to purchase in the cart view. */
  function buildCartList() {
    let list = id('cart-list');
    list.innerHTML = '';
    subtotal = 0;
    for (let itemId in cartItems) {
      let listItem = createCartListItem(itemId);
      list.append(listItem);
    }
    let subAmount = MONEY.format(subtotal);
    let taxAmount = MONEY.format(subtotal * TAX_RATE);
    let totalAmount = MONEY.format(subtotal * (1 + TAX_RATE));
    let listSubtotal = createListItem(`Subtotal: ${subAmount}`);
    list.appendChild(listSubtotal);
    let tax = createListItem(`Tax (10%): ${taxAmount}`);
    list.appendChild(tax);
    let total = createListItem(`Total: ${totalAmount}`);
    list.appendChild(total);
  }

  /**
   * Checks whether a credit card has a valid card expiration date.
   * @param {number} expYear - The card expiration year to check.
   * @param {number} expMonth - The card expiration month to check.
   * @return {boolean} If the card is not expired.
   */
  function checkExpiredCard(expYear, expMonth) {
    const DATE = new Date();
    const MILLENNIA_OFFSET = 2000;
    const CURR_YEAR = DATE.getFullYear() - MILLENNIA_OFFSET;
    const CURR_MONTH = DATE.getMonth() + 1;
    let isValid1 = expYear > CURR_YEAR;
    let isValid2 = (expYear === CURR_YEAR && expMonth > CURR_MONTH);
    return isValid1 || isValid2;
  }

  /**
   * Clear out an alert from the DOM after a set time.
   * @param {object} alert - The object representing the alert to clear.
   */
  function clearAlert(alert) {
    alert.remove();
  }

  /**
   * Create a bootstrap style alert to display to the user.
   * @param {string} alertType - The style of alert to display.
   * @param {string} message - The message to display.
   * @return {object} - Div object representing an alert.
   */
  function createAlert(alertType, message) {
    let alert = gen('div');
    const DISPLAY_TIMER = 10000;
    alert.classList.add('alert');
    alert.classList.add(`alert-${alertType}`);
    alert.textContent = message;
    setTimeout(() => {
      clearAlert(alert);
    }, DISPLAY_TIMER);
    return alert;
  }

  /**
   * Builds one list item for the cart view.
   * @param {string} itemId - The item id to add to the list.
   * @return {object} HTML li element object.
   */
  function createCartListItem(itemId) {
    let itemQuantity = cartItems[itemId];
    let itemType = ITEM_TYPES[itemId[0]];
    let item = shopItems[itemType][itemId];
    let price = itemQuantity * item.price;
    subtotal += price;
    let text = `${item.name} (${itemQuantity}): ${MONEY.format(price)}`;
    let li = createListItem(text);
    return li;
  }

  /**
   * Builds a generic list item with given text content.
   * @param {string} text - Text to put in the list item.
   * @return {object} HTML li element object.
   */
  function createListItem(text) {
    let li = gen('li');
    li.classList.add('list-group-item');
    li.textContent = text;
    return li;
  }

  /**
   * Create one store item card adding all the needed data to display.
   * @param {string} item - String of item id for current item.
   * @param {string} type - The type of item for filtering.
   */
  function createShopItem(item, type) {
    let itemData = shopItems[type][item];
    let card = gen('figure');
    let img = gen('img');
    let fig = createShopItemBody(item, itemData);
    card.classList.add('card');
    card.classList.add(type);
    card.id = item;
    img.classList.add('card-img-top');
    img.src = itemData.src;
    img.alt = itemData.alt;
    card.appendChild(img);
    card.appendChild(fig);
    id('item-container').appendChild(card);
  }

  /**
   * Create the body of an item card using the data retrieved.
   * @param {string} item - String of item id for current item.
   * @param {object} itemData - Object with item information for building item.
   * @return {object} The HTML figcation object for a shop item.
   */
  function createShopItemBody(item, itemData) {
    let fig = gen('figcaption');
    let name = gen('h3');
    let desc = gen('p');
    let price = gen('p');
    let buyBtn = gen('button');
    fig.classList.add('card-body');
    name.classList.add('card-title');
    desc.classList.add('card-text');
    price.classList.add('card-text');
    buyBtn.classList.add('btn');
    buyBtn.classList.add('btn-primary');
    name.textContent = itemData.name;
    desc.textContent = itemData.desc;
    price.textContent = `$${itemData.price}`;
    buyBtn.id = `${item}`;
    buyBtn.textContent = 'Add to cart';
    buyBtn.addEventListener('click', onBuy);
    fig.appendChild(name);
    fig.appendChild(desc);
    fig.appendChild(price);
    fig.appendChild(buyBtn);
    return fig;
  }

  /**
   * If an error occurs from GET/POST request.
   * @param {string} error - Error from response.
   */
  function handleError(error) {
    let alert = createAlert('danger', error.message);
    qs('main').prepend(alert);
  }

  /**
   * When a post request is made to the
   * @param {string} res - The text message from the server.
   */
  function handlePostRes(res) {
    onClearCart();
    let alert = createAlert('success', res);
    qs('main').prepend(alert);
  }

  /** Request current inventory data from store endpoint on server. */
  function populateShop() {
    fetch('/store')
      .then(checkStatus)
      .then(res => res.json())
      .then(data => {
        shopItems = data;
      })
      .then(addShopItems)
      .catch(handleError);
  }

  /** Set up the event listeners for the dialog windows. */
  function setDialogWindow() {
    id('cart-btn').addEventListener('click', onOpenCart);
    id('clear-cart-btn').addEventListener('click', onClearCart);
    id('close-checkout-btn').addEventListener('click', (event) => {
      event.preventDefault();
      onCloseCheckout();
    });
    id('payment-form').addEventListener('submit', (event) => {
      event.preventDefault();
      onPay();
    });
    buildCartList();
  }

  // Given Helper functions
  /**
   * Check whether fetch returned a status of 200 OK, throw an error if not.
   * @param {object} response - The response object from the API for the GET request.
   * @returns {object} Returns the response if ok, otherwise throws error.
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);
  }

  /**
   * Returns the a newly created DOM element of given tag.
   * @param {string} tagName - HTML tag to be created.
   * @returns {object} - DOM object of new element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} elId - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(elId) {
    return document.getElementById(elId);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();
