var BTC2U = require('./index.js');

var publicBTC2U = new BTC2U();

// publicBTC2U.trades({currency: 'BTC', tid: '156371'}, console.log);
// publicBTC2U.ticker(console.log);
// publicBTC2U.order_book(console.log);
// publicBTC2U.eur_usd(console.log);

var key = 'key';
var secret = 'secret';
var privateBTC2U = new BTC2U(key, secret);

//    commented out for your protection
// privateBTC2U.balance(console.log);
privateBTC2U.orders('CANCELED', console.log); // OPEN para pendente, CANCELED para cancelada e EXECUTED para executada;
// privateBTC2U.order('881169', console.log);
