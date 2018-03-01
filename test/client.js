$(document).ready(function(){
  var data = scrapis({
    name:     'h1, eq:0, text',
    desc:     'p, eq:1, text',
    title:    'title',
    button:   [ 'button.navbar-toggle.collapsed', 'attr:data-target' ],
    markets:  [ 'table#currencies-all tbody tr', 'slice:5', {
      name: 'td.currency-name span.currency-symbol a',
      price: {
        btc: 'td a.price, attr:data-btc',
        usd: 'td a.price, attr:data-usd',
      }
    }]
  }, $);
  console.log(data);
});
