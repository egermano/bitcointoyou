var BTC2U = require('./index.js');

var publicBTC2U = new BTC2U();

publicBTC2U.trades({currency: 'BTC', tid: '156371'}, console.log);
// publicBTC2U.ticker(console.log);
// publicBTC2U.order_book(console.log);
// publicBTC2U.eur_usd(console.log);

// var key = 'your key';
// var secret = 'your secret';
// var client_id = '0'; // your BTC2U user ID
// var privateBTC2U = new Bitstamp(key, secret, client_id);

//    commented out for your protection

// privateBTC2U.balance(console.log);
// privateBTC2U.user_transactions(100, console.log);
// privateBTC2U.open_orders(console.log);
// privateBTC2U.cancel_order(id, console.log);
// privateBTC2U.buy(amount, price, console.log);
// privateBTC2U.sell(amount, price, console.log);
// privateBTC2U.withdrawal_requests(console.log);
// privateBTC2U.bitcoin_withdrawal(amount, address, console.log);
// privateBTC2U.bitcoin_deposit_address(console.log);
// privateBTC2U.unconfirmed_btc(console.log())
// privateBTC2U.ripple_withdrawal(amount, address, currency)
// privateBTC2U.ripple_address(console.log)


//		Bistamp is currently (Thu Oct 31 13:54:19 CET 2013)
//		returning 404's when doing these calls

// privateBTC2U.create_code(usd, btc, console.log);
// privateBTC2U.check_code(code, console.log);
// privateBTC2U.redeem_code(code, console.log);

//    Bistamp is currently (Tue Aug 26 19:31:55 CEST 2014)
//    returning 404's when doing these calls

// publicBTC2U.bitinstant(console.log);
