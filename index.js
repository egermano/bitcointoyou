var https = require('https'),
    querystring = require('querystring'),
    crypto = require('crypto-js'),
    _ = require('lodash');

_.mixin({
  // compact for objects
  compactObject: function(to_clean) {
    _.map(to_clean, function(value, key, to_clean) {
      if (value === undefined)
        delete to_clean[key];
    });
    return to_clean;
  }
});

var BTC2U = function(key, secret) {
  this.key = key;
  this.secret = secret;
}

BTC2U.prototype._request = function(method, path, data, callback, args) {

  var that = this;

  var options = {
    host: 'www.bitcointoyou.com',
    path: path,
    method: method,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; BTC2U node.js client)'
    }
  };

  if(method === 'post') {
    options.headers['Content-Length'] = data.length;
    options.headers['content-type'] = 'application/x-www-form-urlencoded';

    var nonce = this._generateNonce();
    var message = nonce + this.key;
    var signature = crypto.enc.Base64.stringify(crypto.HmacSHA256(message, this.secret)).toUpperCase();

    options.headers['key'] = this.key;
    options.headers['signature'] = signature;
    options.headers['nonce'] = nonce;
  }

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(temp) {
      buffer += temp;
    });

    res.on('end', function() {
      if (res.statusCode !== 200) {
        return callback(new Error('BTC2U error ' + res.statusCode + ': ' + buffer));
      }
      try {
        var json = that._parseResponse(buffer);
      } catch (err) {
        return callback('Parse Error: ' + err);
      }
      callback(null, json);
    });
  });

  req.on('error', function(err) {
    callback(err);
  });

  req.on('socket', function (socket) {
    socket.setTimeout(5000);
    socket.on('timeout', function() {
      req.abort();
    });
    socket.on('error', function(err) {
      callback(err);
    });
  });

  req.end(data);

}

BTC2U.prototype._generateNonce = function() {
  var now = new Date().getTime();

  if(now !== this.last)
    this.nonceIncr = -1;

  this.last = now;
  this.nonceIncr++;

  // add padding to nonce incr
  // @link https://stackoverflow.com/questions/6823592/numbers-in-the-form-of-001
  var padding =
    this.nonceIncr < 10 ? '000' :
      this.nonceIncr < 100 ? '00' :
        this.nonceIncr < 1000 ?  '0' : '';
  return now + padding + this.nonceIncr;
}

BTC2U.prototype._get = function(action, callback, args) {
  args = _.compactObject(args);
  var path = '/api/' + action + (querystring.stringify(args) === '' ? '/' : '/?') + querystring.stringify(args);
  this._request('get', path, undefined, callback, args)
}

BTC2U.prototype._post = function(action, callback, args) {
  if(!this.key || !this.secret)
    return callback(new Error('Must provide key and secret to make this API request.'));

  var path = '/api/' + action + '/';

  args = _.compactObject(args);
  var data = querystring.stringify(args);

  this._request('post', path, data, callback, args);
}

BTC2U.prototype._parseResponse = function(buffer) {
  var json = JSON.parse(buffer);

  if (!(json.success*1)) {
    throw new Error('BTC2U error - ' + json.error);

    return false;
  } else {
    return json.oReturn;
  }
}

// Public

BTC2U.prototype.ticker = function(callback) {
  this._get('ticker.aspx', callback);
}

BTC2U.prototype.order_book = function(callback) {
  this._get('orderbook.aspx', callback);
}

BTC2U.prototype.trades = function(options, callback) {
  if(!callback) {
    callback = options;
    options = undefined;
  }
  this._get('trades.aspx', callback, options);
}

// Private

BTC2U.prototype.balance = function(callback) {
  this._post('balance.aspx', callback, {});
}

BTC2U.prototype.orders = function(status, callback) {
  this._post('getorders.aspx', callback, {'status': status});
}

BTC2U.prototype.order = function(id, callback) {
  this._post('getordersid.aspx', callback, {'id': id});
}

module.exports = BTC2U;
