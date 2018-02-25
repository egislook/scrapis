const cheerio   = require('cheerio');
const fs        = require('fs');
const scrapis   = require('../scrapis.js');

function test(html){
  html = html || fs.readFileSync('./test/test.html', 'utf8');
  let schema = {
    name:     'h1, eq:0, text, trim',
    desc:     'p, eq:1, text, trim',
    title:    'title',
    button:   [ 'button.navbar-toggle.collapsed', 'attr:data-target' ],
    markets:  [ 'table#currencies-all tbody tr', 'slice:5', {
      name: 'td.currency-name span.currency-symbol a',
      price: {
        btc: 'td a.price, attr:data-btc',
        usd: 'td a.price, attr:data-usd',
      }
    }]
  };
  let data = scrapis(schema, cheerio.load(html));
  return Promise.resolve({ ok: true, schema, data });
}

module.exports = test;
