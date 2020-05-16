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

  let activePage;
  let shopItems = {
    'coffee1': {
      id: 'coffee1',
      name: 'Beans',
      desc: 'These are some delicious beans right here',
      price: 25,
      src: './assets/some-beans.jpg',
      alt: 'some roasted beans'
    }
  };

  /** Sets up pages and user interaction links and buttons. */
  function init() {
    activePage = 'home';
    let links = qsa('#page-nav a');
    links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        onPageNav(event.currentTarget);
      });
    });
    populateShop();
  }

  // Event listeners
  /** */
  function onBuy() {
    console.log(this.id);
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
   *
   * @param {object} item - Object with item information for building an item.
   */
  function createShopItem(item) {
    let card = gen('figure');
    let img = gen('img');
    let fig = createShopItemBody(item);
    card.classList.add('card');
    img.classList.add('card-img-top');
    img.src = item.src;
    img.alt = item.alt;
    card.appendChild(img);
    card.appendChild(fig);
    id('item-container').appendChild(card);
  }

  /**
   *
   * @param {object} item - Object with item information for building an item.
   * @return {object} The HTML figcation object for a shop item.
   */
  function createShopItemBody(item) {
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
    name.textContent = item.name;
    desc.textContent = item.description;
    price.textContent = `$${item.price}`;
    buyBtn.id = `${item.id}`;
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
    for (let i = 0; i < 5; i++) {
      shopItems[`coffee${i}`] = {
        id: `coffee${i}`,
        name: 'Beans',
        description: 'These are some delicious beans right here',
        price: 25,
        src: './assets/some-beans.jpg',
        alt: 'some roasted beans'
      };
    }
    for (let key in shopItems) {
      createShopItem(shopItems[key]);
    }
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