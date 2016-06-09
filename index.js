var https = require('https'),
    _ = require('lodash');



var BTC2U = function(key, secret, client_id) {
  this.key = key;
  this.secret = secret;
  this.client_id = client_id;
}
