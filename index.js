var https = require('https'),
    querystring = require('querystring'),
    _ = require('lodash');



var BTC2U = function(key, secret, client_id) {
  this.key = key;
  this.secret = secret;
  this.client_id = client_id;
}

BTC2U.prototype._request = function(method, path, data, callback, args) {

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
  }

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(data) {
      buffer += data;
    });
    res.on('end', function() {
      if (res.statusCode !== 200) {
        return callback(new Error('Bitstamp error ' + res.statusCode + ': ' + buffer));
      }
      try {
        var json = JSON.parse(buffer);
      } catch (err) {
        return callback(err);
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
  args = _.compact(args);
  var path = '/api/' + action + (querystring.stringify(args) === '' ? '/' : '/?') + querystring.stringify(args);
  this._request('get', path, undefined, callback, args)
}

BTC2U.prototype._post = function(action, callback, args) {
  if(!this.key || !this.secret || !this.client_id)
    return callback(new Error('Must provide key, secret and client ID to make this API request.'));

  var path = '/api/' + action + '/';

  var nonce = this._generateNonce();
  var message = nonce + this.client_id + this.key;
  var signer = crypto.createHmac('sha256', new Buffer(this.secret, 'utf8'));
  var signature = signer.update(message).digest('hex').toUpperCase();

  args = _.extend({
    key: this.key,
    signature: signature,
    nonce: nonce
  }, args);

  args = _.compactObject(args);
  var data = querystring.stringify(args);

  this._request('post', path, data, callback, args);
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

module.exports = BTC2U;
