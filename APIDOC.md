# PF Roasting Store API
This API is designed to be used as a store front for an imaginary coffee
roasting company trying to sell their wares. It allows for displaying available
inventory from a json file and stores orders made by users from their client
side webpage.

## Get all available store items.
**Request Format:** /store

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns JSON object containing objects representing the stores
inventory.

**Example Request:** /store

**Example Response:**
```
{
  "coffee": {
    "c1": {
      "name": "French Roast",
      "desc": "A traditional dark roast; smokey and sweet",
      "price": 16,
      "src": "./assets/french-roast.png",
      "alt": "bag of french roast coffee"
    },
  },
  "mug": {
    "m1": {
      "name": "Metropole Mug",
      "desc": "Mug from the Metropole hotel in Hanoi, Vietnam",
      "price": 14.99,
      "src": "./assets/hanoi-mug.png",
      "alt": "black coffee mug"
    }
  }
}
```

**Error Handling:**
- Possible 500 server error if there is an issue reading json data from file.


## Add an order for items
**Request Format:** /order endpoint with POST parameters of `user`, `name`, `address`,
  `card-number`, `exp-month`, `exp-year`, `cvc`, `total`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds an order made by user, returns a text response on if order was created.

**Example Request:** /order with post parameters `user=jc`, `name=justin`, `address='a place'`,
  `card-number=1234567812345678`, `exp-month=11`, `exp-year=21`, `cvc=123`, `total=22.99`

**Example Response:**
```
'Order submitted. Thank you for ordering.'
or
'Order not complete. Missing required information.'
```

**Error Handling:**
- Possible 400 if bad or no data is given for POST paramaters.
