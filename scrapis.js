function scrapis(schemas, $, root){
  var data = {};
  for(var key in schemas){
    data[key] = getValues(schemas[key], $, root)
  }

  return data;

  function getValues(schema, $, elem){
    schema = cloneSchema(schema);

    // if its structural object
    if(schema.constructor === Object && !schema.selector)
      return scrapis(schema, $, elem);
    // it can be object or array of schemas
    schema = schema.selector && schema || {
      selector:  typeof schema === 'string' && schema   || schema.shift(),
      functions: !schema.length && ['text', 'trim']     || schema.filter(function(fn){ return typeof fn === 'string' }),
      children:  typeof schema !== 'string' && schema.find(function(fn){ return typeof fn === 'object' }),
    };

    // splits function values if they have arguments
    schema.functions = schema.functions.map(function(fn){ return fn.indexOf(':') && fn.split(':') }); //.map(v => v.split(','))
    // get selector or finds the element
    schema.selector = elem ? $(elem).find(schema.selector) : $(schema.selector);
    // gets the value using functions
    elem = schema.functions.length
      ? schema.functions.reduce(reducer, schema.selector)
      : schema.selector;
    // returns childless value
    if(!schema.children)
      return elem;
    // gets deeper children values
    return elem.map(function(i, el){ return scrapis(schema.children, $, el) }).get();
  }

  function reducer(val, fn){
    var fnName = fn[0];
    var fnArgs = fn[1];
    if(fnName === 'slice' && parseInt(fnArgs) > 0)
      return val[fnName](0, fnArgs);

    return val[fnName](fnArgs);
  }

  function cloneSchema(schema){
    if(typeof schema === 'string')
      schema = schema.split(',').map(function(v){ return v.trim() });
    if(schema instanceof Object)
      return JSON.parse(JSON.stringify(schema));
    if(schema instanceof Array)
      return schema.filter();
    return schema;
  }
}

if(typeof module === 'object')
  module.exports = scrapis;
