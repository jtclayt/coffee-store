/**
 * Name: Justin Clayton
 * Date: May 3, 2020
 * Section: CSE 154 AD
 * This is the main JavaScript document for the CP3 webpage and contains all the logic to fetch
 * requested songs from the lyrics API. It handles errors if the song can not be found or a fetch
 * error occurs and if the user tries to make repeat requests. This page also handles setting up
 * the bar chart visulisation which is continuously updated on successful requests. When a request
 * is processed a card detailing the received data is dynamically generated or updated to display
 * some information to the user.
 */
'use strict';
(function() {
  window.addEventListener('load', init);

  let activePage = 'home';
  let currentFilter = 'all';
  let shopItems = {};

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
  }

  // Event listeners
  /** Add an item to the cart when buy button is clicked. */
  function onBuy() {
    console.log(this.id);
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
  /** */
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

  /**
   *
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
   *
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

  /** */
  function populateShop() {
    fetch('/store')
      .then(checkStatus)
      .then(res => res.json())
      .then(data => shopItems = data)
      .then(addShopItems)
      .catch(console.error);
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